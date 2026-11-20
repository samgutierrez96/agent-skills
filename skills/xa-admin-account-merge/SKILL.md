---
name: xa-admin-account-merge
description: Detect and resolve duplicate customer profiles or extra contacts while posting an OpsHub XA note or escalation. Inspect multiple emails/phones and repeated customer links for distinct accounts; merge verified same-person duplicates, clean a single profile without a merge, or remove confirmed misassigned phones.
---

# XA Admin Account Merge

When this workflow actually requires a browser, follow the shared
`browser-navigation` skill at `~/.codex/skills/browser-navigation/SKILL.md`
(packaged alongside this skill). In Skill Router, use the configured Agent 360
connection while native worker Chrome remains unverified; desktop chats may use
the supported native integration. Retain direct-connector, no-browser,
background-window and authorization gates.

## Outcome and speed

Target **under two minutes of execution for the Admin merge and verified OpsHub contact cleanup**, starting once the primary email and caller identity are confirmed, when Admin and OpsHub respond normally. Ask for any required details together before starting; user response time is outside this execution target. Resume the original note/escalation immediately after verification; separate Slack routing or posting work adds its own time. This is a performance target, never a reason to skip checks or claim success early. Prioritize few tool round trips, small outputs, and reuse of verified context.

Merge verified same-person duplicates in **Admin** (`admin.opendoor.com`); then clean contacts in **OpsHub**, verify, and post the original XA note/escalation. Extra contacts require the duplicate-detection check below before choosing single-profile cleanup. Unrelated-person matches take the separate phone-cleanup path, never a merge. Never substitute an OpsHub contact edit for a required Admin merge.

The complete current source attached by the runtime counts as loaded; apply it
without rereading this file. On a real profile conflict, reuse the first lookup
and any required property-identity check, then return the missing caller/identity
and contact-choice questions together as independent explicit answer lists. Do
not delay that clarification for browser setup, execution-reference reads,
unrelated customer history or a newly regenerated note. A known shared phone
does not prove same-person ownership; keep the original post pending. Once the
answers satisfy the gates, continue the retained authorized workflow immediately
using those facts and completed-action receipts, not another round of lookups.

## Preconditions

- Use the applicable XA caller verification. Reuse verification already completed in this workflow.
- **Entry gate:** this workflow starts only from an XA-reported duplicate/contact problem or a concrete signal exposed by required caller/property reads. A unique verified caller match with no observed conflict stays on the originating MCP-only posting path. Do not fetch full contact lists, open a browser, or perform a contact audit merely because optional fields are absent or a profile tool returns activity history. Missing target identity still requires clarification, never a guessed post. Once a real signal exists, retain all classification, same-person, primary-choice and verification gates below.
- **Split phone/email seller profiles:** when required caller/property reads expose distinct caller-phone and property-seller UUIDs, compare their retained identities. Do not add a property/contact read solely to search for a hypothetical split on an otherwise resolved routine post. An email-only seller profile on that property plus a distinct caller-phone profile is a duplicate candidate even without a shared phone, matching email, multiple phone-search hits, or a Potential Duplicates entry. Missing phone on the property profile and missing email/name on the caller profile do not dismiss the pair as stubs. Retain both exact UUIDs, displayed identities, known emails, original caller number and property relationship.
  Complementary contacts or a shared property alone do not prove the same person. If the caller's ownership of the email-only seller profile is not already verified, explain the split and ask whether both profiles belong to this seller, using the separate identity answers below. Ask for the keeping email in that same turn only if it is genuinely unconfirmed, listing the known email(s); one listed email is not an operator confirmation. Email selection never answers the identity question. Reuse prior explicit confirmations and do not ask again when both facts are established. Keep the original send/post pending until identity, keeping email, Admin merge and cleanup verification are complete. Do not silently choose one UUID, post to both as different people, or just add the phone/email to bypass an actual merge. Once verified, keep the confirmed email profile and merge the retained distinct phone profile in Admin under the existing authorization; inspect the exact candidate even if Admin did not suggest it automatically. A different person, uncertain ownership, same UUID returned twice, or a single email-only profile with no separate phone account is not an authorized two-account merge; clarify only missing facts and never create a duplicate to merge.
