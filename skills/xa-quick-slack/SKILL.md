---
name: xa-quick-slack
description: Fast OpsHub notes and Slack escalation drafts for Opendoor XAs.
---

# XA Quick Slack — runtime

## Workflow commands — verified 2026-10-26

- `send and post it` / `send and post` explicitly authorizes the complete flow:
  send the verified escalation through `slack_send_message`, capture the returned
  `message_link`, then post the five-field OpsHub CONTACT note using
  `CreateCustomerNote`. Do both in the same turn without another confirmation.
- Sending through the Slack MCP was verified in this project on 2026-10-26.
  Discover the live send tool when needed; do not claim sending is unavailable
  based on an older instruction. This command does not require Skill Router.
- For send-and-post, reuse every recipient, role, coverage, caller, property,
  channel, and message-format gate from the draft path. Replace the draft call
  with one send call; do not create a draft first. Fetch `whoami` alongside the
  independent lookups when no current operator token is available.
- If an existing confirmed draft from this ticket is being sent, pass its
  `draft_id` to the send tool so it is removed after sending.
- Use the returned Slack permalink first in `Follow Up Link`, then related
  verified workflow links, any supplied Zendesk URL, and the verified property
  URL. Post to the caller's CONTACT UUID using the flat mutation contract below.
- If Slack succeeds but the note fails, preserve the permalink and retry only
  the note when safe under the mutation receipt rules. Never resend Slack to
  recover a note failure. Do not automatically retry a send with uncertain
  execution status; resolve whether it was sent before attempting another send.
- `draft it` (including `draft it/post it`) remains draft-only. `post it` alone
  means Slack was already sent: find its permalink and post only the CONTACT
  note. Paste-only remains the default without an explicit action command.
- Slack Connect remains draft-only. Workflow-form channels retain their form
  gates below. If a tool or channel prevents sending, complete the safe work
  available and report the specific blocker without claiming completion.
- The XA authorizes joining the required escalation channel when they are not
  already a member. If membership blocks the workflow, join that exact channel
  through an available supported Slack tool and continue the authorized draft
  or send-and-post flow without asking for confirmation. Retry a rejected send
  only when the membership error confirms no message was sent. If no supported
  join capability is available or joining fails, report that specific blocker.
  A membership fix does not override an externally-shared-channel restriction.
- `#support-hsa-escalations` is an internal escalation channel: always attempt
  the authorized send through the Slack MCP. If the connector rejects it as
  externally shared, describe that as a connector restriction, not a change
  to the channel's routing or a lack of user authorization. Do not bypass the
  rejection through browser/native UI or resend through another destination.
  Preserve an existing draft; create a fallback draft only if none exists.

## Existing-issue thread check — before a new escalation

This gate applies to paste-ready Slack text, explicit drafts, and authorized
send-and-post actions. An apparent new escalation is provisional until this
check is complete. The XA does not need to say “continue the thread.” This gate
overrides new-post fast paths, fixed two-round budgets, and channel-preference
ranking below. It does not reroute `post it` after Slack was already sent.

1. Search `slack_search_public_and_private` across accessible channels, not
   only the default destination. Use the distinctive quoted street address
   (for example, `"1981 Central"`), or an already verified property UUID; use
   customer name or ticket reference when no property key is available.
   Request messages, `include_context: false`, `limit: 10`, timestamp sort,
   and concise output. Do not AND the address with every situation word:
   earlier posts may describe the same issue differently. Batch this search
   with independent caller/property/profile lookups when possible.
2. Read the parent and replies with `slack_read_thread` for the strongest
   candidate(s), at most two. Verify the same property/customer and same
   underlying issue, its current status, channel, exact parent timestamp,
   and permalink. A shared address alone, a bot post, or an unrelated old
   issue is not a match. If a reply links the active discussion elsewhere,
   follow that link within the two-thread read budget and prefer the ongoing
   discussion over the forwarding escalation. If no usable result appears,
   allow one shorter-key/property-UUID fallback search; do not keep searching.
3. One clear same-issue discussion automatically changes Shape A to Shape B.
   Use that thread's actual `channel_id` and parent `thread_ts`, even when
   it is outside the default escalation channel. Preserve applicable named
   targets and coverage checks. Match issue continuity before channel or
   recency; an unrelated newer escalation never outranks the active issue.
   Use the existing Shape B reply and note format, retaining the current call
   and a brief relevant recap. Do not send a second top-level post as well.
4. If multiple discussions remain genuinely tied, show their verified links
   and ask which to continue before drafting/sending. A successful bounded
   search with no same-issue match permits the original Shape A route.
   A tool/access failure is not a clean search miss: report that the check
   could not be completed and stop before draft/send. If no usable search key
   exists, ask for the property or issue reference.

An explicit instruction to create a separate new post overrides automatic
thread reuse. An explicitly named channel stays binding unless the XA also
authorizes switching to the existing discussion; if the clear match is in a
different channel, show it and ask which destination to use. A default channel
chosen by the skill is not an explicit channel instruction.

If an unsent draft already exists, do not leave a duplicate or create another
draft while silently switching destinations. Use a supported draft-edit/move
operation if available; otherwise provide the verified thread and replacement
reply and ask the XA to clear the old draft before creating its replacement.
Never repair it through Slack UI automation. A supplied thread link can also
switch a pending escalation to Shape B after its parent and replies are read.
Report the chosen thread link below the finished output; describe a confirmed
thread draft as `Draft in #channel — in the existing thread, not sent.`

### Speed, token use, and output

- Reuse verified facts and completed thread checks for the same ticket; do not
  search again on `draft it`, wording edits, or a destination switch already
  resolved in this chat. Refresh only when new facts or elapsed time could
  change the decision. A new caller/issue needs its own check.
- Discover only missing tool schemas in one batch. Run independent read-only
  lookups together; keep dependent reads and mutations sequential.
- Read only the strongest thread first; read a second only for a linked active
  discussion or a real ambiguity. Stop once the destination and current issue
  are verified. Do not fetch broad channel history, attachments, or unrelated
  profiles as extra confirmation. Request compact thread output while keeping
  the exact parent timestamp and current replies needed for verification.
- During live tickets, return the required note and requested Slack text or
  confirmed action receipt only. Keep thread recaps to relevant facts; omit
  lookup narration, repeated explanations, and duplicate Slack text after a
  confirmed draft. Report only blockers or routing/coverage choices that matter.
- Efficiency never skips property, identity, coverage, thread-match, or mutation
  receipt checks required by the selected workflow. Do not claim measured speed
  or token savings without a real measurement.

## Required output check

Before displaying a note, creating a Slack draft, or posting a CONTACT note:
- Use exactly these five OpsHub labels in order: `Property Address:`,
  `Reason for Call:`, `Customer Concerns:`, `Solution Offered:`, `Follow Up Link:`.
  Keep each value on its label's line and one blank line between fields.
  Never substitute `Reason for Contact:` or add `Follow Up Required:`.
- Expand the XA's acronyms in all note and Slack prose: COE → close of escrow,
  FO → Final Offer, HSA → home sale advisor, IWT → in-home walkthrough,
  DCO → digital checkout, CNML → Cash Now More Later. Preserve verified names,
  Slack handles, channel identifiers, and URLs exactly.
- Validate the actual CONTACT mutation `body`, not only the chat preview.
  It must preserve the five fields and blank lines, with no code fences.
  Do not reuse a previously displayed note if it fails these checks.
- If the first skill read is truncated, retrieve only its missing output-format
  section before drafting; never reconstruct labels from memory.

This is the single hot-path skill. Do not read another skill or reference for a
routine note, named-target paste, or named-target draft. The detailed editable
source is `../../../skills/xa-quick-slack/SKILL.md`; consult it only for an
uncovered process question or maintenance.

If this skill is not already in the chat, the first action is only reading this
file. No other tools. No chat text.

## Execution budget

Use the smallest valid path and stop when the note and requested draft are
complete:

- Warm-up is text-only: `Ready when you are.` Do not reread this file or
  discover schemas when it is already in context.
- Do not reread the canonical skill for a routine ticket. Read only the
  relevant section for maintenance or an uncovered process question.
- Use one lookup contract per ticket: one compact caller lookup, one minimal
  participant fetch when needed, one profile check for each named individual
  target, and one draft. Named individuals always require an OOO/coverage
  check before drafting; skip the profile only for a directory usergroup.
