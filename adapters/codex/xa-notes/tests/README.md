# XA notes offline quality checks

These maintenance files are not runtime skill context. They do not change
note writing, instruction loading, Skill Router, or any external record.

## Ownership and installation

Canonical maintenance source: `agent-skills/adapters/codex/xa-notes/`.
Keep `scripts/validate_xa_notes.py`, `scripts/test_validate_xa_notes.py`,
`tests/golden_cases.json`, and this README byte-for-byte identical at the same
relative paths in the XA Post Call Notes workspace. The source inventory
registers those mirrors. Existing historical observed-output files remain
local evidence, unchanged and outside the canonical synthetic suite.

## Run offline checks

From either the adapter root or the XA workspace:

```text
python3 scripts/validate_xa_notes.py
python3 scripts/test_validate_xa_notes.py
```

The first command checks 37 stored expected examples. It does not generate
model outputs. The second tests the validator itself, including deliberate
failures. Neither command calls a model, OpsHub, Slack, tickets or a browser.

Coverage includes the five-field format, nonempty fields, exact warm-up,
explicit versus unstated Final Offer timing, caller continuity, correction
routes, full links exactly once, completed Slack work, unavailable report links,
and separate new-note/update authorization examples. Personal timing preferences
in the project's AGENTS.md take precedence over the shared templates.

November 18 examples additionally cover property-verified HSA, listing-agent
and transaction-coordinator names, preserving the stated action and caller
posting target, and not substituting a different role/property's person when
the requested name is unavailable. The supplied verified context is synthetic;
these expected-output fixtures do not prove lookup or model compliance.

November 20 adds the qualified acquisition profile's `experiencePartner.name`
shape with a different customer's advisor as a distractor. The validator now
requires the resolved name in Solution Offered itself; mentioning it only in
another field does not pass. These are offline output checks, not generated
model results, posting receipts or an under-20-second timing acceptance.

All formerly missing shape examples now have synthetic expected outputs.
New November 17 acceptance examples are synthetic, not observed model results.
Previously reviewed/anonymized cases retain their original provenance.

## Check captured model outputs

Supply a JSON array of objects with `id` and `output`. For authorization cases,
also supply `operations`: the ordered external mutation operation names from
the captured trace (for example, `[]`, `["CreateCustomerNote"]`, or
`["UpdateCustomerNote"]`). Read-only lookups are not mutation operations.
A generated note's claim that it posted is not a verified operation trace.

```text
python3 scripts/validate_xa_notes.py --outputs outputs.json
```

Missing, duplicate, unknown or malformed candidates fail. No missing candidate
silently falls back to its expected answer. For a deliberate subset, append
`--allow-partial`; omitted cases remain explicitly Not verified. Historical
samples may fail newer preferences; do not rewrite them to manufacture a pass.

## Limits

These checks inspect text and supplied operation names. They do not establish
real lookup quality, source/issue matching, authorization enforcement in a live
agent, correct customer destination, update-note ID ownership, successful
receipts, model instruction compliance, billed tokens or Router speed.
Those remain Not verified until separately evaluated with sufficient evidence.

The existing Part 11 completed-work-link rule remains unchanged: preserve or
retrieve a verified same-call Slack/ticket/report link; do not invent links,
file another report, upload/share files, send Slack or post without authority.
Historical evidence under observed-outputs files is retained unchanged.
