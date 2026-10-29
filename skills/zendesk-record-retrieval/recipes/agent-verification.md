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
3. If unresolved, verify listing stage before viewing guidance. Under contract
   means no viewing, including for a backup offer. An appraisal/inspection is a
   separate visit type; use its participant/appointment rules instead.
4. Check actual Home Access self-tourability before deciding who may access:
   a self-tourable home permits any eligible requester after required identity
   verification; a non-self-tourable home requiring agent access needs verified
   agent information. Denial alone does not make a home agent-only. For this
   self-identified-agent route, collect only missing MLS sign-in number, real estate license number, full name,
   primary email, phone number, and brokerage name. Reuse details the customer already
   supplied in the ticket thread, including the verified requester phone; OpsHub or
   profile data alone does not skip primary email, phone number, or brokerage name in
   the customer-facing ask. In the reply, name every still-missing field from that set,
   not MLS sign-in and license alone. MLS listing area is optional; MLS sign-in number means
   an identifier, never a password. Full name and brokerage alone are insufficient.
   In the customer reply, use `You can also contact us at (888) 352-7075.` Do not use `If you need assistance` or similar before the number; the reply is already assisting them. Do not offer phone support instead of collecting the missing verification details.
5. If the earlier required details and CUSTOMER `is_agent: true` already verify the
   agent, do not re-ask. Follow the verified access path. Property Flags establish
   `Traditional listing`; trust denial alone does not establish that flag.

Stop once the missing-information request and all required resolution/stage gates
are supported. Keep access and appointment unconfirmed until verified. Do not
replace collection of missing credentials with a phone-support referral. Never
provide a code, remote unlock, or direct entry instructions when trust is denied;
keep denial internal. Name the verified full property address in a showing reply.
Use the two required copy boxes and the correct first-SMS/follow-up voice.
