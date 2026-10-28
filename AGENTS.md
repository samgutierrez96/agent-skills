# Canonical skill repository maintenance

Use MANIFEST.md and shared/source-inventory.json to resolve each skill's active
source. Read that project's instructions when identifying runtime precedence.
Reconcile changes before copying; preserve unrelated work. Include supporting
files and project adapters, and document intentional packaging transformations.

Sam explicitly authorized keeping this repository public and publishing reviewed
skill updates on 2026-10-27. Preserve public visibility; do not request the same
visibility confirmation on routine syncs. Continue excluding secrets, credentials
and standalone customer records. Validate copied hashes, local package
references and the diff; commit only intended files. Push reviewed changes and
verify the remote commit. Follow the branch/review workflow in README.md and
report pending integration separately from a synchronized stable main branch.


## Daytime branches and end-of-day main integration

Sam clarified the publication policy on October 28, 2026: reviewed work is
committed and pushed during the day to focused `codex/` branches; routine daytime
work does not update main. The existing daily task at 7 p.m. America/New_York
covers both this repository and the private samgutierrez96/skill-router repo.
That task is authorized to commit remaining reviewed changes, push, validate and
integrate reviewed branches/PRs into main, respecting required checks and branch
protection. Preserve existing pending branches and unrelated changes. Never
force-push or guess how to resolve conflicting authoritative sources. Verify the
remote commit and content and distinguish pending integration from updated main.
This supersedes earlier routine-push wording that could imply immediate main
integration. Skill Router's app source stays in its own repository; this repo
continues to distribute the seven registered skill packages and adapters.
