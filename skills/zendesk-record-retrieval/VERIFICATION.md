# Zendesk — end-to-end speed and quality check

## Acceptance target

Under 25 seconds from the operator submitting a ticket request until the complete
customer reply AND complete internal note are available in their separate copy
boxes. Include skill loading, discovery, connector waits, retries and generation.
A fast first token or first box alone does not pass. Required no-send dispositions
still count only after their complete internal note is available.

Measure fresh-chat first drafts and same-ticket follow-ups separately. Also label
Router runs separately from direct host chats; do not compare one as proof of the
other. A fresh chat is not proof of a cold provider process: record process/cache
state only if observable. Do not introduce automatic warm-up requests.

## Representative checks

Run read-only drafting only, on verified records or fixed operator-confirmed
fixtures. Do not send, close, post or change records. Keep real customer data out
of shared measurement reports. Reuse the same cases before/after where available:

1. No-reply: explicit STOP and unsolicited marketing, plus a genuine partnership
   inquiry containing an unsubscribe footer. Only true no-reply cases may shortcut.
2. Simple rental question: correct rental-report URL; no unnecessary access question.
3. Rental/access follow-up: existing incident, belongings or move-in claim; retain
   required customer/activity and Slack evidence; no invented access or outcome.
4. Assessment contradiction: empty/stale endpoint versus verified Complete/task
   evidence; separate photo proof from completion and use the right product name.
5. Offer status: match requester/lead/property, Flags and current stage; no restricted
   amounts, false final-offer presentation, or calculated calendar-date window.
6. Same-ticket follow-up: latest inbound verified when requested; reuse valid known
   facts without reloading recipes or confusing customer/property identifiers.

For every case check factual support, current recipe, disclosure/access rules,
exact standing wording/macros when required, channel voice, and two valid non-empty
copy boxes. The note contains no ticket number or drafting commentary. A timing
pass with a quality failure is a failed case. Heading-presence checks do not prove
answer quality; uncertain checks remain Not verified pending operator confirmation.

## Resolution-scope decision checks

Resolution-scope regression cases (use synthetic frozen evidence, not live writes):

- Missing spouse/co-owner listing-agent identity plus a later automated visit
  confirmation: ask for the agent's missing full name/email, not a visit recap.
- Follow-up on an emailed offer for a sold home plus later generic submission
  instructions: reply with the verified sold/unavailable status; no false close.
- Same-property offer concern explicitly answered after the inbound, with no
  newer ask: retain the no-reply/close disposition rather than answering twice.

Supply the snapshot and current required source material without the expected
decision in the model prompt. Check the two boxes and decision separately from
channel formatting. These checks test decisions from supplied evidence, not live
record retrieval, tool coverage or end-to-end timing. The three decision cases
passed after the October 27 resolution-scope update; real-case parity remains a
separate observation. Do not reuse an answered ticket as proof of its earlier draft.

## Record only available measurements

For each run record case label, host/path, package revision or file hashes,
new-chat/follow-up, observable process/cache state, start and full completion
timestamps, elapsed seconds, connector/retry rounds and quality outcome. Capture
actual input/output/cached token usage from the provider when exposed. Distinguish
cached tokens from newly processed input; do not double-count a provider's totals.
If usage is unavailable, record Not verified. Characters/4 is only an estimate
for that text fragment, never the total request cost. Include tool schemas,
instructions, ticket/comment bodies and tool results when provider usage does.

Report individual results and sample count. With repeated comparable runs, report
median and slowest; do not imply a reliable percentile from a tiny sample.
Timeouts, incomplete drafts, missing timing and failed quality checks cannot count
as passes. Label unavailable checks Not verified; do not replace them with local
routing benchmarks. Isolate latency by observable stages before naming a cause.

## Current status

### October 22, 2026 — direct-project utility/appraisal workflow

The operator reported approximately two minutes for the completed ticket workflow,
including an unsent Slack draft. This is operator-reported approximate timing,
not an instrumented measurement. A focused appraisal-utilities recipe and compact
tool-discovery/output rules were then added to reduce unnecessary context and
browser detours. Relative token savings and under-one-minute end-to-end latency
remain **Not verified** until comparable fresh-chat runs include both copy boxes,
required evidence, draft-ID confirmation and destination opening. Do not create
another real Slack draft solely to benchmark the already completed ticket.

Direct-project draft latency, operator-confirmed semantic quality and other-host
execution remain **Not verified**. File checks verify packaging, preserved text
and reachable routes only.

### October 21, 2026 — existing Skill Router, one assessment case

- Client submission through full response: **77.823 seconds — failed target**.
  Server routing: 7.8 ms; preparation: 3.9 ms; execution: 77,793.4 ms.
