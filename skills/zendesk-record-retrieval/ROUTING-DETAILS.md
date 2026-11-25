# Detailed Zendesk routing reference

Preserved routing bodies from the former Fast Index. Read only the exact section
linked by the selected route in FAST-INDEX.md, not this entire file. Current
AGENTS.md and the shared browser-navigation skill govern runtime selection.
Reuse already loaded sections; all evidence and disclosure gates remain required.

## Agent existing photos

- **Agent asks to send/upload existing photos for a client's assessment or
  offer:** use [agent assessment photos](recipes/agent-assessment-photos.md)
  directly. This self-contained card replaces a broad “Per-type recipes” read
  for that branch. Reuse sufficient supplied ticket evidence; verify only the
  required association, qualified stage/assessment and resolution gates, then
  stop. Completed-assessment claims or a separate substantive ask keep their
  matching recipe and evidence requirements.

## Ticket consolidation

- Requested ticket merge, or a split conversation found by the existing related-ticket
  check → [ticket consolidation](recipes/ticket-merge.md). Read the matched
  conversations together before drafting; recommend one continuing ticket and
  preserve the other ticket's full URL. Verify requester, exact property when
  relevant, concern and chronology, not just subjects. Do not auto-merge, auto-close,
  or add a new broad search to every ticket. A merge requires Sam's authorization
  of exact sources and destination plus an actual merge capability; ordinary
  ticket updates are not merges. Missing capability → verified manual handoff.

## Vendor AP follow-up

- Established-vendor payment request → submit through the Trade Partner
  Help Center, https://opendoor.atlassian.net/servicedesk/customer/portal/1133,
  with the vendor's Opendoor-associated email.
  No invented waiting period or response/payment promise; do not repeat only
  the AP referral or send to onboarding. No property/offer lookup for routing
  alone. Existing support ticket → no duplicate; read the full playbook's
  `Vendor payment support` passage for the current #tpm-requests direct-channel
  repeat route, intake, source replies and action boundaries (November 19, 2026).

## Qualified flip selection

- **Qualified flips only:** For every property-specific status/next-step lookup,
  select the requester-matched current flip from OpsHub **Qualified flips** first.
  Never use **Unqualified flips**, including a newer denied record, to determine
  status, routing or next steps. Qualified expired offer ≠ denial. Primary/current,
  recency and `ACTIVE` alone do not establish qualification. If MCP omits it,
  inspect the exact property's Qualified flips section; if none can be verified
  or selection is ambiguous, report the gap rather than infer denial/no offer.
  See `Lifecycle stage`; keep internal flip details out of customer wording.

## Driving auto-reply

- Driving / temporarily unavailable auto-reply with an unknown support need:
  follow AGENTS.md's clarification rule, not automatic no-reply/close. Briefly
  ask how we can help when they are safely parked; no property lookup is needed
  for that generic invitation. Known substantive asks and verified resolution,
  STOP or case-specific no-reply directions keep their normal evidence gates.

## Business evidence

- Classify the request from sender/agency, subject, body and relevant conversation
  together. These signals do not verify authority to receive private details.
  Business guidance that is missing, uncertain, stale or conflicting uses shared
  `kb-answer-for-callers` research within Zendesk before a definitive answer.
  Read relevant source content and resolve scope/effective-date conflicts; if
  unresolved, withhold the disputed claim and state the gap internally. Do not
  reuse saved wording merely because it exists. See AGENTS.md's business-evidence
  gate; research does not itself authorize a durable save or external action.

## Government investigations

