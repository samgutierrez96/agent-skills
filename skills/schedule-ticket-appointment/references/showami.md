# Showami booking procedure

## Resolve readiness before opening the scheduler

Use the active Zendesk owner's “Assessment reschedules and confirmations” and,
when relevant, “Showami assessment access when the seller will be absent”
guidance if those rules are not already loaded/current for this task. Reuse
sufficient governing evidence; verify changed or unclear business policy through
the shared `kb-answer-for-callers` skill rather than treating this recording as
policy. Preserve eligibility, permitted scheduling horizon, applicable presence
requirements and access restrictions. A lead-time recommendation is not a new
hard restriction invented from the demonstration.

Check the current appointment/assessment state for the same property and concern.
An existing matching booking gets confirmation/drafting, not another booking.
An existing appointment with a different slot requires an explicitly authorized
reschedule procedure; this first recording does not establish cancellation or
reschedule controls. Do not create a second appointment as a substitute.

Prefer an available documented connector that actually supports this provider's
availability, booking and receipt verification. Discover only its needed schemas.
A calendar event, generic home visit or self-assessment task is not a Showami
booking. No Showami-specific write connector was exposed during creation of this
skill; inspect actual availability at execution, never invent a tool.

## Computer Use path demonstrated in OpsHub

When the required booking controls are not exposed by a sufficient connector,
use Computer Use through the shared `browser-navigation` skill. On this machine
it is at `~/.codex/skills/browser-navigation/SKILL.md`. Read and follow its browser
selection, separate-background-window, supported-control, private timing and
cleanup instructions. Desktop may use supported native Chrome; Skill Router
uses its configured Agent 360 connection while native worker access is unverified.
Do not operate the user's active typing tab or attach to live pages for maintenance.

Use fresh page-scoped controls, not recorded coordinates, numeric element IDs,
the demonstration's customer links, or a hardcoded localhost Router URL.

1. Open the verified OpsHub customer/property context. Confirm the displayed
   property, applicable current transaction and participant relationship before
   using the booking panel. Reuse sufficient structured identity evidence;
   do not search again merely to recreate the recorded navigation.
2. On the matching property's Acquisition page, choose
   **Assessment & Inspection**. Review its current assessment rows, then open
   **Schedule Assessment** and choose **Showami assessment**.
   The demonstrated panel heading is **Schedule Showami assessment**.
   “In-person walkthrough” and “Diligence Visit” are different menu choices;
   do not substitute either if Showami is missing or disabled.
3. Select the requested eligible date by its full accessible date label and read
   the live available times. The panel states **Times shown in the property's
   time zone.** Confirm that zone rather than using the operator's computer zone.
   The recorded date and morning slot are examples, never defaults.
4. Select a live available time that satisfies the authorized preference and
   current scheduling rules. For “earliest available,” choose the earliest
   eligible live slot, not the demonstration's chosen time. If no permitted
   slot matches, return the actual options or precise blocker without booking
   an arbitrary alternative or reserving a slot just to inspect it.
5. Verify **Customer mobile number** belongs to the intended contact. Answer
   **Are there gate codes or entry restrictions?** from established facts.
   Choose **No** only for a confirmed absence of restrictions. If **Yes**
   exposes additional fields, inspect their current labels and enter only the
   verified necessary instructions. This recording demonstrated only **No**;
   do not invent unseen fields, silently choose No, or bypass validation.
6. Immediately before **Schedule**, verify the unchanged property/provider,
   exact selected date/time/zone, mobile number, readiness/access and booking
   authority. Obtain any genuinely missing approval through the supported
   mechanism; reuse approval already covering the selected action. Follow any
   actual tool-enforced confirmation requirement.
7. Select **Schedule** once. **Scheduling…**, disabled controls, a click result
   or panel dismissal alone is not proof of a saved appointment.
8. Read the settled success state and/or refresh only the matching appointment
   record through a supported read. Verify property, provider, exact slot/time
   zone and recorded status. Retain a returned appointment ID or scoped receipt
   if available. Distinguish requested/unassigned from accepted/confirmed.
   If acknowledgement is lost or the state is unclear, inspect the outcome
   read-only; do not click again, switch surfaces to rebook, or call it confirmed.
   Stop with the exact unresolved outcome if it cannot be established.

Continue to the parent skill's draft handoff only with accurately qualified
booking evidence. Drafting while blocked may explain the missing step, but must
not claim a booking or provider acceptance that was not established.

## Recording boundary and evidence limits

Source: Sam's November 23, 2026 demonstration, reviewed through the request to
revise the reply after scheduling. The recording shows the OpsHub control path,
date/time selection, mobile/access fields, one Schedule click, then a same-ticket
request to update the draft with the booked time. It captures **Scheduling…**,
not a settled booking receipt, and does not expose the final revised draft text.
Sam accepted the pre-send workflow, not a requirement to copy unavailable wording.

The later disposition/send attempt and its error are explicitly excluded.
Do not reproduce them or treat the demonstration as authority to send, solve a
ticket, repair the error, or replay the demonstrated appointment. No customer
values or raw recording artifacts are distributed with this skill.
