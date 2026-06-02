"""SQLite-backed Call Detail Records for the sidecar.

Three tables:

  cdr_calls         one row per call_id, lifecycle stats + final summary
  cdr_insights      every `insight` event the sidecar emitted, in order
  cdr_tool_calls    every `tool_call` event with the response prose
                    (sidecar_skip excluded — it's noise)

The store is append-only; we never delete. Mount the DB on a volume in
docker-compose to make CDRs survive restarts.

All write methods are no-throw so a CDR bug can't kill a live call. They
log a warning and continue.
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
import threading
import time

log = logging.getLogger(__name__)

DB_PATH = os.environ.get("CDR_DB_PATH", "/data/cdr.sqlite3")
_init_lock = threading.Lock()
_initialized = False


def _connect():
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    c = sqlite3.connect(DB_PATH, timeout=5.0, check_same_thread=False)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA journal_mode=WAL")
    c.execute("PRAGMA synchronous=NORMAL")
    return c


def init():
    global _initialized
    if _initialized:
        return
    with _init_lock:
        if _initialized:
            return
        try:
            with _connect() as c:
                c.execute("""
                    CREATE TABLE IF NOT EXISTS cdr_calls (
                        call_id        TEXT PRIMARY KEY,
                        started_at     INTEGER NOT NULL,
                        ended_at       INTEGER,
                        duration_ms    INTEGER,
                        model          TEXT,
                        tools_offered  INTEGER,
                        insights_count INTEGER NOT NULL DEFAULT 0,
                        skips_count    INTEGER NOT NULL DEFAULT 0,
                        tool_count     INTEGER NOT NULL DEFAULT 0,
                        errors_count   INTEGER NOT NULL DEFAULT 0,
                        end_reason     TEXT,
                        summary        TEXT
                    )
                """)
                c.execute("""
                    CREATE TABLE IF NOT EXISTS cdr_insights (
                        id        INTEGER PRIMARY KEY AUTOINCREMENT,
                        call_id   TEXT NOT NULL,
                        ts        INTEGER NOT NULL,
                        tick_id   INTEGER,
                        text      TEXT NOT NULL
                    )
                """)
                c.execute("CREATE INDEX IF NOT EXISTS ix_cdr_insights_call ON cdr_insights(call_id)")
                c.execute("""
                    CREATE TABLE IF NOT EXISTS cdr_tool_calls (
                        id        INTEGER PRIMARY KEY AUTOINCREMENT,
                        call_id   TEXT NOT NULL,
                        ts        INTEGER NOT NULL,
                        tick_id   INTEGER,
                        name      TEXT NOT NULL,
                        args      TEXT,
                        response  TEXT
                    )
                """)
                c.execute("CREATE INDEX IF NOT EXISTS ix_cdr_tools_call ON cdr_tool_calls(call_id)")
                # Transcript utterances — one row per spoken line. Populated
                # live by `turn` and /speaker-event paths, and bulk-imported
                # at call end from the relay's transcribe.conversation_log
                # event (deduped on the composite of call_id+ts+content).
                c.execute("""
                    CREATE TABLE IF NOT EXISTS cdr_transcripts (
                        id        INTEGER PRIMARY KEY AUTOINCREMENT,
                        call_id   TEXT NOT NULL,
                        ts        REAL NOT NULL,
                        role      TEXT NOT NULL,
                        content   TEXT NOT NULL,
                        source    TEXT
                    )
                """)
                c.execute("CREATE INDEX IF NOT EXISTS ix_cdr_transcripts_call ON cdr_transcripts(call_id)")
                # Composite uniqueness — protects against double-inserts when
                # the live path and the conversation_log bulk import end up
                # capturing the same utterance. Ties on ts collapse to one row.
                c.execute("""
                    CREATE UNIQUE INDEX IF NOT EXISTS ux_cdr_transcripts
                    ON cdr_transcripts(call_id, ts, role, content)
                """)
                # Recording id mapping — populated by the record_call
                # status_url webhook. SignalWire's relay-native recordings
                # endpoint has no working call_id filter, so we capture the
                # pair at create time instead of trying to look it up later.
                c.execute("""
                    CREATE TABLE IF NOT EXISTS cdr_recordings (
                        call_id      TEXT PRIMARY KEY,
                        recording_id TEXT NOT NULL,
                        ts           INTEGER NOT NULL,
                        duration_s   REAL,
                        status       TEXT,
                        format       TEXT,
                        media_url    TEXT
                    )
                """)
                # Add media_url column to pre-existing DBs that don't
                # already have it. SQLite raises if the column exists;
                # swallow that one specific error.
                try:
                    c.execute("ALTER TABLE cdr_recordings ADD COLUMN media_url TEXT")
                except Exception as e:  # noqa: BLE001
                    if "duplicate column" not in str(e):
                        log.warning("cdr_recordings ALTER failed: %s", e)
        except Exception as e:  # noqa: BLE001
            log.warning("cdr init failed: %s", e)
            return
        _initialized = True


# ---------------------------------------------------------------------------
# Write path — called from sidecar_app._on_event
# ---------------------------------------------------------------------------

def on_start(call_id, model, tools_offered):
    init()
    if not _initialized:
        return
    try:
        now = int(time.time())
        with _connect() as c:
            c.execute(
                "INSERT OR IGNORE INTO cdr_calls "
                "(call_id, started_at, model, tools_offered) VALUES (?, ?, ?, ?)",
                (call_id, now, model, int(tools_offered or 0)))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_start failed: %s", e)


def on_insight(call_id, tick_id, text):
    init()
    if not _initialized or not text:
        return
    try:
        with _connect() as c:
            c.execute(
                "INSERT INTO cdr_insights (call_id, ts, tick_id, text) VALUES (?, ?, ?, ?)",
                (call_id, int(time.time()), tick_id, str(text)[:2000]))
            c.execute(
                "UPDATE cdr_calls SET insights_count = insights_count + 1 WHERE call_id = ?",
                (call_id,))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_insight failed: %s", e)


def on_skip(call_id):
    init()
    if not _initialized:
        return
    try:
        with _connect() as c:
            c.execute(
                "UPDATE cdr_calls SET skips_count = skips_count + 1 WHERE call_id = ?",
                (call_id,))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_skip failed: %s", e)


def on_tool_call(call_id, tick_id, name, args):
    init()
    if not _initialized or not name:
        return
    try:
        args_json = json.dumps(args) if not isinstance(args, str) else args
        with _connect() as c:
            c.execute(
                "INSERT INTO cdr_tool_calls (call_id, ts, tick_id, name, args) "
                "VALUES (?, ?, ?, ?, ?)",
                (call_id, int(time.time()), tick_id, str(name)[:80], args_json[:2000]))
            c.execute(
                "UPDATE cdr_calls SET tool_count = tool_count + 1 WHERE call_id = ?",
                (call_id,))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_tool_call failed: %s", e)


def on_tool_result(call_id, tick_id, name, response):
    init()
    if not _initialized or not name:
        return
    try:
        resp_text = response if isinstance(response, str) else json.dumps(response)
        with _connect() as c:
            # Attach response to the most recent matching tool_call row.
            row = c.execute(
                "SELECT id FROM cdr_tool_calls WHERE call_id = ? AND name = ? "
                "ORDER BY id DESC LIMIT 1", (call_id, name)).fetchone()
            if row:
                c.execute("UPDATE cdr_tool_calls SET response = ? WHERE id = ?",
                          (resp_text[:2000], row["id"]))
            else:
                # Result without a prior call row — store it as a standalone entry
                c.execute(
                    "INSERT INTO cdr_tool_calls (call_id, ts, tick_id, name, response) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (call_id, int(time.time()), tick_id, name, resp_text[:2000]))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_tool_result failed: %s", e)


def on_utterance(call_id: str, role: str, content: str, ts: float | None = None,
                 source: str = "live") -> None:
    """Persist a single spoken line. Called from the live path each time
    a `turn` event arrives at /events or a `/speaker-event` POST lands.
    The unique index on (call_id, ts, role, content) makes this idempotent
    — a duplicate insert from the conversation_log bulk-import is a no-op."""
    init()
    if not _initialized or not call_id or not role or not content:
        return
    role = role.strip().lower()
    if role not in ("customer", "rep", "agent"):
        return
    if role == "rep":
        role = "agent"  # normalize on write; class names elsewhere can keep using "rep"
    try:
        with _connect() as c:
            c.execute(
                "INSERT OR IGNORE INTO cdr_transcripts "
                "(call_id, ts, role, content, source) VALUES (?, ?, ?, ?, ?)",
                (call_id, ts if ts is not None else time.time(),
                 role, content.strip()[:2000], source))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_utterance failed: %s", e)


def on_conversation_log(call_id: str, log_rows) -> int:
    """Bulk-import the relay's post-call `transcribe.conversation_log` payload.

    ``log_rows`` is the SignalWire structured transcript — a list of dicts
    each with at least ``role``, ``content``, optionally ``timestamp``.
    The unique index means rows already captured live are skipped; only
    utterances we missed (or the SDK delivered directly to the browser)
    get persisted. Returns the number of NEW rows actually inserted."""
    init()
    if not _initialized or not call_id or not isinstance(log_rows, list):
        return 0
    inserted = 0
    base_ts = time.time()
    try:
        with _connect() as c:
            for i, row in enumerate(log_rows):
                if not isinstance(row, dict):
                    continue
                content = (row.get("content") or row.get("text") or "").strip()
                role = (row.get("role") or "").strip().lower()
                if not content or not role:
                    continue
                if role not in ("customer", "rep", "agent",
                                "user", "assistant", "remote-caller", "local-caller"):
                    continue
                # Map SignalWire / OpenAI-style roles onto our own
                # customer/agent vocabulary. In this app's call shape
                # (customer_role=local-caller): the PSTN customer is the
                # `local-caller` leg, the agent's browser is `remote-caller`.
                role_map = {
                    "rep":           "agent",
                    "remote-caller": "agent",
                    "assistant":     "agent",  # OpenAI-style log: AI speaks for agent
                    "local-caller":  "customer",
                    "user":          "customer",  # OpenAI-style log: human is the customer
                }
                role = role_map.get(role, role)
                if role not in ("agent", "customer"):
                    continue
                # Use the row's own timestamp if present, otherwise sequence
                # them after `base_ts` so they sort right relative to live rows.
                ts = row.get("timestamp")
                try:
                    ts = float(ts) if ts is not None else base_ts + i * 0.001
                except (TypeError, ValueError):
                    ts = base_ts + i * 0.001
                cur = c.execute(
                    "INSERT OR IGNORE INTO cdr_transcripts "
                    "(call_id, ts, role, content, source) VALUES (?, ?, ?, ?, ?)",
                    (call_id, ts, role, content[:2000], "conversation_log"))
                if cur.rowcount:
                    inserted += 1
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_conversation_log failed: %s", e)
    return inserted


def on_recording(call_id: str, recording_id: str, duration_s: float | None = None,
                 status: str | None = None, format_: str | None = None,
                 media_url: str | None = None) -> None:
    """Persist the recording info associated with this call. Idempotent —
    REPLACE on (call_id) means a later 'completed' status overwrites the
    earlier 'started' row with final duration + media URL."""
    init()
    if not _initialized or not call_id or not recording_id:
        return
    try:
        with _connect() as c:
            c.execute(
                "INSERT OR REPLACE INTO cdr_recordings "
                "(call_id, recording_id, ts, duration_s, status, format, media_url) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (call_id, recording_id, int(time.time()),
                 duration_s, status, format_, media_url))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_recording failed: %s", e)


def get_recording(call_id: str) -> dict | None:
    """Lookup the recording row for ``call_id``. Returns None if no
    recording has been captured yet (call still in progress, or
    recording was never enabled for the call)."""
    init()
    if not _initialized or not call_id:
        return None
    try:
        with _connect() as c:
            row = c.execute(
                "SELECT recording_id, duration_s, status, format, media_url "
                "FROM cdr_recordings WHERE call_id = ?",
                (call_id,)).fetchone()
        return dict(row) if row else None
    except Exception as e:  # noqa: BLE001
        log.warning("cdr get_recording failed: %s", e)
        return None


def on_error(call_id):
    init()
    if not _initialized:
        return
    try:
        with _connect() as c:
            c.execute(
                "UPDATE cdr_calls SET errors_count = errors_count + 1 WHERE call_id = ?",
                (call_id,))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_error failed: %s", e)


def sweep_stale(stale_after_s: int = 600) -> int:
    """Close out calls whose `on_final` never arrived.

    A common cause is a container rebuild mid-call: the WS dies before the
    relay sends the final event, so the row's ``ended_at`` stays NULL and
    the CDR page paints the row as live forever.

    Heuristic: if ``started_at`` is older than ``stale_after_s`` AND
    ``ended_at IS NULL``, seal the row with ``end_reason='stale'``. We
    set ``ended_at`` to the last tool_call timestamp if any (more accurate
    than 'now' since the call probably actually died at that moment), or
    ``started_at + stale_after_s`` as a safe floor.

    Returns the number of rows closed. No-throw — logs a warning on error
    and returns 0 so a CDR bug can't break the live UI."""
    init()
    if not _initialized:
        return 0
    cutoff = int(time.time()) - int(stale_after_s)
    try:
        with _connect() as c:
            rows = c.execute(
                "SELECT call_id, started_at FROM cdr_calls "
                "WHERE ended_at IS NULL AND started_at < ?",
                (cutoff,),
            ).fetchall()
            count = 0
            for r in rows:
                cid = r["call_id"]
                started = r["started_at"]
                last_ts_row = c.execute(
                    "SELECT MAX(ts) AS last_ts FROM cdr_tool_calls WHERE call_id = ?",
                    (cid,),
                ).fetchone()
                last_ts = (last_ts_row["last_ts"] if last_ts_row else None) or 0
                ended_at = max(last_ts, started + int(stale_after_s))
                duration_ms = max(0, (ended_at - started) * 1000)
                c.execute(
                    "UPDATE cdr_calls SET ended_at = ?, duration_ms = ?, "
                    "end_reason = COALESCE(end_reason, 'stale') WHERE call_id = ?",
                    (ended_at, duration_ms, cid),
                )
                count += 1
            if count:
                log.info("cdr sweep_stale closed %d open call(s)", count)
            return count
    except Exception as e:  # noqa: BLE001
        log.warning("cdr sweep_stale failed: %s", e)
        return 0


