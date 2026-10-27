# Zendesk retrieval — fast index

Use the bundled [entry contract](ENTRY.md) once if the host has not already loaded
this package's `AGENTS.md`. Reuse loaded rules, recipes and tool schemas.
The workspace [full playbook](SKILL.md) remains authoritative; do not substitute
an independently installed global copy. Connector names below identify capabilities;
other hosts may use equivalent read-only tools without changing the evidence gates.

## First decision

1. Exact ticket ID → Zendesk `get_ticket`; if this index is not loaded, read it
   alongside the ticket in one awaited parallel block when supported. Inspect both
   results before routing. Add comments only for a needed thread or newest inbound.
   Verify ticket, requester, channel and latest customer intent.
   If Zendesk MCP is unavailable, continue with a targeted Glean ticket lookup
   or one focused live Zendesk read; verify ticket number, requester, channel,
   and newest inbound. Missing Zendesk tools alone is not a stop condition.
   Never ask Sam to paste the conversation. Diagnose and pursue the connection
   fix; if no authorized read works, report the exact blocker and repair needed.
   Once the exact
   ticket is retrieved, skip `ticket-only.md`; choose the substantive card directly.
   Load that card and discover only its required schemas together when independent.
   Batch required playbook sections by exact heading using `ROUTING-GATES.md` →
   `Targeted playbook reads`; do not search repeatedly for the same rule.
   Confirmed denial / Opendoor walked away from an offer → stop after the
   decision is established. Support cannot give a specific denial reason. Do not
   investigate assessment, pricing, expired-offer or property history to explain
   it, and do not imply a further lookup can provide a specific reason. Answer
   briefly; target about 20 seconds. Separate substantive asks retain their gates.
2. HOA dues payment → `HOAAP@opendoor.com`; handle a separate ask with its own recipe.
   Property-specific HOA restrictions or contact question → exact address match,
   then `get_hoas_for_property(full:true)` before public-listing fallback or an
   unavailable-information reply. Read “Reading the OpsHub property record” for
   the HOA evidence rule; preserve the required recent-resolution check.
   Access, appraisal, inspection, or appointment request → read
   [resolution-first access](recipes/access-resolution.md). Verify recent OpsHub
   notes/activity before property research or requesting more details. Stop if
   the same concern was already resolved; use Home Visits only if still needed.
   With only a verified WebCustomer UUID, use `get_customer_profile(full:false)`
   to read recent call events and notes before browser fallback; no flip token
   is needed for that tool. Emit focused recent evidence from the retained response.
