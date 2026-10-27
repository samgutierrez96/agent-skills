# Shared routing reference

Preserved from the former Fast Index. Load only the section needed for an unresolved rule;
reuse rules already in context. Detailed cards now live in `recipes/`.

## First decision

**HOA dues payment fast route:** If the ticket asks Opendoor to make a payment
for HOA dues, direct the customer to `HOAAP@opendoor.com`, the team that makes
all of Opendoor's HOA payments. Do not route the request to a general HOA
contact or invent another payment path. Use this rule before the ordinary
property/retrieval ladder unless the ticket contains a separate, distinct ask.

1. Retrieve the ticket with the Zendesk MCP. For an exact ticket number, use
   `get_ticket` directly; use `search_tickets` only for a non-exact search. Add
   `get_ticket_comments` only when the full thread or newest inbound is needed.
2. For email tickets that may be a repeated complaint, search Zendesk by the
   requester email after the exact ticket read. If a solved matching ticket
   already contains the answer, use the duplicate/no-reply close path and do
   not run customer, property, activity, or offer lookups. Include the source
   ticket number in the operator appendix.
3. Let the ticket shape choose the shortest path below.
4. Run independent reads together, stop when the customer-facing answer is
   supported, and do not retrieve appendix-only context.

Routine-ticket target: finish in under 25 seconds (unverified until measured) with one Zendesk MCP read, one parallel
recipe read block, and at most one dependent read. Skip OpsHub when the inbound
already supports the reply; extract only the fields needed for the outward answer.
Avoid verbose or full connector payloads when compact fields support the answer;
extract only the needed status fields and draft without printing or re-reading large
responses.

**Customer lookup rule:** After `list_customers`, follow the selected recipe's
narrowest read. Use `get_customer` for sell-direct identity or engagement facts;
use `get_customer_profile(full:false)` only for cross-deal history or an assigned
advisor. Never broaden from a failed customer call unless the recipe requires a
specific missing field, and never dump a long-tenured agent's profile for a
same-day activity question.

## Targeted playbook reads

Read required sections together in one local execution after choosing the card.
Use the exact `##` headings linked by that card, from each heading through the
next heading of the same level; include its lower-level subsections. This avoids
line-number drift and repeated keyword searches. Examples:

- Agent verification: `Agents vs sellers`, `Access codes`, `Trust level`.
- Backup offer: `Access codes`, `Submission surfaces`.
- Buyer condition: `Public listings`; the focused card carries the existing
  condition/systems stop rule. Read the matching `Per-type recipes` passage only
  for an exception the card does not cover.
- Seller offer status: `Stage gates the playbook, not the customer's wording`,
  `Lifecycle stage`, `Offers`, `Timing answers`.

Extract by exact heading from the known workspace SKILL.md path; no repository
search, global loader, or preliminary heading-discovery call is needed. In a
single `python3` read, locate each requested heading and its next same-level
heading, then emit just those sections. A missing heading is Not verified: do
not guess a line range or draft without its required rule. Keep each emitted
chunk at most 200 lines and 12,000 characters; label heading, part and continuation.
For longer sections, read all required continuations before relying on them.
These bounds govern targeted reads; do not treat truncated output as complete.
Reuse loaded sections on follow-ups. Independent reads may run together; record
lookups needing a returned identifier must wait. Inspect every result and preserve
newer resolutions, contradictions and pagination when compacting evidence.

## Four fast routing cards

Use these cards to choose the first lookup block. The full playbook remains the
authority for disclosure and stage rules.

| Ticket shape | First lookup block | Stop condition |
|---|---|---|
| Assessment, photos, or square footage | Zendesk ticket/comments if needed → resolve customer and property together → read only the relevant assessment/property evidence | The assessment status, photo evidence, and requested property fact are supported |
| Final offer or dashboard access | Zendesk ticket/comments if needed → customer and property lookup together → read stage/offer status only if visibility or timing is not already established | The reply can state the verified access or next step without surfacing restricted offer data |
| Post-closing bills or reimbursement request | Zendesk ticket/requester and property lookup together → verify identity and relevant close/activity facts only when needed | The reply can request the missing documents or relationship proof without promising an outcome |
| Ambiguous showing versus appraisal/inspection | Read the ticket/comments → ask which type of visit is intended and request the address or listing link | Do not open customer/property history until the visit type and property are clear |