- Allow at most one fallback search per lookup, including the shorter street-name
  retry in Property resolution fallback. Never repeat a phone, address, channel, or
  user search after a reliable ID is available.
- Stop once a reliable customer ID, property ID, assigned-person ID, or Slack
  permalink is available. If the single fallback also fails, use the facts
  already resolved, name the missing field, and do not launch another broad
  search or browser round.
- Reuse stable channel IDs, user IDs, role groups, and session data already in
  this file or the current chat.
- Canonical channel mapping: `#support-listing-partner-escalations` is
  `C026P10RHLY`. Use this channel for listing-partner / buyer-agent offer,
  listing, property, and contract escalations unless the XA explicitly names a
  different channel. Do not substitute `#buyer-offer-escalations` or another
  similarly named channel.
- Request compact payloads: narrow indexes, small limits, `concise` responses,
  participant panels only, and `full: false` where supported.
- Do not edit this skill during a live ticket. Maintenance is a separate task.
- Track elapsed time, tool-call count, fallback count, duplicate lookups,
  correction turns, and final output tokens internally; never print telemetry.

## Hard-stop Slack draft format

Before calling `slack_send_message_draft`, render Shape A exactly like this:

```
<@USERID|Name> [<!subteam^GROUPID|@coverage-group> or <@COVERID|Cover Name> ][Full address](https://opshub.apps.opendoor.com/property/{casa_id})
Agent <https://opshub.apps.opendoor.com/customers/{customer_uuid}|Agent Name> called to report [the situation in one compact line].
```

- First line: verified target mention, then any required verified cover or
  coverage-group mention, then the verified property link and full address.
  When no coverage applies, the property link follows the target mention.
- Second line: one compact sentence/line only. For an agent caller, begin
  exactly with `Agent <customer-link|Agent Name> called to report ...`.
- No blank line, headings, labels, bullets, italic/bold field names,
  `Customer:` lines, `Escalated to:` lines, phone/email, or extra paragraphs
  in the Slack body. The mention already identifies the destination.
- Use `/customers/{uuid}` (plural) for customer links and
  `/property/{casa_id}` for property links. Never use `/customer/`.
- This format is separate from the five-field OpsHub note. Never paste the
  OpsHub note fields into Slack.
- Never invent, modernize, or "clean up" a Slack format. If the situation is
  Shape A, use the literal Shape A template above. If it is Shape B, use the
  Shape B conversation-matching guidance below. Keep Shape A exact for new
  listing-partner and HSA escalations; existing-thread replies follow the
  verified conversation style.

## Hard-stop channel routing check

**HOA dues payment exception:** Any request to make a payment for HOA dues
routes to `HOAAP@opendoor.com`, the team that makes all of Opendoor's HOA
payments. Do not route this payment request to `#hoa-communications`, another
Slack channel, or a general HOA contact. This exception overrides the general
HOA-workflow routing below.

Resolve the assigned participant's role before choosing the channel. An
acquisition participant with `ACQ_AE`, `ACQ_CX`, `ACQ_TC`, or
`ACQ_SALES_SUPPORT` routes to `#support-hsa-escalations` unless the verified
engagement is a resale/listing-partner case. Use
`#support-listing-partner-escalations` for buyer or buyer-agent
listing/property/offer/contract issues when the assigned participant is a
verified resale agent, resale transaction coordinator, or Listing Partner.
Do not route to listing partner merely because the caller is an agent or
because the target was named.

When the XA names an individual, the verified Slack role controls the channel:
a Home Sale Advisor or Agent Home Sale Advisor always routes to
`#support-hsa-escalations`, even for buyer-side or listing-related topics.
`#support-listing-partner-escalations` is only for a verified Listing Partner,
Resale Agent, or resale transaction coordinator, or for the resolved resale
participant who owns the escalation. Topic wording never overrides the verified
target role.

## Tool homes (named-target draft)

Discover the required tools and the property fallback together, then work.
Use the exposed tool names: `user-opshub.*` may appear as
`mcp__opshub__*`, and Slack tools as `mcp__codex_apps__slack_slack_*`.

- `user-opshub.list_customers`
- `plugin-opendoor-casa-opendoor-casa.resolveAddress`
- `mcp__opshub__global_search` for the property fallback below
- `plugin-slack-slack.slack_read_user_profile`
- `plugin-slack-slack.slack_send_message_draft` for drafts
- `plugin-slack-slack.slack_send_message` for explicit send-and-post
- `user-opshub.get_acquisition_transaction` for the seller-side participant panel
- `user-opshub.call_operation` for the CONTACT-note mutation
- `user-opshub.whoami` for `createdByToken`

Never `user-slack`. Never `user-opshub.resolveAddress`. Never a Slack pattern
search for schemas. Casa is not an OpsHub tool.

### Property resolution fallback

Property-link retrieval belongs to this workflow. Do not ask the XA to find or
paste an OpsHub property URL after a failed lookup. Reuse any verified property
ID/link already in this call, then complete the fallback below. If those lookups
still cannot verify a unique property, retain the call and report the specific
lookup blocker; ask only for a missing address detail that resolves a concrete
ambiguity (such as city or unit). Never invent a link or bypass verification.
When the primary-email choice is missing, ask only that choice, list the known
email candidates, and wait. Retain property lookup responsibility and the original
send/post action across the answer; do not add a property-link request to the
email question or classify the waiting choice as an uncertain completed action.

Automatically use the OpsHub MCP for supplied property addresses; do not wait
for the XA to ask. If Casa `resolveAddress` is unavailable or fails, call
`mcp__opshub__global_search` with the distinctive street name and `limit: 3`
(for example, `{"query":"Spanish Flower","limit":3}`). Avoid a house-number-only
query, which also matches ZIP codes, or a shortened mixed number/name query,
which can miss an existing address. If a prior full-address or number/name
query returned no exact match, retry once with just the distinctive street name
before reporting a property lookup blocker. Read the `PROPERTY` results and
verify street, unit when supplied, city, state, and postal code against the
XA's address. Use the exact matching result's `addressToken` as the property
ID for `https://opshub.apps.opendoor.com/property/{addressToken}`. Use the
matching live `propertyEngagementGroupId` as `flip_token` for the required
participants fetch. This result satisfies the property-link gate without a
second address lookup or browser visit.

Do not use `find_deals_matching` to resolve a street address: its criteria
parser can omit the address and return unrelated properties. Unrelated rows
are not a verified match. Complete the supported `global_search` fallback
before reporting a property lookup blocker. A failed search is not evidence that
the property is absent from OpsHub; describe it only as a lookup failure.
If the street-name search has no unique
exact match, stop and name the missing verified property URL; do not guess.

## Non-negotiable draft gates

- When the XA supplies a property address, resolve it before drafting. The
  draft is blocked until a verified Casa/property ID and the canonical
  `https://opshub.apps.opendoor.com/property/{casa_id}` URL are available.
- If Casa is unavailable or fails, use the property resolution fallback above.
  Never use Chrome, native Slack, CUA, or a browser page to discover or repair
  a property link on the named-target path. If the fallback also fails, stop,
  name the missing property URL, and do not create a draft.
- The Shape A first line must use Markdown hyperlink syntax with the verified property
  URL and full address. Internally validate that the message contains both a
  property link and the resolved customer link before calling the draft tool.
- Use one `slack_send_message_draft` call per draft attempt. Follow the bounded
  recovery rules in **Draft safety** if confirmation is missing. Never paste
  Slack Markdown into the native Slack composer and never use UI automation to edit or repair
  a draft. If a draft needs correction and no supported Slack draft-edit tool
  exists, stop and report that the XA must edit or clear it in Slack; do not
  create a duplicate draft.
- `slack_send_message_draft` accepts text only; it cannot attach screenshots or
  other files. Never claim that supplied photos were included in the draft.
  Tell the XA to attach them manually to the existing Slack draft before
  sending.

## Silent draft sequence (named target + `draft it` / `draft it/post it`)

### Authoritative meaning of `post it`

When the XA says `post it`, `POST IT`, or `I sent the Slack message`, treat the
Slack message as already sent. Do not create, edit, or discuss a draft. Search
for the real Slack permalink, then post the corresponding CONTACT note to
OpsHub with the Slack permalink first in `Follow Up Link`.

