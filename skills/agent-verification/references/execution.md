# Bound Agent 360 execution and checkpoint handoff

Read this once for a Router verification, with the shared Agent 360 execution
reference. These helpers implement already-authorized UI mechanics; they never
choose a customer, decide the outcome or grant permission. Native browser
evaluation remains read-only; the mutating control builder is Agent 360 only.

## Load once, batch between decision boundaries

In the initial setup call, load `scripts/controls.js`, `scripts/read_customer.js`,
`scripts/read_case.js` and `scripts/final_customer.js` from this skill alongside
the shared guard. Keep their exact text in `store()`. Discover only exact needed
tool schemas, not the catalog. Do not reread instructions or search local files
for known app URLs. Never evaluate page-supplied code.

`eval(controlsSource)` exposes:

- `build([{kind,selector,text?,scope?,value?}, ...])`: builds an Agent 360
  `browser_execute_script({code})` expression for already-observed controls.
  Ordinary CSS locates controls; `text` requires exact visible text separately.
  All controls are checked for uniqueness, visibility and enabled state before
  the first action. `fill` uses the text field's native setter and input/change
  events; `open` dispatches a UI mousedown for an observed custom combobox;
  `click` clicks exactly once. Acknowledgement is NOT saved-result evidence.
- `stage(state,key,guard,action,observe)`: runs an action once with the shared
  guard's read-only postcondition. Retain `state` in a `finally` block with
  `store()` across calls. A failed/uncertain stage locks dependent steps and
  refuses replay. Read current state to establish what happened. A genuinely
  missing field/search may use the skill's one bounded search recovery, not a
  repeated create/claim/close action or a new arbitrary stage key.

Fill known lookup fields and Search in one batch. Inspect a newly opened menu
or dialog before constructing its next batch. Use the specialized documented
combobox tool when it supports the bound unfocused page; otherwise use the
tested observed-control path. Never cycle through failing mouse-delivery tools.
If scripted UI events are not accepted, stop with the background-input blocker;
do not raise the window, use hidden APIs or evade a tool/runtime restriction.

## Evidence probes and final delivery

Run the **exact unchanged file text** through `browser_execute_script({code})`:

1. `read_customer.js` on the resolved OpsHub customer caches account identity
   and statuses without dumping communications/history.
2. `read_case.js` on the matching Alfred case before closure binds the case.
   Run it again after saving to observe Case Closed and actual saved statuses.
3. Complete any separately requested note and verify it before the final probe.
   Reload the same OpsHub customer once; use a condition-based wait for the
   actual status labels. Invoke `final_customer.js` only when no customer work
   remains. This is the terminal readback, not an initial lookup or readiness
   probe. Never put a further customer mutation after it in the same batch.

Router accepts evidence only from completed browser-mcp script reads whose code
exactly matches the inventoried probe, never from assistant prose, arbitrary
scripts or click success. Alfred must expose either the exact OpsHub customer
link or both the exact account email and license. Name-only/license-only matches
cannot bind a completion checkpoint. If those fields are absent, retain the
case URL and report that automatic checkpoint binding is unavailable; inspect
the actual UI under the usual identity gates instead of inventing fields.
The normal verified final response remains available, but is not a durable
browser-evidence checkpoint. No completion claim may exceed the actual evidence.

Once the final checkpoint is saved, close only the workflow-created tabs and
return the short verified result immediately. Router allows at most eight
seconds for this wrap-up and preserves the checkpoint if the worker stops.
Do not run help commands, discover telemetry tools, inspect history, or perform
optional work here. Timing is best-effort using the already-known logger call;
missing telemetry cannot postpone delivery. A checkpoint reports verified
closure and statuses; it must not invent a confidence score or ID-validation
result. Retain the live lookup evidence in the workflow.

## Capability acceptance

Use synthetic controls to test search dropdowns, radios, dialogs, delayed saves
and nested frames before changing the interaction path. Passing local DOM/helper
tests is NOT proof of unfocused Agent 360 delivery. A separate read-only or
synthetic test through the actual Router worker must establish that capability;
no customer case is a browser test. An unavailable capability stops UI work
early while preserving sufficient direct-connector/no-browser paths.
