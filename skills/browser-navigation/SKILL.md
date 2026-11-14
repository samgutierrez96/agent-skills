---
name: browser-navigation
description: Select the configured browser and record timings when a workflow actually needs live UI. Agent 360 is re-enabled for Skill Router; use sufficient direct connectors first. Does not initiate browsing for connector-only tasks.
---

# Browser navigation and timing

Sam explicitly re-enabled Agent 360 on November 12, 2026 after the native Chrome
test. In Skill Router, use the configured Agent 360 MCP browser for required UI
while the independent worker's native Chrome access remains unverified. Desktop
chats may use the connected native ChatGPT Chrome tools when available. This
supersedes the earlier same-day Agent 360 disablement, not the connector-first
rule. Do not replace sufficient OpsHub, Zendesk, Slack, Drive or other direct
connector reads, or add browsing to warm-ups and note-only tasks.

## Select once, preserve the workflow

- In the desktop environment, use `mcp__cua_repl` and the documented `cua`
  browser entry point. This desktop-only preference does not apply to Router
  app-server/CLI/SDK workers, even when they inherit desktop tool names.
  Read the returned API documentation; use only supported
  methods. Use the signed-in work profile, name the session, and retain bound
  browser/page handles. Use fresh state and page-scoped controls, including
  documented frame locators for nested iframes. Never carry numeric accessibility
  indices across state changes.
- Agent 360 (`browser-mcp`, tools under `mcp__browser_mcp__*`) is authorized
  again. For Router's required browser steps, use that configured connection
  and its returned tool schemas; retain bound task/window handles. Check its
  connection with read-only metadata before declaring it ready. Do not resume
  a saved task merely to test the connection. If it is unavailable, report the
  actual blocker. A desktop Chrome connection does not prove CLI, app-server
  or SDK workers have native access; never invent a native MCP endpoint. An
  empty top-level read is not proof of an empty iframe; use the selected
  surface's documented frame/page controls.
  For required Agent 360 work, read [references/agent360-execution.md](references/agent360-execution.md)
  and load its tested guard once alongside setup. Reuse it to batch routine
  steps and resolve uncertain background clicks with fresh read-only state,
  never automatic retries. Do not probe native Chrome first in Router.
- Existing project safety rules win: a separate background window remains a
  separate window, not merely a tab group. Use only documented window controls;
  if the native surface cannot satisfy this constraint, report the blocker.
  Do not raise Chrome or disturb the operator's active
  typing tab. Do not alter these constraints to make a timing result look better.
- Keep identity, evidence and action-authorization gates intact. Before switching
  surfaces after an uncertain mutation, inspect the actual outcome and retain
  receipts. Never repeat a completed action. Reuse authorization and confirmed
  facts already established by the owning workflow; a browser warning or an
  irreversible-action label does not by itself require another user confirmation.
  For the account-merge workflow, confirmed keeping email, original phone and
  qualifying identity carry the authorized merge, contact cleanup, verification
  and original authorized posting forward. Do not manufacture “Required browser
  approval” prompts or proceed/stop choices for those already-authorized steps.
  Pause only for a genuinely missing fact, conflicting identity or changed scope,
  failed step, actual access/capability/tool-policy restriction, or an unresolved
  action outcome. Honor real tool/runtime-enforced restrictions through supported
  mechanisms; never infer one from a page warning or evade it through another
  surface or hidden API. Benchmarking grants no permission to send, post, merge,
  book, delete, install extensions, export credentials or bypass safety controls.
- Batch deterministic actions with a fresh state check. Use condition-based
  waits, not sleeps. The native browser's evaluation API is read-only: do not
  port Agent 360's scripted DOM clicks, temporary DOM attributes, form submission,
  cookies or authenticated fetch tricks. Use supported locator/UI actions.
- Preserve user tabs. Clean up only agent-created task tabs/windows according
  to the surface's documented lifecycle; keep a handoff only when necessary.

## Time real work without adding work

For browser tasks, capture timestamps in the existing orchestration calls, then
record one local timing entry at completion or a blocker. Do not inspect tabs,
customer records or tool catalogs just to produce telemetry. Logging failure
must not block the real task, change its output contract or imply task success.
Keep routine timing details out of customer-facing notes and ordinary outputs.

Read [references/timing.md](references/timing.md) for the timer commands, fair
paired comparisons and privacy limits. The script is
`scripts/browser_timing.py`; tests use synthetic data only.

## Ownership and installation

Canonical distribution: `samgutierrez96/agent-skills`,
`skills/browser-navigation/`. Install the complete folder at
`~/.codex/skills/browser-navigation/`. The global Codex AGENTS rule routes all
projects here; explicit project browser passages must agree. Do not patch
vendor/plugin caches, archived transfers or scheduled customer-case snapshots.
Save canonical and installed files locally immediately; use the existing
7 p.m. America/New_York GitHub sync for publication.