- **Unnamed phone-only exception:** once the caller and keeping profile are verified, merge a remaining unnamed profile whose only contact is that same normalized caller phone into the keeping profile in Admin. Blank or generic placeholder names do not supply another person's identity. This is a qualifying duplicate even without an email or compatible personal name; do not ask for another identity confirmation, try to strip its sole phone, or block because OpsHub has no phone-removal control. Inspect the full candidate before submission: a different person's displayed name or other conflicting identity evidence excludes this exception and stays on the separate identity/phone-cleanup path. Preserve the selected caller, primary email, original phone and all merge-result/posting verification guards. This exception overrides the compatible-name requirement below only for this unnamed, phone-only case.
- Resolve the keeping customer and property from the verified caller context. A candidate in that customer’s **Potential Duplicates** list qualifies when its normalized phone matches the verified caller phone and its displayed name is compatible: a matching first name with a missing surname is sufficient. An Agent role, absent surname, or different email spelling is not by itself conflicting identity. Reuse an XA confirmation that the profiles belong to the same person. Potential Duplicates is a candidate list, not proof for unrelated people: a shared phone alone with no compatible name or prior XA confirmation, an affirmative name/phone conflict, or unresolved property scope requires clarification before submission.
- A named profile with the same normalized verified caller phone is a duplicate candidate even when its email is blank. Apply the compatible-identity or prior XA same-person confirmation rule above; missing email alone never excludes it. Keep the confirmed primary-email profile and inspect its Potential Duplicates in Admin. Ignore only true placeholders such as `Client-####` with no independent compatible identity or verified matching phone; do not classify a named, matching-phone profile as a stub just because it has no email. Without a duplicate/contact signal, return directly to the original note/escalation MCP path; do not inspect contacts or initiate cleanup.
- **Ask only for needed information:** once the primary email and qualifying identity are established, a usable personal name is not an additional prerequisite. If neither inspected profile supplies a usable personal name and the XA has not provided one, preserve the keeping profile's existing name fields and continue the authorized workflow. This includes an email used as the displayed name: retain it as-is until a real name is supplied; do not infer a name from it, require first/last fields, or ask again for the confirmed email. Missing names alone are not an identity conflict. Ask about the name only for a genuine identity ambiguity or an actionable surviving-name choice supported by an inspected profile or XA-supplied name: differing personal names/spellings, occupational labels around a personal name, a full name duplicated across first/last fields, or another malformed split of a known personal name. Same-person confirmation does not choose between actual personal names; selecting a primary email does not choose a supported name correction. Collect all genuinely missing identity, email and actionable name choices in the same clarification as independent questions. Reuse explicit answers; do not ask for a name again when the XA already supplied the corrected fields or said no name was provided and to proceed as-is. An unknown-name full-form validation restriction takes the schema-backed contact-only path or the rare operator-authorized temporary-name fallback below, not another question for an unavailable name.
- **Rare temporary-name fallback (Sam-authorized November 19, 2026):** the XA should normally obtain the caller's real name during the call. If no usable personal name exists in either inspected profile or the supplied caller context, and OpsHub's required name fields block an otherwise authorized edit, first name `Customer` / last name `Customer` is allowed as a temporary placeholder without another approval or name question. Prefer the contact-only path when it can preserve existing fields; if that path is unavailable, use this exact pair in the scoped editor's same contact-cleanup save. An email-as-name is not a known personal name and may take this fallback. Never overwrite any known personal name, choose this instead of an available genuine name correction, infer a name from an email, or use the placeholder as identity evidence. It does not resolve conflicting accounts, missing contact types, uncertain writes or another action blocker. Verify both placeholder fields with the complete saved contacts, identify it as temporary outside the note, and use the verified real name when it is later supplied. This rare recovery is not the routine caller-name collection process and does not resume a customer task during source maintenance.
- The duplicate-profile workflow authorizes the complete merge → contact cleanup → verification → original authorized posting sequence once the primary email, original caller phone and qualifying caller identity are established. Carry those confirmed facts through the full sequence without another approval question. Treat an email-only reply as the primary choice, retaining customer-name or same-person verification already completed. A confirmed phone or name that unambiguously selects the keeping record reuses its already-known primary email and verified identity; do not ask for the same information in another form. A shared phone or ambiguous name alone does not resolve conflicting identities or select between unresolved primary emails. Different email spellings on otherwise qualifying duplicates are not a new identity conflict.
- Do not add workflow-level “same person?”, “do you want to merge?”, “confirm removal,” or “post the note?” questions after the relevant facts and original posting authority are established. Removing secondary emails and extra phone entries from the surviving caller profile is required cleanup under steps 6–7, preserving the confirmed primary email and original supplied phone; a leftover secondary email triggers cleanup, not a new primary-choice question. Retain genuine identity/misassignment conflicts, draft-only limits and uncertain-action verification guards.
- **No redundant browser approval:** once the primary email, original caller phone and qualifying identity are established, inspect the exact keeping record, duplicate targets and desired contact lists, then perform the authorized merge and required cleanup without asking again. Review Admin's irreversible warning yourself and use its visible confirmation control; the warning is an execution check, not a new XA decision. Do not generate a “Required browser approval” prompt, proceed/stop choices, or another merge/removal/post confirmation merely because the action is irreversible or a secondary contact is listed. Ask only for a genuinely unresolved identity, misassignment, keeping-contact choice or changed scope. Recover bounded search/navigation failures in the current run; stop only for an actual capability/access/tool-policy restriction, failed step, or unresolved action outcome, and report that concrete blocker. Honor a real tool/runtime-enforced restriction through its supported mechanism, never invent an approval from a page warning or bypass a restriction. Preserve draft-only limits and completed-action receipts; source maintenance never resumes the customer task.

