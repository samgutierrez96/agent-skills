---
name: zendesk-ticket-merge
description: Review Zendesk merge candidates, merge an explicitly approved source into a verified destination when a merge tool is available, or solve a verified duplicate already answered elsewhere. Use for Zendesk ticket merges and Skill Router merge notices, not customer-account merges or ordinary reply drafting.
---

# Zendesk ticket merge

Inputs are the current/source ticket, related/destination ticket(s), requested
outcome and any retained evidence or approval. Ticket IDs, people and case facts
are inputs, never standing targets. A Router suggestion or workflow demonstration
authorizes review, not a ticket change.

## Fast evidence path

- Reuse sufficient current ticket/comment evidence from the selected conversation.
  Fetch only missing exact tickets with Zendesk `get_ticket`; read relevant
  `get_ticket_comments(full:true)` when necessary to see the actual exchange,
  newest inbound, resolution or attachments. Batch independent reads and retain
  results; do not reload the general Zendesk playbook for this narrow operation.
- If the destination is unknown, use one bounded requester-related search, then
  inspect plausible exact candidates. No inbox sweep or unrelated OpsHub lookup.
- Match requester identity, the relevant property/transaction and the actual
  concern. A name/address/subject match alone is insufficient. Compare the ask,
  prior response, subsequent inbound and remaining work. Status alone is not
  evidence that the question was answered.
- Merge suggestions are optional discovery, not the only way to choose a ticket.
  Their absence proves neither that no related ticket exists nor that a merge is
  impossible. Keep independent issues separate; review recipient, CC, channel
  and confidentiality conflicts before any consolidation.

## Choose the outcome

Honor an explicitly requested, eligible consolidation even when the related
ticket already contains an answer; do not replace it with note-plus-solve merely
because suggestions are empty. The no-merge branch applies when consolidation
is not requested or Sam chooses that alternative.

**Already answered elsewhere, no merge needed:** Prefer no new public reply and
a concise internal note identifying the verified responder, what was answered
and the other ticket's full verified URL. Do not repeat the current ticket ID.
Interpret “no comment” here as no customer-facing reply, not literal text to send
and not permission to omit the internal note. Do not hard-code a staff name.
An unanswered part, newer follow-up or unclear resolution keeps the work pending.

Drafting this disposition changes nothing. When Sam explicitly authorizes solving
that exact ticket, use one `update_ticket` with its `ticket_id`, `status:"solved"`
and `internal_note`; omit `public_reply` and `html_reply`. Leave the related ticket
unchanged. Merge approval alone is not approval for this alternative. Verify the
saved status and private note, using readback only for facts the response does
not establish. Report “solved with an internal note,” never “merged” or “closed.”
Do not promise that account automations generate no notifications merely because
no public reply was submitted.

**Conversation should be consolidated:** Identify exact source(s) → destination
and why that conversation should continue. Before execution, Sam must approve
that direction with the irreversible source-closure consequence understood.
Retain an already explicit informed approval; ask only for missing decisions.
Review fresh relevant state before the write, without refetching unchanged facts
already established in the same execution. Preserve unsent drafts.

## Merge execution and capability limits

- Inspect only the current `merge_tickets` / `get_merge_status` schemas once when
  execution is requested. The local connector now implements them, but an older
  running connection may still need refresh. A saved implementation is not proof
  that the current session exposes it. `update_ticket`, `batch_update_tickets`
  and note-plus-solve never substitute for a merge. Do not collect credentials or
  change connector code while running this skill unless separately requested.
- With the guarded connector, call `merge_tickets(source_ticket_id,
  target_ticket_id, internal_note)` for its read-only preview. Review the match,
  direction, recipients, eligibility and destination status. Once authorized,
  call with `confirmed:true` and both `expected_*_updated_at` values from that
  preview. This does not require repeating an already explicit informed approval.
  A stale/missing preview requires review, not overwriting the guard. Put the
  remaining customer concerns in the internal reason, not a claim of resolution.
- A `submitted` receipt is not completion. Use `get_merge_status(operation_id)`
  to check the job and private reciprocal links; retain the operation ID. For a
  pending result use bounded read-only checks, never another merge submission.
  `previous_attempt`, unknown or failed verification keeps the original operation
  pending. Do not erase its local receipt to bypass the replay guard.
