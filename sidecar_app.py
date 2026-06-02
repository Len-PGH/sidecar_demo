#!/usr/bin/env python3
"""
Sidecar Sales Copilot — elaborate test app for SignalWire's <ai_sidecar> verb.

The sidecar attaches to a live call as a passive observer: it transcribes both
legs, feeds turns to an LLM along with a sales-coach prompt and a small toolbox,
and emits structured advice events to this app over a webhook. The agent on the
call hears nothing from the sidecar — only the events stream into your UI/CRM.

What this app does:
  * Serves the SWML document SignalWire fetches when the call answers.
  * Hosts the SWAIG webhook so the sidecar's LLM can call our tools.
  * Hosts an event endpoint that pretty-prints every sidecar event to stdout.

Run it:
  source .venv/bin/activate
  cp .env.example .env  &&  edit .env
  python sidecar_app.py --public-url https://<your-tunnel> --from +1... --to +1...

We subclass AgentBase to inherit its SWAIG webhook, token validation, and
function-dispatch plumbing, but override _render_swml to emit an `ai_sidecar`
verb instead of the default `ai` verb (the sidecar is an observer, not a TTS
agent).
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import secrets
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlparse

from dotenv import load_dotenv
from fastapi import (
    Depends, HTTPException, Request, WebSocket, WebSocketDisconnect, status,
)
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles

from signalwire import AgentBase, FunctionResult

import cdr_store
import live_data
import sample_data
from signalwire_rest import SignalWireError, SignalWireREST


# ---------------------------------------------------------------------------
# UI authentication
#
# /token and /ws/events host the live sales-coach event stream and mint
# subscriber tokens that grant SignalWire-relay privileges. Both endpoints
# must be gated; the SWML/SWAIG basic-auth env vars are for the executor
# webhooks, not for the browser UI.
#
# SIDECAR_UI_PASSWORD is required to enable /token at all — when unset the
# endpoint refuses with 503 so a misconfigured deployment can't accidentally
# leave it open.
# ---------------------------------------------------------------------------

SIDECAR_UI_USER = os.environ.get("SIDECAR_UI_USER", "admin")
SIDECAR_UI_PASSWORD = os.environ.get("SIDECAR_UI_PASSWORD", "")
_ui_basic = HTTPBasic(auto_error=False)


def _ui_auth_required(creds: HTTPBasicCredentials = Depends(_ui_basic)) -> bool:
    if not SIDECAR_UI_PASSWORD:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "UI auth disabled: set SIDECAR_UI_PASSWORD in env to enable /token.",
        )
    if (creds is None
            or not secrets.compare_digest(creds.username, SIDECAR_UI_USER)
            or not secrets.compare_digest(creds.password, SIDECAR_UI_PASSWORD)):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "invalid_credentials",
            headers={"WWW-Authenticate": 'Basic realm="sidecar-ui"'},
        )
    return True


SIDECAR_PROMPT = """\
You are a real-time sales copilot whispering to the rep on a live customer call.
The CUSTOMER never sees or hears your output. The REP does.

You are paid to add value on EVERY customer turn. Silence is the failure mode.
Your default is to produce an `insight`. `sidecar_skip` is a narrow exception.

# Output channels

  - `insight` — ONE telegraphic sentence shown to the rep. No greeting, no
    preamble, no sign-off. Imperative voice ("Anchor on TCO, not seat cost.").
  - `sidecar_skip` — silent. ONLY allowed when the customer's last turn falls
    into one of these four buckets and NOTHING else:
      1. Pure acknowledgement: "ok", "right", "uh-huh", "got it", "yeah".
      2. The REP is speaking (not the customer).
      3. Silence / background noise / unintelligible.
      4. The customer was responding to a yes/no question with just yes/no
         and the rep already has the context they need.

If the customer's turn is a question, statement of fact, complaint, signal,
or anything substantive — it is ACTIONABLE. Emit an insight. "Not relevant
to sales" is NOT a valid skip reason. Vague is fine; useless is not.

When in doubt: insight, not skip.

# THE PAIRING RULE — read this twice

Every time you call any tool other than `sidecar_skip`, the VERY NEXT thing
you emit on the SAME tick MUST be an `insight`. No exceptions.

  - tool call → insight                ✅
  - tool call → sidecar_skip           ❌ NEVER. Bug.
  - tool call → (nothing)              ❌ Bug.
  - tool call → tool call → insight    ❌ Insight comes after EACH tool.

The tool's `response` field is your raw material. Take the part that tells
the rep what to do or say, compress it to ONE sentence, and emit it as an
`insight`. If the tool's response already contains a "Say: <quote>" or a
"suggested_rebuttal" line, that quote IS the insight — emit it verbatim.

# Hard rule: no skip streaks

