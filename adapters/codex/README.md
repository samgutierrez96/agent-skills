# Codex project adapters

All custom workflow skills use the shared `browser-navigation` owner only when
a browser is actually needed. Install the complete `skills/browser-navigation/`
folder into `~/.codex/skills/browser-navigation/`. Add a global Codex AGENTS
instruction to use that skill across projects, preferring the connected ChatGPT
Chrome integration and keeping Agent 360 as a capability/runtime fallback.
Preserve connector-first/no-browser fast paths and existing background-window
and confirmation rules. The private timing logger never belongs in a customer
note, plugin cache or public telemetry log. No MCP endpoint for the native
desktop extension is implied by this installation.

`kb-answer-for-callers` is a shared business-wide knowledge-retrieval skill.
Install the complete `skills/kb-answer-for-callers/` folder into
`~/.codex/skills/kb-answer-for-callers/`; it needs no dedicated project adapter.
It supports current Glean, Slack, document and browser connectors, retains each
workflow's output format and action boundaries, and can supply evidence to the
separately maintained local `company-knowledge-update` skill. Its original Claude
text is a provenance reference, not an additional runtime. The installed package
and this distribution package are kept identical; Claude's source is unchanged.

Bot Tasks uses `bot-task-notes/AGENTS.md` at its workspace root and the installed
`~/.codex/skills/bot-task-notes` package. Install both files from the canonical
`skills/bot-task-notes` folder, including its `references/local-mcp.md` fallback.
The workspace does not use the five-field XA note contract. Explicit note
posting and task completion remain separate actions.

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

XA Notes' empty-phone recovery also requires the shared `opshub-context` package
installed at `~/.codex/skills/opshub-context/`. Only an empty phone lookup loads
that exact shared skill on demand; routine notes and successful initial lookups
retain their existing fast path. Include its complete package when installing
Notes, and deliberately adapt the shared path on other hosts. Maintenance-only
synthetic recovery cases live in that package's `references/` folder; they are
not customer-workflow context or evidence of live connector behavior.

The XA Notes `context/decisions-and-conventions.md` is a provenance-tracked
human reference, not an additional runtime rule source. Preserve its explicit
do-not-load boundary for ordinary notes and the authoritative skill's precedence.
