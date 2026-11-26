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
- **Merge-page readiness:** wait for `input[ng-model="customer_merge.query"]`, not a guessed heading. Read the keeping identity and candidate once; select the exact qualifying candidate, then inspect its full identity and visible `button[ng-click="customer_merge.warned = true"]`. Review the irreversible warning and exact final `button[ng-click="customer_merge.merge()"]`; if already at that warning, do not repeat the first button. Capture the pair-bound pre-submit observation described below, submit once, and immediately read the result in that guarded call. Stop waiting as soon as the toast or settled cleared-panel transition proves completion. Only a still-loading or ambiguous result gets a readiness wait, up to 10 seconds, followed by one focused result read; exact-account recovery is reserved for a result that remains ambiguous. Neither a warning, background timeout nor a retained sidebar entry authorizes another merge. Preserve identity and irreversible-warning review boundaries; no extra discovery after review.
- **OpsHub contact-editor fast path:** after Admin verification, navigate once to the retained OpsHub customer UUID. Use the read-only probe in `scripts/contact_editor_probe.js` below to resolve the unique visible, enabled **Customer Info → Edit**, not Agent Info's Edit. If the editor is already open, read the full contacts without clicking again. Do not target Edit by styling classes (including `button[class*="hover:bg-[var(--hover-bg)]"]`): the saved trace repeated that ineffective selector, while a text-targeted Edit opened the editor despite the same background-timeout warning. Do not infer OpsHub is broken from that warning. Only use visible Details if Customer Info is actually collapsed. Group ready-state resolution → one documented click → input-ready check → full contact read in one guarded orchestration call. Read every `input[name^="emails."]` and `input[name^="phones."]` with its value, primary state and associated remove control; observed controls are `button[title="Remove email"]`, `button[title="Remove phone"]` and `button[aria-pressed]`. Do not probe an empty dialog or dump the full page.
- Remove only the inspected non-primary contacts using their current rows, highest indexes first to handle renumbering; re-query after each removal. Execute those known removals sequentially in one orchestration call, stopping on failure. Read the desired full lists once and save once, then use one fresh authoritative saved-list read; reopen the editor only if that is the supported way to expose all persisted contacts. Do not separately inspect the saved page and then repeat the same verification in the editor. After this check, keep the unchanged verification editor open for connector posting when possible; if UI posting requires it closed, use the observed Cancel once with no unsaved changes, without another contact probe. Read back the created note once; do not reopen contacts after posting.

## Pair-bound completion, then ambiguous-result recovery

Load `scripts/merge_result_probe.js` and `scripts/merge_actions.js` once alongside
the shared guard in the first necessary setup call; keep their trusted source
in runtime storage without printing it. The probe is read-only; the runner
groups documented UI actions within each reviewed decision boundary. Evaluate
the trusted runner expression and use
`runner.agent360({tools, guard, probeSource})` as `io`, with the retained exact
`pair = {keepingAdminId, keepingUuid, duplicateUuid}`.

After selecting the exact candidate, call
`io.read({...pair, includeIdentity: true})` in that same orchestration call.
It returns scoped identity UUIDs/input values, unique observed plain-CSS controls
and state. Review those identities under the entry skill, not more ancestors or
page dumps; pass its observed CSS selector unchanged instead of composing a new
text selector. Then call
`runner.review({operationId, pair, selected, identityVerified: true,
mergeAuthorized: true, io})` using that inspected `selected` result and flags
from the original completed gates. This rechecks the identities, opens the warning
once if needed, and returns `confirmation-ready` with `before.warningText`.
It never submits. Review the returned irreversible/login consequences before
the next phase; an already-open final warning skips the first Merge button.

Once reviewed, execute the final phase in one orchestration call:

```javascript
const journal = load('adminMergeJournal') || [];
const outcome = await runner.submit({operationId: retainedPairRequestId, pair,
  reviewed, warningReviewed: true, identityVerified: true, mergeAuthorized: true,
  io, journal, checkpoint: entries => store('adminMergeJournal', entries)});
store('adminMergeOutcome', outcome);
text(outcome);
```

