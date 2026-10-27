---
name: "zendesk-record-retrieval"
description: "Retrieval playbook for Opendoor Zendesk ticket drafting — Zendesk MCP ticket/comments, address resolve, OpsHub customer page, Assessments & Inspections, lifecycle stage and offers, then a paste-ready reply. Auto-apply on any ticket paste, Zendesk id, SMS/email thread, customer message, or when the operator sends an address, phone, or email and needs a draft. Do not wait to be named."
---

# Zendesk record retrieval, Opendoor XA

Retrieval reference for drafting customer-facing Zendesk replies. Voice, formatting,
and the hard business rules for the reply itself live in the project instructions
and are deliberately not duplicated here.

**Routine-ticket speed:** Sam's correction is about completing routine tickets
much faster, not adding another lookup requirement. Use the shortest sufficient
retrieval path, batch independent required reads, reuse loaded rules and schemas,
and extract only relevant facts from retained responses. Avoid overlapping recipe
reads, speculative tool discovery, full-history dumps, and appendix-only research.
Stop and draft as soon as the required evidence gates are satisfied. Prefer
OpsHub MCP for record facts; browser remains a focused fallback for required
missing facts. Preserve verification, but do not expand a straightforward ticket
into a broad investigation. The under-25-second routine target is an aim, not
permission to skip checks or a reason to claim unmeasured performance.


**Packaged entry:** On a host without the bundled project rules already in
context, load [ENTRY.md](ENTRY.md) once before drafting. Install the complete
package, not this file alone. [FAST-INDEX.md](FAST-INDEX.md) links named routine
recipes; [VERIFICATION.md](VERIFICATION.md) defines the under-25-second check.

**Codex note:** This is the retrieval playbook for Zendesk ticket drafting.
Voice, hard business rules (R1–R10), and reply formatting live in the project
always-on rules (`AGENTS.md`) and are deliberately not duplicated
here at length. Output **paste-ready customer reply + separate internal note**,
then an optional operator appendix. Use the
small read-only tool whitelist in the rules: Zendesk MCP `get_ticket` and
`get_ticket_comments` for ticket metadata and comments, Glean for Help Center,
announcements, and broader knowledge searches, OpsHub structured reads for
customer/property/activity, exact address tools when needed, and browser only as
a focused fallback. For browser reads use
`browser_navigate` → `browser_wait` → `browser_get_page_content`; there is no
`browser_batch` in this Codex setup. If Zendesk MCP is missing, use a targeted
Glean ticket lookup or one focused live Zendesk read and verify ticket number,
requester, channel, and newest inbound before continuing. Do not stop solely
because Zendesk tools are unavailable. Never ask Sam to paste ticket conversations
or record blocks. Diagnose and pursue the connection fix, use authorized fallbacks,
and report the exact blocker and repair needed if retrieval remains unavailable.
For missing OpsHub facts, use only the permitted recipe fallback.
Degrade visibly, never invent
credentials, UUIDs, offer amounts, or unverified facts. Skip Gumloop. Sibling projects
`xa-notes` (post-call notes) and `xa-quick-slack` (escalations) live in other
ChatGPT Work folders. Follow AGENTS.md and `xa-quick-slack` for requested or
required escalations: verify the destination, prepare an unsent Slack draft when
applicable, confirm its draft ID, and open the destination. Never send or submit
automatically; keep the internal note accurate about the unsent status. Email
tickets have no OpsHub call note. Estimated/expired offers without a final offer
or contract do not trigger HSA escalation.

**Same-ticket escalation deduplication:** Before preparing a follow-up Slack
draft, compare the newest customer reply with the verified message already posted
in the existing thread. If the issue and requested action are already covered,
leave the escalation pending. A repeated callback request, continued waiting, or
clarification of the same dispute does not by itself warrant another Slack
message. Draft an update only when materially new information changes what the
receiving team needs to do, or the operator explicitly requests another update.
Do not create a second draft merely because a new Zendesk reply arrived.

**Copy-box formatting is mandatory.** For every customer-facing draft, output the
customer reply first inside its own plain triple-backtick fenced block, with nothing
above it, followed by the Zendesk internal note inside a second plain triple-backtick
fenced block immediately after it.
Never leave the customer reply as ordinary prose, and never combine the reply and
internal note in one fence. This applies to normal sends and corrected drafts; on a
no-send disposition, fence the required bracketed no-reply text as the first block.

**Copy-box emission check.** Immediately before sending, verify that both required
fences contain non-empty text: the first contains the complete customer reply and
the second contains the complete internal note. The opening fence must appear before
any reply text, and the closing fence must come after it; never emit a closing fence
without its matching opening fence. If the check fails, repair the formatting before
responding. This check applies even when correcting an earlier draft.

**Internal-note quality gate.** The note must be pasteable and detailed enough to
explain the timeline, evidence, and next operational requirement. It may use
multiple sentences or lines when that makes the record understandable. For
assessment/access tickets, include who handled the related call or note, property
address, scheduled slot, what the assessment lookup showed, and the next
operational requirement. Keep codes out of the note when the code is already in
the ticket unless the operator specifically needs to locate it; say that lockbox
information must be included for a reschedule. Since the note is added inside the
ticket, do not repeat the ticket number. Use the Zendesk MCP inbound together
with the relevant OpsHub records to summarize the full issue concisely; omit
unrelated subject-line or automation context.

Lead the internal note with what the customer requested and the verified
record-backed reason or status. Include a next operational action only when it
is a non-routine requirement or materially helps the next operator; do not
restate routine ticket-resolution steps such as “close the ticket.” For
appointment-cancellation tickets, name the appointment and date being canceled
and explain any verified replacement or conflicting appointment that accounts for
the cancellation (for example, a Friday walkthrough canceled because a Saturday
walkthrough is scheduled). Do not write that a named agent “handled” the request
unless the record explicitly verifies that person as the handler; the note should
describe the ticket facts first, not the operator's drafting or handling activity.

**Load the fast index once per chat.** Read
`skills/zendesk-record-retrieval/FAST-INDEX.md` first for routine tickets, retrieve
the ticket, then read the named card in `recipes/` and the matching full-playbook
section when required by that card or a safety gate. For hard, ambiguous, or
multi-record tickets needing the complete playbook, use explicitly bounded chunks
of at most 200 lines and 12,000 characters each with labeled continuations. Inspect
all required parts; independent chunks may run together within the output budget.
No unbounded remainder, unchunked full read, or acceptance of truncated output.
Reuse loaded material; see ROUTING-GATES.md → Targeted playbook reads.

**Ticket identity is a hard gate.** After any Zendesk MCP result, Glean fallback,
or live Zendesk read,
verify the ticket number, requester, channel, and newest inbound message all match
the operator's ticket before drafting. A browser tab's URL alone is insufficient:
an existing Zendesk workspace tab can display stale or another-ticket content after
navigation. If the visible identity does not match, stop and reacquire the ticket
with one focused live-ticket read; do not draft from the stale pane.

**Use the connector ladder in order.** Zendesk MCP is the first ticket lookup.
For an exact ID, use `get_ticket` directly; add `get_ticket_comments` only when
the thread or newest inbound is needed. Use `search_tickets` only for non-exact
searches. Verify the ticket number, requester, channel, and newest inbound from
the MCP result. OpsHub is
the source for customer, property, assessment, trust, and
offer facts. Use Glean for Help Center, announcements, or broader knowledge
searches. Use Chrome for the focused live Zendesk ticket read, or for an exact
page-only property fact that structured OpsHub reads cannot provide. Do not use
the browser as a general search path, and verify the ticket identity before
relying on any result.

Any per-type recipe below that says “Glean the ticket” or starts with “Glean →”
means “retrieve the ticket with Zendesk MCP first.” Glean remains the path for
Help Center, announcements, privacy/escalation guidance, and broader knowledge
searches. This keeps the recipe-specific OpsHub decisions while removing the
obsolete ticket lookup step.

**MCP ticket fast path.** For a ticket-number-only request, read the ticket with
`get_ticket` directly. Read comments only when the recipe needs the conversation
or newest inbound. Do not use broad or synonymous searches for an exact ID.
Extract requester, channel, newest inbound when available, phone, address, and
appointment details, then continue with the matching OpsHub recipe.

**Inbound-content priority.** Read and answer the actual customer-written inbound
body before interpreting the ticket subject, quoted prior email, automation, or
thread metadata. The newest inbound question is the customer’s intent and must
drive recipe selection and the draft. A subject such as `Your Opendoor password
has changed` or a quoted automated email is context only; do not answer that
automated message instead of the customer’s written question. When the inbound
mentions photos, an app, a walkthrough, or another concrete request, address
that request directly and explain the applicable rule before adding any related
account or campaign context.

**MCP ticket/customer-event cross-check.** A Zendesk ticket can have a misleading
subject or quoted prior email even when the customer is replying to a different,
related Opendoor campaign. If the inbound appears mismatched, use the exact
requester email or phone in `list_customers`, then inspect the narrow
`get_customer_profile`/activity result for the related outbound subject and body
before drafting. In ticket 5031005, the Zendesk thread showed a password-change
subject, while the customer-event record showed the actual related offer email
for 325 McChesney St and the assessment context. Treat the customer’s latest
question plus that verified related event as load-bearing context; do not answer
the misleading subject alone.

**Tabbed property evidence.** A property lookup can expose several operational
tabs. Do not treat a missing assessment result as proof that a Showami visit did
not happen. For assessment/access tickets, check the appointment or visit status,
assigned representative, check-in/attendance, activity notes, photos, and any
assessment artifact as needed. For other customer questions, inspect the relevant
tab directly, such as close of escrow, checkout or digital checkout, pricing, or
Offer Workflow. Avoid unrelated tabs, but do not stop at a single boolean when a
neighboring tab can resolve the customer's actual question.

When a dated completion record or Assessment Report artifact is present, treat it
as stronger evidence than a contradictory `isAssessmentCompleted: false` result
from a stale, mismatched, or narrower endpoint. A sent or accepted final offer is
also positive evidence that the preliminary-offer path has advanced; do not draft
that the assessment is incomplete or that the customer lacks a final offer without
resolving the contradiction first.

The visible OpsHub **Assessments & Inspections** status is authoritative when it
shows `Complete`. Treat that page status as positive completion evidence even when
the structured `get_assessment_visits` or `isAssessmentCompleted` response is empty
or false; do not tell the customer completion is unverified in that case.

Assessment completion does not by itself prove that home photos are present. When
photo presence or the customer's claim that someone photographed the home is
load-bearing, use the OpsHub MCP to inspect the property's **Photos** section and
confirm that photos are explicitly labeled as originating from the assessment.
Do not infer photo capture from `Complete`, an appointment record, or a generic
assessment artifact alone.

For a claimed missed assessment, completed assessment photos, the appointment
history, or a sent final offer are positive evidence that the assessment was
completed. A narrow visit-history read may omit relevant appointment details, so do
not characterize the history as empty unless the complete appointment record was
actually checked. Treat the strongest available assessment evidence as load-bearing
and do not tell the customer that another assessment is needed when completion is
otherwise confirmed.

When multiple customer leads exist for the same address, every assessment photo,
offer, and stage fact must be tied to the ticket requester’s customer or lead before
it is used in a reply. Do not use another customer’s accepted/final offer or photos
to answer the requester, even when both records share the same property.

If the ticket thread shows Support added the requester to an offer and the requester
confirms the offer is visible in their dashboard, treat that requester-specific
dashboard state as load-bearing evidence. Do not override it with an address-level
profile result that points to a sibling or older lead; resolve the lead mismatch
before stating that the offer is expired, missing, or unavailable.

If a seller reports that another account is linked to the property and the property
record shows a separate agent-associated lead, direct the seller to the assigned
agent or brokerage to confirm whether a listing agreement exists for the property.
If it does, the agent can provide the related offer/account information; if it does
not, the seller must work with the agent to terminate or clear that relationship
before the property record can be resolved. Do not merge or alter profiles based on
the shared property alone.

For this evidence check, the linked acquisition transaction's `seller_full_assessment`
task is load-bearing: `status: CLOSED`, `closeCode: assessment_completed`, and a
`completedAt` timestamp establish completion even when `get_assessment_visits`
still returns an upcoming visit. Use the dated task completion for the customer-facing
3–5 business-day final-offer window.

Internal notes must contain only operationally useful customer context, verified
record facts, and the next action. Do not include drafting errors, corrections,
process commentary, or internal critique in the paste-ready note. Before emitting
the draft, scan the internal note and remove the ticket number wherever it appears;
the note is already being added inside that ticket.

Do not apologize or imply Opendoor caused an issue unless the record supports an
Opendoor error. When the customer should be able to access an existing offer or
record through the dashboard, direct them there plainly.

Every customer-facing draft, including privacy or other approved macro language,
must retain the standard paste-ready format: greeting, blank line, body, blank
line, and `Best,` / `Sam` / `The Opendoor Team` sign-off, unless an explicitly
directed verbatim final response forbids any wrapper text.

## Keeping this skill current

**This file is the durable memory for this work. Conversations are not.**

Whenever the operator corrects a draft, states a rule, or teaches something about
how a record behaves, **offer to update this `SKILL.md` in the same turn** (edit
the file in this Codex project). Do not wait to be asked, and do not rely on the
scoring log to carry it — the log is a per-ticket audit trail and does not load
into context. Capture every edit the operator makes to a draft, not only edits
phrased explicitly as a rule — a correction to wording, a fact, or formatting is
itself a rule worth recording.

When the operator directs a change to a drafted email, make the requested change
and record the reusable retrieval or drafting lesson in this skill in the same
turn. Treat each such correction as authoritative workflow guidance for future
tickets.

**Spend a rewrite on a rule that would change a future draft:** a new ticket
shape, a corrected fact, a retrieval path that failed. Do not spend it on a
passing observation about how a page rendered. When the only findings are minor,
hold them and fold them into the next rewrite that a real rule triggers.

Also correct anything here that turns out to be wrong. A stale line in this file is
worse than a missing one, because it will be trusted. If this file ever contradicts
the project always-on rules (`AGENTS.md`), the project rules win,
and this file gets fixed in the same turn.

When saving a correction after this playbook is already in chat, edit the relevant
fast-recipe or rule location directly. Do not re-read the whole file merely to
save one learned rule. Read a small targeted range only if the edit location is
not already available in context.

Then append the scoring row once the operator scores the draft (Sheets ID in
Scoring log below — only if a Sheets connector is available; otherwise remind the
operator to log it).

## Fast recipe index

### HOA dues payment request

If the customer asks Opendoor to make a payment for HOA dues, direct them to
`HOAAP@opendoor.com`, the team that makes all of Opendoor's HOA payments. Do not
direct them to a general HOA contact or invent another payment path. If the
ticket contains a separate property-specific question, handle that distinct
ask with its own recipe after applying this rule.

Use this index to choose the first retrieval budget. The detailed recipe below
still governs, and any returned record can override the apparent ticket shape.
Here and below, **CUSTOMER** means OpsHub `list_customers`. After that lookup,
use the narrowest recipe-named read, but treat `get_property` as a tabbed record,
not as a single assessment field. Inspect the relevant property tabs in that read
when the ticket requires them: Assessments & Inspections, Showami/visit status,
activity, photos, checkout, close of escrow, pricing, or Offer Workflow. Add a
separate read only when the needed tab or identifier is not available in the first
result. Indextrious is fallback only.

**Property-page header tags are load-bearing stage-routing signals.** When the
customer is asking about an offer, assessment, or post-assessment status, read the
top-of-page tags/statuses as part of the property lookup; do not rely on
Assessments & Inspections alone. Use the tags and statuses to determine which
branch applies—initial process, final offer process, finalizing, walked, contract,
contingencies released, or another displayed stage—and then follow that branch's
customer-facing rules. In particular, `Pricing walked` means Opendoor has decided
to walk away from that offer; do not disclose the internal reason or imply that a
final offer is still forthcoming. Do not collapse the other tags into a single
generic status: they may determine different next steps and wording.

- **Ticket number only:** use the verified live Zendesk ticket, then choose the
  recipe.
- **Same-ticket reply in this chat:** use the live Zendesk ticket for the new
  comment. Draft from that inbound plus facts
  already in hand. When live browser access is available, do not ask the operator
  to paste a reply that should be readable from the ticket. Do **not**
  restart customer, property, or visit lookups unless the send needs a fact that
  is not already in the chat. Verified on Laveen AZ ticket 4940704.
- **Agent confirms a message was fraudulent and removed from the MLS:** treat the
  matter as resolved. Recommend no customer reply and leave a one-line internal
  note recording the agent's confirmation; do not request the full message.
- **Rental wording visible in the inbound:** use the verified scam protocol and
  URL. Add OpsHub only when access, a code, move-in, or record-specific history
  matters.
- **Unsolicited listing email:** Glean only, then spam/close.
- **Email STOP / unsubscribe:** Glean only; no-send. Operator processes the email opt-out. Do not draft a confirmation.
- **Mass vendor SMS:** Glean + exact CUSTOMER phone lookup, then stop unless a
  real engagement appears.
- **Policy/product question:** Glean the ticket, and in that same next block
  Glean #xa-announcements (`num_results: 3`). Help Center only if announcements
  are empty. Recent XA tickets are fallback, not the source of record. No
  OpsHub, no Slack native search, no floor-support dump. Verified on
  tenant-occupied ticket 4941136.
- **Buyer’s agent asking if compensation is offered / the amount:** Glean → CUSTOMER on the inbound phone + one listing pin, then Help Center BBC. No Chrome, no former-seller lookup, no commission %.
- **Buyer / BA asking if a named listing has laundry / washer / dryer:** pin the listing, read MLS laundry vs appliances, then `get_addenda` for a signed exclusion. Laundry location is not convey. Checked washer/dryer can be named; empty boxes are not proof they were taken.
- **Offer-status SMS inside the window:** Glean → `list_customers`, then one
  status read. Use `get_sent_offer` for sent/open/expiry status; use exact TASK
  for a post-assessment pricing/underwriting pipeline. Add
  `get_customer_profile` only when the stage, address, or flip cannot otherwise
  be established. No Chrome.
- **Seller email “when is the all-cash / final offer?” quoting an expiry / Book walkthrough campaign:** Glean already has street + campaign. `list_properties` on that street, then `get_sent_offer`. If `PRELIM_OFFER_SENT` and no inspection, point at the campaign walkthrough. No Chrome, no dual profile dumps, not a final-offer wait.
- **Seller wants to speak about a presented final offer:** Glean → CUSTOMER, then the narrow OpsHub customer/profile read for assigned Home Sale Advisor; send that HSA’s Calendly from the directory. Do not redirect to (888) 352-7075.
- **Touring/access:** Glean → CUSTOMER, then read the property Flags before
  offering any path. Add only the browser pages the detailed recipe requires.
  **Exception:** a same-day keypad / lockbox SMS is the already-handled
  recipe below, not Flags.
- **Showing scheduling failure with a requested time, phone-support reply only:**
  For an SMS such as “not on Aligned Showings,” use Zendesk `get_ticket` →
  `list_properties` → `get_property`, with one focused browser fallback for
  Flags if structured data omits them. Add comments only for a needed thread or
  newest inbound. When the reply only directs the requester to phone support
  for verification and availability, skip customer/profile/activity/trust reads:
  no appointment, identity, code, or direct entry is being verified in the reply.
  Traditional-listing requirements still apply; never confirm the requested slot.
  Include the verified full street, city, state, and ZIP. Stop once listing status
  and the required Flags are known. If a customer lookup was already attempted
  and `get_customer` returns “Lead not found” for a `WebCustomer` UUID, do not
  retry that UUID as a lead, broaden to a profile, or guess a customer-page URL.
  Only retrieve more customer data when a separate outward claim requires it.
  Verified routing correction on ticket 5110320.
- **General listing interest / request to connect:** If the inbound only says the
  customer is interested in a named listed home, asks to connect, or asks how to
  tour generally, and does not ask for a code, remote unlock, exact appointment,
  agent-only access, or a record-specific history question, use the fast path:
  Glean → one property lookup/status check. Do not pull CUSTOMER, profile,
  activity, or trust history. If the listing is active, answer directly with
  “the home is available,” the Opendoor app, and (888) 352-7075. Explain that
  Opendoor does not host open houses; customers schedule viewings during the
  property's available viewing window. Do not confirm, repeat, or invent
  open-house times. This is the
  preferred path for low-risk buyer-interest SMS tickets.
  If the customer references a Zillow listing but does not provide the address,
  ask for the Zillow listing link or the property address so the home can be
  identified. An Opendoor link is also acceptable if the customer already has
  one.
