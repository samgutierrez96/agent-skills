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
five-field call-note template. For the supported Allow/Verified example where
Mitek shows N/A, credentials were verified and no current red flags were found:

```text
Customer Type: Agent
Final HAS: Allow
IDV Passed: N
Verified via: Agent Credentials
Red Flags: None
Notes:
```

- **Customer Type** reflects the resolved caller, not the property owner.
- **Final HAS** is the verified saved home-access outcome, not a proposed answer
  or confidence score. Preserve the actual Deny outcome when applicable.
- **IDV Passed** is **Y** only for an explicit successful identity-validation
  response for this caller. Alfred/Mitek **N/A**, missing identity-validation
  information or an explicit failed result means **N**. N/A means not
  passed/not established; do not turn it into a fabricated failed test result,
  fraud finding or automatic denial. Unavailable/unreadable evidence is unknown:
  report it and keep this note pending instead of guessing N or Y.
- **Verified via** lists only methods actually established for this caller.
  A verified license/agent match supports **Agent Credentials**. Merely using
  the stored phone/email to find the customer or populate the lookup does not
  verify either contact method. Do not include Phone or Email unless separately
  confirmed by evidence. Do not invent credential verification for a denial.
- **Red Flags** is **None** when the current review establishes none; otherwise
  record only supported current findings. Never post the template's
  `None / [list]` alternatives or carry historical flags forward as new facts.
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

A credential check/Allow status alone does not mean an appointment was scheduled,
a code was supplied, a showing occurred or access instructions were sent. Use
viewing-call expansions only when the operator supplied that call shorthand.
If call reason/concerns or the customer-facing resolution are missing, save the
verified IDV note first and ask one concise question for the missing call facts
here. A bare “proceed” is not a fact; preserve the pending XA note and ask for the
specific remaining detail. Never require a new chat or retyping known identifiers.

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

- Mitek N/A + verified license + supported Allow: first note says N and Agent
  Credentials only; second note uses supplied call facts, not invented scheduling.
- Explicit successful Mitek + supported Allow: Y is permitted; a stored contact
  alone never adds Phone/Email to Verified via.
- Mitek unavailable: retain closure evidence and a documentation blocker; do not
  manufacture an N/A result or post a guessed first note.
- First note saved, second blocked: continuation retains the first ID and creates
  only the missing second note after its blocker is resolved.
- Either save times out: reconcile that kind on its original caller before any
  create; no second create on a new current customer.
- Verification-only input lacks call details: IDV note can complete; ask only for
  the remaining XA facts in the same conversation, without assuming a showing.
- Operator asks to edit these instructions or supplies this recording: save the
  source only; no live case closure, note post, retry or browser attachment.
