# Offer-status questions on any channel

Apply the packaged entry contract and project rules before this recipe.
The full playbook remains authoritative: [Stage gates the playbook, not the customer's wording](../SKILL.md#stage-gates-the-playbook-not-the-customers-wording); [Lifecycle stage](../SKILL.md#lifecycle-stage); [Offers](../SKILL.md#offers); [Timing answers](../SKILL.md#timing-answers).
Read the four exact linked full-playbook sections together in one targeted block
before drafting; do not run a separate heading search for each. Use `ROUTING-GATES.md`
→ `Targeted playbook reads` for bounded extraction, and reuse sections already in
context. This card is the first lookup path; stage, photo and identity gates remain
required. For agent SMS, use the requester thread early for the full address/property
token; reserve the single normalized address retry until that evidence is available.
A verified property token avoids a broad cross-deal profile lookup. Never pass a
WebCustomer UUID to sell-direct `get_customer`.

- **Refresh-only exception:** Follow `Offers` → “Refresh already complete —
  current primary offer first.” Verify the current primary initial/estimated
  offer through OpsHub MCP before treating an older lead as expired or denied.
  A current offer answers the refresh question; ask about remaining viewing
  trouble. Assessment/Flags browser research is conditional on a separate claim
  that needs it, rather than mandatory for this refresh-only answer.

- **Offer-status questions on any channel:** Zendesk MCP → identify the property →
  one narrow OpsHub read of the assessment and current offer/finalization status,
  then tailor the reply to the customer's actual question. Do not default to
  “checking on the offer” when the property record provides a specific stage; do
  not force every status detail into the reply. If the assessment is complete and
  the final offer is being finalized, do not mention the preliminary offer because
  it may no longer be visible in the customer's dashboard. When the completion date
  is available, give only the relative timing of 3–5 business days after completion;
  never calculate or include a calendar-date window. Never repeat the
  agent-facing email’s stale “2–3 business days” wording; customer-facing
  timing is **3–5 business days of assessment completion**. For seller-agent
  commission questions, state that the commission comes strictly from the
  listing agreement between the seller and seller’s agent; do not describe it
  as part of Opendoor’s offer process or as a commission Opendoor pays or adds
  elsewhere.
  For a refreshed offer already being finalized, existing assessment photos may be
  reused only when the assessment was completed within the 180-day photo reuse
  window. If the window has passed, a new assessment is needed. Confirm the property
  first. For 36237 N 33rd Ave, Phoenix, no assessment completion or photo reuse
  should be claimed when OpsHub Photos & Media shows no assessment photos; ask the
  customer to clarify the property and, if it is that address, explain that a new
  assessment is needed.
  Before drafting, verify both the property page tags/Flags and the
  **Assessments & Inspections** section. `SENT` lifecycle data or an offer email
  does not prove that the final offer was presented. **Sent Finalizing Offer**
  means the final offer is not ready; an assessment completion date starts the
  3–5 business-day customer-facing window. If the property page header/status
  reads **Finalizing**, use that current status in the reply and do not let a
  stale `PRELIM_OFFER_SENT` lifecycle label override it.
  If the ticket contains no property address and the customer has multiple
  associated properties, use a compact customer lookup to confirm the ambiguity
  and ask for the address before pulling property, assessment, or sent-offer
  details. Do not load the full customer event/profile history just to establish
  that clarification is needed.
  When the customer confirms a property whose prior offer is expired and asks
  what happened or what to do next, tell them the next step is to refresh the
  offer; do not frame it as starting an unrelated new offer request.
  If `get_assessment_visits` is stale, the linked acquisition transaction's
  `seller_full_assessment` task is load-bearing: `CLOSED` plus
  `assessment_completed` and `completedAt` confirms completion and starts the
  3–5 business-day window.
  Completed assessment photos, appointment history, or a sent final offer confirm
  that the assessment path advanced; do not recommend another assessment when
  completion is otherwise confirmed. Do not call history empty based on a narrow
  visit read that may omit relevant appointment details.
  For a home-detail dispute on an expired offer, verify assessment completion before
  using the standard pricing/tax-record wording. If the assessment is incomplete,
  tell the customer the offer has expired and that they must refresh the offer and
  complete the assessment before pricing can verify or correct the detail for the
  finalized offer and make the update accurately.
  A visible `Complete` status in the OpsHub **Assessments & Inspections** section
  is authoritative completion evidence and overrides an empty or false narrow
  `get_assessment_visits` / `isAssessmentCompleted` response.
  A `Complete` status alone does not prove that home photos exist. If photo
  presence matters, use the OpsHub MCP to inspect the Photos section and confirm
  photos explicitly labeled as coming from the assessment.
  When multiple customer leads share the address, verify every photo, offer, and
  stage fact against the ticket requester’s customer or lead; never borrow another
  customer’s final-offer or assessment evidence.
  If the property also has a separate agent-associated lead and the seller reports
  another linked account, direct the seller to the agent or brokerage to confirm
  whether a listing agreement exists. If it does, the agent can provide the related
  offer/account information; if not, the seller must work with the agent to clear
  or terminate that relationship. Do not merge profiles from a shared address alone.