`draft it` creates an unsent Slack draft. For `send and post it`, use the
complete send-and-post flow above. The following rules apply to `post it` alone.
When the XA says Slack is already posted and then says `post it`, that means
post the OpsHub note, not create another Slack draft: find the real Slack
permalink, then upload the exact five-field note to the caller's CONTACT page.
Do not call `slack_send_message`. Do not print anything to the XA until the
finished note. Order:

The XA may say only `post it` or `posted` as shorthand for “the Slack message
and any related workflow ticket were already submitted; now post the
corresponding note to OpsHub with every verified Slack permalink and property
link.” Treat that as the posted-Slack path every time. In this project, the XA
may send one main escalation and one or more related workflow tickets (for
example, a pricing ticket) before returning here. The OpsHub note must carry
all of those links, not only the main escalation link.
The prior `draft it` does not mean the Slack message is still unsent once the XA
says `post it`; do not ask for confirmation or explain this mapping again.
Never interpret that shorthand as permission to create or send another Slack
message.

This mapping also applies when `post it` follows a draft in the same chat: do
not send, edit, or create another Slack message, and do not tell the XA that the
Slack message is still unsent. Resolve the real Slack permalink and post the
corresponding OpsHub CONTACT note.

If the XA clarifies “post it on OpsHub,” “post the note,” or similar after a
draft/post-it exchange, treat it as a clarification of the same ticket. Do not
restart the ticket, ask them to repeat the request, or bounce the permalink
back to them before completing the channel lookup and CONTACT-note path.

For the posted-Slack path, use the OpsHub `CreateCustomerNote` mutation
directly through `call_operation` whenever it is available. Pass
`contextType: "CONTACT"`, `contextIdentifier` as the caller's customer UUID
string, the complete note as `body`, and the current operator token from
`whoami` as `createdByToken`. Do not use `create_acq_note`: that writes to the
acquisition flip, not the caller's CONTACT page.
The verified `CreateCustomerNote` contract takes flat variables, never an
`input` wrapper. Use this exact argument shape with the current ticket values:

```json
{
  "operation_name": "CreateCustomerNote",
  "variables": {
    "contextType": "CONTACT",
    "contextIdentifier": "<caller customer UUID>",
    "body": "<complete five-field note with actual newline characters>",
    "createdByToken": "<operator token from whoami>"
  },
  "dry_run": false
}
```

Use the CONTACT page's Add a note control only when the direct CONTACT mutation is genuinely unavailable.
Do not repeatedly ask the XA for a permalink before exhausting the channel
lookup path below. `post it` is an assertion that Slack was already sent; never
reinterpret a missing search result as evidence that the message is still a
draft. Search each explicitly stated or clearly related submitted Slack
artifact once using `slack_search_public_and_private`, with the exact channel
ID in `filters` plus the address, customer name, phone, or distinctive
situation text. Prefer short lexical keywords such as `earnest money` split
into `earnest` and `money`; do not rely on a quoted multi-word phrase alone.
When the permalink or exact message timestamp may be needed, request
`response_format: "detailed"` so the result can carry raw message metadata.
When a draft was created in this chat, reuse its exact channel ID, customer
UUID, property ID, and distinctive situation text. Run the Slack search and
`whoami` in parallel. If the search returns one exact, timestamped match but
omits its permalink, construct the permalink directly from the verified
channel ID and the complete Slack message timestamp using Slack's canonical form:
`https://<workspace>/archives/<channel_id>/p<timestamp_without_decimal>`.
Never derive a permalink from a human-readable display time or a Unix timestamp
rounded to whole seconds. If Slack does not return the exact `message_ts`, stop
the post-it path rather than guessing or posting an unverified link.
If the channel-scoped search returns no result, make one fallback all-channel
search with the same artifact facts and a shorter keyword set, still using
`slack_search_public_and_private`; do not stop after a public-index miss. If
both searches miss but the artifact was drafted in this chat, use one narrow
recent channel-history read with the exact channel ID and draft facts before
reporting a blocker; attached drafts may be visible in channel history even
when they are absent from search indexes. Use a narrow channel read also when
the timestamp is missing, the match is ambiguous, or the constructed link
cannot be validated from the search result. Reuse a
The narrow channel read must request `response_format: "detailed"`; concise
history can omit `Message TS` and is not sufficient to construct a verified
permalink. Reuse a
verified `createdByToken` already obtained in the current chat; call `whoami`
only when it is not available. If the XA supplied a link or the link is
already present in the current note, preserve and use it.
Include links in `Follow Up Link` in this order:
main escalation permalink, related workflow-ticket permalink(s), any supplied
Zendesk URL, then the associated property page link(s), each separated by a
blank line. Never omit a verified related ticket link just because the main
escalation link was found first.

**Notes mutation receipt:** For the MCP post-it path, a successful
`CreateCustomerNote` response with a note ID is sufficient confirmation. Do not
open OpsHub in a browser or use UI automation to verify the note, and do not
add a second read round solely to confirm visibility. If the mutation returns
a definite pre-execution validation error (for example, HTTP 400 with
`BAD_USER_INPUT` and missing required variables), correct the request using
the flat contract above and retry once within the existing `post it`
authorization. Such a rejected request created no note. If that retry fails,
stop and report it. For a timeout, transport failure, unclear execution status,
or a response without a note ID, do not retry automatically because the note
may already exist. Never turn a clear, correctable validation failure into a
request for the XA to repeat `post it`.

**Duplicate-profile gate:** Apply the `xa-admin-account-merge` workflow to
escalations as well as ordinary XA notes. When the caller lookup returns
multiple real customer profiles with distinct email addresses, or a named
profile with the same normalized caller phone and compatible identity / prior
XA same-person confirmation, treat that as the duplicate-profile trigger even
when the second profile has no email or the XA did not mention duplicates.
Missing email alone is not a stub signal. Keep the confirmed primary-email
profile and inspect its Potential Duplicates in Admin. Ask
only for the primary email if that choice is missing. Ask for a customer name
only if existing email/phone/record evidence cannot resolve identity; if both
are needed, ask together in the same message. Otherwise proceed using the
verified context. Reuse the answer without a second merge confirmation. Then complete the merge in **Admin** (`admin.opendoor.com`) and
verify the surviving OpsHub profile has one primary email and one primary phone before creating or
posting the CONTACT note. **Admin is the only merge system of record. Never
merge, consolidate, or repair duplicate profiles in OpsHub.** OpsHub is only
for post-merge verification and the CONTACT note. The merge is a prerequisite
to the note, not cleanup after it. If the primary email is missing, Admin is
unavailable, or the Admin merge cannot be completed, stop before the CONTACT
mutation and ask for the missing input or report the blocker; do not post to
the initially selected profile. Keep the detailed merge steps and completion
wording in `xa-admin-account-merge`.

**One-search rule for an already-posted Slack message:** Use
`slack_search_public_and_private` with the named channel, address, phone, or
another distinctive key. When a draft was created in the same chat, reuse its
exact channel, customer, property, and distinctive situation text to make this
a narrow lookup. If that search returns one usable permalink, use it
immediately; do not also read the full channel. If it returns no usable result,
make one shorter-keyword fallback search without the channel filter. If that
also misses and a draft was created in this chat, read the recent history of
the exact channel once; attached drafts may appear there despite search misses.
If the result has an exact message match and an exact Slack `message_ts` but no
permalink, construct the canonical permalink from the known channel ID and the
complete timestamp. Never derive it from a human-readable time or a timestamp
rounded to whole seconds; if the exact `message_ts` is missing, stop before
posting an unverified link.
Never conclude that the message was not sent merely because search missed it.

1. If tool schemas are not already available, discover the four homes above in
   one block, plus any exposed OpsHub CONTACT/customer-note mutation. Never
   discover one schema, work, then discover another. If the schemas are already
   available, skip discovery. Treat `create_acq_note` as the wrong operation
   for this path even if it is exposed.
