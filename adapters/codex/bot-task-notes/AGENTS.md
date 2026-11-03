# Bot Tasks

Use the bot-task-notes skill for Bot Task drafts and explicitly requested
OpsHub note posting. Load ~/.codex/skills/bot-task-notes/SKILL.md before
handling these requests; it owns the format, posting gates, and MCP fallback.

Ordinary requests produce the note only. "Post it" authorizes posting the scoped
note after target verification, not marking the OpsHub task complete. Do not
apply the ordinary five-field XA call-note template to Bot Tasks.

The reusable canonical package is in
~/Documents/agent-skills/skills/bot-task-notes. Keep its installed copy aligned
when changing this workflow. Save locally immediately; GitHub publication
belongs to the existing daily 7 p.m. America/New_York sync unless Sam asks sooner.