If your previous emission was `sidecar_skip`, the current one MUST NOT be
`sidecar_skip`. Even on a slow patch of the call, find SOMETHING:

  - Echo a fact the customer said back as confirmation ("Confirm: 50 seats,
    Q3 timeline.").
  - Predict the next objection or question and prime the rep ("Pricing
    question incoming — anchor on TCO.").
  - Suggest a discovery question the rep should ask next ("Ask: who else
    is evaluating this decision?").
  - Surface what's NOT being said ("No urgency signal yet — probe timeline.").

Two consecutive `sidecar_skip` calls is a defect. Three is a critical bug.

# When to use which tool

  - Competitor mentioned by name → `lookup_competitor` → insight with the
    talking point from the response.
  - Account, contract, or "what do I have" → `get_account_status` → insight
    summarising what's relevant + the next move.
  - Timeline / budget / authority / urgency signal → `flag_buying_signal` →
    insight on how to advance (close, propose next step, escalate).
  - Pushback on price, features, contract, timing, vendor risk, or technical
    fit → `log_objection` → insight with the verbatim rebuttal from the
    tool response.
  - Interested but not ready → `schedule_followup` → insight confirming the
    next step the rep should propose.
  - Compliance risk, hostility, or deal-saving moment → `escalate_to_supervisor`
    → insight telling the rep what's happening + what to say to buy time.

# Examples — borderline customer turns and the required insight

  - "How does your pricing work?" → insight: "Anchor on TCO before naming a number — ask their team size and use case first."
  - "We're already using ACME." → `lookup_competitor` → insight verbatim from response.
  - "I need to check with my team." → insight: "Soft stall — ask who else is in the decision and offer to run a joint demo."
  - "Tell me more about that." → insight: "Open-ended invitation — pick the strongest differentiator for their stack and go deep."
  - "Is it expensive?" → insight: "Price probe — don't quote, get use case and seat count first."
  - "Hmm, I see." → `sidecar_skip` (pure acknowledgement, bucket 1).

# Hard rules

  - Never invent account or competitor data. Only use what the tools return.
  - Never narrate yourself ("I will now…"). Just emit the insight.

# Self-check before every emission

Before you emit, ask yourself two things in order:
  1. Did I just call a tool whose response could become an insight? If yes,
     the next emission MUST be that insight.
  2. Is my last emission also a `sidecar_skip`? If yes, I CANNOT skip again
     — I must emit an insight, even a basic discovery-question prompt.
"""


# ASR hints — biases the speech recognizer toward known proper nouns and
# domain jargon that prior CDR runs have shown getting mangled (most
# famously "ACME" → "acne" on call 6c7d7a5d). Keep the list short — every
# token costs the recognizer a small amount of attention.
def _build_asr_hints() -> list[str]:
    """Assemble the ASR bias vocabulary from the local CRM + a short jargon
    list. Pulled at module load so updates to sample_data ship with the
    next container rebuild without a hand edit."""
    hints: list[str] = []
    # Competitor names — both stored uppercase form and a title-cased form,
    # since the recognizer is more likely to emit natural casing.
    for k in sample_data.COMPETITORS.keys():
        hints.append(k)
        # Hyphenated names get a spaced variant ("Massive Dynamic")
        spaced = k.replace("-", " ").title()
        if spaced != k:
            hints.append(spaced)
        else:
            hints.append(k.title())
    # Account / company names from the CRM.
    for rec in sample_data.ACCOUNTS.values():
        name = rec.get("name")
        if name:
            hints.append(name)
    # Domain jargon the rep + customer commonly say.
    hints.extend([
        "TCO", "SSO", "FedRAMP", "SOC2", "HIPAA",
        "MRR", "NPS", "SLA", "OPEX", "CAPEX",
        "renewal", "procurement", "pricing", "onboarding",
        "demo", "kickoff", "pipeline", "discovery",
    ])
    # De-dup while preserving order.
    seen: set[str] = set()
    out: list[str] = []
    for h in hints:
        if h not in seen:
            seen.add(h)
            out.append(h)
    return out


SIDECAR_ASR_HINTS = _build_asr_hints()


class _AudioHub:
    """One hub instance per active call. Buffers μ-law frames coming in
    from SignalWire's `tap` WebSocket, and broadcasts them to any number
    of browser subscribers.

    Frames are opaque binary blobs (PCMU 8 kHz mono, 160 bytes / 20 ms by
    default). We don't decode here — the browser does — so each frame is
    just `bytes` on the wire.

    Backpressure: each subscriber gets its own bounded asyncio.Queue. If a
    subscriber falls behind, the oldest frame is dropped rather than
    blocking the producer. Voice tolerates occasional drops far better
    than the source stalling for everyone.
    """
    # ~1.25 s of audio (8 kHz / 20 ms = 50 frames/s; 64 keeps it under 1.3 s
    # even at default ptime). If a listener can't drain at 50 fps, the queue
    # fills and we drop oldest — but the source keeps flowing for everyone.
    SUB_QUEUE_MAX = 64

    def __init__(self):
        self._lock = asyncio.Lock()
        self._subscribers: set[asyncio.Queue[bytes]] = set()
        self._frame_count = 0  # for diagnostics
        self._tap_ws: WebSocket | None = None

    def subscriber_count(self) -> int:
        return len(self._subscribers)

    async def attach_tap(self, ws: WebSocket) -> None:
        """Bind the SignalWire-side tap WS. Only one tap per hub."""
        async with self._lock:
            self._tap_ws = ws

    async def broadcast(self, frame: bytes) -> None:
        self._frame_count += 1
        for q in tuple(self._subscribers):
            if q.full():
                try:
                    q.get_nowait()
                except asyncio.QueueEmpty:
                    pass
            try:
                q.put_nowait(frame)
            except asyncio.QueueFull:
                # Race with another consumer drained-and-refilled — give up
                # rather than block. Voice tolerates a frame drop.
                pass

    async def subscribe(self) -> asyncio.Queue[bytes]:
        q: asyncio.Queue[bytes] = asyncio.Queue(maxsize=self.SUB_QUEUE_MAX)
        async with self._lock:
            self._subscribers.add(q)
        return q

    async def unsubscribe(self, q: asyncio.Queue[bytes]) -> None:
        async with self._lock:
            self._subscribers.discard(q)


class SidecarSalesCopilot(AgentBase):
    """SWML host (ai_sidecar verb) + SWAIG webhook + sidecar event sink."""

    def __init__(
        self,
        public_url: str,
        from_number: str,
        to_number: str,
        # Which leg is the customer. Default is "local-caller" because in this
        # app's call shape the REP dials INTO the sidecar address (becoming
        # the "remote-caller" leg from the SWML's perspective), and the SWML's
        # `connect` verb dials OUT to the customer (the "local-caller" leg).
        # Override to "remote-caller" only if you flip the call direction
        # (e.g. the customer dials in and the rep is connected to).
        customer_role: str = "local-caller",
        model: str = "gpt-4o-mini",
        host: str = "0.0.0.0",
        port: int = 3000,
        route: str = "/sidecar",
        basic_auth: tuple[str, str] | None = None,
        signalwire: SignalWireREST | None = None,
        resource_name: str = "sidecar-copilot",
    ) -> None:
        super().__init__(
            name="sidecar-sales-copilot",
            route=route,
            host=host,
            port=port,
            basic_auth=basic_auth,
            use_pom=False,
            auto_answer=False,
            suppress_logs=False,
        )

        self.public_url = public_url.rstrip("/")
        self.from_number = from_number
        self.to_number = to_number
        self.customer_role = customer_role
        self.model = model
        # Where to bridge an INBOUND call (one with no browser-supplied
        # userVariables.destination_number) — i.e. how an external caller
        # reaches the rep in the browser. SWML connect.to only accepts a
        # phone number / SIP URI / queue / stream, NOT a Fabric subscriber
        # reference, so this must be a SIP URI (or address) that targets
        # the online subscriber, e.g. "sip:brian-sidecar-len@<sub>.sip.swire.io".
        # Empty (default) → inbound falls through to the fallback number,
        # preserving the prior behavior.
        self.inbound_to = (os.environ.get("SIDECAR_INBOUND_TO") or "").strip()
        self._basic_auth_creds = basic_auth  # (user, pass) for embedding in webhook URLs
        self._call_stats: dict[str, dict[str, Any]] = {}
        # Per-call speaker activity tracked from transcribe.utterance events.
        # Surfaced in /active-calls so the monitor page can paint a "who's
        # talking now" indicator. Bounded by call lifecycle (cleared on
        # `final`); the dict won't grow without bound.
        self._call_activity: dict[str, dict[str, Any]] = {}

        self._signalwire = signalwire
        self._resource_name = resource_name
        self._resource: dict[str, Any] | None = None
        self._dial_address: str | None = None
        # Stable subscriber reference: one subscriber, reused for every /token
        # call. Override with SIDECAR_SUBSCRIBER_REF if you want a different id.
        self._subscriber_reference = os.environ.get(
            "SIDECAR_SUBSCRIBER_REF", f"{resource_name}-viewer@local"
        )
        # Password promotes the auto-created subscriber to a fully-provisioned
        # one — required for `subscriber.online` (inbound calls). The relay
        # rejects half-provisioned subscribers with -32003 Requester validation
        # failed.
        self._subscriber_password = os.environ.get("SIDECAR_SUBSCRIBER_PASSWORD")

        # Live event subscribers (browser WebSockets). Push from any thread via
        # _broadcast_event(); the asyncio loop fans out the JSON frames.
        self._event_subscribers: set[WebSocket] = set()
        # Per-call audio routing.
        #
        # The relay can't substitute %{call.id} into the tap URI at render
        # time (it resolves to empty). To get per-call fanout we mint a
        # short session_id at SWML render and bake it into both the tap
        # URI and the tap status_url. When the relay POSTs `state=tapping`
        # to /tap-status?session=<id>, we learn the relay's call_id and
        # record the mapping. The monitor page can then surface a
        # "Listen" affordance for each live call.
        self._audio_sessions: dict[str, _AudioHub] = {}
        self._call_to_session: dict[str, str] = {}
        self._event_loop: asyncio.AbstractEventLoop | None = None

        # Short-lived tickets that authorise a /ws/events upgrade. Issued by
        # POST /token (which itself is basic-auth gated) and validated on WS
        # connect via ?ticket=<value>. Tickets are not single-use: a flaky
        # network might reconnect the WS several times before the ticket
        # expires. TTL is 1 hour by default.
        self._ws_tickets: dict[str, float] = {}
        self._ws_ticket_ttl_s = int(os.environ.get("SIDECAR_WS_TICKET_TTL", "3600"))

        self._register_tools()
        self.register_routing_callback(self._on_event, path="/events")
        self._register_extra_routes()
        if self._signalwire:
            self._ensure_resource()

    # ------------------------------------------------------------------ tools

    def _register_tools(self) -> None:
        self.define_tool(
            name="lookup_competitor",
            description=(
                "Look up competitive intelligence for a named competitor. Use this "
                "the moment the customer mentions a competitor by name; return "
                "pricing, weak points, strong points, and our historical win rate "
                "so the rep can position against them."
            ),
            parameters={
                "type": "object",
                "properties": {
                    "competitor": {
                        "type": "string",
                        "description": "Competitor company name as the customer said it.",
                    }
                },
                "required": ["competitor"],
            },
            handler=self._tool_lookup_competitor,
        )

        self.define_tool(
            name="get_account_status",
            description=(
                "Pull live account status for the customer on this call. Use when "
                "the customer references their plan, contract, renewal, billing, "
                "or open issues. Returns tier, MRR, renewal date, NPS, ticket "
                "count, and product list."
            ),
            parameters={
                "type": "object",
                "properties": {
                    "account_id": {
                        "type": "string",
                        "description": (
                            "CRM account id (e.g. APER-001). If unknown, ask the "
                            "rep to confirm the account before calling."
                        ),
                    }
                },
                "required": ["account_id"],
            },
            handler=self._tool_get_account_status,
        )

        self.define_tool(
            name="flag_buying_signal",
            description=(
                "Flag a buying signal so the rep can react in real time. Use when "
                "the customer reveals timeline, budget, authority, or urgency."
            ),
            parameters={
                "type": "object",
                "properties": {
                    "signal_type": {
                        "type": "string",
                        "description": "One of: timeline, budget, authority, urgency.",
                    },
                    "evidence": {
                        "type": "string",
                        "description": "Verbatim or near-verbatim phrase the customer used.",
                    },
                },
                "required": ["signal_type", "evidence"],
            },
            handler=self._tool_flag_buying_signal,
        )

        self.define_tool(
            name="log_objection",
            description=(
                "Log a customer objection and surface a one-line rebuttal hint. "
                "Use the moment the customer pushes back on price, features, "
                "contract terms, timing, vendor risk, or technical fit."
            ),
            parameters={
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": (
                            "One of: price, feature, contract, timing, vendor_risk, technical."
                        ),
                    },
                    "summary": {
                        "type": "string",
                        "description": "One-sentence summary of the objection.",
                    },
                },
                "required": ["category", "summary"],
            },
            handler=self._tool_log_objection,
        )

        self.define_tool(
            name="schedule_followup",
            description=(
                "Propose a follow-up meeting when the customer is interested but "
                "not ready to commit on this call. Returns a suggested time slot "
                "and the meeting type."
            ),
            parameters={
                "type": "object",
                "properties": {
                    "meeting_type": {
                        "type": "string",
                        "description": (
                            "One of: demo, pricing_call, technical_review, exec_intro, trial_kickoff."
                        ),
                    },
                    "days_out": {
                        "type": "integer",
                        "description": "How many business days from today to schedule.",
                    },
                },
                "required": ["meeting_type", "days_out"],
            },
            handler=self._tool_schedule_followup,
        )

        self.define_tool(
            name="escalate_to_supervisor",
            description=(
                "Page a sales supervisor into the loop. Use ONLY for: regulatory "
                "or compliance risk, hostile / abusive customer, six-figure deal "
                "at risk, or a save-the-deal moment beyond the rep's authority."
            ),
            parameters={
                "type": "object",
                "properties": {
                    "reason": {
                        "type": "string",
                        "description": (
                            "One of: compliance_risk, hostile_customer, high_value_deal, deal_at_risk."
                        ),
                    },
                    "context": {
                        "type": "string",
                        "description": "One-line context the supervisor needs to walk in cold.",
                    },
                },
                "required": ["reason", "context"],
            },
            handler=self._tool_escalate,
        )

    # ---------------------------------------------------------- tool handlers

    def _tool_lookup_competitor(self, args: dict[str, Any], raw: dict[str, Any]) -> FunctionResult:
        name = (args.get("competitor") or "").strip()
        # 1. Curated local file first — fastest, has talking points the
        #    agent can deliver verbatim.
        record = sample_data.lookup_competitor(name)
        if record:
            weak = "; ".join(record["weak_points"][:2])
            tps = record.get("talking_points") or []
            tp_block = (" Say: " + " // ".join(tps[:2])) if tps else ""
            pitch = (
                f"{name.upper()}: {record['pricing']} "
                f"Weak spots — {weak}. "
                f"We win {int(record['win_rate_vs_us'] * 100)}% head-to-head."
                f"{tp_block}"
            )
            return FunctionResult(pitch).add_action(
                "user_event",
                {"topic": "sidecar.copilot.competitor", "level": "info",
                 "competitor": name.upper(), "data": record},
            )

        # 2. Fallback: SEC EDGAR + GDELT live lookup. Free, no key,
        #    best-effort. Anything we can find beats "unknown".
        try:
            live = live_data.lookup_company_live(name)
        except Exception as e:  # noqa: BLE001
            self.log.warning("live_lookup_failed", name=name, error=str(e))
            live = None
        if live:
            pitch_parts: list[str] = [name.upper() + ":"]
            if live.get("industry"):
                pitch_parts.append(f"{live['industry']}.")
            if live.get("ticker"):
                pitch_parts.append(f"Public ({live['ticker']}).")
            if live.get("last_filing"):
                lf = live["last_filing"]
                pitch_parts.append(f"Latest filing {lf.get('form')} on {lf.get('date')}.")
            news = live.get("recent_news") or []
            if news:
                pitch_parts.append(f"Recent news: \"{news[0].get('title','')[:120]}\".")
            pitch_parts.append("Treat as discovery — no curated talking points yet.")
            pitch = " ".join(pitch_parts)
            return FunctionResult(pitch).add_action(
                "user_event",
                {"topic": "sidecar.copilot.competitor", "level": "info",
                 "competitor": name.upper(), "data": live},
            )

        return FunctionResult(
            f"No file on '{name}'. Treat as unknown; ask discovery questions."
        )

    def _tool_get_account_status(self, args: dict[str, Any], raw: dict[str, Any]) -> FunctionResult:
        account_id = (args.get("account_id") or "").strip()
        record = sample_data.lookup_account(account_id)
        if not record:
            return FunctionResult(f"No account found for '{account_id}'. Ask the rep to confirm the id.")
        renewal = datetime.fromisoformat(record["renewal_date"]).date()
        days_to_renewal = (renewal - datetime.now(timezone.utc).date()).days
        line = (
            f"{record['name']} — {record['tier']}, ${record['mrr']:,}/mo MRR, "
            f"renews in {days_to_renewal}d, NPS {record['nps']}, "
            f"{record['open_tickets']} open tickets."
        )
        return FunctionResult(line).add_action(
            "user_event",
            {"topic": "sidecar.copilot.account", "account_id": account_id.upper(), "data": record},
        )

    def _tool_flag_buying_signal(self, args: dict[str, Any], raw: dict[str, Any]) -> FunctionResult:
        signal_type = args.get("signal_type", "unknown")
        evidence = args.get("evidence", "")
        msg = f"Buying signal — {signal_type}: \"{evidence}\". Lock it in now."
        return FunctionResult(msg).add_action(
            "user_event",
            {"topic": "sidecar.copilot.buying_signal", "level": "warn", "signal_type": signal_type, "evidence": evidence},
        )

    def _tool_log_objection(self, args: dict[str, Any], raw: dict[str, Any]) -> FunctionResult:
        category = args.get("category", "unknown")
        summary = args.get("summary", "")
        rebuttals = {
            "price": "Anchor on TCO, not seat cost. Mention the $79 vs $99 ACME framing.",
            "feature": "Acknowledge gap; pivot to the adjacent capability they actually need.",
            "contract": "Offer monthly-to-annual ramp instead of a flat discount.",
            "timing": "Trade a delayed start date for signature this quarter.",
            "vendor_risk": "Surface SOC2 + reference customer in their vertical.",
            "technical": "Offer a 30-min technical_review with an SE.",
        }
        hint = rebuttals.get(category, "Acknowledge, then redirect to value.")
        return FunctionResult(f"Objection ({category}): {hint}").add_action(
            "user_event",
            {
                "topic": "sidecar.copilot.objection",
                "level": "warn",
                "category": category,
                "summary": summary,
                "suggested_rebuttal": hint,
            },
        )

    def _tool_schedule_followup(self, args: dict[str, Any], raw: dict[str, Any]) -> FunctionResult:
        meeting_type = args.get("meeting_type", "demo")
        days_out = int(args.get("days_out") or 3)
        when = datetime.now(timezone.utc) + timedelta(days=days_out)
        slot = when.replace(hour=15, minute=0, second=0, microsecond=0).isoformat()
        return FunctionResult(
            f"Propose a {meeting_type.replace('_', ' ')} for {when.date().isoformat()} 3pm UTC."
        ).add_action(
            "user_event",
            {
                "topic": "sidecar.copilot.followup",
                "meeting_type": meeting_type,
                "proposed_slot": slot,
            },
        )

    def _tool_escalate(self, args: dict[str, Any], raw: dict[str, Any]) -> FunctionResult:
        reason = args.get("reason", "unknown")
        context = args.get("context", "")
        return FunctionResult(f"Escalating ({reason}). Stay calm, hand off cleanly.").add_action(
            "user_event",
            {
                "topic": "sidecar.copilot.escalation",
                "level": "critical",
                "reason": reason,
                "context": context,
            },
        )

    # ------------------------------------------------------------ event sink

    @staticmethod
    def _extract_coach_prose(tool_response: Any) -> str:
        """Pull the human-readable rebuttal out of a tool_result payload.

        Tools persist as ``{"response": "<prose>", "action": [...]}``.
        We want the prose; the action list is SDK side-effect metadata.
        Returns empty string if nothing usable is present."""
        if not tool_response:
            return ""
        # Many tool_result events arrive with response already a dict
        # (because the agent runtime preprocessed it); others as a raw
        # JSON string. Handle both shapes.
        if isinstance(tool_response, str):
            try:
                parsed = json.loads(tool_response)
            except Exception:
                return tool_response.strip()
        else:
            parsed = tool_response
        if isinstance(parsed, dict):
            r = parsed.get("response")
            if isinstance(r, str) and r.strip():
                return r.strip()
            return ""
        return str(parsed).strip()

    def _record_coaching(self, call_id: str, text: str, source: str) -> None:
        """Stamp the most recent coaching cue for `call_id`. ``source``
        is "insight" or "tool" — used for diagnostic colouring on the
        monitor, not for routing. Broadcasts to /ws/events for real-time
        push."""
        text = (text or "").strip()
        if not call_id or not text:
            return
        prev = self._call_activity.get(call_id) or {}
        prev.update({
            "last_coaching_text": text,
            "last_coaching_at": time.time(),
            "last_coaching_source": source,
        })
        self._call_activity[call_id] = prev
        self._broadcast_event(
            {"call_id": call_id},
            {
                "type": "monitor.coaching",
                "text": text,
                "source": source,
                "channel_data": {"call_id": call_id},
            },
        )

    def _record_speaker(self, call_id: str, side: str, text: str | None = None) -> None:
        """Update _call_activity for this call and fan out a synthetic
        utterance event to /ws/events subscribers.

        Optional ``text`` is the utterance content. When non-empty it's
        stored on the activity record (so the polling /active-calls
        endpoint can surface it) AND echoed in the broadcast event so
        WS subscribers get it in real time. Empty text just bumps the
        timestamp — useful for source channels that don't have content
        readily available."""
        if not call_id or side not in ("customer", "rep"):
            return
        prev = self._call_activity.get(call_id) or {}
        text = (text or "").strip()
        now = time.time()
        side_text_key = "last_customer_text" if side == "customer" else "last_rep_text"
        side_at_key   = "last_customer_at"   if side == "customer" else "last_rep_at"
        prev.update({
            "last_speaker": side,
            "last_utterance_at": now,
            # Keep the most-recent non-empty text so the monitor doesn't
            # show "—" right after a content-less ping arrives.
            "last_text": text or prev.get("last_text"),
            side_text_key: text or prev.get(side_text_key),
            side_at_key: now,
        })
        self._call_activity[call_id] = prev
        # Persist the utterance to the CDR so the per-call detail modal can
        # show the transcript after the call ends. Skipped for content-less
        # pings (text="" or only whitespace) — those just bump the freshness
        # timestamp, they're not real spoken lines.
        if text:
            cdr_store.on_utterance(call_id, side, text, ts=now, source="live")
        # Map our internal side back to the relay's role string so the
        # browser's side-detection (`role === customer_role`) stays the
        # source of truth. Default customer_role is "remote-caller".
        if side == "customer":
            role = self.customer_role
        else:
            role = "local-caller" if self.customer_role.lower() == "remote-caller" else "remote-caller"
        self._broadcast_event(
            {"call_id": call_id},
            {
                "type": "transcribe.utterance",
                "utterance": {"role": role, "content": text},
                "channel_data": {"call_id": call_id},
                # Marker so app.js doesn't loop back to /speaker-event on
                # synthetic events the monitor itself fanned out. Without
                # this, every utterance echoes forever between client and
                # backend, re-flashing the cells with stale text.
                "origin": "monitor_relay",
            },
        )

    def _on_event(self, request: Request, body: dict[str, Any]) -> None:
        """Receive sidecar events and pretty-print them. Returns None so the
        SWMLService base keeps default routing — this is just an observer hook.

        Set SIDECAR_DEBUG_RAW=1 to also dump the full JSON of every event so
        nothing the platform sends gets swallowed by the pretty-printer."""

        call_info = body.get("call_info", {}) or {}
        event = body.get("sidecar_event")
        if not isinstance(event, dict):
            event = body  # tolerate flat payloads

        call_id = call_info.get("call_id") or event.get("channel_data", {}).get("call_id", "?")
        evt_type = event.get("type", "unknown")
        tick = event.get("tick_id")
        stats = self._call_stats.setdefault(call_id, {"insights": 0, "skips": 0, "tools": 0, "errors": 0})

        if os.environ.get("SIDECAR_DEBUG_RAW"):
            print(f"[{call_id}] RAW {evt_type}: {json.dumps(event, default=str)}")

        if evt_type == "start":
            print(f"\n[{call_id}] sidecar attached • model={event.get('model')} tools={len(event.get('tools', []))}")
            cdr_store.on_start(call_id, event.get("model"), len(event.get("tools", [])))
        elif evt_type == "turn":
            cust = (event.get("customer_text") or "").strip()
            if cust:
                print(f"[{call_id} tick={tick}] customer: {cust!r}")
                # `turn` events carry customer_text and DO arrive at this
                # callback (unlike transcribe.utterance events, which the
                # relay sends to the SDK directly, not us). Use this as
                # the customer-speaking signal.
                self._record_speaker(call_id, "customer", cust)
        elif evt_type in ("transcribe.utterance", "utterance"):
            # Defensive: if the relay ever does route raw utterance events
            # here, honor them. Currently they only reach the SDK.
            utt = event.get("utterance") or {}
            role = (utt.get("role") or "").lower()
            content = (utt.get("content") or "").strip()
            if role and content:
                side = "customer" if role == self.customer_role.lower() else "rep"
                self._record_speaker(call_id, side, content)
        elif evt_type == "thought":
            print(f"[{call_id} tick={tick}] · thinking: {event.get('text', '')[:120]}")
        elif evt_type == "insight":
            stats["insights"] += 1
            print(f"[{call_id} tick={tick}] >> INSIGHT: {event.get('raw')}")
            cdr_store.on_insight(call_id, tick, event.get("raw"))
            self._record_coaching(call_id, event.get("raw") or "", "insight")
        elif evt_type == "skip":
            stats["skips"] += 1
            print(f"[{call_id} tick={tick}] skip ({event.get('reason', 'no reason')})")
            cdr_store.on_skip(call_id)
        elif evt_type == "tool_call":
            stats["tools"] += 1
            print(f"[{call_id} tick={tick}] tool→ {event.get('name')}({event.get('arguments')})")
            cdr_store.on_tool_call(call_id, tick, event.get("name"), event.get("arguments"))
        elif evt_type == "tool_result":
            print(f"[{call_id} tick={tick}] tool← {event.get('name')}: {str(event.get('response'))[:120]}")
            cdr_store.on_tool_result(call_id, tick, event.get("name"), event.get("response"))
            # `sidecar_skip` returns a stub "ok"; ignore. Other tools'
            # response prose is the coaching cue the rep sees in the
            # Coach pane via app.js's fallback. Surface it to monitors
            # the same way.
            if event.get("name") != "sidecar_skip":
                prose = self._extract_coach_prose(event.get("response"))
                if prose:
                    self._record_coaching(call_id, prose, "tool")
        elif evt_type == "action":
            print(f"[{call_id}] action: {event.get('action')} (executed={event.get('executed')})")
        elif evt_type == "global_data_change":
            print(f"[{call_id}] global_data[{event.get('key')}]: {event.get('old_value')!r} → {event.get('new_value')!r}")
        elif evt_type == "history_pruned":
            print(f"[{call_id}] history pruned: {event.get('tokens_before')} → {event.get('tokens_after')}")
        elif evt_type == "error":
            stats["errors"] += 1
            print(f"[{call_id}] !! error: {event.get('error_reason')} — {event.get('detail')}")
            cdr_store.on_error(call_id)
        elif evt_type == "stop":
            print(f"[{call_id}] stop ({event.get('stop_reason')})")
        elif evt_type == "final":
            duration_s = (event.get("duration_ms") or 0) / 1000.0
            print(
                f"[{call_id}] FINAL • {duration_s:.1f}s • "
                f"insights={stats['insights']} skips={stats['skips']} "
                f"tools={stats['tools']} errors={stats['errors']}"
            )
            summary = event.get("summary")
            if summary:
                print(f"[{call_id}] summary: {summary}")
            cdr_store.on_final(call_id, event.get("duration_ms"), summary)
            # Some relay deployments inline the full transcript into the
            # final event (under `conversation_log`). Bulk-import it; the
            # unique index will skip any rows we already wrote live.
            log_rows = event.get("conversation_log")
            if isinstance(log_rows, list) and log_rows:
                n = cdr_store.on_conversation_log(call_id, log_rows)
                if n:
                    print(f"[{call_id}] transcript persisted ({n} new rows from final)")
            self._call_activity.pop(call_id, None)
        else:
            # Post-call transcript dump from the relay. Some shapes:
            #   - {type: "transcribe.conversation_log", conversation_log: [...]}
            #   - {channel_data: {content_disposition: "transcribe.conversation_log"},
            #      conversation_log: [...]}
            # Catch both via the content_disposition fallback.
            disp = (event.get("channel_data") or {}).get("content_disposition", "")
            if (evt_type == "transcribe.conversation_log"
                    or disp == "transcribe.conversation_log"
                    or isinstance(event.get("conversation_log"), list)):
                rows = event.get("conversation_log")
                if isinstance(rows, list) and rows:
                    n = cdr_store.on_conversation_log(call_id, rows)
                    print(f"[{call_id}] transcript persisted ({n} new rows from conversation_log)")
            else:
                print(f"[{call_id}] {evt_type}: {json.dumps(event)[:200]}")

        sys.stdout.flush()
        self._broadcast_event(call_info, event)
        return None

    # ---------------------------------------------------- browser fan-out

    def _broadcast_event(self, call_info: dict[str, Any], event: dict[str, Any]) -> None:
        """Schedule a JSON push of one sidecar event to every connected browser.
        Safe to call from the request thread — work is dispatched onto the
        asyncio loop captured at startup."""
        if not self._event_subscribers or self._event_loop is None:
            return
        frame = {"call_info": call_info, "event": event}
        self._event_loop.call_soon_threadsafe(
            asyncio.create_task, self._fanout_frame(frame)
        )

    async def _fanout_frame(self, frame: dict[str, Any]) -> None:
        dead: list[WebSocket] = []
        payload = json.dumps(frame, default=str)
        for ws in list(self._event_subscribers):
            try:
                await ws.send_text(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self._event_subscribers.discard(ws)

    # ------------------------------------------------------- extra routes

    def as_router(self):
        """Extend AgentBase's router with /token, /ws/events, and /ui static."""
        router = super().as_router()
        self._add_browser_routes(router)
        return router

    def serve(self, host: str | None = None, port: int | None = None) -> None:
        """Override AgentBase.serve(): the upstream serve registers a catch-all
        path matcher BEFORE including our router, which swallows every request
        with `{"error": "Path not found"}`. We rebuild the FastAPI app with the
        same security headers + health/ready endpoints, but include our router
        first so its specific routes win."""
        import uvicorn
        from fastapi import FastAPI, Response as FastAPIResponse

        if self._app is None:
            app = FastAPI(redirect_slashes=False, docs_url=None, redoc_url=None, openapi_url=None)

            @app.middleware("http")
            async def security_headers(request, call_next):
                resp = await call_next(request)
                resp.headers["X-Content-Type-Options"] = "nosniff"
                resp.headers["X-Frame-Options"] = "DENY"
                resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
                # Force Cloudflare (and the browser) to revalidate static
                # assets on every fetch instead of serving stale copies
                # for the SDK's default 4-hour edge TTL. ETag + Last-Modified
                # still let 304s short-circuit a body re-transfer.
                if request.url.path.endswith((".js", ".css", ".html", ".map")) \
                        or request.url.path == "/":
                    resp.headers["Cache-Control"] = "no-cache, must-revalidate"
                return resp

            @app.get("/health")
            @app.post("/health")
            async def health():
                return {"status": "healthy", "agent": self.name}

            @app.get("/ready")
            @app.post("/ready")
            async def ready():
                ok = bool(getattr(self, "_tool_registry", None) and getattr(self, "schema_utils", None))
                return FastAPIResponse(
                    content=json.dumps({"status": "ready" if ok else "not_ready"}),
                    status_code=200 if ok else 503,
                    media_type="application/json",
                )

            normalized = "/" + self.route.strip("/")
            router = self.as_router()
            if normalized == "/":
                app.include_router(router)
            else:
                app.include_router(router, prefix=normalized)

                # FastAPI with redirect_slashes=False won't match `/sidecar` →
                # `/sidecar/`. Bind both forms to the root SWML handler so
                # SignalWire (which posts to the no-trailing-slash form) is happy.
                @app.get(normalized)
                @app.post(normalized)
                async def _root_no_slash(request: Request):
                    return await self._handle_root_request(request)

            # Static UI mounted at the root so the browser visits "/" and the
            # rest of the app (SWML, token, WebSocket) lives at <route>/*.
            # Mount must come AFTER include_router/<route> bindings — Starlette
            # checks routes in registration order and a "/" mount otherwise
            # eats every path.
            static_dir = Path(__file__).resolve().parent / "static"
            if static_dir.is_dir():
                app.mount(
                    "/",
                    StaticFiles(directory=str(static_dir), html=True),
                    name="ui",
                )

            self._app = app

        uvicorn.run(self._app, host=host or self.host, port=port or self.port)

    def _register_extra_routes(self) -> None:
        """No-op stub kept for symmetry; the actual decoration happens lazily
        inside `as_router()` because AgentBase's `as_router()` builds a fresh
        router on every call."""

    def _add_browser_routes(self, router) -> None:
        # NOTE: StaticFiles is mounted on the FastAPI app inside serve(), not
        # here — APIRouter.mount() doesn't compose correctly with prefixes.
        @router.post("/token", dependencies=[Depends(_ui_auth_required)])
        async def mint_token(request: Request) -> JSONResponse:
            if not self._signalwire:
                raise HTTPException(503, "SignalWire credentials not configured")
            if not self._dial_address:
                raise HTTPException(503, "SignalWire resource not yet provisioned")
            try:
                # Reference must be stable so we re-use ONE subscriber every
                # time, not create a new one per token. Password (when set)
                # promotes the subscriber to fully-provisioned so it can go
                # online for inbound calls.
                tok = self._signalwire.mint_subscriber_token(
                    reference=self._subscriber_reference,
                    password=self._subscriber_password,
                    display_name="Sidecar Viewer",
                )
            except SignalWireError as e:
                self.log.error("sat_mint_failed", status=e.status, body=e.body[:200])
                raise HTTPException(502, f"SAT mint failed: HTTP {e.status}")
            # The SDK derives its API host from the JWT's `ch` claim (the
            # relay host, e.g. "puc.swire.io") and caches it before the
            # token even arrives, so subscriber-info GETs land on
            # fabric.signalwire.com regardless of the actual space. Hand
            # the browser the canonical fabric.<root-domain> so it can
            # override `client._deps.baseURL` before the SDK's first HTTP
            # request fires.
            host_only = self._signalwire.base.replace("https://", "").replace("http://", "").rstrip("/")
            root = host_only.split(".", 1)[1] if "." in host_only else host_only
            api_host = f"https://fabric.{root}"
            return JSONResponse({
                "token": tok["token"],
                "subscriber_id": tok.get("subscriber_id"),
                "address": self._dial_address,
                "resource_id": (self._resource or {}).get("id"),
                "api_host": api_host,
                # Tell the browser which leg is the customer so the side
                # detection in app.js / monitor.html doesn't depend on a
                # hardcoded default that drifts away from the SWML config.
                "customer_role": self.customer_role,
                # Short-lived ticket the browser must present on /ws/events
                # (it can't carry basic-auth there). Tickets expire after
                # SIDECAR_WS_TICKET_TTL seconds.
                "ws_ticket": self._issue_ws_ticket(),
            })

        # ---- Call Detail Records ---------------------------------------

        @router.get("/cdr", dependencies=[Depends(_ui_auth_required)])
        async def cdr_page():
            here = Path(__file__).resolve().parent / "static" / "cdr.html"
            if here.exists():
                from fastapi.responses import HTMLResponse
                return HTMLResponse(here.read_text())
            raise HTTPException(500, "cdr.html missing")

        @router.get("/cdr/api", dependencies=[Depends(_ui_auth_required)])
        async def cdr_api(limit: int = 50):
            # Self-heal: if a call started more than 10 min ago and never
            # received its on_final (e.g. container restart mid-call), seal
            # it so the UI stops painting it as live forever.
            cdr_store.sweep_stale(stale_after_s=600)
            calls = cdr_store.recent_calls(limit=min(max(int(limit), 1), 500))
            # Fold the SQL-aggregated coaching_count into insights_count so the
            # list view shows what was actually surfaced to the rep, matching
            # what the detail panel renders. Strip coaching_count from the
            # payload — the frontend only needs the merged number.
            for c in calls:
                native = int(c.get("insights_count") or 0)
                coaching = int(c.pop("coaching_count", 0) or 0)
                c["insights_count"] = native + coaching
            return JSONResponse({
                "summary":     cdr_store.summary_stats(),
                "funnel":      cdr_store.funnel_stats(),
                "objections":  cdr_store.objection_breakdown(),
                "competitors": cdr_store.competitor_breakdown(),
                "calls":       calls,
            })

        @router.get("/cdr/api/{call_id}", dependencies=[Depends(_ui_auth_required)])
        async def cdr_call_detail(call_id: str):
            row = cdr_store.call_detail(call_id)
            if not row:
                raise HTTPException(404, "no such call")
            # The model emits coaching by calling a tool whose response
            # text IS the insight, rather than firing a separate `insight`
            # event. The real-time UI handles this with _extract_coach_prose;
            # mirror it here so the historical timeline isn't empty either.
            # Synthesised entries get _source="tool:<name>" so the frontend
            # can mark them differently if it wants to.
            real_insights = list(row.get("insights") or [])
            synth_insights = []
            for t in row.get("tool_calls") or []:
                if t.get("name") == "sidecar_skip":
                    continue
                prose = self._extract_coach_prose(t.get("response"))
                if not prose:
                    continue
                synth_insights.append({
                    "ts": t.get("ts"),
                    "tick_id": t.get("tick_id"),
                    "text": prose,
                    "_source": f"tool:{t.get('name')}",
                })
            merged = real_insights + synth_insights
            # Sort by ts so the timeline reads in chronological order.
            # `ts` is unix-millis; `None` shouldn't happen but guard for it.
            merged.sort(key=lambda i: (i.get("ts") or 0))
            row["insights"] = merged
            # Update the per-call count so the detail-panel "Insights" chip
            # matches the timeline length. The underlying cdr_calls row
            # only counts native `insight` events; we don't backfill that
            # column on disk (callers reading via the list endpoint still
            # see the strict count), just the response shape here.
            if row.get("call"):
                row["call"]["insights_count"] = len(merged)
            # Recording lookup — read from our captured-at-create-time
            # mapping rather than re-querying SignalWire. The relay's
            # recording status webhook (status_url on record_call) tells
            # us the recording_id paired with this call_id; we just join.
            rec = cdr_store.get_recording(call_id)
            if rec and rec.get("recording_id"):
                row["recording"] = {
                    "sid": rec["recording_id"],
                    # Stream through our proxy so the <audio> tag can
                    # play it without basic-auth juggling in the browser.
                    "url": f"{self.route}/recording/{call_id}",
                    "duration_s": rec.get("duration_s"),
                    "format": rec.get("format") or "mp3",
                    "status": rec.get("status"),
                }
            return JSONResponse(row)

        @router.get("/recording/{call_id}",
                    dependencies=[Depends(_ui_auth_required)])
        async def stream_recording(call_id: str, request: Request):
            """Serve a SignalWire recording to the browser.

            Strategy: cache-on-first-hit to local disk, then serve via
            FastAPI's FileResponse which handles Range / Accept-Ranges /
            Content-Length / Content-Range natively. The earlier
            "stream-through proxy via urllib" approach was hitting
            Cloudflare's streaming timeout (502 mid-response) because
            urllib's sync reads inside an async generator don't flush
            chunks fast enough through the tunnel."""
            if not self._signalwire:
                raise HTTPException(503, "SignalWire credentials not configured")
            rec = cdr_store.get_recording(call_id)
            if not rec or not rec.get("recording_id"):
                raise HTTPException(404, "no recording for this call")
            sid = rec["recording_id"]
            fmt = (rec.get("format") or "mp3").lower()
            # Use the media_url the webhook gave us directly. It points
            # at files.swire.io/{space}/{project}/recordings/{id}.{fmt}.
            url = rec.get("media_url") or (
                f"{self._signalwire.base}/api/relay/rest/recordings/{sid}.{fmt}")

            # Cache path on disk. /data is the same persistent volume as
            # the SQLite CDR; auto-evict policy can be added later if it
            # grows. Filename carries the format so WAV/MP3 don't collide.
            from pathlib import Path as _P
            cache_dir = _P("/data/recordings")
            cache_dir.mkdir(parents=True, exist_ok=True)
            cache_path = cache_dir / f"{sid}.{fmt}"

            if not cache_path.exists() or cache_path.stat().st_size == 0:
                # First hit — download once with project basic-auth.
                import urllib.request as _urlreq
                import urllib.error as _urlerr
                req = _urlreq.Request(url, headers={
                    "Authorization": self._signalwire._auth_header(),
                })
                try:
                    with _urlreq.urlopen(req, timeout=60) as resp:
                        # Stream to a tmp file then atomic-rename so a
                        # half-written file from a crashed download isn't
                        # served on the next hit.
                        tmp = cache_path.with_suffix(f".{fmt}.partial")
                        with open(tmp, "wb") as f:
                            while True:
                                chunk = resp.read(256 * 1024)
                                if not chunk:
                                    break
                                f.write(chunk)
                        tmp.rename(cache_path)
                except _urlerr.HTTPError as e:
                    raise HTTPException(e.code, f"recording fetch failed: {e.code}")
                except Exception as e:  # noqa: BLE001
                    raise HTTPException(502, f"recording fetch failed: {e}")

            # FileResponse handles Range, Content-Length, ETag, conditional
            # GETs — everything the <audio> element needs for progressive
            # playback and seeking. No streaming-through-proxy fragility.
            from fastapi.responses import FileResponse
            media_type = {
                "wav": "audio/wav",
                "mp3": "audio/mpeg",
                "mp4": "audio/mp4",
            }.get(fmt, "application/octet-stream")
            return FileResponse(
                str(cache_path),
                media_type=media_type,
                headers={
                    # Long client cache is fine — recordings are immutable
                    # and the ?v=<sid> query string busts any stale entry
                    # if the recording id ever changes.
                    "Cache-Control": "private, max-age=86400",
                },
            )

        @router.delete("/subscriber", dependencies=[Depends(_ui_auth_required)])
        async def reset_subscriber() -> JSONResponse:
            """Nuke the cached subscriber identity on the SignalWire side.

            Used as a self-heal escape hatch: when the SDK reports
            ``RPCTimeoutError`` or ``CallCreateError: Call create timeout``,
            the relay-side subscriber state is usually wedged. The next
            ``POST /token`` after this call lazily recreates the
            subscriber with the same reference + password, which
            reliably clears the wedge."""
            if not self._signalwire:
                raise HTTPException(503, "SignalWire credentials not configured")
            try:
                matches = self._signalwire.list_subscribers_by_reference(
                    self._subscriber_reference
                )
                deleted: list[str] = []
                for s in matches:
                    sid = s.get("id")
                    if not sid:
                        continue
                    self._signalwire.delete_subscriber(sid)
                    deleted.append(sid)
                self.log.info(
                    "subscriber_reset", reference=self._subscriber_reference,
                    deleted_count=len(deleted),
                )
                return JSONResponse({"deleted": deleted, "reference": self._subscriber_reference})
            except SignalWireError as e:
                self.log.error("subscriber_reset_failed",
                               status=e.status, body=e.body[:200])
                raise HTTPException(502, f"subscriber reset failed: HTTP {e.status}")

        @router.post("/ws-ticket", dependencies=[Depends(_ui_auth_required)])
        async def issue_ws_ticket() -> JSONResponse:
            """Mint a fresh /ws/events ticket without re-minting a SAT.
            Used by the browser's auto-reconnect path so a stale ticket
            (e.g. after a container restart cleared the in-memory store)
            doesn't loop indefinitely against the auth gate."""
            return JSONResponse({"ws_ticket": self._issue_ws_ticket()})

        @router.post("/tap-status")
        async def tap_status(request: Request) -> JSONResponse:
            """Webhook for the SWML `tap` verb's `status_url`.

            Carries two jobs:

            1. Diagnostics — `state=tapping` / `state=finished` makes it
               trivial to tell apart "verb rejected" (no POST), "WS
               handshake failed our end" (POST but no audio_tap_connected),
               and "clean tap" (both events present).
            2. Per-call routing — the `?session=<id>` we baked into the
               URL comes back to us; the body carries `call_id`. That's
               how we map call_id → audio session, which the monitor
               page uses to render a Listen button per active call."""
            session_id = request.query_params.get("session")
            try:
                body = await request.json()
            except Exception:
                try:
                    body = dict((await request.form()).items())
                except Exception:
                    body = {}
            params = body.get("params") if isinstance(body, dict) else None
            if isinstance(params, dict):
                call_id = params.get("call_id")
                state = params.get("state")
                self.log.info(
                    "tap_status",
                    session=session_id,
                    call_id=call_id,
                    state=state,
                    control_id=params.get("control_id"),
                    device_type=(params.get("device") or {}).get("type"),
                )
                if state == "tapping" and session_id and call_id:
                    self._call_to_session[call_id] = session_id
                elif state == "finished" and call_id:
                    sess = self._call_to_session.pop(call_id, None)
                    if sess:
                        self._audio_sessions.pop(sess, None)
            else:
                self.log.info("tap_status_raw", body=str(body)[:300])
            return JSONResponse({"ok": True})

        @router.post("/connect-status")
        async def connect_status(request: Request) -> JSONResponse:
            """Webhook for the SWML `connect` verb's `call_state_url`.
            Logs the bridged-leg lifecycle (created → ringing → answered →
            ended) plus the dialed `to`/`from` and any failure reason, so
            the connect outcome is visible in our own logs. `?tag=` says
            which cond branch dialed (outbound / fallback / inbound)."""
            tag = request.query_params.get("tag", "?")
            try:
                body = await request.json()
            except Exception:
                try:
                    body = dict((await request.form()).items())
                except Exception:
                    body = {}
            params = body.get("params") if isinstance(body, dict) else None
            p = params if isinstance(params, dict) else (body if isinstance(body, dict) else {})
            # Field names vary by relay event shape; pull the useful ones.
            self.log.info(
                "connect_status",
                tag=tag,
                state=p.get("call_state") or p.get("state") or p.get("connect_state"),
                to=p.get("to") or (p.get("peer") or {}).get("to") if isinstance(p.get("peer"), dict) else p.get("to"),
                reason=p.get("reason") or p.get("end_reason") or p.get("hangup_reason"),
                call_id=p.get("call_id"),
                raw=str(body)[:500],
            )
            return JSONResponse({"ok": True})

        @router.post("/recording-status")
        async def recording_status(request: Request) -> JSONResponse:
            """Webhook for the SWML `record_call` verb's `status_url`.
            Captures the recording_id ↔ call_id pair as the recording
            transitions through states (started → finished). We
            persist on every event so a 'started' row exists even if
            the call ends abruptly before the 'finished' callback.

            The query string carries `call_id` (SWML substituted at
            execution time from `%{call.id}`). The body carries the
            recording details under `params`."""
            call_id = request.query_params.get("call_id") or None
            try:
                body = await request.json()
            except Exception:
                try:
                    body = dict((await request.form()).items())
                except Exception:
                    body = {}
            params = body.get("params") if isinstance(body, dict) else None
            rec_id = None
            duration = None
            state = None
            fmt = None
            media_url = None
            if isinstance(params, dict):
                # `%{call.id}` doesn't substitute inside record_call.status_url
                # at SWML execution time (same gotcha as tap.uri). The relay
                # *does* include call_id in the params payload (matching
                # the SWML segment id we use everywhere else), so we use
                # that as the canonical source.
                if not call_id:
                    call_id = params.get("call_id") or params.get("call_sid")
                # Confirmed payload shape (calling.call.record event):
                #   params.recording_id — actual resource id ← what we want
                #   params.control_id   — internal handle (do NOT confuse with above)
                #   params.url          — deterministic media URL
                #                         https://files.swire.io/{space}/{project}/recordings/{id}.{fmt}
                #   params.duration     — seconds (on `state=finished`)
                #   params.record.audio.format — mp3/wav/mp4
                rec_id = params.get("recording_id") or params.get("id")
                duration = params.get("duration")
                state = params.get("state") or params.get("status")
                media_url = params.get("url")
                record_block = params.get("record") or {}
                audio_block = (record_block.get("audio") or {}) if isinstance(record_block, dict) else {}
                fmt = audio_block.get("format") or params.get("format")
            self.log.info(
                "recording_status",
                call_id=call_id, recording_id=rec_id,
                state=state, duration=duration,
                media_url=media_url, format=fmt,
            )
            if call_id and rec_id:
                cdr_store.on_recording(
                    call_id, rec_id,
                    duration_s=float(duration) if duration is not None else None,
                    status=state,
                    format_=fmt,
                    media_url=media_url,
                )
            return JSONResponse({"ok": True})

        @router.post("/speaker-event", dependencies=[Depends(_ui_auth_required)])
        async def speaker_event(request: Request) -> JSONResponse:
            """Side-channel from the rep's main UI to surface
            transcribe.utterance events that the SignalWire SDK
            delivers directly to the browser (and therefore aren't
            visible to /events).

            The browser POSTs ``{call_id, role}`` for every utterance.
            We update _call_activity AND broadcast a synthetic event
            so the monitor page sees it on /ws/events in real time."""
            try:
                body = await request.json()
            except Exception:
                body = {}
            cid = (body.get("call_id") or "").strip()
            role = (body.get("role") or "").strip().lower()
            content = (body.get("content") or "").strip()
            if not cid or not role:
                return JSONResponse({"ok": False, "reason": "missing call_id or role"},
                                    status_code=400)
            side = "customer" if role == self.customer_role.lower() else "rep"
            self._record_speaker(cid, side, content)
            return JSONResponse({"ok": True, "side": side})

        @router.get("/active-calls", dependencies=[Depends(_ui_auth_required)])
        async def active_calls() -> JSONResponse:
            """Live calls (ended_at IS NULL) with their audio session_id
            where known. Drives the monitor page's table."""
            cdr_store.sweep_stale(stale_after_s=600)
            calls = cdr_store.recent_calls(limit=50)
            out = []
            now = time.time()
            for c in calls:
                if c.get("ended_at"):
                    continue
                cid = c.get("call_id")
                c["audio_session"] = self._call_to_session.get(cid)
                act = self._call_activity.get(cid)
                if act:
                    c["last_speaker"] = act.get("last_speaker")
                    c["last_text"] = act.get("last_text") or ""
                    last_utt = act.get("last_utterance_at")
                    c["seconds_since_utterance"] = (
                        max(0, now - last_utt) if last_utt else None
                    )
                    c["last_customer_text"] = act.get("last_customer_text") or ""
                    last_cust = act.get("last_customer_at")
                    c["seconds_since_customer"] = (
                        max(0, now - last_cust) if last_cust else None
                    )
                    c["last_rep_text"] = act.get("last_rep_text") or ""
                    last_rep = act.get("last_rep_at")
                    c["seconds_since_rep"] = (
                        max(0, now - last_rep) if last_rep else None
                    )
                    c["last_coaching_text"] = act.get("last_coaching_text") or ""
                    c["last_coaching_source"] = act.get("last_coaching_source")
                    last_coach = act.get("last_coaching_at")
                    c["seconds_since_coaching"] = (
                        max(0, now - last_coach) if last_coach else None
                    )
                else:
                    c["last_speaker"] = None
                    c["seconds_since_utterance"] = None
                    c["last_text"] = ""
                    c["last_customer_text"] = ""
                    c["seconds_since_customer"] = None
                    c["last_rep_text"] = ""
                    c["seconds_since_rep"] = None
                    c["last_coaching_text"] = ""
                    c["last_coaching_source"] = None
                    c["seconds_since_coaching"] = None
                out.append(c)
            return JSONResponse({"calls": out})

        @router.get("/monitor", dependencies=[Depends(_ui_auth_required)])
        async def monitor_page():
            from pathlib import Path as _P
            from fastapi.responses import HTMLResponse
            here = _P(__file__).resolve().parent / "static" / "monitor.html"
            if here.exists():
                return HTMLResponse(here.read_text())
            raise HTTPException(500, "monitor.html missing")

        @router.get("/about-monitor", dependencies=[Depends(_ui_auth_required)])
        async def about_monitor_page():
            """Long-form documentation of the monitor's architecture —
            doubles as a blog post draft. Same auth gate as /monitor
            since it doesn't surface any secrets but lives in the same
            UI namespace."""
            from pathlib import Path as _P
            from fastapi.responses import HTMLResponse
            here = _P(__file__).resolve().parent / "static" / "about_monitor.html"
            if here.exists():
                return HTMLResponse(here.read_text())
            raise HTTPException(500, "about_monitor.html missing")

        @router.get("/about-agent", dependencies=[Depends(_ui_auth_required)])
        async def about_agent_page():
            """Long-form documentation of the agent (main) page —
            workspace layout, call lifecycle, transcript paths, and the
            failure modes worth knowing about."""
            from pathlib import Path as _P
            from fastapi.responses import HTMLResponse
            here = _P(__file__).resolve().parent / "static" / "about_agent.html"
            if here.exists():
                return HTMLResponse(here.read_text())
            raise HTTPException(500, "about_agent.html missing")

        @router.websocket("/ws/events")
        async def events_ws(ws: WebSocket, ticket: str | None = None) -> None:
            # WebSocket upgrades can't carry HTTP Basic, so we require a
            # short-lived ticket the browser obtains from /token (which is
            # itself basic-auth gated). Reject before accept() so a 1008
            # close frame fires without ever advancing into the app state.
            if not self._ws_ticket_valid(ticket):
                self.log.warning(
                    "ws_auth_rejected",
                    has_ticket=bool(ticket),
                    client=ws.client.host if ws.client else "?",
                )
                await ws.close(code=status.WS_1008_POLICY_VIOLATION)
                return
            await ws.accept()
            # First subscriber: latch the running loop so request-thread
            # broadcasts can dispatch onto it.
            if self._event_loop is None:
                self._event_loop = asyncio.get_running_loop()
            self._event_subscribers.add(ws)
            self.log.info("ws_subscriber_connected", count=len(self._event_subscribers))
            try:
                await ws.send_text(json.dumps({
                    "event": {"type": "_hello", "subscribers": len(self._event_subscribers)},
                }))
                while True:
                    await ws.receive_text()
            except WebSocketDisconnect:
                pass
            finally:
                self._event_subscribers.discard(ws)
                self.log.info("ws_subscriber_disconnected", count=len(self._event_subscribers))

        # ----- Live audio tap (server-side: SignalWire connects HERE) -----
        @router.websocket("/ws/audio")
        async def audio_tap_ws(
            ws: WebSocket,
            session: str | None = None,
            ticket: str | None = None,
        ) -> None:
            """Incoming tap stream from the SignalWire relay.

            The SWML `tap` verb opens this socket and streams raw μ-law
            frames as binary WS messages (~160 bytes / 20 ms by default).
            `session` was minted at SWML render time and identifies the
            hub. `ticket` gates the connection — WS upgrades can't carry
            Basic auth, same pattern as /ws/events."""
            if not self._ws_ticket_valid(ticket):
                self.log.warning("audio_tap_auth_rejected",
                                 has_session=bool(session), has_ticket=bool(ticket))
                await ws.close(code=status.WS_1008_POLICY_VIOLATION)
                return
            hub = self._audio_sessions.get(session or "")
            if hub is None:
                # SWML render is meant to pre-create the hub; arriving
                # without one usually means a stale ticket from a prior
                # container instance.
                self.log.warning("audio_tap_unknown_session", session=session)
                await ws.close(code=status.WS_1008_POLICY_VIOLATION)
                return
            await ws.accept()
            await hub.attach_tap(ws)
            self.log.info("audio_tap_connected",
                          session=session, subscribers=hub.subscriber_count())
            try:
                while True:
                    msg = await ws.receive()
                    if "bytes" in msg and msg["bytes"] is not None:
                        await hub.broadcast(msg["bytes"])
                    elif msg.get("type") == "websocket.disconnect":
                        break
            except WebSocketDisconnect:
                pass
            except Exception as e:  # noqa: BLE001
                self.log.warning("audio_tap_error", session=session, error=str(e))
            finally:
                self.log.info("audio_tap_closed",
                              session=session, frames=hub._frame_count)

        # ----- Live audio listen (server-side: browser connects HERE) -----
        @router.websocket("/ws/audio/listen")
        async def audio_listen_ws(
            ws: WebSocket,
            session: str | None = None,
            ticket: str | None = None,
        ) -> None:
            """Browser subscribes to a call's μ-law audio stream by session id.

            Returns binary frames identical to what arrived from the
            SignalWire tap — the browser decodes (μ-law → PCM), resamples
            to AudioContext rate, and feeds an AudioWorklet for playback."""
            if not self._ws_ticket_valid(ticket):
                self.log.warning("audio_listen_auth_rejected", has_ticket=bool(ticket))
                await ws.close(code=status.WS_1008_POLICY_VIOLATION)
                return
            hub = self._audio_sessions.get(session or "")
            if hub is None:
                self.log.warning("audio_listen_unknown_session", session=session)
                await ws.close(code=status.WS_1008_POLICY_VIOLATION)
                return
            await ws.accept()
            q = await hub.subscribe()
            self.log.info("audio_listener_connected",
                          session=session, subscribers=hub.subscriber_count())
            try:
                while True:
                    frame = await q.get()
                    await ws.send_bytes(frame)
            except WebSocketDisconnect:
                pass
            except Exception as e:  # noqa: BLE001
                self.log.warning("audio_listener_error", session=session, error=str(e))
            finally:
                await hub.unsubscribe(q)
                self.log.info("audio_listener_disconnected",
                              session=session, subscribers=hub.subscriber_count())

    def _ensure_resource(self) -> None:
        try:
            primary_url = self._webhook_url("")  # SWML root
            resource = self._signalwire.ensure_swml_webhook(
                name=self._resource_name,
                primary_request_url=primary_url,
                primary_request_method="POST",
            )
            self._resource = resource
            addresses = self._signalwire.get_resource_addresses(resource["id"])
            self._dial_address = SignalWireREST.pick_dial_address(resource, addresses)
            self.log.info(
                "resource_ready",
                resource_id=resource.get("id"),
                dial_address=self._dial_address,
            )
        except SignalWireError as e:
            self.log.error("resource_ensure_failed", status=e.status, body=e.body[:300])
        except Exception as e:  # noqa: BLE001
            # DNS resolution failure, connection refused, TLS error — any of
            # these can fire during container startup before the operator has
            # finished configuring SignalWire creds. Log and continue so the
            # container boots and serves /health; /token will return 503
            # until _dial_address is populated.
            self.log.error("resource_ensure_unreachable", error=repr(e))

    # ----------------------------------------------------------------- swml

    def _render_swml(self, call_id: str | None = None, modifications: dict | None = None) -> str:
        """Replace AgentBase's default `ai`-verb SWML with our `ai_sidecar` doc.

        We still benefit from AgentBase for the SWAIG webhook + token validation;
        we just don't want a TTS agent on this call."""
        return json.dumps(self._build_swml_dict(), indent=2)

    # Hard fallback for inbound bridging when the caller didn't supply a
    # destination. Anything the browser passes in userVariables.destination_number
    # wins; this number is only dialed when that variable is absent/empty.
    DEFAULT_FALLBACK_TO = "+14122892034"

    def _connect_to(self) -> str:
        """Legacy single-value form. Retained for callers that want a flat
        string (e.g. tests). The runtime SWML now uses a `cond` branch
        rendered in _build_swml_dict to express the userVariables-or-fallback
        choice without relying on Liquid-style default filters."""
        if self.to_number:
            return self.to_number
        return "%{vars.userVariables.destination_number}"

    # ---------------------------------------------------- ws auth tickets

    def _issue_ws_ticket(self) -> str:
        """Mint a fresh ws ticket and return it. GCs expired ones."""
        now = time.time()
        self._ws_tickets = {t: e for t, e in self._ws_tickets.items() if e > now}
        ticket = secrets.token_urlsafe(24)
        self._ws_tickets[ticket] = now + self._ws_ticket_ttl_s
        return ticket

    def _ws_ticket_valid(self, ticket: str | None) -> bool:
        if not ticket:
            return False
        now = time.time()
        exp = self._ws_tickets.get(ticket)
        if exp is None or exp <= now:
            self._ws_tickets.pop(ticket, None)
            return False
        return True

    def _webhook_url(self, suffix: str) -> str:
        """Return a public URL for one of our webhooks with basic-auth creds
        embedded so SignalWire can authenticate when it calls us."""
        base = self.public_url
        if self._basic_auth_creds:
            user, pwd = self._basic_auth_creds
            scheme, sep, rest = base.partition("://")
            base = f"{scheme}{sep}{quote(user, safe='')}:{quote(pwd, safe='')}@{rest}"
        return f"{base}{self.route}{suffix}"

    def _build_swml_dict(self) -> dict[str, Any]:
        events_url = self._webhook_url("/events")
        swaig_url = self._webhook_url("/swaig")

        functions = []
        for fn in self._tool_registry.get_all_functions().values():
            functions.append(
                {
                    "function": fn.name,
                    "description": fn.description,
                    "parameters": fn.parameters,
                }
            )

        # SIDECAR_DIAG_NO_SIDECAR=1 strips the ai_sidecar verb so we can
        # verify the connect-to-destination leg in isolation. The verb is
        # undocumented and the only path we've seen ends with transcribe_close
        # before connect ever fires; bypassing it lets us see whether the
        # bridge itself works.
        skip_sidecar = os.environ.get("SIDECAR_DIAG_NO_SIDECAR", "").lower() in ("1", "true", "yes")
        # Opt-in: emit a `tap` verb that streams the call's audio to
        # /ws/audio as μ-law frames. Browser-side toggle then opens
        # /ws/audio/listen to actually receive the frames. The tap costs
        # one WSS connection from the relay regardless of how many
        # listeners are attached.
        audio_tap_on = os.environ.get("SIDECAR_AUDIO_TAP", "").lower() in ("1", "true", "yes")
        main_section: list[Any] = [{"answer": {}}]
        # Opt-in call recording. When SIDECAR_RECORD_CALLS=1 we tell the
        # relay to record the bridged call to SignalWire's cloud storage.
        # The CDR detail modal then pulls the recording back via the REST
        # API and renders it inline as an <audio> player. Stereo so the
        # supervisor can tell who said what; mp3 so it's small enough to
        # stream over the proxy without paging.
        record_calls = os.environ.get("SIDECAR_RECORD_CALLS", "").lower() in ("1", "true", "yes")
        if record_calls:
            # status_url carries `?call_id=%{call.id}` — SignalWire
            # interpolates the live call_id at execution time so when the
            # webhook fires post-recording we can stash the
            # call_id ↔ recording_id pair without needing to filter
            # SignalWire's recordings list (which has no working filter
            # for the SWML call_id we own).
            rec_status = self._webhook_url("/recording-status?call_id=%{call.id}")
            main_section.append({
                "record_call": {
                    "stereo": True,
                    # WAV instead of MP3 because SignalWire's MP3 encoder
                    # emits `emphasis = 01` (50/15μs deprecated pre-emphasis)
                    # in the frame headers, and Firefox's MediaSink decoder
                    # rejects those files with MEDIA_ERR_DECODE (code 3).
                    # Chromium tolerates it. WAV is uncompressed PCM and
                    # plays cleanly everywhere; ~10× larger but recordings
                    # are short so total size stays manageable.
                    "format": "wav",
                    "direction": "both",
                    "status_url": rec_status,
                }
            })
        if audio_tap_on:
            # Per-render audio session id — links the tap WS, the status
            # webhook, and the eventual call_id we learn from the relay.
            # See _audio_sessions docstring in __init__.
            session_id = secrets.token_urlsafe(12)
            self._audio_sessions[session_id] = _AudioHub()
            ws_base = (
                self.public_url
                .replace("https://", "wss://")
                .replace("http://", "ws://")
            )
            tap_uri = (
                ws_base + self.route
                + f"/ws/audio?session={session_id}&ticket="
                + self._issue_ws_ticket()
            )
            # ?session=<id> rides along on the status_url so the relay
            # sends it back to us in the webhook — that's how we learn
            # which call_id belongs to which audio session.
            tap_status_url = self._webhook_url(f"/tap-status?session={session_id}")
            main_section.append({
                "tap": {
                    "uri": tap_uri,
                    "direction": "both",
                    "codec": "PCMU",
                    "status_url": tap_status_url,
                }
            })
        if not skip_sidecar:
            main_section.append(
                {
                    "ai_sidecar": {
                            "prompt": SIDECAR_PROMPT,
                            "lang": "en-US",
                            "model": self.model,
                            "customer_role": self.customer_role,
                            "url": events_url,
                            "SWAIG": {
                                "defaults": {"web_hook_url": swaig_url},
                                "functions": functions,
                            },
                            # Vocabulary bias for the ASR — names + jargon
                            # the rep + customer say that the recognizer
                            # has flubbed in prior calls (e.g. ACME → acne).
                            # Built from the CRM/competitor file at module
                            # load. Historic note: when this verb timed
                            # out without a relay-side ack we suspected
                            # this field, but the actual culprit was
                            # other params (direction / debug / final_summary
                            # / verbose_utterances / max_history_tokens).
                            # Hints alone, kept short and proper-noun
                            # heavy, has been re-enabled.
                            "hints": SIDECAR_ASR_HINTS,
                            "params": {
                                "idle_timeout_ms": 800,
                                "min_interval_ms": 1000,
                                "max_iters_per_tick": 3,
                                "live_events": True,
                                "ai_summary": True,
                                "speech_engine": "deepgram",
                            },
                        }
                    }
                )
        # Branch on whether the caller passed a *valid E.164* destination
        # in userVariables. The relay's `to` field expects E.164, so we
        # gate on the format here — anything else (gibberish, empty,
        # missing) falls through to the fallback rather than being passed
        # to the relay only to be rejected.
        #
        # E.164: leading '+', 7–15 digits total. The regex is evaluated by
        # SignalWire's SWML expression engine (JavaScript-like).
        fallback_to = self.to_number or self.DEFAULT_FALLBACK_TO
        valid_e164_check = (
            "vars.userVariables && "
            "vars.userVariables.destination_number && "
            "/^\\+[1-9]\\d{6,14}$/.test(vars.userVariables.destination_number)"
        )
        # Direction routing, expressed as a cond ladder:
        #
        #   1. OUTBOUND (browser-initiated): the SDK dial passed
        #      userVariables.destination_number as a valid E.164 → bridge
        #      the rep to that number (the customer they're calling).
        #
        #   2. INBOUND (external caller → this resource): no userVariables,
        #      so the E.164 check fails. If SIDECAR_INBOUND_TO is set, bridge
        #      to it — a SIP URI/address that rings the online subscriber, so
        #      the inbound caller reaches the rep in the browser. `from` is
        #      omitted here so the connected leg shows the *original caller's*
        #      ID rather than our outbound caller-id, which is what the rep
        #      wants to see on an inbound call.
        #
        #   3. FALLBACK: inbound with no inbound target configured → dial the
        #      fallback number, preserving the pre-inbound-branch behavior.
        #
        # SWML cond schema: the params array is a union of CondReg
        # ({when, then}) and CondElse ({else}) objects — `else` lives in
        # its own entry, never as a sibling of `when`/`then`. Mixing them
        # in one dict gets rejected with relay_script_method_parameter_invalid_value.
        # Three-way direction router. The discriminator between a browser
        # OUTBOUND call and a genuine INBOUND call is the presence of
        # `vars.userVariables`: the SDK always dials with
        # userVariables:{destination_number:…} (even if the field is blank),
        # so any browser-initiated leg has a truthy userVariables object;
        # an inbound PSTN/SIP call arrives with none.
        #
        #   1. OUTBOUND, valid destination  → dial the number.
        #   2. OUTBOUND, blank/invalid dest → dial the fallback number
        #      (safety net; this is the case that previously regressed into
        #      the inbound branch and produced "No valid devices").
        #   3. INBOUND (no userVariables)   → ring the subscriber via
        #      SIDECAR_INBOUND_TO, or the fallback number if unset.
        #
        # SWML cond is an ordered ladder: the first truthy `when` fires and
        # the rest (including else) are skipped. `else` must be its own
        # entry, never a sibling of when/then.
        # Every connect carries a call_state_url so the bridged-leg outcome
        # (created → ringing → answered → ended) is POSTed to /connect-status
        # and logged. Without this the connect result is invisible — our
        # /events sink only sees the ai_sidecar's events, not the dialed
        # leg's state — which made "did it actually dial the number?"
        # unanswerable from logs. `tag` labels which branch fired.
        cs_url = self._webhook_url("/connect-status")

        def _connect(to, *, from_=None, tag=""):
            c = {"to": to, "answer_on_bridge": True,
                 "call_state_url": cs_url,
                 "call_state_events": ["created", "ringing", "answered", "ended"]}
            if from_:
                c["from"] = from_
            if tag:
                # Rides along on the status callback so the log says which
                # branch dialed.
                c["call_state_url"] = f"{cs_url}?tag={tag}"
            return {"connect": c}

        main_section.append({
            "cond": [
                {
                    "when": valid_e164_check,
                    "then": [_connect("%{vars.userVariables.destination_number}",
                                      from_=self.from_number, tag="outbound")],
                },
                {
                    # Browser call but dest not a valid E.164. The `when`
                    # MUST evaluate to a boolean — the cond engine ignores a
                    # bare object reference (vars.userVariables alone matched
                    # nothing and fell through to else→inbound). The `!= null`
                    # comparison yields a real boolean. Guarded by the &&
                    # so an inbound call (no userVariables) short-circuits to
                    # undefined and correctly skips to the else branch.
                    "when": "vars.userVariables && vars.userVariables.destination_number != null",
                    "then": [_connect(fallback_to, from_=self.from_number, tag="fallback")],
                },
                {
                    # genuine inbound — ring subscriber if configured, else fallback number
                    "else": [
                        _connect(self.inbound_to, tag="inbound")
                        if self.inbound_to
                        else _connect(fallback_to, from_=self.from_number, tag="inbound-fallback")
                    ],
                },
            ]
        })
        main_section.append({"hangup": {}})
        return {
            "version": "1.0.0",
            "sections": {"main": main_section},
        }


# --------------------------------------------------------------------- main


def _split_basic_auth(public_url: str) -> tuple[str, tuple[str, str] | None]:
    """If the public URL embeds basic-auth creds (https://user:pass@host),
    pull them out and return the cleaned URL plus the (user, pass) tuple."""
    parsed = urlparse(public_url)
    if not parsed.username:
        return public_url, None
    netloc = parsed.hostname or ""
    if parsed.port:
        netloc = f"{netloc}:{parsed.port}"
    cleaned = parsed._replace(netloc=netloc).geturl()
    return cleaned, (parsed.username, parsed.password or "")


def parse_args() -> argparse.Namespace:
    load_dotenv()
    p = argparse.ArgumentParser(description="SignalWire sidecar sales copilot")
    p.add_argument("--public-url", default=os.environ.get("PUBLIC_URL"),
                   help="Public base URL SignalWire will reach (may embed basic-auth).")
    p.add_argument("--from", dest="from_number", default=os.environ.get("FROM_NUMBER"),
                   help="Caller-ID for the bridged outbound leg.")
    p.add_argument("--to", dest="to_number", default=os.environ.get("TO_NUMBER"),
                   help="Bridge target. Phone (+15555550100), SIP URI, or "
                        "Fabric address (/public/<name>). If unset, defaults "
                        "to the auto-discovered resource dial address so the "
                        "browser UI can pick up the call.")
    p.add_argument("--customer-role", default=os.environ.get("CUSTOMER_ROLE", "local-caller"),
                   choices=["remote-caller", "local-caller"])
    p.add_argument("--model", default=os.environ.get("SIDECAR_MODEL", "gpt-4o-mini"))
    p.add_argument("--host", default=os.environ.get("HOST", "0.0.0.0"))
    p.add_argument("--port", type=int, default=int(os.environ.get("PORT", "3000")))
    p.add_argument("--route", default=os.environ.get("ROUTE", "/sidecar"))
    p.add_argument("--dump-swml", action="store_true",
                   help="Print the SWML document to stdout and exit (no server).")
    p.add_argument("--resource-name", default=os.environ.get("SIDECAR_RESOURCE_NAME", "sidecar-copilot"),
                   help="Name of the SWML-webhook resource to ensure on startup.")
    return p.parse_args()


def build_app(args: argparse.Namespace) -> SidecarSalesCopilot:
    if not args.public_url:
        raise SystemExit("PUBLIC_URL (or --public-url) is required.")
    if not args.from_number:
        raise SystemExit("FROM_NUMBER (or --from) is required.")
    # to_number is optional — falls back to the auto-discovered resource address.

    public_url, embedded_auth = _split_basic_auth(args.public_url)
    explicit_user = os.environ.get("SWML_BASIC_AUTH_USER")
    explicit_pass = os.environ.get("SWML_BASIC_AUTH_PASSWORD")
    basic_auth = embedded_auth
    if explicit_user and explicit_pass:
        basic_auth = (explicit_user, explicit_pass)

    sw_space = os.environ.get("SIGNALWIRE_SPACE_URL")
    sw_project = os.environ.get("SIGNALWIRE_PROJECT_ID")
    sw_token = os.environ.get("SIGNALWIRE_API_TOKEN")
    signalwire: SignalWireREST | None = None
    if sw_space and sw_project and sw_token:
        signalwire = SignalWireREST(sw_space, sw_project, sw_token)
    elif any([sw_space, sw_project, sw_token]):
        logging.warning(
            "partial SignalWire creds — set SIGNALWIRE_SPACE_URL, "
            "SIGNALWIRE_PROJECT_ID, and SIGNALWIRE_API_TOKEN to enable /token + auto-resource"
        )

    return SidecarSalesCopilot(
        public_url=public_url,
        from_number=args.from_number,
        to_number=args.to_number,
        customer_role=args.customer_role,
        model=args.model,
        host=args.host,
        port=args.port,
        route=args.route,
        basic_auth=basic_auth,
        signalwire=signalwire,
        resource_name=args.resource_name,
    )


def main() -> None:
    args = parse_args()
    app = build_app(args)

    if args.dump_swml:
        print(app._render_swml())
        return

    print(f"sidecar listening on {args.host}:{args.port}{args.route}")
    print(f"  ui        → {app.public_url}/")
    print(f"  swml      → {app.public_url}{args.route}")
    print(f"  events    → {app.public_url}{args.route}/events")
    print(f"  swaig     → {app.public_url}{args.route}/swaig")
    print(f"  token     → {app.public_url}{args.route}/token")
    print(f"  ws events → {app.public_url}{args.route}/ws/events")
    if app._dial_address:
        print(f"  dial addr → {app._dial_address}")
    app.serve(host=args.host, port=args.port)


if __name__ == "__main__":
    main()
