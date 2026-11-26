# Zendesk retrieval — fast index

Use the bundled [entry contract](ENTRY.md) once only when AGENTS.md is not already
loaded. The workspace [full playbook](SKILL.md) owns business rules. Reuse loaded
rules, recipes and schemas; never substitute a separate global installation.
Read only the matching route/card and required sections below, not every reference.

## Ticket-first entry

Exact ticket ID → Zendesk get_ticket; read this index alongside it if not loaded.
Reuse sufficient server-supplied ticket evidence after checking identity, freshness,
newest intent and coverage. A request to check latest replies requires current
comments; missing/abbreviated exchanges need the preceding ask and later resolution.
Read [Ticket and newest intent](ROUTING-DETAILS.md#ticket-and-newest-intent) only
when entry, denial, coverage or connector fallback is unresolved. Skip ticket-only.md
when its ticket read is already satisfied. Missing evidence remains unknown.
Route every separate ask from the sender, subject, body and relevant conversation.
Batch independent card/required-tool discovery; dependent IDs wait for verification.
Extract required full-playbook passages by exact heading using
[Targeted playbook reads](ROUTING-GATES.md#targeted-playbook-reads), without a
heading-discovery search. Reuse material already in context on follow-ups.
Use the bundled `scripts/read_playbook.py --section "Exact heading"` through
`python3`; its combined packet budget and revision-bound continuation prevent
large multi-section reads from truncating and being read again. Do not emit
unrelated tool catalogs or raw connector payloads beside the source packet.

## Always-required gates

- Match requester, exact property and current **Qualified flips** before private
  status/next-step claims. Unqualified denial/primary/recency is not qualification.
- Preserve recent same-concern resolution, related-ticket chronology, association,
  Flags/stage, assessment/photo/presentation distinctions, confidentiality and
  Trust & Safety. Missing fields are unknown; no false absence or resolution.
- No new viewing under contract; an appointment confirmed before that stage keeps
  its specific exception. Unknown chronology needs verification, not cancellation.
- Two complete plain copy boxes: customer reply first, internal note second;
  optional appendix last. No current ticket number/process critique in the note;
  include full URLs for different referenced tickets. Exact macros stay verbatim.
- No send, post, close, merge or record change in ordinary drafting. Explicit
  draft-only/read-only overrides standing composer/draft-preparation exceptions.
- STOP/spam cannot swallow privacy, partnership or another substantive ask.
  Unsubscribe footers alone are neither a STOP request nor proof of spam.
- Read matching playbook guidance for photos/video/app/walkthrough/completion;
  the self-contained agent-assessment-photos card satisfies only its narrow branch.
- Uncertain/stale/conflicting business guidance → shared kb-answer-for-callers;
  inspect source content, scope and effective guidance, not just snippets/old sends.
  Unresolved claims stay uncertain; research alone never authorizes a save/action.

## Choose the matching route

Each route keeps its own evidence gates. Combine only routes needed for separate
asks. Read a linked detailed section only for the condition named on that line.

- Agent existing assessment photos → [agent photos](recipes/agent-assessment-photos.md).
- Requested merge, split conversation or same-episode duplicate already answered
  elsewhere → [ticket consolidation](recipes/ticket-merge.md). No-reply does not
  mean no merge; review consolidation before standalone closure.
  Missing capability → verified manual handoff. No automatic merge or closure.
- Ticket number only → [ticket-only](recipes/ticket-only.md) if its initial read is not yet satisfied.
- Latest reply, draft completeness or same-ticket continuation →
  [same-ticket follow-up](recipes/same-ticket-follow-up.md).
- Initial profile deletion → [initial deletion](recipes/privacy-initial.md).
  Portal failure, objection or deletion pushback → [privacy follow-up](recipes/privacy-follow-up.md).
- Mobile-app account deletion → [initial deletion](recipes/privacy-initial.md):
  documented in-app path plus the app-deletion Help Center fallback
  (`support@opendoor.com`); `privacy.opendoor.com` for a personal-information
  deletion. A failed in-app attempt alone is a customer answer, not a hold.
- Remove only one property from an account → [property-only removal](recipes/property-removal.md),
  not automatic whole-account deletion. Mixed cancellation/preliminary-offer and
  deletion asks must also answer the preliminary-estimate/noncommitment concern
  when that stage is verified; retain action-verification gates.
- Seller asks about existing tenants/vacancy at close →
  [tenant-occupancy policy](recipes/tenant-occupancy.md), not rental-scam routing.
- Supplied signed documents/counteroffer acknowledgment →
  [document follow-up](recipes/document-follow-up.md). Do not infer completion.
- Record-specific access/appraisal/inspection/appointment, including disputed or
  canceled visits → [resolution-first access](recipes/access-resolution.md) and
  [department/access details](ROUTING-DETAILS.md#department-and-resolution-first-access).
  A later call disposition alone is not resolution; required notes/Slack chronology remain.
- Offer reconsideration/low-offer dispute, apparently repeated concern or post-assessment update on any channel →
  [repeated-concern check](ROUTING-DETAILS.md#repeated-concern-and-login) before
  OpsHub research; use existing same-ticket checks and no added broad merge scan.
- Simple login/account setup → [repeated-concern/login route](ROUTING-DETAILS.md#repeated-concern-and-login)
  and SKILL.md → Dashboard links and account setup. A missing record-specific fact
  keeps its own checks; simple troubleshooting does not need a full property ladder.
- Simple STOP/unsubscribe → [STOP](recipes/stop-unsubscribe.md).
- Unsolicited listing/marketing email → [unsolicited email](recipes/unsolicited-email.md).
- Mass vendor SMS → [vendor SMS](recipes/vendor-sms.md).
- Rental availability/ad/housing inquiry or suspected rental scam → [rental](recipes/rental.md)
  plus SKILL.md → Rental scams. Access/move-in/belongings/incident history retains
  record checks; rental report boxes also use [report wording](guides/case-wording.md#rental-scam-report-wording).
- Policy/product or transaction expenses/net proceeds → [policy/product](recipes/policy-product.md).
  Net proceeds is not offer-status: [intent/policy details](ROUTING-DETAILS.md#intent-and-policy-routing).
- Policy-only email → [policy-only](recipes/policy-only.md).
- Partnership/referral bonus counts/missing agent transactions → [partnership](recipes/partnership.md).
- CNML closed-home/second-half offer-process/signed-release → SKILL.md → Remaining
  proceeds after resale; follow-ups also read [remaining-proceeds wording](guides/case-wording.md#remaining-proceeds-follow-up-wording).
  No private resale details or scheduled closing date from former ownership alone.
- Offer status → [offer-status](recipes/offer-status.md); offer-refresh-only trouble
  also reads [refresh boundary](ROUTING-DETAILS.md#offer-refresh-trouble).
  Expired offer with ongoing pricing or reconsideration questions →
  [expired-offer refresh wording](guides/case-wording.md#expired-offer-refresh-wording).
- Presented-final-offer discussion / fee questions for the advisor → SKILL.md →
  Per-type recipes → `Seller wants to speak with someone about their final offer`.
  Verify assigned advisor and expiry: listed regular HSA uses their Final offer
  call link; Agent HSA / verified absence from the complete current directory uses
  outreach escalation to that advisor. Expiring soon takes urgent advisor escalation,
  not routine scheduling. A failed sheet read is not absence; draft-only stays draft-only.
- Offer denial → [ticket/qualified-denial stop](ROUTING-DETAILS.md#ticket-and-newest-intent)
  and [denial closing](guides/case-wording.md#offer-denial-closing); no specific reason.
- Low-offer complaint → SKILL.md → Offer complaints, plus
  [intent details](ROUTING-DETAILS.md#intent-and-policy-routing).
- Assessment day/time → [assessment time](recipes/assessment-time.md).
- Seller requests help scheduling an assessment, including "any time" or
  "earliest available" → SKILL.md → Assessment reschedules and confirmations:
  readiness intake before slot selection. Retain supplied availability; if date,
  time or confirmation is ambiguous, clarify that first and wait for the answer
  before readiness intake; otherwise collect missing presence/access details
  together, not another time-preference request.
- Seller asks who can conduct assessment → [provider](recipes/assessment-provider.md).
- Preliminary offer next steps → [preliminary next steps](recipes/preliminary-next-steps.md).
- Seller working with agent → [seller with agent](recipes/seller-with-agent.md).
- Vacant home/lockbox assessment → [vacant assessment](recipes/vacant-assessment.md).
- Code after scheduled assessment → [code follow-up](recipes/assessment-code-follow-up.md).
  Unexplained lockbox details instead use [clarification wording](guides/case-wording.md#unexplained-lockbox-information).
- Any assessment-help invitation → [assessment wording](guides/case-wording.md#assessment-assistance-wording).
- Ordinary buyer/investor interest or first-offer inquiry → self-contained
  [buyer listing](recipes/buyer-listing.md); no broad listing/wording-guide read.
  Its conditional routes preserve access, availability, eligibility and prior-offer checks.
- Buyer condition/systems/layout → [buyer condition](recipes/buyer-condition.md).
- Resale FHA eligibility/active offers → [resale facts](recipes/resale-listing-facts.md).
- Disclosures/records/repair history/listing-agent handoff → SKILL.md → Public listings
  and [structured listing details](ROUTING-DETAILS.md#structured-property-evidence-and-listings).
- Touring/access → [touring](recipes/touring-access.md); denied agent requester →
  [agent verification](recipes/agent-verification.md) and
  [credentials safeguard](ROUTING-DETAILS.md#agent-credentials). Collect every missing
  required field; no phone-only replacement or direct entry while unresolved.
- Backup-offer submission → [backup offer](recipes/backup-offer.md) and
  [submission wording](guides/case-wording.md#offer-submission-wording).
- Open-house inquiry → [open house](recipes/open-house.md).
- Appraisal utilities → [utilities](recipes/appraisal-utilities.md).
- Showami seller-absent access → [Showami access](recipes/showami-vacant-access.md).
- SMS showing-scheduling failure with phone-only assistance →
  [scheduling-failure exception](ROUTING-DETAILS.md#sms-showing-scheduling-failure).
- HOA dues payment → HOAAP@opendoor.com; separate property HOA restrictions/contact
  needs [department/HOA route](ROUTING-DETAILS.md#department-and-resolution-first-access).
- AP follow-up after unpaid invoices → [vendor AP route](ROUTING-DETAILS.md#vendor-ap-follow-up).
- Legitimate misrouted department request → SKILL.md → Department routing when a
  Slack destination is unverified; do not convert it to automatic no-reply/spam.
- Government/fire investigation → [investigation route](ROUTING-DETAILS.md#government-investigations).
- Wrong business/unrelated service → [unrelated request](recipes/unrelated-request.md).
- Driving/temporarily unavailable auto-reply → [driving boundary](ROUTING-DETAILS.md#driving-auto-reply).
- Builder closing-date correction → [builder wording](guides/case-wording.md#builder-closing-date-correction).
- A later call resolved this concern → [resolved-call note](guides/case-wording.md#resolved-call-internal-note).

## Specialist guides — required only for their triggers

- Slack/Pricing escalation or permitted SMS composer entry →
  [action handoffs](guides/action-handoffs.md). Pricing uses its ticket form, not
  a regular Slack message. Read-only requests permit no composer/draft mutation.
- Ranked owner selection/document handoff/assignment → [document handoffs](guides/document-handoffs.md).
- Reusable correction/save or feedback plus revised draft → [operator feedback](guides/operator-feedback.md)
  and [accepted-correction save](guides/case-wording.md#saving-an-accepted-correction).
- Router source-evidence envelope → [Router evidence](guides/router-evidence.md).
  Retained source text only; no extra lookup solely for display.
- Exact customer-read/tool/address/fallback question → matching heading only in
  [shared routing](ROUTING-GATES.md); qualification uncertainty also uses
  [qualified selection](ROUTING-DETAILS.md#qualified-flip-selection).
- Structured offer/assessment/listing evidence gaps →
  [structured evidence](ROUTING-DETAILS.md#structured-property-evidence-and-listings).
  Name the missing fact before one focused fallback. Browser selection uses the
  shared browser-navigation skill: configured Agent 360 for required Router UI
  while native worker access is unverified; desktop availability is separate.
- Missing required recent notes after MCP failure →
  [resolution fallback](ROUTING-DETAILS.md#required-recent-resolution-fallback).

Ambiguous, multi-record, attachment-heavy or missing-rule cases read only matching
full-playbook sections first. Complete playbook reads, if actually required, use
labeled chunks ≤200 lines and ≤12,000 characters, with every continuation inspected.
Never treat truncated output as a completed read. Store large responses, inspect
coverage/contradictions/newer messages, and emit focused source evidence once.
Discover exact recipe-required schemas once; no whole connector catalogs.
No appendix-only research, automatic warm-up or skipped safety check for speed.
[Under-25-second measurement target](VERIFICATION.md) is not a verified claim.