- Two non-empty copy boxes were returned, but an appendix preceded the customer
  reply. **Failed output contract.** The draft also asserted no completed
  assessment from narrow empty/false evidence without resolving the required
  property-page evidence. Factual quality did not pass.
- Raw SDK usage: inputTokens 573,233; cacheReadTokens 532,635; outputTokens 5,841;
  reported totalTokens 1,111,709. The total adds the cache fields separately;
  billable/unique token semantics are **Not verified**. Handoff-only estimate:
  2,390 tokens. Do not treat it as total run usage.
- Zendesk MCP returned HTTP 401; the run fell back to indexed ticket evidence.
  Session recapture did not complete despite a signed-in browser page. Remaining
  representative cases were not run while this prerequisite was unresolved.
- This was one request in a newly started local Router process, not a proven
  cold provider run. The Router selects main-playbook sections and does not
  explicitly follow the new index or load the bundled project rules. Its output
  validator accepts non-empty Zendesk text. This result does not establish the
  performance of the updated direct-project path.

No customer messages or record changes were requested. Temporary benchmark and
capture processes were stopped after the response. No sub-25-second acceptance
claim is supported by this run.

### October 22, 2026 — ten-chat direct-project baseline and approved changes

Approved in the efficiency-review chat: items 1, 2 and 5. Item 4 was subsequently
put on hold pending the numbers; item 3 is not approved. No instruction-conflict
cleanup, general startup trimming, model change or Router change was applied.

Baseline source: read_thread summaries for ten recent relevant local Zendesk chats,
reviewed with permission. Values below are recorded first-turn durationMs / 1000;
skill-edit and follow-up turns are excluded. They are **Verified recorded turn
durations**, not independently measured client submission-to-both-box timestamps.
The reader truncated some tool bodies; commands, tool names/durations, final drafts
and operator corrections were available. These chats span evolving skill revisions,
so do not attribute all differences to this change or claim a controlled experiment.

| Chat title | Recorded first turn (seconds) | Source chat ID |
|---|---:|---|
| Retrieve ticket 5118494 | 70.220 | 01a16556-bb23-7421-8feb-4344fde8739f |
| Retrieve ticket 5118343 | 87.506 | 01a1654e-9f75-7aa1-b95a-400dfa3cecb7 |
| Retrieve ticket 5118388 | 55.216 | 01a16553-9252-7953-8d73-d02d73ab6e90 |
| Retrieve ticket 5118321 | 66.767 | 01a1654e-03eb-7452-903e-d288745c9c18 |
| Retrieve Zendesk ticket 5118406 | 51.336 | 01a16553-bc8b-7343-8a87-504725694e60 |
| Retrieve ticket 5118015 | 138.945 | 01a16543-216b-70a0-bc04-657b1fdaf677 |
| Review ticket 5117924 | 54.059 | 01a1651d-eb2b-7d30-b18a-ee39c88fbe82 |
| Retrieve ticket 5117804 | 29.810 | 01a16543-431c-7b00-8a2c-c592f4c6887c |
| Retrieve ticket 5117975 | 32.134 | 01a1652a-88bb-7792-9607-3ff9f42d6365 |
| Retrieve ticket 5117989 | 14.743 | 01a1652a-b14e-7f61-b64e-4c356d258a8d |

- Median: **54.6375 seconds**; range: **14.743–138.945 seconds**; n=10.
- One of ten recorded first turns was below 25 seconds. Its complete quality
  acceptance is **Not verified**, so this is not a sub-25-second acceptance pass.
- The 138.945-second case includes an unsent Slack draft and destination opening.
  Excluding it, median **54.059 seconds**, n=9.
- At least four first responses had explicit corrective follow-ups: agent
  verification, missing offer URL, under-contract viewing, missed resolved access.
  Do not count uncorrected drafts as operator-confirmed passes.
- Actual provider input/output/cached tokens, billing semantics and total cost:
  **Not verified**. Do not substitute file characters or summed MCP duration.
- Exact historical package hashes: **Not verified**; files changed during the chats.

Applied baseline for future comparisons: after the approved edits, October 22,
2026, at 16:56:35 America/New_York (20:56:35 UTC). SHA-256 digest of sorted
AGENTS.md plus skills/zendesk-record-retrieval/**/*.md, excluding this measurement
file, with each relative path + NUL + bytes + NUL:
`801fffccb9b7088acf395b2d63e5ad25cc288c7c42b6028846a6f5a327a4fe8a`.
Digest identifies the instruction set; it is not an end-to-end quality check.

**Completed local verification:** all changed-file local links/heading anchors
resolve; nine required exact playbook headings are unique and extract non-empty
sections; AGENTS.md business/voice content after the tool map is unchanged; the
full playbook, PROJECT.md and ENTRY.md are unchanged (item 4 held).
This verifies routing/package preservation only. Fresh-ticket speed, semantic
quality and provider token savings after the changes remain **Not verified**.

