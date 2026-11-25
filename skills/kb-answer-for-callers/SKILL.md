---
name: kb-answer-for-callers
description: Find current, source-backed Opendoor business knowledge across Glean, Slack, internal documents, and official websites. Use across workflows for policy, product, service, eligibility, or process questions, including when saved guidance may be stale. Provide quick read-aloud wording for live calls; support other workflows without replacing their output format or action permissions.
---

# KB Answer for Callers — shared business knowledge

When this workflow actually requires a browser, follow the shared
`browser-navigation` skill at `~/.codex/skills/browser-navigation/SKILL.md`
(packaged alongside this skill). Prefer the new ChatGPT Chrome integration;
retain direct-connector, no-browser, background-window and authorization gates.

This is a business-wide evidence-retrieval skill, not a Zendesk-only playbook
or a static encyclopedia. Use it wherever a workflow needs current Opendoor
business information. Retrieve the evidence behind the answer rather than
treating old skill text, a prior ticket, or model memory as current policy.

## Find and read evidence

- Start with the connected Glean search tool. Use a short sequence of
  discriminative keywords, not full sentences, synonym stuffing, or boolean
  logic. Follow the current tool schema rather than assuming Claude tool names.
  In Router, the current exact lookup hint is the suffix
  `__glean_glean_opendoor_search` in `ALL_TOOLS`; inspect just that descriptor
  once and reuse its schema. If absent, discover only the required Glean search
  capability, not every tool with "search" in its name or description. Start
  with three results when the schema supports `num_results`.
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
- Resolve material uncertainty proactively before finalizing the answer. If an
  unverified product, alternative provider or exception could change the referral,
  make the bounded, targeted source check now; do not wait for the user to say
  "let's verify" or end with "I didn't verify" when the needed evidence is
  accessible. Reuse sufficient current evidence and stop once the decision is
  supported. An inconclusive check is still inconclusive, not a definitive yes/no.
- Disclose material access/evidence gaps after trying the relevant safe retrieval
  paths. A missing direct connector does not prove Glean cannot index the source;
  try accessible indexed or linked evidence. Do not invent access, claim an
  unavailable source was checked, or contact an owner without authorization.
- Stop when the current answer and relevant exceptions are supported. Do not
  search every system or retrieve customer records for a generic business question.
  Before refining a search, identify the material answer condition still missing.
  Follow a returned governing article/thread for that condition instead of
  repeatedly searching synonyms for an already-supported fact. A linked source
  is not verified until read; a genuinely unresolved condition remains a visible
  gap, not a reason to invent certainty or broaden into unrelated policy.

## Establish what is current

For a current business-policy/process answer, use the topic map below to read
the matching saved reference directly when available, then
verify the governing source and topic-specific XA announcement/thread evidence.
Use a targeted Glean channel search or direct Slack read, not a whole-channel
scan on every question. Inspect material replies and linked owner guidance;
reuse sufficient evidence already read for this question. A scheduled review,
saved skill or successful prior answer is not evidence that nothing changed.
If a required freshness/source check is unavailable, disclose that limit rather
than presenting the saved answer as independently verified current policy.

When the question concerns old versus current guidance or where a rule is still
used, consult the local XA Announcements `policy-history` index if available
(its project guide identifies the exact path). Read `current`/`history` for the
relevant policy and scope and inspect any flagged source/workflow discrepancy.
The index retains evidence and explicit decisions; it does not replace a current
source read, infer retirement from absence or merge targeted and general scopes.
If unavailable, research the governing evidence directly and disclose the gap.

For privacy/internet questions, first distinguish privacy practices, request
submission, public property/photo/search-result removal, mobile-app deletion,
state-specific rights and an objection/appeal. Do not assume every privacy
question is an account-deletion request. Read the applicable Privacy FAQ and
owner direction, plus the saved privacy reference when available. Treat dated
state lists and request URLs as scoped evidence requiring verification, not
universal current facts. Do not substitute public web search for internal policy
or send confidential internal guidance to an external search service.

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

## Saved topic evidence, not a second knowledge base

The local `~/.codex/skills/company-knowledge-update/references/` folder contains
the following topic evidence. This is a routing map, not policy text:

- Privacy/deletion: `privacy-deletion-2026-10.md`.
- Vendor payments: `vendor-ap-follow-up-2026-11.md`.
- Year-end closing cohorts: `year-end-closing-dates-2026-11.md`.
- Pricing valuation: `pricing-valuation-scope-2026-10.md`.
- Patrol dispatch: `patrol-dispatch-2026-11.md`.
- Failed-tour communication/access-ticket macro: `failed-tour-access-2026-11.md`.
- Thanksgiving assessment coverage (unresolved date advisory): `holiday-assessment-coverage-2026-11.md`.
- Safehaven agent lockbox troubleshooting: `safehaven-access-2026-11.md`.
- Qualified flips: `qualified-flips-only-2026-11.md`.
- Government/fire investigations: `fire-investigator-requests-2026-11.md`.
- Agent representation/tracking: `agent-representation-tracking-2026-10.md`.
- Home Loans: `home-loans-licenses-2026-10.md`.
- Buyer offer submission: `buyer-offer-submission-2026-10.md`.

Read only the matching reference. If the topic is absent or its file unavailable,
continue with current governing evidence; do not load the maintenance skill,
scan its other topics or audit dependent workflows just to answer a question.
The maintenance procedure is for a separately authorized save/review, not a
prerequisite for read-only retrieval. These references retain provenance, scope,
superseded guidance and active workflow locations without duplicating their text.
Those business references are local-only, not bundled in this public package.
If unavailable, retrieve current first-party evidence through connected sources.
Obsidian exposes the same local files; its presence is not freshness verification.

## Handoff to company-knowledge-update

Use this skill to research and validate evidence. Use the separate
`company-knowledge-update` skill, when available and within its trigger, to
synchronize new or corrected business knowledge the user supplies or explicitly
accepts for saving, or verified changes within Sam's explicitly authorized
recurring review. A read-only lookup alone does not authorize durable updates.

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
