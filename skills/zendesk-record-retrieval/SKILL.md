---
name: "zendesk-record-retrieval"
description: "Retrieval playbook for Opendoor Zendesk ticket drafting — Glean ticket, address resolve, OpsHub customer page, Assessments & Inspections, lifecycle stage and offers, then a paste-ready reply. Auto-apply on any ticket paste, Zendesk id, SMS/email thread, customer message, or when the operator sends an address, phone, or email and needs a draft. Do not wait to be named."
---

# Zendesk record retrieval, Opendoor XA

Retrieval reference for drafting customer-facing Zendesk replies. Voice, formatting,
and the hard business rules for the reply itself live in the project instructions
and are deliberately not duplicated here.


**Cursor / Grok note:** This is the retrieval playbook for Zendesk ticket drafting.
Voice, hard business rules (R1–R10), and reply formatting live in the project
always-on rules (`.cursor/rules/zendesk.mdc`) and are deliberately not duplicated
here at length. Prefer **paste-ready draft + operator appendix** output. Use
whichever connectors exist in this Cursor session (Glean, Indextrious/PDS,
OpsHub/browser, Slack search, web fetch). When a named Claude Chrome tool
(`ToolSearch`, `browser_batch`, `tabs_context_mcp`, `mcp__claude-in-chrome__*`)
is missing, use the available browser/MCP equivalent, or ask the operator to
paste the OpsHub/Zendesk block — degrade visibly, never invent credentials,
UUIDs, offer amounts, or unverified facts. Skip Gumloop. Sibling projects
`xa-notes` (post-call notes) and `xa-quick-slack` (escalations) live in other
Cursor Transfer folders — do not invent Slack escalation output here.


## Keeping this skill current

**This file is the durable memory for this work. Conversations are not.**

Whenever the operator corrects a draft, states a rule, or teaches something about
how a record behaves, **offer to update this `SKILL.md` in the same turn** (edit
the file in this Cursor project). Do not wait to be asked, and do not rely on the
scoring log to carry it — the log is a per-ticket audit trail and does not load
into context. Capture every edit the operator makes to a draft, not only edits
phrased explicitly as a rule — a correction to wording, a fact, or formatting is
itself a rule worth recording.

**Spend a rewrite on a rule that would change a future draft:** a new ticket
shape, a corrected fact, a retrieval path that failed. Do not spend it on a
passing observation about how a page rendered. When the only findings are minor,
hold them and fold them into the next rewrite that a real rule triggers.

Also correct anything here that turns out to be wrong. A stale line in this file is
worse than a missing one, because it will be trusted. If this file ever contradicts
the project always-on rules (`.cursor/rules/zendesk.mdc`), the project rules win,
and this file gets fixed in the same turn.

Then append the scoring row once the operator scores the draft (Sheets ID in
Scoring log below — only if a Sheets connector is available; otherwise remind the
operator to log it).

## Triage first

Before running the retrieval chain at all, check whether the ticket text itself
already resolves the category. Three shortcuts are common enough to name:

- **A rental, lease, or rental-listing signal in the ticket text is itself the
  rental scam signal.** Draft the scam-protocol reply directly, see "Rental scams"
  below. No Glean tag, OpsHub read, or property lookup is needed to confirm it.
- **An unsolicited listing / marketing email** (brokerage blast pitching a home
  for sale, no support ask) is spam. Recommend mark as spam and close. See the
  per-type recipe. Do not resolve the street they pitched.
- **A pure policy or product question with no customer or property specifics
  needed** goes straight to a Help Center / #xa-announcements search, skipping
  customer and property retrieval entirely.

Only run the full Glean → OpsHub → property chain below when the ticket actually
needs customer- or property-specific facts.

## Attachments

Attachment content is not in the Glean index. Try **at most two reads**: the
ticket page, then a direct fetch of the file if a URL is already in hand. If the
file is a scan, image-only PDF, video, or otherwise unreadable, say so in the
operator appendix and ask the operator what it shows. Do **not** OCR, do **not**
screenshot to read text, and do **not** escalate permissions for a download.
Draft from the ticket text and structured records already in hand; assert nothing
from a file that was not read.

