#!/usr/bin/env bash
#
# Run the Sidecar Sales Copilot from its virtualenv. Activates .venv and
# starts the app; config is read from .env (auto-loaded by the app).
# Any extra args are passed straight through to sidecar_app.py, e.g.:
#   ./run.sh --port 8080
#   ./run.sh --dump-swml
#
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VENV="${VENV:-.venv}"
[ -d "$VENV" ] || { echo "No virtualenv at $VENV — run ./install.sh first." >&2; exit 1; }
[ -f .env ]   || { echo "No .env — copy .env.example to .env and fill it in." >&2; exit 1; }

# shellcheck disable=SC1091
source "$VENV/bin/activate"
exec python sidecar_app.py "$@"