- Fire investigator / fire department investigative request → Trust & Safety,
  `lawenforcement@opendoor.com`, not a seller/buyer or listing-team referral.
  Read [government agency investigations](SKILL.md#government-agency-investigations-including-fire).
  Use the saved referral wording, protect property/seller/buyer details, and
  preserve urgent-escalation and callback-intake requirements.

## Offer refresh trouble

- **Offer refresh trouble:** OpsHub MCP → exact address → current primary
  initial/estimated offer on the verified qualified flip. A positively current offer may establish the refresh
  is done, but `SENT` / a new sent date alone does not prove it is viewable.
  This shortcut is only for explicit refresh-only trouble, not resending an
  unseen or expired offer. Resend/visibility requests keep normal assessment
  and property Flags/status checks. **Finalizing / Sent Finalizing Offer** wins:
  say the final offer is being finalized, not that a preliminary offer is
  available to view. Do not replace current
  status with an old SMS-linked lead's expired/denied status. Use a narrow
  address-scoped profile / transaction offer read, then sent-offer state if needed.
  Preserve recent-resolution and requester-association checks; skip assessment,
  photos, visits and browser only for a verified refresh-only answer within this
  scope. Read `Offers` for the
  current-primary rule. Target about 20 seconds, without omitting required gates.

## Ticket and newest intent

1. Exact ticket ID → Zendesk `get_ticket`; if this index is not loaded, read it
   alongside the ticket in one awaited parallel block when supported. Inspect both
   results before routing. Add comments only for a needed thread or newest inbound.
   Verify ticket, requester, channel and latest customer intent.
   A short correction or acknowledgment is not the whole support request. If
   its preceding question/ask is absent, use the retained thread or one focused
   requester SMS/thread read to identify the unresolved concern before drafting.
   Stop once the reply and internal note cover it; do not restart unrelated
   property research. Completeness reviews use [same-ticket follow-up](recipes/same-ticket-follow-up.md).
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
   Confirmed denial / Opendoor walked away from an offer → stop only after the
   current decision is verified on the applicable qualified flip. An unqualified
   denial or a ticket's denial wording is not enough. Support cannot give a specific denial reason. Do not
   investigate assessment, pricing, expired-offer or property history to explain
   it, and do not imply a further lookup can provide a specific reason. Answer
   briefly; target about 20 seconds. Separate substantive asks retain their gates.

## Department and resolution-first access

2. HOA dues payment → `HOAAP@opendoor.com`; handle a separate ask with its own recipe.
   Legitimate misrouted department inquiry / requested Slack escalation → search
   and verify the appropriate channel. If none is verified but the department's
   customer-facing email is, draft the requested referral reply with that email
   plus the internal note, not an automatic no-reply disposition. Read
   [department routing](SKILL.md#department-routing-when-a-slack-destination-is-unverified)
   for the verified AP contact, scope, and no-contact/spam/resolution exceptions.
   Property-specific HOA restrictions or contact question → exact address match,
   then `get_hoas_for_property(full:true)` before public-listing fallback or an
   unavailable-information reply. Read “Reading the OpsHub property record” for
   the HOA evidence rule; preserve the required recent-resolution check.
   Access, appraisal, inspection, or appointment request, including a disputed
   booking or instruction not to send anyone → read
   [resolution-first access](recipes/access-resolution.md). Verify recent OpsHub
   notes/activity before property research or requesting more details. Stop if
   the same concern was already resolved; use Home Visits only if still needed.
   Missed/canceled Showami visit with an escalation link in those notes: read the
   existing Slack thread and check appointment chronology. A bare later call
   disposition is not resolution. Confirmed cancellation/unavailability with no
   superseding resolution supports rescheduling or Opendoor Key App instructions,
   not a generic question about whether help is still needed.
   With only a verified WebCustomer UUID, use `get_customer_profile(full:false)`
   to read recent call events and notes before browser fallback; no flip token
   is needed for that tool. Emit focused recent evidence from the retained response.

## Repeated concern and login

3. Offer reconsideration/low-offer dispute, offer update after an assessment, or another apparently repeated concern on
   any channel → one early Zendesk search before OpsHub research. Use the exact
   street-address phrase when supplied; otherwise use the verified requester
   email. Do this on the first draft, before requesting an address or waiting for
   the customer's next reply; a missing address is not a reason to defer the
   verified-requester search. Reuse a sufficient retained check. Run it alongside
   required recipe/section reads. SMS may repeat an email
   under another address. Read matching candidate comments and verify the customer,
   exact property, same concern, prior answer and chronology. A split conversation
   or same-episode duplicate, including an already answered one, uses
   [ticket consolidation](recipes/ticket-merge.md); surface its
   verified recommendation in this initial review, independently of any still
   missing property detail. Do not infer a match from the requester alone. Related
   history can inform the draft without permission to merge. A solved/closed
   answer with no changed circumstance or substantive new question needs no
   repeat reply, but does not settle consolidation. Recommend an eligible merge
   for a verified same-episode duplicate; otherwise state the exact review gap or
   concrete keep-separate reason. Stop unrelated retrieval and retain the verified
   full source URL in the internal note.
   Status, a name/address alone, or email subjects do not establish resolution.
   No matching answer → normal recipe, without a series of search variants.
   Skip inbound-only fast paths and reuse completed same-ticket checks.
   Simple “cannot log in” / account-setup email →
   [simple login troubleshooting](SKILL.md#dashboard-links-and-account-setup).
   Run the duplicate search alongside that targeted section read. Add comments
   only if the ticket indicates a support exchange or omits the newest inbound.
   Ask what happens/error message and offer the support number; skip OpsHub,
   Glean, and browser unless a separate record-specific request requires them.

## Intent and policy routing

4. Route every ask in the newest customer-written inbound; load matching cards
   together. Scheduling updates do not resolve agent identity; generic submission
   instructions do not resolve a named property's offer status or availability.
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

## Structured property evidence and listings

5. For routine offer/assessment status, use the verified current flip's OpsHub
   `get_acquisition_transaction` with only required `tasks`, `offer`, or
   `flip_details` panels before browser fallback. Exact structured assessment,
   status and Flags evidence satisfies its corresponding page check; do not
   navigate or search the browser to verify the same facts again. Missing fields
   remain unknown: name the specific required gap before one focused browser path.
   Target 20–30 seconds for routine cases without dropping required evidence.
   Stop when every outward claim and required gate is supported. Skip OpsHub for
   replies supported by the inbound alone. No appendix-only retrieval; writes
   remain limited to AGENTS.md's unsubmitted SMS composer entry, verified document-handoff assignment and
   authorized unsent Slack-draft preparation exceptions.
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
   Seller's disclosure request → check the exact property's disclosure/documents
   in OpsHub before an unavailable-information reply or listing-agent referral.
   Use the focused structured read, then that property's document section only
   if needed. When ready, tell Sam to attach it to the email and return both
   attachment-ready reply and internal-note boxes; do not claim attachment/send
   is complete. See "Public listings" for the readiness and handoff safeguards.
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

## SMS showing-scheduling failure

6. SMS showing-scheduling failure (for example, missing from Aligned Showings)
   with a phone-support-only reply, and no known denial or outstanding requester
   verification: ticket → property status → required Flags,
   with one focused browser fallback if needed. Skip customer/trust reads and
   unnecessary comments; do not confirm the slot or provide entry instructions.
   A WebCustomer UUID returning “Lead not found” is not a reason to broaden reads
   or guess a customer-page URL. See the full-playbook scheduling-failure exception.

## Required recent-resolution fallback

- OpsHub MCP auth/read failure does not waive required recent-resolution checks.
  Use the signed-in browser directly at `https://opshub.apps.opendoor.com/search?q=`
  plus URL-encoded verified phone/email; open the observed result and read recent
  notes after loading. Use the shared `browser-navigation` skill's runtime-specific selection:
  configured Agent 360 for required Router UI while native worker access remains
  unverified, or supported native Chrome in desktop chats. Keep the bound-page,
  background-window, measured-timing and focused ready-state controls; do not perform browser/auth debugging during a draft.
  Never use obsolete `opshub.opendoor.com`. If a later call
  resolved this concern, recommend no reply and name its handler in the internal
  note. If required history remains unreadable, withhold the reply and report the
  blocker; do not ask the customer for details merely missing from a failed read.

## Under-contract appointments

- Under contract → no new viewings, including agent previews for backup offers.
  Honor an appointment already scheduled or confirmed before the home went under
  contract; do not honor one booked afterward. Verify listing stage and appointment
  timing before scheduling guidance; unknown timing is not grounds for automatic
  cancellation. Do not route a prohibited new viewing to phone support, an app,
  or a showing service. Backup-offer acceptance and a system allowing booking do
  not override this gate.

## Two-box output

- Two separate non-empty plain triple-backtick boxes: customer reply first with
  nothing above it, then internal note. Omit the current ticket number and process
  commentary; include full URLs for any different verified Zendesk tickets referenced. No-send still uses its required bracketed disposition.

## Matched evidence

- Match every record fact to this requester and property. Missing/empty evidence
  is unknown. Resolve contradictory completion/stage evidence before drafting.

## Assessment recipe requirement

- Photos, video, app, walkthrough, upload or completion questions require the
  matching full-playbook recipe before drafting, including exact product names;
  the self-contained agent assessment photos card satisfies this for its narrow branch.

## Stage-sensitive assessment evidence

- Stage-sensitive offer/assessment questions require property header Flags/status
  and Assessments & Inspections, with focused browser fallback if structured reads
  omit them. Do not infer presentation from SENT, or photos from Complete alone.

## Denied viewing requester

- Denied viewing requester → check actual Home Access self-tourability and stage.
  Self-tourable: required identity verification, not an agent-only requirement.
  Not self-tourable / agent access required: verify agent information. For a
  self-identified agent with verification outstanding, collect missing credentials
  using the agent-verification card; do not replace that step with phone support.
  No code, remote unlock or direct entry while denial/verification is unresolved.
  Preserve under-contract and non-negotiable Trust and Safety/rental-scam gates.

## Agent credentials

- Self-identified agent requesting access with verification outstanding → collect
  missing MLS sign-in number, real estate license number, full name, primary email,
  phone number, and brokerage name in the ticket. MLS listing area is optional.
  Reuse details already in the ticket thread; OpsHub or profile data alone does not
  skip primary email, phone number, or brokerage name in the customer-facing ask.
  Name every still-missing field in the reply, not MLS sign-in and license alone.
  Use `You can also contact us at (888) 352-7075.` in the customer reply; do not use `If you need assistance` before the number. Do not replace credential collection with a phone-support-only referral or tell the agent to find a licensed agent. See
  full-playbook agent verification.

## STOP and separate asks

- A simple STOP/spam path cannot swallow a separate support, privacy or partnership
  ask. An unsubscribe footer alone is not a STOP request or proof of spam.

## Privacy routing

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
  Mobile-app account deletion → the documented in-app path plus the Help Center
  article's approved fallback (`support@opendoor.com`), and
  `privacy.opendoor.com` for a personal-information deletion. A failed in-app
  attempt alone is a supported customer answer, not a hold; reserve the hold for
  a genuinely unresolved request type or eligibility, naming that question.

## Ambiguous cases

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