## Required answers in any containing workflow

When a genuinely missing choice blocks a merge or cleanup, make its available answers
explicit rather than leaving them implicit in prose. This applies when called
from XA notes, escalations, Zendesk, or the standalone merge workflow. Put each
question outside note copy boxes, followed by a blank line and a plain bullet
list of short, complete answers. Skill Router renders those answers as buttons;
do not depend on its recognizing a particular sentence or ask the XA to type an
answer that is already offered. These choices resolve genuinely missing facts;
do not add merge/cleanup approval choices after those facts are established.
For an unresolved identity conflict, for example:

Does this account belong to the verified caller?

- Yes—same person
- No—not the same person
- I’m not sure

For a required primary-email choice, list the actual known candidate emails
with their displayed profile names, not invented contacts. Offer these matches
in the first clarification instead of a bare email-entry question when the
lookup already supplied them. Retain typed entry for another email or unknown
information. Selecting a name/email identifies the caller’s account, not
ownership of every shared-phone match. Collect several missing details in the same message as
separate question-and-answer-list groups. Each selection answers only its own
question: choosing an email does not confirm identity. Unknown information still
needs a typed answer; uncertainty never authorizes a merge. Do not add a question
when the preconditions already establish the answer. Reuse confirmed answers,
the original caller/workflow and pending authorized actions; continue that same
workflow after its remaining verification gates, without another merge/post
request or replaying completed actions.

For an unresolved surviving-name choice, ask **Which name should the merged
profile use?** Reuse the retained names from **both** inspected profiles, not
only the keeping-email profile. List every distinct usable personal name as an
explicit answer, including its supported first/last split, so Router renders
buttons; do not return a bare name-entry question when either profile already
supplies an option. Include **Enter a different name (provide first and last
name)** as the final answer option to open typed entry, not as a name to save or
a complete answer. For example, synthetic profiles might offer:

Which name should the merged profile use?

- Alex Morgan — first name: Alex; last name: Morgan
- Alexandra Morgan — first name: Alexandra; last name: Morgan
- Enter a different name (provide first and last name)

