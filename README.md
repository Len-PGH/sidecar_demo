# Sidecar Sales Copilot

A real-time AI sales-coach demo built on SignalWire's `ai_sidecar` SWML verb,
plus a full browser workspace for the rep and supervisor.

The `ai_sidecar` verb attaches to a live call as a **passive observer** — it
transcribes both legs, feeds each customer turn to an LLM with a sales-coach
prompt and a toolbox of SWAIG functions, and emits one-line `insight`s for the
rep. The customer never hears the sidecar; there is no TTS leg. On top of that
the app adds:

- **Agent page** (`/`) — connect to SignalWire, dial out or go online for
  inbound, live transcript, streaming coach insights, competitor/account
  context cards, mute, and in-browser call audio.
- **Live monitor** (`/sidecar/monitor`) — every active call with per-side
  transcript (customer vs agent), coaching cues, and a per-call "listen in"
  button that streams the call's μ-law audio into the browser over a WebSocket.
- **CDR** (`/sidecar/cdr`) — call history, a signal funnel, tool / objection /
  competitor breakdowns, and a per-call drill-down with the transcript, the
  coaching timeline, and **recording playback**.
- **About pages** (`/sidecar/about-agent`, `/sidecar/about-monitor`) —
  long-form architecture docs that double as the in-app help.
- Light/dark theme, mobile-responsive layout, touch-friendly tooltips.

## Layout

```
brian_sidecar/
├── sidecar_app.py        # AgentBase subclass: SWML render, SWAIG handlers,
│                         #   /token, event sink, WS fan-out, all UI routes
├── signalwire_rest.py    # thin SignalWire REST client (SAT mint, resource
│                         #   provisioning, recordings lookup, subscriber reset)
├── cdr_store.py          # SQLite CDR: calls, insights, tools, transcripts,
│                         #   recordings (WAL mode, lives on the /data volume)
├── sample_data.py        # mock CRM accounts + competitor records
├── live_data.py          # optional SEC EDGAR / GDELT live competitor lookup
├── static/               # the browser app (no build step — plain JS/CSS/HTML)
│   ├── index.html        #   agent page
│   ├── monitor.html      #   live-calls monitor
│   ├── cdr.html          #   call detail records
│   ├── about_agent.html  #   docs
│   ├── about_monitor.html
│   ├── app.js  styles.css  theme.js  tooltip.js  audio_worklet.js
│   └── vendor/           #   vendored SignalWire browser SDK (UMD + ESM)
├── Dockerfile            # build recipe (container listens on :5000)
├── requirements.txt
└── .env.example
```

## Setup

### Local (venv)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env — at minimum PUBLIC_URL, the SIGNALWIRE_* creds, and a
# SIDECAR_UI_PASSWORD (the browser /token endpoint stays 503 until it's set).
```

Expose the port publicly (e.g. `ngrok http 3000` or a Cloudflare tunnel) and
point `PUBLIC_URL` at the tunnel. SignalWire must be able to reach:

| Path | Purpose |
|------|---------|
| `${PUBLIC_URL}/sidecar`             | SWML document (the call handler) |
| `${PUBLIC_URL}/sidecar/swaig`       | SWAIG tool webhook |
| `${PUBLIC_URL}/sidecar/events`      | sidecar event stream sink |

```bash
python sidecar_app.py --public-url https://<your-tunnel>
```

CLI flags override the same-named env vars.

### Docker

```bash
docker build -t sidecar-copilot .
docker run --rm -p 5000:5000 --env-file .env \
  -v "$PWD/data:/data" \
  -e PUBLIC_URL=https://<your-tunnel> \
  sidecar-copilot
