# Account merge browser execution

Read this file once when an actual Admin or OpsHub browser step is needed,
after the entry skill’s identity and contact-choice gates. It is not required
for the first caller/profile clarification. Reuse its exact current contents
through the retained workflow; reload only missing or changed sections.
All authorization, identity, background-window and no-replay guards in SKILL.md
remain in force. Relative script paths below are rooted at the skill package.

## Search submission and same-run recovery

For Agent 360 search forms, load the current shared guard and use its tested
`searchEnter` payload as documented in `browser-navigation/references/agent360-execution.md`.
This also applies to the keeping record's merge-candidate search, which has no
Sort By control. Reuse the exact keeping record/merge page and retained caller
identifier; verify the visible search field is focused, fill the original caller
phone, submit once with `browser_press_key(guard.searchEnter)`, then read the
settled candidate list and select the exact qualifying account. If ordinary
Enter already reported delivery without a result, use this distinct search-only
recovery before handing work back to the XA; do not cycle through phone formats,
search for an OpsHub UUID as an assumed Admin search key, or ask the XA to type
or submit a known phone while this supported recovery is available. No scripted
submit, Angular handler, synthetic DOM event, focus stealing or duplicate-account
creation. Keep the confirmed same-person answer and keeping email through the
recovery and continuation; a search failure does not invalidate either answer.
If the candidate is already selected or a merge may have been submitted, inspect
that state first and never resubmit a search or merge blindly. Continue the
reviewed merge/cleanup/existing-note verification when the exact target appears;
report a precise blocker only if this bounded search recovery actually fails.

A filled field or `Enter` reporting `landed: true` proves neither submission nor
an empty search result. Verify the settled customer result, not merely the input
value. With native Chrome, use the observed scoped input's documented
`press("Enter")`; with Agent 360, use its documented fill/key controls. After the
initial bounded result wait (up to 10 seconds), read the current URL, visible
search input value, visible customer-result rows and the scoped **Sort By**
control together. An unchanged Customers URL without the submitted query and
only **New Customer** is an unsubmitted/stalled search, not proof that the
customer is absent. Do not spend the only recovery repeating an ineffective
Enter or ask the XA to open Admin while the following visible recovery is usable.

When the full confirmed email is still in the search field and results have not
settled, inspect the visible `select[ng-model="admin_customers_index.sort_search_by"]`
and its actual options. If **Most Recent Event** is selected and **Most Recent SMS**
is available, select **Most Recent SMS** once through the documented UI control
(Agent 360: `browser_select_option`). If **Most Recent SMS** is selected, use the
observed **Most Recent Event** option instead. This changes only search ordering
and triggers Admin's search through its normal UI; it does not edit a customer.
Do not toggle back, reload, switch browser surfaces, repeat Enter, invoke Angular
handlers, dispatch scripted events or call hidden APIs. If the input is wrong,
correct it through documented input controls before this single recovery.
A missing/ambiguous/disabled control, failed selection or uncertain selection
requires a focused state check; never assume the recovery landed.

After selection, wait up to 10 seconds for settled results and inspect the actual
row containing the exact confirmed email with its numeric Admin href. **New
Customer** (including `/new?mode=search&query=...`) is never a customer result;
a URL query or a successful sort alone is not an identity match. If the keeping
record is verified, continue step 4 in this run with the retained identities,
authorization and posting receipts. Do not stop for another "try again", ask the
XA to repeat confirmed information, or close the task window between recovery
and continuation. If matching results already appeared, skip recovery.

If this one distinct UI recovery is unavailable, fails, or still yields no
verified match after the bounded wait, stop with the observed search/access
blocker and keep the note pending. Distinguish a settled no-match result from a
search that never submitted; report which occurred and the recovery attempted.
Ask for operator intervention only when that specific remaining blocker
requires it. This recovery applies only before a merge submission. It never
authorizes retrying a merge, contact save, Slack send or note post; inspect
uncertain mutations and reuse verified receipts under their existing guards.

