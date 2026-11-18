# Skill Router conversation evidence

Paths written from the project root in this preserved guidance remain project-root paths.
Load this guide only for the trigger named in AGENTS.md or FAST-INDEX.md; reuse it thereafter.
An explicit draft-only/read-only request overrides standing composer/draft preparation exceptions.

## Conversation evidence for Skill Router

Operator questions about what a reply answered are read-only discussion, not a
request for another customer draft or an action. Reuse sufficient retrieved
evidence; look up only missing or explicitly requested newer facts. Historical
assistant summaries are leads, not source evidence. Preserve the current draft.
When the operator asks what they previously requested, use their saved requests,
not customer messages. Reading saved history never needs customer-record reads.

For an abbreviated inbound, preserve the actual preceding outbound and relevant
later messages when already retrieved. Read both sides of the inbound timestamp;
use `get_thread` for SMS and activity/related-ticket reads only when required by
the existing recipe. Match requester, property and concern before combining
channels. Explicit reply metadata can establish a parent; proximity alone cannot.
Keep an older channel's no-reply disposition separate from unresolved work in a
newer email. Existing related-ticket URL and internal-note rules still apply.

When a Codex orchestration call emits focused source excerpts to Skill Router,
emit them once in that same tool call as JSON under `skill_router_context_v1`:
`{ticket_id:"selected ticket",messages:[{source:"zendesk" or "opshub",id:"source message ID",url:"source record URL",at:"source timestamp with timezone",actor:"source sender",channel:"sms/email/note/call",direction:"inbound/outbound/internal/unknown",body:"exact source text",truncated:false}],gaps:["material coverage limits"]}`.
Build this display envelope from the retained connector response, not assistant
prose, AI summaries, or invented facts. Preserve raw source text and source IDs;
omit unknown timestamps and use unknown direction rather than guessing. Include
only the matched ticket/customer/property's load-bearing excerpts and coverage
limits. Do not emit email subjects as bodies, access codes, verification tokens,
credentials, or unrelated cross-deal history. Leave sensitive entries out and
state that an entry was withheld. Prefer this focused output instead of dumping
the response again; retain the original in tool memory for required inspection.
There is no additional read or AI summary pass solely for the snapshot. No
evidence available means no invented snapshot. Keep the envelope out of the final
reply/internal-note fences; it is display evidence, never an action receipt.
