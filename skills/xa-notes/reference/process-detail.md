# APPENDIX C — Process detail

Back-office process an XA follows. Load this when the shorthand touches one of
these workflows and the note needs to reflect what was actually done.

Named individuals are deliberately left out. Where this file says "the Associate
Broker" or "the XA point of contact," check your team's current roster.

---

## In-home walkthrough

An on-site visit to assess home condition and major systems such as HVAC and
plumbing. Takes up to 45 minutes. Required for Sell Direct leads unless the
dashboard shows otherwise. **The dashboard is the source of truth.**

**Performed by Showami**, a network of third-party licensed real estate agents.
Homes project managers no longer perform these. Never write a homes project
manager into a walkthrough note.

Agents use the Key app handoff feature, where the seller hands the app to the
agent to complete the visit.

### Scheduling

- Time windows: 8 to 12, or 12 to 4.
- Scheduled through the Assessments tab, then Add, then In-person Walkthrough.
- Up to 7 days out.
- Notes for the visiting agent go in the notes section.

### Rules that come up on calls

- **Utilities must be on** for every walkthrough.
- **180-day rule:** a seller who completed a walkthrough within the last 180 days
  does not need another.
- **Agents do not need to be present** if the property is completely vacant, with
  no tenants and no furnishings. Update the visit notes if this is confirmed.
- Access instructions **cannot be updated in the seller's dashboard** after
  scheduling. Update the notes in OpsHub under the Assessments tab instead.
- If the seller cannot provide any access at all: "We're unable to move forward
  without an in-person walkthrough." The visit can be scheduled further out, and
  access instructions collected if they will not be home.

### When a walkthrough cannot be completed

The visiting party submits an escalation and the XA team is auto-tagged. The XA
proactively calls the customer to reschedule.

A Showami agent who was denied access or whose seller did not show is advised to
leave a comment in the Showami showing so they are compensated. Not an escalation.

---

## Rental scams

### Intake goes to Maddie

Callers reporting a rental scam are **transferred to Maddie**, the AI bot, which
files the report. Tell the caller to have ready the contact details of the
fraudulent actor and any information he presented.

**Exception — the victim has already moved in.** That is not a Maddie transfer.
File an Incident Report in OpsHub and dispatch patrol.

### Deny profile notes

XAs are authorized to set profiles to Deny and unsubscribe them from written
communications without waiting for trust and safety. Set in Admin, as standalone
notes rather than buried inside other notes.

- Rental scam victim: `RSV Tracking - Deny Access`
- Rental scam suspect: `DENY ACCESS - RELATED TO A RENTAL SCAM REPORT`

A Deny status on its own is not unusual and does not by itself block a vendor.

### Vendor access

Vendors no longer get access through the support line. Going forward they get
access instructions from the buyer's agent.

An XA can still provide access only if **all three** are true:

1. The property is in Resale — In Contract status.
2. The vendor can verify a name on the contract: buyer, buyer's agent, or lender.
3. No trust and safety manual deny notes, no non-negotiable flags, no rental scam
   link, and fewer than three red flags.

Confirmed wording: "I'm happy to help you get access today, but going forward
vendors will need to get access instructions directly from the buyer's agent."

### Previous owner on a closed Cash Now, More Later home

Once the acquisition closes, the previous owner is not the property owner.
Opendoor is. They agreed to that when they signed. If they try to enter, treat
them as a buyer and go through buyer access guidelines. **Do not provide the
lockbox code.** Appreciate their feedback; we own the home now and we are doing
our best to sell it. This is not a vendor closed-home issue and not a second
half payment call.

---

## Prorated tax reimbursement

All customer-facing communication about prorated tax reimbursement goes through
the XA.

1. Buyer requests a refund. The XA creates a new Zendesk ticket and applies the
   "Pro-Rated Tax" macro.
2. The XA sets the subject line to the full property address and includes: a link
   to the originating outreach, the Admin link, a copy of the new tax bill, and
   the buyer's mailing address for the check.
3. Submitted as New, which routes to the transaction coordinator view.
4. Transaction coordinator leads reassign to the Associate Broker for review.
5. The Associate Broker approves with check details, or asks for more information.
6. The XA relays that response to the customer and solves the ticket.

Refunds are always by check. Wire transfers only with Associate Broker approval,
with accounting working directly with the customer.

Requests arriving from other teams are redirected to the XA team at the support
inbox.