`reviewed` is that operation's exact review result. The runner freshly checks
the identities and unchanged warning, checkpoints the pair before the final
click, submits once, then reads its bound result. Its single read-only DOM
observer resolves immediately when ready, with a ten-second rendering ceiling;
no sleeps or repeated tool/model polls. Real merge/permission errors, changed
identities/targets or changed review text stop dependent work. The normal
qualification `will be deleted/kept` notices are not failures. The probe separately
returns `profileWarnings` for the exact pre-existing MLS-agent lookup validation
inside an inspected keeping/removing profile; that embedded form warning is not
a merge rejection and does not require editing unrelated agent/MLS fields.
Continue the reviewed merge when the exact pair and controls are ready. The same
message outside those profiles, any explicit error toast, unknown/mixed rejection
text, or a warning newly appearing after submission remains blocking. Do not
claim Admin rejected a merge that was never submitted.
A lost click response or repeated/concurrent call
reconciles only the recorded submission; a verified receipt skips further reads.

Retain the serializable journal and receipts in the original workflow context.
Runtime storage is not crash-durable and does not replace Router's existing
request/receipt guards. A fresh recovery reuses recorded action evidence, never
an empty journal to retry an uncertain merge. No intervening search, selection or
navigation may stand in for this pair's result. `verified` requires a new
success toast or the inspected pair + final warning clearing on the same ready
keeping account, not a sidebar entry, green checkmark or click acknowledgement.

Retain the pair IDs and returned evidence with completed-action receipts in the
original workflow, exclude that pair from remaining work, and move directly to
the next genuinely distinct candidate or OpsHub cleanup. The read-only probe
performs no action and never returns merge-retry authority. If already verified,
reuse the receipt without rerunning the probe. A retained sidebar suggestion is
not a new unmerged candidate and must not trigger reselection of that pair.
An empty old profile or missing association on an unrelated/initial page is not
this captured transition: missing before/after evidence takes the recovery below.

Regressions: `node scripts/test_merge_result_probe.mjs` and
`node scripts/test_merge_actions.mjs` use intercepted synthetic
pages in a new isolated headless browser. They cover toast-free completion with
a retained sidebar entry, a new/stale toast, loading, warning/error states,
missing pre-submit evidence and mismatched keeping/duplicate IDs. Like the
contact-editor regression, they require the existing Playwright dependency on
`NODE_PATH`; they never attach to working Chrome or exercise a live merge.

A confirmation that remains visible is a state to inspect, not by itself a
blocker or permission to click Merge again. Reuse any completed-merge receipt
already captured for this exact keeping/duplicate pair; a generic selected-record
checkmark is not that receipt.

If the focused post-submit read and bounded wait show only the old warning or
otherwise ambiguous UI, use one read-only recovery in the workflow's background
window. Open the retained exact duplicate profile link and inspect its resolved
account identity alongside the retained keeping account. Use observed links or
documented profile reads, not guessed routes, hidden state or merge APIs. A
duplicate that now redirects/resolves to the exact surviving account, or an
explicit merged-into relationship naming that survivor, establishes completion.
Matching names, email or phone on still-distinct accounts do not. This navigation
is not a merge retry or a refresh loop.

On the pair-bound cleared-panel transition, a merge-specific success receipt,
or that exact-account resolution,
retain the evidence and immediately continue OpsHub cleanup, full-contact
verification and the original authorized task. Do not seek another approval,
wait for a confirmation/sidebar entry to vanish, or revisit Admin after success.
If the duplicate remains distinct without a completed-merge receipt, or the
supported read is unavailable, preserve the uncertain submission without
resubmitting it. Report the exact unresolved state or failed read and recovery
attempted, not merely “Admin still showed the confirmation.” No completion
evidence means no dependent contact save or posting.

## Connector-first contact-only update

