"""Mock CRM + competitive-intel data used by the sidecar tools."""

from __future__ import annotations

from typing import Any


ACCOUNTS: dict[str, dict[str, Any]] = {
    "APER-001": {
        "name": "Aperture Science",
        "tier": "enterprise",
        "mrr": 48_500,
        "renewal_date": "2026-09-15",
        "nps": 72,
        "open_tickets": 1,
        "products": ["portal-suite", "test-chambers", "neurotoxin-monitor"],
        "owner": "Cave Johnson",
        "notes": "Highly technical buyer; dislikes vague timelines.",
    },
    "BLK-MESA-7": {
        "name": "Black Mesa Research",
        "tier": "growth",
        "mrr": 12_900,
        "renewal_date": "2026-06-30",
        "nps": 41,
        "open_tickets": 4,
        "products": ["anomalous-materials", "lambda-core"],
        "owner": "Eli Vance",
        "notes": "Renewal at risk — pricing complaints in Q1.",
    },
    "TYRELL-9": {
        "name": "Tyrell Corporation",
        "tier": "enterprise",
        "mrr": 87_200,
        "renewal_date": "2027-01-08",
        "nps": 58,
        "open_tickets": 0,
        "products": ["nexus-platform", "memory-implants"],
        "owner": "Eldon Tyrell",
        "notes": "Procurement gatekeeps; align on legal early.",
    },
}


