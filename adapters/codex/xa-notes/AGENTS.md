---
description: Always-on routing for XA post-call OpsHub notes
alwaysApply: true
---

# XA Post-Call Notes

Use `skills/xa-notes/SKILL.md` as the single source of truth for note format,
templates, standing wording, shorthand routing, escalation boundaries, and the
OpsHub posting workflow. The `.agents/skills/xa-notes/SKILL.md` file is only a
loader; never read it as the authoritative content. Outdated Cowork variants
are inactive: `xa-post-call-note`, `xa-quick`, and `xa-quick-slack`.

The compact warm-up contract is `skills/xa-notes/CORE.md`. Load it first on
warm-up. The authoritative full skill is the workspace file at
`/Users/sam.gutierrez@opendoor.com/Documents/ChatGPT Work/XA Post Call Notes/skills/xa-notes/SKILL.md`.
Do not substitute an installed or global copy. When loading it in bounded
chunks, retain the returned file contents in model context; a tool call that
only reports `loaded` does not satisfy the load.

## Fast path

For ordinary notes without `post`, use `N/A` for both `Property Address` and
`Follow Up Link` when the XA did not provide those values. Never leave either
field blank. Explicit posts use resolved caller/property values.

- On warm-up (`ready`, skill attachment, a path-only message, or a new chat
  with no call shorthand), silently load `skills/xa-notes/CORE.md` once if it
  is not already in context, then reply exactly: `Ready when you are.`
- If a note arrives before the full skill is loaded, silently load the full
  authoritative skill once in bounded chunks before drafting. Do not expose the
  loading step.
- After the authoritative skill is loaded, ordinary notes use no file tools,
  shell commands, web, or MCP. Do not reread, grep, search, or slice the skill.
- Ordinary notes use zero OpsHub calls except the skill's explicitly allowed
  silent listing-type check. Only an explicit `post` or `post it` permits the
  posting workflow.
- On an explicit post, follow Part 11 of the skill: use one parallel lookup
  batch, reuse `whoami` within the chat, then create the customer note. Keep
  tool turns silent and do not inspect schemas unless a call fails for that
  reason.
- Optimize for latency and token use: use the already-known OpsHub tool names
  directly, never enumerate or filter the tool catalog, and do not make
  exploratory or duplicate lookup calls. After the first post, reuse the
  cached operator token and only run the required property and caller lookups
  in parallel before creating the note.
- Never edit the skill during live note work. Skill edits require an explicit
  request and should be followed by a fresh chat and warm-up.

## Posting guardrails

- When creating an OpsHub note, send the five-field note as plain text only.
  Never include Markdown code fences, backticks, a `text` language label, or
  Markdown link syntax in the posted body. The fenced format is for the chat
  response only, not for the OpsHub payload.

## Browser safety

- Never navigate, type, click, or switch tabs in the user's active Chrome
  window. Browser MCP work must use a separate unfocused window, created with
  `new_tab: true`, `eget_vindue: true`, and `fokuser: false`.
- Never call `browser_switch_tab` with `bring_to_front: true` in this project.
  If an action cannot land without taking focus, stop and report the blocker;
  do not risk acting in the user's typing tab.
- Close the separate browser task window when the workflow is complete.

- Treat shorthand as shorthand. Apply the exact expansion-table wording from
  the authoritative skill before drafting; for example, `appraiser` plus
  `verified info` requires the appraiser row, including identity,
  participants, lockbox code, and appointment language.
- For an explicit post with a property, resolve the caller's OpsHub customer
  page and use the exact OpsHub property-page URL in `Follow Up Link`.
  Never substitute a customer-facing tour link, an internal address token, or
  `N/A` when the caller's page has the property.
- If the skill content is summarized, truncated, or not reliably visible,
  reload the exact authoritative sections before drafting. Do not reconstruct
  shorthand expansions or posting-link rules from memory.

## Context integrity

- Treat any truncated, partial, unavailable, or merely summarized authoritative
  skill read as not loaded. Do not infer missing templates, standing wording, or
  routing from memory.
- Reload the exact authoritative section in bounded chunks before drafting. If
  the exact content still cannot be retained, stop and tell the XA that context
  may be degraded and recommend starting a fresh chat with `ready`.
- A long chat is not, by itself, permission to improvise or a reason to alter
  the skill. Fresh-chat guidance is required only when exact instructions are
  not reliably available, after an explicit skill edit, or when the XA asks for
  it.
- When a correction reveals that the needed rule already exists in the
  authoritative skill, classify it as an agent execution/load failure and do
  not add a duplicate rule to the skill.

## Output boundary

For an ordinary note, return only the fenced five-field note. For warm-up,
return only `Ready when you are.` For an explicit post, follow the skill's
permitted short post-result line. Never produce Slack drafts in this project.
When the same website appears more than once in a note, list it only once.

## Personal wording

Keep these preferences when they do not conflict with the authoritative skill:

- English or Spanish; direct, conversational wording.
- Treat dictated full sentences as already written: preserve the stated
  problem and solution rather than replacing them with a generic template.
- On viewing calls mentioning `TOM` or temporarily off market, apply the
  existing Part 4 "When access is declined" wording, including that a viewing
  cannot be scheduled, even when the rest of the call summary is already
  written. Do not reduce it to the listing status alone.
- "They said they would post it" after an instruction to send something means
  the caller will send it; `post it` remains the OpsHub command.
- Use `support@opendoor.com` for listing-agreement submission.
- "Put the request in with our team" is first person.
- A mentioned Slack thread becomes "Continued the Slack thread on the
  property" only when that action is not already stated another way.
- Split long Solution Offered text into two sentences.
- Do not use “reach out” or “on this one.”
