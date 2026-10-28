# Skill manifest

Last content audit: 2026-10-28. Scope: all seven skills already included in this repository.

## Canonical distribution and active sources

This repository distributes reviewed copies of the active sources below. Project
instructions determine source precedence; a global install is not authoritative
when a project explicitly selects its own runtime. Content was compared, not
selected by modification timestamp. File provenance and SHA-256 hashes are in
`shared/source-inventory.json`.

| Skill | Active source relative to the user home | Audit result |
| --- | --- | --- |
| `agent-verification` | `.codex/skills/agent-verification` | Updated workflow and UI metadata |
| `opshub-context` | `.codex/skills/opshub-context` | Already identical |
| `schedule-final-offer-appointment` | `.codex/skills/schedule-final-offer-appointment` | Already identical |
| `xa-admin-account-merge` | `.codex/skills/xa-admin-account-merge` | Updated verified merge workflow |
| `xa-notes` | `Documents/ChatGPT Work/XA Post Call Notes/skills/xa-notes` | Updated full runtime, CORE and references |
| `xa-quick-slack` | `Documents/ChatGPT Work/Escalations/.agents/skills/xa-quick-slack` | Updated compact runtime; retired brain removed |
| `zendesk-record-retrieval` | `Documents/ChatGPT Work/Zendesk/skills/zendesk-record-retrieval` | Updated playbook; bundled entry, routing, verification and 27 recipe cards |

Workspace rules for the three project skills are preserved under
`adapters/codex/<skill>/AGENTS.md`. Zendesk's four on-demand context files are
also bundled there. Read `adapters/codex/README.md` before installation.
The Zendesk ENTRY rules path is translated to the repository layout; all other
copied runtime content is byte-for-byte identical to its recorded active source.

The older globally registered XA Notes, XA Quick Slack, and Zendesk copies are
not the active sources in their dedicated projects and were not overwritten.
Do not reinstall those variants over the project runtime. Project source folders
were read only during this synchronization.

Existing uncommitted backup-offer and privacy updates were compared against the
active project versions before replacement. The active versions retain those
corrections and contain subsequent changes. Pre-sync files are backed up locally
under `.codex/backups/agent-skills-sync-20261027`.

The October 27 resolution-fallback update reconciles the Zendesk playbook and
Fast Index with the active workspace: failed OpsHub authentication retains the
recent-resolution check, uses the current signed-in browser route, and withholds
a customer reply if required history remains unreadable. The inventory hashes
cover both updated files; no customer records or credentials are included.

The subsequent resolution-scope correction preserves each unresolved inbound
ask: appointment reminders do not settle a separate listing-agent identity,
and generic submission guidance does not resolve a named home's emailed offer
or availability. Updated seller/agent and offer-follow-up cards plus the
verification guide retain positive and negative synthetic decision checks.

## Sources outside this audit

- `company-knowledge-update` is installed locally but was not previously included;
  it remains outside the seven-skill inventory.
- `Documents/superdojo/skills` belongs to the separate shared company repository;
  it is an upstream reference, not an import target for this audit.
- Cursor Transfer, plugin caches, and archived copies were not treated as current
  runtime sources or imported wholesale.

## Curation and publication

1. One folder per reusable skill; include required runtime dependencies.
2. Reconcile against the actively deployed source and repository history.
3. Exclude secrets, credentials, standalone customer records and generated output.
4. Sam explicitly authorized public visibility and publication on 2026-10-27.
   Preserve public visibility; continue to exclude secrets and standalone customer records.
5. Validate the package, commit and push reviewed changes, and verify the remote.
6. A local commit or an unmerged PR is not an updated stable `main` branch.

The October 28 catch-up audit includes the active agent representation and
transaction-history guidance, resale commission wording, durable-correction
workflow, and builder closing-date reply correction. All recorded sources were
compared again; the existing two October 27 local commits are retained.
