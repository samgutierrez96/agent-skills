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


## Immediate local saves and end-of-day GitHub integration

Sam updated the publication policy on October 28, 2026: save changes locally
immediately, including active sources and affected canonical copies. Routine
daytime edits do not require commits or pushes. Perform lightweight local checks;
batch publication validation, focused commits, pushes and main integration in the
existing end-of-day task. Publish sooner only when Sam explicitly requests it. The existing daily task at 7 p.m. America/New_York
covers both this repository and the private samgutierrez96/skill-router repo.
That task is authorized to commit remaining reviewed changes, push, validate and
integrate reviewed branches/PRs into main, respecting required checks and branch
protection. Preserve existing pending branches and unrelated changes. Never
force-push or guess how to resolve conflicting authoritative sources. Verify the
remote commit and content and distinguish pending integration from updated main.
This supersedes earlier routine-push wording that could imply immediate main
integration. Skill Router's app source stays in its own repository; this repo
continues to distribute the seven registered skill packages and adapters.
