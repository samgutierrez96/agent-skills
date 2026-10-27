# Zendesk Drafting Procedure

**When this conflicts with `skills/zendesk-record-retrieval/SKILL.md` or
`AGENTS.md`, those win.** Do not draft from rules that exist only
here.

Followed on every ticket. Companion docs: `zendesk-voice-and-rules.md` (voice, business rules, failure modes) and `zendesk-retrieval-reference.md` (query patterns, field paths, traps).

---

## Step 1 — Read the ticket, extract entities

**Known limitation:** Glean's indexed copy of an email ticket can omit the sender's name and signature block even when it reports "~100% of document shown." On #4692559 the sender was Jason; the indexed copy had no name anywhere. For email tickets, if no name appears, ask the operator rather than emitting a placeholder.

**First, always: pull the ticket from Glean.** Pasted ticket text is usually partial — the requester's name, channel, and status live on the Zendesk record, not in the message body. Search `app=zendesk` on the ticket number or the property address before anything else. Skipping this once already produced a draft with a placeholder where a real name was available.

Then pull out: property address, requester name, requester type (seller / buyer / agent / internal), channel (email vs SMS), **ticket date**, and the actual ask.

**Stop conditions — do not draft, flag instead:**
- No property address anywhere in the thread → the reply is `Can I have the property address?` and nothing else. **Exception:** if the question is unanswerable regardless of address — a sold property, a seller's reason for selling, anything past the disclosure ceiling — do not ask for the address. Decline and redirect (rule R8).
- Judgment call, policy exception, or escalation needed → flag, don't draft
- Ticket shape not in the six response shapes → flag

## Step 2 — Look up the record

```
resolveAddress(street, city, state, zip)           → Casa ID
get_property_agent_info([casa_id])                 → seller name, customer UUID,
                                                     agent/brokerage assignment
search_indextrious(
  indexes: ["SELL_DIRECT_OFFER"],
  filters: [{field:"address.uuid", operator:"EQUALS", value:"<casa_id>"}]
)                                                  → offer state, price, created date
```

Add as needed:
- `{field:"offer.is_latest_offer", operator:"EQUALS", value:"true"}` → current offer only
- `{field:"offer.va_traits.has_completed_ssva", operator:"EQUALS", value:"true"}` → self-serve assessment **completed**
- `{field:"offer.va_traits.has_completed_orva", operator:"EQUALS", value:"true"}` → on-site assessment **completed**
- **`indexes:["TASK"]` with `address.uuid` → whether an assessment is SCHEDULED** (`Task Type: seller_full_assessment`, `Status: CONFIRMED`). `va_traits` does not cover scheduling. Always check TASK before telling anyone to schedule or complete an assessment — the appointment may already be booked. Appointment date is not projected; get it from the operator or OpsHub.
- For SMS tickets with no address: `{field:"offer.lead.customer.primary_phone_number", operator:"EQUALS", value:"+1XXXXXXXXXX"}` resolves customer → property.
- `pds_get_property(casa_id)` → physical facts only. **Never** for current sell-request state; its listing data can be years stale.
- `search_indextrious(indexes:["LISTING"], ...)` → listing state and list price for Opendoor-owned homes
- Glean `search` app=zendesk → prior tickets on the same property or requester (often reveals how Opendoor came to own it, COE date, assigned EP)
- **Glean `search` internal XA channels for known knowledge gaps** on any policy question — `#xa-announcements`, `#xa-team-floor-support`. These carry corrections the KB articles were amended *because of*, and they say which detail people keep leaving out. Example: a #xa-announcements post flags that XAs were stating only "under contract" for home sale contingencies and omitting "through the inspection/due diligence period," which the post says creates thrash in future transactions. The KB was corrected as a result. The channel tells you which half of a rule is load-bearing; the KB only tells you the rule.
- **Glean `search` for the Zendesk Help Center article** whenever the question touches fees, valuation, process, or timelines. The HC is indexed and carries approved customer-facing language — e.g. "Agent Acquisition" (assessments must be in the Key App, no pre-existing photos), "Service Charge" (never quote a fee percentage; stay high-level, HSA explains at the final offer call), "Sell Direct" (4-6 days to final offer after assessment). Use the approved wording rather than composing an explanation.

### Always establish lifecycle stage first