Explain that any existing same-person confirmation is retained. Deduplicate
identical cleaned options; even one supported correction gets a button alongside
the different-name option. Identify a blank or placeholder-only profile as
having no usable personal name; do not hide the other profile's usable name or
offer the placeholder as a personal name. If neither profile supplies a usable
personal name and the XA has not supplied one, do not open a name question or
require typed entry; preserve the keeping profile's current name fields,
including an email-as-name, and continue under the preconditions above; only the explicitly authorized rare temporary-name fallback may replace those unknown-name fields when required to save. When a real displayed name has an
uncertain split, show that name with **(provide first and last name)** and collect
the split before saving. Reuse retained profile context for these options; no
extra lookup is needed just to construct the question. Do not invent spellings,
infer names from email addresses, or arbitrarily split multi-part names. Present
personal-name options without occupational labels such as REALTOR or Broker;
preserve agent/vendor roles, brokerage and other unrelated fields. Apply only
the selected or explicitly supplied first/last pair during the authorized
cleanup, retaining the primary-email keeping UUID. A name choice neither
confirms identity nor changes the keeping email/account. Resolve an already-known
name choice before the first mutation, not after completing the merge.

An XA's explicit custom name resolves this choice; do not ask how to save the
same name again. Accept labeled First name / Last name fields exactly as
supplied, including an LLC in parentheses in the last-name field. Also accept
an unambiguous two-part personal name followed by a parenthesized company: for
`Alex Morgan (Example LLC)`, use first name `Alex` and last name
`Morgan (Example LLC)`. Preserve the operator's spelling and parenthetical text;
do not remove it, move it to company information, or offer those alternatives
as another question. This explicit selection is not an occupational-label
cleanup or new identity conflict. Ask only for a genuinely ambiguous multi-part
split, missing field, contradictory answer, or actual editor restriction, and
ask only that unresolved detail. Retain the established same-person and primary
email answers while continuing the original authorized workflow; do not require
the XA to retype them alongside the name. A custom name alone still does not
confirm identity or choose an unresolved primary email.

## Extra contacts and repeated customer links — detect before classifying

During an authorized post/escalation, inspect the selected customer's complete
email/phone lists and the customer links exposed by the required matched-property
read. Multiple emails, multiple phones, or repeated compatible customer entries
are a duplicate-detection signal even when the original caller-number search
returned one account. Do not wait for the XA to mention duplicates. First flag
the observed issue outside the note, for example `This OpsHub profile has multiple
emails and phone numbers — checking for separate customer accounts before
posting.` Mention only the contact types/links actually observed; this is not
yet a merge or cleanup receipt.

Reuse the retained full contacts, property customer links and lookup evidence.
Read the exact UUID from each relevant customer link; deduplicate repeated rows
resolving to the same UUID, but do not dismiss different UUIDs because their
displayed names, roles or contact summaries match. Inspect each distinct relevant
candidate's identity and complete contacts, including email-only and phone-only
profiles. If retained evidence cannot resolve candidates behind extra contacts,
perform focused exact-email/exact-phone lookups for those observed contacts,
deduplicating normalized values and results. Do not repeat the same caller-number
search or search broadly by name. A single phone hit, an Agent role, an empty
Potential Duplicates list, or lack of a shared phone does not rule out a distinct
email-linked/property-linked account. Reuse complete current evidence rather than
starting discovery again on continuation.

Classify only after this check: distinct qualifying same-person accounts require
the existing Admin merge followed by cleanup; one verified UUID with extra
contacts and no unresolved separate-account candidate takes single-profile
cleanup below. Unrelated accounts retain their separate identity/misassignment
guards. Multiple contact rows alone do not prove multiple accounts, and multiple
same-name rows alone do not authorize merging. If a candidate cannot be resolved
because evidence/access is missing, keep the original task pending and report
that precise detection blocker; never label it cleanup-only or post around it.
Retain candidate UUIDs, qualification decisions and completed receipts through
the original workflow. These checks do not run for ordinary tool-free drafts or
skill maintenance and do not authorize unrelated customer searches.

## Single-profile OpsHub cleanup — no merge needed

When the detection check establishes one verified caller profile with extra
emails or phones and no unresolved distinct-account candidate, skip Admin and
clean that exact OpsHub customer. The caller number not being attached to another
page is insufficient on its own; check the observed emails, other numbers and
property customer links first as above. Never create a duplicate to merge.

Keep one correct primary email and one correct primary phone on the selected
caller profile, removing its extra entries. Reuse the verified original caller
number and any explicitly supplied/confirmed keeping email, including earlier
answers retained with this request. Do not ask again because a confirmed value
was omitted from the latest message. If the keeping email is genuinely unknown,
ask which email is correct using the actual known candidates as explicit answers
under Required answers above, with typed entry for another email. If several
phones exist but the correct phone is unknown, ask only which number to keep.
Collect all known missing choices together before editing. Do not choose from
list order, a primary badge or email spelling. Missing email alone does not
authorize inventing one or block an otherwise valid phone-only caller under the
containing workflow.

