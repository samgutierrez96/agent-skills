# Agent access with verification outstanding

Apply AGENTS.md and the packaged entry contract. Use this card when the requester
says they are an agent and requests access or a showing; do not treat their stated
role as verified credentials or tell them to find an agent.

Required full-playbook sections, read together by exact heading if not loaded:
[Agents vs sellers](../SKILL.md#agents-vs-sellers),
[Access codes](../SKILL.md#access-codes), [Trust level](../SKILL.md#trust-level).
Use `ROUTING-GATES.md` → `Targeted playbook reads` without broad searches.

1. Verify exact ticket, requester, channel and newest intent. Comments are needed
   only when the ticket omits supplied details or the latest conversation.
2. Use [resolution-first access](access-resolution.md) for the verified requester,
   property and concern. A later resolving call ends the route with no reply and
   an internal note naming the verified handler. Do not expand after resolution.
3. If unresolved, verify listing stage and any existing appointment's timing before
   viewing guidance. Honor a viewing scheduled or confirmed before the home went
   under contract; do not honor one booked afterward. Unknown timing requires
   verification, not automatic cancellation. Otherwise under contract means no new
   viewing, including for a backup offer. Keep the identity/access safeguards below.
   An appraisal/inspection is a separate visit type; use its participant/appointment
   rules instead.
4. Check actual Home Access self-tourability and listing stage before access or scheduling guidance. When the property is **self-tourable**, any eligible requester—including a self-identified agent—needs allow trust status and confirmed identity only; do **not** ask for MLS sign-in number, license number, or other agent-verification fields solely to confirm or schedule the viewing. When the viewing is already scheduled and the customer does not need to act on access setup, confirm the appointment in the customer reply only; do **not** mention that lockbox type, entry method, or similar access details still need internal confirmation. Record those pending checks in the internal note, not the customer-facing draft. Treat name, email, phone, brokerage, and license details already supplied in the ticket thread as the operative identity evidence even when the OpsHub profile, `is_agent` flag, or trust row has not yet updated. For a **non-self-tourable** home that requires agent access, verify agent information using the field set below. Denial alone does not make a home agent-only. Only on that non-self-tourable agent-access path, collect missing MLS sign-in number, real estate license number, full name, primary email, phone number, and brokerage name. Reuse details the customer already supplied in the ticket thread, including the verified requester phone; OpsHub or profile data alone does not skip primary email, phone number, or brokerage name in the customer-facing ask. In the reply, name every still-missing field from that set, not MLS sign-in and license alone. MLS listing area is optional; MLS sign-in number means an identifier, never a password. Full name and brokerage alone are insufficient. In the customer reply, use `You can also contact us at (888) 352-7075.` Do not use `If you need assistance` or similar before the number; the reply is already assisting them. Do not offer phone support instead of collecting the missing verification details when that non-self-tourable path still requires them.
5. If the earlier required details and CUSTOMER `is_agent: true` already verify the
   agent, do not re-ask. Follow the verified access path. Property Flags establish
   `Traditional listing`; trust denial alone does not establish that flag.

Stop once the missing-information request and all required resolution/stage gates
are supported. Keep access and appointment unconfirmed until verified. Do not
replace collection of missing credentials with a phone-support referral. Never
provide a code, remote unlock, or direct entry instructions when trust is denied;
keep denial internal. Name the verified full property address in a showing reply.
Use the two required copy boxes and the correct first-SMS/follow-up voice.
