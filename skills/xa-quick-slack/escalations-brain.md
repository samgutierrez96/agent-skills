# Escalations Brain

## Process observations

- 2026-09-15: For an address based agent escalation, the Slack draft needed both the full OpsHub property link, including the `/flip/{token}/acquisition` path, and the OpsHub customer link for the caller. Plain address and caller name were insufficient.

## Process failures

- 2026-09-15: A draft was created without either OpsHub link because the semantic lookup tools were unavailable. Use the authenticated OpsHub UI fallback and block draft creation until the required links are present.
- 2026-09-15: OOO handling applies to every escalation recipient type, not only HSA. Never tag an OOO person. Use that recipient type's documented OOO fallback; known mappings are `@phx-asap` or `@mia-asap` for an HSA, `@agent-acq-eps` for an Agent HSA, and `@sales-support` for Sales Support. If no fallback is documented, leave the recipient unresolved rather than guessing.
- 2026-09-15: The OOO backup tag is listed in the person's Slack profile banner. Read the banner to select the correct backup, including choosing between `@phx-asap` and `@mia-asap`.