For repeated-number-only cleanup, prefer this supported operation with valid or
unknown names; no browser is needed when complete saved contact evidence and the
operation are already available. Load this section, the planner and the tested
`scripts/contact_cleanup.js` runner only,
not the Admin/browser procedures. Call `planRepeatedPhone({customer,
customerUuid, callerPhone, identityVerified, cleanupAuthorized, contactsComplete,
accountConflict: false})` under the entry skill's narrow gates. It removes only
non-primary copies of the verified primary caller number and preserves all email
and distinct-phone entries and primary states; no keeping-email answer is needed.
Use the returned `ready` request once and one complete persisted read with
`verify`; `noop` skips the write. A conflict or ambiguous/missing target returns
`blocked`, never broader cleanup. Preserve draft-only and uncertain-write guards.

The broader `plan` path below is for authorized consolidation to confirmed sole
contacts, not repeated-number-only cleanup.

### Single-call contact cleanup runner

Use `scripts/contact_cleanup.js` instead of regenerating read/plan/save/verify
code across model turns. Evaluate the exact trusted helper and
`scripts/contact_update_plan.js` locally without printing their contents. Its
`run` accepts `operationId` bound to the originating caller/request, `mode`
(`repeated-phone` or `consolidate`), retained `customerUuid`, `callerPhone`,
`identityVerified: true`, `cleanupAuthorized: true`, `accountConflict: false`,
the `planner`, and documented `readSavedContacts` / `updateCustomer` callbacks.
Consolidation also requires `detectionComplete: true` and the confirmed
`primaryEmail`. These values come from the entry skill's completed gates, not
from the helper. Check `planner.reviewEmailFormat(primaryEmail)` from retained
evidence before execution. An `email-format-confirmation-required` result carries
`emailFormatReview` with issue codes and an optional syntax-only suggestion;
the runner returns this before any read/write. Present the entry skill's Use /
Enter corrected email choices, not a generic disabled-Save dead end. A new
corrected address takes the scoped editor below; the runner never fabricates a
missing contact. For an explicitly selected exact first/last pair, also pass
`nameCorrection: {firstName, lastName}` and `nameCorrectionConfirmed: true` in
`consolidate` mode. `nameCorrectionPending: true` is allowed only with that
complete confirmed pair; an unresolved choice or uncertain prior write blocks.
The repeated-phone fast path never accepts a name correction. The operation's
retained signature includes the exact pair, so another selection cannot reuse
an earlier result. Omit name arguments to preserve existing names unchanged.
`readSavedContacts({phase, customerUuid})` must return `{customer,
contactsComplete: true, persisted: true, preferences}` from one current complete
saved read, using the CustomerDetail shape below; never label unsaved form state
as persisted. Reuse a sufficient connector; do not add a browser for this helper.

If full lists/types require Agent 360, load the current shared guard and
`scripts/contact_editor_probe.js` alongside this helper in the same necessary
setup call. Establish the separate unfocused task window under the shared
browser skill first, opening the retained exact customer URL with
`new_tab: true, eget_vindue: true, fokuser: false`; do not reuse an operator-owned
editor or unsaved work. Then create its tested reader:

```javascript
const readSavedContacts = cleanup.agent360Reader({tools, guard, probeSource,
  expectedUrl: retainedCustomerUrl, pristineTaskWindow: true});
const outcome = await cleanup.run({operationId: retainedRequestId,
  mode: 'repeated-phone', customerUuid: retainedCustomerUuid,
  callerPhone: verifiedOriginalPhone, identityVerified: true,
  cleanupAuthorized: true, accountConflict: false, planner, readSavedContacts,
  updateCustomer: request => tools.mcp__opshub__call_operation(request)});
store('contactCleanupOutcome', outcome);
text({state: outcome.state, reason: outcome.reason,
  writeAttempted: outcome.writeAttempted, failure: outcome.failure,
  emailFormatReview: outcome.emailFormatReview});
```

