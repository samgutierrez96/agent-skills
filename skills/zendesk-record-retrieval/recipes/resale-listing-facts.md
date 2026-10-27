# Resale listing FHA eligibility or active offers

Apply AGENTS.md and the packaged entry contract. This is the existing full-playbook
`Fast recipe index` → `Named resale listing asking about FHA eligibility or active
offers` branch. Keep this separate from seller acquisition offer-status questions.

1. Verify ticket/requester/channel/newest question. Read comments only for needed
   thread facts. Resolve the exact address and obtain the verified resale flip
   token; never guess a token or use an acquisition flip as the resale transaction.
2. Preserve the recent-notes/activity check for the same requester/property/concern.
   Do not substitute the former seller's acquisition activity for the buyer or
   agent's resolution history. Stop on a later verified resolution.
3. Use `get_resale_transaction_full` with the verified address token and resale
   flip token. Extract only requested `fhaEligibleDate`, `listingState`, and/or
   `numActiveOffers` from the matching resale listing, preserving contradictions
   and timestamps. Do not print the whole payload just to search it again.
4. Report a verified FHA date or active-offer count directly when requested and
   present, as the existing resale recipe permits. Missing/failed fields are
   unknown, not zero. This does not permit disclosure of multiple internal
   acquisition offer records or restricted amounts. Do not volunteer listing price.
5. If directing an agent to submit, include AGENTS.md's current
   `https://www.opendoor.com/make-offer`, enter the address, and follow the prompts.
   A separate viewing request must first pass listing stage/Flags/access checks;
   under-contract homes cannot be viewed even for backup offers.

Stop when requested listing facts and required resolution checks are supported.
No broad seller-profile or trust research solely for an appendix. Use the two
required copy boxes and keep unsupported fields in the operator gap note.