Once identity and necessary keeping-contact facts are established, the original
authorized post/escalation includes cleanup without another removal, merge or
posting approval question. Send `OpsHub profile cleanup started — no merge needed`,
skip steps 1–5 and enter steps 6–7 on the same retained customer UUID without
the Admin-verified status. Use the same supported contact-only update/scoped editor,
preserve unrelated fields, save once and verify the full persisted lists before
step 8 continues the original authorized task. If already correct, reuse the
fresh complete read and skip the write. Preserve draft-only/paste-only limits;
maintenance never authorizes live cleanup.

Keep a blocked task pending with `OpsHub profile cleanup blocked` and the actual
missing fact, failed save or unverified field, never an unverified merge. Reconcile
an uncertain save before another write. Report verified cleanup separately from
posting; use `OpsHub profile cleanup completed — no merge needed` only after both
cleanup and the original authorized posting succeed. Never claim an Admin merge
on this path. This sole-contact cleanup applies to the selected caller, not
unrelated profiles or legitimately shared numbers on other accounts.

## Unrelated-profile phone cleanup

Classify each retained match separately using the verified caller and selected
name/email. Merge only qualifying same-person duplicates. A concrete unresolved
name/identity conflict requires the separate identity question above; an email
selection alone never confirms identity or an incorrect phone assignment.
Retain the existing compatible-identity rule for a missing surname, Agent role,
or different email spelling. An unnamed, phone-only profile with the same
normalized verified caller number qualifies for the unnamed-profile exception
below; do not treat a missing name as a conflicting name. A profile displaying
another person's name does not qualify for that exception and must not be merged
on the strength of the shared number alone.

When the XA or verified record evidence confirms that a mismatched-name profile
belongs to a different person and the caller’s number is misassigned there,
remove only that normalized caller number from that unrelated profile in OpsHub.
This is the standing cleanup path; do not request another merge or cleanup
command once the required identity/phone facts are established. A verified caller
merge does not finish cleanup while that caller's number remains misassigned to
another person's OpsHub profile. Keep the caller's correct merged profile, email
and original phone intact; remove the stale attachment only from each verified
unrelated profile. A different displayed name plus a shared number alone does
not establish misassignment; reuse the XA's explicit confirmation or verified
record evidence rather than asking again for an already-established fact. Preserve a
legitimately shared household, business, or agent number. If shared use or phone
ownership is uncertain, ask only that unresolved question and make no removal.
Never merge unrelated people, delete their accounts, remove their emails or
other numbers, or overwrite their names with the selected caller.

Retain each exact unrelated customer UUID and the verified caller’s original
number. Match targets by exact UUID and full displayed identity, not name
fragments; one person's multi-part name does not establish several profiles.
Inspect that target’s identity and full contact lists immediately before
editing, expanding any additional-number disclosure and reading every phone row
in the scoped Customer Info editor. A compact lookup, a collapsed list, or a
single inspected input cannot establish that the caller number is its only phone.
If current evidence shows another number, resolve an earlier sole-phone claim
against the fresh complete list before reporting a blocker. Use the
schema-supported contact-list replacement or scoped Customer
Info editor described below, not guessed fields. Remove only entries matching
the normalized caller number and save once, preserving every other contact and
unrelated field. Never apply the keeping-customer “sole primary phone/email”
cleanup to an unrelated account. When other legitimate numbers are present,
remove only the misassigned caller number and retain those numbers and their
existing primary state. Do not stop merely because the profiles were already
merged or a compact tool omits a removal action: inspect the supported scoped
editor before declaring removal unavailable. If a fresh complete read and the
supported editor/schema establish that removal is unavailable, or an actual
save rejects removal of its only or primary phone, stop and report the exact
target and observed restriction; do not invent a replacement, choose
another contact as primary without support, or delete the account.

After each save, freshly read the complete contact lists to verify the caller
number is absent and every other contact is unchanged. Also verify the selected
caller still retains the original number. Reuse verified cleanup on resume;
inspect an uncertain save before retrying, never blindly repeat a write.

