# Decisions and conventions (condensed)

Filtered from Cowork Zendesk brain (`zendesk-voice-and-rules.md`,
`zendesk-retrieval-reference.md`, live skill `zendesk-record-retrieval`). **When
this conflicts with `skills/zendesk-record-retrieval/SKILL.md` or
`AGENTS.md`, those win.** Do not draft from rules that exist only
here. Full voice macros / few-shots stay in Cowork originals — not always-on.

_Last condensed: 2026-09-10 for Codex transfer._

## Architecture

- Skill = durable retrieval memory; always-on rules = voice + hard gates only.
- One ticket per chat session (cost); follow-ups on the same ticket stay in-session.
- Every named tool can be missing → degrade and say so; never invent facts.
- Active skill here: **`zendesk-record-retrieval` only**. Notes → `xa-notes`;
  escalations → `xa-quick-slack`. Gumloop skipped.
- Claude `save_skill` / Chrome `ToolSearch` / `visualize:*` are Cowork-era — edit
  this project's `SKILL.md` and use available Codex connectors instead.

## Lookup order (summary)

1. Triage: rental-scam wording → macro; pure policy → Help Center / #xa-announcements.
2. Glean ticket (`app=zendesk`, `num_results: 3`) before Chrome ticket page.
3. OpsHub `list_customers` by phone/email, then the narrowest customer/profile,
   thread, or activity read needed.
4. OpsHub `get_property` / `get_assessment_visits` when the home or assessment is
   the ask.
5. Chrome only when the exact page **Flags** or **Assessments & Inspections** fact
   is missing. `get_special_flags` is not the page Flags block.
6. Gap fill only: `list_properties`, `pds_search_by_address`, `resolveAddress`,
   `get_property_agent_info`, or exact Indextrious CUSTOMER / TASK / offer filters.

OpsHub host is `opshub.apps.opendoor.com` (`.apps` required). Prefer structured
OpsHub reads over Indextrious and browser when they answer. This is a drafting
project: never use OpsHub write tools.

## Index / filter conventions

Fallback only after the narrow OpsHub read is unavailable, ambiguous, or missing
the required field:

| Need | Path |
|------|------|
| Offers | `SELL_DIRECT_OFFER` → `address.uuid` EQUALS |
| Stage | CUSTOMER → `property_engagements.domain_state` (not Listing State) |
| Tasks timeline | TASK → `address.uuid`, sort `activated_at desc` |
| Reno inventory | RENOVATION → `address.content` LIKE (not uuid) |
| Phone SMS | CUSTOMER / offer lead phone E.164 `+1…` |
| Email filter | **Cannot** equality-filter `primary_email` |

`is_latest_offer` is per-flip — multiple ACTIVE offers on one address are normal
internally and **never** surfaced (R7).

## Traps worth remembering

- PDS / listing-side data can be years stale for ownership — do not cite for current
  sell-request state.
- `LISTING: ACTIVE` ≠ on the market; use inventory / engagement stage.
- Empty boolean ≠ false; do not instruct someone to complete what is already done.
- Unit numbers drop on resolve — check siblings.
- Index reflects *now*, not ticket time — compare offer created vs ticket date.
- Indextrious is a cache; consequential facts confirm on OpsHub / lifecycle.
- Natural-language Indextrious queries do not filter — use explicit filters.
- Glean can lag live Zendesk and truncate comments / omit sender names.

## Voice / disclosure (condensed R / F)

| ID | Rule |
|----|------|
| R1 | Answer the ask only; cut unasked process |
| R2 | Vague opener → brief + "What can I help you with?" |
| R3 | Missing address (and you need it) → ask for address only |
| R4 | Tell from record; mask emails |
| R5 | Buyer availability = makeoffer vocabulary only; no internal acquisition data |
| R6 | Never assert unverifiable handoffs / states |
| R7 | One live offer outward |
| R8 | Sold homes + seller motivation → refuse + redirect |
| R9 | Fees high-level; FO highest/best non-negotiable; re-review may not move price |
| R10 | Home-sale contingency: under contract **and** past inspection/DD |
| F1 | Appendix gaps must not appear asserted in the draft |
| F2 | Empty result ≠ negative instruction |
| F3 | Don't over-hedge well-evidenced facts |
| F4 | No hour-level timezone claims across UTC/Pacific/customer local |
| F5 | Rules serve reasoning — skip R3 when address wouldn't help |

## Timing / product (stable)

- FO window: **3–5 business days from assessment completion** (Help Center 4–6 and
  agent-email 2–3 are stale / do not repeat).
- Assessment new if prior > **180 days**.
- Closing window sellers: **21–60** business days (check market nuances); never invent 14.
- Cash Plus upside window **1 year** (early 2026); never quote fee/buyback %.
- Support / access line: **1-888-352-7075**. Rental scam report URL (this
  URL only): `https://www.opendoor.com/rental-scam`. Do not include a “learn
  more” line. XA files Atlassian **10603**. Do not send **10746** or
  `/w/avoiding-rental-scams`. Victim add-ons only when pushed: police + bank
  (funds), Equifax/Experian/TransUnion (SSN), 211 (basic needs / well-being).

## Known gaps

- No tool for Home Access Status / Alfred history.
- No tool for outbound **email body** (subject only).
- No tool for interior layout / MLS remarks — public listing photos, floor plans,
  seller's disclosure only.
- OpsHub comms MCP is live: `get_thread` / `get_activity` read SMS, calls, notes,
  email subjects, trust changes, and transitions. Browser or operator paste is the
  fallback when a required fact is missing.

## Outdated / do not use here

- Mandatory loading of full PRD / discovery narrative (`prd-zendesk-voice-assistant.md`)
- Gumloop automation as a required Codex step
- Inventing Slack drafts or OpsHub note fields in this project
- Quoting Claude Chrome tool names as if they exist in every Codex session