Use the runtime's already-bound documented operation tool; the shown name is
the Router OpsHub binding, not permission to invent an absent tool. The reader
requires no host `URL` global. Its read-only state observation handles collapsed
Details, expanded Customer Info and an already-open editor; it never waits for
a heading hidden by that editor. It opens each necessary Details/Edit control
once through the guarded click tool, shares one ten-second readiness budget per
visit, and combines editor readiness with the complete saved snapshot. After the
connector write it revisits once for persisted verification. It decodes actual
primary flags, phone types and labelled public role/preference switches. Radix's
transparent, `aria-hidden` native form inputs are mirrors, not additional Agent
controls; associated labels supply stable names without changing any toggle.
Missing state or genuinely ambiguous public controls still stop the batch with
a safe `failure.stage` / `failure.code`. Do not add a separate input/type inventory or return
to the model between these deterministic steps. The runner makes at most one
update, reads persisted state once afterward (also after a lost response), and
never retries an uncertain write. Repeated in-memory operation IDs share their
original result; this does not replace the containing workflow's durable
request/receipt guards. Retain the helper instance and outcome, not a fresh
evaluation to retry it. Blocked/unconfirmed is not permission to post.

For `verified`, retain the evidence and immediately continue the original
authorized note/escalation; when its exact retained body and target are ready,
do its connector post in this same orchestration call, retaining the real note
receipt. This runner never generates or posts a note, performs an Admin merge,
chooses contacts, clears attention or authorizes any action. Leave an unchanged
verification editor open until the task is complete, then close only its owned
task window and record timing in the existing finalization call. No additional
contact check or model-only finalization round is needed.

Provider-free runner tests and isolated intercepted headless-browser adapter
tests are `scripts/test_contact_cleanup.mjs` and
`scripts/test_contact_cleanup_browser.mjs`. They make no live customer changes.

Source-verified November 19, 2026 in `opendoor-labs/code`:
`js/packages/opshub/src/features/Customer/types.ts` requires nonempty first and
last names, and `components/EditCustomerPanel/EditCustomerPanel.tsx` disables
Save while that entire schema is invalid. `EditCustomerName.tsx` renders
`firstName-error` / `lastName-error` paragraphs; they need not have role=alert.
A profile with a blank surname can therefore block a phone-only save even when
the email/phone fields have no errors. Do not demand an unavailable name,
reformat a correct phone, click unrelated fields, or repeat the same editor
attempt to clear that whole-form validation. Sam permits the exact temporary
first/last pair `Customer` / `Customer` under the entry skill's rare fallback;
this is not an invented personal identity or a substitute for normally
obtaining the caller's real name.

Reverified November 20, 2026: the same `editCustomerSchema` validates every email
with `z.string().email()`, and Save requires the entire form's `isValid`. A
legacy address with a dot immediately before `@` fails that validation even
when the name/phone fields have no visible errors. Missing displayed errors or
native `aria-invalid` flags do not establish schema validity. Do not silently
remove that dot, substitute a secondary email, force Save, or attribute this to
an OpsHub outage. Apply the entry skill's email-format correction choices before
the next write, even when that malformed email was previously selected as the
keeping account. Do not use omission of the malformed address from a delta as a
substitute for that correction decision. Retain all completed merge receipts.
After the exact corrected address is selected/supplied and its relevant account
conflicts are resolved, keep an existing matching contact through the runner or
replace the malformed primary in the supported scoped editor when the address
is new to this profile. Save it with the confirmed name/removals once and verify
the full persisted result. A still-disabled Save gets one focused full-form
diagnostic; an actual backend rejection remains a concrete blocker, not success
or permission to guess another address or retry an uncertain write.

