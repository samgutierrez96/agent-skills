# General buyer interest in a named listing

Apply the packaged entry contract and project rules before this recipe.
This self-contained card covers ordinary buyer/investor interest and first-offer
inquiries. Do not also load all of `Public listings` or `guides/case-wording.md`
for this branch. For disclosures, condition/systems, prior submitted offers,
access/touring, stage-sensitive, ambiguous or multi-record asks, read the matching
authoritative [Public listings](../SKILL.md#public-listings) section/recipe instead.

## Shortest sufficient read

- Reuse fresh supplied ticket evidence; a latest-reply check still requires current
  comments with enough prior exchange to identify the ask and any later resolution.
  Discover only the next required tool, once; batch independent source/schema reads.
- Use one exact address lookup (`list_properties` or `pds_search_by_address`) and
  retain its exact address and address token. Skip `get_property`, customer history,
  private flips and Flags when answering only ordinary interest with public listing
  information; access/availability/record-specific claims retain their own checks.
- Open the verified Opendoor property URL once. If a URL is not returned, construct
  `https://www.opendoor.com/properties/{Street-City-ST-Zip}/aid_{address_id}` from
  verified address data, then confirm the page's exact address. Do not web-search
  a second copy after the first fetch provides sufficient evidence.
- Use `web_fetch` when actually available. Otherwise run the bundled standard-library
  reader once: `python3 skills/zendesk-record-retrieval/scripts/read_public_listing.py --url '<verified-property-URL>'`.
  It emits bounded visible text with coverage;
  inspect identity and the needed facts. No guessed tool names, dependency installs,
  repeated downloads for button HTML, or ad-hoc parsers. A failure/truncation keeps
  missing facts unknown; use a focused remaining check only if it can change the reply.
- For an offer-process/eligibility claim, read the shared KB's mapped buyer-offer
  reference and make its required targeted governing-source/announcement check.
  Name the unresolved condition before another search; do not repeat broad policy
  searches once the required answer and exceptions are supported. A public button
  alone is not a complete eligible-state list or an accepted offer.
- Once the exact home/link, requested next step and applicable exceptions are
  supported, draft both boxes and stop. No extra price, incentive, photo inventory,
  contact lookup, raw-page output or process explanation when not asked. No promise
  of offer acceptance, negotiated terms or a closing timeline. If a live disposition
  catalog is supplied, answer its tagged side-output in this same turn, not another
  research pass. No send, post, offer submission or record change is authorized.

- **General buyer interest in a named listing:** Zendesk MCP → one property/listing
  lookup. Do not pull customer history unless access or record history is asked for.
  Include the verified exact Opendoor listing URL in the first reply. Name only
  public facts actually read; do not volunteer price or the incentive price.
  When the buyer asks about availability or touring, verify whether the property's
  Flags include **`Traditional listing`**. A traditional listing is still an
  Opendoor-owned home; the flag describes the buyer-access path, not ownership.
  Only when that flag is present, tell a buyer that a licensed agent must schedule
  and attend the viewing appointment; this does not mean the home is unavailable
  to view. Without the flag, use the normal verified touring path. A verified
  buyer's agent may view the property through the agent path.

- **Buyer asks how to place an offer:** Georgia requires a licensed agent; direct
  the buyer to work with one. Where direct buyer submission is available, use
  the listing at `https://www.opendoor.com/buy`. Do not assume all other states
  allow direct submission; confirm the location’s path when unknown. Preserve
  listing-specific instructions: in special instances, a traditional listing at
  `opendoor.com/buy` or `opendoor.com/homes` instructs the buyer to submit through
  `homes@opendoor.com` or contact a licensed agent to place the offer. Follow those
  instructions. These offer rules do not change the touring rules above.
