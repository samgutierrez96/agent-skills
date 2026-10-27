# Resolution-first access, appraisal, inspection, and appointments

Apply project rules. Check resolution before drafting or expanding retrieval.

1. Exact Zendesk ticket → `list_customers` using requester phone or email.
   Add ticket comments only if the latest intent or conversation is missing.
2. Read recent notes/activity for that verified customer and the same property.
   With a verified flip token, use `get_activity(full:false, limit:10)`; never
   pass a customer UUID as `flip_token`. `get_thread` supports SMS evidence but
   does not substitute for call notes. When only a verified WebCustomer UUID is
   available, use `get_customer_profile(customer_uuid: ..., full:false)` for
   recent call events and notes before browser fallback. It requires no flip
   token. Retain its response and emit focused recent evidence rather than the
   full history. Do not call sell-direct `get_customer`
   for a vendor's WebCustomer UUID.
3. If structured reads cannot expose customer notes, use OpsHub customer search
   by the verified phone/email, open the matching profile, and read recent notes
   and activity. Use observed URLs; verify the displayed identity. Read Home
   Visits on that same page if the visit status remains relevant or was asked for.
4. A later call note resolving the same request → stop. No reply; close.
   Internal note: concern + property + verified call handler + resolution.
   Skip property, Flags, trust, participant, and visit research after resolution,
   unless the operator explicitly requests a remaining fact.
5. If unresolved, continue the matching touring/access or appraiser playbook.
   Verify participant and assigned appointment before access guidance. An elapsed
   requested time alone does not justify asking for a replacement appointment
   before checking for a later resolution. Missing visits are not proof that no
   call resolved access. Under-contract buyer-viewing restrictions do not turn an
   appraisal into a buyer tour.

Keep output to the two required copy boxes; add an appendix only for a material
gap. Do not include old access codes or unrelated history. For tool responses,
emit text content once, avoiding the duplicate structured copy. Preserve recent
timestamps, handler, property, resolution, and any conflicting newer inbound.