The same feature's `utils/buildCustomerUpdateParams.ts`,
`utils/buildFieldDiffs.ts`, `graphql/mutations/UpdateCustomerMutation.ts` and
`protobuf/customer/v1/services/customer.proto` establish a supported alternative:
`UpdateCustomer` takes `variables.input = {uuid, params}`; `params.emails` and
`params.phones` are arrays of **old/new deltas**, not replacement contact lists.
Unchanged names are omitted, not required or repaired by this contact update.
`buildCustomerUpdateParams.ts` also source-verifies scalar `params.firstName`
and `params.lastName`, submitted together when a name changes. The tested
planner/runner supports that exact combined name/contact delta only for an
explicitly confirmed pair; it never infers or chooses one. It omits Agent,
Vendor and communication-preference writes and verifies their saved state.
Use the registered OpsHub `call_operation` connector for this captured operation,
not an in-page fetch, hidden API, generic `edit_customer.fields` guess or direct
Admin request. Existing identity, authorization, destination and result guards
still apply; this is the authorized contact cleanup, not permission to bypass
an access restriction or retry an uncertain mutation.

Prefer this path for qualified consolidation, including a confirmed name pair,
before opening a known-invalid full editor. Also use it after one scoped editor
diagnostic establishes whole-form validation rather than repeating form edits:

1. Reuse a fresh, complete persisted profile read on the resolved surviving UUID,
   including primary/other emails and primary/other phones with each phone's
   **actual type**. Compact search results and an unsaved edited form are not
   sufficient. Use the existing documented profile connector when complete;
   otherwise read the saved profile through the authorized background browser,
   before changing any inputs. Do not invent a GetCustomer operation that is not
   in the executing connector's catalog. A just-opened editor can expose the
   saved contacts; an operator-owned unsaved draft must not be canceled or
   treated as persisted data. Reconcile any uncertain prior save before planning.
2. Load `scripts/contact_update_plan.js` once and evaluate its trusted expression
   locally; it returns pure `plan` and `verify` functions, not an executor.
   Pass `plan({customer, customerUuid, primaryEmail, callerPhone,
   identityVerified, cleanupAuthorized, contactsComplete})`. `customer` uses
   the source-verified CustomerDetail shape: `uuid`, `firstName`, `lastName`,
   `isAgent`, `primaryEmail: {address: {value}} | null`, `otherEmails`,
   `primaryPhoneNumber: {number: {value}, type} | null`, and
   `otherPhoneNumbers`. Both other-contact arrays are required, even if empty.
   Map complete evidence into this shape; never assert completeness or verified
   identity from an email selection. Phone types are HOME, MOBILE, OTHER or WORK.
3. For `ready`, use exactly the returned operation and variables once under
   the original cleanup authority and real runtime restrictions. Preserve an
   explicit draft-only limit. Remove deltas use the original email address or
   original phone **number + type**. Preserve the confirmed original caller
   phone and primary email. An identical displayed phone with a different type
   can be removed precisely; indistinguishable number/type tuples cannot be
   safely targeted and return a concrete ambiguity blocker. Never use a row
   index as an API identifier, strip all matches, or invent a phone type.
   The plan omits isAgent and all communication preferences, and omits names
   unless the exact pair is explicitly supplied and confirmed as above. With a
   changed confirmed pair it includes both scalar name fields in this same
   mutation; never silently drop the requested name edit or invent a payload.
4. `noop` means no write: verify the complete fresh read and proceed.
   `blocked` means inspect/report the precise missing evidence or unsupported
   target; do not improvise another payload or turn an unavailable name into
   a repeated caller question. A captured operation missing at runtime or an
   actual backend rejection remains a concrete blocker, not a success. If this
   contact-only capability is unavailable and the only form-validation blocker
   is an unknown name, apply the entry skill's authorized `Customer` / `Customer`
   fallback in the scoped editor and save the contact cleanup and that exact
   pair together. Never use it to resolve identity/contact-target ambiguity or
   retry an uncertain write. Prefer an available genuine personal name.
5. A mutation response is not contact verification. Read the complete saved
   profile once and require `verify(planResult, savedCustomer, true)` to return
   true: exact surviving UUID, desired sole primary contacts/type, the exact
   confirmed name pair (or unchanged names when none was supplied), and unchanged
   agent role. A dry-run preview is not a save receipt. On an uncertain
   response, reconcile persisted state before any retry; do not blindly repeat.
   Once verified, retain the receipt and continue the original authorized note
   exactly once under steps 7–8; do not reopen the verified Admin merge. The
   temporary-name editor path instead verifies the authorized `Customer` /
   `Customer` pair plus the complete saved contacts and preserved unrelated
   fields; do not pass it off as an unchanged-name contact-only result.