COMPETITORS: dict[str, dict[str, Any]] = {
    "ACME": {
        "pricing": "$99/seat/mo billed annually; no monthly option.",
        "weak_points": [
            "No SSO on standard plan",
            "EU data residency only on enterprise tier",
            "Notoriously slow support (avg 36h response)",
        ],
        "strong_points": [
            "Aggressive discounting on multi-year",
            "Strong brand recognition in mid-market",
        ],
        "win_rate_vs_us": 0.62,
        "talking_points": [
            "We're 20% cheaper at $79 fully-loaded vs their $99 — and SSO is included.",
            "Their EU data residency is enterprise-tier only; we ship it on every plan.",
            "Their average support response is 36 hours — ours is under 4. Pull up an SLA comparison.",
            "If they've been quoted a multi-year discount, anchor on Year-1 vs Year-1: ours wins net.",
        ],
    },
    "GLOBEX": {
        "pricing": "$135/seat/mo, mandatory $20k onboarding.",
        "weak_points": [
            "$20k onboarding fee kills SMB deals",
            "Roadmap stalled since 2025-Q3",
            "Implementation typically 90+ days",
        ],
        "strong_points": [
            "Deep ServiceNow integration",
        ],
        "win_rate_vs_us": 0.78,
        "talking_points": [
            "They charge $20k just to turn it on; our onboarding is included.",
            "Their last major release shipped Q3 2025 — nothing in 9 months. Ask when they last saw a feature delivered.",
            "If ServiceNow integration is the reason, we ship a certified ServiceNow connector — same depth, no rip-and-replace.",
            "Total Year-1 vs Year-1 with onboarding included: we save them ~$28k on a 50-seat deal.",
        ],
    },
    "INITECH": {
        "pricing": "$59/seat/mo, but caps at 250 seats.",
        "weak_points": [
            "Hard 250-seat cap forces re-platform at scale",
            "No audit log export — compliance blocker",
            "Single-region only (us-east)",
        ],
        "strong_points": [
            "Cheapest entry point in the segment",
        ],
        "win_rate_vs_us": 0.41,
        "talking_points": [
            "$59/seat looks great until you hit 250 users — then you migrate. Ask their target headcount in 18 months.",
            "If SOC2 / HIPAA / FedRAMP comes up: they have no audit log export. Hard blocker.",
            "They run single-region us-east. If the prospect has any non-US footprint, surface latency + DR.",
            "Frame it as 'pay less now, pay twice later' — re-platform cost averages $180k once you hit the cap.",
        ],
    },
    "WEYLAND": {
        "pricing": "Quote-only enterprise model; typical 3-year minimum.",
        "weak_points": [
            "3-year lock-in with no out clause",
            "Roadmap controlled by their largest customer",
            "Per-API-call billing on top of seat fees",
        ],
        "strong_points": [
            "Mature audit + compliance tooling",
            "Strong with regulated industries",
        ],
        "win_rate_vs_us": 0.52,
        "talking_points": [
            "Ask: 'Are you OK signing a 3-year lock-in with no exit clause?' That alone kills 40% of their deals.",
            "Their roadmap is driven by their #1 account — surface the risk that the prospect's priorities won't move.",
            "Run their hidden API costs against ours: at 1M calls/mo they invoice $8k on top of seats. Ours is unlimited.",
            "We match them on SOC2, ISO27001, HIPAA — same compliance posture, no 3-year lock.",
        ],
    },
    "UMBRELLA": {
        "pricing": "$149/seat/mo, security tier locked behind +$30/seat.",
        "weak_points": [
            "Security features price-walled into the top tier",
            "Customer reference checks frequently mention 'aggressive renewal pricing'",
            "Browser-only client; no native desktop or mobile",
        ],
        "strong_points": [
            "FedRAMP High authorisation",
            "Public-sector references",
        ],
        "win_rate_vs_us": 0.55,
        "talking_points": [
            "Their security features cost +$30/seat as an add-on. Ours are included — comparable feature, $30 cheaper per seat.",
            "Ask their procurement to check the public reference reviews — 'renewal pricing' is the top complaint.",
            "If mobile or desktop matters at all: they're browser-only. Pull up our native client roadmap.",
            "FedRAMP is real, but if the prospect isn't actually public-sector, they're paying for compliance they don't need.",
        ],
    },
    "CYBERDYNE": {
        "pricing": "$89/seat/mo, plus consumption-based AI fees.",
        "weak_points": [
            "AI usage billed per-token — bills are unpredictable",
            "No on-prem or VPC option",
            "Recent leadership churn (3 CTOs in 18 months)",
        ],
        "strong_points": [
            "Very strong AI/ML marketing presence",
        ],
        "win_rate_vs_us": 0.66,
        "talking_points": [
            "Ask for one current customer's last 3 months of AI invoices. They won't share — bills are wildly inconsistent.",
            "Our AI is included up to fair-use; their token billing has averaged $40/seat/mo overage in our win-loss data.",
            "If the prospect needs on-prem or VPC deployment, they literally cannot offer it. Hard differentiator.",
            "Three CTOs in 18 months — if 'product stability matters' is on the eval criteria, surface this fast.",
        ],
    },
    "MASSIVE-DYNAMIC": {
        "pricing": "$120/seat/mo, custom contracts standard.",
        "weak_points": [
            "Legacy codebase, slow to ship",
            "Heavy professional-services dependency",
            "Industry-average NPS (32)",
        ],
        "strong_points": [
            "Long-established (founded 1998), large customer base",
            "Mature partner ecosystem",
        ],
        "win_rate_vs_us": 0.49,
        "talking_points": [
            "They're the safe / legacy choice — ask the prospect what they want their stack to look like in 5 years.",
            "Their PS dependency means $50k–$200k of services on top of license. Ours is configurable in-product.",
            "Their public NPS is 32. Ours is in the high 60s. Pull up the comparison.",
            "If 'one throat to choke' is the buying criterion, surface our partner network — same coverage, better economics.",
        ],
    },
    "SOYLENT": {
        "pricing": "$45/seat/mo flat — appears as the cheapest option.",
        "weak_points": [
            "No 24/7 support, no enterprise SLA",
            "Single-tenant only on +$200/seat 'business' tier",
            "Recent S-1 filing shows runway < 14 months",
        ],
        "strong_points": [
            "Headline price beats everyone",
            "Vocal user community",
        ],
        "win_rate_vs_us": 0.71,
        "talking_points": [
            "$45/seat headline, but ask about uptime SLA — they don't offer one below the $200 tier.",
            "Their S-1 disclosed 14 months of runway. If the prospect needs a vendor in 2027, ask how they'd feel about that risk.",
            "Single-tenant is +$200/seat — your effective enterprise price is $245, more than us.",
            "Frame it as 'cheapest tool, biggest risk' — fine for hobby teams, not for production.",
        ],
    },
    "WALLACE": {
        "pricing": "$105/seat/mo, recently acquired by a private-equity firm.",
        "weak_points": [
            "PE acquisition in Q1 — pricing changes flagged for 2026-Q3 renewal cycle",
            "Two of three product VPs left post-acquisition",
            "Support ticket SLA quietly increased from 24h to 72h",
        ],
        "strong_points": [
            "Strong integrations into Salesforce + HubSpot",
        ],
        "win_rate_vs_us": 0.58,
        "talking_points": [
            "They were acquired by PE in Q1. Renewal pricing typically rises 20–40% in the second year post-PE. Surface that math.",
            "Two product VPs left after the acquisition — ask the prospect to check LinkedIn before signing.",
            "Their support SLA quietly went from 24h to 72h. Pull up the contract comparison.",
            "If the integration depth is the lock-in, our Salesforce and HubSpot connectors are functionally equivalent — switching cost is days, not months.",
        ],
    },
}


def lookup_account(account_id: str) -> dict[str, Any] | None:
    return ACCOUNTS.get(account_id.upper())


def lookup_competitor(name: str) -> dict[str, Any] | None:
    return COMPETITORS.get(name.upper())