def on_final(call_id, duration_ms, summary, end_reason="normal"):
    init()
    if not _initialized:
        return
    try:
        with _connect() as c:
            c.execute(
                "UPDATE cdr_calls SET ended_at = ?, duration_ms = ?, summary = ?, "
                "end_reason = ? WHERE call_id = ?",
                (int(time.time()), int(duration_ms or 0),
                 str(summary or "")[:4000], end_reason, call_id))
    except Exception as e:  # noqa: BLE001
        log.warning("cdr on_final failed: %s", e)


# ---------------------------------------------------------------------------
# Read path — used by the /cdr/api endpoint
# ---------------------------------------------------------------------------

def summary_stats():
    """Aggregate stats across all recorded calls."""
    init()
    if not _initialized:
        return {}
    try:
        with _connect() as c:
            # total_insights = native insight events + tool_result prose
            # (coaching). Mirrors the per-call/list view fold so the
            # summary chip can't disagree with the list it summarises.
            row = c.execute("""
                SELECT
                    COUNT(*)                            AS total_calls,
                    COALESCE(SUM(duration_ms), 0)       AS total_ms,
                    COALESCE(AVG(NULLIF(duration_ms,0)), 0) AS avg_ms,
                    COALESCE(SUM(insights_count), 0)
                        + (SELECT COUNT(*) FROM cdr_tool_calls
                           WHERE name != 'sidecar_skip'
                             AND response IS NOT NULL
                             AND response NOT IN
                                 ('', 'ok', '"ok"', '{"response":"ok"}'))
                                                       AS total_insights,
                    COALESCE(SUM(skips_count), 0)       AS total_skips,
                    COALESCE(SUM(tool_count), 0)        AS total_tools,
                    COALESCE(SUM(errors_count), 0)      AS total_errors,
                    COUNT(CASE WHEN ended_at IS NULL THEN 1 END) AS active_calls
                FROM cdr_calls
            """).fetchone()
            tools = c.execute("""
                SELECT name, COUNT(*) AS n
                FROM cdr_tool_calls
                WHERE name != 'sidecar_skip'
                GROUP BY name ORDER BY n DESC
            """).fetchall()
        return {
            **{k: row[k] for k in row.keys()},
            "tool_breakdown": [{"name": t["name"], "count": t["n"]} for t in tools],
        }
    except Exception as e:  # noqa: BLE001
        log.warning("cdr summary failed: %s", e)
        return {}