Tests: `node scripts/test_contact_update_plan.mjs` is provider-free. The probe
regression below also covers foreign submit buttons and full-form name errors.
All fixtures use synthetic data; no live merge, contact write or note post.

## Contact-editor targeting and same-run recovery

Load `scripts/contact_editor_probe.js` from this installed package once when
contact UI is actually required. It is a read-only function expression: evaluate
its exact trusted source through the selected browser's documented read tool
with the retained exact OpsHub customer URL as its argument. It returns
`editor-open` or `edit-ready` with an observed plain CSS selector; it checks the
customer route and scopes Edit to Customer Info without styling classes or
temporary DOM attributes. In the same orchestration call, assign the decoded
probe result to a variable and pass its exact `.selector` value directly to the
documented click tool; never retype, shorten or reconstruct the structural path,
or return to model reasoning between probe and click. If it reports
`editor-open`, skip the click. Follow with the bounded input-ready check and one
full contact read in that same call. A failed or ambiguous probe stops the batch.
The probe never clicks, saves, changes focus or authorizes an action.

When already open, the probe also returns every named visible field's `value`
and exact `selector`, checkbox/radio state, and `editor.controls` with observed
remove/primary selectors and pressed/enabled state. Reuse that same full-form
read to resolve the inspected contact rows and supported name changes; do not
request a second input/HTML inventory. A just-opened, unchanged editor can expose
saved values; an operator-owned unsaved draft cannot establish persisted state.

The probe returns `editor.form_selector`, the unique
form-associated `editor.save.selector` and ready/disabled/saving/missing/ambiguous
state, empty name fields, every visible form field's validity/associated error
text, and scoped errors. Inspect only this Save, never the page's first
`button[type="submit"]` or an unrelated form. Use its exact fresh selector for
a permitted save; `saving` requires persisted-state reconciliation, never another
Save click. Once the desired contacts/name are known, make the reviewed
removals/field changes sequentially in one guarded call, re-querying current rows
after removal. Read the resulting full fields and scoped Save readiness together
and save once immediately when valid. Do not return to general discovery or
pause on an already-ready editor. A disabled button alone does not establish why it is disabled:
check the whole editor, including first/last-name errors, an unchanged blank
surname and retained legacy email syntax, not just visible email/phone errors.
Use the supported delta path above for unchanged unknown names or an exact
confirmed name pair rather than hand the same edit back to the XA. Never label
the current edited form as persisted: reuse a complete pre-edit snapshot or
obtain a fresh saved read in the workflow's own background window. Do not cancel
operator-owned work or reopen Admin. Do not force-enable Save, invoke form handlers, fill
unapproved placeholder surnames or change contact formatting to provoke
validation. The exact `Customer` / `Customer` pair is permitted only under the
entry skill's rare, operator-authorized unknown-name fallback.

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
An existing standalone headless executable can be selected with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; this launches a new isolated test browser
and never attaches to an operator session.

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
- Use the page's ready/result state instead of fixed sleeps. Readiness waits return as soon as the target is ready; a timeout is a ceiling, never an instruction to pause after a successful check. Do not insert a sleep, status polling loop or extra discovery between a ready candidate and selection, a reviewed warning and submission, or valid cleanup fields and Save. Keep routine reasoning brief. Send the start, submission, verified-cleanup-stage, and completion statuses at their actual transitions, outside the note. If a stage lasts 30 seconds, report the current concrete blocker or pending check; never leave only `Account merge started` visible for minutes. Do not imply submission or completion before the corresponding action or verification.
- Do not repeat a successful check without new conflicting evidence. Exceeding 60 seconds does not permit omitting verification or leaving additional real duplicates unhandled.