#### Comparable before/after cases

Reuse fixed, redacted operator-confirmed fixtures or verified records read-only.
Keep new first drafts separate from same-ticket follow-ups and Slack workflows.
For each case record the source revision/hash, available full-completion timing,
tool/lookup rounds, exposed provider usage, two-box output and semantic result.

1. **Agent credentials missing:** agent already supplied name, brokerage and
   verified phone; request only MLS sign-in number, license number and email.
   MLS listing area stays optional; no passwords, confirmed appointment or code.
   Verify same-concern resolution and listing stage before access guidance.
2. **Backup-offer submission:** use a synthetic listing fixture with an active
   offer. Instruct the agent to email homes@opendoor.com under the October 30
   exception. A normal agent submission without an active offer uses
   opendoor.com/makeoffer and address-entry/submission steps. No viewing or
   scheduling referral while under contract. Preserve required resolution checks.
   Also check a buyer encountering a traditional listing at /buy or /homes:
   follow its email-to-homes@opendoor.com or licensed-agent instructions.
3. **Condition/wiring unavailable:** exact property identified, no supported
   wiring fact. Stop after the permitted exact-page lookup; no unrelated listing,
   repeated search or shell fetch workaround. Give the inspection option and gap.
4. **Resale offers:** matching resale record supplies numActiveOffers = 0.
   State the verified requested fact; a missing/failed field is not zero.
   Keep internal acquisition offers distinct and do not volunteer price.
5. **Wrong-business request:** newest message is bookkeeping, old subject is a
   listing. Answer the newest intent without property/trust research. A separate
   support/privacy/partnership ask must not be swallowed by this shortcut.
6. **Resolved appraisal access:** later same-property call resolved the concern.
   Stop with no-reply disposition and internal note naming the verified handler.
   Do not request a replacement appointment or skip this check to save time.
7. **Fresh missing-address request and same-ticket follow-up:** separate timing
   groups; no prior identifiers carried between tickets, and newest inbound is
   verified when checking a reply.

These are acceptance scenarios, not recorded executions or quality passes.
A faster first box alone does not pass. Do not create real Slack drafts solely
for a benchmark. A passive monitor may observe actual authorized workflows.

#### Passive monitoring agreement

Review only new relevant Zendesk drafting chats after the applied baseline;
exclude this audit, skill edits and unrelated chats. Deduplicate by chat and turn
ID, retain the exact instruction revision when observable, and use recorded turn
durations only with their stated limitation. Collect the next ten comparable
first drafts; list browser-required cases and Slack workflows separately. Compare
medians, ranges, lookup rounds, visible corrective feedback and exposed token use.
No correction does not prove correctness. A naturally occurring sample supports
an observational comparison, not a causal speedup claim.

Stay quiet with no new evidence or an incomplete non-actionable sample. Report
when ten comparable first drafts are available, a clear regression/quality issue
appears, or evidence access fails and needs the operator. Do not silently edit
business rules, apply held item 4, contact customers or create escalations.
After the sample is reported, finish the monitor. Any unavailable timing, token
or quality check remains **Not verified**.

### October 22, 2026 — item 4 authorization clarified and applied

Sam clarified that item **3**, not item 4, is deferred. Approved/applied scope is
now **1, 2, 4 and 5**. The earlier held-item statements above describe the prior
revision only; this entry supersedes their current approval status. General
instruction trimming (item 3) remains untouched.

Item 4 synchronized agent submission guidance to the already approved
`https://www.opendoor.com/make-offer` plus address-entry/submission steps; reconciled
unsent Slack preparation with the prohibition on sending and OpsHub writes;
preserved recent same-concern resolution checks and browser fallback for missing
required notes/Home Visits; and replaced unbounded full-playbook remainder reads
with labeled chunks capped at 200 lines and 12,000 characters. Existing stage,
trust, identity, privacy, macro, output and escalation restrictions remain required.

Use **17:00:36 America/New_York / 21:00:36 UTC, October 22, 2026** as the monitor's
new cutoff for the complete applied instruction set. Do not pool earlier post-edit
drafts with this revision. Digest using the same method as above:
`5f7fda918aa802949472e7da3a230063b5e83cc14c0e1024d4f90b2014a33279`.
The pre-change ten-chat baseline and nine-case non-Slack comparison remain unchanged.

Local checks completed: Git whitespace check, local reference links, removal of
the obsolete active agent URL and unbounded remainder instructions, and retained
warm-up/two-box, agent-field, trust, stage, product-name and timing wording.
These are file consistency checks. Post-change speed, semantic quality and actual
provider token savings remain **Not verified** until comparable drafts are observed.
The monitor remains read-only and may not apply any further changes automatically.