```

The container listens on **:5000** (the bare-Python default is **:3000**).
Mount a volume at `/data` to persist the CDR SQLite database and cached
recordings across restarts.

## Configuration

All settings are env-driven (see `.env.example`). The important ones:

| Var | Default | Purpose |
|-----|---------|---------|
| `PUBLIC_URL` | — | URL SignalWire reaches us on; basic-auth creds may be embedded (`https://user:pass@host`) |
| `PORT` / `HOST` / `ROUTE` | `3000` / `0.0.0.0` / `/sidecar` | bind config (Docker sets `PORT=5000`) |
| `SIDECAR_MODEL` | `gpt-4o-mini` | sidecar LLM |
| `CUSTOMER_ROLE` | `local-caller` | which call leg is the customer (the other is the agent) |
| **Webhook auth (executor → us)** | | |
| `SWML_BASIC_AUTH_USER` / `SWML_BASIC_AUTH_PASSWORD` | — | basic auth the SignalWire executor presents on SWML/SWAIG/event callbacks |
| **Browser/UI auth** | | |
| `SIDECAR_UI_USER` / `SIDECAR_UI_PASSWORD` | `admin` / — | gates `POST /token` (and thus WS event/audio streams). `/token` returns 503 until the password is set |
| `SIDECAR_WS_TICKET_TTL` | `3600` | lifetime of the per-call WebSocket ticket |
| **SignalWire REST (for /token + auto-provisioning)** | | |
| `SIGNALWIRE_SPACE_URL` / `SIGNALWIRE_PROJECT_ID` / `SIGNALWIRE_API_TOKEN` | — | project credentials |
| `SIDECAR_RESOURCE_NAME` | `sidecar-copilot` | name of the SWML-webhook resource the app provisions |
| `SIDECAR_SUBSCRIBER_PASSWORD` | — | password for the rep's subscriber identity. **Required for Go Online / inbound** — the relay rejects password-less subscribers with `-32003 Requester validation failed` |
| **Call routing** | | |
| `FROM_NUMBER` | — | caller ID for the outbound/bridged leg |
| `TO_NUMBER` | — | if set, the fallback bridge target (else `DEFAULT_FALLBACK_TO`, a placeholder) |
| `SIDECAR_INBOUND_TO` | — | SIP URI/address that rings the online subscriber on a genuine inbound call (see **Call routing**). Empty → inbound uses the fallback number |
| **Media** | | |
| `SIDECAR_AUDIO_TAP` | off | `1` to emit a `tap` verb streaming μ-law audio to `/ws/audio` for the monitor's listen-in |
| `SIDECAR_RECORD_CALLS` | off | `1` to record the bridged call (stereo WAV) to SignalWire's cloud store; played back in the CDR |
| **Diagnostics** | | |
| `SIDECAR_DEBUG_RAW` | off | `1` to log the full JSON of every sidecar event |
| `SIDECAR_DIAG_NO_SIDECAR` | off | `1` to strip the `ai_sidecar` verb (verify the bridge in isolation) |

### Useful CLI flags

```
--public-url URL                                required
--from / --to NUMBER                            bridge legs
--customer-role {remote-caller,local-caller}    which leg is the customer
--model gpt-4o-mini                             sidecar LLM
--host / --port / --route                       bind config
--resource-name NAME                            SWML-webhook resource name
--dump-swml                                     print the SWML and exit
```

## The SWML it renders

`GET`/`POST` `/sidecar` returns a document whose `main` section is:

```
answer → [record_call] → [tap] → ai_sidecar → cond(connect …) → hangup
```

`record_call` and `tap` are included only when `SIDECAR_RECORD_CALLS` /
`SIDECAR_AUDIO_TAP` are enabled. Inspect it any time:

```bash
python sidecar_app.py --public-url https://example.com --dump-swml
```

### Call routing (`cond` → `connect`)

The connect verb is a three-way direction router. The discriminator between a
browser-initiated **outbound** call and a genuine **inbound** call is the
presence of `vars.userVariables` (the SDK always dials with
`userVariables: { destination_number }`; an inbound PSTN/SIP call has none):

1. **Outbound, valid E.164** (`vars.userVariables.destination_number` matches
   `^\+[1-9]\d{6,14}$`) → bridge to that number.
