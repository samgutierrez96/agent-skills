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
3. If structured reads cannot expose required customer notes, use OpsHub customer
   search by the verified phone/email, open the matching profile, and read recent notes
   and activity. Use observed URLs; verify the displayed identity. For required
   visit status, use the matching structured appointment/assessment visit record
   first; open Home Visits only for the specific status fact still missing.
4. A later call note resolving the same request → stop. No reply; close.
   Internal note: concern + property + verified call handler + resolution.
   Skip property, Flags, trust, participant, and visit research after resolution,
   unless the operator explicitly requests a remaining fact.
5. Customer disputes booking or says not to send anyone → read
   [Assessment reschedules and confirmations](../SKILL.md#assessment-reschedules-and-confirmations),
   then check the same customer's property and exact appointment slot with
   `get_assessment_visits` or the relevant structured appointment record. Reuse
   verified identifiers and recent-resolution evidence; independent reads may
   run together. Inspect only needed acquisition `tasks` if visit evidence omits
   a required fact; browser only for a named remaining gap. Do not expand into
   offer/pricing/Flags/photo research for a cancellation-only acknowledgment.
   An automated confirmation/check-in, elapsed slot or empty result does not
   prove attendance, completion or cancellation. If cancellation is unverified,
   acknowledge the refusal without promising no visit; the internal note names
   the matched appointment, known status and pending cancellation action.
   Do not offer rescheduling or app photos after an explicit refusal unless
   requested. Stop this branch once the acknowledgment and pending action are
   supported; do not fall through to generic rescheduling guidance. These reads
   do not authorize cancellation, posting or escalation.
6. For a missed/canceled Showami visit, read any escalation thread linked in the
   notes through Slack before asking about the later call's outcome. Verify the
   property and appointment chronology; do not apply an older cancellation to a
   newer slot. A call disposition alone is not resolution. If the provider
   confirms cancellation/unavailability without a superseding resolution, use
   the full-playbook Assessment reschedules and confirmations guidance:
   reschedule through the verified dashboard link or collect a preferred date
   and time, or explain the Opendoor Key App live-photo alternative. Do not
   create a new escalation or draft solely to read this existing context.
7. If unresolved, continue the matching touring/access or appraiser playbook.
   Verify participant and assigned appointment before access guidance. An elapsed
   requested time alone does not justify asking for a replacement appointment
   before checking for a later resolution. Missing visits are not proof that no
   call resolved access. Under-contract buyer-viewing restrictions do not turn an
   appraisal into a buyer tour.

Keep output to the two required copy boxes; add an appendix only for a material
gap. Do not include old access codes or unrelated history. For tool responses,
emit text content once, avoiding the duplicate structured copy. Preserve recent
timestamps, handler, property, resolution, and any conflicting newer inbound.
