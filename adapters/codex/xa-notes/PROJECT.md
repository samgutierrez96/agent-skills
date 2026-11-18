# XA Post-Call Notes (Codex)

## Purpose

Turn an Experience Advocate's rough call shorthand into a finished, copy-paste-ready **OpsHub** post-call note (five fields). Notes only — never Slack drafts, channel suggestions, or escalation messages.

## Active skill

| Skill | Status |
|-------|--------|
| **`xa-notes`** | **Active** — use this for every note |
| `xa-post-call-note` | Outdated (old Cowork folder) |
| `xa-quick` | Outdated |
| `xa-quick-slack` | Outdated — escalations live elsewhere; do not invoke here |

Do **not** convert Escalations or Zendesk workflows in this folder yet.

## How to use in Codex

Ordinary notes stay in **one chat per shift**. A new chat is for after you
**edit the skill** (so later notes are not mixed with that edit work), not for
each call.

1. Open this folder: `Documents/ChatGPT Work/XA Post Call Notes/`
2. Start a chat in the project (or keep the shift chat if you did not just edit the skill)
3. At the start of a shift, `@skills/xa-notes` **once**, or send `ready`. That is warm-up, not a note — expect only `Ready when you are.` (the complete authoritative skill must be available before Ready; an exact full-source attachment already satisfies preparation)
4. Then paste shorthand only (rough bullets with no instruction still mean a formatted note). Do not re-@ every note.
5. Paste the fenced five-field reply into OpsHub, **or** send `post` / `post
   it` after the fence (or in the same paste). `post` alone is fine when the
   street was already in the last message. The note is written on the
   **caller’s** customer page (agent, appraiser, inspector, seller — whoever
   called), never the property page and never another contact on the file.
   If you paste the caller’s phone, email, or name, that is who gets the
   note. The street fills Property Address and the property URL; it does not
   pick the customer when a different caller type called. If the match is
   ambiguous, it asks instead of posting. Ordinary pastes with no `post`
   stay zero-tools — an address in the bullets is not enough to look
   anything up.

Warm-up (`ready`, or attaching/`@`ing the skill / pasting `SKILL.md` with no call shorthand) → reply exactly: `Ready when you are.` No skill summary.

## Speed

Warm up once with the complete `skills/xa-notes/SKILL.md`, then reuse it for
later notes and posts in that chat. If exact full source is already attached,
do not read it again. Otherwise load the full skill in bounded chunks before
Ready; do not defer preparation to the first caller or also read CORE.
`skills/xa-notes/CORE.md` is only an optional compatibility summary.
After a skill edit, start a fresh chat and warm up again without replaying
completed actions. Preserve the full skill's listing-type and report-link
lookup exceptions and explicit-post safeguards.

The configured Skill Router registry selects this same full skill and uses
this project's `AGENTS.md`; the legacy Cursor loader is not its note entry.
This describes the inspected source configuration, not proof that a currently
running worker has refreshed its instructions. Do not restart active work merely
to measure a change.

Timing review is maintenance-only: see `tests/latency-log.md`. Do not load that
file, run diagnostics, or make extra lookups during routine calls.

## Validation

The first golden test set lives in `tests/golden_cases.json`. Validate the
fixtures with:

```text
python3 scripts/validate_xa_notes.py
```

To validate model outputs, provide a JSON array with matching `id` and `output`
fields:

```text
python3 scripts/validate_xa_notes.py --outputs outputs.json
```

The validator is read-only. It checks the warm-up contract, exact canonical
examples, five-field layout, blank separators, and obvious forbidden content.


## Project layout

```
skills/xa-notes/CORE.md           # Optional compatibility summary; not required at warm-up
skills/xa-notes/SKILL.md          # Full workflow + templates (authoritative)
.agents/skills/xa-notes/SKILL.md  # Codex loader — points at skills/xa-notes
skills/xa-notes/reference/        # Rare process only; not for ordinary notes
AGENTS.md
context/decisions-and-conventions.md  # Human reference; not for note chats
PROJECT.md
```

## Personal wording (Sam)

Same **My languages / My wording / Phrases I never use** block as in
`AGENTS.md` (that file is what loads every chat).
Edit voice preferences there only — keep this section as a pointer so two copies
do not drift.

Corrections that are voice/preference go in the rules block. Fact/process that
affects the whole team belongs in `skills/xa-notes/SKILL.md`.

## Legacy Cursor files and active Codex entry

Codex uses the project `AGENTS.md`, native discovery pointer
`.agents/skills/xa-notes/SKILL.md`, and full `skills/xa-notes/SKILL.md`.
Edit personal wording in AGENTS.md only; this page is a pointer.

The retained `.cursor/skills/xa-notes/SKILL.md` describes the older compact-only
preparation and is outdated for current Codex use. It is not Skill Router's
configured note entry. Leave the legacy Cursor files intact; no current Cursor
workflow was tested. Router's broad freshness scan may still encounter their
contents, which is not evidence they are used to prepare a routine note.
Do not read PROJECT.md or legacy files as extra warm-up instructions.

## Source

Transferred from the Cursor XA package, originally converted from Claude Cowork skill `xa-notes` (read-only originals under Claude local-agent-mode-sessions). Claude sources were not modified.
