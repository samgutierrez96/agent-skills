---
name: kb-answer-for-callers
description: Find current, source-backed Opendoor business knowledge across Glean, Slack, internal documents, and official websites. Use across workflows for policy, product, service, eligibility, or process questions, including when saved guidance may be stale. Provide quick read-aloud wording for live calls; support other workflows without replacing their output format or action permissions.
---

# KB Answer for Callers — shared business knowledge

This is a business-wide evidence-retrieval skill, not a Zendesk-only playbook
or a static encyclopedia. Use it wherever a workflow needs current Opendoor
business information. Retrieve the evidence behind the answer rather than
treating old skill text, a prior ticket, or model memory as current policy.

## Find and read evidence

- Start with the connected Glean search tool. Use a short sequence of
  discriminative keywords, not full sentences, synonym stuffing, or boolean
  logic. Follow the current tool schema rather than assuming Claude tool names.
- Search across sources initially. Use returned source links to locate canonical
  KB articles, owner-maintained guides, approved macros, official announcements,
  and the relevant team's policy or process documentation.
- Follow evidence across Slack channels and methods when needed: search indexed
  Slack through Glean or the connected Slack search tool, then read the relevant
  thread and its replies for corrections, dates, scope, and linked source docs.
  For public business guidance, start with public-channel search; access private
  sources only within the user's scope and the connector's permission rules.
  Do not mistake a one-off case answer for company-wide policy.
- Open the relevant linked documents and official websites using available
  connectors or browser tools when search excerpts leave an important condition,
  approved wording, or current status unverified. Prefer first-party evidence
  over third-party summaries. Do not use public web search as a substitute for
  internal policy evidence.
- Read the evidence needed for the conclusion, not just titles or snippets.
  If results are written to a file, read it in chunks before summarizing; do not
  imply full coverage of unread, truncated, or inaccessible material.
- Disclose material access gaps. A missing direct connector does not prove that
  Glean cannot index that source; try accessible indexed or linked evidence.
  Do not invent access or claim an unavailable source was checked.
- Stop when the current answer and relevant exceptions are supported. Do not
  search every system or retrieve customer records for a generic business question.

## Establish what is current

Check the policy owner, publication and effective dates, market, state, product,
lifecycle stage, and relevant exceptions. A recent edit timestamp or Slack reply
alone does not make a source canonical or supersede an explicit policy.

Lead with the current supported answer. Date-stamp short-lived facts such as
market lists, pilots, eligibility, rates, feature availability, and program status.
If policy changed repeatedly, briefly identify the supported change and effective
date; do not claim it is current as of today unless the evidence establishes that.

Flag stale or conflicting documents by name near the top of the details.
Distinguish published policy from reported practice. Explain which evidence
supports the conclusion and why; never silently reconcile conflicting sources.
If material conflict remains, say what is unconfirmed and which owner or source
must clarify it. Do not manufacture certainty to satisfy the call format.

Resolve a supported supersession before reusing the disputed business fact in an
answer or draft. Existing saved instructions are evidence of prior guidance, not
proof that it is current. If current evidence cannot resolve the conflict, omit
the disputed claim from definitive customer guidance and preserve supported facts;
put the gap and required clarification in the supporting workflow's internal
note/operator appendix. Do not silently pick a source, repeat outdated wording,
or turn uncertainty into a promised outcome. An accepted save then passes the
resolved rule and superseded passages to company-knowledge-update; unresolved
conflicts block a definitive company-policy save, not a safe researched draft.

## Fit the workflow

For a standalone KB answer or live call, lead with:

**Position:** One or two sentences stating the current supported business answer.
Keep it direct, but disclose uncertainty if the evidence is incomplete.

**Say:** A short caller-ready line. Quote approved wording exactly only after
reading it in the source, and cite that source. Otherwise label the wording
**Drafted**, not sourced or approved.

Put material conflicts, effective dates, exceptions, forms, escalation paths,
and necessary background below. Keep the answer useful in the first few seconds.
Include source titles and links under `Sources:`; follow the current tool's
citation and quotation requirements.

When supporting another workflow, provide the verified knowledge and evidence
within that workflow's required output (ticket draft, note, escalation, research,
or knowledge update). Do not force Position/Say blocks into a different required
format or add an unnecessary caller script to an internal-only task. Preserve
customer-record verification gates and existing permissions for sends or writes.

## Saved vendor AP follow-up — November 6, 2026

For an established vendor still waiting without a reply or resolution after
emailing `accountspayable@opendoor.com` about billing/unpaid invoices, direct them
to submit a request through the Trade Partner Support Center. Do not invent a
waiting threshold or promise response/payment timing. New-vendor onboarding is
separate; do not create duplicate tickets for an already-filed support request.
Read the local shared company-knowledge-update reference
`references/vendor-ap-follow-up-2026-11.md` in that skill for the verified link,
July 20 Slack reply, supporting evidence and scoped reconciliation with older
FAQ escalation wording. The reference is local-only, not bundled here. If it is
unavailable or newer evidence conflicts, retrieve the supporting sources through
Glean/Slack and apply the evidence/conflict gates above rather than guessing.

## Handoff to company-knowledge-update

Use this skill to research and validate evidence. Use the separate
`company-knowledge-update` skill, when available and within its trigger, to
synchronize new or corrected business knowledge the user supplies or explicitly
accepts for saving. A read-only lookup alone does not authorize durable updates.

Pass the precise rule, effective date, scope, exceptions, source links and dates,
superseded guidance, and unresolved conflicts. Preserve the distinction between
user-supplied operational direction and independently verified published policy.
Do not overwrite an explicit accepted correction with an older document or
promote a tentative finding into company policy. Keep that skill's active-source
audit, cross-workflow synchronization, verification, and publication boundaries.

## Provenance

Adapted November 4, 2026 from the locally installed Claude skill. The unchanged
upstream text is retained in [references/claude-original.md](references/claude-original.md)
for provenance, not as a second runtime or a source of current business facts.
The adaptation preserves its targeted search, current-first answer, approved
wording, conflict warnings, and source links while applying the shared scope
Sam requested. Read the upstream reference only when comparing or maintaining
the import; normal business lookups use the instructions above.