For a mixed set, complete steps 1–7 for qualifying same-person duplicates, then
perform unrelated-profile phone cleanup before step 8 posts. If no same-person
duplicates remain, skip Admin entirely, perform only this cleanup, and resume
the original authorized note/escalation against the selected caller UUID under
the existing posting guards. Keep the original request pending while required
identity or misassignment answers, cleanup, or verification are blocked; report
the exact blocker. Report verified phone cleanup, never an Admin merge, for a
cleanup-only result. Maintenance requests never authorize live customer edits.

## Execute once, in order

Steps 1–5 apply only to required same-person Admin merges. Single-profile cleanup
enters at step 6 as specified above and keeps its own statuses; step 8's merge
completion status applies only when a merge occurred. Admin availability is not
a gate for either OpsHub cleanup-only path.

1. Send `Account merge started`. Reuse the original lookup's surviving customer UUID, supplied phone, duplicate IDs, and confirmed primary email; retain them through completion. Avoid another lookup unless evidence is missing or contradictory.
2. Open Admin in a separate **unfocused** task window using the selected browser's documented controls under `browser-navigation`. In Skill Router, use the re-enabled Agent 360 MCP connection; desktop chats may use native ChatGPT Chrome when supported. A tab group in the operator's window is insufficient. If the selected surface cannot provide the required background window, report that precise capability blocker and retain the pending workflow. Reuse an existing window belonging to this workflow if available. Never reuse the user's active tab or steal focus.
3. Follow the XA's demonstrated search sequence: **open `https://admin.opendoor.com` → click Customers → finish typing the full confirmed primary email → press Enter**. Use the visible Customers link; `a[ui-sref="customers"]:not(.nav-list-item)` worked in the October 22 checks, while the generic text selector selected a covered duplicate navigation link. Wait for `input[placeholder="Search"]` to exist before filling; a successful click does not mean the destination has finished loading. Keep that field focused with the cursor at the end. Use the selected surface's documented Enter control, then wait for and verify the actual matching result. If it does not appear, complete **Search submission and same-run recovery** below before declaring a blocker; repeating Enter is not that recovery. Admin result links use numeric Admin IDs, not OpsHub UUIDs: wait for a result row containing the confirmed full email, read its actual href, and retain that Admin ID. Never wait for an OpsHub UUID substring in an Admin href; this wasted 15 seconds on October 26. Do not bypass the Customers click with direct navigation or scripted form submission. Do not search by name. Use verified phone/another confirmed identifier only when the primary email is unavailable.
4. Open the primary-email record (the **keeping** customer), then reach **Links → Merge** using the state-based navigation below. If already on this customer’s Links page, skip the Links click; if already on its merge page, skip navigation entirely. Select the qualifying duplicate immediately; opening its details is inspection and does not submit a merge. Check the displayed keeping customer and primary email, review the irreversible warning, then click **I'm sure. Merge them.** under the existing workflow authorization. The agent handles this Admin confirmation; do not turn it into a new XA approval.
5. Immediately after the final click, send `Merge submitted — checking Admin result`. This is not a success receipt. Inspect the automatically refreshed surviving Admin profile and the merge-success checkmark/confirmation. Continue the visible **Merge → I'm sure. Merge them.** sequence for each remaining distinct, qualifying unmerged account, including named matching-phone profiles with no email, until no distinct unmerged accounts remain. **A duplicate entry may remain after a successful merge.** When the success checkmark/confirmation is present and the remaining entry resolves to the same surviving account with matching name, normalized phone and primary email (including the same surviving UUID when displayed), the merge is complete; do not merge that account into itself, require the sidebar or search results to become empty, or block the original post because the linked entry is still listed. These merged entries share notes, so post once to the confirmed surviving customer, not once per entry. The agent owns result verification: inspect Admin directly; never ask the XA whether the merge is confirmed, whether it succeeded, or to watch Admin or supply a confirmation screenshot. A voluntarily supplied XA completion report/screenshot may be reused to avoid replay, but must not become a requested prerequisite or an unanswered confirmation question. If the XA says they do not know or are not looking, that supplies no completion evidence and is not a new identity/approval decision: perform the focused result check yourself. Matching names/contact details or a generic keeping-customer checkmark alone, without completed-merge evidence or an already-supplied explicit XA completion report, do not prove that distinct accounts were merged. Establish qualification of any genuinely remaining distinct account from the retained evidence; continue under the established authorization unless a genuine conflict or actual tool restriction arises; skip manual refresh loops, full event histories, and contact cleanup in Admin. A merge-specific completed/success confirmation tied to the submitted keeping/duplicate pair is sufficient evidence even if the confirmation panel or duplicate entry remains visible; retain that receipt and proceed directly to contact cleanup. Distinguish it from the pre-submission irreversible warning or a browser click acknowledgement, neither of which proves completion. Do not stop merely because “the confirmation is still showing,” require it to disappear, or demand a second success indicator. If submission has an uncertain outcome and no completion evidence, perform the bounded result check and exact-account read-only recovery in the execution reference, retaining the exact keeping and duplicate IDs; never blindly repeat an irreversible merge. Only if that recovery still cannot establish completion, report `Merge submitted; result unverified` with the specific evidence checked, remaining distinct-account state or observed access/tool blocker, and keep cleanup/posting pending. Do not convert that blocker into a yes/no merge-confirmation question or ask the XA to certify success. Once the merge is confirmed, continue steps 6–8 without reopening it.
6. After verifying the Admin merge, send `Admin merge verified — checking contact cleanup`. Open the surviving OpsHub customer at `https://opshub.apps.opendoor.com/customers/<retained-UUID>` (plural `customers`, never `/customer/`) and inspect the **full email and phone lists**. Prefer an already-verified exact customer URL when retained. A 404 is a wrong route, not evidence that the customer disappeared: inspect the current URL immediately rather than waiting for Customer Info or returning through Admin. Keep only the confirmed primary email. If the XA lookup supplied a phone, keep that exact number as the sole primary phone and remove all others; otherwise preserve the existing phone list. Use the source-verified contact-only `UpdateCustomer` delta path in the execution reference when no name correction is pending and an unknown name would block the full editor; this preserves existing name fields rather than asking for an unavailable surname. It requires complete saved contact evidence, exact number/type targeting, and fresh verification; deltas are not replacement lists. Otherwise use the scoped customer editor, remove extra contacts in one pass, and save once with its exact form-associated Save. A generic `edit_customer.fields` object does not establish list support; never guess keys or try speculative writes. If Save is disabled, use the read-only full-form probe and the supported contact-only path before reporting the precise blocker, not another request to do the same edit manually. Preserve unrelated fields and communication preferences. If already correct, skip the write.
7. Perform **one fresh read** of the surviving OpsHub profile after cleanup; verify the complete lists show only the primary email and, when supplied, only the original phone with the same number. If a corrected name was selected, or the rare authorized temporary-name fallback was required, save its exact first/last fields with the contact cleanup in step 6 and verify those fields in this same read, preserving roles and all unrelated fields. If the fresh complete step-6 read already proves every desired field is correct and no write is needed, it satisfies this check. A fresh authoritative read tool suffices only if it exposes the full saved lists; otherwise reopen the scoped editor once after the save, not once per field. This is persisted-save verification, not another edit. Use `get_customer_profile(customer_uuid=...)` only if its documented response supplies the missing fields; `get_customer` takes a lead/address token, not a customer UUID. Extract only the relevant fields from a large response, never dump event history. Compact `list_customers` results, a primary-email-only response, and Admin's merge confirmation are insufficient. Retain the successful read and immediately send `Contact cleanup verified — continuing the original task`; do not recheck contacts during posting. An unchanged verification editor may stay open while a connector posts the note; do not cancel it and probe Customer Info again just to post. If UI posting requires it closed, use the observed Cancel once only when there are no unsaved changes. Note read-back never requires reopening contact editing. If the editor/read fails, allow one state-based recovery with a readiness wait up to 10 seconds; if still unavailable, report the exact unverified fields and stop rather than cycle through selectors, reloads and alternate tools.
8. After verification, including required unrelated-profile phone cleanup above, immediately resume the original authorized XA workflow, not a new draft-only task. A current escalation request such as `escalate to [person/team]` authorizes sending Slack and posting the CONTACT note: complete the escalation's routing/thread/coverage gates, send once, capture its verified permalink, then post the five-field note once to the surviving caller UUID. Do not ask whether to create a draft or send/post, and do not require another `send and post it` or `Post it`. Preserve an explicit draft-only/paste-only or do-not-send/post choice instead. For an authorized note-only task, post only that note. Reuse an already-successful Slack receipt and finish only the pending note; inspect uncertain outcomes before retrying. If this is a resumed run and the note is already confirmed posted, do not post it again. Send `Account merge completed — primary email and phone verified` outside the note only after the required cleanup and note posting succeed. Close the task window/tabs when done.

