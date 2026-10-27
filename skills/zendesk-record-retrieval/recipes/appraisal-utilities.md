# Utilities on for an appraisal or inspection

Use for a buyer or buyer's agent asking that utilities be active for an
appraiser or inspector. This is a readiness request, not automatically a new
appointment or a buyer viewing. Apply project output and escalation rules.

1. Read the exact Zendesk ticket. Add comments only if needed to establish the
   latest intent or earlier support exchange. Preserve the inbound date so
   “tomorrow” is interpreted correctly.
2. Verify requester with `list_customers` by phone/email. Check recent customer
   notes and activity using `access-resolution.md` before property research or
   new questions. If no usable requester-scoped activity identifier is exposed,
   use the verified OpsHub search UI and open that customer's observed result.
   Do not use a WebCustomer UUID as a flip token or sell-direct lead.
3. Read `get_thread` only if conversation is needed to clarify the utility or
   prior commitment; omit it when the customer page already supplies that
   conversation. Preserve relevant chronology; earlier confirmation is not
   proof of current service after a newer report that service is off.
4. If unresolved, verify the matching property/transaction and assigned resale
   contact with the narrowest available record. Reuse an observed matching
   property URL. Do not retrieve assessment photos, sent offers, trust, access
   codes or Flags for a utility-only response. Verify participant and appointment
   separately only if giving access or scheduling guidance.
5. When escalation is needed, use `xa-quick-slack` under the project's standing
   unsent-draft authorization. Search Slack once by the exact street number and
   street name; this may run alongside requester lookup when the inbound gives
   an unambiguous address. Otherwise wait for address confirmation. Read the
   relevant existing utilities thread before creating any new escalation.
   Check for later resolution and conflicting current status. Treat automated
   summaries as claims requiring reconciliation, not proof service is on.
6. Use the existing verified destination/thread and documented recipient. Include
   observed property and requester links. Do not mention a bot that would launch
   work, send, order service, pay, or change records. Save one unsent draft;
   confirm creation only with a returned `draft_id`, and open the destination.
7. Draft concise SMS with Sam's initial introduction when required. Ask only for
   useful missing facts, such as whether the appraiser has now visited and which
   utility failed. Do not confirm activation, habitability, repairs or appointment
   completion without evidence. Do not promise follow-up from a saved draft.

Return the customer reply fence first and the internal-note fence second. The
note states the concern, verified current status, existing thread and actual
handoff state: prepared for review and sending. Keep ticket numbers out of the
note. Include a short draft confirmation below; no OpsHub writes or call note.

Read the matching full-playbook section only if access, scheduling, an unresolved
identity/stage conflict or another separate question needs a rule absent here.
