# Post-verification documentation

Use after a supported Alfred outcome and refreshed OpsHub statuses are verified.
Sam's November 19, 2026 authorization makes these two customer notes part of
future end-to-end agent verification, without another post confirmation or chat.
This maintenance change never resumes the recorded case or any other old case.
Lookup-only, draft-only, leave-unchanged and source-correction requests do not
authorize notes. A denied case documents its actual denial, never Allow/Verified.

## Retain one caller and two independent receipts

Bind the original request/call, resolved customer UUID, Alfred case, supported
outcome, current license/credential evidence and supplied call facts. Both notes
go to that caller's OpsHub customer CONTACT, never a property or another contact.
Reuse current evidence and the operator token; do not rerun the lookup or reopen
Alfred just to write notes. Carry the existing identity/contact-conflict gates
into posting. If required merge/cleanup changes the UUID, use the shared merge
owner and verify the surviving caller UUID before either create.

Track each note separately by kind, caller UUID, original request/call, exact
body, returned note ID and observed save outcome. A verified existing note for
this call completes only that kind. On continuation, reuse it and post only the
remaining authorized note. Similar text from another call is not a receipt.
A timeout, click acknowledgement, missing receipt or case-closed checkpoint
does not establish a saved note. Reconcile the uncertain note on the same
customer before any further write; do not automatically create again or advance
to the second note while the first is unconfirmed. Retain concrete blockers.

## 1. IDV verification note

Create a separate plain-text note using the observed fields below, not the
five-field call-note template. Sam clarified this note's evidence mapping on
November 23, 2026. Read the current caller's settled **Full Results**, not an old
Threat Highlights label or an initial “Unknown Customer”/N/A loading placeholder.
Wait for the caller heading and result state to settle before classifying Mitek
as present or absent. Retain these observations for the note; do not rerun a
completed credential search or reopen a closed case merely to compose it.

When matching phone/email evidence, a completed populated matching Mitek
response and verified agent credentials are all established, use:

```text
Customer Type: Agent
Final HAS: Allow
IDV Passed: Y
Verified via: Phone / Email / ID / Agent Credentials
Red Flags: None
Notes:
```

With the same phone/email and credential matches but settled missing/N/A Mitek
information, use **IDV Passed: N** and
**Verified via: Phone / Email / Agent Credentials**. Missing ID information
removes ID only; it does not erase independently observed Phone/Email matches.

- **Customer Type** reflects the resolved caller, not the property owner.
- **Final HAS** is the verified saved home-access outcome, not a proposed answer
  or confidence score. Preserve the actual Deny outcome when applicable.
- **IDV Passed** is **Y** for this note when the matching caller's settled
  Mitek **Submission status: COMPLETE** response contains populated, matching
  ID details, or an explicit successful identity-validation result. The Mitek
  section need not display a separate “Passed” label. A populated matching name,
  identifying details and dossier support the completed response; incidental
  N/A fields or UNKNOWN_ID_TYPE do not by themselves turn it into N. This is the
  XA note convention, not a claim that each vendor subcheck separately passed.
  A heading alone, unrelated data, an in-progress response or a name mismatch is
  not sufficient. Settled absent/N/A Mitek information or an explicit current
  failed result means **N**; absence is not a failed test or fraud finding.
  Unreadable, still-loading or conflicting current evidence is unknown: retain
  the documentation blocker instead of guessing a value or posting.
- **Verified via** lists every actually established method in this order:
  **Phone / Email / ID / Agent Credentials**, omitting only unsupported methods.
  Caller-bound phone and email matches in the live credential result or the
  corresponding Ekata “Match to name: Match” fields support **Phone** and
  **Email** respectively. A source saying the raw contact is “Not stored in
  ekata” does not cancel its separately displayed match result. Mere stored
  contact values or their use as search inputs are not match evidence. **ID**
  accompanies the qualifying Mitek result above; a verified license/agent match
  supports **Agent Credentials**. Credential verification alone never adds ID;
  missing Mitek information never removes established Phone/Email matches.
- **Red Flags** is **None** for a supported, verified saved **Final HAS: Allow**.
  Do not copy a resolved historical denial or old “Mitek ID verification failed”
  Threat Highlights entry into that final note as an active red flag when the
  current review supports Allow and the settled matching Mitek response above.
  Preserve Alfred's underlying audit history; note wording never deletes it.
  A current explicit failure, conflicting identity or unresolved current risk
  must be reviewed before treating Allow as a clean supported outcome: retain
  the documentation blocker rather than silently suppressing the conflict.
  For a supported Deny, record the actual current denial findings. Never post
  the template alternatives `None / [list]`.
- Leave **Notes:** blank. Put the normal call narrative in the separate XA note.
  Do not append the call note or replace either note with “Confirmed and verified.”

Prefer a sufficient direct OpsHub connector. Use the owning XA posting method:
`CreateCustomerNote` with `contextType: "CONTACT"`, the verified caller UUID
string as `contextIdentifier`, this exact completed plain-text body and the
cached `whoami` operator token as `createdByToken`. The IDV body is intentionally
not an XA five-field body. Submit once; retain the returned ID and verify that
ID/body in the same customer's notes before proceeding. If connector readback
is insufficient, inspect only the matching Notes panel through the existing
bound background workflow, under the shared browser rules. Do not switch to the
operator's window. If verification is blocked, report that specific blocker.

## 2. Normal XA post-call note

Use the current registry/inventory-selected **xa-notes** owner for drafting and
posting, including the active XA project's applicable wording and posting rules.
In this workspace that owner is
`/Users/sam.gutierrez@opendoor.com/Documents/ChatGPT Work/XA Post Call Notes/skills/xa-notes/SKILL.md`
with its project `AGENTS.md`; do not substitute the outdated global/plugin
variant. In a packaged installation, use its configured authoritative xa-notes
source. Load its exact current content once if not attached, then reuse it.

