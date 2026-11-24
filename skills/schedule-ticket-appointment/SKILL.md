---
name: schedule-ticket-appointment
description: Schedule a Showami assessment from verified Zendesk customer, property and participant details, then create or revise the customer reply and internal-note drafts. Use when the operator asks to book from a ticket or update drafts after booking. Other appointment types are not yet implemented; ordinary ticket drafting does not authorize booking or sending.
---

# Schedule a ticket appointment

Turn verified ticket context into an authorized appointment, then a matching
unsent reply. Showami is the first supported provider. Home visits and other
appointment types need their own demonstrated/provider-specific procedure;
do not apply Showami controls or requirements to them.

## Context and scope

Reuse the original ticket, requester, customer, property/current transaction,
participants, latest inbound, existing drafts and completed evidence checks.
A selected page, customer name or participant alone does not establish the
correct ticket-to-property relationship or booking authority.

For missing Zendesk facts, use the active `zendesk-record-retrieval` workflow,
not an older global variant when the project selects its own source. On this
installation its active package is
`/Users/sam.gutierrez@opendoor.com/Documents/ChatGPT Work/Zendesk/skills/zendesk-record-retrieval/`.
Read its entry/routing instructions only as needed and retain the project's
evidence, current eligibility, recent-resolution and reply-format rules.
Do not repeat sufficient verified retrieval merely to perform it on another surface.
The workspace path is deployment configuration, not a customer value.

- A request to record/create this skill does not authorize any live appointment.
- An operator request to schedule may authorize booking within its stated scope.
  A customer asking about availability, an automatic skill match, or “fix the
  draft” does not by itself authorize booking.
- Honor explicit draft-only/read-only limits and stricter project/runtime rules.
  If the host prohibits booking, prepare a handoff to an authorized booking
  context; do not bypass that limit using a browser or hidden API.
- This skill never sends the Zendesk reply, submits its internal note, changes
  ticket disposition/status/assignment, or repairs an unrelated sending error.
  Creating the appointment and preparing the reply are separate outcomes.

## Required inputs

Establish only what is missing; use verified ticket/record facts or the operator's
explicit report of their own completed action, not prior assistant claims.

- Exact ticket and channel; intended requester, matched customer and property.
- Appointment type/provider and current eligibility, including any actual
  agent-only restriction. An attached agent alone is not proof of such a restriction.
- Requested date/time or usable preference, interpreted in the property's
  verified time zone. Preserve “any time” or “earliest available” without asking again.
- Correct customer mobile number and intended participant/contact; a prefilled
  phone must be checked, not silently accepted or changed on the customer profile.
- Vacancy/occupancy, applicable adult presence, and usable access arrangements.
  Ask all remaining readiness questions together before slot selection. Do not
  treat missing restrictions as “No.” Vacant unattended Showami visits require
  usable access, collected through Opendoor.
- Booking authority and any required tool/action-time approval.

Read [Showami procedure](references/showami.md) for a Showami booking. For an
unsupported appointment type, state that its procedure has not been added and
ask for the relevant demonstration or verified provider instructions. Do not
experiment by submitting a live appointment.

## Draft handoff and stopping point

After a verified booking, revise the existing reply in the same ticket rather
than starting a new conversation. If the operator already booked and only asks
for redrafting, use their explicit completion report with the supplied exact
slot; ask only for missing material details. Do not book again or claim independent
verification of an operator-reported action.

1. State the actual scheduled/requested status, date and time in the property
   time zone. Prefer an absolute date; “tomorrow” may accompany it but must not
   become a reusable fixed value. Do not say an assessor accepted or will attend
   unless the current appointment evidence establishes it.
2. Keep the reply concise and answer the remaining ask. Retain confirmed
   attendance/access arrangements when useful, but never echo access codes or
   internal identifiers. Do not re-ask settled readiness questions or give only
   general scheduling hours once a specific appointment is booked.
3. Keep SMS brief, using the existing introduction/follow-up convention; use
   email formatting only for email. Preserve unrelated correct draft content.
4. Refresh the internal-note draft to match the actual action, slot, supported
   status and any pending next step. Do not generate an OpsHub XA post-call note
   or post another note merely because an appointment was created.
5. Return the complete customer-reply and internal-note drafts in the owning
   workflow's required separate copyable blocks. In a standalone chat, use
   separate writing blocks. Put booking evidence or a precise blocker in a short
   operator appendix, outside the customer copy.

When integrated into a host with local draft-edit tools, bind the exact ticket
and draft revision, preserve other fields/unsent text, apply only the authorized
local draft update and verify its saved version. Otherwise provide the drafts;
do not claim Router, Zendesk or its composer was updated. Do not open a different
ticket or use the Router UI to run another agent when direct drafting suffices.

Stop when the appointment outcome and revised drafts are handed off.
Do not select Disposition, Review submission, Verify submission outcome, Submit,
Send or Solved as part of this skill. Existing reply/SMS uncertainty is separate
from booking and grants no resend or repair authority.

## Maintenance

Canonical authoring source: `samgutierrez96/agent-skills`,
`skills/schedule-ticket-appointment/`. Keep the complete installed folder at
`~/.codex/skills/schedule-ticket-appointment/` identical. Save locally immediately;
publication remains with the existing evening synchronization. Never store
recorded customer identities, addresses, phones, codes or raw event streams here.
