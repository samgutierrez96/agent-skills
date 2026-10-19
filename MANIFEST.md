# Skill manifest

Last inventory: 2026-10-19.

## Included canonical skills

These are copied from the active Codex installation at
`~/.codex/skills/` and are the current local versions used by this account.

| Skill | Source | Status |
| --- | --- | --- |
| `agent-verification` | `~/.codex/skills/agent-verification` | included |
| `opshub-context` | `~/.codex/skills/opshub-context` | included |
| `schedule-final-offer-appointment` | `~/.codex/skills/schedule-final-offer-appointment` | included |
| `xa-admin-account-merge` | `~/.codex/skills/xa-admin-account-merge` | included |
| `xa-notes` | `~/.codex/skills/xa-notes` | included |
| `xa-quick-slack` | `~/.codex/skills/xa-quick-slack` | included |
| `zendesk-record-retrieval` | `~/.codex/skills/zendesk-record-retrieval` | included |

## Upstream/reference sources

| Source | Local path | Inventory | Treatment |
| --- | --- | ---: | --- |
| Opendoor shared skills | `Documents/superdojo/skills` | 76 active | existing upstream repo; import selectively |
| Obsidian/Documents vault | `Documents/**/SKILL.md` | 148 files | deduplicate and classify before import |
| ChatGPT project copies | `Documents/ChatGPT Work/**/skills` | several | compare against included Codex versions |
| Cursor transfer copies | `Documents/Cursor Transfer/**/skills` | several | migration/reference material |

## Curation rules

1. One folder per reusable skill; keep references and tests beside the skill.
2. Prefer the newest actively deployed canonical, not the newest timestamped
   draft or one-off scheduled task.
3. Do not import secrets, credentials, customer records, or generated output.
4. Keep company-internal skills private and document any external dependencies.
5. Record source provenance and the import decision here when adding a skill.