Pass an explicit authorized handoff: **Post the normal XA note for this same
verification call**, with the retained caller UUID, current draft/call facts,
supplied property, verified actions and IDV-note receipt. This authorization is
limited to this enclosing workflow; ordinary XA drafting still never auto-posts.
Keep the XA note's five fields, standing expansions, stated-action limits,
customer CONTACT target, property/link rules and duplicate-profile safeguards
with that owner rather than duplicating those rules here. Reuse sufficient
same-call context instead of rerunning customer resolution for a second chat.

Call facts may arrive with the first request or after verification; merge them
into this same retained call before deciding anything is missing. Within this
explicit handoff, a later “agent”/caller label or repetition of the same phone
and property does not start a new call, discard receipts or rerun verification.
Keep the verified caller/property unless the operator actually changes them;
resolve a changed/ambiguous target before any write.

A credential check/Allow status alone does not mean an appointment was scheduled,
a code was supplied, a showing occurred or access instructions were sent. Once
the operator says they scheduled an appointment for this agent, that is an
established call fact and customer-facing action. Pass that shorthand and the
retained verification outcome to the XA owner; do not ask again “What was the
caller’s concern, and what did you tell them?” merely because separate concerns
or an exact appointment date/time were not supplied. Use the owning note's
stated-facts/default-field rules, and omit unstated times, codes, participants
or other actions rather than inventing them. This documents the operator's
action; it never authorizes booking or changing a visit.

If no usable call narrative has been supplied, verify/save the IDV note first
and ask one concise text-entry request in this conversation, such as:
“Verification is complete. Add the call details for the XA note—what did you
help the agent with?” Ask only for a genuinely missing fact needed for the
requested note; do not require a field-by-field interview, repeated caller
phone/address, another chat, or a second posting approval for the already
authorized end-to-end workflow. A bare “proceed” supplies no missing call facts.
A source correction, decision-only limit or explicit do-not-post instruction
still retains its narrower authority until the operator changes it.

When the operator provides sufficient late facts under the retained posting
authority, continue only the remaining XA note through its owner and verify its
own receipt. If the first note's readback is still uncertain, retain the new
call facts while reconciling that existing note on the original caller first;
do not recreate it or treat a case closure as its note receipt. An open browser
dialog is not a connector-readback failure: prefer a sufficient note-ID/body
read without disturbing the operator's dialog. Preserve a real remaining
readback/access blocker instead of claiming completion.

Post and verify the XA note separately, preserving its returned ID/body under
the same call. If it fails, report **IDV note: posted; XA note: pending/unconfirmed**
as actually observed. Do not erase a successful first receipt, reopen a closed
case, or repost the first note to retry the second. An authorized correction
updates only the intended verified note ID under the owner's update rules;
a wording/source correction by itself authorizes no post or repost.

## Finish and interruption handling

Run the terminal customer probe only after both notes are verified and no
customer work remains. Closure/status evidence never proves either note saved.
If documentation is blocked, return the actual verified closure/status result
and each note's separate pending/unconfirmed blocker, retaining that conversation
for continuation. Do not call the terminal probe merely to clear unfinished work.
A verified final summary reports both note outcomes without dumping identifiers,
bodies or private operator tokens. Close only workflow-created tabs when done.

## Synthetic acceptance scenarios

Review these without live customer writes:

- COMPLETE, populated caller-matching Mitek + actual phone/email matches +
  verified credentials + supported saved Allow: Y; Phone / Email / ID / Agent
  Credentials; Red Flags: None. An old Mitek-failure highlight is not carried
  into the note. Incidental N/A/UNKNOWN_ID_TYPE fields do not negate this mapping.
- Settled missing/N/A Mitek + actual phone/email and credential matches +
  supported saved Allow: N; Phone / Email / Agent Credentials; Red Flags: None.
- Settled missing/N/A Mitek + verified license only + supported saved Allow:
  N; Agent Credentials only. Stored phone/email alone never adds either method.
- Raw contacts “Not stored in ekata” with the caller-bound corresponding match
  fields showing Match: retain the supported Phone/Email methods.
- Initial Unknown Customer/N/A placeholder followed by matching COMPLETE
  results: classify the settled results, not the initial placeholder.
- Populated Mitek for a different caller, incomplete Mitek, an explicit current
  failure or conflicting current evidence: never infer Y from data presence;
  preserve the actual evidence and required review/documentation blocker.
- Mitek unavailable: retain closure evidence and a documentation blocker; do not
  manufacture an N/A result or post a guessed first note.
- The separate XA note uses supplied call facts, not invented scheduling.
- First note saved, second blocked: continuation retains the first ID and creates
  only the missing second note after its blocker is resolved.
- Either save times out: reconcile that kind on its original caller before any
  create; no second create on a new current customer.
- Verification-only input lacks call details: IDV note can complete; ask once
  for the remaining call narrative, without assuming a showing.
- A later appointment-scheduled summary in the same retained verification:
  preserve the original caller/property and verified first-note receipt; pass
  that sufficient shorthand to the XA owner and complete only the authorized
  remaining note. No repeated identity entry, credential lookup, case closure,
  generic concern/resolution question, extra posting approval or invented time.
- Late facts arrive while the IDV note is unconfirmed: retain those facts;
  read back the existing same-call note first, never create it again.
- Decision-only/no-post handoff: facts may be retained, but no note is posted
  until the operator authorizes that remaining action.
- Operator asks to edit these instructions or supplies this recording: save the
  source only; no live case closure, note post, retry or browser attachment.