- **Named resale listing asking about FHA eligibility or active offers:** After
  resolving the address, use `get_resale_transaction_full` with the property's
  address token and resale flip token. Read `fhaEligibleDate`, `listingState`,
  and `numActiveOffers` from the resale listing. Report the FHA date and active
  offer count directly when present; do not substitute a generic “unable to
  confirm” reply when the resale page contains those fields. Do not surface the
  listing price unless the customer asks for it.
- **Agent same-day keypad / lockbox SMS:** Glean → `list_customers` +
  `get_activity`. If a same-day access call was handled or a Tour complete
  email landed, no-send. No `get_customer`, no profile dump, no property pin,
  no code in the ticket.
- **Showing-late SMS:** Glean → `list_customers` + `get_activity`. If the
  tour already completed, no-send; Zendesk note must say the tour completed.
  Pin / Visits only if activity does not show completed.
- **Seller SMS “what day and time” after assessment matching / claim-wait:**
  Glean → `list_customers` → `get_thread`. If a confirmation or reminder
  already names the slot after the inbound, confirm that date and time. No
  `get_customer`, no `get_activity`, no property pin. Verified on Searcy AR
  ticket 4941123.
- **Bare “hi” / `initial_greeting_sms` after an assessment confirmation in
  the same thread:** Glean → `list_customers` → `get_thread`. If the thread
  already names street + address uuid, do **not** stop with “How can we
  help?” Check OpsHub completion next (`list_properties` / profile
  `initialInspectionAt` / `get_assessment_visits`). If the assessment is
  complete, use the inside-window offer-status send. `get_customer` 404 is
  not a skip. Verified on Lakeville MN ticket 4955112.
- **Named listing + seller finance / cash or DSCR / off-market inventory:** not
  a vendor decline. Pin the listing, answer seller-finance as not offered, then
  Lower.com or ODHL by market. Do not add touring unless they asked to view.
- **Seller listing upgrades / work done on the home** (windows, doors, roof,
  floors, counters): tell them if they accept the presented final offer we
  inspect the home, so they do not need to send the list. For comfort, you may
  say pricing can consider that kind of update and will cross-reference county
  tax records. Do **not** say the upgrades were noted or sent unless the
  operator has already done that. The load-bearing answer is still the
  inspection, not a Home Details count dispute.
- **Seller email sending remaining photos after a completed assessment:** Glean
  → `list_customers` → `list_properties` → `get_customer_profile` by address →
  `get_activity` on the relevant flip/customer timeline when a current refresh
  matters. If the property shows a prior completed assessment/underwriting and
  the activity shows a newer `Offer was sent` event, treat the email as
  supplemental photos during a refreshed offer cycle. Acknowledge the email
  without explaining photo-submission rules, reopening the assessment, or
  claiming the photos changed the offer or were added to the record unless
  explicitly confirmed. When the record supports both dates, tell the customer
  plainly that the assessment was completed on its recorded date and that a
  refreshed offer is visible on its newer recorded date. If the customer asks
  about the offer itself, switch to
  the applicable offer-status recipe and do not surface the amount unless
  permitted. When a refreshed offer is visible but the final offer is still
  pending, tell the customer to allow **3–5 business days** to receive the
  final offer. A customer found by `list_customers` may still 404 in
  `get_customer`; report that connector gap and do not invent or retry
  identifiers.
- **Cancel on an estimated / expired offer (no final offer, never under
  contract):** Glean → `list_customers` → `get_customer_profile` to confirm the
  stage. Add `get_sent_offer` only when final-offer status remains unclear. XA
  confirms we will not move forward. Do **not** Slack the home sale advisor or
  sales support. If the operator asks for a Slack channel update on a different
  email ticket, use `xa-quick-slack` with Slack only (no OpsHub note).
  When the customer has not accepted an offer, explain that they can simply let
  the offer expire when it arrives; do not ask them to cancel a preliminary
  offer or imply that a signed agreement must be terminated.

Do not inspect every connector before this choice. Load only the schemas needed
for the selected recipe, in one parallel block when they are independent, and
reuse them for the rest of the chat. Never inspect Datadog, Data Hub, Offers,
code-search, Slack, browser, or OpsHub write tools speculatively. This project is
read-only: do not send SMS, add notes, edit records, or complete/cancel tasks.

After this playbook is loaded, keep a new ticket to three normal lookup rounds:

1. Inspect the live Zendesk ticket and retrieve its visible comments when the
   inbound thread is needed.
2. Let the ticket choose a recipe, then inspect every remaining named tool in one
   parallel block.
3. Run independent OpsHub calls in one parallel block. A dependent identifier or
   missing load-bearing fact may justify one additional call.

Never inspect `user-opshub` without an exact tool name.

## Speed and token budget

**October 22 operator priority: reduce both end-to-end latency and token use on
future tickets.** Aim for under one minute including verified unsent Slack draft
creation and opening the destination when required. This is an optimization
target, not measured performance; the existing faster routine-ticket target is
also unverified. Preserve all evidence and safety gates.

- **Prior-answer check before offer-status research (all channels):** For an
  offer update after an assessment, or another apparently repeated concern,
  search Zendesk before customer/profile/property reads. With a full address,
  use one exact street-address phrase query across channels; otherwise use the
  verified requester email. Run this search alongside the recipe/required section
  read. SMS can repeat an email exchange under another email address. Inspect
  comments only on a matching candidate, verifying the customer name, exact
  property, concern, answer timestamp and current inbound. A name or shared
  address alone is insufficient. If a solved/closed ticket already answers the
  same question and the new inbound adds no changed circumstance or substantive
  follow-up, stop and recommend no reply/close; cite the source number only in
  the appendix. Do not repeat OpsHub research. A pending exchange, subject-only
  email row, or ticket status without its actual answer does not satisfy this
  gate. If the search has no matching answer, continue the normal recipe; do not
  run a series of name/address/email variants. Skip this search for explicit
  inbound-only fast paths or when an earlier same-ticket check already suffices.
- **Do not fetch comments automatically:** A complete initial SMS description
  with no support exchange does not need `get_ticket_comments` merely because
  the ticket was updated. Retrieve comments when the thread or newest inbound is
  needed, as required by AGENTS.md. Do not add `get_thread` when the verified
  address and identity are already available unless its content is required.
- **Compact at the first response:** Store large connector responses before
  emitting them. Inspect their structure in memory and print a focused view of
  identity, current stage, relevant recent notes/events, timestamps, contradictions,
  counts and pagination. Never print raw profile/history payloads, duplicate
  `content` and `structuredContent`, or use a tool's requested limit as proof of
  completeness. Preserve and inspect every required evidence field.
- **Routine offer-timing lookup budget:** Treat a simple “will the final offer
  come soon?” as a focused timing lookup. Aim for about 20 seconds; this is a
  performance target, not permission to skip evidence gates. After discovering
  unknown schemas, batch independent ticket/index, duplicate-search/section,
  and customer/property reads as their dependencies permit. Do not fetch ticket
  comments when the description contains the complete initial question and no
  support exchange or missing inbound is indicated.
  Preserve the recent-resolution check, requester/property match, current
  offer stage, property Flags/status, and assessment checks. A cross-deal
  profile is justified only for a required field such as recent resolution
  evidence or an assigned advisor; do not pull it merely to identify a property
  already supplied in the ticket. If a required response contains years of
  history, retain it in memory and emit only relevant recent evidence, counts,
  pagination, and contradictions. Never print the raw response first and filter
  it afterward, including when `full:false` returns a large payload.
  When structured reads omit required page facts, consolidate them into one
  browser path and wait for loaded content before reading. Discover only the
  missing schemas and print shared browser instructions once, followed by schema
  declarations only. Stop when the reply and all required gates are supported;
  do not fetch an assessor name, unrelated history, or further completion detail
  solely to enrich the internal note. If an exact completion date is needed to
  decide whether the timing window has passed, use the returned assessment task
  ID directly with `get_task` instead of attempting a browser link first.
- **Browser fallback once ready:** Navigate, await the exact observed section
  label, then read the page. Do not read immediately after navigation/click and
  again after loading. If required facts remain absent, make only the targeted
  follow-up needed for those facts. Once recent property activity reveals a prior
  Support exchange, check its Zendesk answer before inspecting another offer
  record. Never borrow another profile's stage or assessment from a shared address.
- Select the smallest matching recipe before declaring a ticket ambiguous. For
  appraisal/inspection utility readiness use `recipes/appraisal-utilities.md`.
  Load a targeted full-playbook section only for a genuinely missing rule; use
  the complete playbook only for unresolved hard, ambiguous or multi-record cases,
  in the explicitly bounded chunks defined above.
- Discover exact required tools together. Emit argument schemas without repeated
  connector boilerplate; retain and obey any new operational instructions. Do not
  print the entire description of several tools sharing the same browser manual.
  For `ALL_TOOLS` discovery, emit only matching names and the declaration suffix
  beginning at `exec tool declaration:`. Read shared operational instructions once
  per connector when first needed; do not emit them for every matched tool.
- For a fresh exact ticket, discover `get_ticket` first if its schema is unknown,
  then await the ticket and Fast Index read together. Do not read the index first
  merely because tool discovery was needed. A transient ticket-read failure may
  receive one retry; it does not justify unrelated connector discovery.
- Store large connector responses in the execution session and emit a focused
  evidence view once. Preserve identity, property, timestamps, handlers, relevant
  message bodies, newer resolutions, contradictions and pagination. Compacting
  output must not hide unresolved evidence. `limit` is a request, not proof the
  response is bounded: `get_thread` returned substantial history despite limit 10.
- For Slack history, read the exact relevant thread, retain human updates and
  relevant bot status assertions, and omit repeated boilerplate, unrelated
  account identifiers and attachment inventories. Do not trust a bot's all-on
  summary over contradictory verification warnings. Inspect every parallel read.
- For resolution-first agent requests, a property flip's activity may expose only
  the former seller's acquisition history. Check returned identity; that result
  does not satisfy the buyer's-agent recent-notes gate. Use the verified agent's
  customer page rather than expanding the former seller's history.
- OpsHub customer search is `/search?q=` on the verified
  `https://opshub.apps.opendoor.com` host; `/customers` is not an index and 404s.
  Search by verified phone/email, open the observed result, and verify identity.
  If a required browser read remains, choose one browser interface and keep it;
  use another only for a concrete capability gap. Do not repeat browser discovery.
  Navigate directly to that verified search URL, not a guessed host or homepage.
  For a recent-notes fallback, use one verified phone or email search, one bounded
  wait, and one content read. If no usable result appears, report that the notes
  could not be checked; do not alternate identifiers or troubleshoot the browser
  merely to complete this check. Missing notes never establish resolution. If a
  separate required fact remains unavailable, ask for that fact or report the gap
  rather than making an unsupported claim.
- Stop after sufficient evidence and any required draft-ID confirmation. Never
  send an escalation or claim it was sent. Follow-ups reuse valid facts and
  loaded material; do not recreate drafts unless asked.

Optimize for the shortest evidence-backed answer. The first sufficient positive
fact ends retrieval; do not collect appendix-only context. Use one tool call per
independent fact group, batch independent reads, and avoid browser navigation when
structured OpsHub already supplies the outward fact. For every record-specific
reply, preserve AGENTS.md's recent-notes/activity resolution check for the same
requester, property and concern; a later verified resolution takes priority.
Inbound-only policy, spam, STOP and explicit recipe fast paths retain their
exceptions. Beyond that check, read trust or a full customer profile only when a
required access, identity, stage or other recipe fact needs it. Prefer a two- or three-sentence reply over a full
macro when the ticket is simple.

**Token and latency optimization is the default.** Keep this playbook and already
loaded schemas in context across same-ticket follow-ups; never reread them. After
the Zendesk MCP identifies the ticket shape, inspect only the schemas named by that recipe,
then run independent reads in parallel. Do not retrieve customer, property,
activity, trust, offer, or appendix context unless it supports an outward claim,
resolves a required stage/identity gate, or satisfies the required same-concern
resolution check. The recent-notes check is not appendix-only retrieval. Stop immediately when the customer-facing answer is
supported. For simple tickets, favor a compact draft and a concise internal note;
do not spend tokens restating the lookup chain.

Do not request verbose or `full` connector payloads when a compact response supports
the reply. In particular, use `get_sent_offer` only for the status fields the recipe
needs; avoid `full: true` unless a required load-bearing field is absent from the
compact result. Never pass a large raw connector payload through to the user-facing
response. Extract the minimum fields, draft immediately, and do not make a follow-up
lookup merely to enrich the internal appendix.

**Under-25-second target (not yet verified).** Measure submission through both
complete copy boxes using `VERIFICATION.md`, separating fresh-chat and follow-up
runs and recording actual provider usage when available. Do not omit required
evidence to meet the clock. For a routine ticket, use this retrieval budget:

1. Zendesk MCP ticket read: one focused call; add comments only when needed.
2. Recipe/schema selection: one compact pass; do not inspect unrelated catalogs.
3. Independent OpsHub reads: one parallel call containing only the recipe's
   required lookups.
4. One dependent read only if a returned identifier or load-bearing fact requires it.
5. Draft immediately when the outward answer is supported; do not fetch appendix-only
   context or repeat a failed broad search.

If the MCP ticket and inbound itself support the answer, skip OpsHub.
If the MCP is unavailable or omits a load-bearing comment, use one focused live
Zendesk read or targeted Glean fallback, verify ticket identity, and continue with
the narrowest OpsHub recipe. Never spend a latency round printing or
re-reading large tool outputs; extract only the fields needed for the draft.

When the operator supplies or corrects the customer's name, use that corrected
name in the greeting. Do not infer the customer's first name from a one-letter
signature or abbreviated sign-off when the operator has provided the full name.

When a teammate or external source completed or confirmed an action, attribute it
to that named teammate or source. Do not write that I confirmed or completed the
action unless I directly verified it through an authorized lookup.

## Triage first

Before running the retrieval chain at all, check whether the ticket text itself
already resolves the category. Three shortcuts are common enough to name:

- **A rental, lease, or rental-listing signal in the ticket text is itself the
  rental scam signal.** Draft the scam-protocol reply directly, see "Rental scams"
  below. No Glean tag, OpsHub read, or property lookup is needed to confirm it.
  Customer-facing report URL is
  `https://www.opendoor.com/rental-scam` only (not `/w/avoiding-rental-scams`).
  Do not include a “learn more about rental scams” line. Not Atlassian **10746**.
  XA files **10603**. Verified on ticket 4925723.
- **Distinguish unsolicited marketing from a genuine partnership inquiry.** A
  standard unsubscribe footer, the `pshps` tag, or a brokerage signature alone is
  not evidence of spam. Treat an email as a genuine agent/brokerage partnership
  inquiry when the sender identifies themselves and their brokerage or license,
  describes their interest in working with Opendoor, asks about referral or agent
  programs, training, compensation, or a working relationship, or provides a
  resume/accomplishments for consideration. Use the Partnership inquiry recipe;
  do not use the unsolicited-marketing no-send disposition. Treat an email as an
  unsolicited listing/marketing email only when it is a blast pitching a specific
  home or service (listing copy, beds/baths, price, tracking links, or a generic
  promotion) with no genuine partnership or support ask. In that case, fence
  `[No reply recommended. Mark as spam and close.]` and do not repeat spam/close
  in the internal note or appendix. Do not resolve the street they pitched.
- **A mass vendor marketing SMS** (home warranty or similar promo: Attention
  Realtors, gift cards, Call this number, Stop to opt out, no support ask) is
  the same no-send shape. Zendesk MCP ticket read plus CUSTOMER on the phone, then close with an
  internal note. Do not draft a polite decline. A conversational vendor pitch
  on the support line still gets the short decline. See the per-type recipe.
- **A lone STOP (or equivalent opt-out) on a marketing / offer-update email**
  is an email unsubscribe, not an SMS ticket and not a support ask. The Zendesk
  MCP metadata establishes the channel. **Stop.** Fence
  `[No reply recommended. Close ticket.]` Internal note in first person
  (`I processed the email unsubscribe…`), not the agent's name. Do not
  CUSTOMER-lookup, do not open OpsHub, and do not draft a confirmation.
  See the per-type recipe.
- **A pure policy or product question with no customer or property specifics
  needed** skips customer and property retrieval. After the ticket Glean, search
  #xa-announcements in the same block (`num_results: 3`). Help Center next only
  if that is empty. Peer Zendesk tickets are last. Do not open Slack search or
  #xa-team-floor-support unless announcements named a post there.

- **Universal STOP gate:** When an inbound explicitly says **STOP**, “stop
  sending,” or an equivalent request to stop messages or offers, do not draft
  any customer-facing reply. Treat it as a no-reply disposition immediately,
  regardless of channel. Provide only a one-line internal note recording the
  customer's request. Do not perform additional customer, property, activity,
  or offer lookups unless the operator separately asks for them.

Only run the full Zendesk MCP → OpsHub → property chain below when the ticket actually
needs customer- or property-specific facts.

## Attachments

Attachment content is not in the Glean index. Try **at most two reads**: the
ticket page, then a direct fetch of the file if a URL is already in hand. If the
file is a scan, image-only PDF, video, or otherwise unreadable, say so in the
operator appendix and ask the operator what it shows. Do **not** OCR, do **not**
screenshot to read text, and do **not** escalate permissions for a download.
Draft from the ticket text and structured records already in hand; assert nothing
from a file that was not read.

## Browser only when structured OpsHub leaves a required page-only gap

OpsHub MCP is the default after the Zendesk ticket read. Chrome is not a faster way to read a
customer or offer. Do not list tabs, inspect browser schemas, or confirm Chrome
at startup unless the chosen recipe still requires an exact Zendesk or OpsHub
**page** fact after structured reads. Use OpsHub `list_customers`,
`list_properties`, `get_customer` / `get_customer_profile`, `get_thread` /
`get_activity`, `get_property`, `get_assessment_visits`, and `get_sent_offer`
first, but load only the calls the recipe needs. `get_property` often returns
dwelling facts only; that is not a reason to open Chrome. Stage, sent/expiry,
and inspection dates come from `list_properties` + `get_sent_offer` /
`get_assessment_visits`.

`get_special_flags` is not the OpsHub page's **Flags** block and cannot establish
`Traditional listing`. Use `get_assessment_visits`, `list_properties`,
`get_customer_profile`, or the exact TASK read named by the recipe for assessment
status, completion, scheduling, and dates. If the reply still depends on an exact
page-only `Traditional listing` or Assessments & Inspections fact that structured
OpsHub does not return, use one targeted browser page read. Required recent
customer notes or Home Visits that structured reads cannot expose also permit
the focused customer-page fallback in `recipes/access-resolution.md`. Search by
verified phone/email and verify the displayed identity; never substitute a seller's
acquisition activity for the requester's notes. Do not replace these safeguards
with inference.

For a required page, use `browser_navigate` → `browser_wait` →
`browser_get_page_content`. Load only those required browser schemas together and
reuse them. If Chrome is unavailable, say so plainly, name what could not be
checked, and diagnose the connection fix without asking Sam to paste the needed
OpsHub/Zendesk section. Do not quietly
present a thinner record as complete.

**If browser tools error or lose tabs mid-ticket**, name what could not be
checked, continue with the structured tools already in hand, and leave browser
fixing for between tickets. Do not screenshot, switch-tab-debug, or file
extension diagnostics during a draft.

## Order of lookup

This order is deliberate. Structured OpsHub usually ends the ticket without
Chrome or a large Indextrious dump. Stop as soon as the answer is in hand. Two or
three dependent rounds should do it.

**Same-ticket follow-up in this chat does not restart this order.** Read the new
inbound, reuse what the prior draft already used, and send. Look something else
up only when the new send depends on a fact that is not already in the chat.
Re-reading `get_assessment_visits` (or property / profile) to reconfirm a visit
the last outbound already named is wasted wall-clock. Verified on Laveen AZ
ticket 4940704: “You'd be shown by my friend…” after the September 22 3:30 PM
assessment was already confirmed.