def recent_calls(limit=50):
    """List recent calls newest-first.

    Adds ``coaching_count`` to each row: the number of non-skip tool
    calls whose response carried prose for the rep. The endpoint folds
    this into ``insights_count`` so the list view's count matches the
    detail panel (which already merges native insights + synthesised
    coaching). The underlying ``cdr_calls.insights_count`` column
    remains the strict count of native ``insight`` events.
    """
    init()
    if not _initialized:
        return []
    try:
        with _connect() as c:
            rows = c.execute("""
                SELECT c.*,
                       COALESCE(t.coaching_count, 0) AS coaching_count
                FROM cdr_calls c
                LEFT JOIN (
                    SELECT call_id, COUNT(*) AS coaching_count
                    FROM cdr_tool_calls
                    WHERE name != 'sidecar_skip'
                      AND response IS NOT NULL
                      AND response NOT IN ('', 'ok', '"ok"', '{"response":"ok"}')
                    GROUP BY call_id
                ) t ON t.call_id = c.call_id
                ORDER BY c.started_at DESC, c.rowid DESC
                LIMIT ?
            """, (int(limit),)).fetchall()
        return [dict(r) for r in rows]
    except Exception as e:  # noqa: BLE001
        log.warning("cdr recent_calls failed: %s", e)
        return []


