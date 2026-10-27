# Skill manifest

Last content audit: 2026-10-27. Scope: all seven skills already included in this repository.

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

## Agent representation clarification — October 27, 2026

The focused agent-representation-tracking branch records Alexis Schlattman's
Slack clarification, acknowledged by Sam: representation is required, referrals
alone do not qualify for payment, and transaction counts are checked through the
agent's email-linked Customer record. Missing property addresses support backend
review. The source thread is linked in each affected runtime. Bonus amounts,
tiers, payout timing and backend ownership were not established.

XA Notes, Zendesk and Escalations project runtimes and independently registered
global variants received the scoped guidance. Escalations' detailed and Cursor
runtime copies were aligned; its project rules and packaged adapter no longer
direct agents to /agent for tracking. The XA boundaries reference preserves the
limit on compensation advice. Historical call examples that use “referral” are
retained as call descriptions, not payment-eligibility guidance. Archived copies,
plugin caches and the separate upstream company repository were not edited.

Repository changes are based on stable main and limited to this clarification;
other open PR changes are deliberately not imported. Updated inventory hashes
describe the packaged files; active sources may also contain those separately
pending changes. Integration into main requires review.

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