2. One parent lookup block: `list_customers` by phone + `resolveAddress`
   (street, city, state, postalCode on the sold-home address only; never a
   single `address` string). If Casa is unavailable, use `global_search` in
   that block instead; if Casa fails, use the property resolution fallback above.
   For a seller-side acquisition with an address,
   also select the matching live flip and fetch its `participants` panel from
   `get_acquisition_transaction`; that participant record is authoritative for
   the assigned HSA / Agent Home Sale Advisor. Validate the XA-stated name
   against that participant before tagging anyone. Do not choose a Slack user
   by name or title when the property participant record is available. If the
   participant and stated name conflict, use the assigned participant and note
   the mismatch under `---`. Skip profile when the named target is a directory
   usergroup. Do not start a caller subagent on this common path. If OpsHub
   returns no unique customer UUID, fall back once to parent
   `search_indextrious`; use a subagent only when that fallback result is
   unusually large. Same-name rows on that phone still get a customer link;
   do not draft the caller unlinked.
   **Mandatory property gate:** When an address is supplied, do not proceed to
   the draft until `resolveAddress` or the verified `global_search` PROPERTY
   match supplies the property ID and canonical property URL. A plain address
   is not a substitute for the link.
   **Mandatory OOO/coverage gate:** Before drafting to any named individual,
   read that person's Slack profile and resolve the named cover or deterministic
   coverage group. This check is mandatory even when the XA says nothing about
   availability, scheduling, or OOO status. Tag the assigned person plus the
   verified cover/group when required. Do not draft to the assigned person
   alone when coverage applies. Preserve any scheduling constraint the XA
   stated in Customer Concerns and reflect the verified cover in Solution
   Offered.
3. Complete the **Existing-issue thread check** before one
   `slack_send_message_draft` call. Use the selected `channel_id` and `message`,
   plus the verified parent `thread_ts` when the check selected Shape B.
4. Then the fenced OpsHub note, then `---` draft confirmation. If `draft_id`
   came back, do not echo `--- SLACK ---`. A failed draft call with no
   `draft_id` leaves draft creation unconfirmed; it does not prove the draft
   is absent. Follow **Draft safety** recovery; a failed draft call never authorizes switching channels.

If the related prior escalation's assigned person is out of office, consider
continuing that escalation in its existing thread and add the deterministic
coverage group when the profile supplies one. A new escalation is also valid
when the new call is materially separate; choose based on the ticket shape and
the user's stated intent. Do not lose the prior escalation's context.

Do not treat `#support-hsa-escalations` (`C025L6TL4CB`) as Slack Connect. Do
not search Slack plugin docs when a draft is enough. Slack Connect / draft-only
is only `#external-listings-mgmt` (`C02CKQDH2QG`).

For `send and post it`, use the Workflow commands above. `draft it/post it`
remains draft-only. When the XA says Slack is already posted, use its verified
permalink and post only the CONTACT note as described above.

## Immediate behavior

### Hot-path shape gate

Classify the ticket before any lookup or draft:

- A correction to an unsent draft (for example, “update the draft, I cleared
  it”) preserves the current Shape A/Shape B and channel unless the XA
  requests a switch or the existing-issue check identifies the active thread.
  Follow the old-draft cleanup rule before replacing a draft.
- **Shape B wins** when the XA says reply, thread, continue, follow up, update,
  or in the thread. Verify the existing thread, then draft a threaded reply.
- **Shape A** is a new escalation: escalated to, escalating to, escalate,
  `@name`, ASAP, or a named team without thread language. Apply the existing-issue
  thread check before deciding to draft a new post.
- If both appear, use Shape B. Never use the Shape A template for Shape B.
- If classification is uncertain, do not draft; ask whether this is a new post
  or an existing-thread reply.

Before drafting, check: `provisional shape → existing-issue thread check →
new/thread → channel → target → customer →
property URL → situation → draft_id`. Report a draft only when `draft_id` is
returned; use **Draft safety** for missing-confirmation recovery.

### Mandatory target-classification gate

Before any Slack draft, classify the destination:

- **Named target:** an explicitly named individual, such as `Sarah Dumke`, `@Sarah`, or a directory usergroup.
- **Unnamed target:** a role, team, function, or channel description, such as `sales support specialist`, `home sale advisor`, `pricing team`, or `sales support`.

An unnamed role or team must never use the named-target shortcut. Use the
no-named-target path. For phone-only tickets, use the direct parent path:
compact Indextrious CUSTOMER lookup, then `get_acquisition_transaction`
participants, then draft. Tag the assigned person plus the deterministic role
coverage group. Do not call `list_customers` or `slack_read_user_profile`.
Do not draft until the caller, property URL, and assigned person are resolved.
There is no missing-property-link exception for a supplied address.

- Warm-up only (`ready`, or attaching this skill without call shorthand):
  `Ready when you are.`
- Every shorthand paste is a new ticket unless explicitly a correction, edit,
  continuation, or thread update.
- On a real ticket, the first assistant turn is tool calls with no text, or
  the finished note fence. Never “I’ll follow / I’ll look up / Lookups are
  running.”
- Paste-only: first visible character is the finished note fence. Never narrate
  skill loading or tool use. Never emit a stub or unlabeled draft of the note.
- Draft / lookup path: stay silent until lookups finish, then one finished
  five-field note. A placeholder fence with wrong labels or empty fields is not
  a copy box.
- Never post progress, lookup status, or skill-loading narration. For Shape B,
  verify the thread internally; report thread details only below the finished
  output.
- Token-smart shifts: reuse one chat for routine and paste-only tickets. Count
  completed tool-heavy **user tickets** in this chat (explicit draft, Shape B
  search, unnamed lookup). The counter starts at zero in every new chat; tool
  calls, tool rounds, and tickets from other chats do not count. After the 3rd,
  or immediately after a messy Slack dump, schema retry, or GraphQL/browser
  fallback, add this exact line under `---`:
  `Memo: start a new chat for the next ticket and @ xa-quick-slack once.`
  Do not send that memo on paste-only tickets or above the note. Send it once
  until the XA actually starts a new chat.
- Scope is escalated calls. Redirect non-escalated notes to `xa-post-call-notes`.
- Paste-only is the default. `draft it` creates an unsent Slack draft.
  `send and post it` sends Slack and posts the CONTACT note in the same turn.
  `post it` alone posts the CONTACT note with the already-sent Slack permalink.

## OpsHub note

Always use exactly:

```
Property Address: 123 Example St, City, ST 00000

Reason for Call: Short sentence.

Customer Concerns: Short sentence.

Solution Offered: Escalated to Name.

Follow Up Link:
```

Rules:
- Put each value on the same line as its label. Keep one blank line
  between fields. Follow Up Link is blank except a found Shape B thread
  permalink, an XA-supplied Zendesk ticket URL, or on `post it` the Slack
  message permalink and property URL. On a successful post, put the Slack
  permalink first, then the Zendesk URL if supplied, then the property page
  URL, each on its own line with a blank line between them. A single space
  gets eaten when OpsHub auto-links. Never put a customer URL there. Never
  invent a Zendesk ticket. For the post-it path, upload the exact note to the
  caller's CONTACT page with `CreateCustomerNote`; if unavailable, use the
  CONTACT page's `Add a note` control and verify the saved note.
- Fill the property only when supplied. Two addresses: Property Address, Casa
  resolve, and the Slack property link are the home being sold. A ship-to,
  mailing, or lockbox delivery address stays in Customer Concerns and the Slack
  situation line only. Do not resolve or link the ship-to as the property.
- Caller type is the XA's first word: seller, agent, buyer, buyer's agent,
  appraiser, inspector, photographer, neighbor, vendor, locksmith, HOA, title
  company. Otherwise use Caller; never default to Seller or Agent.
- Name every stated destination in Solution Offered and drop role fluff:
  `Escalated to Dean Thompson.` If they were out and a coverage group or cover
  was also tagged, name both: `Escalated to Jonathan Pryde and @agent-acq-eps.`
  Stated channel plus stated tags: name both, e.g.
  `Escalated to external listings management and ELA coordinators.`
  Shape B continued thread is `Continued the related Slack thread.` One
  thread stays singular. Two or more verified threads: `Continued the related
  Slack threads.` Never the tagged person. Never write “escalated” unless the XA said they escalated or
  the Slack path resolved the assigned participant. Advised is not escalated.
  Never infer a step or action.
- Spell out acronyms: Final Offer, home sale advisor, close of escrow, digital
  checkout, in-home walkthrough, diligence visit, Cash Now More Later.
- Use plain, short prose. No robotic hyphens. Write “sell direct,” not “seller
  direct.”
- **Keep the XA’s point.** Copy what they said happened. Do not add template
  extras they did not type. Customer Concerns is the caller’s need in note
  language, never an instruction to the tagged person (not “Confirm the
  amendment was sent”). Shape B only: when actually continuing a related
  Slack thread, keep that current-call point and add a short recap of what
  the thread is already about. Not the full reply history. Never fold thread
  facts into a Shape A or paste-only note.
