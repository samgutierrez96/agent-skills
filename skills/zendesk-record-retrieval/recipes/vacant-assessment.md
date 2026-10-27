# Seller SMS with a vacant home and lockbox for a same-day assessment

Apply the packaged entry contract and project rules before this recipe.
The full playbook remains authoritative: [Assessment reschedules and confirmations](../SKILL.md#assessment-reschedules-and-confirmations).
For assessment/photo/app/walkthrough, stage-sensitive, ambiguous, or multi-record asks,
read the matching full-playbook section before drafting; this card is the first lookup path.

- **Seller SMS with a vacant home and lockbox for a same-day assessment:**
  Zendesk MCP → `list_customers` on the inbound phone → `get_property` and
  Assessments & Inspections. If the assessment is not showing completed, tell the
  customer to reschedule through the Opendoor dashboard using their email or
  provide a date and time for Opendoor to schedule, and ask them to include any
  lockbox information. Never repeat the code. The internal note should preserve
  the handled call/note author, address, scheduled slot, assessment result, and
  lockbox-reschedule requirement.
