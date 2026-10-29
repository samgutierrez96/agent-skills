---
name: agent-verification
description: Review an Alfred agent-verification task, verify the agent record, apply the supported outcome, and close the case.
---

# Agent Verification

Resolve the matching OpsHub customer, check live agent credentials, and close the matching Alfred review. Target **under 120 seconds** for an authenticated, exact-match run. Preserve identity checks and verify saved results; do not trade correctness for the timer.

## Outcome and wording

- An exact matching **High confidence · 100** result is preauthorized for **Allow + Verified**. Do not ask for confirmation. An older denial alone does not override this result.
- A score is meaningful only for the matching customer's identifiers. Missing, ambiguous, below-100, or materially inconsistent live results require operator review; do not guess.
- For Allow/Verified, Alfred's “Why is this user trustworthy?” must contain only **Confirmed and verified**.
- OpsHub notes are permitted. For Allow/Verified, use only **Confirmed and verified** unless the operator requests more detail. Add relevant, evidence-based red flags only when final HAS is **Deny**. Do not copy historical flags forward as current findings without supporting evidence.
- Agent credential verification does not establish that government ID validation passed. Do not claim checks that were not performed.
- Never reuse a prior customer's identifiers, case ID, or outcome. Cache only the current run's resolved values.

## Direct entry points

- OpsHub: `https://opshub.apps.opendoor.com`
- Customer detail: `https://opshub.apps.opendoor.com/customers/{resolved_customer_uuid}`
- Alfred queue: `https://alfred.ops.opendoor.com/user-reviews`
- Agent Verification: `https://script.google.com/a/macros/opendoor.com/s/AKfycbzaafxsysN1kOUwV5TXde9U3b53HVKpu7nfAjtTM64LsuHpXynNkOcX5sdI9H8-D1e6oA/exec`

These entry points remove the need to search local files, company knowledge, or the web for navigation on every run. If an entry point fails, use current visible navigation; do not iterate guessed hosts or routes. Obtain case-detail and Full Results URLs from the current UI links rather than guessing IDs.

## One-pass execution

### 1. Resolve once (budget: 0–20 seconds)

- Prefer OpsHub `list_customers` with the supplied exact phone or email. Select the exact matching record and cache its UUID, name, phone, and email. Do not select a similarly named person.
- Use a customer-detail MCP read only if it supports that resolved identifier and returns the needed agent fields. `get_customer` previously interpreted a customer UUID as a lead token and failed: do not repeat that call with a UUID unless its contract is corrected. `get_customer_profile(full=true)` previously returned a large activity history, not the needed agent fields: do not use it for this lookup.
- Open or reuse the exact OpsHub customer-detail page. Read **Customer Info** and **Agent Info** once for MLS ID, license number, and current statuses; cache the returned identifiers. Avoid expanding communications, activity history, or AI summaries to retrieve agent data.

### 2. Prepare the case (budget: 20–50 seconds)

- Open or reuse Alfred User Reviews and refresh once. Check the current queue for the matching open Requires Verification Review, including remaining pages when needed; do not create a duplicate just because the first page lacks it.
- If no matching open case exists, select **+ New Case**. Search the exact phone or email, select the result matching the cached customer, set **Requires Verification Review**, and select **Create** once. Wait for the dialog to disappear before any retry. Newly created cases may appear on the last queue page.
- Select the matching case, choose **Claim and Begin** if unclaimed, and open **Review Case**. Cache its case ID/link. If the link opens a new tab, bind that tab; do not keep clicking the original link. When a popup does not open, navigate to the actual href read from the link.
- Open **View Full Results** and read the available identity evidence once. Missing Mitek results mean ID validation was not established; they do not alone negate a matching agent credential result.

### 3. Run the live lookup (budget: 50–80 seconds)

- Use Computer Use (`cua_repl`) for Agent Verification from the start. Its form and results are inside nested iframes; a blank top-level page-content response is not an empty app. Inspect the accessibility tree, or documented frame-scoped locators, instead of repeatedly reading the top-level document.
- Populate only cached, current OpsHub identifiers using **LAST NAME**, **FIRST NAME**, **MLS ID**, **LICENSE NUMBER**, **PHONE**, **EMAIL**. Leave unavailable fields blank. Batch the known field fills and one **Search** click in one tool call, followed by a state read.
- Wait for a result state rather than clicking Search again while “querying Snowflake” is shown. Read the matching candidate's tier, score, and identifier matches. A large result count can include weak first-name matches; assess the exact matching candidate, not the total count. Multiple rows for the same agent across MLS sources are not by themselves conflicting identities.
- Matching High confidence · 100 proceeds immediately to closure. Surface an actual live mismatch for review.

