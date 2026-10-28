# Codex project adapters

The project workflows require both the canonical skill package under `skills/`
and their project-specific rules. Copying SKILL.md alone is incomplete.

For a dedicated workspace, place the matching adapter's `AGENTS.md` at the
workspace root and its optional `context/` beside it. Copy the matching complete
skill folder to `skills/<skill>/`. Escalations instead uses
`.agents/skills/xa-quick-slack/`, as its project rules specify. These are separate
workspaces: never combine all three AGENTS.md files into one root.

The snapshots retain the verified existing workspace paths, tool names and
cross-project references. A different machine or layout requires deliberate path
adaptation; this audit does not claim to validate a fresh cross-host installation.
The repository-layout Zendesk `ENTRY.md` points to this adapter's rules. When
exporting it into a dedicated workspace, restore the entry rules path to
`../../AGENTS.md`, as in its recorded active source.

Zendesk context files are loaded only when the rules require them. Preserve the
runtime's load-once and targeted-read contracts. Do not replace the active
project package with the older separately registered global copy.

XA Notes also requires `xa-notes/skill-loader.md` copied to
`.agents/skills/xa-notes/SKILL.md` inside its workspace. It routes native skill
discovery to the full authoritative source. Preparation now loads the full skill
before Ready; an exact source-text attachment satisfies this load without
repeated file reads. Caller and posting rules remain in the full skill.
