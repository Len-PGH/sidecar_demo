"""Free public lookups for live company data.

- SEC EDGAR (https://www.sec.gov/edgar): US public-company filings + facts.
- GDELT DOC API v2 (https://api.gdeltproject.org): real-time global news.

Both are free, no signup. SEC enforces a User-Agent identifying the
caller; GDELT requires nothing.

All functions are best-effort: any HTTP/parse failure returns ``None``
or empty list. Calls cache for a short TTL so we don't hammer SEC on
every chatty agent tick.
"""

from __future__ import annotations

import json
import logging
import time
import urllib.request
from typing import Any
from urllib.parse import quote_plus

log = logging.getLogger("sidecar.live")

# SEC requires a UA they can identify; the recommended format is a
# "Sample Company AdminContact@samplecompany.com" string. They throttle
# / ban opaque UAs.
SEC_UA = "SignalWire Sidecar Demo sales-copilot@signalwire.com"
SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
SEC_SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik}.json"
GDELT_DOC_URL = (
    "https://api.gdeltproject.org/api/v2/doc/doc"
    "?query={q}&mode=ArtList&maxrecords={n}&format=json&sort=DateDesc"
)

# Process-wide caches. EDGAR's ticker list is ~1 MB and never changes
# day-to-day; live lookups are cached for ~10 min so re-mentions on the
# same call don't re-fetch.
_tickers_cache: dict[str, dict[str, Any]] | None = None
_lookup_cache: dict[str, dict[str, Any]] = {}
_LOOKUP_TTL_S = 600


def _http_get_json(url: str, *, ua: str | None = None, timeout: float = 4.0) -> Any:
    req = urllib.request.Request(url)
    if ua:
        req.add_header("User-Agent", ua)
    req.add_header("Accept", "application/json")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


# ---------------------------------------------------------------- EDGAR

def _edgar_ticker_index() -> dict[str, dict[str, Any]]:
    """Lazily fetch + cache the SEC's name -> CIK index.

    The source is keyed by integer; we re-key by lowercased company
    title for fast name lookups."""
    global _tickers_cache
    if _tickers_cache is not None:
        return _tickers_cache
    try:
        raw = _http_get_json(SEC_TICKERS_URL, ua=SEC_UA, timeout=8.0)
    except Exception as e:  # noqa: BLE001
        log.warning("edgar_ticker_index_fetch_failed: %s", e)
        _tickers_cache = {}
        return _tickers_cache
    idx: dict[str, dict[str, Any]] = {}
    for row in raw.values():
        title = (row.get("title") or "").strip()
        if not title:
            continue
        cik = f"{int(row['cik_str']):010d}"
        idx[title.lower()] = {
            "name": title,
            "ticker": row.get("ticker"),
            "cik": cik,
        }
    _tickers_cache = idx
    log.info("edgar_ticker_index_loaded count=%d", len(idx))
    return idx


def _edgar_match(name: str) -> dict[str, Any] | None:
    """Loose name match: exact, then prefix, then substring. Cheap, no fuzz."""
    idx = _edgar_ticker_index()
    if not idx:
        return None
    n = name.strip().lower()
    if not n:
        return None
    if n in idx:
        return idx[n]
    for k, v in idx.items():
        if k.startswith(n):
            return v
    for k, v in idx.items():
        if n in k:
            return v
    return None


def edgar_company_facts(name: str) -> dict[str, Any] | None:
    """Return basic public-company facts for `name`, or None.

    Pulls /submissions for the matched CIK and harvests headline fields:
    SIC industry, fiscal year end, exchanges, most-recent filing form
    and date. Skips deep financials — those need /companyconcept which
    is per-metric and rate-sensitive."""
    m = _edgar_match(name)
    if not m:
        return None
    url = SEC_SUBMISSIONS_URL.format(cik=m["cik"])
    try:
        data = _http_get_json(url, ua=SEC_UA, timeout=5.0)
    except Exception as e:  # noqa: BLE001
        log.warning("edgar_facts_failed name=%r cik=%s: %s", name, m["cik"], e)
        # Even if facts fetch fails, return the basic identity match —
        # gives the agent a confirmed CIK/ticker, which is still useful.
        return {**m, "facts_fetch_failed": True}

    recent = (data.get("filings") or {}).get("recent") or {}
    forms = recent.get("form") or []
    dates = recent.get("filingDate") or []
    last_filing: dict[str, Any] | None = None
    if forms and dates:
        last_filing = {"form": forms[0], "date": dates[0]}

    exchanges = data.get("exchanges") or []
    addr = (data.get("addresses") or {}).get("business") or {}
    hq_parts = [addr.get("city"), addr.get("stateOrCountry")]
    hq = ", ".join(p for p in hq_parts if p) or None

    return {
        "name": data.get("name") or m["name"],
        "ticker": m["ticker"],
        "cik": m["cik"],
        "industry": data.get("sicDescription") or None,
        "sic_code": data.get("sic") or None,
        "fiscal_year_end": data.get("fiscalYearEnd") or None,
        "exchanges": exchanges,
        "hq": hq,
        "website": data.get("website") or None,
        "last_filing": last_filing,
    }


# ---------------------------------------------------------------- GDELT

def gdelt_recent(name: str, limit: int = 4) -> list[dict[str, Any]]:
    """Most recent news mentions of `name` via GDELT DOC API."""
    if not name.strip():
        return []
    # Quote the name so multi-word terms are treated as a phrase.
    q = quote_plus(f'"{name}"')
    url = GDELT_DOC_URL.format(q=q, n=max(1, min(int(limit), 10)))
    try:
        data = _http_get_json(url, timeout=4.0)
    except Exception as e:  # noqa: BLE001
        log.warning("gdelt_fetch_failed name=%r: %s", name, e)
        return []
    arts = (data or {}).get("articles") or []
    out: list[dict[str, Any]] = []
    for a in arts[:limit]:
        out.append({
            # seendate is YYYYMMDDhhmmss UTC; pass through as-is so the
            # frontend can format. None is safe.
            "date": a.get("seendate"),
            "title": (a.get("title") or "").strip(),
            "source": a.get("domain"),
            "url": a.get("url"),
        })
    return out


# ----------------------------------------------------- Combined lookup

def lookup_company_live(name: str) -> dict[str, Any] | None:
    """Combined EDGAR + GDELT lookup for `name`. Caches per name for 10 min."""
    key = name.strip().lower()
    if not key:
        return None
    cached = _lookup_cache.get(key)
    if cached and (time.time() - cached["_at"] < _LOOKUP_TTL_S):
        return cached["data"]

    facts = edgar_company_facts(name)
    news = gdelt_recent(name, limit=4)
    if not facts and not news:
        return None

    out: dict[str, Any] = {"source": "edgar+gdelt"}
    if facts:
        out.update(facts)
    out["recent_news"] = news
    _lookup_cache[key] = {"_at": time.time(), "data": out}
    return out
