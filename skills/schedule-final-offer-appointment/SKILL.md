---
name: schedule-final-offer-appointment
description: Schedule a seller’s final-offer advisor appointment through the available HSA Calendly link and record the follow-up note on the matching OpsHub customer record.
---

# Schedule Final Offer Appointment

Use this skill when an Experience Advocate needs to arrange a seller’s final-offer call with a home sale advisor and document the interaction in OpsHub. Use Computer Use for the browser workflow because the recorded flow depends on the visible OpsHub, Google Sheets, Calendly, and (when applicable) Twilio interfaces.

## Inputs

Collect or infer these from the active customer/property record and the user’s request:

- Customer record or property record to update.
- HSA/advisor whose Calendly schedule should be used, or the HSA schedule sheet from which to select it.
- Preferred date/time or permission to choose an available slot.
- Call reason, customer concern, and solution offered for the OpsHub note. If not provided, use the demonstrated final-offer scenario only when it is clearly applicable.

Treat customer names, email addresses, phone numbers, addresses, property IDs, and booking URLs as runtime data. Never hard-code or repeat captured personal data in the skill or in a chat summary.

## Workflow

1. In Chrome, locate the matching OpsHub customer and property record. Confirm that the customer and property are the intended ones before copying any details.
2. From the property record, use the visible `Copy address` control. From the customer record, obtain the customer name, email, and best phone number using the page’s copy controls or accessible text. Do not transcribe these values into chat.
3. If the HSA’s scheduling URL is not already known, open the `HSA Schedules for XA` Google Sheet from the saved bookmark, locate the appropriate HSA, open their Calendly link, and choose the `Final offer call` event type. Prefer semantic link/button targets over coordinates.
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