## Execution detail and reuse

Before an actual browser step, read [browser execution](references/browser-execution.md)
once together with the required shared browser-navigation guidance. This reference
contains the search submission/recovery, state-based Admin navigation, scoped
contact-editor recovery and browser batching procedures used by steps 2–7.
It is not a prerequisite for asking the initial missing caller/identity/email
question. Reuse its current contents and verified context; do not restart
discovery or read browser procedures while the XA answer is still missing.
A refreshed entry source invalidates older execution-reference reads: reload
the current reference once only when browser work next becomes necessary.

- **Finish posting verification once:** retain the original note body, surviving UUID and successful creation receipt. If a read-back is required by the containing workflow, prefer an available fresh authoritative current-note read or the newly rendered note card on that exact customer; compare the full intended body and available author/time evidence. If only a page refresh/revisit can expose the new note, do that once; it verifies the note, not the already-verified contacts. Once it matches, verification is done even if the UI does not expose the returned note ID as a DOM attribute. Do not search the whole page/history, inspect note HTML/ancestors or rediscover tools after that match. A receipt without the required read-back, a text fragment alone, or an unrelated old note is insufficient. If read-back cannot be established, use one focused recovery, then report `note accepted; read-back unverified` with the concrete blocker; never post again or claim failure of already-verified cleanup. Keep cleanup and posting statuses distinct so the operator can see what is actually pending.

