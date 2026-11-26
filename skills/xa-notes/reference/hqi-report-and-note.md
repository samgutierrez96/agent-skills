# HQI report and caller note

On-demand action procedure for XA Call notes. Read only when the operator
explicitly asks to file/submit an HQI or home issue/Home Feedback report for this
call. This is one report containing five fields, not five separate reports.
The ordinary caller note keeps its existing five labels, wording and layout.

## Authority and original-case binding

- "File the HQI report and post it" or "Submit the home issue report and post
  the call note" requests report creation followed by the caller note. Natural
  equivalent commands count; no exact password is required.
- A report-only request authorizes only the report. Respect "do not post the
  note", "draft only", negation, quotation and reported caller speech. "I filed a
  report" documents past work and triggers only the existing bounded link lookup.
  "Post it" alone never authorizes a new report.
- A skill/project save, process explanation, warm-up, video or example is not a
  live-case command. Never replay the recorded case or use its customer facts.
- Retain the original request/call, verified caller CONTACT UUID, full scoped
  property/address token, applicable flip token, report body/version and separate
  report/note intent. Check that exact binding again immediately before each
  write. The open browser page and a property-linked seller are not the caller.
- Reuse already-verified same-call identity, appointment and completed-action
  evidence. Resolve a genuinely missing/changed target under the existing
  caller/merge gates before any write. If several properties are in scope,
  resolve the report's specific property; do not file on all properties by default.

## Collect all five report fields

Use the XA's supplied facts and the minimum required OpsHub context in parallel
with the normal caller/property/operator lookup batch. Do not repeat that batch.
A missing appointment time permits one targeted caller/profile read for the
matched property/date; do not scan unrelated old appointments. If it is still
unknown, ask instead of assuming the current hour or scheduling another visit.

The message submitted to Home Feedback is:

```text
Severity: <confirmed severity fitting this issue>

Issue: <reported problem>

Area: <affected location>

Notes: <ShowingTime appointment date/time and timezone when known; actual attempts and each result; relevant guidance actually given>

Able To Access: <Yes or No>
```

All five values must be factual and complete before submission. Do not submit
these angle-bracket descriptions, blank fields or invented filler. Severity is
not always Critical, High or Urgent; do not invent a severity-to-priority mapping
from one example. Clarify an unsupported severity or affected area. Notes retain
the appointment as already scheduled, not booked on this call. For a non-tour
home-condition report, do not invent a ShowingTime appointment.

Access is exactly Yes or No, based on the actual final outcome. A failed static
code does not prove No if another method worked; no final outcome is unknown.
Ask only missing required questions, grouped once when possible. Present finite
answers explicitly, for example "Was the agent able to enter? Answers: Yes; No."
Keep severity and access as independent decisions; free-text facts remain text.

For the scoped ShowingTime touring-agent route, retain the reported current-
confirmation/static-code, remote-unlock/rotating-code and available-lockbox
attempts/results. Missing attempts are not completed attempts. Filing this report
does not authorize unlocking, retrieving/sharing codes, verifying an agent,
booking, rebooking, vendor dispatch, a work order, Slack sending or an incident
report. Existing Trust & Safety and listing-stage/access restrictions remain.
Do not put actual door/lockbox/gate code values into the report or caller note.

## Submit directly through OpsHub MCP

Use the existing local `opshub` connector's `call_operation`, following the main
skill's exact-name bind-once rule. This is not the separate home-ops-only remote
connector; do not substitute a flip note for a caller CONTACT note.
For this explicit action only, `get_task(task_id)` (exact local binding
`mcp__opshub__get_task`) is an additional permitted read for the returned report.
Do not enumerate unrelated tools or inspect
schemas when these known arguments suffice.

The same operation used by the Home Feedback Triage form is:

```json
{
  "operation_name": "StartTriageProcess",
  "variables": {
    "input": {
      "flipToken": "<verified original property flip token>",
      "source": {"message": "<the complete five-field report above>"}
    }
  }
}
```

Use the verified flip token, not the property UUID or caller UUID. For the
demonstrated failed-ShowingTime-access route, use Send to Home Feedback Triage:
omit `overrideResult`. Do not substitute `ReportIncident`, `CreateCustomerNote`
or Create Work Order/`SendToLwo` for report intake. Do not inherit an older
home-condition article's work-order override into this scoped access workflow.
A request for another report type or work order needs its own authorized
procedure; it is not five variants of this action. Optional images require
their own requested, supported upload path; do not claim an attachment from a
local filename or screenshot alone.

Send the report once. Keep the exact submitted body and the real returned
`homework.startTriageProcess.taskId` (inside `data` when the connector wraps it).
Errors, a dry-run/preview, empty results or prose claiming success are not a
create receipt. This operation's known input has no idempotency key: do not
invent one and do not automatically retry a timed-out/interrupted create.

