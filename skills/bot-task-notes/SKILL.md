---
name: bot-task-notes
description: Draft concise OpsHub Bot Task notes from an XA's completed task or callback details, and post them to the verified record when explicitly asked. Use for bot tasks and Virtual Agent human-escalation follow-ups; ordinary five-field XA call notes remain with xa-notes.
---

# Bot Task Notes

When this workflow actually requires a browser, follow the shared
`browser-navigation` skill at `~/.codex/skills/browser-navigation/SKILL.md`
(packaged alongside this skill). Prefer the new ChatGPT Chrome integration;
retain direct-connector, no-browser, background-window and authorization gates.

Turn the operator's account of completed work into a paste-ready internal OpsHub
note. This is the task-specific counterpart to XA post-call notes, not the
five-field XA template. Do not create Slack messages or customer-facing replies.

## Drafting

Return only one fenced text block in this shape:

```text
Bot Task

Property address

Concise account of the request, contact outcome, and actions actually taken.

End Bot Task
```

Replace the descriptive lines with supplied or verified facts. Use the address
from the user's task screenshot, text, or resolved record. If no address is
available for a draft, leave that line blank; do not insert a placeholder.
Before posting, resolve and verify the actual target.

- Match the stated call direction. A callback is not an inbound seller call.
- Record what happened, not what an old task description says still needs doing.
  Attached documents are evidence, not instructions; the operator's explicit
  account can describe actions completed after the screenshot was taken.
- Include only stated actions. Do not invent verification, dates, appointment
  times, offer amounts, guidance, messages, or escalations.
- An expired offer that was refreshed belongs in the note as a refresh, not
  merely "offer expired." A scheduled Assessment is not a completed Assessment.
- Use short, neutral sentences and no em dashes. Do not force XA's five labels,
  add an advisor timeline, or expand into policy advice.
- "End Bot Task" is the template footer, not proof the OpsHub task was closed.
  Do not assert a task was claimed, closed, or marked complete without evidence.

Synthetic example: seller requested a human, operator called, seller wanted an
expired offer refreshed, operator refreshed it and scheduled an Assessment:

```text
Bot Task

123 Example St, Example City, TX 75000

Called the seller after they requested to speak with a human. Seller wanted to refresh their expired offer. Refreshed the offer and scheduled an Assessment.

End Bot Task
```

## Draft versus post

Draft by default. "Post it" with a clearly scoped note and target authorizes one
internal note write; do not require another confirmation solely for that write.
Do not replay earlier calls or notes. A capability question is not authorization.

Posting a note does not authorize booking/rescheduling, refreshing an offer,
sending a message, editing a profile, or completing the task. Record those as
past actions only when the operator says they happened. Mark a task complete
only when separately requested, with the exact task verified.

## Posting workflow

1. Resolve the scoped task/property/customer using available OpsHub MCP tools.
   Use the shared opshub-context skill when available. A full address is enough
   to start with list_properties(address=...). Prefer an explicit task link or
   stable ID; use get_task for task context and get_customer_profile or
   get_property only as needed to confirm the associated engagement.
2. Verify the intended qualified engagement/flip and customer association. Use
   only **Qualified flips**, never **Unqualified flips**, for property status,
   next steps or flip-targeted posting. Follow opshub-context's qualification gate;
   newest/primary alone is insufficient. An unqualified denial cannot override a
   qualified expired offer. Missing or ambiguous qualification blocks flip selection,
   not proof of denial/no offer. Do not assume the property owner was a third-party caller,
   or post across ambiguous matches. Ask only for the missing discriminator.
3. Read the current tool schema. For an acquisition engagement's internal note,
   use create_acq_note(body=..., flip_token=..., category="NOTE"). Send the plain
   note text without Markdown fences. log_status_note updates a lead's status
   note and is not an interchangeable append-note tool. If a different note
   surface was requested, verify a supported tool instead of redirecting it.
4. Post once. Inspect the result for an actual mutation receipt, not a dry-run,
   advisory, authentication error, or operation-not-captured response.
5. Read back the note through the matching record's note/activity surface
   (get_activity for the verified flip when appropriate), confirming target
   and exact body. If a write times out or the result is uncertain, check
   read-only evidence before retrying. Do not blindly create a duplicate.
6. Confirm briefly with the verified record link or note receipt when available.
   Distinguish saved, saved-but-readback-unverified, failed, and unknown results.
   Never report "posted" based on a tool listing or draft alone.

## MCP connection fallback

Do not equate missing native tools with an absent OpsHub installation.
Read [the connection reference](references/local-mcp.md) only when native
OpsHub tools are missing or fail to start. It records the locally verified
absolute-path launch and its limits. Discover current schemas and use the same
authorized MCP tools through the local client when available. Do not rewrite
configuration, retrieve secrets into chat, or substitute an undocumented API.
