---
name: agent-verification
description: Review an Alfred agent-verification task, verify the agent record, close the case, and log the result in OpsHub.
---

# Agent Verification

Use this skill when an Alfred User Review requires an agent-verification check and the result must be recorded on the matching OpsHub customer record.

## Efficiency mode

Optimize for execution speed and low token use:

- Do not narrate routine clicks, tab switches, or successful reads.
- Batch read-only data retrieval before opening Agent Verification.
- Reuse the resolved customer/task IDs throughout the run; do not repeat searches.
- Ask at most one user question: the confidence-tier confirmation.
- Surface only blockers, mismatches, missing fields, or required confirmation.
- Use masked identifiers in messages and avoid echoing full personal data.

## Fast path learned from demonstration

Target under two minutes of active work by using this routing immediately:

1. Resolve the OpsHub customer once and cache the available agent identifiers.
2. In Alfred User Reviews, refresh the queue. If no matching open case exists, click “+ New Case”.
3. In Create Identity Review, search by the exact customer email or phone number. Use the name only as a last resort. Select the result whose email or phone matches the OpsHub record.
4. Always set Identity Review Type to “Requires Verification Review”, then select “Create”. Select the newly created case, choose “Claim and Begin”, then open “Review Case” and “View Full Results”.
5. Use the separate Agent Verification site provided for this workflow:
   `https://script.google.com/a/macros/opendoor.com/s/AKfycbzaafxsysN1kOUwV5TXde9U3b53HVKpu7nfAjtTM64LsuHpXynNkOcX5sdI9H8-D1e6oA/exec`
6. Populate only identifiers returned by the matching OpsHub customer. The site runs a live search; do not enter MLS data that OpsHub does not provide. Stop for the required confidence-tier confirmation if results conflict or are ambiguous.

This fast path replaces queue-only assumptions: absence from the initial Alfred list means create the verification case, not stop.

## Inputs

Collect or confirm:

- The Alfred task/customer in scope.
- The matching OpsHub customer record.
- The agent identifiers available on the customer record: last name, first name, MLS ID, license number, phone, and/or email.
- The confidence tier shown by Agent Verification, confirmed by the user before proceeding.
- The verification decision: allow or deny, whether IDV passed, verification method(s), red flags, and a concise rationale.

Never hard-code a customer's name, phone, email, license number, MLS ID, address, or other personal data from a prior run. Treat those as run-specific inputs.

## Workflow

1. In Chrome, open Alfred's User Reviews queue and refresh the task list. Select the relevant open “Requires Verification Review” task, then choose “Claim and Begin”. Open “View Full Results”.

2. Review the evidence. In the “Why is this user trustworthy?” field, enter a concise rationale based on the evidence (for example, that identity and license were confirmed). Do not claim a check that was not actually performed.

3. Retrieve the agent identifiers from OpsHub before opening or populating Agent Verification. Prefer one batched OpsHub MCP read: resolve the customer with `list_customers` or `global_search`, then use `get_customer` or `get_customer_profile` once to obtain the available name, phone, email, MLS ID, and license data. Cache the returned values for the remainder of the run. Use the browser only for fields the MCP does not return, and never use a mutation to retrieve data.

4. Open the Agent Verification app. Populate only the available identifiers from the matching OpsHub customer record. Use stable field labels—LAST NAME, FIRST NAME, MLS ID, LICENSE NUMBER, PHONE, and EMAIL—and select Search.

5. Compare the live search result with the Alfred evidence. Identify the confidence tier displayed by Agent Verification. Ask one concise question: “Agent Verification shows confidence tier [tier]. Confirm or correct?” Do not continue until the user confirms or corrects it. Resolve discrepancies before deciding. If the live result is ambiguous, missing, or inconsistent, stop and ask for review rather than guessing.

6. Return to Alfred, select “Close case”, and confirm the case is no longer open. If the case cannot be closed, report the blocking state and do not claim completion.

7. Return to OpsHub, reload the customer record if needed, and add a note using this structure:

   ```text
   Customer Type: Agent
   Final HAS: Allow / Deny
   IDV Passed: Y / N
   Verified via: Phone / Email / ID / Agent Credentials
   Red Flags: None / [list]
   Notes: [brief evidence-based rationale]
   ```

   Replace every placeholder with the actual outcome; do not leave slash-separated options or bracketed placeholders in the saved note.

8. Select Add and verify the note appears in the customer record. Include the confirmed confidence tier in `Notes` or the available verification field. Report only: `Case: closed | Outcome: allow/deny | Confidence: [tier] | OpsHub note: saved/blocked`.

## Safety and verification

- Use the currently selected customer and task; do not infer identity from a similarly named record.
- Avoid exposing sensitive identifiers in chat summaries. Use masked or high-level descriptions.
- Treat “Allow” as a conclusion supported by the evidence, not a default.
- Treat the confidence-tier confirmation as a required human checkpoint; do not infer or silently accept a tier.
- If a destructive or irreversible action is requested beyond closing the review case and adding the note, pause for explicit confirmation.

## UI interaction guidance

Use semantic controls and visible labels in Chrome (for example, “Claim and Begin”, “View Full Results”, “Search”, “Close case”, and “Add”). Prefer the OpsHub MCP for batched read-only customer and agent data retrieval, then use Computer Use for the Agent Verification website and other UI-only steps. After each state-changing action, verify the resulting status before continuing, but do not report routine verification unless it fails.

## Timing expectation

The demonstrated workflow took about 3 minutes 12 seconds end-to-end, including navigation and manual lookup. With one batched OpsHub MCP read and minimized tab switching, target roughly 45–90 seconds of active work, plus however long the user takes to confirm the confidence tier. Treat this as an estimate, not a fixed SLA.