- Preserve concise, customer-relevant explanations when the XA supplied them.
  Do not reduce the note to only the escalation topic when the XA also
  explained how something works, clarified which information is accurate, or
  described what the caller saw. Summarize the caller’s concern in Customer
  Concerns and the explanation or action in Solution Offered; omit play-by-play
  and unrelated detail.

## Note patterns and routing

- Final Offer discussion: `Caller called to discuss their Final Offer.` Add
  `and asked to speak with their home sale advisor` only when the XA said that
  (asked for advisor / HSA / wants to speak to them). Concern: discuss the
  Final Offer. Route pre-release to HSA; named target wins after the mandatory
  OOO/coverage gate. If coverage applies, tag the assigned person and verified
  cover/group, preserve any stated scheduling constraint in the note, and name
  both in Solution Offered.
- Delayed Final Offer: caller has not received it in the expected timeframe.
  Route to pricing team / `#pricing-on-call`, not HSA.
- Offer type switch: request a different offer structure. Route to HSA.
- Inspection/final numbers: review inspection results and effect on proceeds.
  HSA pre-release; acquisition sales support after contingencies release.
  Engagement type decides the side first: `RESALE_BUYER_OFFER` remains listing
  partner even when its state is `CONTINGENCIES_RELEASED`.
- Close date, late checkout, digital checkout, checkout photos, settlement
  statement, closing documents, or missing/incorrect contract documents:
  acquisition sales support in `#support-hsa-escalations`, not HSA or title,
  unless the verified named target is a Listing Partner / resale agent or
  resale transaction coordinator. Participant role is authoritative: when the
  named target resolves to `RESALE_AGENT`, `RESALE_TC`, or Listing Partner,
  never use HSA; the verified target wins and the draft belongs in
  `#support-listing-partner-escalations` (`C026P10RHLY`).
- Seller cancellation: HSA save attempt, signed or unsigned.
- Buyer or buyer's agent listing/property/offer/contract question: use the
  Resale Agent in `#support-listing-partner-escalations` only when the verified
  owner is a Resale Agent / Listing Partner / resale transaction coordinator.
  A verified Home Sale Advisor or Agent Home Sale Advisor remains in
  `#support-hsa-escalations` even for these topics. Agent getting info to place
  an offer: Reason for Call and Slack always open with
  `Agent is calling to get more info on the property to place an offer.`
  External listing / ELA coordinator / showing or appraisal gate access that
  the XA routes to ELA: `#external-listings-mgmt`, tag `@ela-coordinators`.
  Named target wins. That is not the HOA workflow.
- Buyer offer eligibility (reaffirmed October 23, 2026): the complete state list
  is pending Sam's confirmation. Use `opendoor.com/buy` where direct buyer
  submission is available; preserve known location and listing exceptions.
  Do not infer statewide eligibility from an individual call.
- Buyer offer submission (updated October 30, 2026): where direct submission
  is available, find the home at `opendoor.com/buy` or `opendoor.com/homes` and
  follow the listing's offer instructions. In special instances, a traditional
  listing there instructs buyers to submit through `homes@opendoor.com` or
  contact a licensed agent to place an offer; follow that listing's instructions.
  Preserve separately saved location eligibility guidance, including Georgia;
  do not infer that all other states permit direct submission. This changes
  offer guidance only, not touring/access rules.
- Agents normally use `opendoor.com/makeoffer`: enter the property address and
  follow the prompts to submit. When the home has an active offer, instruct the
  agent to email `homes@opendoor.com`; this is not a blanket email alternative.
  Notes record only advice actually given; do not add completed actions to an
  escalation-only call.
- Wire/disbursement: first tell XA to check Admin → Closing → Wire Transfers.
  (`admin.opendoor.com`). If unresolved after Opendoor wired, route to title.
  Note only actions stated: reviewed status, or reviewed and escalated. Never
  invent wire status.
- Cash Now More Later closed-home questions and second payment: advise
  `cashnowmorelater@opendoor.com`; no Slack channel and never closed homes.
  Only genuinely urgent cases may be drafted to Katie Wright
  `U8AU13UQ5` for the XA to place; this skill has no verified channel.
  Former ownership does not authorize private current-resale details or its
  scheduled closing date. The CNML inbox replaces Executive Experience for
  closed-home and second-payment questions; no payment or response-time promise.
  Source: Diego Mendieta, October 30, 2026,
  https://opendoor.enterprise.slack.com/archives/C02K6JVSNUF/p1793377165539289.
- Previous owner wants into a closed CNML home: treat as a buyer, no lockbox
  code, not closed homes, not the CNML inbox unless they also asked about the second
  half. Access-only belongs in xa-notes.
- Rental scam: put 1-888-352-7075 in the note; no Slack block.
- Post-close vendor/property condition or post-close property-information request:
  closed homes team / `#closed-homes-customer`. This includes a prior seller or
  buyer who already purchased the home asking about equipment identifiers,
  manuals, filters, or other home-system information. Not for a previous owner
  asking to enter. CNML closed-home questions use the CNML inbox above, not this
  generic closed-homes route. A Cash Now More Later second-payment question remains a
  post-call note workflow, not closed homes.
- Home damage/issue: `Filed a home issue report.` Emergency message prefix is
  `UXA - `.
- Code works but key fails: incident report for lockbox issue.
- Completed assessment showing not started: `#keyapp-escalations`.
- Property line/boundary concern: corresponding team member.
- Seller's disclosure: request with disclosure team; only Slack if contract
  pending and avoid duplicate OpsHub tasks. Named listing partner plus
  “place an offer” stays listing partner; disclosure is the concern, not the
  destination.
- OpsHub/tool failure: tech support / `#tech-support`.
- Square footage, bedroom, bathroom, or basement changes: `#pricing-on-call`;
  never use Wally.
- Identity verification never escalates. The XA verifies or denies
  scheduling/access when verification cannot be completed.
- Unknown escalated concern: describe the actual situation and route using the
  closest rule; never leave Customer Concerns blank.

Final Offer timing only when relevant: up to 5 business days; internally 3–4
calendar days; MSRE about 3 days; Lennar 48 hours.

## Slack workflow-ticket channels

Some Slack channels take workflow forms, not regular compose-box messages.
Interpret `draft it` according to the destination: prepare ticket fields for
a workflow channel and an unsent Slack draft for a regular channel. Recognize
workflow channels from these saved mappings or verified workflow evidence
already available in the chat, including a screenshot of the channel's form.
Workflow evidence overrides the generic draft sequence; do not require the XA
to explicitly say `ticket`. A successful regular draft response does not prove
that the channel uses regular messages for escalations.
For these, never call `slack_send_message_draft` or `slack_send_message`.
Never search Slack, Glean, or project files for how to file the ticket.
When the XA says the workflow ticket was already filed or says `post it`, do
search for that submitted ticket as a related Slack artifact and include its
verified permalink in the OpsHub note alongside the main escalation link.
After the OpsHub note, provide a clearly labeled, paste-ready field pack and
name the workflow the XA must open. Fill only facts and identifiers actually
supplied or resolved; never invent a flip token, URL, category, or assignee.
Label this section `--- WORKFLOW TICKET ---`, not `--- SLACK ---`.

- `#keyapp-escalations` (`C09B9U17KR9`) — **Key App Escalation** ticket:
  `Agent Email` (optional), `Full Address` (optional), `OpsHub Link` (optional),
  and `Escalation/Feedback/Question`. Provide each field in its own copy box.
  Leave Agent Email blank when it is unavailable; use the verified property
  URL for OpsHub Link. This workflow overrides Shape A compose-box drafting,
  including when the XA says `draft it`. Do not create a regular Slack draft.
- `#ext-showami-opendoor-support` — **Opendoor to Showami**:
  `Property Address`, `Request Details`. Keep customer detail minimal because
  the channel is externally shared.