1. **The ticket.** Use Zendesk MCP `get_ticket` for an exact ticket number, or
   `search_tickets` for a non-exact search. Add `get_ticket_comments` when the
   full thread or newest inbound is load-bearing. Pasted text is partial;
   requester, channel, status and tags live on the record.
   **Read tags on that first result before opening anything else.**
   `hold_no_agent_replies` is a close-lean, not a skip-lookup: still confirm the
   inbound is already resolved, then recommend no send. An operator comment that
   is only a Slack URL is not directed verbatim; do not open Slack unless the
   comment looks like privacy/ops-directed language or Glean left the ask
   unanswered.
   **Ticket Chrome when the MCP omits a load-bearing comment or the operator
   explicitly asks to check the latest reply.** Read the MCP result first, then use the
   live Zendesk page as the source of truth for the current conversation.
   **SMS:** open `opendoor.zendesk.com/agent/tickets/{ticket_id}` when the
   load-bearing comment is visibly cut off (`[+N chars]`, or a `% of document`
   note with missing body), when Glean is stale, or when the operator explicitly
   asks to check the latest reply. Do not open Chrome only because tags or status
   “might” be missing. **Email:** Glean often
   dumps the campaign body and hides requester email. That is **not** a Chrome
   trigger when the quoted campaign already names a street (or Glean has a
   first and last name): go to OpsHub `list_properties` / `list_customers`.
   Open Chrome for identity only if Glean left both the requester email **and**
   the street missing and the recipe actually needs them. Never open Chrome
   “just in case.” Ticket 4940804 wasted a round on the Zendesk page after
   Glean already showed David, 71 Bowman Ridge Rd, and Book walkthrough.
   **If the last inbound message is a closing acknowledgment** ("thanks", "thank
   you") with no new question, and the prior outbound already resolved the ask, do
   not draft a reply at all, the ticket should simply be closed. Stop here, at
   ticket-level Zendesk MCP read plus at most one Chrome read of the ticket page. Do not pull
   OpsHub or the property page when the thread itself already answers the ticket.
   For a required ticket page, navigate, wait for the ticket content, then read the
   rendered page.
2. **Customer identity.** Use OpsHub `list_customers` on the inbound E.164 phone
   or email. Then make only the one next read the selected recipe names.
   `get_customer` or `get_customer_profile` is for engagement, stage, address,
   flip, assigned advisor, or cross-deal detail—not a default profile dump.
   Phone on the ticket beats address resolution. Duplicate matches remain
   ambiguous; prefer the populated record but never infer a missing engagement.
3. **Conversation or history, only when load bearing.** Use `get_thread` for the
   SMS exchange or `get_activity` for calls, notes, email subjects, trust changes,
   and state transitions. Do not retrieve both unless one leaves a material gap.
4. **Property or assessment, only when load bearing.** Use `get_property` for the
   flip/property record and `get_assessment_visits` for visit history. For offer or
   post-assessment questions, inspect the property-page header tags/statuses as
   well as Assessments & Inspections and Offer Workflow. Use those tags to route
   the response to the matching stage recipe. For `Pricing walked`, the outward
   answer is that Opendoor walked away from the offer, without explaining why.
   Use `get_sent_offer` only when sent/expiry status matters; the returned amount
   stays internal unless an explicit rule permits it.
5. **Exact page fallback.** If `get_property` does not expose the required OpsHub
   **Flags** or **Assessments & Inspections** fact, read that one section in Chrome.
   OpsHub `get_special_flags` is not a substitute for the Flags block.
6. **Only if OpsHub left a gap:** `list_properties`,
   `pds_search_by_address`, `resolveAddress`, `get_property_agent_info`, or exact
   Indextrious CUSTOMER / TASK / `SELL_DIRECT_OFFER` filters.

OpsHub pages render in stages. Navigate, wait for a load-bearing label in the
section the recipe needs, then read the rendered page once. Re-read only when the
first result is visibly incomplete. Do not list tabs first unless an existing-tab
decision is actually needed.

Note `.apps` in the host. `opshub.opendoor.com` is dead. Never guess a URL, ask.

Policy and product questions need no record lookup. Order: #xa-announcements
(`num_results: 3`) in the same block as the ticket Glean when the inbound is
already in hand, then Help Center, then a recent XA ticket. Skip Slack native
search and #xa-team-floor-support unless an announcement points there. An empty
announcements result is a valid stop, not a reason to keep searching.

## Per-type recipes

In these recipes, an "OpsHub customer read" means the narrowest of `get_customer`,
`get_customer_profile`, `get_thread`, or `get_activity`, not a browser page by
default. A "property read" means `get_property` first, with one targeted browser
read only for a required Flags or Assessments & Inspections fact it does not return.

Recurring ticket shapes get a fixed call list here, added as each type recurs. A
recipe names the calls and where to stop, and it saves deciding the path from
scratch. **A recipe does not override the record.** If what comes back contradicts
the shape, the record wins, see "Stage gates the playbook".

- **Seller asks about transaction expenses or net proceeds and supplies an offer
  and mortgage payoff.** Route to policy/product first, not offer-status. An
  address, quoted offer amount, or automated offer-update subject alone does not
  require stage research. Retrieve the ticket, then verify service-charge and
  closing-cost guidance with one focused Glean search (`num_results: 3`); batch an
  announcements check with it if needed. Explain that those two figures alone do
  not establish net proceeds, that the service charge varies and is shown as a
  dollar amount in the final offer, and that standard third-party closing costs
  may apply. Do not calculate net proceeds, quote a fee percentage, or assert
  the customer's offer stage. A general explanation that a Home Sale Advisor can
  explain the final-offer breakdown does not require identifying or contacting an
  assigned advisor. Stop when the policy answer is supported.
  This high-level response is an inbound-only policy path: skip customer,
  property, recent activity, Flags, assessment, sent-offer, and browser lookups.
  Add comments only when the ticket indicates a later response or missing thread;
  search duplicates only when there is evidence of a repeated issue.
  If a separate ask requires the actual itemized costs, a calculated estimate,
  offer status, or an advisor handoff, use that record-specific recipe and its
  required checks. An actual net-proceeds quote still requires the visible Latest
  pricing card under “Selling options, Cash and Cash Plus.”
  If unnecessary record lookups have already failed, return to this policy path;
  do not cascade through profile, property, and browser fallbacks to support a
  generic answer. Identify any unresolved record-specific request in the appendix
  and request only the missing pricing breakdown or notes needed to complete it.
- **Closed-home survey / document request** (buyer or their agent asking for a
  survey, deed, or other closing file from a home they already bought from
  Opendoor). Glean the ticket, CUSTOMER on phone or email, one OpsHub customer
  read for archived transaction notes (COE, title company, file number). Stop.
  Do not draft a customer "we will follow up" as the send. **No outbound until
  Executive Experience confirms whether the file exists.** Paste a Zendesk
  internal note, and also a Slack-style prompt the operator can drop in
  `#closed-homes-customer` or keep as the note even if they do not post there.
  Include: buyer name, address, file number if given, masked transaction
  coordinator email, Zendesk URL, OpsHub customer and property links, close of
  escrow, title company, and that the survey was not visible in OpsHub. Route
  owner is Executive Experience (Sasha Ellison). Tag shape is
  `closed_home__document_request_*`. Verified on Spring TX ticket 4910953.
- **Entry-only or transactional agent asking us to contact the owner.** Glean the
  ticket, CUSTOMER filtered on the address uuid, draft. The customer page is worth
  one batched read for the old brokerage notes and the trust rows, the property page
  is not load bearing unless the reply names a listing or assessment fact. Verified
  on a Raleigh agent-acquisition ticket that scored sent as-is.
- **Partnership inquiry.** First distinguish an agent/brokerage inquiry from a
  non-agent partnership inquiry. For an agent or brokerage asking about Opendoor's
  agent partnership opportunities, direct them to
  `https://www.opendoor.com/agents`: Opendoor partners with hundreds of agents to
  help empower their clients with the freedom to move, and the agent page includes
  agent resources and offer-request and offer-submission links. Do not confuse this
  with `https://www.opendoor.com/w/agents`, which is the offer-request eligibility
  flow. When program details are requested, the standard agent guidance may mention
  1% commission on qualifying transactions and Agent Access Rewards.

  Non-agent partnership categories are Online Real Estate and Homebuilder. Online
  Real Estate partnerships bring Opendoor to more customers through technology
  integrations. Homebuilder partnerships help builders and sales associates offer
  a cash offer on a buyer's current home so the buyer can move forward with a new
  build; the program includes options such as up to a 120-day closing timeline,
  Builder Connect, and List with Certainty. The customer-facing Homebuilder page is
  `https://www.opendoor.com/homebuilder`, and the partnerships team can be reached
  at `partnerships@opendoor.com`. For a general strategic, investment, or other
  non-agent proposal, do not promise terms or invent a program; acknowledge the
  inquiry, ask for team/business details, and offer internal escalation.
- **Bare-keyword SMS ("Help", "Hi", "Yes") tagged `initial_greeting_sms`.** Glean the
  ticket for the two phone numbers, CUSTOMER filtered on `primary_phone_number`, then
  `get_thread` (or one OpsHub customer-page read). **Do not treat the inbound as
  ambiguous until you have read past it.** **The answer is very often a same-day
  inbound phone call that already resolved it**, so read the Calls rows and the
  operator post-call note. When the note says the request was handled, the reply is
  a short confirmation of what was done, and no property-page read is needed because
  no property fact is being asserted. Verified on an agent dashboard-access ticket
  that scored sent as-is.
  **Exception: the SMS thread already names a confirmed assessment** (street,
  date/time, dashboard address uuid). That is not an open greeting. Next read is
  OpsHub completion, not “How can we help?” `list_properties` on the street, or
  `get_customer_profile` with that `address_token`, or `get_assessment_visits` once
  the flip token is in hand. `get_customer` 404 (Lead not found) is common
  pre-final-offer and is **not** a reason to skip this. If `initialInspectionAt` is
  set, underwriting is in draft/open, or `ACQUISITION_UNDERWRITING` is ACTIVE, the
  assessment is complete even when `DIRECT_OFFER` still reads `PRELIM_OFFER_SENT`.
  Draft the inside-window offer-status send: assessment is complete, final offer is
  with pricing, 3 to 5 business days from assessment completion. Do not invent a
  reschedule, and do not mention sibling flips. Verified on Lakeville MN ticket
  4955112 (17940 Headwaters Dr; inbound “hi” 9/23; inspection 9/22 18:06Z).
- **Buyer SMS that only confirms the street address shown on the home's door.**
  Treat it as a likely response in the tour flow, not as a request for property
  history. Glean the ticket, filter CUSTOMER on `primary_phone_number`, read the
  customer page once for the surrounding SMS and newest trust row, then confirm the
  address is an active Opendoor-owned listing with one exact structured listing
  lookup or verified public listing fetch. Stop. Do not open the property page,
  search historical tickets, search announcements, or retrieve former sellers
  unless the inbound contains a separate question that requires them. Reply that
  they can schedule through the Opendoor app or call (888) 352-7075. A trust deny
  does not make the home agent-only; the app or support team handles verification.
  Do not provide a code by SMS. Agent-only touring applies when the listing itself
  is a traditional listing, not merely because the customer has trust deny.
  Verified on Kansas City ticket 4910468.
- **Buyer SMS asking to schedule a viewing (`access_request`).** Pin the home
  before asking city: street-only inbound plus one live similar listing is enough.
  **Always name the verified full street, city, state, and ZIP in the customer
  send**, even when they already wrote the street, and even when the next ask is
  only a new date and time (a passed same-day slot does not drop the address).
  Put that same verified street in the Zendesk internal note when the inbound
  was abbreviated. **If there is no street, or no live listing pins,** do not
  guess a house number. Ask them for the **full property address** (and a
  preferred date and time if they still want to view). Then read the property
  record and, if needed, the OpsHub page **Flags** block. A **`Traditional listing`** tag there is what
  makes the home traditional, not the public listing's "Tour with agent" copy.
  When that flag is present, do not collect a showing time or offer app self-tour.
  Tell them a licensed agent needs to schedule and attend the viewing appointment.
  This does not mean the home is unavailable to view. Apologize if a prior
  outbound already asked for a time. Being unrepresented does not create an
  Opendoor-scheduled path. Trust deny stays in the appendix and is not why
  touring is agent-only.   Verified on Calhoun GA ticket 4921734 (116 Savannah St
  SE, Flags: Traditional listing); East Hartford CT ticket 4941205 (1026 Forbes
  St; operator: name the requested address in the send and the note; if none
  listed, ask).
- **Previous owner / CNML seller asking to enter after acquisition close.**
  Treat as a buyer, not as the owner. Never send a lockbox code. Confirm the
  home is Opendoor-owned, then go through buyer access guidelines (licensed
  agent if traditional/unaccompanied; otherwise app or 888-352-7075, never a
  code in the ticket). Acknowledge that once the acquisition closed Opendoor
  became the owner, thank them for the feedback, and say we are doing our best
  to sell the home. Do not route as a closed-homes vendor ticket and do not
  use the CNML second-half Exec X recipe unless they also asked about the
  remaining payment.
- **Buyer SMS asking if a named listing is still available.** Do not send a
  one-line yes/no. Glean the ticket, CUSTOMER on `primary_phone_number`, pin the
  home as an active listing, then read the property record and, if needed, the
  OpsHub page **Flags** block. Confirm it is still available, then give the touring path in the
  same reply: for an Opendoor-owned listing without the traditional flag, viewings
  are scheduled through the app or (888) 352-7075 during the available viewing
  window. **`Traditional listing`** still means Opendoor owns the home; it changes
  the buyer-access path, not ownership. If the requester is a buyer, they must use
  a licensed listing agent to schedule and attend the viewing appointment instead
  (no app self-tour, no showing-time ask). This requirement applies only when the
  `Traditional listing` flag is present; it does not mean the home is unavailable
  to view. A verified buyer's agent may view the property through the agent path.
  Opendoor does not host open houses; do not
  confirm, repeat, or invent open-house times. If the requester’s CUSTOMER record is
  `is_agent: true`, also point them to `https://www.opendoor.com/make-offer`:
  enter the property address and follow the prompts to submit the offer.
  `homes@opendoor.com` remains an existing agent contact; it does not replace the
  required submission URL when giving offer-submission guidance. An Opencomm
  mint with no `is_agent` flag is not an agent; do not assume they are one from
  the inbound. A leftover greeting name stays out of the draft. Verified on
  Oklahoma City ticket 4928122 (1212 SW 54th St; Flags: Traditional listing;
  operator correction: include touring / makeoffer, not a dry availability
  line).
- **Showing-late / running behind SMS** (agent or visitor names the street and a
  delay on a same-day tour). Same budget as keypad: Glean, then
  `list_customers` + `get_activity`. When activity already shows the named tour
  **completed** (Visit completed, Tour complete email, or operator note),
  recommend close and do not send. Do **not** pin the home or open Visits on
  that no-send. Pin / Visits only if activity does not show completed. The
  one-line Zendesk note must include both the late notice **and that the tour
  completed** (who, street). Do not treat the inbound as a still-open access
  ask. Verified on Windermere FL ticket 4928936 (4309 Saltmarsh Sparrow Dr;
  Anthony Brooks late; tour completed).
- **Agent SMS asking for a lockbox / keypad code on a named same-day tour.** Two
  dependent lookups after Glean. Glean the ticket (tags + phones). In the next
  block, discover `list_customers` + `get_activity` together and call
  `list_customers` on the inbound E.164. Next turn is **only** `get_activity`
  on that uuid (calls, notes, email subjects). **Stop** when a same-day inbound
  access call was already handled (operator post-call note) **or** a Tour
  complete email landed after the SMS.
  Fence no-send; Zendesk note names who handled access and the street. Do
  **not** `get_customer` (agent records often 404 as sell-direct Lead not
  found). Do **not** `get_customer_profile` (long-tenured agents dump thousands
  of events). Do **not** `list_properties` on the inbound street, including a
  misspelling; the call note already names the home. Never paste a code from an
  earlier access SMS into the ticket or the note. If activity shows the ask is
  still open (no handled call, no tour complete), fall through to touring /
  access and still never send the code. Verified on Seguin TX ticket 4940692
  (5829 Texas Spur; Shika Simmons handled Agent--Access; tour-complete email
  17:05Z; “Texas Spit” inbound was not a reason to pin the property).
- **Buyer SMS asking seller / owner financing, cash or DSCR terms, or off-market
  inventory on a named listing.** Answer the question they asked. Do **not** use
  the vendor-decline recipe, even on an Opencomm mint that greets a leftover
  name. Do **not** add a touring path unless they asked to view. Glean the
  ticket, CUSTOMER on phone, pin the listing. **Seller / owner financing is not
  offered.** The home still sells as a standard purchase paid in full at
  closing (cash or the buyer's financing). That is not "Opendoor never
  finances." Check the state and current product availability before naming
  a mortgage product. **Opendoor Home Loans LLC**, NMLS ID **2810193**, lists
  these licensed jurisdictions as checked October 22, 2026: AL, AZ, CO, DC,
  IA, KS, LA, MI, MN, MT, NE, OK, OR, TX, WI, WY. Source:
  [Disclosures and Licenses](https://www.opendoor.com/homeloans/licenses).
  This replaces the dated July market list as licensing evidence. A license
  does not establish an active launch, a particular product's availability,
  or borrower eligibility; verify current availability before a referral.
  Recheck the live page for licensing questions rather than treating this
  dated snapshot as permanent. The listed ODHL phone is **480-618-6760**.
  Use the applicable verified product/application path below for applications;
  the licensing page itself does not change that path. ODHL is an Opendoor
  subsidiary; using an affiliate is optional, customers may shop around, and
  Opendoor or its affiliates may benefit financially from the transaction.
  Applications require underwriting, credit qualification, and verification;
  do not promise approval or treat website information as a lending commitment.
  **Lower.com:** retain the existing partner-referral guidance where currently
  verified (previous guidance identified Ohio and excluded NV/NY), but do not
  route automatically to Lower based on absence from the old ODHL list. The
  ODHL licensing page does not establish Lower's coverage or affiliation.
  Refer with the Help Center Affiliated Business Arrangement line:
  we are referring them to Lower.com, an affiliate of Opendoor; they are not
  required to use it and should shop around; Opendoor may receive a financial
  benefit if they do. Customer URL is `lower.com/go`. Off-market fixer-uppers
  or portfolios with financials: we do not have those to share; they can
  browse listed homes at `https://www.opendoor.com/buy`. Georgia buyers must
  work with a licensed agent to place an offer. Where direct buyer submission
  is available, submit from the listing; confirm the location’s path when
  unknown and preserve traditional-listing requirements to use an agent.
  Verified on Toledo OH ticket 4928625 (3439 Rushland Ave; operator
  corrections: not a vendor decline, do not ignore seller-finance, do not
  lead with touring, Lower not a blanket no-finance).
- **Opendoor Home Loans application start / incomplete application.** When a
  buyer asks how to start, continue, or submit an Opendoor Home Loans
  application, provide `https://homebuyer.com/rates`. Tell them to select
  **Get started**, complete and submit the application, or sign in and continue
  if they already started one. For an application-status SMS with no submission
  recorded, include this link and these start/continue steps in the first reply;
  do not make the customer ask for the website separately. Verified on ticket
  4955249 and corroborated by ticket 4820174.
- **Unsolicited vendor / staging pitch on SMS** (offers staging, cleaning, photography,
  etc.; often greets a named person who is not the requester; frequently tagged
  `initial_greeting_sms`). Clear insurance/medical-benefits sales pitches are
  spam and use the no-send disposition below. Do **not** use this recipe when they named a street
  and asked about buying it, seller financing, or making an offer. Two calls. Glean the ticket, CUSTOMER on
  `primary_phone_number`. When the record is an Opencomm mint (id + phone only, no
  name, email, or engagements), **stop**. **Mass marketing blast** (home warranty
  or similar promo: "Attention Realtors", gift cards, Call this number, Stop to
  opt out, no support ask) is **no send**. Fence
  `[No reply recommended. Close ticket.]` and a one-line internal note (who it
  was, that there is no customer record). Do not draft a polite decline. A
  conversational vendor pitch on the support line still gets a short decline that
  this is Opendoor Support and the line is for customer support, not vendor
  inquiries. Do **not** open OpsHub, do **not** resolve or pull the street they
  named, and do **not** assert stage, listing, or ownership. Skipping OpsHub is
  safe only because the reply (or no-send) asserts no access path, no appointment,
  and no stage. If CUSTOMER shows a real engagement history, fall back to the
  normal OpsHub customer read. A greeting aimed at someone else ("Hi Lisa,") stays
  in the operator appendix when that name is nowhere on the record; leave it out
  of the draft. Verified on Venice CA ticket 4879194 (Elite Home Staging, sent
  as-is) and ticket 4921761 (First Premier Home Warranty blast, no-send).
- **Unsolicited listing / marketing email** (brokerage blast pitching a home for
  sale: beds, baths, list price, listing copy, tracking links; no support ask).
  Glean the ticket. Open the ticket page only if Glean truncated the comment or
  omitted status/tags. **Stop.** Do not CUSTOMER-lookup, do not open OpsHub, do
  not resolve or pull the street they pitched, and do not draft a customer reply.
  Fence `[No reply recommended. Mark as spam and close.]` Put spam/close only
  there. Internal note is who it was (brokerage / blast), not a second close
  instruction. Glean often dumps the listing body and hides requester metadata,
  which is not a reason to keep retrieving. Same no-send shape as a mass
  vendor-SMS blast; a conversational vendor SMS on the support line still gets
  an in-thread decline. Verified on Portland OR ticket 4886268 (The Agency
  "Bull Mountain Stunner") that scored sent as-is, and Leesburg FL ticket
  4921853 (EquityPro blast; spam/close belongs in the no-reply fence).
- **Email STOP / unsubscribe** (lone STOP, unsubscribe, or opt-out reply to an
  Opendoor marketing or offer-update email, often quoting “We’re back with a
  new offer” / “Offer update”). Glean the ticket. If the inbound is email,
  treat it as an email opt-out, not SMS. **Stop.** Do not CUSTOMER-lookup,
  do not open OpsHub, do not resolve the street in the campaign, and do not
  draft a customer confirmation. Fence
  `[No reply recommended. Close ticket.]` Internal note in first person:
  `I processed the email unsubscribe…` (and the campaign they replied to,
  if useful). Do not name the agent. Do not ask them to unsubscribe in
  the note when they already said they did it. Verified on Weatherford TX
  ticket 4928715 (1110 Old Garner Rd offer-update email; operator
  correction: email unsubscribe, already done; note says `I`, not Sam).
- **SMS asking what percentage Opendoor keeps on a cash offer.** Policy-only.
  Glean the ticket, then the Help Center Service Charge article. **Stop.** Do
  not CUSTOMER-lookup or open OpsHub unless they also ask about their file.
  Never quote a fee %. High-level only: the service fee is variable, shown as
  a dollar amount in the final offer, and covers transaction costs, operational
  costs, and market risk. Home Sale Advisor walks the dollar amount on the
  Final Offer call. Verified on ticket 4921390 that scored sent as-is.
- **Buyer’s agent asking if compensation is offered / the amount / who pays**
  on a named Opendoor listing. Policy-first, two dependent rounds. Glean the
  ticket, CUSTOMER on `primary_phone_number` (confirm `is_agent: true`), then
  pin the home with one exact ADDRESS `street` filter plus LISTING on that
  `address.uuid` (or PDS with `opendoor_owned: true`). Then Help Center
  [Buyer Broker Commission (BBC)](https://opendoor.zendesk.com/hc/en-us/articles/25769355450907-Buyer-Broker-Commission-BBC)
  and [Buyer Broker Compensation](https://opendoor.zendesk.com/hc/en-us/articles/32865925018395-Buyer-Broker-Compensation).
  **Stop.** Draft: no preset buyer’s-agent compensation; they write the
  requested amount into the purchase agreement; Opendoor as seller reviews it
  with the other offer terms; any agreed amount is paid by Opendoor as the
  seller at closing (seller concession, not broker-to-broker). Florida: Section
  20, Additional Terms. **Do not convert a seller-agent commission question
  into buyer-broker compensation guidance: a seller-agent commission comes
  strictly from the listing agreement between the seller and that agent. Do
  not say it is part of Opendoor’s offer process or imply that Opendoor pays,
  negotiates, or adds it elsewhere.** Do **not** quote a % from Flags (`BBC Experiment:
  Market Median Commission`), `bbc_experiment_params.yml`, or “typically 0% to
  2.5%.” Do **not** CUSTOMER-lookup the address uuid (that is the former
  seller). Do **not** open OpsHub or the public listing unless the pin failed
  or they also asked touring / availability. If they also ask to tour, then
  read Flags for `Traditional listing`. Verified on Davenport FL ticket
  4928636 (480 Buchannan Dr; operator: same send without the extra retrieval).
- **Inspector / appraiser SMS that names who the visit is for.**
  Start with [resolution-first access](recipes/access-resolution.md): check the
  verified appraiser's recent call notes/activity for this home before property
  research or asking for participant details or a new appointment time. Check
  Home Visits only if still relevant or explicitly requested.
  If a call already resolved access, recommend close and name the verified call
  handler in the internal note. A WebCustomer UUID failing the sell-direct
  `get_customer` lookup does not establish that no visits exist; use the customer
  search UI to verify Home Visits when structured reads do not expose them.
  Do **not** use the
  unsolicited-vendor recipe off an Opencomm mint or a leftover “Hi [name],”. The
  sender is often the inspection or appraisal scheduler, so do not require the
  sender to be the buyer, buyer’s agent, or lender. Read the property record and
  **verify a participant**: buyer, buyer’s agent, or lender. The inbound naming the
  buyer (or buyer’s agent / lender) as who the inspection or appraisal is for is
  the match. Separately confirm Visits: the inspection or appraisal company should
  appear on the **name of the person assigned to the appointment** (not just “a
  visit exists on a street we own”). For an Opendoor-owned property, do not ask the
  scheduler to confirm vacancy or access; Opendoor handles the appraiser's access.
  When the participant is already confirmed, thank the scheduler for confirming the
  participant information, then ask for the appraiser's full name, email address,
  and phone number. The email and phone must be distinct
  contact information belonging to the appraiser, not the scheduler. If the
  requested appointment window has already started or passed, ask what time they
  would like to schedule instead of assuming the original slot. Once those details
  and the desired time are confirmed, proceed with scheduling. Do not send an
  access code. Verified on Aurora CO ticket 4886013: inbound named
  buyer Ernesto Lemus; Visits showed Audrey Stewart (Stauss Inspections).
- **Inspector heads-up that already went to the listing agent.** Glean the ticket,
  then one OpsHub customer-page read of the inspector/vendor record. Read the SMS
  thread past the inbound: these shops often dual-text support (`+1480…`) and the
  listing agent’s cell. When the listing agent already confirmed (vacant / BA can
  share access / utilities), recommend close and do not send a second reply or a
  code. Do **not** pin the property on that no-send. Name who texted and what they
  confirmed, with confidence. One-line
  internal note in its own copy box: the confirming fact only, spell out
  acronyms (`buyer's agent`, not `BA`), do not start with `No outbound`.
  Verified on Madison TN ticket 4886327 (House Call / 2520 Val Marie Dr;
  Michelle already replied) that scored sent as-is.
- **Agent emailing an inspection report after the acquisition AE asked them to
  send it to hello@.** Glean the ticket, CUSTOMER on the address uuid (agent
  record), then TASK or the property page for assessment and underwriting. Do
  not open the PDF. If `agent_full_assessment` is CLOSED, an Assessment Report
  is dated, and `complete_underwriting_valuation` is OPEN, they are waiting on
  the final offer, not an assessment path. An AE SMS that already said "Great
  thank you" does **not** close the ticket when the email also asks for an
  offer. Thank them, say the assessment is complete, and give 3 to 5 business
  days from assessment completion. Do not promise pricing will use the
  attached report, and do not quote the prelim amount. Verified on Winston
  Salem NC ticket 4910633 (1700 Polo Oaks Ct) that scored sent as-is.
- **Customer asks whether an inspection report is needed while the final offer is
  still being finalized.** Let them know the report is not needed at this stage.
  They may still attach it when replying to the email if they would like to share
  it. Do not imply that the report is required for final-offer completion or that
  it will affect the offer unless the record explicitly supports that claim.
- **Agent emailing executed transaction paperwork and asking when the inspector
  needs access.** Resolve the address, identify the active contract flip, and
  read OpsHub Assessments & Inspections / visit status before drafting. Use the
  confirmed inspection or diligence visit—not a generic property note—as the
  load-bearing fact. Give the scheduled date and property-local time, then ask
  the agent to meet the inspector or arrange a mechanical lockbox. Do not reply
  that the agent can view the appointment in a dashboard, and do not substitute
  a note such as “no gate or entry restrictions” for the requested access
  arrangement. Verified on Zendesk ticket 5035343 (18373 W Surprise Farms Loop
  North, Surprise AZ).
- **Buyer asking a feature or layout question about a home they are looking at.**
  Four calls, no OpsHub property page. Glean the ticket, CUSTOMER on
  `primary_phone_number`, one batched read of the OpsHub customer page, then
  `pds_search_by_address` on the street with **`opendoor_owned: true`** to pin the
  address. Fetch the public listing URL and answer from it only.
  **Do not assert the feature.** Interior layout facts such as separate entrances,
  basement walkouts, and room adjacencies are not in any tool. Point only at what
  the fetched listing page actually carries (photos, labeled floor plans, and a
  seller's disclosure **only if that download is on the page**). Reading the
  answer off listing photos is not a citable answer. Verified on a New Egypt NJ
  buyer SMS that scored sent as-is.
  **Buyer asking about water / condition on an `opendoor_owned` listing.** Answer
  from the public listing only. Do not invent water history, do not imply a
  third-party seller, and do not add a "we cannot share why it is selling" line
  unless they press. **Do not name a seller's disclosure unless the fetch showed
  the download.** If they only ask for a link, send the verified listing URL and
  stop. When the operator has already submitted a seller's disclosure request,
  say that in the reply and do not promise a file or a timeline. Verified on
  North Providence RI ticket 4899221 (56 Cushing St had floor plans, no
  disclosure download).
  **Condition/systems lookup stop rule:** After the required same-concern
  resolution check and one exact address match, use a listing URL returned by
  the connector when available. If no exact Opendoor URL is returned, make at
  most one focused public search for the full address on Opendoor. An unrelated
  home's similar-listings mention is not an exact listing result: do not open
  that home, repeat search variants, discover browser tools, or try shell/page
  fetch workarounds to chase the link. Do not add `get_property` solely to find
  a public URL when the address match already identifies the home. If the exact
  page cannot be retrieved, stop and disclose the listing gap in the operator
  appendix. State that the requested condition or system detail cannot be
  confirmed and give the independent-inspection option if they place an offer.
  Never infer wiring, upgrades, or disclosure availability from missing data.
  If the exact page is retrieved, answer only from verified information and
  stop when it does not establish the requested detail. This limit does not
  bypass required resolution, identity, access, or stage gates for separate asks.
  **Short path when the inbound already names a street and the send will only
  point at that public listing** (e.g. "951 haverstraw needs work?"). Two
  dependent rounds, no Chrome. Glean the ticket, CUSTOMER on
  `primary_phone_number` in the same first block if the schema is already
  loaded. Then pin the home with `pds_search_by_address` +
  **`opendoor_owned: true`**, or when PDS is missing: one **exact ADDRESS**
  filter on `street` (add a likely suffix such as `Rd` only to make an exact
  match; do not NL-search "opendoor owned listing"). If two ADDRESS rows
  collide, LISTING filtered on `address.uuid` picks the live one. Fetch the
  public listing and stop. **Skip OpsHub** when CUSTOMER is an Opencomm mint
  (id + phone only) and the draft asserts no access path, no appointment, and
  no stage. Trust deny, if you ever read it, stays in the appendix; it is not
  a reason to open the customer page on this shape. Pull the customer page
  only if the follow-up is touring or a code. Verified on Suffern NY ticket
  4911400 (951 Haverstraw Rd) that scored sent as-is.
- **Buyer’s agent asking for extra listing docs on an Opendoor-owned home**
  (survey, ILC, roof age, or other files we do not keep besides the seller’s
  disclosure). Glean the ticket, CUSTOMER on the inbound phone, pin the
  listing, then fetch the public listing. Answer from what is actually in
  hand: send or confirm the seller’s disclosure if it was already emailed or
  the listing has the download; do not invent a survey, ILC, or roof age.
  Answer every specific property detail requested in the inbound (for example,
  roof age, HVAC age, and water-heater age); do not omit one of the requested
  items. **In the same reply,** say that if the sender or their buyer decides
  to place an offer, they can also complete an independent inspection to verify
  those items and any other questions they have about the home. Do not phrase
  the inspection as something that must happen before placing an offer. Do not
  add touring unless they asked to view. Verified on Cripple Creek CO ticket
  4939779 (144 Dandy Jim Dr; operator correction: include the independent-
  inspection line).
- **Buyer / BA asking if a named Opendoor listing has laundry / a washer /
  dryer.** Pin the home (exact ADDRESS / public listing). Read MLS **Laundry**
  as location only (`In Kitchen` means hookups / laundry area, not that
  machines convey). The **Appliances** list is a separate checkbox field.
  **Positive match only:** if Washer and/or Dryer are checked, say that in the
  reply (laundry in the kitchen, and the listing includes a washer / dryer).
  Empty boxes are unknown, not absent: do **not** tell the agent the machines
  are excluded, and do **not** promise they are in the unit. Acquisition default:
  laundry appliances stay unless a signed **exclusion addendum** says they
  do not convey (Help Center Appliance Requests: washer/dryer are negotiable;
  XA wording is `The seller agrees that the [appliance] does not convey with
  the property.`). Check `get_addenda` on the flip. Title, COE, credit, and
  diligence addenda are not that exclusion. An exclusion addendum wins over a
  checked box. If the boxes are empty and there is no exclusion, the outward
  answer is the MLS laundry location only; keep convey vs present in the
  appendix. Resale counters that say appliances currently in the home will
  convey still do not prove the machines are there when the boxes are empty. Verified on Orlando FL
  ticket 4940736 (5213 Via Hacienda Cir #307; MLS O6428890 Laundry: In
  Kitchen, Appliances: Dishwasher / Microwave / Other; no exclusion
  addendum; operator: that exclusion addendum is the check).
- **Buyer email asking for access / a quick look at "this [city or area] home"
  with no street.** Glean the ticket, then open the Zendesk ticket if requester
  email or a street is missing (Glean often dumps the body and hides metadata).
  The Zendesk user `external_id` is the customer uuid; `user_fields.customer_page_url`
  is the OpsHub customer page. One customer-page read for trust and engagements.
  **Stop** when there is no street and no active transaction or visit. A city
  name is not an address. Ask for the **full property address** and a preferred
  date and time. Do not offer a self-tour, a code, or any access path, even with
  trust Allow, until the home is identified. Verified on Mescal AZ ticket
  4899168 that scored sent as-is.
- **Direct seller SMS or email: "I have pictures / can I send you the pictures / how do I
  upload / I'm not at the property," assessment still outstanding.** Never draft
  "yes, send them" on SMS or email. Explain why existing or online photos are
  insufficient: assessment photos must be taken live through the **Opendoor Key
  App** so the required current angles and condition can be captured; they are
  not a gallery drop. XA photo upload is **digital checkout only**; an
  outstanding assessment is live Opendoor Key App photos or an in-home
  walkthrough. Glean the ticket, CUSTOMER on the **requester** phone (Glean SMS
  often lists the Opendoor support line first), one OpsHub customer read, then the
  property record for assessment status and the page Flags fallback before offering
  any path. If a banner says a newer flip exists, open primary for Flags/pipeline,
  then see "stale flip vs primary" under Sellers with an outstanding assessment.
  Draft: existing photos cannot be uploaded because the assessment requires live
  photos through the Opendoor Key App; offer three paths in the same first
  reply — (1) Opendoor Key App live photos at the home, (2) self-schedule an
  in-home walkthrough from the dashboard, (3) reply here or call (888) 352-7075
  and we can help get one scheduled. Customer-facing name is **Opendoor Key App**,
  never "the Key app". Do not omit (2) or (3) because of
  `Remote Market - App Only`. Never promise a callback. Verified on Richmond VA
  ticket 4879098; Beaumont TX ticket 4940495 (operator correction: do not accept
  texted photos pre-assessment).
- **Refreshed offer with a completed assessment still within the 180-day photo
  reuse window.** If the refreshed offer is already in the underwriting or finalizing
  stage, tell the customer the completed assessment photos can be reused and that
  they do not need to complete anything further. Do not direct them back into the
  dashboard to continue an assessment or imply that a new assessment is required.
  The 180-day window is required; if it has passed, a new assessment is needed.
  Confirm the property before making this determination. For 36237 N 33rd Ave,
  Phoenix, do not claim assessment completion or photo reuse when OpsHub Photos &
  Media shows no assessment photos; ask the customer to clarify the property and,
  if it is that address, explain that a new assessment is needed.
- **Seller asks whether Opendoor can conduct the assessment.** Draft that Opendoor
  can schedule an assessment with a licensed professional through Showami to take
  the required photos, or the seller can complete the assessment through the
  **Opendoor Key App**. Ask for the property address and preferred date/time.
  If the home will be vacant and the seller will not be present, ask for the
  access code. Do not state that Opendoor directly conducts the assessment;
  Showami is the third-party assessment provider for the scheduled professional
  visit.
- **Seller says they are working with an agent, asks whether the agent can meet
  instead, or otherwise identifies an agent on an assessment ticket.** Treat this
  as a listing-agreement / representation signal before discussing assessment
  scheduling. Ask first for the agent's full name and email address so the agent
  can be added to the property record and the listing agreement can be respected.
  Check the existing agent/customer record for the remaining details and collect
  them from the agent only if needed. Do not answer as though the agent is merely
  an access contact, and do not proceed with the
  direct-seller assessment path until the agent information is collected.
- **Agent asking how to upload existing photos, assessment still outstanding.**
  Do **not** use the direct-seller three-path recipe. Two dependent rounds: Glean
  the ticket, then `resolveAddress` (or PDS) plus CUSTOMER on the address uuid
  and TASK on that uuid in the same block. `is_agent: true` +
  `PRELIM_OFFER_SENT` + `seller_full_assessment` / `agent_full_assessment`
  IN_PROGRESS is the whole answer. **Stop.** Do not open the property page for
  Flags, photos, or notes, and do not query `SELL_DIRECT_OFFER`. Entry-only is
  when they refuse the assessment and ask us to work the owner; asking how to
  upload is the opposite. Draft: existing photos cannot be uploaded; Opendoor
  Key App live photos at the home; reply here or call (888) 352-7075 if they get
  stuck in the app. No walkthrough. Verified on Rowlett TX ticket 4910782 (602
  Winners Cir) that scored sent as-is.
- **Assessment photo question framed as an alternative upload (including a video
  versus photo question).** Keep the customer-facing answer focused on the
  required action: download the **Opendoor Key App** and take all assessment
  photos live through the app. Do not discuss or endorse sending videos,
  existing gallery photos, screenshots, or photos submitted outside the app.
  Existing photos cannot be uploaded from the camera roll or sent separately.
  Include the official Help Center guide when useful:
  `https://help.opendoor.com/selling/getting-your-offer/self-assessment-photos`.
  Use the exact product name **Opendoor Key App**, not “the Key app.”
- **Agent asking for the "listing information page" on an Opendoor-owned home,
  tagged `resale__listed_home_info`, often because they are not a member of the
  MLS that carries it.** Three calls, no OpsHub read at all. Glean the ticket,
  CUSTOMER on `primary_phone_number`, `pds_search_by_address` with
  **`opendoor_owned: true`** for the address uuid, then one `web_fetch` of the
  public listing URL to confirm it is live and to inventory what it carries.
  **The public listing page is the answer, and MLS membership is irrelevant to
  it.** Name what is on it, the price, beds, baths, sqft, lot, year built, price
  history, the photo count, the labeled floor plans, and the seller's disclosure
  download. Skipping OpsHub is safe here only because the reply asserts no access
  path, no appointment, and no stage. If the agent follows up about touring or a
  code, pull the customer page first for the trust rows.
  Verification of the agent is usually already satisfied: an earlier XA asks for
  full name, MLS, brokerage and license number, and the CUSTOMER record then reads
  `is_agent: true`. Check that flag rather than re-asking, and do not restate the
  verification step back to them. Verified on a Mountain Top PA agent SMS that
  scored sent as-is.
- **Seller SMS asking “what day and time” after an assessment matching /
  claim-wait outbound** (often tagged `initial_greeting_sms`; inbound may
  land seconds after “still looking for someone to claim”). Two dependent
  lookups after Glean. Discover `list_customers` + `get_thread` together;
  call `list_customers` on the inbound E.164. Next turn is **only**
  `get_thread` on that customer uuid. **Stop** when a confirmation or
  reminder after the inbound already names street, date, and time. Draft the
  slot; do not reschedule unless they asked. Do **not** `get_customer`
  (Lead not found is common pre-FO). Do **not** `get_activity` (it needs a
  **flip token**, not the customer uuid; that call fails and wastes a
  round). Do not pin the property. Verified on Searcy AR ticket 4941123
  (910 W Academy Ave; inbound 16:58Z; reminder 17:15Z Sep 22 12:15 PM).
- **Direct seller SMS to the confirmation number: vacant / lockbox / "I won't be
  there" on a same-day confirmed assessment.** Three calls. Glean the ticket
  (tags + phones), CUSTOMER on `primary_phone_number`, then `get_property` with
  the Assessments & Inspections page fallback (and Offer Workflow only if it is
  already in the same read). Skip `resolveAddress`, skip extra customer reads, and skip Slack
  when the operator comment is only a thread URL. If Assessments & Inspections shows
  completed (including a visible `Complete` status, handoff / condition scoping /
  Assessment Report dated today) and
  underwriting has started, the appointment already happened; the 11:30-style
  "checking in" outbound is residual. With `hold_no_agent_replies`, recommend
  close and do not send. If you still paste a draft, it only confirms completion
  and that nothing else is owed. Verified on Alexandria VA ticket 4885665
  (sent as-is).

  **Outstanding/incomplete branch:** An assessment may be absent even when a
  Showami appointment was confirmed or attended. Check the appointment/visit
  status, activity, and available photos or assessment artifacts before concluding
  that nobody showed. If those records still do not support completion, do not use
  the generic access-code response and do not state only that the appointment was
  missed. Use the direct reschedule guidance:
  “We're not showing the assessment as completed. You need to reschedule either
  through the Opendoor dashboard with your email, or you can let us know a date and
  time. We can do that for you as well. Make sure to include any lockbox
  information.” Do not repeat the lockbox code. The internal note should capture
  the handled call or note author, address, scheduled slot, completion/visit
  result, and that lockbox information must be included for the reschedule.

  **Seller sends a lockbox code after a scheduled assessment:** Always check the
  Assessments & Inspections record for the visit outcome before drafting. If the
  scheduled assessor already completed the assessment, recommend no outbound
  reply: the seller already knows the assessment was completed, so a code
  acknowledgment adds no value. This does not create an automatic internal-note
  requirement; add a note only when operationally useful, and never repeat the
  lockbox code. Use the outstanding/incomplete branch only when the record does
  not support completion.
- **Customer asking to update / change their email, and the inbound does not name
  the destination address.** Glean the ticket, CUSTOMER on uuid or phone, one
  OpsHub customer read for primary email vs setup/password subjects. **Do not
  confirm or verify any email the customer did not list in this inbound** —
  not Customer Info primary, not a sibling-ticket address, not a
  `Finish setting up your account` / `Your Opendoor password has changed`
  destination. Even when the file has a clear candidate, the reply only asks
  them to send the **email address** they want the account changed **to**
  (say "email address", never bare "address"). If you do mask
  an address they listed, keep enough of the local part that it is recognizable
  (`lacking01@gmail.com`, not last-six `king01@gmail.com` on a dotted local
  part). Verified on Henderson NV ticket 4886017.
- **Direct seller SMS asking the status of the offer** (names the street; still
  inside the 3 to 5 business day window). Two dependent rounds, no Chrome. Glean
  the ticket, CUSTOMER on `primary_phone_number`, then TASK on that
  `address.uuid` in the same second block. **Stop** when `seller_full_assessment`
  (or equivalent) is CLOSED and underwriting or pricing is in flight
  (`complete_underwriting_valuation` OPEN, or CLOSED with
  `acquisition_uw_pricing_decision` OPEN). Engagement `domain_state` may still
  read `PRELIM_OFFER_SENT`; that is not a completion check. Draft: assessment is
  complete, the final offer is with pricing, 3 to 5 business days from
  assessment completion. Do not quote the headline price. Do **not** open
  OpsHub, do **not** open the property page for Assessments, and do **not**
  query LISTING or `SELL_DIRECT_OFFER` unless TASK is missing or contradicts the
  inbound. If the window has already passed, use the past-window recipe below
  instead. Verified on Metairie LA ticket 4922020 (1208 Homestead Ave).
- **Seller email asking when they will get an all-cash / final offer, quoting
  an expiry or walkthrough campaign** (“Act fast before your offer expires”,
  “Book walkthrough”, “Show us your home by scheduling a walkthrough”). Glean
  first. If Glean already has the inbound plus the quoted campaign with a named
  street, do **not** open ticket Chrome for requester identity. Next block:
  `list_properties` on that street, then `get_sent_offer` on the live flip.
  **Stop** when `DIRECT_OFFER` is `PRELIM_OFFER_SENT`, the sent offer is SENT
  with a preliminary expiry, and inspection is empty (`initialInspectionAt`
  null / assessment not completed). Draft: they already have a **preliminary**
  cash offer; the campaign walkthrough is the in-home walkthrough / assessment
  that starts the final; point at **Book walkthrough** in the email they
  replied to; 3 to 5 business days from walkthrough completion, not from this
  reply. Do **not** treat it as a past-window final-offer wait, do **not** send
  HSA Calendly, and do **not** dump `get_customer_profile` on sibling records
  after `get_customer` 404. Verified on Hendersonville NC ticket 4940804 (71
  Bowman Ridge Rd; operator: campaign already named the walkthrough).
- **Seller sharing upgrades / work done on the home** (windows, doors, roof,
  floors, counters, “would it help you to know the improvements”). The
  load-bearing answer is the post-acceptance inspection, not a square-footage /
  extra-room / bathroom Home Details dispute. Draft: thank them; if they accept
  the presented final offer we inspect the home, so they do not need to send
  the upgrade list. For comfort, you may also say pricing can consider that
  kind of update and will cross-reference county tax records. Do **not** say
  the upgrades were noted or sent to pricing unless the operator has already
  done that. Do not promise the final will land near the estimate. Verified on
  Greene ME ticket 4939568 (118 Rackley Dr; operator correction).
- **Seller disputes a presented final offer because it omits an ADU or another
  previously provided property detail:** Treat this as a substantive offer-
  correction/escalation request, not a routine “what information do you need?”
  question. Do not say no additional information is needed, claim the issue
  has been escalated unless that action is verified, or promise a correction
  timeline. Acknowledge the concern, reference the details already provided,
  and keep the next step to a written review/reply. When the operator has
  reviewed the internal ADU guidance and actually escalated the concern to
  Pricing, the customer-facing reply may say: “I understand your concern about
  the ADU, and I’ve escalated this to our pricing team to review whether it was
  taken into account in the final offer. We’ll reply here once the review is
  complete.” Do not add “you’re right” or similar validation language, and do
  not promise a timeline.
- **Seller SMS that the final offer is past the 3 to 5 business day window.**
  Escalate to pricing to see if the offer is stuck. Do **not** tell the customer
  the team is delayed, that the offer is still being finalized, that there is no
  completion time, or to check the dashboard. Customer-facing is only that we
  will look into it and get back to them. **Read the post-call notes first.** If
  someone already flagged pricing, do not open a second Slack thread or recreate
  the ticket. Put that existing Slack permalink in the Zendesk internal note
  (include Slack links in internal notes going forward when an escalation thread
  is already on the file). Verified on Englewood CO ticket 4910959.
- **Cancel request on an estimated or expired offer** (email or SMS: “Please
  CANCEL”, stop the offer request). Confirm stage first. If there is **no
  final offer**, the assessment was **not completed**, and the home was
  **never under contract**, XA handles it: confirm we will not move forward.
  If the customer has not accepted an offer, they may instead let the offer
  expire when it arrives; use that guidance for a request to remove the home
  from the website when no contract exists.
  Do **not** escalate to the home sale advisor or sales support. That Slack
  path is for a presented final offer or a signed contract, not a prelim
  estimate. When the operator does want a Slack channel update from a
  Zendesk **email**, use `xa-quick-slack` and skip the OpsHub note (there
  was no call). Verified on Daleville AL ticket 4929095 (14 Brown Ave;
  expired estimated offer; operator correction: no home sale advisor
  Slack).
- **Seller wants to speak with someone about their final offer** (`FINAL_OFFER_SENT`,
  including “I missed a call” / “I would like to speak to someone about our home”).
  This applies to all Home Sale Advisors and all Final Offer calls. Glean the
  ticket, CUSTOMER on phone or uuid, then one OpsHub customer read for **Assigned
  EP** (Sales Insights). Look up that name in the
  [HSA Calendly directory](https://docs.google.com/spreadsheets/d/1gMPcyjLEEF4yBYiuTZybVaxzgr9UWiaYcFUoYb93zBs)
  and send **that HSA’s Calendly link** so they can schedule time to discuss the
  final offer. Name the assigned Home Sale Advisor. Do **not** redirect them to
  (888) 352-7075 for this ask, and do not promise that XA or the HSA will call
  them. Use the directory Calendly URL, not a Google Calendar app link. If the
  final offer **expires today**, also say they need to sign before it expires to
  see their final numbers after the diligence visit, and that the Opendoor
  addendum allows cancellation at any time without cost or penalty. Once the
  offer is signed, send the same assigned HSA Calendly so they can book time to
  discuss the signed contract. Follow this unless management authorizes an
  exception. Verified on Cave Creek AZ ticket 4925734 (Candy Kissner;
  [process post](https://opendoor.enterprise.slack.com/archives/C02K6JVSNUF/p1789757961962119)
  in #xa-announcements, 2026-09-18).
- **Seller says the offer / marketing email named the wrong unit** (they gave
  #202, the email says #204). The first job is to identify the property they
  mean and whether the person emailing is associated with it. Glean the ticket,
  CUSTOMER on the requester uuid, **resolve the unit they named**, then CUSTOMER
  on `property_engagements.address.uuid`. A match can sit on a sibling profile
  (same name, different email or phone). **Stop.** Report that property's
  `domain_state` (often `EXPIRED`). Do **not** promise to re-point or "fix" the
  unit on the marketing record. Do not mention sibling profiles or extra flips
  outward. Verified on Olympia WA ticket 4921120.

## Initial estimated-offer questionnaire detail correction

When a seller says they entered the wrong kitchen type (standard, luxury, or
similar home-detail choice) during the initial offer-request questionnaire,
reassure them that the entry is part of the initial estimated offer. Do not
treat it as a presented-final-offer dispute or promise that the estimate will
be changed. Explain that an assessment comes next and that the final offer is
based on the assessment. No property lookup is needed when the ticket only
asks whether the initial entry is concerning.

## Home detail disputes

When a customer disputes a home detail (a fact on the internal Home Details field,
comps, or the estimate's stated features), check the consumer-facing dashboard at
`https://consumer.apps.opendoor.com/dashboard/sell/{address_uuid}?customer={customer_uuid}`
before concluding the premise is unconfirmed. The internal OpsHub Home Details field
can disagree with what the customer actually sees on their own dashboard, and the
internal field agreeing with the customer does not settle the dispute either way.

Before using the standard home-detail dispute wording, verify the assessment and
offer stage. If the assessment is not complete and the property's offer is expired,
the reply must say that the customer needs to refresh the offer and complete the
assessment before pricing can verify or correct the disputed detail for finalization
and make the update accurately.
Do not say the detail was sent to pricing as though the offer can already be
finalized, and do not omit the expired-offer state.

A disputed detail is submitted to pricing, not corrected in the reply. **County
tax records apply only when the dispute is square footage, an additional room,
or a bathroom.** In that case say it has been noted and sent to pricing, that
pricing will cross-reference county tax records, and that any change will be
reflected when the offer is finalized. Never restate the internal field back to
the customer as if it settles the question.

**Home-detail dispute template (SMS):**

> Hi [First],
>
> I’ve noted this and sent it to our pricing team. They’ll cross-reference county tax records, and any change will be reflected when the offer is finalized.
>
> Best,
> Sam
> The Opendoor Team

For this ticket shape, the customer's street address alone is sufficient to
identify the property; do not ask for a listing link when the address is already
available.

**When they are naming work already done on the home** (windows, doors, roof,
floors, counters, other upgrades), the load-bearing answer is still condition,
not a Home Details count: if they accept the presented final offer we inspect
the home, so they do not need to send the upgrade list. For comfort, you may
say pricing can consider that kind of update and will cross-reference county
tax records. Do **not** write that the upgrades were noted or sent unless the
operator has already done that. Do not treat tax records as a substitute for
the inspection. Verified on Greene ME ticket 4939568.

## Stage gates the playbook, not the customer's wording

**Verification gate:** before drafting or advancing a customer-facing answer,
verify every load-bearing fact in its authoritative source and confirm that it
answers the customer's actual question. Summary fields, inferred states,
stale snippets, and downstream signals cannot replace the authoritative record.
If the record has not been checked, do not invent the next step; retrieve the
missing fact or state the gap visibly in the operator appendix.

**Retrieving `domain_state` is not the same as letting it govern the reply.** The
failure mode is reading the stage correctly, then picking a playbook off the
customer's phrasing and building a next step that stage rules out.

Worked example. A seller at `FINAL_OFFER_SENT` wrote in saying she had received a
message that "a few more pictures were needed to complete my application". The
phrase "more pictures" pulled the sellers-with-an-outstanding-assessment playbook,
and the draft told her to open the Key app and take photos live. She was past the
assessment. There were no photos owed. The invented next step also buried the real
answer, which was that nothing on her file was waiting on photos, and that was
exactly the reassurance she had asked for.

The inverse also failed. A seller at `PRELIM_OFFER_SENT` with
`seller_full_assessment` IN_PROGRESS asked "Can I send you the pictures?" of
unfinished rooms from before they moved (Beaumont TX ticket 4940495). The phrasing
pulled a yes-to-text-photos draft. XA cannot take inbound photos except at digital
checkout. Gate: outstanding assessment → existing photos cannot be uploaded; Key
app live at the home, dashboard in-home walkthrough, or help scheduling.

So, before choosing a playbook:

- Name the stage from `domain_state` out loud, then ask whether the playbook the
  wording suggests is even reachable from that stage. Photos and assessment
  scheduling are unreachable from `FINAL_OFFER_SENT` onward.
- When the customer describes a request that the stage rules out, **that mismatch is
  the answer.** Report what the record shows and stop. Do not manufacture a step to
  satisfy the described request.
- Never state a mechanism as though it were retrieved. "A request for photos would
  come through the Key app" is a guess about a message nobody has read. If the
  outbound is not in the feed, it is not evidence.
- A stage mismatch on a customer who is worried about having shared information is a
  possible phishing report, not a task to complete. Say what the record shows, advise
  against replying further to the unverified message, and offer the support line.
  Do not label it a scam without evidence, and do not name it benign either.

## Identifying the Opendoor number on an SMS ticket

An SMS ticket shows two numbers and one of them is ours: +14804625392,
+14803516622, +14804625358, +14804625325, +16029752699, rotating +1602 / +1623 /
+1971 agent numbers, and short code 58028. If a phone lookup returns many
@opendoor.com records with `is_agent:true`, the wrong number was used.

Assessment confirmation outbounds also arrive from numbers not on that list, such
as +14804625267 and +14803511181. A number sending an "Assessment Confirmed!"
template is ours, whether or not it is listed here.

The inbound support line customers and agents call is **+18883527075**. A row
reading `{customer} called +18883527075` in the activities feed is an inbound call
to us, not an outbound from us.

**An inbound that opens by greeting a named person** ("Good morning Verria,") is a
customer who believes they are texting an individual, usually because they were
handed a number by someone. Check the record for that name before assuming a
misdirected text, and when the name appears nowhere, leave it out of the draft
entirely rather than explaining who they actually reached. It goes in the appendix
so the operator is ready if they follow up confused about who replied.

## Cost discipline

Measured on a real five-ticket session that ran roughly 3 million effective tokens.

- **Operator default: one new ticket, one new chat.** They paste a ticket
  number and cannot sort hard vs easy first. Follow-ups stay with that ticket.
  Reuse of one shift chat is optional and only when they already stayed; it is
  not an operator duty. If they stay, reuse loaded schemas for the same simple
  shape (spam/close, vendor blasts, email STOP, already-resolved same-day SMS)
  and start fresh when the type changes, touring is still open, or an old
  customer/property identifier could leak. Never ask them to classify before
  pasting.
- **Count round trips, not just tokens.** Wall-clock time is dominated by sequential
  dependent calls. Batch anything independent into one block, and cut any call whose
  result would not change the draft. Ticket-number SMS minimum after Glean is two
  lookups: `list_customers`, then the **one** feed the recipe names. Keypad /
  showing-late: `get_activity` on a **flip token**. Seller “what day and time”
  on an assessment slot: `get_thread` on the **customer uuid**. After Glean
  chooses the recipe, discover **every remaining tool in that same next block**.
  Call `list_customers` there. The following turn is **only** that feed. Do not
  insert `get_customer` or `get_customer_profile` between them. Never pass a
  customer uuid to `get_activity`. Sequential schema discovery
  (`list_customers` → `get_customer` → profile dump) is what made ticket 4940692
  take ~52s. Ticket 4941123 wasted two failed calls (`get_activity` with
  customer uuid, then `get_customer` 404) before `get_thread` already had the
  confirmed slot. Ticket 4955112 stopped at `get_thread` after “hi” even though
  the thread already named 17940 Headwaters Dr and the address uuid; completion
  was already on OpsHub (`initialInspectionAt`). When that confirmation is in
  the thread, the next read is completion, not a greeting draft. In a reused
  shift chat, skip rediscovery. A same-ticket follow-up that only needs the new inbound plus facts
  already in chat should draft in one Glean (or one `get_thread`); extra visit
  lookups on ticket 4940704 added about two minutes and did not change the send.
- **Do not inspect whole connector catalogs.** Load only exact tools named by the
  chosen recipe. Datadog, Data Hub, Offers, code search, and OpsHub write tools are
  outside the normal Zendesk draft path. Slack search is only for a recipe that
  explicitly requires an existing escalation permalink.
- **Set a retrieval budget from the ticket shape before calling tools.** For a
  recognized short-path SMS, target two dependent rounds: ticket first, then the
  exact customer lookup plus only the one property/listing confirmation needed.
  Stop when every outward claim is supported. Do not keep retrieving to explain an
  ambiguous inbound when the best reply is a short clarification or standard next
  step. A recognized agent "how do I upload existing photos" ticket is that
  short path: Glean, then address uuid → CUSTOMER + TASK. Do not spend a Chrome
  property-page read confirming Flags or empty Photos once TASK already shows
  the assessment in progress. A buyer SMS that only asks whether a named
  street "needs work" is the same budget: Glean, then exact ADDRESS / PDS +
  listing fetch. Do not open OpsHub for trust on an Opencomm mint when the
  reply will only send the public listing URL.   A recognized seller "status of
  the offer" SMS inside the window is the same budget: Glean, then
  `list_customers` plus one status read—`get_sent_offer` for sent/expiry state,
  or exact TASK for post-assessment pricing/underwriting progress. Add a profile
  read only when the stage, address, or flip remains unclear; do not open Chrome.
  A buyer’s-agent compensation ask on a named listing is
  the same budget: Glean, CUSTOMER on phone plus one listing pin, then Help
  Center BBC. Do not spend Chrome, former-seller CUSTOMER, code search, or the
  full XA BBC SOT deck once the articles already give no-preset / concession /
  contract write-in. A seller policy ask (tenant occupancy, vacancy at close,
  similar) is the same budget: ticket Glean plus one #xa-announcements search
  in the next block. Do not add Slack native search or a floor-support dump
  when announcements are empty; Help Center then a recent ticket is enough.
  Ticket 4941136 was correct from recent XA sends; announcements had no
  superseding post. An agent same-day keypad / lockbox SMS is the same budget:
  Glean, then `list_customers` + `get_activity`. Stop on a handled access call
  or Tour complete. Do not `get_customer`, do not dump `get_customer_profile`,
  do not pin the street. Showing-late is the same path; pin / Visits only if
  activity does not show the tour completed. A seller email asking when the
  all-cash / final offer lands, quoting an expiry campaign that already names
  a street, is the same budget: Glean, then `list_properties` on that street
  plus `get_sent_offer`. Do **not** open ticket Chrome when Glean already
  showed first name, street, and the Book walkthrough copy. Do **not**
  `get_customer` both sibling profiles then dump `get_customer_profile` after
  Lead not found. Ticket 4940804 ran long on that detour; `PRELIM_OFFER_SENT`
  plus empty inspection was already enough.
- **Do not work around a missing PDS connector with broad natural-language
  Indextrious searches.** First fallback is an **exact ADDRESS** `street`
  filter, then LISTING on that uuid. Use a known exact address uuid from a
  relevant ticket or exact structured result, or verify the public listing
  directly. After one noisy or failed broad query, switch paths or state the
  gap; repeated broad retries add latency without increasing confidence.
- **`num_results: 3`, never 8.** Each result is a full document. Two eight-result
  Help Center searches cost about 23,500 tokens. Raise it only after a narrow
  search genuinely comes up short.
- **Never screenshot to read text.** One screenshot cost 27,018 tokens, twelve times
  ten Chrome text calls combined. When `read_page` truncates a line at 100
  characters, click "Show more" and re-read the node. Screenshot only when the
  answer is genuinely visual.
- Zendesk MCP ticket-number reads are the default low-cost path. Use Glean only
  when the ticket is unavailable through the MCP or broader knowledge is needed.
  Ticket Chrome follows the truncation rule in Order of lookup, not a default
  second read.
- Indextrious results often blow the token limit and dump to a file the sandbox
  cannot read, and `limit` does not shrink them. Prefer OpsHub customer/profile
  reads. If an exact Indextrious fallback is still required, request only the
  necessary index and fields; delegate only a known-large result with a word cap.
- **A subagent is not a substitute for the right first call.** Spawning one to hunt
  a uuid cost 46,000 tokens and 24 tool calls on a lookup that a single address
  resolution answers. Delegate to shrink a read that is known to be huge, never to
  search for something a single correct call would return.
- A CUSTOMER lookup on a long-tenured customer returns every property engagement
  ever created, which can be twenty-five or more near-identical blocks. Budget for
  that, and read only the newest few and the one that is ACTIVE.
- **`get_customer` is sell-direct lead-shaped.** On `is_agent` / buyer-tour
  records it often returns Lead not found. Do not treat that 404 as a reason to
  dump `get_customer_profile`. For “was this already handled?” use
  `get_activity`.
- **`get_customer_profile` on a long-tenured agent is a token bomb** (ticket
  4940692: ~237KB / 4k lines). Use it only when the recipe needs cross-deal
  history or assigned Home Sale Advisor. For same-day SMS, `get_activity` and
  **read the head of the dump first** (newest-first, about the newest 30–50
  events / first ~80 lines). Stop when the inbound SMS plus anything after it
  is in hand (call, note, Tour complete). Grep the rest only if that slice is
  missing the inbound. Do not scan thousands of lines by default.
- **Do not pin a property** (`list_properties`, PDS, Flags, Visits) on a
  no-send whose activity already names the street and shows a handled access
  call, completed tour, or listing-agent confirm. Same for thanks/close at
  ticket level. Do not “correct” a misspelled inbound street with a property
  search. Pin only if the ask is still open.
- Prefer a **fenced paste-ready draft** (and a short operator appendix below it)
  over HTML widgets. Skip Claude-only `visualize:*` copy boxes — they are not
  available in Codex. On no-send or any ticket the operator will close/note,
  also fence a **concise Zendesk internal note** (who already handled it, the
  evidence, and the next operational fact). It may use multiple sentences or
  lines when needed. Spell out acronyms. Do not start it with `No
  outbound`. When an abbreviated inbound was pinned to a live listing, put that
  verified street in the note so the operator does not have to re-find it.
  Include a Slack permalink in the internal note when an escalation
  thread is already on the file, so the operator does not recreate it. Otherwise
  keep Slack permalinks out unless the operator asked for them.
- **Appendix-only facts are not a retrieval target.** Do not resolve an address,
  open a second customer's file, or pull a property page solely to decorate the
  operator appendix. One OpsHub text pass is enough when it already carries AI
  Summary, SMS, Trust, and Customer Info — do not re-read the same page.

## Reading the OpsHub customer record

Start with the narrow structured read: `list_customers` for the uuid, then the
one feed the recipe needs. `get_activity` for calls, notes, email subjects,
trust changes, and “already handled.” `get_thread` for the SMS exchange.
`get_customer` for sell-direct identity and engagements. `get_customer_profile`
only for cross-deal or assigned Home Sale Advisor. Do not call all four by
default, and do not fall through `get_customer` 404 → full profile on an agent
tour record. Use the customer page in Chrome only if a required fact is absent;
then wait for a load-bearing label such as Customer Info and read once. Re-read
only if the result is visibly incomplete.

**Read what was retrieved before asking anything.** The most common failure is not
retrieval, it is failing to read what is already in hand. A same-day task
transition, a new Assessment Report, a fresh offer state change, or an automated
outbound sent minutes before the inbound is the answer, not ambiguous background.

**Read past the inbound, not just up to it.** The system frequently resolves the
customer's request before the XA opens the ticket. An automated outbound sent an
hour or two after the inbound often already answers it, which turns the reply from
a scheduling ask into a confirmation.

A bare inbound ("Im ready", "yes", "done", "Help") is a reply to something, and it
is very often already handled. Do not infer the intent. Read the message it answered
on the OpsHub customer page, and read both sides of the inbound timestamp.
**The resolving event is not always an SMS.** An inbound phone call to +18883527075
with an operator post-call note frequently sits an hour after the text and contains
the whole answer, including the property address the SMS never gave. Check the Calls
rows and the notes block, not just the SMS thread.

Check which kind of assessment the record shows. An exterior assessment is a
scheduled visit by a named rep, not app photos and not an older Zoom walkthrough.

The AI Summary is a lead, not a citable fact. Confirm specifics beneath it. It also
reports a thread as "stagnant with no specific issues raised" when the resolving
event was a phone call, because it reads the SMS thread only. Do not trust it on
whether anything is open.

**A brand-new record created by Opencomm off the inbound carries nothing.** Rows
reading `Set phone_number_other`, `Deleted first_name`, `Set is_agent to false` all
timestamped minutes after the text mean the record was minted by the inbound itself.
No name, no email, no engagements, no transactions. That is unknown, not absent.
Draft with "Hi there," and assert no stage.

### Limits of the activities feed

- **Email rows carry the subject line only.** The row renders as
  `From: x, To: y - {subject}` and has no expandable body. `read_page` on the node
  returns nothing further. An email subject is therefore never evidence of what the
  email said, only that it was sent. Say "an email with the subject ..." and never
  paraphrase content that was not read.
- Subject lines can render **unfilled merge tags** such as
  `Your client requested an Opendoor offer{{#if address}} for {{address}}{{/if}}`.
  That is an operator-appendix finding, never quoted to the customer, and it is not
  evidence the customer received a broken email.
- **"Load 10 more" frequently does not fire.** The remaining count stays unchanged
  after a click. Treat older activities as unread, and say so in the appendix rather
  than implying the feed was read in full.
- The All / SMS / Calls / Email filter buttons often do not change the rendered feed
  either. Do not assume a filtered view is authoritative.
- **Check an outbound's timestamp against the inbound before citing it as the cause.**
  An outbound that landed after the customer wrote in cannot be what prompted them,
  and XA replies can themselves trigger automated emails moments later, which then
  sit in the feed looking like spontaneous system activity.
- **Call rows carry a disposition string that can contradict the note.** A row reading
  `Agent--Pre-contract--Final Offer Questions` on a call whose note describes a
  dashboard access request is a mis-picked dropdown. The note is the better evidence.
  Never build an offer-state claim off a disposition string.
- Operator field-change rows (`Set is_agent to true`, `Set last_name to ...`) show
  when a record was cleaned up during a call. A same-day `is_agent` flip means the
  agent flag came from an operator's own verification, not from MLS credentials, and
  the Agent Info block will usually still be empty. That distinction is
  operator-appendix only.

## Reading the OpsHub property record

For property-specific HOA questions, including leasing restrictions and HOA or
management contacts, resolve the exact address and use OpsHub
`get_hoas_for_property(address_token, full:true)` before a public-listing fallback
or saying the information is unavailable. Report positive restriction flags only
at the level supported; a true leasing-restriction flag does not supply the actual
lease rules. Provide verified HOA/management contacts for those details. Inspect
all returned associations separately; null restrictions are unknown. The HOA dues
payment rule still routes payment requests to `HOAAP@opendoor.com`.

**Assessments & Inspections is the section that answers "did you get my
assessment".** Start with `get_property` and `get_assessment_visits`. If those do
not expose the exact completion record, read Assessments & Inspections in Chrome.
It states completion as a fact with a date. Nothing else is a substitute:

**Mandatory exception for submitted-photo tickets:** when a seller says they
submitted photos, asks whether the photos or assessment were received, or the
ticket includes a large photo submission, do not infer an outstanding
assessment from `PRELIM_OFFER_SENT`, a null `initialInspectionAt`, an empty
Visits table, or a profile summary. Open the property's **Assessments &
Inspections** section and then **Photos**. A completed assessment and the
customer's submitted photo set are load-bearing facts and override those
summary fields. If both are present, reassure the seller that the assessment
and photos are received and do not send them back to the Opendoor Key App or
offer assessment scheduling. This is an unusual but valid app-submitted path,
not the normal outstanding-assessment flow.

- An activities-feed email subject reading "We received the assessment" is a subject
  line, and by the rule above a subject line is never evidence of content. It is a
  weak proxy at best, and it is the wrong citation when the authoritative section is
  one read away.
- AI Assessment scopes and a dollar total mean photos were processed. Underwriting
  valuations dated after the submission mean pricing is working the file. Both are
  **downstream inference**, not the completion record.
- The Visits table can read 0 active and 0 closed on a flip whose assessment is
  complete, because an app-submitted assessment is not a scheduled visit. Do not
  read an empty Visits table as an absent assessment.

`get_special_flags` does not expose the page's load-bearing Flags block. When
`get_property` lacks `Traditional listing`, pipeline, or market Flags needed for
the reply, navigate once, wait for “Flags,” and read the rendered page. When a
required section still never appears after a real page read, treat the
assessment as **outstanding** only if **all** of these hold: a Seller Full
Assessment (or equivalent) task In Progress, AI Assessment scopes = 0, and Photos
showing none. Prefer the section whenever it renders. Email subjects are still
never completion proof.

The **Flags** block near the bottom is cheap and load bearing. It carries the
pipeline (`Agent Acq — Listed`, `Seller Experience: SELL_DIRECT_AGENT`,
`OD direct lead`), Cash Plus eligibility, the agent commission tier, market
flags such as `Remote Market - App Only`, and **`Traditional listing`**. **A
home is traditional only when that Flags tag is present.** Do not infer
traditional from the public listing tour button. When `Traditional listing` is
on the flip, buyer touring is licensed-agent-only; do not ask for a showing
time. **Read Flags before offering any path** so pipeline and market context
shape the reply. Reading Flags is not the same as banning a path: `Remote
Market - App Only` does not by itself block a direct seller from dashboard IWT
self-schedule or asking us to help schedule (see Sellers with an outstanding
assessment).

## Callbacks

- **Never offer to call a customer and never promise a callback**, even when an
  escalation task is open on the file. Outbound calling is not ours to commit.
- **Exception for a presented final offer.** When the seller wants to speak with
  someone about their FO, send the **assigned Home Sale Advisor’s Calendly** from
  the HSA directory (see the per-type recipe). That is the path, not
  (888) 352-7075 and not an XA callback. Chloe or other missed outbound FO calls
  do not change it.
- For every other “speak with someone” ask, tell them to reply to the ticket or
  call (888) 352-7075, and leave the next move with them.
- Reporting a prior call attempt and voicemail is fine as history, but do not chain
  a future attempt onto it.

## Assessment reschedules and confirmations

- **Do not promise an action the record already completed.** When the appointment is
  already rescheduled and confirmed, the reply confirms it and stops. The confirmed
  appointment is the answer, even when the customer wrote "call me please". See
  Callbacks above for what not to offer instead.
- The reschedule self-service link lives at
  `consumer.opendoor.com/dashboard/sell/{address_uuid}/exterior-assessment/schedule`
  and rides along on every assessment confirmation outbound. The support line
  1-888-352-7075 is the human fallback. **The word "exterior" in that path does not
  describe the appointment.** The URL is correct as the record emits it, and the
  appointment is still the single assessment that must be completed before a final
  offer, with presence determined by vacancy rather than by the label. Never repeat
  the path's wording back to a customer as a description of the appointment.
- Confirmation outbounds get resent and **often name a different rep each time**
  for the same slot. Name only the rep on the newest confirmation. Repeated
  confirmations naming different reps are a common reason a customer writes in
  confused about "this appointment", so read the whole run before assuming the
  question is about the time.
- For an incomplete same-day assessment with a vacant home and lockbox details,
  the customer-facing next step is a reschedule, not a generic yes/no offer to
  reschedule. Tell the customer to use the Opendoor dashboard with their email or
  provide a preferred date and time so Opendoor can schedule it, and ask them to
  include any lockbox information. Never repeat the code itself.
- Automated confirmation emails can go to an email that is not the account's
  `primary_email`, and the template sometimes renders unfilled merge tags for the
  street and scheduled time. Both are operator-appendix findings, never mentioned
  to the customer.
- **Stale assessment-reminder drips are common and they are the reason many of these
  tickets exist.** A "finish your assessment" reminder can land a day or two after
  the assessment was received, which makes the customer think it was lost. Once the
  completion record confirms receipt, say so and name the reminder as automated.
  Check the reminder's timestamp against the completion date before writing that.

## Dashboard links and account setup

**Simple login troubleshooting fast path:** For a bare “cannot log in” or
account-setup failure, use Zendesk plus the requester-email duplicate search.
Read comments only when the ticket indicates a prior support exchange or the
newest inbound is missing. A verified solved duplicate takes the no-reply path.
Otherwise ask what happens during sign-in or for the error message and offer
(888) 352-7075. This is an inbound-supported reply: skip OpsHub recent notes,
customer/property/offer reads, Glean, and browser. Do not look up an account email
just to personalize this first troubleshooting question, assert that a link works,
or claim a reset or resolution. Keep the internal note to the reported problem
and next step; do not add a retrieval-gap appendix for intentionally skipped reads.

Leave this fast path when the customer asks about a specific offer's visibility,
which account email to use, a reset/account change, or an earlier unresolved
support exchange. Use only the matching record checks for that request. An
automated setup email quoting “check your offer” alone does not trigger offer
research. If record identity is verified for another required reason, the normal
verified-email disclosure rule still applies.

Operators hand out a tokenized dashboard link,
`consumer.opendoor.com/dashboard/sell/{address_uuid}?customer={uuid}&human_token={token}`,
and it is safe to refer back to as "the dashboard link we texted you". Do not
reconstruct or re-send one that is not already in the thread.

When a plain (non-tokenized) dashboard link is given, name the account email as the
login credential alongside it. Take the address from Customer Info's primary email,
and prefer an operator-stated update over the displayed value when the operator has
just changed it.

`Your Opendoor password has changed` and `Finish setting up your account` subject
lines landing the same day mean the person is mid-account-setup, which is a common
reason a handed-out link does not open for them. Offer the support line rather than
asserting the link works, and keep the setup inference in the appendix.

## Lifecycle stage

Stage lives in `property_engagements.domain_state` on the **CUSTOMER** record, not
on listing state. Read it first from OpsHub `get_customer` /
`get_customer_profile`. If that structured result omits the engagement field, fall
back to the CUSTOMER index filtered on `id` with the customer UUID.

Each engagement carries `property_engagement_type` (`DIRECT_OFFER`, `DIRECT_LEAD`),
`state` (`ACTIVE`, `TERMINATED_FAILURE`, `TERMINATED_SUCCESS`), `domain_state`
(`PRELIM_OFFER_SENT`, `FINAL_OFFER_SENT`, `QUALIFIED`, `EXPIRED`), start and
terminate timestamps, and the address.

A phone-only CUSTOMER lookup can return a record with **no engagement blocks at
all**, especially on a freshly created or freshly cleaned-up agent record. That is
unknown, not absent. Do not read it as "no offer" or "nothing open", and do not
assert any stage. Either read the property page or say nothing about stage.

Do **not** infer stage from `Listing State`. `SELL_REQUEST_ACTIVE` reads active on
homes still in renovation, and a `SELL_REQUEST_CLOSED` record can refer to a sale
from years earlier. Check `Listed At` and `Sold At` before reading any listing
state as current.

A customer with several `EXPIRED` engagements and one `ACTIVE` has an offer that
keeps auto-regenerating, typically monthly. That is usually why they are getting
repeat emails.

All engagements reading `EXPIRED` / `TERMINATED_FAILURE` does **not** mean nothing
is happening. A live scheduled assessment can sit on a customer whose engagements
have all lapsed, because the regeneration cycle keeps opening and closing them.
Never tell a customer their file is closed on the strength of engagement state
alone.

`PRELIM_OFFER_SENT` can persist on the engagement after the assessment has been
received and underwriting has started. The stage is not a completion check. Read
Assessments & Inspections for that.

When the OpsHub assessment/status section or page tag reads **Sent Finalizing**,
the customer has a current preliminary offer and the final offer is being
finalized. Treat this as a load-bearing stage signal even when the engagement still
displays `PRELIM_OFFER_SENT`. Do not force a fixed phrase into every reply: read
the customer's actual question and describe only the status details that answer
it. Never reduce a record-backed status to “we are checking on the offer” when
OpsHub shows a more specific stage.

For every offer-status ticket, inspect both the property's page tags/Flags and
the **Assessments & Inspections** section before drafting. A lifecycle record
reading `SENT` or an email event saying an offer was sent does not establish that
the final offer was presented. If the property page reads **Sent Finalizing
Offer**, the final offer is not ready and must not be described as sent or
available to view. If Assessments & Inspections says the assessment was
completed, use that recorded completion date as the start of the 3–5 business-day
window. When the property page header or status reads **Finalizing**, treat that
as the load-bearing current status: the final offer is being finalized. A
confirmed assessment-completion date and the property-page **Finalizing** status
take precedence over a stale `PRELIM_OFFER_SENT` lifecycle label; do not
downgrade the reply to “preliminary offer stage.”

If the ticket contains no property address and the customer has multiple
associated properties, use a compact customer lookup to confirm the ambiguity
and ask for the address before pulling property, assessment, or sent-offer
details. Do not load the full customer event/profile history just to establish
that clarification is needed.

When the customer confirms a property whose prior offer is expired and asks what
happened or what to do next, tell them the next step is to refresh the offer; do
not frame it as starting an unrelated new offer request.

When the assessment is completed and the final offer is actively being finalized,
do not mention the preliminary offer in the customer reply. The preliminary offer
may no longer be visible in the customer's internal dashboard; say only that the
final offer is being finalized and will be shared when ready, unless the customer
specifically asks about the earlier offer.
Helpful access guidance may still be included when appropriate, such as directing
the customer to check their email for updates or call (888) 352-7075 for help
accessing the offer.
When the assessment completion date is available, tell the customer the final offer
should be ready **3–5 business days after the assessment is completed**. Always use
that relative wording in the customer reply; never calculate or include a calendar-date
window. If the date is not available, retain the same relative wording without
inventing a date.

`FINAL_OFFER_SENT` is safe to reference to the seller as "your final offer has been
presented". The Transactions table reading **Accepted**, and any "Offer was
accepted" FlipEvent, are flip-side and stay internal.

## Offers

**Confirmed offer denial / Opendoor walked:** When the ticket or verified record
establishes that Opendoor declined or walked away from making an offer, stop the
offer-status lookup. Support cannot provide a specific denial reason. Do not
research assessments, expired offers, pricing, property history, or additional
records to explain the decision. Use the confirmed decision and briefly explain
that a more specific reason cannot be provided; do not imply further research or
an escalation can produce one. A separate substantive request keeps its own
required checks. Target about 20 seconds for this fast path without treating the
time target as permission to skip a necessary verification.

For agent SMS offer-status questions, retrieve the requester’s SMS thread early
when it can supply the full property address or verified property token. If the
first property search is empty, wait for that thread before spending the one
normalized retry; use the exact address it supplies. Do not use
`get_customer_profile` merely to resolve a property when the thread already
contains its token. A WebCustomer UUID is not a sell-direct lead token: do not
pass it to `get_customer`. Use the verified property token for the narrow
property read, then use browser fallback only for required missing page facts.
Reuse the confirmed requester thread and relevant recent notes/activity; do not
pull broad cross-deal history for an offer-timing question. Browser waits must
use an exact observed UI label (the acquisition page uses `Assessment &
Inspection`), not a guessed plural that consumes the timeout.

For the offer actually presented to the seller, prefer OpsHub `get_sent_offer` on
the verified flip token. It returns sent/open/expiry state and the quoted amount;
the amount stays internal unless a separate rule explicitly allows it.

For any customer asking about an offer, establish the property's current position
before drafting. Use the narrowest OpsHub property/customer read that can answer
the question, including the assessment state and any finalization or offer-status
label. Then tailor the reply to that state: an assessment may be incomplete,
completed and entering pricing/finalization, or have a final offer already
presented. Do not use a generic “checking on the offer” response when the property
record provides a more precise status, and do not mention every status detail when
the customer's question does not require it.

When offer history or a missing field still requires Indextrious, filter the
`SELL_DIRECT_OFFER` index on **`address.uuid`**. This is the schema's
declared reverse index path (`go/services/indextrious/internal/indexes/schemas/sell_direct_offer.go`).
`address_uuid`, `address_id`, `address_token`, `lead_id`, and `customer_uuid` all
fail with "missing field".

Never conclude an offer expired without querying this index. A customer saying
"I requested an offer two months ago" often has a live ACTIVE offer refreshed days
before they wrote in.

One property has one live offer. Multiple ACTIVE records are separate flips, which
are internal and never surfaced.

The property page's **Offers** section labels the preliminary one `Estimated`. That
label plus `PRELIM_OFFER_SENT` is enough to say "the preliminary estimate went out"
with a date. The amount stays internal.

## Submission surfaces

Three surfaces, three audiences, never interchange them:

- `opendoor.com/agent` — agents requesting an offer on a client's
  home.
- `opendoor.com` — direct sellers entering their own address to request an offer.
- Buyer offer eligibility (reaffirmed October 23, 2026): the complete state list
  is pending Sam's confirmation. Use `opendoor.com/buy` where direct buyer
  submission is available; preserve known location and listing exceptions.
  Do not infer statewide eligibility from an individual call.
- Buyer offer submission (company process update, 2026-10-22): Georgia buyers
  must work with a licensed agent to place an offer. Some other locations also
  require an agent; do not assume all other states allow direct submission.
  Where direct buyer submission is available, find the property listing at
  `https://www.opendoor.com/buy` and submit from that listing. Confirm the
  location’s path when unknown. Preserve traditional-listing requirements to
  submit through an agent. This changes offer guidance only, not touring/access.
- `https://www.opendoor.com/make-offer` — agents placing an offer or backup offer.
  Include the URL and tell them to enter the property address and follow the
  prompts to submit. `homes@opendoor.com` remains an existing agent contact, not a
  substitute for the required URL in submission guidance. Do not send an
  unrepresented buyer to the agent submission path.

When a current preliminary offer already exists for the client's property, do
not tell the agent to request another offer. Direct them to review the existing
offer and next steps in the dashboard, and ask for the exact error or a
screenshot only if they cannot access it.

When the existing preliminary offer still needs an assessment, explain the
next step: complete the assessment in the **Opendoor Key App** by taking the
required photos live at the home. Existing photos cannot be uploaded separately.

Check the `is_agent` tag and the requester's role before naming a surface in a
draft. If the site will not accept the address a seller or agent enters, that is
itself the ineligibility result, there is no separate submission path to point them
to.

## Address lookups

The goal is the address uuid the record hangs off. Two routes reach it, and the
cheap one usually wins.

Use a bounded retry budget: a street-only address is sufficient for the first
lookup attempt, so make one complete plaintext query using exactly what the
customer provided. If it returns no usable positive match, make at most one normalized retry with the
city/state/ZIP or the exact recipe filter. Then report the connector gap or ask
for the missing address detail. Do not issue a series of guessed address variants.

**Use OpsHub `list_properties` on the plaintext address first.** When it returns
one exact current property, use its address/property identifiers and flip context.
If it is ambiguous, empty, or lacks the listing fact the recipe needs, continue to
PDS or Casa.

**`pds_search_by_address` on the plaintext street address.** When it returns
an exact non-unit match for the street, **its Address ID is the address uuid** and
`resolveAddress` is redundant. Verified: PDS returned
`1a046344-efed-5c9f-b55e-c15e6ff6b872` for a Raleigh address and `resolveAddress`
handed back the identical Casa ID. Skip the second call. **When PDS is not in
the session,** do not NL-search Indextrious for the street. Filter ADDRESS on
`street` (exact), then LISTING or CUSTOMER on `address.uuid` /
`property_engagements.address.uuid`. Verified on Suffern NY ticket 4911400.

**A common street name with no city returns hundreds of candidates.** "17 Magnolia
Ave" returned 178, all rendered as `# 17` unit variants with
`SELL_REQUEST_UNKNOWN`, none of them the real record. Do not start guessing by area
code. Re-run the same query with **`opendoor_owned: true`**, which on a buyer
ticket collapses it to the one live record in a single call, with price, beds,
baths and the correct address uuid attached. `listing_states: ["ACTIVE", "PENDING",
"COMING_SOON"]` is a second filter that narrows the same way. This only works when
the home is ours, so it is the buyer-side path, not the seller-side one.

**`resolveAddress` when PDS is ambiguous or empty.** It needs city, state and zip,
so a ticket giving only a street needs PDS first anyway to recover them. Use
`resolveAddress` when PDS returns several same-street-name candidates in different
cities, or only lot and unit variants, or nothing. Its Casa ID is the address uuid,
and it is the authority when the two disagree. One real case: four candidate uuids
off PDS were all dead and `resolveAddress` returned the live one immediately.

Then filter the **CUSTOMER** index on `property_engagements.address.uuid`. That
field is filterable and it is the reliable way from an address to the customer,
the engagement, the flip id, and the engagement group.

`property_engagements.address.street` is a text field and cannot be filtered.
On `SELL_DIRECT_OFFER` the path is `address.uuid`; `address_uuid` does not exist.

`lookup_user` is employee-only. It fails on customer and agent emails, so do not
reach for it to resolve a requester.

Free-text and natural-language queries on CUSTOMER and ADDRESS return thousands of
irrelevant hits. They are never worth a call.

`pds_search_by_address` is also the right tool for public listing details and the
address ID behind a listing URL. Its results include **lot and unit variants**
("5032 Bridgemore Blvd" vs "5032 Bridgemore Blvd Lot 400", "20014 Hickory Wind Dr"
vs "# 20014"), and the bare street address is often the wrong record. Prefer the
record with a price, photos, and ownership populated.

## Agents vs sellers

- An **agent** attached to the property means the property is **agent
  acquisition**. A **seller** attached means **sell direct**.
- The property page Participants block can label an agent "Seller" while the
  CUSTOMER record reads `is_agent: true`. The CUSTOMER record wins.
- Opendoor is the **buyer** when acquiring. Never ask a seller-side contact
  whether they represent a buyer. A "request to purchase" from that side means a
  request for Opendoor to purchase.
- `get_property_agent_info` routes through `SellDirect/GetLatestLeadByAddress`. It
  is sell-direct only and reports "No Agent assigned / No LWC Product found" even
  when agents are attached. Treat its nulls as **unknown, never absent**, and read
  the agent flag and email off the CUSTOMER record instead.
- That tool labels the attached party "Seller Name" regardless of pipeline. Use the
  name, ignore the label.
- If the contact email on the account is a **brokerage or team domain**
  (`@citysmartliving.com`, `@pappalardoteam.com`, `@lennar.com`, `@markspain.com`),
  multiple agents from that brokerage may check in, and status can be shared
  without individually verifying the caller.
- Zendesk display names can differ from the customer record surname. Never verify
  identity off the ticket name.
- An agent may have **more than one** property sitting at `PRELIM_OFFER_SENT`.
  Check every ACTIVE engagement and name each address, otherwise a second file
  stalls.
- An operator verifying a listing agent off the public listing (their name on the
  active Zillow or MLS listing) and then adding them to the transaction is normal
  practice, and the resulting `is_agent: true` is trustworthy for replying. Do not
  describe the verification method to the customer, and note the empty Agent Info
  block in the appendix rather than treating it as a red flag.
- **Agent verification, once done, is done.** When an earlier comment collected
  full name, MLS sign-in number, real estate license number, email, phone number,
  and brokerage name, and the CUSTOMER record
  now reads `is_agent: true`, that is the verification. Do not re-ask, and do not
  narrate the verification step back to them. Thank them for the details and
  answer the question.
- **Self-identified agent requesting access with verification outstanding:**
  acknowledge the stated agent role and collect the missing verification details
  in the ticket: MLS sign-in number, real estate license number, full name,
  email, phone number, and brokerage name. MLS listing area is optional when
  available; it is not a required verification field. The MLS sign-in number
  means the agent's identifier, never a password. Reuse details already supplied,
  including the verified requester phone; do not ask for them again. A name and
  brokerage alone do not complete verification. Do not merely tell the requester
  to find a licensed agent or redirect them to phone support instead of collecting
  the missing details. Keep access and appointment unconfirmed until verified.
- **MLS membership is not a gate on anything public.** An agent who is not a member
  of the MLS carrying one of our listings still gets the full public listing page.
  Do not treat their non-membership as a problem to solve or a reason to withhold.

### Entry-only and transactional listing brokerages

### Ended seller listing agreement

When a seller sends an ended listing agreement for the former agent or brokerage,
accept it as sufficient evidence that the prior listing relationship ended and
give the seller the benefit of the doubt. This includes agreements from Mark
Spain. Do not continue requesting a separate formal termination document solely
because the MLS withdrawal notice is not itself a termination agreement. Thank
the seller and route the file for the offer or pipeline update supported by the
operator's workflow. Keep the sufficiency decision internal; customer-facing
copy should say that we are updating the seller as the property's primary
contact when that is the next action.
To add a seller to a property, both a phone number and email address are
required. If the email is already on file but the phone number is missing, ask
the seller for the best phone number before confirming the contact update.

Some agent-acquisition leads sit under a brokerage holding an **entry-only**,
**limited service**, or **transactional** listing agreement. The brokerage put the
home on the MLS and is not otherwise in the deal, so the agent will not complete
the assessment and writes in asking us to deal with the owner directly.

- **That request is legitimate and it is the answer.** Do not push the Key app at
  an entry-only agent, and do not treat the refusal as an objection to overcome.
- The flip's only contact is the brokerage, so the owner's details have to come from
  the agent. Ask for the owner's name, phone, and email in the reply. This is one of
  the few cases where a closing ask genuinely moves the ticket, and it matches long
  standing operator practice on these files, "will flip this to the seller's name
  once I've received their contact info".
- Old operator notes on the brokerage's customer record are the tell. Phrases like
  "listed by a transactional brokerage, not involved in the transaction" and
  "limited service listing" recur across unrelated properties, because one brokerage
  record accumulates notes from every file it ever touched. Read them for the
  pattern, not as facts about this address.
- Confirm the pipeline off the CUSTOMER record (`is_agent: true`) and the property
  flags (`Agent Acq — Listed`, `Seller Experience: SELL_DIRECT_AGENT`) before
  writing. The engagement sits on the **agent's** record, not the owner's, so
  nothing about the owner is retrievable from this file. Say "we are glad to work
  with the owner directly", never "we do not have their contact information", which
  asserts a negative.
- Check the market flags before offering any alternative path (same discipline as
  reading Flags before offering any path). On an **entry-only / agent-acquisition**
  flip, do not invent a walkthrough path for the brokerage. `Remote Market - App
  Only` does **not** block a **direct seller** from dashboard IWT self-schedule or
  asking us to help schedule, verified on Richmond VA ticket 4879098.

## CUSTOMER index filters (fallback only)

Prefer OpsHub `list_customers` by phone or email, then `get_customer` or
`get_customer_profile`. Use these Indextrious paths only when OpsHub is unavailable,
ambiguous, or missing the required engagement field.

- `id` — works, exact match on customer UUID.
- `primary_phone_number` — works, E.164 format.
- `property_engagements.address.uuid` — works, and is the address-to-customer path.
- `primary_email` — **cannot be filtered**, it is a `SearchAsYouType` field.
- `property_engagements.address.street` — cannot be filtered, text field.
- Free-text natural-language queries on Indextrious frequently ignore the query
  and return unrelated records. Do not trust them. Use explicit filters.
- Duplicate customer records can share a phone number. Prefer the record carrying
  the name, email, and engagements.

When a filter field name is unknown, stop after two failed guesses and use the
documented paths above or report the connector gap. Do not code-search schemas
mid-ticket.

## Public listings

For buyer requests for seller disclosures, inspection/service records, repair
history, or transaction circumstances that the public listing does not answer,
include a useful listing-agent next step. Verify the assigned listing agent and
contact details from the exact property's OpsHub participants first: use the
verified flip token with `get_acquisition_transaction(panels:["participants"],
full:true)` and select the participant whose role is `RESALE_AGENT`. The tool's
acquisition-page name does not exclude resale participants. Do not substitute
public syndication attribution or a brokerage number for the verified internal
assignment and direct contact. A `get_resale_transaction` response with only a
listing phone does not establish the participant's name; use the participants
panel. This focused internal contact lookup is permitted even when the
condition-detail lookup has reached its stop rule. If the participant cannot be
verified, report that gap rather than promoting public co-listing attribution to
the assigned-agent role. Invite the
customer to request the available records or clarification from the listing
agent; do not promise that documents exist or that the agent will respond.

For general buyer interest in a named listing, include the verified Opendoor
property URL in the first reply so the customer can review photos, floor plans,
and available home details. Name disclosures only when the page shows them.
Do not stop at asking what the customer wants to know when this resource is available.

Public listing URL pattern:
`opendoor.com/properties/{Street-City-ST-Zip}/aid_{address_id}` using the address
ID from `pds_search_by_address`. Build it and confirm with a fetch. Never guess a
URL, and never offer to send a link that is not verified and in hand.

A single `web_fetch` of that URL is the cheapest complete read of everything public
about the home, and it is the right tool for any buyer question. It returns beds,
baths, sqft, lot, year built, price, price history with MLS source, schools, the
prose home description, the full photo count, **labeled floor plan images** (for
example "Main Floor", "Second Floor", "Third Floor"), sometimes a **"Download
seller's disclosure"** link, and the tour affordance the market actually offers.
Inventory only what that fetch showed. A disclosure download is common, not
universal; 56 Cushing St, North Providence RI (ticket 4899221) had floor plans
and no disclosure link.

Three things follow from that:

- **Floor plan labels are not a basement finding.** Plans covering main and second
  floor only is not evidence a basement is absent, and saying so either way is an
  unretrieved claim. Name the plans, let the customer read them.
- **A seller's disclosure, when the page actually has the download, is the right
  destination for a condition, systems, or below-grade question.** Do not send
  them hunting for a disclosure that is not on the listing.
- **Independent inspection option:** For buyer questions about a home's condition
  or systems, explain that the customer may complete an independent inspection if
  they place an offer.
- **Read the tour affordance off the page, do not assume.** Some listings say
  "schedule a self-tour", others say "Tour with agent" or "Share this home with your
  agent and have them arrange a time to tour the home", and the meta description can
  say self-tour while the page body says share-with-agent. The body wins for what
  the consumer page shows. **It is not how we classify a traditional listing.**
  That is the **`Traditional listing` tag in Flags** on the OpsHub property page.

**This page is also the answer for an agent who cannot see the listing in their
MLS.** It is public, it needs no login, and it carries more than an MLS sheet does.
Send the verified URL and inventory what is on it rather than trying to route them
to MLS data.

PDS beds, baths and sqft beat third-party syndication sites, which are often wrong.

For square-footage questions, use the verified listing's labeled home square
footage and separate lot-size field. Prefer those explicit detail fields over
incidental prose in the description; do not recite competing figures or expose
Opendoor source discrepancies to the customer. For 2437 Lynn Rd SE, the verified
listing details show a 1,840 sq ft home and a 9,409 sq ft lot.

List price on an Opendoor-owned listed home is public and shareable. Do **not**
volunteer the "Buy with Opendoor" incentive price unless asked. Do not volunteer the
price at all when they did not ask about it.

A home the seller has listed themselves is a different thing. Its list price and
price-drop history are on the property page and are the seller's own information,
not ours to recite back, and the gap between that list price and our estimate is
never surfaced.

## Timing answers

- Final offer: **3 to 5 business days**, varying 1 to 2 days with volume. Measured
  from the clock that actually started this wait, not from the date of the reply.
  A **fresh assessment** starts the clock at **assessment completion**. If the
  assessment was completed a while ago and they are waiting on a "finalizing"
  offer, they **refreshed an expired offer**; start the clock at the **refresh**,
  not the old assessment date. Do not drop assessment completion as a start
  point on a new assessment. Lennar is within 48 hours, MSRE is expedited. When
  stating this window, say "within 3 to 5 business days of assessment completion"
  or "of that refresh," matching the clock. Default to the window only; skip the
  calendar endpoint unless asked. If you do name a day, use the 5th business day
  (or the 6th if the 5th falls on a weekend), never the early end or a
  non-endpoint day. Verified on Charlotte NC ticket 4899338. **Once that window
  has already passed**, do not restate the 3 to 5 day line or share that the
  file is delayed / still finalizing. Escalate to pricing and tell the seller
  we will look into it and get back to them. See the past-window final-offer
  recipe.
- Customer-facing timing must include the start point: say **“within 3 to 5
  business days of assessment completion”** (or “of that refresh” for a
  refreshed offer), never “within 3 to 5 business days” by itself.
- When explaining this timeline to a customer, say it is the time **for them
  to receive their final offer**; do not leave the timing framed only as an
  internal underwriting duration.
- The Help Center's 4 to 6 business days is stale, superseded by the pricing update
  of 2026-08-11. Prefer #xa-announcements over the article.
- The agent-facing automated email says "2-3 business days" for underwriting. Do not
  repeat that figure back. The verified answer is 3 to 5 business days from the
  assessment-completion or offer-refresh clock above, and quoting the email's
  number sets a date the file will miss.
- Assessment completion dates have failed to carry across flips, so a completion
  date may sit on the wrong or an expired flip. Phrase an absent assessment as
  "we are not showing an assessment completed", never as a flat negative.

## Access codes

**Resolution check first:** Follow [resolution-first access](recipes/access-resolution.md)
before property/status research or drafting a record-specific access or appointment
reply. Recent verified notes resolving the same concern end retrieval. Use a
verified flip token for `get_activity`; older examples that pass a customer UUID
to that tool are superseded. With a verified WebCustomer ID and no flip token,
use `get_customer_profile(customer_uuid: ..., full:false)` for recent customer
events, call handlers, and notes before browser fallback. Live verified October
23, 2026: this returns vendor/appraiser call notes by customer UUID, including
Stefi Fluchaire's appraisal-access resolution. A missing flip token does not
require a browser. Retain the response and emit only relevant recent events,
newer inbound, contradictions, and pagination evidence; even `full:false` can
return extensive history. Use the verified customer search UI only if this
structured read omits the required evidence.
Do not call sell-direct `get_customer` for vendor identity or treat its failure
as missing appointment evidence. Keep Home Visits separate from call resolution.

**Under-contract viewing gate (operator correction, October 22, 2026): Homes
under contract cannot be viewed, including agent previews or viewings intended
for a backup offer.** Check the current listing stage before giving scheduling
guidance. When it is in contract, explain that the home cannot be viewed while
under contract; do not direct the requester to call, use an app, or book through
a showing service for that viewing. Acceptance of backup offers does not permit
a viewing. This correction supersedes older guidance that tours may continue
until closing, even if a booking system allows an appointment. If Support
already told the customer otherwise, directly own and correct that statement.

Anyone asking for "a code" means an **access code for an Opendoor home**.

Do not provide an access code before the property and appointment are verified.
For a request without a full property address, ask for the address first and say
that Opendoor can schedule a viewing after verifying the required information.
Once a viewing is properly scheduled, an access code may be sent by text through
the verified appointment workflow. First-time tourers need full IDV, and repeat
visitors can unlock in the app. Check whether in-app IDV is currently working
before steering someone to the app.

**Showami assessment access when the seller will be absent.** The home must be
vacant for a Showami assessment to proceed without someone present. When the
seller says they will not be there and asks whether to share a door/access code,
ask them to provide the code to Opendoor so it can be given to the Showami
representative. Do not tell the seller to send the code directly to the assessor.
This is the specific assessment-access exception; do not replace it with the
generic buyer-tour or ID-verification response.

Agents complete client assessments in the **Opendoor Key app**, signing in with the
email the invite went to.

An unsuccessful ID scan means the app prompts again on the next attempt. That is
the verified explanation for "why am I being asked to scan my ID again".

**Previous owner on a closed Cash Now, More Later home.** After the acquisition
closes they are no longer the owner; Opendoor is. They agreed to that when they
signed. Treat the inbound as a **buyer** access request. Go through buyer
access guidelines. **Never send a lockbox code**, including by SMS or email.
Thank them for the feedback and say we own the home now and we are doing our
best to sell it. If they want to view it, use the buyer path (licensed agent,
or app / 888-352-7075 when that is the verified buyer path). Do not treat them
as the seller for doors.

## Trust level

Trust level appears twice, in Customer Info and as `Trust` rows in the activities
feed, and the two can disagree because the feed shows every change. Read the newest
`Trust level changed to ...` row, not just the Customer Info summary. A same-day
`deny` followed by `allow` is common on a fresh lead and is not by itself a problem,
but check it before writing anything touching home access. Trust level is never
mentioned to a customer.

**A `deny` with no following `allow` does not make an Opendoor-owned listing
agent-only.** Do not provide a code, remote unlock, or other direct access
instructions by SMS. It is still correct to direct the customer to schedule
through the Opendoor app, where verification is handled, or to call
(888) 352-7075 for support. Route touring through a licensed agent only when
Flags on the property page includes **`Traditional listing`**. Put the deny in
the appendix and never mention it to the customer.

A reply that asserts no access path, no appointment, and no stage does not need the
trust rows read at all. That is what makes the pure-listing-info recipe safe at
three calls. The moment the reply touches touring or codes, pull the customer page.
Exception: the phone-support-only scheduling-failure recipe above does not need
trust history, because verification and availability are left to phone support.
It must not provide a code, remote unlock, direct entry instructions, or claim
that an appointment is scheduled.

## Rental scams

**Simple rental-question fast path:** If the exact ticket contains only a rental
availability question or a rental ad report, with no prior support exchange,
access, move-in, belongings, payment, or shared-information claim, use the ticket
and this section to draft immediately. Do not retrieve comments merely to confirm
a one-message description, search context files for the rental macro, or inspect
OpsHub. Use the concise SMS wording below when the customer name is unavailable;
substitute the verified first name when available. Do not assert ownership without
verification, and do not add the email sign-off to SMS:

> Hi, this is Sam with Opendoor. Opendoor does not offer any rentals or lease to own options on our properties - they are only for sale. Please file a report with the details at https://www.opendoor.com/rental-scam so our team can start an investigation.

Rental wording in the visible inbound is enough to use the verified scam protocol
and customer report URL. Do not open OpsHub merely to reconfirm that rental signal.
Use the narrow OpsHub customer/activity read when the inbound involves access, a
code, move-in, prior contact, or another record-specific claim. It shows whether
the number has prior contact with us, whether a code was ever issued, and what the
automated outbounds said. Confirming ownership alone is not enough context for
those record-specific claims.

When the customer already has an internal rental-scam incident report and the new
ticket asks about a callback, property access, or retrieving belongings, this is a
record-specific operational follow-up. Read the customer's OpsHub thread/activity
and search Slack for the exact property and incident follow-up before drafting.
Do not repeat the generic rental-scam explanation when the incident report already
establishes it. Draft around the latest operational status and the next safe handoff;
never promise access or the return of belongings unless an internal record confirms
that plan.

Do not imply that the customer's belongings are still in the home. Field operations
have documented that belongings may be disposed of after Opendoor takes possession,
and a field visit may find nothing remaining. When filing the internal home issue or
rental-scam report, include the victim's verified phone number and email address so
Trust & Safety can contact the victim directly about scheduling. Do not promise that
items remain available or that retrieval will occur.

If a home issue report is filed for the property manager, ask the customer to
identify the items they believe were left behind so the report has a clear trace.
Do not tell the customer that the items remain, that they will be found, or that
retrieval will occur.

An Opendoor-owned home listed for sale is the fact that makes the rental ad
illegitimate. Opendoor never rents or leases, and never lists on behalf of an owner,
so "they said they were selling and renting at the same time" is still a scam.

For a simple rental signal without an access or move-in claim, do not add an
access-method question unless it is needed for the ticket. If the inbound
mentions access or a move-in, ask whether they gained access, how, and when.
Trust and Safety needs the access method to work the case, and access changes the
situation from a bad ad to a possible move-in. The method matters: victim called
Opendoor for access, suspect provided a keypad or lockbox code, suspect remotely
unlocked the door, victim accessed through the app, victim met the suspect in
person, victim accessed through an unlocked entry point, victim instructed to
break the lockbox or keypad, victim instructed to hire a locksmith.

The rest of what T&S needs: where the ad was seen, the suspect's name, phone, and
email, whether money was sent and how much, whether personal information or
documents were exchanged.

**Victim-resource add-ons are gated.** Do not dump all three on the first scam
reply. Add only the block that matches what they just pushed. Base protocol
(owns / never rents / `/rental-scam` / access ask) stays as-is.

- **Money taken / recovery.** Encourage them to contact their local police
  department and their financial institution to report what happened and ask
  whether there are steps they can take to recover their funds. Opendoor
  collected no funds and is not in a position to reimburse. Verified on
  Victorville CA ticket 4925723 ($4,000).
- **Social Security number shared.** Direct them to Equifax, Experian, and
  TransUnion. The bureaus can provide guidance on protecting their credit,
  including a security freeze or fraud alert on their credit file. Do not send
  this unless they said SSN (or equivalent) was given.
- **Basic needs / housing / food / utilities / mental health / emotional
  well-being.** Encourage them to call 211. It is a free, confidential helpline
  that connects people with local community, health, and human services, 24/7
  in most of the United States. Do not send 211 on a money-only inbound.

**Two Atlassian request types. Do not mix them.**

- **10603** is the XA / operator JIRA: Help Center “Rental Scam JIRA Ticket
  Form” at
  `https://opendoor.atlassian.net/servicedesk/customer/portal/36/group/118/create/10603`.
  We file this. Flip token, CITY links, access method, money, posting URL.
- **10746** is the customer self-submission type. The Zendesk rental-scam
  **macro** and the public “File a rental scam report” button both point at
  `…/portal/36/create/10746?customize=true` (Help Center also lists
  `…/group/118/create/10746`). **Do not send 10746 in the outbound.** It is
  not the XA form, and the public page’s other button (“Report a rental
  scam”) dumps the customer on an Atlassian login.

**Customer-facing report URL, this URL only:**
`https://www.opendoor.com/rental-scam`
Send them there to file a report. Do not include a “learn more about rental
scams” line, and do not send `/w/avoiding-rental-scams`, `opendoor.com/safety`,
or Atlassian **10746** as the report link. `trust@opendoor.com` is the T&S inbox
for details on a call, not a second public report URL. XA still files
**10603** from what comes back. Do not invent an address to complete the
“Opendoor owns [address]” macro line when the street is not verified
(Facebook shares and unread attachments are not an address). Verified on
Victorville CA ticket 4925723 (operator correction: report URL is
`/rental-scam`; drop the learn-more framing). Albuquerque ticket 4921976 still
covers third-party forward / access-method questions, not the public report URL.

Escalation contacts: trust@opendoor.com, lawenforcement@opendoor.com,
safety@opendoor.com for move-ins, and opendoor.com/safety for the customer.

If anyone has moved in, that is the move-in procedure, a different and more
sensitive path than a standard rental scam report.

A rental scam victim or suspect link is a **non-negotiable deny** on home access.
Never grant or promise access on one of these tickets.

## Sellers with an outstanding assessment

**Agent scheduling request shortcut.** When the inbound clearly identifies a
listing agent asking Opendoor to conduct or schedule the assessment, answer the
policy directly: the agent completes it through the **Opendoor Key App** and
Support cannot schedule it for them. Do not retrieve customer/property records,
assessment status, Flags, or browser pages solely to support that policy reply.
Do not claim the assessment is outstanding or describe the offer stage without
evidence. This shortcut overrides the record gate below for this narrow reply;
separate status, completion, or appointment questions still require their gates.

**Gate first.** This whole section only applies when the assessment is genuinely
outstanding, confirmed from Assessments & Inspections on the property page, not
guessed from a reminder email. From `FINAL_OFFER_SENT` onward none of it is
available, no matter how the customer worded the question. See "Stage gates the
playbook". It also does not apply to an entry-only agent, see that section.

When the requester is an agent, do not tell the agent to use the seller
dashboard with the agent's own email or force the seller to take a specific
access path. Say the dashboard contains the estimated offer and instructions,
and that the agent can share the dashboard with the seller if needed. The
assessment itself is completed in the **Opendoor Key App** (or through an
in-home walkthrough when that path is available).

Existing photos cannot be uploaded. The Opendoor Key App requires photos taken
live, so pricing gets the exact angles. Sellers and agents alike. "Assessments completed
outside the app remain valid" means a finished alternate path already on the
record. It does **not** mean the customer can email, text, or upload gallery
photos to finish an outstanding assessment.

Agents never get appointments scheduled for them, and are never offered a
walkthrough. The app is the path, with (888) 352-7075 as the fallback for live
in-app help. Direct sellers have three assessment paths when photos are owed:
(1) Opendoor Key App live photos at the home, (2) self-schedule an in-home
walkthrough from the dashboard, (3) reply here or call (888) 352-7075 and we can
help get one scheduled. In customer copy, always write **Opendoor Key App**. Never promise a callback. If the inbound already says they are not at
the property or only have existing photos, offer all three in the **same** first
reply. "Push the app first" applies when they are trying the app and stuck, not
when they already said they cannot be there. `Remote Market - App Only` does
**not** remove (2) or (3). IWTs are scheduled with a third party vendor, never
named. Say "an in-home walkthrough". No video walkthrough exists, say so plainly
and offer help by phone.

**Stale flip vs primary.** When a banner says a newer or primary flip exists, open
primary for Flags and pipeline. For a direct-seller SMS about assessment or photos,
still use the seller outstanding-assessment paths above (Opendoor Key App,
dashboard IWT self-schedule, or we help schedule) even if primary is labeled Agent Acq, as long
as the SMS customer is the seller or customer on the file and the assessment is
outstanding. Never mention multiple flips outward.

**Seller asking to upload existing photos / "I'm not at the property" / "Can I
send you the pictures?".** Existing photos cannot be uploaded. Explain that
assessment photos must be taken live through the Opendoor Key App so the required
current angles and condition can be captured; "Can I send them" is not a yes to
SMS or email photos. The only time XA can upload photos is **digital checkout**.
Pre-assessment, photos are taken live in the Opendoor Key App (or an in-home walkthrough).
Write **Opendoor Key App** in the reply, not
"the Key app". For a direct seller with an outstanding assessment,
offer the three paths in one reply. Do not treat `Remote Market - App Only` as a
reason to omit dashboard self-schedule or help-scheduling. Verified on ticket
4879098; operator correction on ticket 4940495.

The customer dashboard is an instruction surface for the next step; it is not
where the assessment is completed. For a direct seller with a preliminary offer,
refer them to the dashboard for the applicable instructions, then state that the
assessment is completed either through the **Opendoor Key App** or by scheduling
an in-home walkthrough. The agent-only Key App restriction is internal routing
guidance and must not be mentioned in a seller-facing reply unless the ticket
identifies the customer as an agent.

## Offer complaints

For a simple “offer too low” complaint, use narrow OpsHub MCP reads immediately
after the ticket and required duplicate check to establish the matched customer's
preliminary/final stage and assessment state. Discover only those required
schemas, retain responses, and emit focused evidence rather than a full customer
history. Do not read overlapping recipes or broaden to browser research unless a
required authoritative fact remains missing from structured reads. A customer
profile UUID is not a sell-direct lead token; use the correct verified identifier
for each tool. Preserve the recent-resolution and requester/property identity gates.

Establish prelim versus final from `domain_state` before replying. A preliminary
estimate is comps and public records only, with nobody having seen the home, and
the final can come back different once the assessment captures actual condition.
Give them a reason to keep going, and offer to walk them through **how to complete**
the assessment rather than what it involves. Do not imply the final will be higher.

An explicit STOP or equivalent request to stop sending messages or offers is a
no-reply signal on any channel. Do not draft a customer confirmation; provide
only the internal note. For email, process the email unsubscribe when applicable.

Hold the offer amount, and any fee or pricing mechanics beyond comps and condition.

Underwriter and budget-review notes on the property page, including comp quality
remarks, Reno 911 scopes, valuation ranges and OVM error percentages, are
operator-appendix only.

## Privacy and deletion requests

These are owned by the privacy team in #privacy-escalations. Search that channel
for the ticket link and read the latest thread instructions before drafting.

**Escalation entry point:** The channel has a “Privacy Request Escalations”
workflow with a “Privacy Escalation” form. Use that workflow when an escalation
is warranted rather than substituting a regular channel-message draft. Its
fields are Customer Name, Customer Profile Link, Type of Escalation,
Escalation Origination, and Summary of Communication History. Verify the
customer-profile link and available escalation-type options; never invent them.
For email tickets, the origination is Zendesk/Written. Prepare the form for
operator review and leave Submit untouched. Workflow-generated channel posts
are a signal to inspect the channel's workflow before choosing a regular draft.

**Customer-profile deletion versus property removal:** When the property is
confirmed absent from Opendoor's directory, describe the deletion request as
customer-profile deletion. Do not imply that deleting the profile removes
public property pages, photos, or search results. Do not use those separate asks
alone to bypass the initial-response path or create an objection escalation.
Apply directory absence only when verified or supplied
by the operator; a missing property field on a ticket is not proof.

**Approved macros only:** use only the two approved privacy responses for the
applicable deletion-objection workflow; no off-script explanations, additions,
or improvised troubleshooting. Read the [Privacy FAQ](https://docs.google.com/document/d/1-ozEZYbcM3DcM6HHHLk8HiT4RyLOr10zHpH0B0TZ9dE/edit)
for the applicable response. If the customer pushes back after the approved
responses, escalate in #privacy-escalations. If Privacy directs an earlier return
to the thread, follow that instruction. Directed verbatim text takes precedence
over the usual greeting/sign-off wrapper. Flag unanswered questions to the
operator instead of appending answers.

The two objection responses are conditional follow-ups, not two messages to
send automatically for an initial deletion request. The FAQ applies them when
the individual objects to a deletion response and then follows up again. An
initial customer-profile deletion request may receive the applicable portal
instructions first. Property-directory presence does not determine the number
of responses. A repeated initial request in another ticket is not itself an
objection to a response. Do not create an objection escalation merely because
two initial-request tickets exist. Source: Sasha Ellison's September 14, 2026
thread, https://opendoor.enterprise.slack.com/archives/C07FM3A439C/p1789402415038949,
read together with the FAQ's conditional objection-response sections.

For an initial customer-profile deletion request matching this case, the
customer-facing body is: “To request deletion of your customer profile, please
visit https://www.opendoor.com/privacyrequest and click ‘Make a Privacy Request’
to get started.” Use the normal email greeting and sign-off. Do not append a
property-removal disclaimer or create a Slack draft/workflow escalation at this
stage. Recommend this response without claiming it was sent. A later appeal,
verified Privacy direction, or other applicable escalation rule takes priority.

**State privacy requests and mobile-app account deletion are separate workflows.**
A portal failure does not by itself establish a technical problem or eligibility.
Sasha confirmed that the customer in the source case was outside an eligible
privacy state and could not submit through the portal. Do not generalize that
case into a current state list, claim all app deletion is state-restricted, or
send every customer back to the portal. If request type or eligibility is unclear,
ask Privacy to research it. Do not promise deletion or a completion date.

When Privacy says no further response is needed, recommend no customer reply,
even if the latest message repeats the deletion request or threatens a BBB
complaint. This disposition requires direction on the matching case; it is not
a blanket rule for all complaints. A `hold_no_agent_replies` tag points the same
way. Flag genuinely separate profile/IDV questions to the operator and route the
decision back to Privacy rather than independently reopening the conversation.

If the customer says “appeal,” preserve the FAQ's prompt internal Legal Jira
escalation with a communication summary and requested outcome. Do not copy the
customer, direct them to Legal, or promise a response time. A BBB threat alone
is not evidence of an appeal.

Do not add retention-law citations or specific clauses to the approved language.
Do not claim an unsubscribe has been completed without verified action; if the
approved macro's completion claim is unverified, flag it to the operator and
obtain Privacy direction instead of sending an inaccurate or rewritten macro.

Source: [Sasha Ellison, October 20–21, 2026](https://opendoor.enterprise.slack.com/archives/C07FM3A439C/p1792543788923079?thread_ts=1792088602.701459).
The October 21 final reply says “No further response needed.” This supersedes
generic portal-failure routing for that case.

## Remaining proceeds after resale

For a former seller asking about remaining proceeds or a signed release after
resale, read the ticket and the matching earlier support exchange. Apply the
existing repeated-concern search once; retain the verified referral handler and
date, prior substantive answer (if any), and customer-reported document completion.
A forwarding note or solved ticket alone does not establish payment or resolution.
Use the matched customer's recent OpsHub notes/activity to check for a later
answer. If resale closing matters, verify the actual resale close date from the
matched resale transaction (for example `get_resale_transaction_full`), or a
verified transaction note; acquisition COE and a generic sold status do not prove
that date. If it cannot be confirmed, omit it and disclose the gap in the appendix.
Do not retrieve unrelated assessment or offer-status details for this question.

When the record confirms Executive Experience owns the concern, include
executive.experience@opendoor.com in the reply when directing the customer to
forward earlier emails, and preserve the verified referral date. Ask for prior
correspondence so the contact history is included. Do not request another signed
release just because document completeness is unconfirmed. State separately that
payment timing and any outstanding requirements remain unconfirmed; neither a
signed-release report nor resale closing proves disbursement. Do not promise a
payment date or import an unrelated response-time commitment. Keep the ticket
open pending confirmation from Executive Experience. Put prior ticket identifiers
in the operator appendix, outside the internal-note box.

## Legal requests

When a customer mentions legal action or asks to contact Legal, direct them to
Executive Experience at executive.experience@opendoor.com. Executive Experience
responds within 1 business day.

## Selling options, Cash and Cash Plus

Cash Plus is also called **Cash Now, More Later**. Availability is
market-dependent, so confirm the market before offering it as an option.

- Cash: assessment, then final offer, presented as a **net proceeds** figure after
  closing costs. Highest and best, non-negotiable, no counteroffers. An HSA can
  request a pricing re-review only if material information was missed, and the
  price may not move.
- When quoting estimated net proceeds, use the amount visibly displayed in the
  OpsHub Acquisition page's Latest pricing card for the selected product. A
  conflicting backend `estimatedNetProceedsCents` field from `get_sent_offer`
  is not sufficient to override the visible OpsHub amount; treat the mismatch
  as an internal data discrepancy and do not surface the backend-only value.
- Post-contract **diligence visit** verifies condition. Outcomes are clear-to-close,
  rare offer adjustment, very rare walk. This is the honest answer to "is the offer
  guaranteed not to change". The DV is a light inspection. Never use that phrase
  with a seller, and note there may be charges not reflected in the report.
- For a post-contract repair or condition-change report, request photos of the
  damage when needed for review. Do not ask the customer for repair quotes unless
  the record or reviewing team specifically requires them.
- Closing: the seller picks the date inside the published **21 to 60 business day**
  window from signing. Some markets are tighter, so check the Market Nuances sheet
  before naming exact options. Lockbox arrives 7 days before close, digital checkout
  the day before. **Funds are released on the selected close-of-escrow date.** When
  an agent or seller asks to close and get paid (especially naming 21 days), say
  that in the same reply. Do not invent a post-closing wire lag. Verified on Irmo
  SC ticket 4910496.
- **Cancellation: any time before closing, at no cost.** The home cannot be listed
  or marketed anywhere while under contract, and an active listing must come down
  on signing.
- Cash Plus: upfront cash at the first closing (CP1). The seller moves at that
  closing. Opendoor then lists the home (CP2) and the seller receives upside if it
  resells above the target price. Upside window is **1 year** as of early 2026, up
  from 120 days. Cancel any time before CP1 closes, per the addendum. After CP1 and
  before the resale goes under contract, the seller can buy the home back by
  repaying the upfront cash plus a processing fee.
- **Never quote the fee or buyback percentages**, even though the articles name
  them. Keep fee and upside mechanics high-level and route to the HSA and the
  contract preview on the dashboard.
- Do not invent a figure for how long after closing a bank takes to show the
  funds. The verified customer-facing line is release on the selected closing date.
- A seller sending many questions at once is a Final Offer Call, not an email.
  Answer the load-bearing ones, keep it short, and send the assigned Home Sale
  Advisor’s Calendly rather than answering all ten in a wall of text. Do not
  substitute the support line for that scheduling path.

## Known gap

No tool has been found that reads a customer's Home Access Status or Alfred case
history. When a ticket turns on that, it comes from the operator's own read.

No tool has been found that reads the **body** of an outbound email. OpsHub gives
the subject line only, so when a ticket turns on what an email actually said, that
is an unverifiable gap and belongs in the appendix as one.

No tool has been found that reads **interior layout or MLS listing remarks** for a
home. Separate entrances, basement walkouts, room adjacencies and similar features
are not retrievable. The public listing's photo set, floor plans and seller's
disclosure are the answer, and asserting the feature is not.

## Scoring log

Google Sheets ID `1Jkw7-T4aiCPuQVkCIzsEHv2ADkKqTmZoQgqXXtBNX2s`, `Sheet1`, six
columns: date, ticket, type/channel, verdict, what went wrong, rule added. Append a
row once the operator scores the draft **when a Sheets connector is available**;
otherwise remind the operator. Ticket numbers and types only, no customer names or
addresses.

When the operator edits or corrects an email draft, record the correction as
workflow feedback: preserve the operator's intended internal-note wording, and
promote the correction into this skill when it expresses a reusable rule rather
than a ticket-specific fact.

## Agent representation and transaction-count questions — October 27, 2026

Source: [Alexis Schlattman's clarification, acknowledged by Sam](https://opendoor.enterprise.slack.com/archives/C04TVKE41KP/p1793130542029719).
Agents must represent their clients; referrals alone no longer qualify for
payment under the current agent program. An agent may still use “refer” to mean
representation, so clarify their meaning before applying that distinction.

Agents do not have a reliable self-service way to check their transaction count
for the bonus structure. Do not send them to a dashboard or /agent to track it.
For a count request, use the agent's email to find their OpsHub Customer record
and review the transactions shown lower on that page. Share only the verified
history; do not equate every displayed transaction with a qualifying bonus.
If the agent reports a missing transaction, obtain the missing property's address
for backend review/correction through the appropriate team. Do not claim a
correction or payment is complete without confirmation.

This clarification supplies no bonus amounts, tiers, qualifying-stage rules,
payout timing, or backend owner. Preserve separate seller-agent commission
guidance and existing limits on compensation advice. Notes record only what
actually happened; ordinary note drafting does not authorize record lookups.
