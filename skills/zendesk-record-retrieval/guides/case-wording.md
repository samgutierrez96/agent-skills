# Case-specific wording and correction follow-through

Read only the matching section when FAST-INDEX.md selects it. These passages are
preserved from the former always-loaded rules; project-root paths remain so.
Current action authorization and source ownership checks still apply.

## Builder closing-date correction

When a builder contact reports a closing date different from the verified
Opendoor closing date, state the Opendoor date and ask whether the seller is
trying to close on the date the contact supplied. Do not give a receipt-only acknowledgment
or replace that question with a question about the new-home closing date. Do
not claim a closing-date change has been made.

## Offer-denial closing

For an offer-denial reply, end warmly when appropriate: “Our ability to make an offer may change in the future. Thank you for considering Opendoor.” Keep this
conditional; do not promise a future offer, notification, review, or follow-up.

## Presented offer acceptance wording

When the seller must move forward with a presented offer, direct them to confirm and
sign the offer they want to proceed with—not merely to “confirm which offer option.”
Questions about the offer or options go to their assigned Home Sale Advisor when one
applies.

## Slack deletion-scope correction

For Slack drafts, incorporate the operator's confirmed scope and current action.
When the operator is replying, omit stale commentary such as “neither ticket has
a support reply yet.” When the operator confirms a property is not in the
directory and limits the request to customer-profile deletion, keep the Slack
request within that scope; do not ask Privacy how to remove property pages,
photos, or search indexing. Omit redundant “no deletion or removal confirmed”
status disclaimers unless needed for a specific decision.

## Saving an accepted correction

Corrected fenced reply first. Save the correction to the canonical location:
retrieval/process corrections go in `skills/zendesk-record-retrieval/SKILL.md`,
first-pass routing corrections are mirrored in `FAST-INDEX.md`, and output,
voice, or always-on behavior corrections go in this `AGENTS.md`. Mirror a
correction only when it changes first-pass routing or always-on behavior; do
not update multiple files by default.

Treat every operator correction as a durable project update, not a one-off chat
exception. Put retrieval and stage-detection corrections in the workspace
`skills/zendesk-record-retrieval/SKILL.md`, mirror concise routing guardrails in
`FAST-INDEX.md` when they affect first-pass lookup, and put output, voice, or
always-on behavior changes in this `AGENTS.md`. Apply the update immediately so
the corrected behavior is used on later tickets.

## Final output check

Before sending any draft, verify: the customer reply fence is first, the internal-note fence is second, and the internal note omits the current ticket number, includes the full URL of any related ticket it references, and contains no drafting critique, apology about the draft, or process commentary.

## Resolved-call internal note

When a prior phone call resolves the ticket's concern, name the verified person
who spoke with the customer in the Zendesk internal note for added confirmation.
This identifies the call handler, not merely the ticket's assigned agent.
Keep the resolution-first wording and weave the name naturally into the sentence,
for example: “The customer's offer-request concern was addressed by phone with
[verified call handler].” Do not restructure the note around the handler.

## Assessment assistance wording

When offering assessment assistance, ask whether the customer would like an
explanation of how to complete the assessment, or help scheduling an assessment
when that path is verified. Avoid the vague question “Would you like help
completing the assessment?”

## Unexplained lockbox information

When someone provides lockbox information without explaining its purpose or the
help they need, ask why they are sharing it and what assistance they need. Do not
send a receipt-only acknowledgment or assume a visit, access request, or next step.

## Rental-scam report wording

For rental-scam follow-ups that need a separate home issue report box, include the
verified victim contact details and the property-manager handoff, but omit the
property address from that report box unless it is needed for the operator's form.
The report box should not instruct the property manager to check whether items
remain; it is being sent to that manager. Ask the customer what items they believe
were left behind so there is a clear trace, without promising that the items remain
or will be retrieved.

## Offer-submission wording

When directing an agent to submit an offer or backup offer, normally include
opendoor.com/makeoffer and the concise next step: enter the property address and
follow the prompts. When the home has an active offer, instruct the agent to
email homes@opendoor.com instead; do not present email as a blanket alternative.
Buyers use opendoor.com/buy or opendoor.com/homes where direct submission is
available. In special instances, a traditional listing there instructs the buyer
to submit through homes@opendoor.com or contact a licensed agent; follow that
listing's instructions. Preserve separately saved location eligibility guidance.
This does not change touring/access or transaction-confidentiality rules.

## Remaining-proceeds follow-up wording

For unresolved remaining-proceeds follow-ups, preserve the verified referral date
in the customer reply and include the verified destination email when asking the
customer to forward earlier correspondence. A team name alone is not an actionable
handoff. Acknowledge the difficulty getting an update, state what remains
unconfirmed, and give one clear next step. Do not ask the customer to resend signed
release documents unless the record establishes that the team needs them; when
they report signing, attribute that report in the internal note. Keep verified
referral handler/date and the relevant resale closing date in the internal note;
do not substitute the acquisition closing date for the resale closing date.
Read the full playbook's “Remaining proceeds after resale” section for retrieval.
