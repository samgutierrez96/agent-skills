# Canonical skill repository maintenance

Use MANIFEST.md and shared/source-inventory.json to resolve each skill's active
source. Read that project's instructions when identifying runtime precedence.
Reconcile changes before copying; preserve unrelated work. Include supporting
files and project adapters, and document intentional packaging transformations.

Keep this repository private as required by README.md. Verify GitHub visibility
before publishing internal skill updates. Validate copied hashes, local package
references and the diff; commit only intended files. Push reviewed changes and
verify the remote commit. Follow the branch/review workflow in README.md and
report pending integration separately from a synchronized stable main branch.
