# Browser comparison protocol

## Measurements

- `browser_ms`: sum of measured browser orchestration blocks, including tool
  round trips and readiness/verification within those blocks. Start a monotonic
  timer immediately before the first browser operation in a block and stop after
  its verified result or failure, using `performance.now()` when available.
  Record `clock=monotonic`. If the orchestrator exposes only `Date.now()`, record
  `clock=wall`, reject a negative/clock-jump interval, and disclose its resolution
  limitation; do not mix clock types in a matched comparison. Unknown clocks
  cannot establish a directional signal.
  Return only the timing and minimal verification facts. Do not include logging
  or narrating results. A single browser block is not a full workflow benchmark.
- `workflow_ms`: optional stopwatch duration from the first workflow lookup to
  the verified final state or blocker, including reasoning, connectors and
  retries. Use `begin` and `finish` below. This is distinct from `browser_ms`.
- Record tool-call count, retry count, success/failed/blocked, cache state and
  fallback reason. Record only observed values; missing timing remains missing.
  User wait is recorded separately and subtracted only from workflow time.
  Do not subtract normal network/loading time. Do not estimate token usage.

## Safe comparisons

Sam re-enabled Agent 360 on November 12, 2026. Record normal observations under
the browser actually used. Re-enablement does not authorize replaying customer
mutations or running an unsolicited comparison; the paired protocol below is
for separately authorized, matched read-only checks.

Use an authorized public or synthetic read-only task for deliberate A/B runs,
or an explicitly authorized internal read-only check. Do not choose a customer
case from open tabs or replay a mutation. Both surfaces must verify the same
visible result with the same start state, profile, runtime and task scope.
Do not run the two surfaces concurrently on a shared page.

Use a new random 16-hex `pair` for each matched pair. Alternate which backend
goes first across pairs (`order` 1 then 2); don't clear cookies/cache or log out
to simulate cold runs. `cold` means first use of that browser connection in the
runtime, `warm` means reused connection, `unknown` means not established. Page
network cache can still vary; record environment limitations when reporting.

The summary matches only two-entry, opposite-backend pairs with identical
runtime/project/site/scenario/cache/clock and distinct orders. It excludes duplicates,
incomplete pairs and mismatched cases from speed comparisons, while retaining
all attempts in outcome totals. It reports all valid paired outcomes and only
compares timings when both attempts succeeded. At least five successful warm
pairs with balanced starting order are needed for a directional signal; that is
still not proof about OpsHub/Admin or full workflow speed. Never extrapolate a
public-page smoke test into a customer-workflow guarantee. Include failures and
fallbacks in any recommendation; do not compare only the fastest successes.

Normal authorized browser work uses `mode=normal` without a pair and without a
second run. It provides observational reliability/timing, not controlled A/B
evidence. Report browser and workflow comparisons separately. Keep the preferred
default until evidence and capability coverage justify a user-requested change.

## Commands

Run from the installed skill directory, or use the script's absolute path.

```sh
python3 scripts/browser_timing.py pair
python3 scripts/browser_timing.py begin
```

Retain the random pair ID or stopwatch token returned by these commands. After
a measured browser block, record only metadata and numbers (example synthetic):

```sh
python3 scripts/browser_timing.py record --backend native --runtime desktop \
  --project other --site example --scenario public-smoke --mode benchmark \
  --pair 0123456789abcdef --order 1 --cache warm --clock monotonic \
  --browser-ms 1250 --calls 2 --retries 0 --status success
```

For an authorized paired comparison, use the other backend (`agent360`), same pair ID and `order=2` for its matched
attempt. Change the first backend on the next pair. A real workflow can use
`finish TOKEN` with the same metadata flags instead of `record`; the stopwatch
adds `workflow_ms`. `--user-wait-ms` defaults to zero and cannot exceed the
workflow duration. An unavailable surface can be recorded with `status=blocked`,
no `--browser-ms`, zero calls and `--fallback unavailable`; do not fabricate zero
latency. Record a fallback attempt separately under its actual backend.

```sh
python3 scripts/browser_timing.py summary
```

## Private local storage

Default: `~/.codex/browser-benchmarks/`, outside project repositories, with private
directory/file permissions. `--data-dir` can select an isolated test directory.
The logger accepts fixed metadata enums and random IDs, not free-text notes,
URLs, addresses, phone numbers, emails, customer/case IDs, tool arguments, page
content, screenshots, cookies or tokens. No network transmission. Never commit
timing logs or stopwatch state. Tests and published examples must be synthetic.
Log only after the scoped task and retain its normal output/confirmation rules.
