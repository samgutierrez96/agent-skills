---
description: Always-on rules for XA escalation OpsHub notes + Slack messages
alwaysApply: true
---

# Escalations — project rules

Keep these gates in every chat. The single hot-path source is
`.agents/skills/xa-quick-slack/SKILL.md`. If it is not already in this chat, the
first action is **only** reading that file: no other tools, no chat text.

**Do not use `escalations-brain.md`.** Retired 2026-09-24. Routing and phrasing
live in the skill. Never open the Cowork brain or a global skill copy.

Follow the compact runtime skill for the complete note format, routing, tool
path, lookup budget, workflow forms, thread handling, and output contract.
Warm-up remains exactly `Ready when you are.` Escalated calls only; redirect
non-escalated notes to `xa-post-call-notes`. Before a new property escalation, apply the skill’s existing-issue thread
check and reuse a clear matching discussion, even outside the default
destination channel; the XA need not say “continue the thread.”
Never auto-send Slack, never claim
a draft without `draft_id`, and use only verified links in `Follow Up Link`.
For any supplied property address, resolve and verify the OpsHub property URL
before drafting; a missing property URL is a hard stop. Use Slack and OpsHub
MCPs for the named-target path. Never use browser/native Slack UI automation to
compose, paste Markdown into, edit, or repair a Slack draft. Do not narrate
routine tool work or reread/edit the skill during a live ticket.
For `post it`, use the OpsHub MCP CONTACT mutation and treat a successful note
ID as confirmation; do not open the browser just to verify the note.

Slack draft property addresses must be Markdown hyperlinks
`[Full address](verified-property-url)`, with no @ before the address. Reserve
@ mention syntax for people and groups. Keep the skill's two-line layout.