Read `get_task` for that exact returned task ID and verify its property/flip
against the retained request. A direct returned URL is preferred; otherwise the
current form's verified task route is
`https://opshub.apps.opendoor.com/tasks/{returned taskId}`.
Do not invent a task ID, select an older/unrelated report, claim dispatch or
equate an open report with resolution. If task read-back is incomplete, use only
a bounded read of that exact task or the browser fallback below; hold the note
until the new report and usable matching link are confirmed.

A successful direct report link is sufficient: do not wait/poll for an automatic
Slack notification or perform a second search just to replace it with Slack.
Preserve an already-verified matching Slack report permalink if the XA
specifically wants it, under the main skill's existing bounded lookup.

## Post the same caller note, then stop

After the report is verified, compose the normal five-field note once:

- Property Address: the original verified scoped property.
- Reason for Call: the stated caller/reason and existing appointment when relevant.
- Customer Concerns: the actual reported problem and failed methods.
- Solution Offered: actual troubleshooting and final entry outcome, then
  "Filed a home issue report: <verified direct report URL>".
- Follow Up Link: the matching OpsHub property-page URL.

This is a placement pattern, not fixed case facts. Preserve the XA's accurate
wording and any explicit link-placement request. Include each URL once; do not
turn the report macro into the caller note or claim newly scheduled/verified
actions. Strip the action command from the note. On a report-only request,
return the note as a draft with the report link and do not post it.

For an authorized combined run, apply the normal Part 11 CONTACT posting,
supporting-link and duplicate-note gates. Post the plain five-field body to the
verified caller, never the property owner merely associated with the home.
Confirm the real note receipt under the existing workflow. Return the same
fenced note and one concise result line distinguishing HQI filed and note posted.
A report receipt does not prove a note, and a note receipt does not prove a report.

## Partial failure and continuation

- Before any confirmed report: do not write "Filed" as completed work. Missing
  facts or report/access failure keep the call pending with the concrete blocker.
- Uncertain report creation: no second create and no browser resubmission. Reconcile
  read-only using the retained task/case/time evidence within the existing bounded
  lookup. If still uncertain, report "HQI submission unconfirmed; note not posted"
  and request only the evidence needed. Do not infer failure from a search miss.
- Confirmed report, failed/unconfirmed note: retain the report's receipt, full
  body/version and URL in this call's response/context. Return the copyable note
  plus "HQI report filed: <URL>; note not posted: <actual blocker>". A follow-up
  finishes only the authorized remaining note step after reconciling an uncertain
  note outcome; it never runs StartTriageProcess again.
- An already-filed report or same-call success receipt is reused, not recreated.
  A request to correct the caller note follows the in-place update path; it does
  not edit/refile the report. Materially changed report facts need clarification
  about that existing report, not a silent second ticket.
- Keep the original caller/property, independent questions and both action
  outcomes visible through recovery. Do not borrow another call's receipt or
  clear an unresolved report just because the note posted. Stop after the
  authorized outcomes are verified; no cosmetic live-chat repair or extra turn.

## Browser fallback, only for a real connector gap

Use MCP first. A browser is not a preparation step or routine duplicate check.
If required report creation or exact task read-back is actually unavailable
through the configured connector, follow the shared browser-navigation skill in
the executing runtime, including its separate background window and timing.
Never use the operator's working tab. Carry the original case and any receipt
across transports. A confirmed pre-submission capability failure may use the
authorized form action; an uncertain prior write permits read-only reconciliation
only. If the supported browser cannot satisfy these constraints, stop with the
specific blocker. Caller-note posting itself remains the existing MCP-only path.

## Sources and verification limits

Business scope: Chris Lewis's November 24 macro announcement and Casey Chapman's
Yes/No reply, plus Casey's November 24 ShowingTime update:
https://opendoor.slack.com/archives/C02K6JVSNUF/p1795550961051789
https://opendoor.slack.com/archives/C02K6JVSNUF/p1795554332314589
https://opendoor.slack.com/archives/C02K6JVSNUF/p1795560605110109

Sam requested this combined Call notes action on November 25, 2026. The report
payload and /tasks/{taskId} route were checked that day against OpsHub master:
`js/packages/opshub/src/features/Hold/components/ActionsPanel/ReportDialog.tsx`,
`features/Hold/graphql/mutations/StartTriageProcessMutation.ts`, and
`protobuf/homework/services/services.proto` in `opendoor-labs/code`.
The local connector catalog contains StartTriageProcess; use its native returned
schema/errors, never unsupported speculative fields. Source inspection and
offline fixtures do not prove a live submission, permission or latency result.