## After-search UI fast path

Use these selectors observed in the October 22 run as starting points, validating them against the current page. Rediscover only if absent, ambiguous, or changed. Keep the Customers-first search sequence above unchanged.

- **Admin navigation:** use the current URL, keeping UUID, and visible controls as the state. A customer can open directly on `/links`; do not reopen the record or click Links again in that state. A ready merge form for that customer ends navigation immediately. Otherwise, click the visible Links control only when Links is still needed, then click the visible Merge control. Before either click, if that target is hidden, open the visible `button[uib-tooltip="Switch tabs"]` **once and wait until the target itself is visible** before clicking. A successful menu-button click does not prove the menu has rendered. Links can close the menu; re-check Merge visibility before reopening it. Do not toggle a menu when the intended target is already visible.
- **Collapsed details and hidden matches:** if Switch tabs and the intended link are both hidden, allow a short readiness wait (up to 3 seconds). In the October 26 run, `info_outline` was the visible details control while navigation was collapsed; the generic `button[ng-click="$emit($ctrl.eventName)"]` matched a hidden button and failed. Inspect only that control and its surrounding customer header. If a unique visible details toggle is identified there, open it once, then wait for visible navigation. Never click the generic `$emit` selector or an unrelated info button. If the control cannot be identified safely, report that specific blocker.
- **Visible target selection:** inspect all matches with `querySelectorAll` and select the unique visible, enabled match in the current customer pane. Check dimensions and computed visibility; do not assume `querySelector` returns the visible match. If duplicate hidden markup precedes the visible element, use a documented locator scoped to the verified visible element; native evaluation must not mutate the DOM. Do not force-click hidden elements. Re-query after each navigation change; stale element references and mere DOM existence are not readiness checks.
- **Bounded menu recovery:** if the intended target remains hidden after opening the menu, read its state once and allow one recovery based on that evidence. Stop and report a navigation blocker if it still fails. Do not cycle through Switch tabs → Links → Switch tabs repeatedly. Never wait for the merge form after a rejected Merge-link click; repair navigation first.
- **Candidate selection is the next action:** when the keeping customer and a qualifying candidate are already visible, select that candidate in the same guarded orchestration call as the focused candidate read. Do not wait for a Merge button before selecting a candidate; selection reveals it. Read the selected customer’s identity and the visible warning-button state together. If a missing surname or Agent label is the only new information, proceed under the qualification rule above without another user question. A true placeholder without independent compatible identity or verified matching phone can remain in the sidebar; missing email alone is never a reason to skip a named matching-phone candidate.
- **Merge-page readiness:** wait for `input[ng-model="customer_merge.query"]`, not the nonexistent `Merge Customers` heading that cost 10 seconds in the October 22 run. Read keeping identity/email and candidate identities once. Select the qualifying duplicate; wait for the candidate details and visible `button[ng-click="customer_merge.warned = true"]`. Generic `button:text(Merge)` previously selected a hidden control. Read the selected target and keeping identity, then click that precise visible button. Read the displayed irreversible warning once before clicking visible `button[ng-click="customer_merge.merge()"]`. If already at the final warning, do not repeat the first button. After submission, inspect the automatically refreshed surviving profile, merge-specific success confirmation and remaining distinct candidates together, tying the result to the retained keeping and duplicate IDs. If Admin is still loading or the result is ambiguous, use one bounded result wait of up to 30 seconds and one focused state read; stop waiting as soon as the result is established. Verify this yourself, including on an interrupted run before any further merge action; do not ask the XA whether it completed or to supply a screenshot. Reuse a retained verified result without another read unless new evidence conflicts. If unresolved, report `Merge submitted; result unverified` and the actual missing evidence or access/tool blocker, preserve both IDs and keep dependent actions pending. An unknown answer from the XA is not a result check; a timeout never authorizes another final Merge click. Match the candidate by the inspected email/phone or retained ID rather than a name-only click; keep final submission separate from an unreviewed warning.
- **OpsHub contact-editor fast path:** after Admin verification, navigate once to the retained OpsHub customer UUID. Use the read-only probe in `scripts/contact_editor_probe.js` below to resolve the unique visible, enabled **Customer Info → Edit**, not Agent Info's Edit. If the editor is already open, read the full contacts without clicking again. Do not target Edit by styling classes (including `button[class*="hover:bg-[var(--hover-bg)]"]`): the saved trace repeated that ineffective selector, while a text-targeted Edit opened the editor despite the same background-timeout warning. Do not infer OpsHub is broken from that warning. Only use visible Details if Customer Info is actually collapsed. Group ready-state resolution → one documented click → input-ready check → full contact read in one guarded orchestration call. Read every `input[name^="emails."]` and `input[name^="phones."]` with its value, primary state and associated remove control; observed controls are `button[title="Remove email"]`, `button[title="Remove phone"]` and `button[aria-pressed]`. Do not probe an empty dialog or dump the full page.
- Remove only the inspected non-primary contacts using their current rows, highest indexes first to handle renumbering; re-query after each removal. Execute those known removals sequentially in one orchestration call, stopping on failure. Read the desired lists once, save once, then reload/reopen once and read the complete saved lists for final verification. Do not inspect the saved page and then perform a second redundant verification before reopening the editor.