### 4. Close and verify (budget: 80–110 seconds)

- Return directly to the cached Alfred case. Select **Close case**, then **Yes** for “Can this user be trusted?” for the supported Allow/Verified outcome. Verify the dialog shows home access **Allow** and agent verification **Verified**. Do not select Deny or More information needed based only on an older denial.
- Enter only **Confirmed and verified** in “Why is this user trustworthy?”, then submit **Close case** once. Verify **Case Closed**; a disabled submit button while saving is not completion and is not a reason to resubmit.
- For a reviewed Deny outcome, use the appropriate denial fields and concise supporting evidence instead of the success wording.
- Reload the cached OpsHub record once. Verify the actual saved home-access and agent-verification statuses in Customer Info/Agent Info. If adding an OpsHub note, save the concise permitted wording once and verify the note appears. Do not add a duplicate note or a long template.

### 5. Finish (budget: 110–120 seconds)

Report only the verified result: `Case: closed | Outcome: [actual HAS] | Agent: [actual status] | Confidence: [tier and score]`. Mention a saved OpsHub note if added. Report a concrete blocker when closure or statuses cannot be verified. Never claim completion based only on a click.

## Browser execution rules that prevent stalls

- Give one short starting update, then surface only meaningful mismatches, blockers, or delays. Use masked identifiers in chat. If work exceeds 60 seconds, give a brief update about what remains.
- Prefer one browser-control surface for the UI workflow: `cua_repl` in Chrome, including Alfred and OpsHub. Reuse tab bindings. List tabs once when needed; do not create duplicates or repeatedly initialize the browser tools.
- Use semantic labels or current accessibility indices. After actions, read fresh state before selecting the next dependent control. Batch deterministic actions on already-observed controls and the resulting state read; do not batch clicks that depend on a new dialog or menu you have not observed.
- Prefer a targeted section or accessibility diff over full HTML/full activity dumps. Do not print tool catalogs or repeated shared tool instructions: discover exact tool names and only the needed schema.
- Use condition-based waits supported by the browser, such as a dialog disappearing, a result heading appearing, or Case Closed becoming visible. No fixed sleeps. When the page is still loading, wait for that specific transition instead of taking repeated identical full-page snapshots.
- If Browser MCP is used and input reports it did not land because the tab is inactive, switch to the intended tab before retrying. Check “maybe landed” actions before repeating; a stale immediate read does not prove a failed mutation. Do not cycle through failing clicks in the background.
- If an iframe cannot be read by a top-level browser tool, switch immediately to Computer Use accessibility or documented frame locators. Do not spend several calls proving the top-level content is blank.
- Do not reopen completed stages or reread a verified fact through multiple surfaces. After Case Closed and the refreshed OpsHub statuses are established, finish.
- Stay within the authorized verification workflow. Unexpected destructive or unrelated irreversible actions require explicit authorization.

## Operator corrections and source ownership

An operator correction or performance review is not a new live customer task.
Apply a current-output correction without repeating completed actions. Explain
delay or token concerns from the saved trace/context; do not rerun customer
lookups merely to discuss performance. Recommendations alone do not change the
skill.

Save a requested reusable correction in the existing owning passage of this
authoritative skill, or an existing registered agent configuration only when that
agent actually owns the behavior. Read related rules first. Amend superseded
wording instead of adding a conflicting rule. If already covered, apply the
existing rule and cite its exact passage; do not add a duplicate for an execution
failure. Keep customer identifiers and case-specific outcomes out of instructions.
Never create a parallel Skill Router rules file.

Verify saved content and report the exact path. Keep required canonical local
copies consistent through the established source inventory. Conflicting copies,
uncertain ownership or unavailable validation block a verified-save claim; use
Skill Router's direct-source reviewed save flow or report the specific blocker.
Local save and scheduled GitHub publication are separate. Updated instructions
need current context; never replay a merge, case closure, post or other external
action to refresh it.

## Timing and validation

Record elapsed wall time from first lookup to verified final state when executing a real case. Aim for the stage budgets above, adjusting for actual network latency. At 90 seconds, complete closure and final checks without optional history exploration. At 120 seconds, if still incomplete, report the concrete delayed stage and continue useful work; do not skip checks or claim success to meet the target.

This is a performance target, not a measured guarantee. Login, unavailable services, nonmatching results, and required operator review can exceed it. Validate future runs with their actual elapsed times; never create or modify an extra live customer case merely to benchmark the skill.
