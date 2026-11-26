---
name: schedule-final-offer-appointment
description: "Arrange a seller's final-offer discussion: share or book a listed regular HSA's Final offer call link, route Agent-HSA or urgent-expiry outreach through escalation, and document only authorized actions."
---

# Schedule Final Offer Appointment

When this workflow actually requires a browser, follow the shared
`browser-navigation` skill at `~/.codex/skills/browser-navigation/SKILL.md`
(packaged alongside this skill). Prefer the new ChatGPT Chrome integration;
retain direct-connector, no-browser, background-window and authorization gates.

Use this skill when an Experience Advocate needs to arrange a seller’s final-offer call with a home sale advisor or offer the advisor's scheduling link. Keep direct connectors first; use Computer Use only for required page-only booking/sharing steps. Link sharing, booking, escalation and OpsHub posting are distinct actions with their own authorization and verified outcomes.

## Inputs

Collect or infer these from the active customer/property record and the user’s request:

- Customer record or property record to update.
- HSA/advisor whose Calendly schedule should be used, or the HSA schedule sheet from which to select it.
- Preferred date/time or permission to choose an available slot.
- Call reason, customer concern, and solution offered for the OpsHub note. If not provided, use the demonstrated final-offer scenario only when it is clearly applicable.

Treat customer names, email addresses, phone numbers, addresses, property IDs, and booking URLs as runtime data. Never hard-code or repeat captured personal data in the skill or in a chat summary.

## Choose the advisor path before scheduling

Sam's November 25, 2026 operational correction uses the verified assigned advisor
on the caller/property-matched current qualified acquisition and
[HSA Schedules for XA](https://docs.google.com/spreadsheets/d/1gMPcyjLEEF4yBYiuTZybVaxzgr9UWiaYcFUoYb93zBs/edit?gid=741428371#gid=741428371).
Read the live directory through a sufficient connector before browser fallback;
do not hard-code its roster or infer absence from a partial/failed read.

- Listed regular HSA: use that advisor's actual Calendly link and `Final offer
  call` event. Offer to send the link so the seller can schedule, or book only
  under explicit booking authority and the required time preference. Do not use
  `15 Minute Meeting`, another HSA's link or the internal sheet as the seller link.
- Agent HSA: escalate to that assigned advisor to contact the seller rather than
  defaulting to booking. A verified assigned HSA absent from a complete successful
  current-directory check takes this Agent-HSA path. A listed ON LEAVE advisor,
  blank/broken link, unknown assignee or name mismatch is a coverage/verification
  gap, not proof of an Agent HSA. Preserve existing escalation/coverage permissions.
- Expiring soon, including today: use urgent assigned-advisor escalation rather
  than routine future scheduling. Verify and retain the expiry; do not invent a
  numeric cutoff for “soon”, callback deadline, extension or preserved offer terms.
  If urgency cannot be determined, resolve it before booking. Already-expired
  offers keep their refresh/unexpire path; expiry alone does not prove readiness.

The September 18 process-thread owner replies, read November 25, support the
unlisted-advisor escalation exception:
https://opendoor.enterprise.slack.com/archives/C02K6JVSNUF/p1789757961962119.
This save authorizes no contact, booking, escalation or note. Use the active
escalation workflow when that path is required, within its existing permissions.

## Link-only handoff

When the operator chooses to send the scheduling link, verify the assigned HSA
and actual Final offer call URL, then prepare it in the permitted customer reply
or share control. Send only under the originating workflow's send authorization;
an unsent draft is not delivery. Stop after the requested link handoff, without
selecting a slot, booking an event or adding an unrequested OpsHub note. Describe
the outcome as offered/prepared/sent a link, never “scheduled” without a confirmed
booking. Generic maintenance requests never operate a live customer composer.

## Workflow

Only continue below for an authorized booking with a listed regular HSA after
the advisor/expiry gate above; link-only and escalation paths stop before slots.

1. Resolve the matching OpsHub customer and property through sufficient direct connectors, using the browser only for a required remaining page fact. Confirm that the customer and property are the intended ones before copying any details. Select only the current applicable record in **Qualified flips**, never **Unqualified flips**, to verify final-offer status, assigned advisor and the scheduling path. Newest/primary alone does not prove qualification. An unqualified denial cannot override a qualified expired offer; expiry alone does not establish readiness for a final-offer call. If qualification or the applicable qualified record cannot be verified, stop before booking and report the gap rather than infer denial/no offer or use an unqualified advisor.
2. From the property record, use the visible `Copy address` control. From the customer record, obtain the customer name, email, and best phone number using the page’s copy controls or accessible text. Do not transcribe these values into chat.
3. Reuse the current directory-verified HSA scheduling URL, open it and choose the `Final offer call` event type. Do not bypass the advisor/expiry gate because an old booking URL is known. Prefer semantic link/button targets over coordinates.
4. In Calendly, select the requested date and an available time. If no requested time is available, stop and ask the user whether to choose another slot; do not make an unrequested booking.
5. Fill the Calendly booking form with the runtime customer name, email, phone, and property address. Review all fields and the date/time before selecting `Schedule Event`.
6. Before the booking mutation, ensure the user has authorized scheduling for this customer. Select `Schedule Event` only after that confirmation is established. Verify that Calendly shows a confirmation page or equivalent booked state.
7. Return to the matching OpsHub customer record and prepare a note in this structure:

   ```text
   Property Address: <property address>

   Reason for Call: <reason>

   Customer Concerns: <concern>

   Solution Offered: Scheduled an appointment for the seller to speak with the home sale advisor.

   Follow Up Link: <property record URL>
   ```

   Adapt the solution wording if the user explicitly describes a different outcome. Keep the property URL as the follow-up link unless the user requests a different link.

8. Paste the property address into the note, review the full note for the correct customer/property and absence of unrelated sensitive information, then select `Add` only after the user has authorized updating OpsHub. Verify that the new note is visible in the customer record.

## Optional call-state step

If the user is actively on a Twilio Flex call and the customer is on hold, use the semantic `Unhold Customer` control only when the user asks to resume the call or the workflow explicitly requires it. Do not change call state as an incidental step.

## Failure handling

- If OpsHub, the HSA sheet, or Calendly is unavailable, report which system is blocked and preserve the current booking/note state.
- If the customer or property match is ambiguous, stop before copying data or booking.
- If Calendly booking succeeds but the OpsHub note cannot be added, report the confirmed booking and leave the note text ready for retry; do not book a second appointment.
- If a booking confirmation is not visible, treat the booking as unconfirmed and do not add a note claiming it was scheduled.
