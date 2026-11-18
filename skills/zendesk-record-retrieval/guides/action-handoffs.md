# Escalation preparation and SMS composer handoff

Paths written from the project root in this preserved guidance remain project-root paths.
Load this guide only for the trigger named in AGENTS.md or FAST-INDEX.md; reuse it thereafter.
An explicit draft-only/read-only request overrides standing composer/draft preparation exceptions.

When the operator asks to update a Slack channel from this project, use the
escalation skill (`xa-quick-slack`). **Email-ticket escalations:** Slack drafts
only when the destination is verified; if no appropriate channel can be verified,
apply the department-email fallback in the playbook. Do not emit
an OpsHub call note. Do not Slack a home sale advisor on an estimated or
expired offer with no final offer and no contract.

**Internal Slack email links:** Preserve existing `mailto:` prefixes and email
link formatting in internal Slack messages and escalation drafts prepared from
Zendesk. Do not strip them during cleanup; Sam wants to retain the email contact
options shown in Slack. This preference applies only to internal messages and
supersedes any earlier request to remove `mailto:` (2026-10-26).

When a Slack escalation message is requested, save it as an unsent draft in the
verified destination channel or existing thread by default. This standing
preference authorizes draft creation without another request each turn. Never
send the message; leave it for the operator to review and send. Confirm creation
only when the tool returns a draft ID.

If Slack draft creation returns `not_in_channel` for the verified public
destination, join that channel with `slack_join_conversation`, then retry the
unsent draft in the same channel and existing thread. The authorized escalation
draft includes this membership step; do not stop at a paste-ready message or ask
for another confirmation. Verify that joining succeeded before retrying, and
confirm draft creation only after receiving a draft ID. Never send the draft.

**Pricing escalations are tickets, not ordinary Slack messages** (Sam, November 3,
2026). Prepare the verified Pricing ticket fields for the operator to submit:
Flip Token, Full Address, Admin Link, Question Type, and Question. Use the exact
current form labels/options if they differ. Each field gets its own plain fenced
copy box containing only its value, with the field label outside the fence. Never
combine the five fields into one box or label the form as a customer reply. A
form-only follow-up returns these field boxes; when customer reply/internal-note
drafts are also requested, keep their two boxes first and append the field boxes.
Admin Link requires the matching offer's verified Admin URL, not an OpsHub URL.
Retrieve it: reuse the verified requester/lead/flip, inspect the matching offer's
structured link when available, otherwise open its focused OpsHub offer/transaction
page and follow the actual Admin link. In OpsHub Acquisition, open Details when
the sidebar is collapsed, then Property actions → Admin closing page (or its
Copy Admin closing page link control). Verify the destination against the same
requester, property and offer before copying its URL. A missing URL in one MCP
response is not a completed lookup; use that focused browser fallback. Do not
construct an Admin URL from an identifier, substitute a dashboard/OpsHub link or
another offer, or present a reminder to find the URL as the field value. If the
lookup is genuinely blocked, state the attempted lookup and exact blocker outside
the boxes, leave Admin Link without a copyable placeholder, and mark the form
incomplete rather than ready to submit. Do not create a regular Slack
draft as a substitute, submit the ticket automatically, or describe prepared
fields or an unsent Slack draft as a submitted Pricing escalation. Preserve the
Zendesk internal-note draft and its actual pending next action.

When a ticket requires another escalation, identify and verify the correct destination,
prepare an unsent Slack draft when applicable, and open the destination channel
or existing thread for the operator. Include a paste-ready Zendesk internal note
that reflects the actual status and next action. A saved draft is not a sent
escalation: say it is prepared for review and sending until sending is verified.
Do not send messages or submit external escalations automatically.

**SMS composer handoff (Sam, November 4, 2026):** After the required retrieval and
draft checks, place the applicable public reply or internal note directly in the
verified SMS ticket's matching Zendesk composer and leave it unsubmitted for Sam.
This standing preference authorizes composer entry only, not sending/posting,
clicking Submit, solving/closing, or changing ticket status. Verify the visible
ticket, requester, SMS channel and Public reply/Internal note mode before typing;
preserve existing unsent text and stop if it conflicts with the intended draft.
Do not paste a no-reply/close recommendation into a public reply; use the internal
note composer when no customer reply is warranted. Never paste both drafts into
one composer or put internal content in Public reply. Confirm placement only after
checking the visible composer text and mode; if entry cannot be verified, provide
the copy boxes and state the exact blocker. Keep the reply/internal-note boxes
available in chat. Sam handles submission and disposition. Email workflows are
unchanged; no ticket is acted on merely to save this preference.
