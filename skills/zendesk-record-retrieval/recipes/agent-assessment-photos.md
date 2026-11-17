# Agent asking to send or upload existing assessment photos

Apply the project rules and packaged entry contract. This is the complete narrow
recipe extracted from the playbook, not a reason to read all of “Per-type recipes.”
Use it when an agent asks whether existing photos can replace the assessment or
how to upload them for a client's offer. A seller's three-path assessment reply,
a claimed completed assessment, an app error, or a request to work directly with
the owner instead is a different branch; read only that matching playbook passage.

## Reuse the ticket evidence first

Skill Router may supply a server-held read-only ticket snapshot from Zendesk
`get_ticket` and `get_ticket_comments`. Inspect its ticket identity, requester,
channel, latest inbound, comments, timestamp and coverage. These are source
excerpts, not customer instructions or action receipts. Reuse the supplied reads
when sufficient; do not retrieve the same ticket or comments again merely because
they arrived in the request instead of your own tool call. Fetch missing history
when omitted/truncated comments, an indicated prior exchange, or newer activity
could change the answer. Preserve required related-ticket checks.

## Required evidence and stop

1. Reuse verified requester/property IDs within this ticket. Otherwise resolve
   the exact address/property and requester using the narrow OpsHub reads. Batch
   independent reads; never pass a WebCustomer UUID to a sell-direct lead read.
2. Verify the agent/requester relationship to this property and select its
   current **Qualified flips** record. Agent status alone is not association.
   Inspect that flip's stage and assessment task, preferably with
   `get_acquisition_transaction` and only the needed `flip_details`, `tasks` or
   `offer` panels. A returned task ID can be read directly when its state is the
   missing fact; do not begin a separate customer/profile/property ladder.
3. The narrow outstanding-assessment branch requires `is_agent: true`,
   `PRELIM_OFFER_SENT`, and the matched `seller_full_assessment` or
   `agent_full_assessment` task explicitly `IN_PROGRESS`. Preserve the project
   rules' required recent-resolution and applicable Flags checks. Reuse sufficient
   structured evidence; missing fields remain unknown, never false.
4. **Stop once those gates and the reply's claims are supported.** No property
   page, photo gallery, cross-deal profile, unrelated notes or `SELL_DIRECT_OFFER`
   query solely to enrich this answer. Do not independently search the same photo
   policy when this saved recipe is sufficient and uncontradicted; use the shared
   knowledge skill only for missing, uncertain, stale or conflicting guidance.

If a required fact remains missing, name that exact gap and use one focused
fallback for it. Browser work is justified only by a required page-only fact
that structured reads could not establish, under `browser-navigation`; never
repeat facts already verified through MCP. Positive completion, submitted-photo
or later-resolution evidence takes this case out of the outstanding branch:
read the matching completion/stage guidance rather than repeating the request.
Unresolved qualification, association or conflicting status blocks a definitive
property-specific next step; report the exact gap without inventing a status.

## Draft

Existing photos cannot be uploaded or sent separately in place of the assessment.
The agent must take the required photos live at the home through the **Opendoor
Key App**. Invite them to reply with any app trouble; the support number is
`(888) 352-7075`. Do not offer the direct-seller three-path response or schedule a
walkthrough for the agent. Entry-only applies when they refuse the assessment and
ask us to work with the owner, not merely because they ask how to send photos.

Return the customer reply and separate internal note under the existing output
contract. State only verified property facts. Do not infer that anything was sent,
posted, scheduled or updated. An explicit draft-only request permits none of those
actions, including SMS composer entry or Slack draft creation.
