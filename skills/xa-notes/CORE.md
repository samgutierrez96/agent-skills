---
name: xa-notes-core
description: Compact warm-up and routing contract for XA post-call notes.
---

# XA Notes — compact warm-up contract

The complete note workflow, templates, standing wording, shorthand index, and
OpsHub posting procedure remain authoritative in `skills/xa-notes/SKILL.md`.
This file is the warm-up entry. Load it and the complete full skill during
preparation, before replying Ready; the first caller must reuse that loaded skill.

## Output contract

- Warm-up (`ready`, skill attachment, path-only message, or a new chat with no
  call shorthand): load the complete authoritative skill first, then reply exactly
  `Ready when you are.` Preparation uses file reads only, with no OpsHub actions.
- A routine note is only one fenced five-field note, in fixed order:
  `Property Address`, `Reason for Call`, `Customer Concerns`, `Solution
  Offered`, `Follow Up Link`.
- Put each label and its content on the same line, with one blank line between
  fields. Use `N/A` for missing address or follow-up-link values on ordinary
  notes.
- Do not add explanations, Slack drafts, tool notices, or routing commentary.

## Fast routing

- Treat each new named caller as a new call. A follow-up with no caller keeps
  the prior caller and updates the prior note.
- Match shorthand against the full skill's index and use its exact template or
  standing wording. Already-written prose stays prose; do not replace it with
  a generic template.
- Cover every distinct ask, but do not turn scheduling context into a second
  call type.
- Do not invent facts, escalations, contacts, URLs, or future actions.

## Tool boundary

- Ordinary notes use zero tools, except the full skill's explicitly allowed
  silent listing-type check.
- Only explicit `post` or `post it` authorizes OpsHub lookup and posting.
- On a post, use the caller's customer page, not merely the property owner;
  use one parallel lookup batch, reuse `whoami`, then create the note.
- Use known OpsHub tools directly. Do not enumerate tools, inspect schemas
  preemptively, browse, or search files.

## Loading rule

A full source-text attachment of the authoritative skill satisfies loading; reuse it
without rereading CORE or SKILL.md. Otherwise load this core and all of
`skills/xa-notes/SKILL.md` on warm-up, in bounded
chunks that retain the full contents without truncation. Do not reply Ready
after loading only CORE. Reuse the full skill for the first note and later
notes in the same chat. If a note arrives without preparation, load the full
skill before drafting. If exact content is unavailable or truncated, reload
the needed authoritative section before drafting.
