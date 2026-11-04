# Decisions and conventions (condensed)

Filtered from Cowork `CLAUDE.md` + `xa-brain.md`. **When this conflicts with `skills/xa-notes/SKILL.md`, the skill wins.** Do not write notes from rules that exist only here. Superseded brain lines are omitted.

**Do not @ or load this file for ordinary post-call notes** — use `skills/xa-notes/SKILL.md` only. Open this for human reference or non-note questions.

_Last condensed: 2026-09-10 for Codex transfer._

## Standing product / architecture

- **Output:** five-field OpsHub note only. Never Slack in this project.
- **Showami** performs in-home walkthroughs (not homes project managers).
- **Assessment** comes after initial estimated offer and before Final Offer.
- **Final Offer clock:** 3–5 business days from assessment **completion**, not the call date.
- **Refreshed offer clock:** confirming a refresh always includes 3–5 business days **from the day the offer was refreshed** (not the call date, not assessment completion). Do not wait for the XA to restate the timeline.
- **Withdrawn offer refresh:** tell the seller the assessment has to be completed again (expired refresh does not get this line).
- **COE window:** 21–60 standard sellers; 21–120 homebuilder/Lennar partners (never invent "14").
- **Utilities:** stay on 3+ days past **move-out day**, not COE date.
- **Home must be vacant by close of escrow** (tenant questions → vacancy line, not auto-escalation).
- **Maddie** files rental-scam reports (XA transfers). Exception: victim already moved in → OpsHub incident + patrol, not Maddie.
- **Identity / access deny:** "confirm with our trust and safety team" (XA team) — never "identity team," never an escalation by itself.
- **Cash Now, More Later second half:** **advise** seller to email `cashnowmorelater@opendoor.com` — never "Escalated to."
- **Closed CNML home, previous owner wants in:** they are no longer the owner; Opendoor is. Treat as a **buyer**, go through access guidelines, **never give the lockbox code**. Thank them for feedback; we own the home now and are selling it. Not the CNML inbox, not closed-homes.
- **Buyer's agent commission (resale):** negotiated in the offer. Standing line: "Let the agent know the buyer's agent commission on the resale side is negotiated in the offer."
- **Seller's agent commission:** through their agreement with the seller, paid from the seller's proceeds at closing; refer to `opendoor.com/agents`.
- **Opendoor Home Loans (Sam, October 31, 2026):** in-house lender, no lender/origination fees, and up to 2% toward a rate buydown on Opendoor homes, not a guaranteed incentive or no closing costs. Applications/contact: `opendoor.com/mortgage`, `947-600-5891`, `mortgage@opendoor.com`. See Part 6 of the skill for source attribution, eligibility, affiliate and post-close servicing limits. Knowledge may be paraphrased; notes record only guidance actually given.
- **Placing an offer (2026-10-22):** Some locations require a licensed agent to submit a buyer’s offer. Georgia is one: direct the buyer to work with a licensed agent to place the offer. Where direct buyer submission is available, find the property listing at `https://www.opendoor.com/buy` and submit the offer from that listing. Do not assume every other state allows direct submission; confirm the location’s path when unknown. In special instances, a traditional listing encountered at `opendoor.com/buy` or `opendoor.com/homes` instructs the buyer to submit through `homes@opendoor.com` or contact a licensed agent; follow the listing's instructions (Sam, October 30, 2026). This offer-submission rule does not change touring/access rules. Agents normally use `opendoor.com/makeoffer`, including for backup offers. When the home has an active offer, instruct the agent to email `homes@opendoor.com`; email is not a blanket alternative (Sam, October 30, 2026).
- **Buyer offer guidance reaffirmed (2026-10-23):** Direct buyers to `opendoor.com/buy`, find the home, and submit an offer from its listing where direct submission is available. The buyer note example uses this direction; preserve the location and traditional-listing exceptions above. `opendoor.com/makeoffer` is for agents.
- **Lennar partner ≠ listing agent** for assessment next steps — seller options apply (Key app or Showami IWT). Listing agents get Key app only (no Showami scheduling for the agent).
- **Agent offer status / listing-agent contacts (Sam, November 2, 2026):** Agents can check offer status and find the listing agent's contact details at `opendoor.com/makeoffer`. Preserve the active-offer email exception for submissions. Notes record only guidance actually given, not an invented lookup, submission, or contact; list the website only once.
- **Shorthand vs already written:** tokens with no stated solution → templates. Full sentences that already name the problem and what was done → format those; do not swap in a standing line they did not use. Do not assume a dictation tool. Required contacts still win: listing agreement not on file is `support@opendoor.com`, even if they said "through email."
- **Same-message post:** `post` / `post it` on the first paste still posts that note. Strip those words from Solution Offered. "They said they would post it" after an email ask means they would send it, then post.
- **Return with a licensed agent is traditional listings only.** Opendoor inventory listings do not get that line unless the XA used it. Silent `list_properties` when a street is on a buyer access paste.

## Note format conventions

| Rule | Detail |
|------|--------|
| Blank fields | Property Address + Follow Up Link always blank |
| Layout | Label + content same line; blank line between fields |
| Reason for Call | Full sentence, not a category label (`IWT Reschedule`) |
| Caller | First word from XA sets type; never assume |
| Direction | Only if XA stated it |
| Solution Offered | Stated actions only; never restate Reason |
| Access "verified info" | Copy expansion table by caller type; every non-vendor row includes "scheduled the appointment" |
| Verification wording | Access calls only — not assessment/FO/commission |
| Em dashes | Banned; compound hyphens OK |
| Acronyms | Spell out in the note |
| Two threads | Cover both if shorthand had two |

## Escalation conventions

- Only when XA said they escalated; put name in Solution Offered.
- Named person → `Escalated to [Name] to [action]` (drop redundant "corresponding home sale advisor").
- FO delayed/queue → pricing team; FO already issued questions → HSA; closing-side → sales support.
- No default HSA fallback.
- Group tags (phx-asap / mia-asap / agent-acq-eps / sales-support / acq-hsa-managers) encode OOO or manager follow-up — see skill Part 7.
- Listing agreement in place + seller calls (including for offer or file info) → standing line about speaking with their agent to respect the listing agreement. Do not stop at "have their agent call us."

## Contacts (stable)

| Need | Where |
|------|--------|
| Trust and safety | trust@opendoor.com |
| Prorated tax redirects | support@opendoor.com |
| Listing agreement not yet on file | support@opendoor.com |
| CNML closed-home / second-half offer/process questions | cashnowmorelater@opendoor.com |
| Other escalated seller issues | executive.experience@opendoor.com |
| Commission info | opendoor.com/agents |
| Vendor asking to work with Opendoor | opendoor.com/vendor-partnerships and vendoronboarding@opendoor.com (see skill Part 6 — not partnerships@ or the 1-833 line) |

## Outdated / do not use here

- Skills: `xa-post-call-note`, `xa-quick`, `xa-quick-slack`
- Retired phrases: "identity team," "filed the report" (rental scam), "provided access information," "directed them accordingly," reassurance Sam did not say ("on track")
- Do not auto-load full session history from the old brain; skill is source of truth

## Open / expect correction

- Buyer's agent access wording not distinctly confirmed — use closest type
- Proof of funds / net proceeds document — no standing template yet (often HSA)
- Some OpsHub lookup / Gumloop automation threads are Cowork-era and out of scope for this Codex notes package