## Contact-editor targeting and same-run recovery

Load `scripts/contact_editor_probe.js` from this installed package once when
contact UI is actually required. It is a read-only function expression: evaluate
its exact trusted source through the selected browser's documented read tool
with the retained exact OpsHub customer URL as its argument. It returns
`editor-open` or `edit-ready` with an observed plain CSS selector; it checks the
customer route and scopes Edit to Customer Info without styling classes or
temporary DOM attributes. Use that selector immediately through the documented
click tool, then a fresh bounded wait/read of the visible contact inputs.
The probe never clicks, saves, changes focus or authorizes an action.

Use `guard.step(action, observe)` for opening Edit: after any
`maybe_landed:true` response, observe the actual editor instead of treating
`ok:false`/`landed:false` as failure. If inputs are visible, continue cleanup
in this run without another click or operator confirmation. A generic tool
warning or lack of a dialog is not proof that the inline editor failed.

If the editor is still closed, make one focused readiness/state check (up to
10 seconds). If a previously used styling/generic selector did not open it and
the fresh probe identifies the exact enabled Customer Info Edit, use that
distinct scoped target once as the bounded navigation recovery, then check
the editor again. Do not repeat the ineffective selector, cycle variants,
steal focus or reload. Opening Edit is a reversible UI navigation step, not a
contact save; this narrow recovery never retries a merge, contact save, Slack
send or note post. If the editor's state is uncertain, inspection only.
Continue the retained authorized cleanup → fresh full-list verification →
original note/escalation immediately after recovery, preserving completed
receipts and confirmed facts. Do not ask the XA to verify contacts or say
“continue” merely because the first selector or browser acknowledgement failed.
If this scoped recovery truly fails, report the observed control/editor state
and recovery attempted, retaining the pending task; do not claim an OpsHub
outage, successful cleanup or posting without evidence.

Regression: `node scripts/test_contact_editor_probe.mjs` from this package
with the existing Playwright dependency on `NODE_PATH`. It uses only an isolated
headless browser with intercepted synthetic pages, never working Chrome.

## Efficiency rules

