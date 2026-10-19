---
name: xa-admin-account-merge
description: Consolidate duplicate Opendoor customer profiles while posting an OpsHub XA note or escalation. Auto-use when `list_customers` returns multiple real profiles with distinct emails, or when shorthand mentions duplicate accounts or account cleanup.
---

# XA Admin Account Merge

**System of record:** Customer merges happen in **Admin**
(`admin.opendoor.com`). OpsHub is used after the Admin merge to remove the
merged email(s) from the surviving customer profile and, if applicable, to
post the CONTACT note. Never merge customer profiles in OpsHub.

Use only when duplicate customer profiles are found during an XA note or
escalation. Multiple real profiles with distinct emails are only a merge
candidate when the same verified customer name and phone number match on both
records and the email is the field being corrected. A shared phone alone,
different names, or a property-specific request without a verified property
scope is not enough evidence; leave the profiles unchanged and follow the
normal clarification or escalation path. A `Client-####` or other
placeholder/stub without its own real email is not a duplicate signal. This is
an internal Opendoor security/data-integrity step; caller consent is not
required. If no duplicate-account signal exists, stop and let the normal note
or escalation skill handle the request.

When the workflow runs, report status outside the note: send `Account merge
started` before Admin work and `Account merge completed — primary email and
phone verified` only after the surviving OpsHub profile is checked. Never put
these statuses inside the OpsHub note.

## Fast path

1. Verify the caller using the applicable XA process.
2. Ask once which email should remain primary if shorthand does not already
   specify it. Do not ask again after the email identifies the record. Do not
   post the note or ask which customer page to use while waiting for this
   answer.
3. In Admin, click **Customers** first. Start the search with the confirmed
   primary email, then press **Enter** repeatedly until the actual customer
   result loads; the search is broken if a single press appears to do nothing.
   Do not search by the caller's name, and do not treat a filled search field
   as a completed lookup. If the primary email is unavailable, use the
   verified phone number or another confirmed identifier only as a fallback.
4. Open the customer record with the chosen primary email. This is the keeping
   customer. Open **Links → Merge** from this record; do not start from the
   duplicate.
5. Select the duplicate record. Confirm the merge page shows the intended
   keeping customer and primary email.
6. Treat the XA's confirmation of the primary email as confirmation to merge
   that primary profile with the duplicate. Review the irreversible warning,
   then click **I'm sure. Merge them.** without asking for a second
   action-time confirmation.
7. Reload the surviving **Admin** profile and confirm the merge completed. Do
   not read the full event history.
   Do not perform duplicate-email cleanup in Admin after the merge.
8. In **OpsHub**, use the surviving customer UUID from the original lookup.
   Cleanup is required before reporting completion or posting the note: open
   the surviving customer's profile and inspect the full email and phone
   lists. Preserve the confirmed primary email. When the original XA lookup
   supplied a phone number, preserve that exact number as the primary phone
   and remove every other phone number. Prefer a
   single `edit_customer` update that writes the complete desired contact
   record when the tool exposes the email-list and phone-list fields: submit
   only the confirmed primary email and the supplied primary phone. If those
   fields are unavailable or the update fails, use the customer editor UI,
   remove all non-primary emails and extra phone numbers in one pass, and save
   once.
9. Reopen or refresh the surviving OpsHub profile and verify that only the
   chosen primary email remains and, when a phone was supplied, only that
   supplied primary phone remains. Verify the phone number itself is unchanged
   from the original XA lookup. A compact `list_customers` result, the
   surviving primary email, or Admin's “Merged customers” confirmation is not
   sufficient proof that cleanup succeeded.
10. Continue the original XA note or escalation only after the OpsHub email
    email and phone cleanup is complete and verified. Post the note immediately after
    verification; do not report the merge as completed before then.

## Admin search sequence learned from the screen recording

Use this exact sequence to avoid the Admin search loading bug:

1. Start from a fresh Admin page and click **Customers** before entering any
   search value.
2. Enter the confirmed primary email in the customer search field. Leave the
   cursor focused at the end of the email before submitting. Do not type the
   customer's name.
3. With the cursor still at the end of the email, press **Enter** repeatedly
   until the actual customer result opens or appears. A populated field or an
   unchanged page is not a completed search; keep the cursor in the email field
   and continue the Enter sequence rather than changing the identifier or
   starting a name search.
4. Open the result for the primary email, then continue with **Links → Merge**.

This sequence is the preferred fast path when the Admin search appears slow or
unresponsive. Keep the browser unfocused as required below, but do not skip the
Customers-first click or substitute a name search.

## Speed and browser handling

For a duplicate merge, optimize for roughly one minute after the primary email
is confirmed. Use the direct Admin customer path, avoid customer searches after
the keeping UUID and Admin customer ID are known, avoid rereading large event
lists, and perform only the required merge, one-call OpsHub email cleanup when
available, verification, and post. The required sequence is: lookup → Admin
merge → single-call OpsHub email and phone cleanup (UI fallback) → verify → post.

Open Admin in a separate, unfocused Browser MCP window. When calling
`browser_navigate`, use `new_tab: true`, `eget_vindue: true`, and
`fokuser: false`. Never reuse the user's active Chrome tab, and never call
`browser_switch_tab` with `bring_to_front: true` for this workflow. Browser
MCP DOM/script clicks may operate in the unfocused task window; if an action
cannot land without focus, stop and report the blocker instead of stealing
focus from the user's browser. Close the task window after the merge and
verification are complete.

Never substitute an OpsHub customer-page merge or customer edit for the Admin
merge. The OpsHub customer edit is required for deleting all non-primary
merged email(s) and, when a phone was supplied, all extra phone number(s)
after the Admin merge. If Admin is unavailable, stop and
report the blocker; do not merge in OpsHub. If OpsHub cleanup fails or is
unavailable after a successful Admin merge, report the cleanup blocker and
stop; do not post or claim completion before cleanup is verified, and never
reopen or redo the Admin merge.

## Output

Mention the merge only if it completed successfully:

> Consolidated duplicate customer profiles in Admin and removed all duplicate
> emails and extra phone numbers from the surviving OpsHub profile.

Do not include unnecessary customer personal data. If matching is uncertain or
the merge fails, leave the profiles unchanged and use the applicable escalation
path. Never attempt to reverse a merge or claim compliance before the surviving
OpsHub profile is checked.
