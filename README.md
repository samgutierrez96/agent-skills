# Agent Skills

Private canonical distribution repository for Sam's reusable agent skills.

Each skill lives in its own folder under `skills/`. The repository is the
versioned source of truth; agent-specific folders under `adapters/` contain
small compatibility notes or wrappers when a host needs them.

## Current scope

The repository contains seven custom skills. The October 27, 2026 audit reconciles
them with their active Codex or project runtime sources, including required
project rules and references. See [MANIFEST.md](MANIFEST.md) for provenance and
[Codex adapters](adapters/codex/README.md) for installation constraints.

This repository intentionally does not copy the full `superdojo` repository or
every `SKILL.md` found in the Obsidian vault. Those sources include shared
company material, archived skills, project-specific skills, and one-off
scheduled tasks. They are tracked as upstream/reference sources and will be
added selectively after review.

## Working model

- `main` is the stable, shareable branch.
- Changes are prepared on focused branches such as
  `consolidate-canonical-skills` and merged after review.
- Releases should use version tags such as `v0.1.0`.
- Keep this GitHub repository private unless each included skill has been
  explicitly cleared for broader sharing.

## Layout

```text
agent-skills/
├── README.md
├── MANIFEST.md
├── skills/
├── shared/
└── adapters/
```

