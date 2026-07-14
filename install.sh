#!/usr/bin/env bash
#
# Sidecar Sales Copilot — installer for a plain server (no Docker, no
# Cloudflare). Creates a Python virtualenv, installs the dependencies, and
# prepares a .env. Idempotent: safe to re-run.
#
#   ./install.sh            install venv + deps, seed .env
#   ./install.sh --systemd  also generate a systemd unit (sidecar.service)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VENV="${VENV:-.venv}"
PYTHON="${PYTHON:-python3}"
MAKE_SYSTEMD=0
[ "${1:-}" = "--systemd" ] && MAKE_SYSTEMD=1

say()  { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!  \033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

# ── 1. Python presence + version (3.10+ for `str | None` syntax) ──────────
command -v "$PYTHON" >/dev/null 2>&1 || die "$PYTHON not found — install Python 3.10+ first."
ver="$("$PYTHON" -c 'import sys; print("%d.%d" % sys.version_info[:2])')"
major="${ver%%.*}"; minor="${ver##*.}"
if [ "$major" -lt 3 ] || { [ "$major" -eq 3 ] && [ "$minor" -lt 10 ]; }; then
  die "Python $ver found; this app needs 3.10 or newer."
fi
say "Python $ver detected"

# ── 2. Ensure the venv module (Debian/Ubuntu ship it separately) ──────────
if ! "$PYTHON" -c 'import venv' >/dev/null 2>&1; then
  warn "Python 'venv' module is missing."
  if command -v apt-get >/dev/null 2>&1; then
    say "Installing python3-venv via apt (may prompt for sudo)…"
    sudo apt-get update -y && sudo apt-get install -y python3-venv
  elif command -v dnf >/dev/null 2>&1; then
    say "Installing python3 (includes venv) via dnf…"
    sudo dnf install -y python3
  elif command -v yum >/dev/null 2>&1; then
    sudo yum install -y python3
  else
    die "Install your distro's python venv package, then re-run."
  fi
fi

# ── 3. Create / reuse the virtualenv ──────────────────────────────────────
if [ ! -d "$VENV" ]; then
  say "Creating virtualenv at $VENV"
  "$PYTHON" -m venv "$VENV"
else
  say "Reusing existing virtualenv at $VENV"
fi
# shellcheck disable=SC1091
source "$VENV/bin/activate"

# ── 4. Install dependencies ───────────────────────────────────────────────
say "Upgrading pip + wheel"
pip install --quiet --upgrade pip wheel
say "Installing requirements (signalwire-sdk pulls in FastAPI + uvicorn)"
pip install -r requirements.txt

# ── 5. Seed .env ──────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  cp .env.example .env
  say "Created .env from .env.example — edit it before running."
else
  say ".env already present — left untouched."
fi

# ── 5b. Writable data dir (CDR DB + cached recordings) ────────────────────
# Docker uses the /data volume; on a plain box the default CDR_DB_PATH in
# .env.example is ./data, so create it here. Recordings co-locate beside it.
mkdir -p data
say "Created ./data for the CDR database and recordings."

# ── 6. Optional: systemd unit ─────────────────────────────────────────────
if [ "$MAKE_SYSTEMD" -eq 1 ]; then
  RUN_USER="${SUDO_USER:-$USER}"
  UNIT="$SCRIPT_DIR/sidecar.service"
  cat > "$UNIT" <<UNIT_EOF
[Unit]
Description=Sidecar Sales Copilot
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$RUN_USER
WorkingDirectory=$SCRIPT_DIR
# .env is auto-loaded by the app (load_dotenv) from WorkingDirectory.
ExecStart=$SCRIPT_DIR/$VENV/bin/python $SCRIPT_DIR/sidecar_app.py
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT_EOF
  say "Wrote $UNIT"
  cat <<EOF

To install the service:
   sudo cp "$UNIT" /etc/systemd/system/sidecar.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now sidecar.service
   journalctl -u sidecar -f          # tail logs
EOF
fi

# ── 7. Next steps ─────────────────────────────────────────────────────────
cat <<EOF

────────────────────────────────────────────────────────────────────────
 Install complete.

 1. Edit .env — at minimum:
      PUBLIC_URL                    URL SignalWire reaches this box on (https)
      SIGNALWIRE_SPACE_URL
      SIGNALWIRE_PROJECT_ID
      SIGNALWIRE_API_TOKEN
      SIDECAR_UI_PASSWORD           gates the browser /token (503 until set)
      SIDECAR_SUBSCRIBER_PASSWORD   required for Go Online / inbound calls
      SWML_BASIC_AUTH_USER / _PASSWORD   webhook auth (executor -> us)

 2. Run it:
      ./run.sh
    (or: source $VENV/bin/activate && python sidecar_app.py)

 PUBLIC_URL must be HTTPS-reachable by SignalWire. Without Cloudflare:
   • Public host + DNS + TLS reverse proxy (nginx/Caddy) in front of PORT
   • ngrok:  ngrok http \${PORT:-3000}   then set PUBLIC_URL to the https URL
   • Public IP with the port open behind any TLS terminator

 Run as a background service:  ./install.sh --systemd
────────────────────────────────────────────────────────────────────────
EOF
