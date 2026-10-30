# Skill manifest

## Buyer and agent offer-submission exceptions — October 30, 2026

Sam confirmed two scoped exceptions in the Floor Support chat. Buyers who
encounter a traditional listing at opendoor.com/buy or opendoor.com/homes follow
its instructions to submit through homes@opendoor.com or contact a licensed
agent. Agents normally use opendoor.com/makeoffer; when the home has an active
offer, instruct the agent to email homes@opendoor.com. Email is not a blanket
alternative for every offer. XA Notes, Escalations and Zendesk runtime sources,
dependent local instructions and canonical packages are aligned; affected
inventory hashes are updated. Existing location, touring/access, privacy and
escalation boundaries are preserved. The Georgia-specific sentence is omitted
from the announcement, not repealed as saved operational guidance. Local
Floor Support project context and the shared company-knowledge reference also
record the update. Historical exports and plugin caches were not rewritten.
GitHub publication remains queued for the existing daily synchronization.

## CNML contact and resale confidentiality — October 30, 2026

Diego Mendieta's announcement now directs Cash Now, More Later closed-home and
second-payment questions to cashnowmorelater@opendoor.com, replacing Executive
Experience for that scope. Former ownership does not authorize disclosure of
private current-resale details or its scheduled closing date. Zendesk's owning
rules, playbook and Fast Index, XA Notes, and Escalations have been reconciled
locally, including their applicable installed and portable references. Other
Executive Experience routes remain unchanged. Source:
https://opendoor.enterprise.slack.com/archives/C02K6JVSNUF/p1793377165539289.
Publication remains queued for the existing daily synchronization.

## Completed-merge aliases — October 29, 2026

The Account Merge skill now distinguishes remaining distinct unmerged accounts
from a linked duplicate entry left visible after a confirmed successful merge.
Continue merging distinct qualifying accounts, but do not repeat a completed
merge, require an empty sidebar/search result, or block posting when an entry
resolves to the surviving account with matching identity/contact details. Reuse
the XA's explicit completion confirmation and supplied result evidence. Matching
details or a generic keeping-customer checkmark alone are not a merge receipt.
Preserve contact-cleanup checks and post only once to the surviving customer.
Active and canonical copies match locally; the inventory hash is updated.
GitHub publication remains queued for the existing daily synchronization.

## Direct-source correction guardrails — October 29, 2026

The three Codex project adapters and the standalone Account Merge and Agent
Verification skills now share the direct-source correction boundary: amend the
existing owning passage, avoid duplicate/conflicting rules and customer-case
facts, verify the exact local source, and distinguish it from GitHub publication.
Ordinary-drafting edit prohibitions now explicitly allow operator corrections
under that boundary. The Skill Router adapter verifies ownership, mirrors and
receipts; it does not own a parallel set of workflow business rules. Active and
canonical local copies and the five updated inventory hashes match. Publication
is pending the established scheduled synchronization.

## Operator feedback reviews — October 29, 2026

The Zendesk, XA Notes and Escalations adapters now distinguish result corrections
from questions about processing speed, output quality and token usage. Feedback
uses normal prose, preserves correct outcomes, reuses saved evidence and does
not authorize sends/posts or waive verification gates. Actual draft corrections
retain their deliverable contracts. The Zendesk adapter also stops unnecessary
research after verifying that a newer same-concern email supersedes an older SMS,
without treating the newer request as resolved. Active project rules and these
canonical adapters match locally; inventory hashes are updated. Live performance
savings are not measured. GitHub publication awaits the scheduled daily sync.

Last content audit: 2026-10-30. Scope: all seven skills already included in this repository.

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

The October 28 merge follow-up accepts compatible partial candidate names with
verified matching phones, preserves primary-email authorization, and removes
redundant ready-screen identity reads. Notes and escalation entry gates ask
only for needed information: request a name only when existing record evidence
cannot resolve identity, combining name and primary-email questions when both
are necessary. Cleanup selects Customer Info’s
Edit directly on wide layouts, with Details used only when collapsed.
Conflicting identities and the reviewed Admin irreversible warning remain submission gates. The installed shared skill
and canonical package are identical; live timing still requires a future run.


## XA notes preparation — October 28, 2026

The XA adapter and CORE now load the full authoritative skill before Ready.
The active native-discovery loader is included as
`adapters/codex/xa-notes/skill-loader.md`; copy it to the workspace path described
in the adapter README. Exact full source-text attachments satisfy preparation
without rereading CORE or SKILL.md. Later callers reuse the same loaded source.
The full templates and posting procedure were not shortened or changed.
The active and canonical copies plus inventory hashes match locally; GitHub
publication remains scheduled for the existing end-of-day task.


## Existing-thread reply style — October 28, 2026

The XA Quick Slack active runtime and its packaged copy now match the selected
thread's order, tone and level of detail. Include case identifiers, verified
links and mentions when useful; avoid repeating context already in the thread.
New listing-partner/HSA posts keep their exact layouts, and OpsHub notes retain
the five-field contract. The adapter agrees with the runtime; inventory hashes
were updated. Saved locally for scheduled publication.

## Merge continuation and property lookup — October 28, 2026

The active escalation runtime and packaged copy keep property-link retrieval in
the workflow, retain the original action while awaiting a primary-email choice,
and ask only for concrete missing address details when lookup remains ambiguous.
Runtime/package hashes match; changes are saved locally for scheduled sync.

## Matching-phone duplicates without email — October 28, 2026

The merge skill and active XA note/escalation entry points now recognize named
profiles with the same normalized verified caller phone and compatible identity
or prior XA same-person confirmation, even when the duplicate has no email.
Open the confirmed primary-email profile first in Admin and inspect Potential
Duplicates. Missing email alone does not make a profile a placeholder; true
placeholders without independent identity or matching phone remain excluded.
Canonical and active runtime copies and their inventory hashes match locally.
Publication remains queued for the existing end-of-day synchronization task.

## Unnamed caller posting target — October 29, 2026

Sam confirmed that a unique customer record matching the supplied normalized
caller phone remains a valid posting target when its name is blank or email is
missing. Missing fields alone do not make it a stub or require a name question.
Ambiguous/conflicting matches and duplicate-profile handling retain their gates.
The active XA notes runtime and canonical package match locally; the inventory
hash is updated. GitHub publication remains queued for the existing daily sync.
