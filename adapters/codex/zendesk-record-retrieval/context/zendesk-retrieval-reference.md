# Zendesk Retrieval Reference

**When this conflicts with `skills/zendesk-record-retrieval/SKILL.md` or
`AGENTS.md`, those win.** Do not draft from rules that exist only
here. Historical index — stage lives on the CUSTOMER record (`domain_state`), not
the RENOVATION inventory state, unless the skill says otherwise.

What can be looked up, how, and where the traps are. Conclusions only — the discovery history is in the PRD.

---

## Fact availability

| Fact needed | Reachable | How |
|---|---|---|
| Address → canonical ID | Yes | OpsHub `list_properties`; `resolveAddress` fallback |
| Property physical details | Yes | `pds_get_property` |
| MLS listing history | Yes | `pds_get_property` — **can be years stale**, see T1 |
| **Lifecycle stage** | Yes | `get_customer_profile` → engagement `domain_state`; CUSTOMER index fallback |
| Primary point of contact / seller name | Yes | `get_customer` / `get_customer_profile` |
| Seller lead + customer UUID | Yes | `get_customer` / `get_customer_profile` |
| Agent / brokerage assignment | Yes | `get_customer_profile` or `get_property` |
| Offer state, price, created date | Yes | `get_sent_offer`; `SELL_DIRECT_OFFER` fallback |
| Offer timeline (sent, viewed, accepted, COE) | Yes | `get_sent_offer`; Indextrious fallback for missing fields |
| Assessment **completed** | Yes | `get_property`; exact Assessments page fallback |
| Assessment **scheduled** | Yes | `get_assessment_visits`; TASK index fallback |
| Customer → property from a phone number | Yes | `list_customers` → `get_customer_profile` |
| Assessment appointment **date** | Yes | `get_assessment_visits` |
| Connected login email | Yes | `get_customer` / `get_customer_profile` |
| Listing offer status (buyer side) | No | Verified public listing, UI only; browse at opendoor.com/buy. Offer submission is location-dependent: Georgia requires a licensed agent. |
| **OpsHub comms & notes** | Yes | OpsHub `get_thread` / `get_activity` |
| Customer profile / engagements | Yes | `list_customers` → `get_customer` / `get_customer_profile` |
| Property / assessment visits | Yes | `get_property` / `get_assessment_visits`; Chrome fallback for exact page sections |
| Showings / tour requests | Partial | OpsHub activity/property/visit reads; do not infer when absent |

---

## Query patterns

### Address → everything (fallback path)

```
resolveAddress(street, city, state, postalCode)   → Casa ID
get_property_agent_info([casa_id])                → seller name, customer UUID, agent/brokerage
pds_get_property(casa_id)                         → physical facts only
```

### Lifecycle stage — always establish this first

Use `get_customer_profile` and read the engagement `domain_state`. If OpsHub omits
it, use the CUSTOMER index on the customer UUID.

The RENOVATION index (`ACQUIRING` → `PREP_FOR_RESALE` → `ON_THE_MARKET` →
`SELLING` → `SOLD`) is inventory state, not seller lifecycle stage. Use it only
when a resale/listing question actually needs inventory state.

Approximate mapping to OpsHub Portfolio tabs: Upcoming = `ACQUIRING`; Pre-reno / in reno = `PREP_FOR_RESALE` with reno flags; Pre-listing = `PREP_FOR_RESALE`; Listed = `ON_THE_MARKET`; Resale = `SELLING`; Done = `SOLD`.

A home in `PREP_FOR_RESALE` is owned and in renovation, **not** available to buy;
that does not replace the customer engagement stage for seller-side replies.

### Offers

```
search_indextrious(
  indexes: ["SELL_DIRECT_OFFER"],
  filters: [{field:"address.uuid", operator:"EQUALS", value:"<casa_id>"}]
)
```

Add as needed:
- `{field:"offer.is_latest_offer", operator:"EQUALS", value:"true"}` — latest **within a flip**, does not deduplicate across engagements
- `{field:"offer.va_traits.has_completed_ssva", operator:"EQUALS", value:"true"}` — self-serve assessment completed
- `{field:"offer.va_traits.has_completed_orva", operator:"EQUALS", value:"true"}` — on-site assessment completed

### Tasks — read as a timeline

```
search_indextrious(
  indexes: ["TASK"],
  filters: [{field:"address.uuid", operator:"EQUALS", value:"<casa_id>"}],
  sort_by: "activated_at desc"
)
```

Read the sequence, not the status list. **The absence of an expected task in the current cycle is often the answer.** Example: assessment CLOSED in March, deal died, new offer Aug 2, underwriting closed, pricing decision open — and *no assessment task in the August cycle*, because the March one was still valid.

Task types seen: `seller_full_assessment`, `agent_full_assessment`, `condition_scoping_ai`, `complete_underwriting_valuation`, `acquisition_uw_pricing_decision`, `final_offer_call`, `set_close_date`, `set_signatories`, `hoa_fees`, `late_checkout`, `other_home_info`, `sign_combined_purchase_agreement_and_repair_addendum`.

A new assessment is required only if the previous one is **more than 180 days** old.

### SMS ticket with no address

```
search_indextrious(
  indexes: ["SELL_DIRECT_OFFER"],
  filters: [{field:"offer.lead.customer.primary_phone_number",
             operator:"EQUALS", value:"+1XXXXXXXXXX"}]
)
```

`primary_phone_number` is a Keyword field so EQUALS works. `primary_email` is SearchAsYouType and **rejects** equality filters.