## Operator corrections and source ownership

An operator correction or performance review is not a new live customer task.
Apply a current-output correction without repeating completed actions. Explain
delay or token concerns from the saved trace/context; do not rerun customer
lookups merely to discuss performance. Recommendations alone do not change the
skill.

Save a requested reusable correction in the existing owning passage of this
authoritative skill, or an existing registered agent configuration only when that
agent actually owns the behavior. Read related rules first. Amend superseded
wording instead of adding a conflicting rule. If already covered, apply the
existing rule and cite its exact passage; do not add a duplicate for an execution
failure. Keep customer identifiers and case-specific outcomes out of instructions.
Never create a parallel Skill Router rules file.

Verify saved content and report the exact path. Keep required canonical local
copies consistent through the established source inventory. Conflicting copies,
uncertain ownership or unavailable validation block a verified-save claim; use
Skill Router's direct-source reviewed save flow or report the specific blocker.
Local save and scheduled GitHub publication are separate. Updated instructions
need current context; never replay a merge, case closure, post or other external
action to refresh it.

## Failure and output

If a same-person Admin merge is required and Admin remains blocked after the search submission and same-run recovery above, report the specific observed blocker; do not merge in OpsHub. Admin availability is not a gate for the unrelated-profile cleanup-only path. **A failed or delayed Admin search does not authorize posting the note to the chosen email profile. Keep the note pending until merge and cleanup are verified.** Recover in the current run without requiring the user to repeat the merge request. If cleanup fails after an Admin merge, report **merge succeeded; cleanup blocked**, stop before posting/completion, and never reopen or redo the Admin merge. If posting alone fails, report verified merge/cleanup and the posting blocker accurately. Never attempt to reverse a merge.

Keep merge statuses outside the OpsHub note. Internal consolidation and contact cleanup are not the caller-facing solution: omit them from the five-field note unless the XA explicitly asks to document them. Preserve the original call resolution and guidance the XA gave the caller, including any stated scheduling restriction or team-lead direction. Never replace that solution with a merge summary or claim a scheduling action merely because a merge succeeded. If the XA requests merge documentation, include it only after verification and avoid unnecessary personal data.