- **Round trips dominate latency:** the October 26 trace had about 82 seconds between orchestration calls, plus substantial delivery overhead beyond the browser tool’s own execution time. A working click can take 0.2 seconds internally and nearly 7 seconds end to end. Minimize separate calls and repeated discovery rather than adding waits or merely shortening narration. These measurements do not establish an intentional pause or a server-side merge delay.
- **Ready-screen execution:** after a focused read establishes identity and the next visible control, issue the next action immediately. Read keeping/candidate identity, candidate selectors, and readiness together when the merge form opens; do not follow with another link/HTML inventory. After candidate selection, combine selected-identity and warning-button readiness in one read. After reviewing it, group opening the warning with reading the full warning and final-button readiness. Once that warning and the exact targets are reviewed under the established authorization, submit immediately and group submission with a bounded result check. Preserve the identity and irreversible-warning review boundaries; do not add further discovery between a completed review and its action.
- **No startup catalog scan:** use the selected browser surface's known, documented controls. Use the selected surface's documented bound-page operations; Agent 360 is re-enabled for Router. Load a missing declaration only when required by the runtime, without repeating the shared manual. Do not enumerate the catalog, rediscover schemas, reload skills, or repeat verified customer lookups.
- **Batch by decision boundary:** use the tested `agent360_guard.js` and its usage reference from the shared browser skill for Agent 360 batches; it decodes nested MCP JSON and stops dependent actions on hard failures. An `ok:false` / `maybe_landed:true` background click allows only a fresh read of the expected state, then continuation if verified, never an automatic click retry. Use one orchestration call for session-tab check → unfocused Admin open. Group Customers click → input-ready wait → fill → compatible Enter → result wait → focused result read in another. After identity review, group keeping-record open → guarded Links/menu navigation → merge-ready wait → focused candidate read. Execute calls sequentially with an explicit success/state guard after each dependent action; stop the batch on failure. Logging a failed result with `text()` and continuing is not a guard. Hidden-element errors and `found: false` must prevent later clicks and waits. For `maybe_landed`, unknown, or unverified outcomes, inspect the current page before deciding the next action. Treat only the documented Enter false negative by checking the result page. Return to reasoning when identity, candidate selection, or the irreversible warning requires review, rather than after every routine click. Never batch the final merge across an unreviewed confirmation.
- **Native scripting boundary:** evaluation is read-only. Use documented scoped locators for clicks, fills, keypresses and contact removal; never use temporary DOM attributes, scripted submissions, hidden application state or direct merge API calls. For Router, use the reauthorized Agent 360 surface when native access is unavailable; if neither surface meets the workflow requirements, report the concrete blocker.
- **Read field values, not labels:** Admin identity fields are editable inputs; `innerText` can return only “First Name / Last Name / Email” and omit their values. Read visible input `.value` together with the keeping/removing section’s UUID, email, phone and control visibility in one focused result. Avoid slicing around guessed text markers or dumping the candidate’s unrelated Agent settings, tasks or event history. Repeat only for a missing required value or actual state change.
- Read visible identity sections and relevant control state together. Omit full-page text, input inventories, parent `outerHTML`, hidden warnings, and unrelated customer forms. An identity/confirmation read replaces repeated top/tail/HTML probes; repeat only when missing or contradictory.
- Prefer focused DOM/text reads over screenshots and full-page dumps. Return only the relevant customer identity, merge state, or complete contact lists; skip unrelated histories and page content.
- Batch independent reads when useful. Keep merge, cleanup, verification, and posting sequential. Browser actions share page state: do not parallelize them or batch across a confirmation that still needs inspection.
- Use the page's ready/result state instead of fixed sleeps. Readiness waits return as soon as the target is ready; a 10/30-second timeout is a ceiling, never an instruction to pause after a successful check. Do not insert a sleep, status polling loop or extra discovery between a ready candidate and selection, or between a reviewed warning and submission. Keep routine reasoning brief. Send the start, submission, verified-cleanup-stage, and completion statuses at their actual transitions, outside the note. If a stage lasts 30 seconds, report the current concrete blocker or pending check; never leave only `Account merge started` visible for minutes. Do not imply submission or completion before the corresponding action or verification.
- Do not repeat a successful check without new conflicting evidence. Exceeding 60 seconds does not permit omitting verification or leaving additional real duplicates unhandled.
