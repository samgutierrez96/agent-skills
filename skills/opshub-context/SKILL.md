---
name: opshub-context
description: Resolve the customer and property currently in scope for an OpsHub workflow using a captured phone number, address, customer ID, property ID, or page context. Use for shared context needed by XA post-call notes, escalations, or other customer/property workflows.
---

# OpsHub Context

Use this skill as the shared identity layer before a downstream workflow needs
to write a note, draft an escalation, or otherwise act on a customer/property.

## Boundary

Capture and resolve context only. Do not choose an escalation target, send
Slack, post a note, or invent a relationship between a customer and property.

## Resolution order

1. Parse stable customer/property IDs from the supplied page URL or context.
2. Resolve the active caller independently from an explicit caller phone with
   `list_customers(phone=...)`, or from a caller customer ID. If a successful
   phone search is empty, follow Empty phone lookup recovery below before
   requesting another identifier.
3. Resolve an explicitly labeled full address with `list_properties(address=...)`.
4. When a property ID/address token is available, use
   `get_customer_profile(address_token=...)` to resolve the seller/customer,
   phone, lead, and experience partner.
5. Enrich the unique customer/property with `get_customer_profile`,
   `get_customer`, or `get_property` only when the consumer needs it.
6. Use `global_search` only when no narrower lookup is possible.

Run independent phone and address lookups in parallel when both are present.
Keep the raw captured values and source URL in the result.

## Empty phone lookup recovery

A successful empty search is not proof that the customer record does not exist:
recently saved contact data may not yet appear in search. Do not assume an
index delay is confirmed, and do not treat a tool error as an empty result.

1. Preserve the captured phone, normalize punctuation/spacing and its known
   country code, then make one fresh `list_customers(phone=..., limit=5)`
   retry. For an explicitly US number, use `+1` plus its ten digits; do not
   invent a country code for an uncertain number. Retry once even if the first
   search was already normalized. No sleep or polling loop.
2. If still empty and no supplied customer ID, email or name offers a narrower
   lookup, make at most one `global_search(query=<normalized phone>, limit=5)`
   fallback. Search hits are candidates, not verified callers. For each customer
   candidate (at most five), use `get_customer(customer_id=<UUID>)` to check
   its complete normalized current phone, including associated/other phone
   fields when returned. A title, suffix, property owner, or historical event
   alone is not an exact current-phone match. Incomplete/truncated results do
   not establish uniqueness.
3. One exact, non-conflicting customer match is resolved even with a blank
   name or missing email. Return that UUID to the original workflow without
   requesting a name, email or customer-page link. Multiple plausible matches
   remain ambiguous; preserve the consumer's duplicate-profile/identity gates.
   If recovery fails or a tool is unavailable, retain the note/draft and state
   the actual lookup blocker. Ask once for an available alternative identifier,
   not repeatedly for a name/email the operator already said is unavailable.

The initial search, one retry and one fallback are the recovery budget for that
caller, not a new budget for every follow-up. On a later operator continuation
of the same unresolved authorized request, allow one fresh phone lookup in
that turn instead of relying forever on the earlier empty result; do not
repeat an exhausted fallback or poll autonomously. A supplied stable customer
URL/ID bypasses search and uses direct record resolution. Never create a new
customer, guess a UUID, or replay a completed note/post to recover a lookup.
Resolution supplies identity only; the consumer still owns action permission
and duplicate-write protection.

Maintenance-only decision fixtures are in
`references/phone-lookup-recovery-cases.json`; never load them during customer
work or test recovery with live writes.

## Ambiguity and relationship

Return `ambiguous` instead of selecting a candidate when a lookup returns more
than one plausible customer or property. Do not treat an unassociated caller
and property as a mismatch. Represent that relationship explicitly as
`interested_contact`, `buyer`, `agent`, `inspector`, `appraiser`, `vendor`, or
`unknown`. Return `mismatch` only when a downstream workflow requires the
caller and property to belong to the same engagement. Return
`missing_identifier` when the page provides neither a stable ID nor a clearly
labeled phone/address.

For unresolved or ambiguous identity, do not proceed to a write or draft until
the user selects a candidate or supplies a better identifier. A unique verified
match does not require an additional identity-confirmation question.

## Result shape

Return a compact object with `status`, `source`, `customer`, `property`,
`engagement`, and `warnings`. Preserve `null` for unavailable fields; never
fill them with guesses.

## Consumers

Pass the resolved object into the existing XA post-call note or escalation
workflow. The consumer remains responsible for its own note format, routing,
confirmation, and write/send rules.

## Caller versus property context

Property context can resolve the seller/customer attached to the address, but
that person is not automatically the caller. For agent, inspector, appraiser,
vendor, or other non-seller calls, prefer the current customer page or an
explicit caller phone/name. If both property and caller context are present,
keep them as separate fields and do not replace the caller with the property
owner.

For a buyer interested in a property, the active call phone resolves the buyer
and the current property URL resolves the property. The buyer does not need to
appear on the property page.