2. **Outbound, blank/invalid destination** → bridge to the fallback number
   (`TO_NUMBER` or the built-in placeholder).
3. **Inbound** (no `userVariables`) → bridge to `SIDECAR_INBOUND_TO` (a SIP URI
   that rings the online subscriber), or the fallback number if unset.

> Every `connect` carries a `call_state_url` (→ `/connect-status`) so the
> bridged-leg lifecycle (created → ringing → answered → ended) is logged.

## Tools

Six SWAIG functions, dispatched at `/sidecar/swaig`:

| Tool | When the LLM calls it |
|------|-----------------------|
| `lookup_competitor`      | Customer names a competitor (returns pricing, weak points, talking points) |
| `get_account_status`     | Customer references their plan / contract / renewal / billing |
| `flag_buying_signal`     | Customer reveals timeline / budget / authority / urgency |
| `log_objection`          | Pushback on price, features, contract, timing, vendor risk, technical |
| `schedule_followup`      | Interested but not ready to commit |
| `escalate_to_supervisor` | Compliance risk, hostile customer, high-value deal at risk |

Mock CRM + competitor records live in `sample_data.py`; `live_data.py` adds an
optional SEC EDGAR / GDELT fallback for unknown competitor names. Swap both for
real backend calls when wiring to a CRM. `sidecar_skip` is reserved — don't
define a SWAIG function with that name.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/sidecar` | the SWML document |
| POST | `/sidecar/swaig` | SWAIG tool dispatch |
| POST | `/sidecar/events` | sidecar event sink (prints + fans out + persists to CDR) |
| POST | `/sidecar/token` | mint a Subscriber Access Token + WS ticket (UI-auth gated) |
| WS | `/sidecar/ws/events` | live event stream to the browser |
| WS | `/sidecar/ws/audio`, `/sidecar/ws/audio/listen` | call-audio tap relay + browser listener |
| GET | `/sidecar/monitor`, `/sidecar/cdr`, `/sidecar/about-agent`, `/sidecar/about-monitor` | UI pages |
| GET | `/sidecar/active-calls`, `/sidecar/cdr/api`, `/sidecar/cdr/api/{id}` | UI data |
| GET | `/sidecar/recording/{call_id}` | recording playback (cached, auth-proxied) |
| POST | `/sidecar/recording-status`, `/sidecar/connect-status`, `/sidecar/tap-status` | relay status webhooks |
| POST | `/sidecar/speaker-event` | browser → backend utterance side-channel for the monitor |
| DELETE | `/sidecar/subscriber` | self-heal: evict a wedged subscriber identity |
| GET | `/`, `/health`, `/ready` | UI / liveness |

## How it's built

`SidecarSalesCopilot` subclasses `AgentBase` to inherit the SWAIG webhook
(token validation + dispatch), routing-callback registration (reused as the
`/events` sink), and a working `serve()` (FastAPI + uvicorn). `_render_swml` is
overridden to emit an `ai_sidecar` verb instead of the default `ai` verb — the
sidecar is an observer, not a TTS agent. The browser app is plain static files
(no build step); the SignalWire SDK is vendored under `static/vendor/`.

## Notes / gotchas

- `live_transcribe` and `ai_sidecar` are mutually exclusive on the same call.
- `ai_sidecar.customer_role` decides which leg is the customer; the browser
  leg (`remote-caller` here) is the agent, the connect-out leg the customer.
- Recordings are produced as **WAV** — SignalWire's MP3 encoder sets a
  deprecated pre-emphasis flag that Firefox's decoder rejects. They're cached
  to `/data/recordings` and streamed back through a Range-aware proxy.
- The browser UI tears down on the relay's `final` event (server-authoritative)
  because the SDK's `status$` does not reliably emit a terminal state on an
  abrupt/remote hangup.
- `say` actions are event-only (no TTS handle) and return `executed: false`.
- The sidecar terminates when the underlying call hangs up; the `final` event
  carries the transcript, history, summary, and stats.