def objection_breakdown(limit=50):
    """Group log_objection tool calls by category, with recent details.

    Each entry: {category, count, recent: [{ts, call_id, summary, rebuttal}, ...]}
    The args column is JSON; we parse it lazily to pull out category + summary
    without forcing a schema. Rows we can't parse are bucketed as 'unknown'.
    """
    init()
    if not _initialized:
        return []
    try:
        with _connect() as c:
            rows = c.execute(
                "SELECT ts, call_id, args, response FROM cdr_tool_calls "
                "WHERE name = 'log_objection' ORDER BY id DESC LIMIT ?",
                (int(limit),)
            ).fetchall()
    except Exception as e:  # noqa: BLE001
        log.warning("cdr objection_breakdown failed: %s", e)
        return []

    by_cat: dict[str, dict] = {}
    for r in rows:
        try:
            a = json.loads(r["args"] or "{}")
        except (TypeError, ValueError):
            a = {}
        cat = (a.get("category") or "unknown").strip().lower() or "unknown"
        bucket = by_cat.setdefault(cat, {"category": cat, "count": 0, "recent": []})
        bucket["count"] += 1
        if len(bucket["recent"]) < 5:
            bucket["recent"].append({
                "ts": r["ts"],
                "call_id": r["call_id"],
                "summary": a.get("summary") or "",
                "rebuttal": r["response"] or "",
            })
    return sorted(by_cat.values(), key=lambda b: b["count"], reverse=True)