```
search_indextrious(indexes:["RENOVATION"],
  filters:[{field:"address.content", operator:"LIKE", value:"<street city state zip>"}])
→ Inventory State
```

`ACQUIRING` / `PREP_FOR_RESALE` / `ON_THE_MARKET` / `SELLING` / `SOLD`. This governs which answers are even coherent — a home in `PREP_FOR_RESALE` is owned and in renovation, not available to buy.

**Do not use `LISTING: ACTIVE` for this.** It reads ACTIVE on homes that are mid-renovation. Verified on 2696 S Arbor Dr (LISTING ACTIVE, inventory `PREP_FOR_RESALE`).

Address filter paths differ per index: `SELL_DIRECT_OFFER` and `LISTING` take `address.uuid` with `EQUALS`; `RENOVATION` takes `address.content` with `LIKE`.

### Buyer/agent "is it still available" questions — special case

First confirm `Inventory State` is `ON_THE_MARKET`. Neither `LISTING: ACTIVE` nor `pds SELL_REQUEST_ACTIVE` is sufficient — both read active on homes still in renovation, and neither distinguishes on-the-market from in-contract or shows whether offers are pending.

The authoritative source is **opendoor.com/makeoffer** — enter the address and it returns one of roughly four states:

- no active offers
- seller is considering offers
- an offer is active
- this home is under contract

*(exact wording not yet confirmed — verify against the live site)*

This cannot be read programmatically: the page is a JS app and the status only renders after an address is entered in the UI. `web_fetch` returns an empty shell. So the draft emits `[NEEDS: offer status from opendoor.com/makeoffer]` and the operator fills it, or the operator supplies it up front.

## Step 3 — Three checks before writing

1. **Time check.** Compare each offer's `created` against the ticket date. An offer created after the customer wrote in is a figure they never saw. Never quote it.

   **Timezones — three are in play, and confusing them produces confident wrong claims.**
   - Index and Zendesk metadata timestamps are **UTC** (`2026-08-05T00:45:32Z`)
   - The operator's Zendesk UI displays **Pacific**
   - The customer is in their **own local** zone, often a third one

   `00:45 UTC` is 5:45pm Pacific, 8:45pm Eastern. Same instant, and the two readings support opposite conclusions about whether someone gave enough notice.

   **Never assert a time-of-day relationship** — "this came in after your 8:30 slot", "you messaged us this morning" — unless all three zones are resolved. Date-level comparisons (offer created before/after the ticket) are safe; hour-level ones are not. If a claim about timing isn't essential to the answer, cut it. Observed live on #4692972: a draft told an agent her request arrived after her own requested showing time when she had actually given nearly three hours of notice, which shifted blame onto her for a delay that was ours.
2. **Negative check.** An empty boolean result means *false or unknown*, not *false*. Never assert a negative from a null result — and never let one become an implied instruction. On #4692576 an empty `has_completed_ssva` silently became "tell him to complete the assessment," when a confirmed appointment already existed in the TASK index. Before instructing anyone to *do* something, confirm it is not already done or scheduled.
3. **Premise check.** Does the record actually confirm the problem the customer describes? If not, the reply says what the record shows — it does not propose a fix. This was the single most common failure in testing.
4. **Disclosure check.** For buyer and agent questions about a listed home, the shareable offer paths are buyer: **licensed agent in Georgia and other agent-required locations; opendoor.com/buy listing where direct buyer submission is available** (confirm the location’s path when unknown; preserve traditional-listing requirements to use an agent), and agent: **opendoor.com/makeoffer** or **homes@opendoor.com**. Internal `SELL_DIRECT_OFFER` records, acquisition prices, prior-owner details, and internal offer state are visible to us and must **not** be repeated to a buyer or agent, even when retrieved and even when relevant.

## Step 3b — Calibration: state what the evidence supports

Two failure directions, both real, both observed live:

**Over-claiming** — asserting facts, actions, or states with no evidence. (#4692559: claimed an internal handoff. #4692576: implied an assessment still needed doing.)

**Over-hedging** — softening a well-evidenced fact into vagueness. (#4692544: wrote "the assessment is complete" when the record supported "completed on August 4th.")

Over-hedging is not the safe option. It hands verification back to the operator, which is the work this is meant to remove, and it reads as evasive rather than careful.

**The test is evidence, not comfort.** A chain of records supporting a conclusion is evidence — state it plainly. Examples that clear the bar:
- TASK `agent_full_assessment` activated Aug 4, status CLOSED, plus a downstream `condition_scoping_ai` task that ran Aug 4 and can only run on assessment data → "the assessment was completed on August 4th" is supportable. Say it.
- `Living Sq Ft: 1482` matching the customer's stated 1,482 → "the square footage is already showing as 1,482 on our end." Say it.

Reserve `[NEEDS: ]` and caveats for data that genuinely is not retrievable — an appointment date the tool does not project, a sender name absent from the index, an attachment that cannot be read. Do not use them to cover an inference that is actually well-founded.

Operator-side cross-check: OpsHub property page → **Assessments & Inspections** shows assessment completion and scheduled appointment dates directly.

## Step 4 — Draft

Load `zendesk-voice-and-rules.md`. In short:

- If a macro covers it, emit the macro **verbatim**. Do not improve it.
- Lead with the lookup: `We see…` / `I see…` / `From what I see here…`
- Offer the next action as a yes/no question
- Concrete timeline plus a calendar guess: `please allow 3-5 business… We are looking for this to appear Friday or Monday`
- One paragraph. Often one sentence. Cut, then cut again.
- Answer only what was asked. Volunteer nothing.
- Pair any refusal with `What we recommend is…`
- `thru`, `anymore`, `3-5 business`, hyphens not em dashes, no bullets
- Unknown values → `[NEEDS: ...]`, never a guess
- **No claimed internal actions** (`I have passed this along`, `I've flagged this with the team`) unless the operator knows the route and will do it. Forward intentions (`I'll make sure it gets to the right team`) are fine; completed actions are not.
- **No implied states** — clauses like *before any work is scheduled* assert something unverified. Cut them.
- After cutting a paragraph, re-read the remainder for orphaned connectors (`also`, `additionally`, `as mentioned`) that no longer refer to anything.
- Emails masked: `the email ending in [NEEDS: suffix]`
- Sign-off on its own lines:
  ```
  Best,
  Sam
  The Opendoor Team
  ```
- **Spacing:** blank line after the greeting, blank line before the sign-off, no blank lines inside the sign-off block. Body is one block, not split into paragraphs.

## Step 4b — Reconcile the draft against the appendix (mandatory)

**This is the most-repeated failure in the log. Three separate tickets.** The pattern is always the same: a verification gap gets correctly identified, written into the fact appendix, and then the draft asserts the thing anyway.

- #4692559 — flagged that "I have passed this along" needed verifying, then wrote it
- #4692576 — noted an empty assessment flag proved nothing, then implied the assessment still needed doing
- #4692972 — wrote "her statement, not verified" about a showing, then referenced "the showing tonight" as fact

**The appendix is a record of what was checked. It is not a disclaimer that permits unverified claims in the prose.**

Mechanical check, every time, after drafting and before sending:

1. List every factual claim in the draft — every state, date, action, entity, relationship.
2. Match each one to a line in the appendix.
3. Anything unmatched gets **cut**, or becomes `[NEEDS: ]`. Not softened, not hedged. Cut.

Special attention to claims the customer supplied. A customer saying they have a showing tonight is not a record that they do. Repeating their claim back as confirmation makes it look verified.

## Step 5 — Attach the fact appendix

Every draft ships with a short provenance block, so it can be spot-checked in seconds:

```
Facts used:
- Offer created 2026-04-26, $203,100 — search_indextrious / SELL_DIRECT_OFFER
- Joseph Foltz is seller lead, no agent assigned — get_property_agent_info
- Assessment completion: no positive flag (NOT evidence of "not completed")
Ticket date 2026-05-04 — all offer figures predate it ✓
```

## Step 6 — Score

Operator marks each draft:
- **Sent as-is**
- **Sent with light edits** (typo / one sentence) — paste the edit back
- **Rewritten** — say what was wrong
- **Wrong facts** — highest priority; the retrieval or a check failed

Target: 70% in the first two buckets. Every edit is profile signal. Wrong-facts cases get diagnosed before continuing.

---

## Note on ingest

Glean's Zendesk index lags live Zendesk, so a brand-new ticket may not be findable by number. For live drafting, paste the ticket text — the lookups in Step 2 work off the address, not the ticket ID.