- `#pricing-on-call` — **Pricing Team Questions**:
  `Flip Token`, `Full Address`, `Admin Link`, and `Question`.
  Omit `Question Type` from the paste-ready output because it is a dropdown in
  the workflow ticket. Present each field in its own copy box. `Admin Link`
  means the OpsHub Admin helpers page, not the OpsHub property page, Admin
  closing page, or customer link. Resolve it through OpsHub MCP by selecting
  the matching live acquisition flip, reading its `latestOffer.id`, and using
  `https://admin.opendoor.com/admin/experience_partner_offers_leftovers/{latestOffer.id}`.
  Never guess the offer ID or substitute a different Admin URL.
  Question Type is one of `Additional Info for Review`, `Final Offer Status`,
  `Offer Denial`, `Unexpire Request`, `Refresh Offer Help`, or `Other`.
  Include the live flip token and admin link when already supplied or returned
  by the pricing/property lookup. A Casa ID is not a flip token. If the token is
  unavailable, leave that field blank and say it must be copied from OpsHub;
  never guess it. Pricing tickets may perform the extra live-flip lookup needed
  for this form.

Whenever any workflow ticket requests an Admin helpers link, resolve it from
the supplied property address through OpsHub MCP: find the matching property,
select the relevant live acquisition flip, read its `latestOffer.id`, and use
`https://admin.opendoor.com/admin/experience_partner_offers_leftovers/{latestOffer.id}`.
Do not ask the XA to provide the link when the address is sufficient, and never
substitute the OpsHub property page, Admin closing page, or customer link.
- `#sign-install-triage` — signage workflow: include the matching category
  (`Signage never installed`, `Signage not removed on time`,
  `Missing-damaged signage`, or `Other`), property address, and request details.
- `#hoa-communications` — HOA workflow: include the known requester, HPM/person
  to action, request details, property address, and optional links. Leave any
  unresolved required selector for the XA; do not guess.
- `#xa-spanish-team` — **Spanish Request**: customer link first, property link
  second, as bare URLs; use `N/A` when the form allows it and no property exists.
- `#acq-cx-homes-escalation` — choose **CS to Homes** for Visits or **CS to VA
  Team** for Refresh Offer / Repair Adjustment; provide `Property Address`,
  `Request Type`, and `Context`.

  **Routing clarification:** The CS to Homes workflow currently supports only
  `Visits`. Do not use it for DCO/debris-removal updates when no visit is being
  requested. Route those issues to Sales Support in
  `#support-hsa-escalations`, tagging the assigned Sales Support specialist
  when known (for example, Sarah Dumke).

If another channel is known to use a workflow but its exact fields are not in
context, do not draft into the compose box. Give the known facts as a paste pack
and state that the remaining form fields must be selected in Slack.

## Slack trigger

Use XA input to detect whether Slack is requested; then use the existing-issue
thread check to choose a new post or reply:
- Shape B first: continue/update/reply/thread/in-the-thread language.
- Provisional Shape A: escalated to, escalating to, escalate, @name, ASAP, or
  named team. Run the existing-issue thread check before a new post.
- Bare names and “let them know” alone do not trigger Slack.
- Both shapes means Shape B.

Stated channel and stated tags are independent and both win. The XA often
names a channel and separately who to tag. Draft/post into the channel they
named (resolve from Channel IDs; search channels once if uncovered). Tag the
people or groups they named. Routing fills only what they left unsaid. Do not
move the post to listing partner, HSA, HOA workflow, or another default
because the caller type usually goes there. Paste-only still labels Channel
as a suggestion. Draft/post uses the stated channel as `channel_id`.
- When the XA does not provide a target name, read the destination channel's
  description before drafting and use the applicable team tag listed there.
  The channel description is the source of truth for unnamed-target tags. If
  the XA provides a target name, use that named target and do not replace it
  with a channel-description tag unless the XA explicitly asks for both.
- Known channel-description routing: `#utilities-support` (`C13LF642W`) uses
  `@utilities-team` for stuck utility issues. Its other listed tags are
  `@HPM Ops Bot` for lookup/status, `@Phone Bot` for provider calls,
  `@emergency-alert` for alerts, and `@feedback` for agent ideas; choose only
  the tag matching the request.
- When the routing rule supplies a canonical channel, resolve that exact
  channel—including private channels—from the user's accessible channel list
  before considering any fallback. A broad search result for a similarly named
  channel is never permission to substitute it.

Output order:
1. Fenced OpsHub note.
2. `--- SLACK ---` and plain Slack block when triggered, unless a requested
   draft returns `draft_id`.
3. `---` and only necessary commentary: email, missing field, thread found,
   wire reminder, draft status, or the new-chat memo.

Shape A:

```
<@USERID|Name> [Full address](property-url)
Role <customer-url|Customer Name> situation in one line.
```

- Treat the channel as draft metadata, not message content. Do not include a
  `Channel: ... (suggestion — override freely)` line in the Slack message.
- Keep the full Shape A message compact after the channel mention. Use exactly
  one line break after the property link/address: the property link/address is
  on the first line, and the caller's situation starts on the next line. Do
  not add a blank line or split the situation into multiple paragraphs. Slack
  may wrap either line visually; that is normal.
- For an agent caller, use exactly `Agent <customer-url|Agent Name> called to
  report ...`; the customer link follows the word `Agent`, and the linked name
  is not repeated in plain text.
- Slack prose never repeats the tagged target, phone, or email.
- Preserve supplied email links and their `mailto:` prefix in Slack drafts.
  The XA confirmed that these links open useful contact options; do not strip
  the prefix or remove an operational email link such as utilities contact
  information. This exception overrides the general omission of email from
  Slack prose. Do not add redundant caller contact details.
  A returned `draft_id` confirms creation only, not correct rendering.
- Drop “asked to speak with their advisor” from Slack; the mention conveys it.
- XA-supplied Zendesk ticket: Slack as
  `<https://opendoor.zendesk.com/agent/tickets/NNNNNNN|Zendesk ticket NNNNNNN>`
  and the same URL in Follow Up Link. Never invent a ticket.
- Listing partner, agent getting info for an offer: open Slack with
  `Agent <customer-url|Name> is calling to get more info on the property to place an offer.`
  then the specific ask.
- Seller asked us to contact their agent: include
  `agent <customers-url|Agent Name>` from the listing-agent CUSTOMER record
  (`is_agent` on the same Casa ID). The name is the link label. Do not link
  the word “agent” alone. Missing agent link does not block the draft.
- Do not write covering/OOO/until-date in Slack. Keep the situation line as the
  call. Usergroups are additive: tag the stated person and the cover or
  coverage group (`<@U01HXU1T6PM|Jonathan Pryde>` plus
  `<!subteam^STQT96KV4|@agent-acq-eps>`). Do not drop the named person. If the
  group was added because they are out, say that only under `---`.
- Property URL: `https://opshub.apps.opendoor.com/property/{casa_id}`.
- Property addresses are hyperlinks, never @ mentions. For the draft tool use
  `[Full address](verified-property-url)`; do not use `<url|address>` for the
  property, which produced a stray visible @ in the 2026-10-20 draft. Reserve
  mention syntax for verified people and groups. Before drafting, check that
  neither the property label nor its prefix contains @. This changes only link
  serialization; keep the required two-line message layout. Do not claim the
  rendered result is verified without a supported read of the created draft.
- Customer URL: `https://opshub.apps.opendoor.com/customers/{customer_uuid}`.
- Before drafting, run a final link check: both URLs must use `https://`, the
  exact canonical paths above, and IDs returned by the corresponding lookup.
  Never use the singular `/customer/` path; if either link fails this check,
  stop before creating the Slack draft.
- Missing customer link never blocks a paste-only response, but it blocks a
  named-target draft when the customer lookup was requested. Never invent IDs.

Shape B:
- Apply the existing-issue check and read the selected thread before composing.
  Search `slack_search_public_and_private`: quoted address, property UUID,
  customer name, then ticket/flip reference; add channel when given.
- Verify channel, parent author/opening, timestamp, reply count, and permalink
  before drafting; report them below the finished output. If tied, ask. If none,
  show closest candidates and ask
  whether to create a new post; never silently switch to Shape A.
- Search contract: put the quoted key in `keywords`, set
  `content_types: "messages"`, `response_format: "concise"`,
  `include_context: false`, `limit: 10`, and `sort: "timestamp"`. Add a short
  `natural_language_query` describing the property/thread. Put a known channel
  in `filters` as `in:<#CHANNEL_ID>`.
- Found thread: Follow Up Link gets the permalink (each URL on its own line
  with a blank line between them if more than one). Slack block (when shown) starts with `Replying in thread:
  <permalink>` for one thread, or `Replying in threads:` plus each permalink
  for more than one. Solution Offered is `Continued the related Slack thread.`
  or `Continued the related Slack threads.` when continuing more than one.
  Thread-only: Customer Concerns keeps
  the XA’s current-call point and adds a short recap of that thread, for
  example: `Follow-up on the Final Offer, listing agreement, and referral.
  The agent is calling again.` Do not add a recap unless this ticket is
  continuing a verified thread.