def competitor_breakdown(limit=50):
    """Group lookup_competitor tool calls by competitor name.

    Each entry: {competitor, count, last_response, last_ts, last_call_id}.
    """
    init()
    if not _initialized:
        return []
    try:
        with _connect() as c:
            rows = c.execute(
                "SELECT ts, call_id, args, response FROM cdr_tool_calls "
                "WHERE name = 'lookup_competitor' ORDER BY id DESC LIMIT ?",
                (int(limit),)
            ).fetchall()
    except Exception as e:  # noqa: BLE001
        log.warning("cdr competitor_breakdown failed: %s", e)
        return []

    by_comp: dict[str, dict] = {}
    for r in rows:
        try:
            a = json.loads(r["args"] or "{}")
        except (TypeError, ValueError):
            a = {}
        name = (a.get("competitor") or "unknown").strip()
        if not name:
            name = "unknown"
        # Skip "No file on X" fallback responses — those are misfired
        # lookups (the AI asked about something that's neither in our
        # curated competitor file nor findable via the live SEC/GDELT
        # path). Treating them as competitors clutters the breakdown with
        # names like "acne", "IBM", "Willio" that aren't real entries.
        # The response is stored either as a raw string or wrapped in
        # JSON {"response":"…","action":[...]} depending on whether the
        # tool returned a bare FunctionResult or one with actions — match
        # on substring so both shapes are covered.
        resp = (r["response"] or "")
        if "No file on " in resp:
            continue
        key = name.lower()
        bucket = by_comp.setdefault(key, {
            "competitor": name, "count": 0,
            "last_response": "", "last_ts": 0, "last_call_id": "",
        })
        bucket["count"] += 1
        # rows come newest-first; first hit wins for "last_*"
        if not bucket["last_ts"]:
            bucket["last_ts"] = r["ts"]
            bucket["last_call_id"] = r["call_id"]
            bucket["last_response"] = resp
    return sorted(by_comp.values(), key=lambda b: b["count"], reverse=True)