3. Offer update after an assessment, or another apparently repeated concern on
   any channel → one early Zendesk search before OpsHub research. Use the exact
   street-address phrase when supplied; otherwise use the verified requester
   email. Run it alongside required recipe/section reads. SMS may repeat an email
   under another address. Read matching candidate comments and verify the customer,
   exact property, same concern, prior answer and chronology. A solved/closed
   answer with no changed circumstance or substantive new question takes the
   no-reply/close path; stop retrieval and put the source number in the appendix.
   Status, a name/address alone, or email subjects do not establish resolution.
   No matching answer → normal recipe, without a series of search variants.
   Skip inbound-only fast paths and reuse completed same-ticket checks.
   Simple “cannot log in” / account-setup email →
   [simple login troubleshooting](SKILL.md#dashboard-links-and-account-setup).
   Run the duplicate search alongside that targeted section read. Add comments
   only if the ticket indicates a support exchange or omits the newest inbound.
   Ask what happens/error message and offer the support number; skip OpsHub,
   Glean, and browser unless a separate record-specific request requires them.
4. Choose a card below from the newest customer-written inbound, not an automated
   subject or quoted message. Read only matching cards, together when independent.
   Simple “offer too low” complaint → read `SKILL.md` → `Offer complaints`, then
   use narrow OpsHub MCP reads for the matched customer's stage and assessment
   state. Preserve duplicate and recent-resolution checks. Avoid overlapping
   recipe reads and full-history output; browser only for required facts still
   missing after structured reads.
   Seller asks about expenses/net proceeds and supplies an offer plus mortgage
   payoff → policy/product, not offer-status. Read the matching transaction-expense
   passage under `SKILL.md` → `Per-type recipes`. Ticket plus one focused fee/cost
   policy search supports a high-level reply; skip OpsHub, recent activity, stage,
   assessment and browser reads unless a separate record-specific ask requires
   them. Do not calculate proceeds from the two supplied figures. Failed optional
   record reads do not justify a fallback chain for this policy answer.
   Appraisal readiness or utilities-on request → use the focused
   [appraisal utilities](recipes/appraisal-utilities.md) card. A matching card
   resolves routing ambiguity; do not load the full playbook solely because the
   inbound has a typo or vague pronoun that verified conversation can clarify.
5. Stop when every outward claim and required gate is supported. Skip OpsHub for
   replies supported by the inbound alone. No appendix-only retrieval or write tools.
   Routine final-offer timing: aim for about 20 seconds with focused property,
   assessment, stage, and recent-resolution checks. Skip comments on a complete
   initial question with no indicated support exchange. Batch independent reads;
   retain large responses in memory and emit focused evidence immediately, never
   raw cross-deal history. Preserve Flags/status and assessment gates. Consolidate
   required browser facts into one path, and use a returned assessment task ID
   directly when its completion date is needed to evaluate the timing window.
   See “Routine offer-timing lookup budget” in the full playbook.
   General buyer interest in a named listing → verify and include the exact
   Opendoor property URL with the available photos, floor plans, and home details;
   mention disclosures only if the page shows them.
   Buyer condition/systems question → after required resolution checks and one
   exact address match, use the returned listing URL or at most one focused
   public Opendoor search. No repeated searches, unrelated similar-listing
   pages, extra property reads solely for a URL, or browser/shell workarounds.
   When requested disclosures, records, repair history or transaction details
   remain unanswered, verify and include the assigned listing agent/contact from
   OpsHub `get_acquisition_transaction(panels:["participants"], full:true)` for
   the verified flip, selecting `RESALE_AGENT`. Internal participants take priority
   over public co-listing attribution; do not substitute a brokerage number. This
   focused lookup is permitted; do not promise records or a response.
   If the exact page or requested fact remains unavailable, stop: say the detail
   cannot be confirmed, give the independent-inspection option if they place an
   offer, and record the retrieval gap in the appendix. See the full-playbook
   condition/systems lookup stop rule; separate access/stage gates still apply.
   Listing agent asks Opendoor to conduct/schedule an assessment → explain the
   Opendoor Key App path and that Support cannot schedule it for the agent.
   Skip customer/property, assessment-status, Flags, and browser reads unless a
   separate question needs them; do not assert an unverified stage or completion state.
6. SMS showing-scheduling failure (for example, missing from Aligned Showings)
   with a phone-support-only reply: ticket → property status → required Flags,
   with one focused browser fallback if needed. Skip customer/trust reads and
   unnecessary comments; do not confirm the slot or provide entry instructions.
   A WebCustomer UUID returning “Lead not found” is not a reason to broaden reads
   or guess a customer-page URL. See the full-playbook scheduling-failure exception.

## Recipe pointers

Choose these focused cards directly when the newest inbound matches. For a
multi-part request, combine only the matching cards; keep their required gates.

- [Agent access with verification outstanding](recipes/agent-verification.md)
- [Agent asking about backup offers or how to submit](recipes/backup-offer.md)
- [Buyer condition, systems, or layout question](recipes/buyer-condition.md)
- [Resale listing FHA eligibility or active offers](recipes/resale-listing-facts.md)
- [Unrelated service request / wrong business](recipes/unrelated-request.md)

- [Ticket number only](recipes/ticket-only.md)
- [Same-ticket follow-up](recipes/same-ticket-follow-up.md)
- [Rental wording](recipes/rental.md) — simple rental availability/ad question:
  ticket + “Rental scams” section and its ready SMS wording, then draft. Skip
  comments unless a support exchange/newer inbound is indicated; no context-file
  macro search or OpsHub without a record-specific claim.
- [Unsolicited listing email](recipes/unsolicited-email.md)
- [Email STOP / unsubscribe](recipes/stop-unsubscribe.md)
- [Mass vendor SMS](recipes/vendor-sms.md)
- [Policy/product question](recipes/policy-product.md)
- [Simple login / account setup](SKILL.md#dashboard-links-and-account-setup)
- [Partnership inquiry, agent referral/bonus counts, or missing transactions](recipes/partnership.md)
- [Policy-only email](recipes/policy-only.md)
- [Remaining proceeds / signed release after resale](SKILL.md#remaining-proceeds-after-resale) — preserve referral date and actionable Executive Experience email; verify resale COE separately from acquisition COE.
- [Offer-status questions on any channel](recipes/offer-status.md)
- [Seller asking for assessment day/time](recipes/assessment-time.md)
- [Seller asks whether Opendoor can conduct the assessment](recipes/assessment-provider.md)
- [Preliminary offer next steps](recipes/preliminary-next-steps.md)
- [Seller says they are working with an agent or asks whether the agent can meet instead](recipes/seller-with-agent.md)
- [Seller SMS with a vacant home and lockbox for a same-day assessment](recipes/vacant-assessment.md)
- [Seller sends a lockbox code after a scheduled assessment](recipes/assessment-code-follow-up.md)
- [General buyer interest in a named listing](recipes/buyer-listing.md)
- [Open-house wording on an Opendoor listing](recipes/open-house.md)
- [Touring/access](recipes/touring-access.md)
- [Resolution-first access / appraiser / appointment](recipes/access-resolution.md)
- [Utilities on for an appraisal or inspection](recipes/appraisal-utilities.md)
- [Showami assessment access when seller will be absent](recipes/showami-vacant-access.md)

## Required safeguards

- Under contract → no viewings, including agent previews for backup offers.
  Check listing stage before scheduling guidance. Do not route an in-contract
  viewing to phone support, an app, or a showing service. Backup-offer acceptance
  and a system allowing booking do not override this gate.
- Two separate non-empty plain triple-backtick boxes: customer reply first with
  nothing above it, then internal note. No ticket numbers or process commentary
  in that note. No-send still uses its required bracketed disposition.
- Match every record fact to this requester and property. Missing/empty evidence
  is unknown. Resolve contradictory completion/stage evidence before drafting.
- Photos, video, app, walkthrough, upload or completion questions require the
  matching full-playbook recipe before drafting, including exact product names.
- Stage-sensitive offer/assessment questions require property header Flags/status
  and Assessments & Inspections, with focused browser fallback if structured reads
  omit them. Do not infer presentation from SENT, or photos from Complete alone.
- Trust denied → no code, remote unlock or direct access instructions. Traditional
  listing is a separate property flag. Preserve privacy and escalation exceptions.
- Self-identified agent requesting access with verification outstanding → collect
  missing MLS sign-in number, real estate license number, full name, email,
  phone number, and brokerage name in the ticket. MLS listing area is optional.
  Reuse supplied details, including the verified requester phone; do not replace
  this step with a phone-support referral
  or tell the agent to find a licensed agent. See full-playbook agent verification.
- A simple STOP/spam path cannot swallow a separate support, privacy or partnership
  ask. An unsubscribe footer alone is not a STOP request or proof of spam.
- Privacy/deletion → read “Privacy and deletion requests” in the full playbook
  and the matching #privacy-escalations thread. Approved macros only; escalate
  pushback as directed. Honor case-specific no-further-response instructions.
  Initial customer-profile deletion request → applicable privacy-portal reply
  first; no automatic Slack draft or workflow escalation. The two objection
  responses are conditional follow-ups, not two required initial messages.
  Property-directory absence and duplicate initial tickets do not change that.
  When escalation is warranted, use the channel's Privacy Request Escalations
  workflow; prepare its form for review without submitting, rather than creating
  a regular channel-message draft.
  Mobile-app account deletion and state privacy requests are separate workflows.
- Ambiguous, multi-record, attachment-heavy or missing-rule case → matching full
  playbook sections; load the whole playbook in bounded chunks only when needed.

## Narrow follow-ups

Agent SMS offer timing: use the requester’s thread early to obtain the full
address/property token. After an empty property search, reserve the one retry
until that exact address is known. If the thread supplies the property token,
read that property directly; skip a cross-deal profile lookup. Never pass a
WebCustomer UUID to the sell-direct `get_customer` tool.

Token discipline: discover only recipe-required tools and emit their argument
schemas, not repeated connector-wide documentation. Store large responses and
emit focused evidence once. A tool's `limit` may be ignored; inspect returned
counts/timestamps and retain required notes, newer messages, contradictions and
pagination status before trimming. Never print raw payloads just to search them
again. Reuse loaded rules, schemas and verified identifiers on this ticket.

For the exact customer-read rule, four initial lookup cards, address retry limit,
and live-ticket fallback checks, use only the matching heading in
[shared routing reference](ROUTING-GATES.md). The current project rules remain
required; a short card never overrides a safety or disclosure gate.

Target: under 25 seconds from submission through both complete copy boxes,
subject to the quality checks in [measurement guide](VERIFICATION.md).
This is a target, not a verified performance claim; never skip required evidence
or spend automatic warm-up tokens to meet it.