**Recipe-before-draft guardrail:** If the ticket mentions photos, videos, an app,
virtual assessment, walkthrough, upload, or assessment completion, read the matching
section of the workspace `SKILL.md` before drafting. Generic Glean or Help Center
wording is supporting evidence only and must not override a workspace recipe or
operator correction. Preserve exact customer-facing product names and required paths
from the recipe (for example, **Opendoor Key App** for live assessment photos).

## Draft assembly check

Before sending any draft, assemble exactly this shape:

1. A plain triple-backtick customer-reply fence, first, with nothing above it.
2. A separate plain triple-backtick internal-note fence immediately after it.
3. An optional short appendix only after both fences.

Keep ticket numbers, drafting mistakes, apologies about the draft, and process
commentary out of the internal note. For no-send cases, put the approved
`[No reply recommended. ...]` disposition in the first fence.

Before emitting the draft, verify both fences are present and non-empty: the first
must contain the complete customer reply and the second the complete internal note.
Never emit a closing fence without its opening fence or place reply text outside
the first fence.

**No-outbound fast lane:** After the Zendesk MCP ticket read, explicit STOP/
unsubscribe requests and unsolicited listing emails can go directly to the
required close/no-reply disposition and internal note. Do not run customer,
property, activity, or offer lookups. Privacy-owned requests, directed escalation
guidance, and separate support questions remain exceptions and use their specific
recipe.

If the operator asks to “check the reply” or “check the latest reply,” use
Zendesk MCP `get_ticket_comments` first and use the newest inbound message. Use
the live Zendesk ticket only when MCP omits the needed comment or a live-page
check is explicitly requested. Do not ask the operator to paste a reply that is
readable there.

Before drafting from any live Zendesk fallback, verify the visible ticket number,
requester, channel, and newest inbound message. An existing Zendesk workspace tab
may show stale or another-ticket content even when its URL was changed; the URL
alone is not sufficient.

## Tool boundaries

- Prefer OpsHub structured reads over Indextrious and browser.
- Treat `get_property` as a tabbed OpsHub record, not a single assessment check.
  For Showami or assessment questions, use appointment/visit status, attendance,
  activity, photos, and assessment artifacts as available. For other asks, inspect
  the relevant tab, such as checkout, close of escrow, pricing, or Offer Workflow.
  Do not inspect unrelated tabs, but do not conclude “no visit” from one missing
  assessment field when neighboring property evidence can answer it.
- Use Zendesk MCP for ticket and reply checks. Use the live Zendesk browser only
  when the MCP omits the needed comment or a live-page check is explicitly needed;
  use browser for required page-only Flags, Assessments & Inspections, recent
  customer notes or Home Visits facts that structured reads cannot expose.
- Preserve AGENTS.md's recent-notes/activity resolution check for record-specific
  replies, with its inbound-only and explicit fast-path exceptions. Do not
  classify that required check as appendix-only retrieval.
- Escalation preparation follows AGENTS.md and `xa-quick-slack`: verify the
  destination, save an unsent Slack draft when applicable, confirm its draft ID
  and open the destination. Never send automatically; email tickets have no
  OpsHub call note, and estimated/expired offers without a final offer or contract
  do not trigger HSA escalation.
- Never use OpsHub write tools in this project.
- Never invent names, UUIDs, offer amounts, access paths, or email bodies.
- Keep the reply paste-ready first, then the internal note and short appendix.

## Address lookup budget

For an email/account correction, merge profiles only when the same verified
customer name and phone number match on both records and the email is the field
being corrected. A shared phone alone or different names is not a duplicate
signal. For a property-specific correction, get the property address or exact
record identifier first, resolve the property-to-profile relationship, and
leave profiles unchanged until identity and scope are verified.

Treat a street-only address as sufficient for the first lookup attempt. Use the
complete plaintext address provided (for example, `207 Spruce Street`) with
`list_properties` or `pds_search_by_address`. If it returns no usable positive match, make one
normalized retry with city/state/ZIP or the exact recipe filter. Then stop and
report the connector gap or ask for the missing address detail. Do not issue a
series of guessed address variants.

## Escalate to the full playbook when

The ticket is ambiguous, multi-record, attachment-heavy, privacy-related,
stage-sensitive, or the selected recipe requires a rule not summarized above.
For hard tickets needing the complete playbook, use labeled bounded chunks of
at most 200 lines and 12,000 characters each. Read every required continuation;
independent chunks may run together within the tool output budget. Never use an
unbounded remainder or treat truncated output as a complete read.