- When a genuine merge action is exposed, verify source/destination eligibility,
  keep both merge comments internal/private, preserve full ticket links and
  outstanding asks/attachment references, and submit once. No separate public
  reply, reassignment or destination-status change is included in merge approval.
- Without that tool, provide the exact-ID manual handoff. Computer Use is an
  alternative only when Sam explicitly requests browser execution: load the
  shared `browser-navigation` skill, use the source ticket's **Ticket options →
  Merge into another ticket**, enter the exact destination ID, review direction,
  privacy and notification effects, then confirm once. Stop on an unavailable
  action, ineligible ticket or unclear privacy effect; do not force eligibility.
- A source must be unsolved; an eligible solved destination is possible and stays
  solved. If Sam expects an open continuing thread but the preview says solved,
  resolve that status choice before writing. Reopening is a separate explicitly
  authorized action; do not silently add it to a merge or promise automatic reopening.
- Verify the merge relationship/receipt, source closure and intended destination,
  with relevant work still findable there or through the linked source. Closure
  alone is not proof of merge or resolution. On an uncertain result, perform a
  bounded read-only check of both tickets; never resubmit an uncertain mutation.

## Output and validation boundary

### Button-driven post-merge handoff

After verified completion, Router offers **No further response needed**,
**Review reply & solve**, and **Review internal note**. These are explicit UI
choices, not commands Sam must type. Reuse verified ticket IDs and retained draft
text; require typing only for a genuinely unknown destination or an operator edit.
Normal form/disposition requirements still apply. Do not ask for a person's name
merely to complete a Zendesk ticket merge.

- Hold separate reply/note submission while an accepted merge or its follow-up
  decision is unresolved. Required private merge audit comments are part of the
  merge itself, not an extra follow-up note.
- **No further response needed** stops locally: no new drafting turn, message,
  additional note, status change or reassignment. Keep the continuing ticket as
  it is; an earlier staff reply is not permission to solve that person's ticket.
- A review choice rechecks the exact destination and refreshes normal drafts in
  that ticket's channel, using retained original drafts/source evidence without
  treating draft wording as proof of actions. A newer supported answer may make
  another reply unnecessary. Never carry an outdated reply through blindly.
- The resulting destination-bound reply or note goes through the existing exact
  submission review. Sending/posting still requires that final explicit approval.
  Reply-and-solve is a proposed disposition to review, not automatic resolution;
  keep open/pending when the question remains unresolved. Note-only keeps status
  and assignment unless the operator explicitly chooses otherwise.
- Retain independent merge, draft and submission receipts. Recover pending work
  read-only instead of repeating a merge, drafting turn or uncertain send. Do not
  take over another agent's ticket automatically to make the handoff proceed.

In Skill Router, the Suggested ticket merge card's **Merge tickets…** control
accepts exact IDs without Zendesk suggestions. Its read-only preview includes
short conversation excerpts and full-ticket links; confirmation binds the reviewed
pair, private reason, saved chat and operator connection. **Check result** verifies
the original attempt rather than retrying it. The app owns these controls and
transport; matching and action scope stay with this skill. The separate ordinary
**Review submission** control is not a merge. An old running server may need an
authorized idle restart before the new merge control is active.

Keep process/action responses brief: outcome, exact direction or related ticket,
and the one remaining decision/blocker. For a draft, show the no-public-reply
disposition and internal note separately; use the caller workflow's existing
format when embedded in Zendesk. Only an uncompleted merge recommendation uses
`Possible ticket merge`; a rejected or resolved-without-merge match does not.
Separate suggested, approved, attempted and verified-complete states.

The November 19 recording demonstrated candidate review, not merge completion.
A subsequent separately authorized live connector merge was verified, including
source closure, open destination and private reciprocal notes. No case identifiers
belong in this skill. The Router control is validated with synthetic lifecycle,
SDK and isolated UI tests, not another live customer merge. The manual UI steps
remain documentation-backed, not a recorded replay. No general latency/quality
guarantee follows from one merge; never replay writes for measurement.

Official references, read only when eligibility or controls need clarification:
[merge API](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#merge-tickets-into-target-ticket)
and [ticket merge controls](https://support.zendesk.com/hc/en-us/articles/4408882445594-Merging-tickets).