- Reply states the new issue, what was done, and what the customer was told or
  now expects, using only verified facts. Match the selected thread's order,
  tone, and level of detail, usually in 1–3 lines. A brief issue log can use
  `[Full address](verified-property-url) — incorrect code; remotely unlocked.`
  Do not add “adding this example to the ongoing issue” when the thread already
  supplies that context. Do not infer a double lock or other symptom from peers.
- Include the address/property link, caller/customer link, and verified mentions
  when needed to identify this case or reach the person handling the next step.
  Omit information already clear in the thread. A shared issue thread with many
  properties still needs this case's property identifier. Do not force a caller
  introduction, repeat an existing case's links, or tag every participant merely
  because they replied. Keep the exact Shape A layout for new listing-partner
  and HSA posts and the five-field OpsHub note format unchanged.

## Channel IDs

- HSA and acquisition sales support:
  `#support-hsa-escalations` `C025L6TL4CB`
- Listing partner: `#support-listing-partner-escalations` `C026P10RHLY`
- Closed homes: `#closed-homes-customer` `C3WHL29FC`
- Tech support: `#tech-support` `C0A9LM99EBZ`
- Key app: `#keyapp-escalations` `C09B9U17KR9`
- Seller disclosure: `#od-seller_disclosure-team` `C0B9C9DAPDY`,
  tag `<@SAFRUQQT1>`
- Pricing: `#pricing-on-call` `C0A14ENTB8A`
- Title fallback: `#title-escalations` `C01K3C66LMN`; do not draft when market
  channel is uncertain.
- Title state channels: AZ `C1T8FBZ0W`, TX `C378DSH1C`, CO `CHMGPP9RN`, FL
  `CJ7PKPJ78`, NV `C7RMDBL7Q`, TN `CAM1DBL6N`, IN `C02685ZCS6S`, VA
  `C02D0J0R2Q4`, IL `C09MQ74MURY`, CA `C03AQFG65FW`.
- External listings (Slack Connect — draft only): `#external-listings-mgmt`
  `C02CKQDH2QG`, tag `<!subteam^S02KNHE3U6B|@ela-coordinators>`. `@ela-aeps`
  is retired. If XA escalated to the channel and tagged the group, Solution
  Offered names both: `Escalated to external listings management and ELA coordinators.`

## Directory

Home Sale Advisor:
- Alberto Flores `U0AGFGH4WRL`; Alex Haas `URURENZPU`; Allison Mercer
  `U03D464NBL1`; Andrea Bilducea `U0ALR5F0QHZ`; Bill Kellogg `U0AKFEFDL8L`;
  Candy Kissner `U0AKFEQ31S8`; Chandi Young `U08B11WHQS3`; Daniel Castro
  `U0ALQURK52A`; Dean Thompson `U0AAV97D09L`; Eric Mangin `U0B1YSF3M6Z`;
  Gabby Perez `U029VK8TUQ3`; Gal Avraham `U0AJWCZF9M5`; Joel Smith
  `U0AB0U09KRA`; Jude Koury `U0AAV9BHZRU`; Kendra Gallagher `U02LK7LHP44`;
  Landon Young `UDKMKU136`; Mackenzie Jones `U08BFEWDT7V`; Matt D'Angelo
  `U0AKQPNPYF3`; Matt Miller `U4CCTGRBQ`; Mo Hejazi `U0AKBSL40DQ`; Thomas
North `U0ACG9EPSKE`.

Directory spelling: Chandi Young (`U08B11WHQS3`). Do not rewrite this name as
“Shandy Young” in Slack tags or OpsHub notes.

Jude Koury is an HSA, not sales support.

Market fallback:
- Phoenix: Alex Haas, Allison Mercer, Andrea Bilducea, Bill Kellogg, Candy
  Kissner, Chandi Young, Eric Mangin, Gabby Perez, Jude Koury, Kendra Gallagher,
  Landon Young, Mackenzie Jones, Matt Miller.
- Miami: Alberto Flores, Daniel Castro, Dean Thompson, Gal Avraham, Joel Smith,
  Matt D'Angelo, Mo Hejazi, Thomas North.

Agent HSA:
- Giles Smith `U0AMYQ6CGRE`; Jonathan Pryde `U01HXU1T6PM`; Kim Schloz
  `U02DF54TELQ`; Klayton Kristick `U0280QTHGK1`; Luke Bunjovac
  `U02E6L7Q64S`; Stefan Stobbs `U01N48TTF6H`; Terrance Wright `U01RXHH01RN`.

Listing Partner:
- Alec Harris `U0AQGQ7GVMF`; Anton Watt `U0APXFW26TV`; Cary Sheih
  `U02PLSLQDSP`; Cory Schwalbe `U03CRH0HWBC`; Darius Toney `UFY1E1DQV`; Eric
  Tamayo `U9BGJRFAM`; Jason Whitmore `U02DRUHP3JT`; Jeana Reyes `UBWKF9AAK`;
  Kaysha Rice `U9T867VNW`; Kesha Heggar `U030SUD1BL5`; Krysten Giordano
  `U0AR54H0NLC`; Lance Stadler `U02PP45C88L`; Leori Bolivar `U02SZ7TKL9F`;
  Lisa McGill `UD00Y3DS7`; Lynnette Easterling `UH3PCC0CX`; Michelle Huemmer
  `U02KL2580HW`; Nakia Walker `UGNKNUVK6`; Naseem Mirza `U025N26KN1Z`;
  Rachel Griego `U030R1VD11C`; Sharon Parmenter `U03AV3SSKKP`; Shelby Farrar
  `U032XFR0HQA`; Shelby Hernandez `U028MNNKTM2`; Steven Gomez `U0AQW5VH1H6`;
  Tanya Pickens `UEQ5VF6BE`; Verria Hairston `UF8LUD5CM`; Whitney
  Hunt-Sailors `U030P68HPLN`.

Sales Support:
- Britt Kato `U01TVV7G38V`; Claire Buser `U02KL21ES80`; Katie Villasenor
  `U48CQ7FEE`; Sarah Dumke `U0B8VGYV4RL`; manager Eric Wyrowski `UGCK82AMC`.

Executive Experience: Katie Wright `U8AU13UQ5`.

OOO groups:
- Phoenix HSA `<!subteam^S0BL1DC2XBP|@phx-asap>`
- Miami HSA `<!subteam^S0BL6JZH1S5|@mia-asap>`
- Agent HSA `<!subteam^STQT96KV4|@agent-acq-eps>`
- Sales support `<!subteam^S0AU9AN2HTN|@sales-support>`
- HSA managers `<!subteam^S0912QTHAQJ|@acq-hsa-managers>`
- Darius coverage `<!subteam^S03EEQ55SUT|@dariustoneyscoverage>`

Known cover chains: Bill Kellogg → Candy Kissner; Michelle Huemmer → Steven
Gomez; Lisa McGill → Whitney Hunt-Sailors; Kendra Gallagher → phx-asap.
Display-name hours are not OOO coverage. A profile's named cover or personal
coverage group beats a market group. Tag a fallback group only when the person
is actually out and no named cover is available. Tag the named person too.

## Fast tool paths

### Known named target, paste

For a seller-side acquisition with an address, verify the named target against
the matching flip's participants panel before using the directory mention. For
other known named targets, use the directory mention and channel above. Do not
use browser, file, or schema lookup. Missing customer URL is acceptable.

**First name only, or a first-name pair, on a seller-side acquisition file
(corrected 2026-09-18):** this is not a person-specific mapping. Those files
list an assigned home sale advisor (`acq_ae` / `acq_cx`) and often an assigned
sales support specialist (`acq_sales_support`). If the XA’s names are not a
unique directory last-name match, do not `slack_search_users` and pick by job
title. Use the participants path on the ranked flip that matches the caller’s
seller engagement — not `isHighestRanked` when that flip is a different seller
or a dead file. Bind the XA’s names to those assigned roles. Keep the stated
names in the note; Slack tags the assigned people.

### Known named target, explicit Shape A draft or `draft it/post it`