### Ticket itself

Always pull the ticket from Glean first: `search` with `app="zendesk"` on the ticket number or address. Pasted text is usually partial — requester name, channel, and status live on the record.

For policy questions, also search the **Zendesk Help Center** (indexed in Glean) and **internal XA channels** (`#xa-announcements`, `#xa-team-floor-support`). The KB gives the rule; the channel posts say which half of it people keep dropping.

---

## Address filter paths differ per index

| Index | Filter |
|---|---|
| `SELL_DIRECT_OFFER` | `address.uuid`, `EQUALS` |
| `LISTING` | `address.uuid`, `EQUALS` |
| `TASK` | `address.uuid`, `EQUALS` |
| `RENOVATION` | `address.content`, `LIKE` |

Never assume. `RENOVATION` rejects `address.uuid` outright with `invalid filter: equals filter for missing field`.

Filter syntax: dotted struct paths, uppercase operators. Flat snake_case names (`address_uuid`, `address_id`) do not exist.

---

## Confirmed filterable fields on SELL_DIRECT_OFFER

`address.uuid` · `state` · `domain_state` · `offer.id` · `offer.state` · `offer.is_latest_offer` · `offer.coe_date_timestamp` · `offer.coe_date.{year,month,day}` · `offer.offer_review_at` · `offer.sent_at` · `offer.viewed_at` · `offer.accepted_at` · `offer.underwriting.{state, finalized_headline_price_cents, estimated_net_proceeds_cents}` · `offer.va_traits.{has_completed_ssva, has_completed_orva, has_in_progress_ssva, has_in_progress_orva}` · `offer.virtual_assessments[].{completed, canceled, is_valid, assessment_type, ssva_state, orva_state}` · `offer.lead.{id, seller_lead_uuid, token, customer_id}` · `offer.lead.customer.{uuid, first_name, last_name, primary_phone_number}` · `offer.customer_experience_partner.{name, human_token}` · `property_engagement_started_at` · `property_engagement_terminated_at` · `traits.latest_ssva_start_time`

Also in the proto but untested: `preliminary_offer_expiration_date`, `expiration_info`, `number_of_offers`, `is_first_offer`, `late_checkout_date`, `initial_inspection_at`, `purchase_agreement_completed_at`, `digital_checkout`, `lwc_product`.

---

## Traps

**T1 — `pds_get_property` is listing-side and can be years stale.** Returned a 2019 sale cycle and `Opendoor Owned: false` for a property Opendoor closed on in July 2026. Never cite it for current sell-request or ownership state.

**T2 — `LISTING: ACTIVE` does not mean on the market.** One property read ACTIVE while its inventory state was `PREP_FOR_RESALE` — owned and mid-renovation. Use `Inventory State`.

| Property | LISTING | Inventory State | Truth |
|---|---|---|---|
| 432 Nowell Loop | ACTIVE | `ON_THE_MARKET` | genuinely for sale |
| 2696 S Arbor Dr | ACTIVE | `PREP_FOR_RESALE` | owned, in renovation |

**T3 — Multiple ACTIVE offers on one address is normal.** Separate flips / property engagements. `is_latest_offer` is per-flip. Not a duplicate, not an anomaly. Never surfaced outward (rule R7). To quote an amount, get it from the operator or OpsHub rather than picking among index records.

**T4 — An empty boolean result is not `false`.** Unset fields don't match `false`. Only positive matches are evidence. Test a field index-wide before concluding it's unpopulated — one property returning nothing proves nothing.

**T5 — Unit numbers are silently dropped on resolution.** `resolveAddress` with `Apt 101` returns `Street: 1328 Kershaw Loop` and a Casa ID **different** from the bare-address record in `pds_search_by_address`. Sibling units exist as their own records. For any unit address, check for siblings and flag the ambiguity.

**T6 — The index reflects now, not ticket time.** An offer figure retrieved today may differ from what the customer saw when they wrote in. Always compare offer `created` against the ticket date.

**T7 — Indextrious is a cache, not the source of truth.** Stated by its maintainers. Fine for drafting; for consequential facts confirm against Property Lifecycle.

**T8 — Natural-language queries to `search_indextrious` do not filter.** A query naming an exact address returned 10,000 unrelated rows. Use explicit `filters`.

**T9 — Glean's indexed ticket copy can omit the sender's name** even at "~100% of document shown." For email tickets with no name in the index, ask the operator rather than emitting a placeholder.

**T10 — Glean lags live Zendesk.** A brand-new ticket may not be findable by number yet. Lookups key off the address, so pasted text works.

---

## OpsHub MCP update

The earlier comms gap is closed for the normal read path. Use `list_customers`,
`get_customer` / `get_customer_profile`, `get_thread`, `get_activity`,
`get_property`, and `get_assessment_visits` before Chrome or Indextrious. Load only
the exact tools the recipe needs.

Chrome remains the guarded fallback when `get_property` does not expose the exact
page **Flags** or **Assessments & Inspections** fact. `get_special_flags` is
property-condition metadata, not the page Flags block and not proof of
`Traditional listing`. Do not use OpsHub write tools from this drafting project.

---

## Privacy

Every lookup is a read against Opendoor's own records using the operator's existing access, for tickets they already handle. Nothing is written or exported.

Emails are masked when disclosed (`the email ending in XXXXXX@gmail.com`), which also means the value rarely needs retrieving — the placeholder convention keeps customer emails out of drafting context entirely.

Internal acquisition data is retrievable but not shareable. See rule R5.