## Step zero, check Chrome

Most of the retrieval order runs in Chrome. Confirm the browser is connected before
starting, because when it is not, the temptation is to substitute the Indextrious
and PDS tools and produce a thinner draft from fragments.

If Chrome is unavailable, say so plainly in the response and name what could not be
checked. Do not quietly fall back and present the result as if the record were fully
read.

**Load every browser / OpsHub tool the ticket will need up front** when the
session exposes them (`navigate`, page text / snapshot, tabs). Prefer
one upfront tool discovery over mid-ticket re-discovery. If Chrome/browser tools
are unavailable, say so and ask for a paste of the OpsHub/Zendesk sections needed
rather than silently thinning the draft.

**If browser tools error or lose tabs mid-ticket**, name what could not be
checked, continue with the structured tools already in hand, and leave browser
fixing for between tickets. Do not screenshot, switch-tab-debug, or file
extension diagnostics during a draft.

## Order of lookup

This order is deliberate. The OpsHub customer page usually ends the ticket on its
own. Working the narrow tools first means more calls, a worse draft, and missed
context. Stop as soon as the answer is in hand. Two or three calls should do it.

1. **The ticket.** Glean, app "zendesk", search the ticket number,
   `num_results: 3`. Pasted text is partial; requester, channel, status and tags
   live on the record.
   **Read tags on that first result before opening anything else.**
   `hold_no_agent_replies` is a close-lean, not a skip-lookup: still confirm the
   inbound is already resolved, then recommend no send. An operator comment that
   is only a Slack URL is not directed verbatim; do not open Slack unless the
   comment looks like privacy/ops-directed language or Glean left the ask
   unanswered.
   **Then decide whether Chrome is needed at all.** Glean's index truncates newest
   comments first, but it often returns the newest comment in full, and when it has,
   opening the ticket in Chrome costs three round trips (a navigate plus two
   `get_page_text` calls, because the page renders in stages) and returns nothing
   new. Read the Glean result first. Open
   `opendoor.zendesk.com/agent/tickets/{ticket_id}` only when the comment is visibly
   cut off, when tags or status matter and Glean did not surface them, or when the
   reply turns on a comment that may be newer than the index.
   **If the last inbound message is a closing acknowledgment** ("thanks", "thank
   you") with no new question, and the prior outbound already resolved the ask, do
   not draft a reply at all, the ticket should simply be closed. Stop here, at
   ticket-level Glean plus at most one Chrome read of the ticket page. Do not pull
   OpsHub or the property page when the thread itself already answers the ticket.
   **Never combine `navigate` and `get_page_text` for a fresh Zendesk ticket page in
   a single `browser_batch` call.** The page has not rendered yet at that point, so
   the batched read fails and costs a retry. Navigate first as its own call, then
   `get_page_text` as a separate call after it.
2. **Customer uuid.** CUSTOMER index filtered on `id`, or on
   `primary_phone_number` in E.164 for an SMS ticket. Take the
   address uuid and the engagement group id (flip id) while there. Phone on the
   ticket beats `resolveAddress`: do not resolve the street first when Glean
   already has E.164. When the ticket gives a street address and no phone, get the
   address uuid first, see "Address lookups".
3. **OpsHub customer page, in Chrome.**
   `https://opshub.apps.opendoor.com/customers/{customer_uuid}`. This is where most
   tickets end. It carries the AI Summary of the customer's history and what is open,
   the full two-way SMS thread with every automated outbound and its timestamp,
   operator notes and ORVA disclosures, an activities feed including trust changes
   and FlipEvents, Sales Insights, tasks, visits, and Customer Info with trust level
   and comms enrollment.
4. **OpsHub property page, in Chrome**, whenever the home or the assessment is the
   question. `https://opshub.apps.opendoor.com/property/{address_uuid}/flip/{flip_id}`.
   Carries the lifecycle stamp with dates, **Assessments & Inspections**, the
   Assessment Report and its date, valuations and scopes, work orders, listing and
   MLS state, price history, buyer offers, photos, access codes, participants and
   roles.
5. **Only if OpsHub left a gap:** `pds_search_by_address`,
   `get_property_agent_info`, `SELL_DIRECT_OFFER` filtered on `address.uuid`, TASK.

**Prefer a direct structured-data tool over opening OpsHub in Chrome whenever one
answers the question.** Utility task status is `opshub_get_utility_tasks` /
`opshub_get_utility_task_by_task_uuid` / `opshub_list_utility_tasks`. Basic
property or listing facts are `pds_search_by_address` / `pds_search_by_location`.
Reserve Chrome for the OpsHub customer page (AI Summary, SMS thread, notes, trust
level, activities) and the property page's Assessments & Inspections section, which
have no API equivalent.

**Use `browser_batch` for every OpsHub page** (the ticket page is the one exception,
see above — it needs a standalone `navigate` first). OpsHub pages render in stages,
so a lone `get_page_text` after a navigate returns only the header on those. Batch
the navigate and both reads into one call instead of paying three round trips per
page. Note that `browser_batch` requires an explicit real `tabId`, so a standalone
`navigate` (which front-loads the tab context and returns the id) has to come first
when no tab id is in hand. `tabId: 0` fails.

**Inside a browser batch (Claude Chrome or Cursor equivalent), action names are
bare, not fully qualified.** Example: `{"name": "get_page_text", ...}` works;
`{"name": "mcp__claude-in-chrome__get_page_text", ...}` fails with `unknown tool`
and kills the batch on the first item. Match whatever naming the active connector
expects.

Note `.apps` in the host. `opshub.opendoor.com` is dead. Never guess a URL, ask.

Policy and product questions need no record lookup. Search the Zendesk Help Center
and #xa-announcements / #xa-team-floor-support, `num_results: 3` there as well.

## Per-type recipes

Recurring ticket shapes get a fixed call list here, added as each type recurs. A
recipe names the calls and where to stop, and it saves deciding the path from
scratch. **A recipe does not override the record.** If what comes back contradicts
the shape, the record wins, see "Stage gates the playbook".

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
- **Bare-keyword SMS ("Help", "Hi", "Yes") tagged `initial_greeting_sms`.** Glean the
  ticket for the two phone numbers, CUSTOMER filtered on `primary_phone_number`, then
  one batched read of the OpsHub customer page. Stop there. **The answer is very
  often a same-day inbound phone call that already resolved it**, so read the Calls
  rows and the operator post-call note before treating the inbound as ambiguous. When
  the note says the request was handled, the reply is a short confirmation of what was
  done, and no property-page read is needed because no property fact is being
  asserted. Verified on an agent dashboard-access ticket that scored sent as-is.
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
- **Unsolicited vendor / staging pitch on SMS** (offers staging, cleaning, photography,
  etc.; often greets a named person who is not the requester; frequently tagged
  `initial_greeting_sms`). Two calls. Glean the ticket, CUSTOMER on
  `primary_phone_number`. When the record is an Opencomm mint (id + phone only, no
  name, email, or engagements), **stop** — draft a short polite decline that this is
  Opendoor Support and the line is for customer support, not vendor inquiries. Do
  **not** open OpsHub, do **not** resolve or pull the street they named, and do **not**
  assert stage, listing, or ownership. Skipping OpsHub is safe only because the reply
  asserts no access path, no appointment, and no stage. If CUSTOMER shows a real
  engagement history, fall back to the normal OpsHub customer read. A greeting aimed
  at someone else ("Hi Lisa,") stays in the operator appendix when that name is nowhere
  on the record; leave it out of the draft. Verified on Venice CA ticket 4879194
  (Elite Home Staging) that scored sent as-is.
- **Unsolicited listing / marketing email** (brokerage blast pitching a home for
  sale: beds, baths, list price, listing copy, tracking links; no support ask).
  Glean the ticket. Open the ticket page only if Glean truncated the comment or
  omitted status/tags. **Stop.** Do not CUSTOMER-lookup, do not open OpsHub, do
  not resolve or pull the street they pitched, and do not draft a customer reply.
  Recommend mark as spam and close. Glean often dumps the listing body and hides
  requester metadata, which is not a reason to keep retrieving. Distinct from the
  vendor-SMS recipe, which still declines in-thread because that inbound is on a
  support line. Verified on Portland OR ticket 4886268 (The Agency "Bull Mountain
  Stunner") that scored sent as-is.
- **Inspector / appraiser SMS that names who the visit is for.** Do **not** use the
  unsolicited-vendor recipe off an Opencomm mint or a leftover “Hi [name],”. Open
  the property page and **verify a participant**: buyer, buyer’s agent, or lender.
  The inbound naming the buyer (or BA / lender) as who the inspection is for is
  the match. Separately confirm Visits: the inspection company should appear on
  the **name of the person assigned to the appointment** (not just “a visit exists
  on a street we own”). Then confirm we see the appointment and ask how we can
  help. Do not send a code. Verified on Aurora CO ticket 4886013: inbound named
  buyer Ernesto Lemus; Visits showed Audrey Stewart (Stauss Inspections).
- **Inspector heads-up that already went to the listing agent.** Glean the ticket,
  then one OpsHub customer-page read of the inspector/vendor record. Read the SMS
  thread past the inbound: these shops often dual-text support (`+1480…`) and the
  listing agent’s cell. When the listing agent already confirmed (vacant / BA can
  share access / utilities), recommend close and do not send a second reply or a
  code. Name who texted and what they confirmed, with confidence. One-line
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
- **Direct seller SMS: "I have pictures / how do I upload / I'm not at the
  property," assessment still outstanding.** Glean the ticket, CUSTOMER on
  `primary_phone_number`, one OpsHub customer read, then the property page for
  Flags and assessment status (read Flags before offering any path). If a banner
  says a newer flip exists, open primary for Flags/pipeline, then see "stale flip
  vs primary" under Sellers with an outstanding assessment. Draft: existing photos
  cannot be uploaded; offer three paths in the same first reply — (1) Key app live
  photos at the home, (2) self-schedule an in-home walkthrough from the dashboard,
  (3) reply here or call (888) 352-7075 and we can help get one scheduled. Do not
  omit (2) or (3) because of `Remote Market - App Only`. Never promise a callback.
  Verified on Richmond VA ticket 4879098.
- **Agent asking how to upload existing photos, assessment still outstanding.**
  Do **not** use the direct-seller three-path recipe. Two dependent rounds: Glean
  the ticket, then `resolveAddress` (or PDS) plus CUSTOMER on the address uuid
  and TASK on that uuid in the same block. `is_agent: true` +
  `PRELIM_OFFER_SENT` + `seller_full_assessment` / `agent_full_assessment`
  IN_PROGRESS is the whole answer. **Stop.** Do not open the property page for
  Flags, photos, or notes, and do not query `SELL_DIRECT_OFFER`. Entry-only is
  when they refuse the assessment and ask us to work the owner; asking how to
  upload is the opposite. Draft: existing photos cannot be uploaded; Key app
  live photos at the home; reply here or call (888) 352-7075 if they get stuck
  in the app. No walkthrough. Verified on Rowlett TX ticket 4910782 (602
  Winners Cir) that scored sent as-is.
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
- **Direct seller SMS to the confirmation number: vacant / lockbox / "I won't be
  there" on a same-day confirmed assessment.** Three calls. Glean the ticket
  (tags + phones), CUSTOMER on `primary_phone_number`, then the property page
  Assessments & Inspections (and Offer Workflow if it is already on the same
  dump). Skip `resolveAddress`, skip the OpsHub customer page, and skip Slack
  when the operator comment is only a thread URL. If Assessments shows
  completed (handoff / condition scoping / Assessment Report dated today) and
  underwriting has started, the appointment already happened; the 11:30-style
  "checking in" outbound is residual. With `hold_no_agent_replies`, recommend
  close and do not send. If you still paste a draft, it only confirms completion
  and that nothing else is owed. Verified on Alexandria VA ticket 4885665
  (sent as-is).
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
- **Seller SMS that the final offer is past the 3 to 5 business day window.**
  Escalate to pricing to see if the offer is stuck. Do **not** tell the customer
  the team is delayed, that the offer is still being finalized, that there is no
  completion time, or to check the dashboard. Customer-facing is only that we
  will look into it and get back to them. **Read the post-call notes first.** If
  someone already flagged pricing, do not open a second Slack thread or recreate
  the ticket. Put that existing Slack permalink in the Zendesk internal note
  (include Slack links in internal notes going forward when an escalation thread
  is already on the file). Verified on Englewood CO ticket 4910959.

## Home detail disputes

When a customer disputes a home detail (a fact on the internal Home Details field,
comps, or the estimate's stated features), check the consumer-facing dashboard at
`https://consumer.apps.opendoor.com/dashboard/sell/{address_uuid}?customer={customer_uuid}`
before concluding the premise is unconfirmed. The internal OpsHub Home Details field
can disagree with what the customer actually sees on their own dashboard, and the
internal field agreeing with the customer does not settle the dispute either way.

A disputed detail is submitted to pricing, not corrected in the reply. Say it has
been noted and sent to pricing, that pricing will cross-reference county tax
records, and that any change will be reflected when the offer is finalized. Never
restate the internal field back to the customer as if it settles the question.

## Stage gates the playbook, not the customer's wording

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

- **One ticket per session.** About 85% of a long session's cost is re-reading the
  accumulated thread on every turn. The exception is a follow-up reply on a ticket
  already worked, which stays in the original session so the uuids and offer state
  remain in context.
- **Count round trips, not just tokens.** Wall-clock time is dominated by sequential
  dependent calls. Batch anything independent into one block, and cut any call whose
  result would not change the draft.
- **Set a retrieval budget from the ticket shape before calling tools.** For a
  recognized short-path SMS, target two dependent rounds: ticket first, then the
  exact customer lookup plus only the one property/listing confirmation needed.
  Stop when every outward claim is supported. Do not keep retrieving to explain an
  ambiguous inbound when the best reply is a short clarification or standard next
  step. A recognized agent "how do I upload existing photos" ticket is that
  short path: Glean, then address uuid → CUSTOMER + TASK. Do not spend a Chrome
  property-page read confirming Flags or empty Photos once TASK already shows
  the assessment in progress.
- **Do not work around a missing PDS connector with broad natural-language
  Indextrious searches.** Use a known exact address uuid from a relevant ticket or
  exact structured result, or verify the public listing directly. After one noisy
  or failed broad query, switch paths or state the gap; repeated broad retries add
  latency without increasing confidence.
- **`num_results: 3`, never 8.** Each result is a full document. Two eight-result
  Help Center searches cost about 23,500 tokens. Raise it only after a narrow
  search genuinely comes up short.
- **Never screenshot to read text.** One screenshot cost 27,018 tokens, twelve times
  ten Chrome text calls combined. When `read_page` truncates a line at 100
  characters, click "Show more" and re-read the node. Screenshot only when the
  answer is genuinely visual.
- Glean ticket-number lookups are cheap, 300 to 1,000 tokens. Use them freely, and
  let the result decide whether Chrome is needed.
- Indextrious results often blow the token limit and dump to a file the sandbox
  cannot read, and `limit` does not shrink them. Delegate that read to a subagent
  with a field list and a word cap.
- **A subagent is not a substitute for the right first call.** Spawning one to hunt
  a uuid cost 46,000 tokens and 24 tool calls on a lookup that a single address
  resolution answers. Delegate to shrink a read that is known to be huge, never to
  search for something a single correct call would return.
- A CUSTOMER lookup on a long-tenured customer returns every property engagement
  ever created, which can be twenty-five or more near-identical blocks. Budget for
  that, and read only the newest few and the one that is ACTIVE.
- Prefer a **fenced paste-ready draft** (and a short operator appendix below it)
  over HTML widgets. Skip Claude-only `visualize:*` copy boxes — they are not
  available in Cursor. On no-send or any ticket the operator will close/note,
  always provide a **one-line Zendesk internal note in its own copy box** (who
  already handled it, or the single pasteable fact). In chat, use the reusable
  writing-block/copy-box format for that note, not only prose in the explanation.
  Spell out acronyms. Do not start it with `No outbound`. Include a Slack
  permalink in the internal note when an escalation thread is already on the
  file, so the operator does not recreate it. Otherwise keep Slack permalinks
  out unless the operator asked for them.
- **Appendix-only facts are not a retrieval target.** Do not resolve an address,
  open a second customer's file, or pull a property page solely to decorate the
  operator appendix. One OpsHub text pass is enough when it already carries AI
  Summary, SMS, Trust, and Customer Info — do not re-read the same page.

## Reading the OpsHub customer page

Batch the navigate with two `get_page_text` calls, because the first returns only
the header. `find` locates the newest comment. `read_page` on that node gives the
text, and a click on "Show more" expands anything cut off.

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

## Reading the OpsHub property page

**Assessments & Inspections is the section that answers "did you get my
assessment". Go there first and read it directly.** It states completion as a
fact with a date. Nothing else on the page is a substitute:

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

`get_page_text` on the property page does not reliably render every section, and
Assessments & Inspections is one that can be missing from the dump entirely. Prefer
`find` for "assessment" or "inspections", then `read_page` that node, when those
tools exist. When the section still never appears after a real page read, treat the
assessment as **outstanding** only if **all** of these hold: a Seller Full
Assessment (or equivalent) task In Progress, AI Assessment scopes = 0, and Photos
showing none. Prefer the section whenever it renders. Email subjects are still
never completion proof.

The **Flags** block near the bottom is cheap and load bearing. It carries the
pipeline (`Agent Acq — Listed`, `Seller Experience: SELL_DIRECT_AGENT`,
`OD direct lead`), Cash Plus eligibility, the agent commission tier, and market
flags such as `Remote Market - App Only`. **Read it before offering any path** so
pipeline and market context shape the reply. Reading Flags is not the same as
banning a path: `Remote Market - App Only` does not by itself block a direct
seller from dashboard IWT self-schedule or asking us to help schedule (see
Sellers with an outstanding assessment).

## Callbacks

- **Never offer to call a customer and never promise a callback**, even when an
  escalation task is open on the file. Outbound calling is not ours to commit.
  When a customer asks to speak with someone, tell them to reply to the ticket or
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
on the property. Query the CUSTOMER index filtered on `id` with the customer UUID.

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

`FINAL_OFFER_SENT` is safe to reference to the seller as "your final offer has been
presented". The Transactions table reading **Accepted**, and any "Offer was
accepted" FlipEvent, are flip-side and stay internal.

## Offers

Filter the `SELL_DIRECT_OFFER` index on **`address.uuid`**. This is the schema's
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

- `opendoor.com/agent` — agents requesting or re-requesting an offer on a client's
  home.
- `opendoor.com` — direct sellers entering their own address to request an offer.
- `opendoor.com/homes` — buyers finding an Opendoor listing and placing an offer
  there. If the home is a traditional listing, the site tells the buyer to share
  it with their agent; they cannot place an offer there.
- `opendoor.com/makeoffer` — agents placing an offer. Do not present
  `homes@opendoor.com` on an ordinary agent offer call; that inbox remains for
  backup offers only.
  Do not send the buyer `/makeoffer`.

Check the `is_agent` tag and the requester's role before naming a surface in a
draft. If the site will not accept the address a seller or agent enters, that is
itself the ineligibility result, there is no separate submission path to point them
to.

## Address lookups

The goal is the address uuid the record hangs off. Two routes reach it, and the
cheap one usually wins.

**`pds_search_by_address` on the plaintext street address, first.** When it returns
an exact non-unit match for the street, **its Address ID is the address uuid** and
`resolveAddress` is redundant. Verified: PDS returned
`1a046344-efed-5c9f-b55e-c15e6ff6b872` for a Raleigh address and `resolveAddress`
handed back the identical Casa ID. Skip the second call.

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
  full name, MLS or board, brokerage, and license number, and the CUSTOMER record
  now reads `is_agent: true`, that is the verification. Do not re-ask, and do not
  narrate the verification step back to them. Thank them for the details and
  answer the question.
- **MLS membership is not a gate on anything public.** An agent who is not a member
  of the MLS carrying one of our listings still gets the full public listing page.
  Do not treat their non-membership as a problem to solve or a reason to withhold.

### Entry-only and transactional listing brokerages

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

## CUSTOMER index filters

- `id` — works, exact match on customer UUID.
- `primary_phone_number` — works, E.164 format.
- `property_engagements.address.uuid` — works, and is the address-to-customer path.
- `primary_email` — **cannot be filtered**, it is a `SearchAsYouType` field.
- `property_engagements.address.street` — cannot be filtered, text field.
- Free-text natural-language queries on Indextrious frequently ignore the query
  and return unrelated records. Do not trust them. Use explicit filters.
- Duplicate customer records can share a phone number. Prefer the record carrying
  the name, email, and engagements.

When a filter field name is unknown, stop after two failed guesses and read the
index schema in the monorepo: `zoekt_search` for
`keyword file:internal/indexes/schemas/` plus the index name.

## Public listings

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
- **Read the tour affordance off the page, do not assume.** Some listings say
  "schedule a self-tour", others say "Tour with agent" or "Share this home with your
  agent and have them arrange a time to tour the home", and the meta description can
  say self-tour while the page body says share-with-agent. The body wins. On a
  customer with a **trust deny**, route touring through their own agent and offer no
  access path of our own, per the never-promise-access rule.

**This page is also the answer for an agent who cannot see the listing in their
MLS.** It is public, it needs no login, and it carries more than an MLS sheet does.
Send the verified URL and inventory what is on it rather than trying to route them
to MLS data.

PDS beds, baths and sqft beat third-party syndication sites, which are often wrong.

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

Anyone asking for "a code" means an **access code for an Opendoor home**.

Codes are never provided over text. Direct them to the Opendoor app to verify ID,
or to call 1-888-352-7075 for live verification. First-time tourers need full IDV,
repeat visitors can unlock in the app. Check whether in-app IDV is currently
working before steering someone to the app.

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
(888) 352-7075 for support. Route touring through the buyer's own agent only when
the listing itself is a traditional listing or its verified tour affordance is
agent-only. Put the deny in the appendix and never mention it to the customer.

A reply that asserts no access path, no appointment, and no stage does not need the
trust rows read at all. That is what makes the pure-listing-info recipe safe at
three calls. The moment the reply touches touring or codes, pull the customer page.

## Rental scams

Read the OpsHub customer page before replying. It shows whether the number has any
prior contact with us, whether a code was ever issued, and what the automated
outbounds said. Confirming ownership alone is not enough context.

An Opendoor-owned home listed for sale is the fact that makes the rental ad
illegitimate. Opendoor never rents or leases, and never lists on behalf of an owner,
so "they said they were selling and renting at the same time" is still a scam.

**Always ask whether they gained access to the property, and if they did, how.**
This is not optional. It is easy to skip when someone is only asking whether a
listing is real. Trust and Safety needs the access method to work the case, and
access changes the situation from a bad ad to a possible move-in. The method
matters: victim called Opendoor for access, suspect provided a keypad or lockbox
code, suspect remotely unlocked the door, victim accessed through the app, victim
met the suspect in person, victim accessed through an unlocked entry point, victim
instructed to break the lockbox or keypad, victim instructed to hire a locksmith.
Get the date and time too.

The rest of what T&S needs: where the ad was seen, the suspect's name, phone, and
email, whether money was sent and how much, whether personal information or
documents were exchanged.

Where money changed hands or personal information was given, encourage a police
report. Opendoor collected no funds and is not in a position to reimburse.
Escalation contacts: trust@opendoor.com, lawenforcement@opendoor.com,
safety@opendoor.com for move-ins, and opendoor.com/safety for the customer.

If anyone has moved in, that is the move-in procedure, a different and more
sensitive path than a standard rental scam report.

A rental scam victim or suspect link is a **non-negotiable deny** on home access.
Never grant or promise access on one of these tickets.

## Sellers with an outstanding assessment

**Gate first.** This whole section only applies when the assessment is genuinely
outstanding, confirmed from Assessments & Inspections on the property page, not
guessed from a reminder email. From `FINAL_OFFER_SENT` onward none of it is
available, no matter how the customer worded the question. See "Stage gates the
playbook". It also does not apply to an entry-only agent, see that section.

Point them to log in on opendoor.com with **their own email** and name the
**dashboard** explicitly. That is where the initial estimated offer and the next
steps to complete the assessment live.

Existing photos cannot be uploaded. The Key app requires photos taken live, so
pricing gets the exact angles. Sellers and agents alike. "Assessments completed
outside the app remain valid" means a finished alternate path already on the
record. It does **not** mean the customer can email, text, or upload gallery
photos to finish an outstanding assessment.

Agents never get appointments scheduled for them, and are never offered a
walkthrough. The app is the path, with (888) 352-7075 as the fallback for live
in-app help. Direct sellers have three assessment paths when photos are owed:
(1) Key app live photos at the home, (2) self-schedule an in-home walkthrough from
the dashboard, (3) reply here or call (888) 352-7075 and we can help get one
scheduled. Never promise a callback. If the inbound already says they are not at
the property or only have existing photos, offer all three in the **same** first
reply. "Push the app first" applies when they are trying the app and stuck, not
when they already said they cannot be there. `Remote Market - App Only` does
**not** remove (2) or (3). IWTs are scheduled with a third party vendor, never
named. Say "an in-home walkthrough". No video walkthrough exists, say so plainly
and offer help by phone.

**Stale flip vs primary.** When a banner says a newer or primary flip exists, open
primary for Flags and pipeline. For a direct-seller SMS about assessment or photos,
still use the seller outstanding-assessment paths above (Key app, dashboard IWT
self-schedule, or we help schedule) even if primary is labeled Agent Acq, as long
as the SMS customer is the seller or customer on the file and the assessment is
outstanding. Never mention multiple flips outward.

**Seller asking to upload existing photos / "I'm not at the property".** Existing
photos cannot be uploaded. For a direct seller with an outstanding assessment,
offer the three paths in one reply. Do not treat `Remote Market - App Only` as a
reason to omit dashboard self-schedule or help-scheduling. Verified on ticket
4879098.

## Offer complaints

Establish prelim versus final from `domain_state` before replying. A preliminary
estimate is comps and public records only, with nobody having seen the home, and
the final can come back different once the assessment captures actual condition.
Give them a reason to keep going, and offer to walk them through **how to complete**
the assessment rather than what it involves. Do not imply the final will be higher.

Never raise unsubscribe unless the customer sends STOP.

Hold the offer amount, and any fee or pricing mechanics beyond comps and condition.

Underwriter and budget-review notes on the property page, including comp quality
remarks, Reno 911 scopes, valuation ranges and OVM error percentages, are
operator-appendix only.

## Privacy and deletion requests

These are owned by the privacy team in #privacy-escalations, not by the XA. Search
that channel for the ticket link before drafting. The team frequently posts
**directed verbatim text** and says whether it is the final response. When they
have, emit it verbatim and do not append to it, even if the customer asked other
questions the text does not answer. Flag those unanswered questions to the operator
instead.

When the directed text is marked final and says no further response is needed if
the customer replies, that holds even when the reply contains new questions.
Recommend no reply. If some questions are genuinely outside privacy scope, such as
profile or IDV support, say so and route the decision back to the privacy team
rather than reopening the thread. A `hold_no_agent_replies` tag points the same way.

Do not cite retention law or point to a specific clause. The approved language does
not, deliberately.

Escalation path when the Privacy Center form or in-app deletion fails is
support@opendoor.com for routing, plus opendoor-privacy.relyance.ai in some states.

## Selling options, Cash and Cash Plus

Cash Plus is also called **Cash Now, More Later**. Availability is
market-dependent, so confirm the market before offering it as an option.

- Cash: assessment, then final offer, presented as a **net proceeds** figure after
  closing costs. Highest and best, non-negotiable, no counteroffers. An HSA can
  request a pricing re-review only if material information was missed, and the
  price may not move.
- Post-contract **diligence visit** verifies condition. Outcomes are clear-to-close,
  rare offer adjustment, very rare walk. This is the honest answer to "is the offer
  guaranteed not to change". The DV is a light inspection. Never use that phrase
  with a seller, and note there may be charges not reflected in the report.
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
  Answer the load-bearing ones, keep it short, and offer to schedule the HSA rather
  than answering all ten in a wall of text.

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
