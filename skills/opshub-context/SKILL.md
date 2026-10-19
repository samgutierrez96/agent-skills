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
   `list_customers(phone=...)`, or from a caller customer ID.
3. Resolve an explicitly labeled full address with `list_properties(address=...)`.
4. When a property ID/address token is available, use
   `get_customer_profile(address_token=...)` to resolve the seller/customer,
   phone, lead, and experience partner.
5. Enrich the unique customer/property with `get_customer_profile`,
   `get_customer`, or `get_property` only when the consumer needs it.
6. Use `global_search` only when no narrower lookup is possible.

Run independent phone and address lookups in parallel when both are present.
Keep the raw captured values and source URL in the result.

## Ambiguity and relationship

Return `ambiguous` instead of selecting a candidate when a lookup returns more
than one plausible customer or property. Do not treat an unassociated caller
and property as a mismatch. Represent that relationship explicitly as
`interested_contact`, `buyer`, `agent`, `inspector`, `appraiser`, `vendor`, or
`unknown`. Return `mismatch` only when a downstream workflow requires the
caller and property to belong to the same engagement. Return
`missing_identifier` when the page provides neither a stable ID nor a clearly
labeled phone/address.

Do not proceed to a write or draft until the user selects a candidate or
supplies a better identifier.

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
