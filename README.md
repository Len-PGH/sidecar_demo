# Sidecar Sales Copilot

An elaborate test app for SignalWire's `<ai_sidecar>` SWML verb, built on the
[`signalwire-sdk`](https://github.com/signalwire/signalwire-python).

The sidecar attaches to a live phone call as a **passive observer**:

- It transcribes both legs of the call.
- It feeds each customer turn-end to an LLM with a sales-coach prompt and a
  toolbox of SWAIG functions.
- The LLM either emits a one-line `insight` (advice for the rep) or calls
  `sidecar_skip` to stay quiet.
- All events stream to this app's `/events` endpoint for the rep's UI / CRM.
- The customer hears nothing from the sidecar — there is no TTS leg.

## Layout

```
sidecar/
├── sidecar_app.py     # the AgentBase subclass + SWML + SWAIG handlers
├── sample_data.py     # mock CRM + competitor records
├── requirements.txt
├── .env.example
└── .venv/             # created locally
```

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env: PUBLIC_URL, FROM_NUMBER, TO_NUMBER, basic-auth, etc.
```

## Run

Expose port 3000 publicly (e.g. `ngrok http 3000`) and point `PUBLIC_URL` at the
tunnel URL. SignalWire must be able to reach `${PUBLIC_URL}/sidecar` for SWML,
`/sidecar/swaig` for tool calls, and `/sidecar/events` for the event stream.

```bash
python sidecar_app.py \
    --public-url https://<your-tunnel>.ngrok.app \
    --from +15555550100 \
    --to   +15555550199
```

CLI flags override the same-named env vars in `.env`.

### Useful flags

```
--customer-role {remote-caller,local-caller}   which leg is the customer
--model gpt-4o-mini                            sidecar LLM
--host / --port / --route                       bind config
--dump-swml                                     print SWML and exit
```

### Inspect the SWML

```bash
python sidecar_app.py --public-url https://example.com \
    --from +15555550100 --to +15555550199 --dump-swml
```

### Try the SWAIG tool locally

```bash
# server in one terminal
python sidecar_app.py --public-url http://test:test@localhost:3000 \
    --from +15555550100 --to +15555550199

# another terminal — hit the SWAIG webhook directly
curl -s -u test:test -X POST http://localhost:3000/sidecar/swaig \
  -H "Content-Type: application/json" \
  -d '{"function":"lookup_competitor","argument":{"parsed":[{"competitor":"ACME"}]},"call_id":"t1"}'

# simulate an inbound sidecar event
curl -s -u test:test -X POST http://localhost:3000/sidecar/events \
  -H "Content-Type: application/json" \
  -d '{"call_info":{"call_id":"t1"},"sidecar_event":{"type":"insight","tick_id":1,"raw":"Confirm address."}}'
```

The server prints sidecar events as they arrive:

```
[t1] sidecar attached • model=gpt-4o-mini tools=6
[t1 tick=2] customer: 'we already use ACME for this'
[t1 tick=2] tool→ lookup_competitor({"competitor":"ACME"})
[t1 tick=2] tool← lookup_competitor: ACME: $99/seat/mo ...
[t1 tick=2] >> INSIGHT: Counter ACME on TCO; surface our $79 vs $99 framing.
[t1] FINAL • 312.4s • insights=11 skips=4 tools=3 errors=0
```

## Tools

The copilot ships with six SWAIG functions:

| Tool | When the LLM calls it |
|------|-----------------------|
| `lookup_competitor`     | Customer mentions a competitor by name |
| `get_account_status`    | Customer references their plan / contract / renewal / billing |
| `flag_buying_signal`    | Customer reveals timeline / budget / authority / urgency |
| `log_objection`         | Customer pushes back on price, features, contract, timing, vendor risk, technical |
| `schedule_followup`     | Customer is interested but not ready to commit |
| `escalate_to_supervisor`| Compliance risk, hostile customer, high-value deal at risk |

Mock CRM and competitor records live in `sample_data.py`. Replace them with
real backend calls when wiring this up to a CRM.

## How it's built

`SidecarSalesCopilot` subclasses `AgentBase` to inherit:

- the SWAIG webhook at `/sidecar/swaig` (with token validation + dispatch),
- routing-callback registration (used here as the `/sidecar/events` sink),
- a working `serve()` that stands up FastAPI + uvicorn.

We override `_render_swml` to emit an `ai_sidecar` verb instead of the default
`ai` verb — the sidecar is an observer, not a TTS agent.

## Notes / gotchas

- `live_transcribe` and `ai_sidecar` are mutually exclusive on the same call.
- Both call legs must be present in `direction`; single-leg sidecars are rejected.
- `say` actions are event-only (no TTS handle) and return `executed: false`.
- `sidecar_skip` is reserved — don't define a SWAIG function with that name.
- The sidecar terminates when the underlying call hangs up; the `final` event
  carries the full transcript, history, summary, and stats.