def funnel_stats():
    """How often does each kind of signal actually fire on a call?

    Returns counts of *distinct calls* that produced each kind of event.
    Useful to show 'X of Y calls had at least one insight', etc.
    """
    init()
    if not _initialized:
        return {}
    try:
        with _connect() as c:
            total = c.execute("SELECT COUNT(*) FROM cdr_calls").fetchone()[0]
            with_insight = c.execute(
                "SELECT COUNT(DISTINCT call_id) FROM cdr_insights").fetchone()[0]

            def n_tool(name):
                return c.execute(
                    "SELECT COUNT(DISTINCT call_id) FROM cdr_tool_calls "
                    "WHERE name = ?", (name,)).fetchone()[0]

            with_objection = n_tool("log_objection")
            with_competitor = n_tool("lookup_competitor")
            with_signal = n_tool("flag_buying_signal")
            with_followup = n_tool("schedule_followup")
            with_escalation = n_tool("escalate_to_supervisor")
        return {
            "total":         total,
            "with_insight":     with_insight,
            "with_objection":  with_objection,
            "with_competitor": with_competitor,
            "with_signal":     with_signal,
            "with_followup":   with_followup,
            "with_escalation": with_escalation,
        }
    except Exception as e:  # noqa: BLE001
        log.warning("cdr funnel_stats failed: %s", e)
        return {}


def call_detail(call_id):
    """Full record for one call: row + insights + tool calls."""
    init()
    if not _initialized:
        return None
    try:
        with _connect() as c:
            call = c.execute(
                "SELECT * FROM cdr_calls WHERE call_id = ?", (call_id,)
            ).fetchone()
            if not call:
                return None
            insights = c.execute(
                "SELECT ts, tick_id, text FROM cdr_insights "
                "WHERE call_id = ? ORDER BY id ASC", (call_id,)).fetchall()
            tools = c.execute(
                "SELECT ts, tick_id, name, args, response FROM cdr_tool_calls "
                "WHERE call_id = ? ORDER BY id ASC", (call_id,)).fetchall()
            transcript = c.execute(
                "SELECT ts, role, content, source FROM cdr_transcripts "
                "WHERE call_id = ? ORDER BY ts ASC, id ASC", (call_id,)).fetchall()
        return {
            "call": dict(call),
            "insights": [dict(r) for r in insights],
            "tool_calls": [dict(r) for r in tools],
            "transcript": [dict(r) for r in transcript],
        }
    except Exception as e:  # noqa: BLE001
        log.warning("cdr call_detail failed: %s", e)
        return None