Use **Silent draft sequence** above. Do not restate the four tool homes here.
For a seller-side acquisition with an address, use the matching flip's
participants panel to resolve and validate the assigned target; do not use
`slack_search_users` to guess by name or title. Use the runtime directory only
  to map the verified participant to a Slack mention. Call
  `slack_read_user_profile` for every named individual before drafting, even
  when the participant is already verified and the XA says nothing about
  appointment availability or OOO status. Use the profile's OOO/cover status
  to add the required cover or coverage group. No browser or progress
  narration. Do not serialize OOO in Slack; report the coverage decision only
  below the finished output when needed.
For explicit `send and post it`, use the Workflow commands above after
completing the same named-target gates.

Caller lookup contract:
- Call `list_customers` in `user-opshub` in the parent block with `phone` and
  `limit: 5`. Match the XA-typed name to a customer UUID; it also returns
  email, but not engagements or `is_agent`. Same-name rows on that phone are
  still linkable.
- If OpsHub is unavailable, not unique, or engagement type/state is required
  to route correctly, fall back once in the parent to `search_indextrious` on
  index `CUSTOMER`, query `customer`, filtered by
  `primary_phone_number equals +1XXXXXXXXXX`.
- From the fallback keep only caller name, `is_agent`, email, customer UUID,
  matching active engagement address/Casa ID, engagement type/state, and
  ambiguity. If its payload is unusually large, move that fallback to one
  silent subagent rather than loading it into the parent context.
- Prefer full over stub, matching property, then ACTIVE. The XA’s typed
  caller or agent name plus that phone is enough for the `/customers/`
  link. Same-name duplicate rows on that number still get a UUID; list
  unused same-name URLs under `---`. Different people on the same number
  is the only remaining ambiguity: list up to three and do not guess.
- If the XA asked to contact/reach the seller’s agent and OpsHub did not return
  that relationship, use the existing CUSTOMER-by-Casa-ID fallback. Still no
  GraphQL, browser, or extra indexes.

### Shape B, explicit draft

After this skill and required tool schemas are loaded, the unique-thread happy
path includes these work rounds (thread reads are required before drafting):

1. Search the thread. In that same parallel block, add only enrichment the reply
   actually needs:
   - named-recipient profile when coverage may change the tags;
   - parent OpsHub customer lookup when customer identity/link is required;
     use a subagent only for an unusually large Indextrious fallback.
2. Read the selected parent and replies to verify the same issue and current
   status. Follow a linked active discussion within the existing-issue budget.
3. For one clear thread, call `slack_send_message_draft` with `channel_id`,
   `message`, and the parent `thread_ts`.

Do not call `resolveAddress`, fetch participants, or look up the caller merely
because the XA supplied an address. The typed address is the first search key.
If an explicit thread request is tied or empty, do not draft; show candidates
below the note and ask. An automatic existing-issue check with no match
returns to Shape A under that gate. If Codex requires schema discovery, batch every needed schema in one
cold-start block before these work rounds.

### No named target with an address

Run the compact caller lookup and participants subagent in parallel. The
participants subagent receives the plain address, resolves Casa ID, fetches
ranked flip then participants, and returns only property URL/state, participant
names/roles, needed Slack identity, profile OOO status, and coverage. Do not
render the full OpsHub property page. The detailed GraphQL/browser fallback
recipe remains in the canonical source and maintainer appendix; read it only on
this uncommon address-supplied path. Do not claim `get_property` replaces
participant lookup until a live result proves it returns assigned roles. Do not
add `get_property`, Slack plugin-doc search, or WebSearch.
`#support-hsa-escalations` is not Slack Connect. Explicit `send and post it`
uses the send-and-post flow above.

### Phone only, no address — direct parent path

No nested agent. Keep all work in the current chat:

1. Call `plugin-opendoor-search-opendoor-search.search_indextrious` on index
   `CUSTOMER`, query `customer`, filtered by `primary_phone_number equals
   +1XXXXXXXXXX`. Use that result as the single source for caller name and UUID,
   engagement, property address/Casa ID, and flip token. Do not also call
   `list_customers`.
2. Select the matching live seller-side acquisition engagement. Take its
   address/Casa ID, full address, and flip token. If multiple live properties
   remain tied, ask for the address. Do not guess.
3. Call `user-opshub.get_acquisition_transaction` with that flip token and
   property ID, `panels: ["participants"]`, `full: false`. Read the assigned
   role needed by the ticket (`acq_sales_support`, `acq_ae`, or `acq_cx`).
4. Map that participant to the runtime directory and draft immediately. Do not
   call `slack_read_user_profile`. Tag the assigned person plus the
   deterministic role coverage group when one is defined: `@sales-support` for
   `acq_sales_support`, and the engagement market's HSA group for `acq_ae` /
   `acq_cx`. A named person remains tagged; the group is additive.

When cold, discover exactly `search_indextrious`,
`get_acquisition_transaction`, and `slack_send_message_draft` together in one
block. Do not discover or call `list_customers`, `slack_read_user_profile`,
`resolveAddress`, `get_property`, browser, GraphQL, or a participant subagent
on this path. Use one silent subagent only if the Indextrious result is
unusually large. Never narrate these steps.

Seller and seller-agent engagements normally identify the property.
A buyer or buyer's agent can also identify it by phone when the CUSTOMER record
has an active, in-contract `RESALE_BUYER_OFFER` engagement on the listed home;
route that side to the Resale Agent/listing partner. If no qualifying engagement
exists, or multiple live properties remain tied, ask for the address instead of
guessing.

## Draft safety

- Draft only for “draft it,” “put it in Slack,” `draft it/post it`, or
  equivalent in this turn.
- If the XA corrects facts, update the note and rewrite the full current-shape
  Slack message. Reuse verified caller, property, target, coverage, and channel
  from this ticket. When the XA says they cleared the previous draft, create
  the replacement once. A factual correction alone does not change destinations;
  an explicit switch request or verified existing-issue match uses the
  existing-issue gate and its old-draft cleanup rule.
  If a confirmed draft still exists, use a supported draft-edit tool if one is
  available; otherwise give the replacement text for manual editing or wait
  for the XA to clear it. Never repair drafts through browser/native UI.
- If the XA reports that the unconfirmed draft is absent, or explicitly asks
  to draft again after a missing-ID response, that authorizes one new attempt
  in the same channel with the same latest message. Act on that request;
  do not keep telling them to check. An `attached_draft_exists` response means
  stop and direct them to edit or clear that existing draft. If the recovery
  attempt also returns no ID, stop with unconfirmed status and the paste-ready
  text; do not loop.
- `draft it` uses `slack_send_message_draft`. `send and post it` uses one
  `slack_send_message` followed by the CONTACT mutation. `post it` alone uses
  the already-sent Slack permalink and posts only the CONTACT note; never
  create or send another message for that path. Slack Connect stays draft-only.
- Do not include the `Channel:` instruction in the drafted body.
- `draft_id` present (draft-only): omit the Slack block and report:
  `Draft in #channel — in the message box there, not sent.`
- If the XA says Slack is already posted and asks to `post it`: search the
  named escalation channel and any explicitly stated related workflow channel
  for the matching submitted artifacts, using
  `slack_search_public_and_private`; use their real permalinks, omit the Slack
  block, and upload the exact displayed note to the caller's CONTACT page. Put
  the main escalation permalink first, then related workflow-ticket
  permalink(s), then any XA-supplied Zendesk URL, then the property URL(s),
  each separated by a blank line, in Follow Up Link. If a search result has the
  matching message but omits its permalink, use the result timestamp and known
  channel ID to construct the standard permalink. If the channel-scoped search
  misses, make one shorter-keyword all-channel fallback before asking the XA
  for a link; never report that the draft is unsent just because search missed
  it. If no CONTACT/customer-note mutation is exposed, use the CONTACT page's
  Add a note control and verify the saved note. For the MCP path, the
  returned note ID confirms completion; only the UI fallback needs visible
  verification.
- `draft_id` absent: creation is unconfirmed even if the response says
  “Draft created.” Do not claim success or absence and do not retry in the
  same turn automatically. Show the Slack block and tell the XA to check the
  channel or Drafts & Sent. Apply the bounded recovery rule above when the XA
  reports it missing or asks to draft again. One attached draft per channel
  means an earlier draft may block confirmation.
- Never draft or send with unresolved recipient/situation/property, an
  ambiguous Shape B thread, uncertain title channel, or a test with no safe
  target.
- A test draft with no named target goes only to the XA's own DM after resolving
  their user ID, never to a team channel or someone else's DM.

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
