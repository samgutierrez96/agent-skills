---
name: xa-notes
description: Generates exact five-field OpsHub post-call notes from XA shorthand. Use automatically whenever the user provides call bullets or mentions assessments, IWT, Final Offers, access, dashboards, agents, vendors, scams, walks, cancellations, checkout, disclosures, incidents, CNML, COE, tenants, commissions, listing agreements, or asks for a post-call note.
---

# XA Notes Loader

This file is a pointer for Codex. **Do not open it with tools.**

The compact warm-up contract is in `skills/xa-notes/CORE.md`. The authoritative
note templates and complete shorthand index are in `skills/xa-notes/SKILL.md`
(same file as `../../../skills/xa-notes/SKILL.md` from here).

1. If the full authoritative skill is already in context, including an exact
   source-text attachment, use it directly without rereading it or CORE.
2. On warm-up (`ready` / attach / no shorthand), load the complete authoritative
   skill before replying exactly `Ready when you are.` Without a full attachment,
   read CORE and the full skill in bounded chunks during preparation. Never
   defer the full load until the first caller. Preparation authorizes file reads
   only, with no customer lookups or external actions.
3. If a note arrives before the full skill is present, silently read only
   `skills/xa-notes/SKILL.md` in bounded chunks. Never try a full-file read
   first; it exceeds the file-tool read limit. Exact full-text runtime
   attachments are not subject to that file-tool output limit. **Never tool-read this loader.**
4. Keep that content for later notes and posts in the same chat. After the
   authoritative load, do not Read, grep, search, or slice SKILL.md again
   unless the XA explicitly asks to edit the skill.
5. Silently pick **shorthand** (tokens → templates) or **already written**
   (full sentences that already name the problem and the solution → format
   those; do not swap in a template). Never improvise a generic note first.
   Do not assume a dictation tool.
6. **No visible text** until the fenced five-field note (or exactly
   `Ready when you are.` on warm-up). On **post**, tools stay silent too.
   Never write “I’ll load,” “I’ll format,” “I’ll write the OpsHub note,” or
   “Looking up.” A tool turn contains no assistant text, including file-size,
   schema-inspect, and lookup notices.
7. Ordinary non-post notes must use `N/A` for both `Property Address` and
   `Follow Up Link` when the XA did not provide those values. Never leave
   either field blank. Explicit posts use the resolved caller/property values.
8. Ordinary notes: **zero MCP**, except silent `list_properties` when Part 4
   needs listing type and a street is in the paste. If the message does not
   contain **post** or **post it**, do not post — a street, phone, or email is
   not a post. Same-message **post it** on the first paste still posts that
   note; strip those words from the five fields. On post, follow Part 11:
   caller’s page (agent, appraiser, seller, or whoever called), never the
   property owner just because of the street.

## Performance contract

- Warm-up is text-only after the authoritative skill is loaded; never reread it
  for a routine note.
- Ordinary notes use zero OpsHub calls except the explicitly allowed silent
  listing-type check.
- An explicit post uses one parallel lookup batch followed by one
  `CreateCustomerNote` call. If no street was supplied and the caller has one
  clear active property, resolve it before creating the note; otherwise keep
  `N/A` and stop rather than exploring additional records.
- Run `whoami` at most once per chat and reuse its token. Use compact limits and
  payloads, no schema inspection unless a call fails for schema reasons, and
  only one retry.
- Do not edit the skill during a live note. Keep timing and lookup metrics
  internal and out of the note.

This one-time read is mandatory when the authoritative skill is absent. It is the
only ordinary-note exception to the project's no-tool rule. On post, use Part
11 payloads directly; inspect the five exact allowed OpsHub tools together only
if a first call fails because its schema is unavailable. Never use a pattern
inspect.
