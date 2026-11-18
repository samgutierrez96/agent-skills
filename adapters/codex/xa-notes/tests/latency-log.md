# XA notes latency review — maintenance only

Do not load this file during warm-up or a caller task. It defines a manual,
read-only review of already saved timing evidence after ordinary work. It adds
no per-call tool, model, browser, customer lookup, telemetry write or service
restart. Never place diagnostics in a customer note.

## Separate four workflow paths

1. Preparation: record whether full source was newly attached/read or already
   present. A warm Ready reply in an already-prepared chat is not a cold-load
   benchmark. Stop timing preparation at Ready; do not mix it with the first call.
2. Ordinary drafting: a five-field draft with no external mutation. Flag the
   existing listing-type or report-link lookup exception separately; a draft
   with link retrieval is not a zero-lookup draft.
3. Straightforward posting: an authorized new note or in-place correction,
   without duplicate-profile cleanup. Distinguish direct posting, posting a
   retained draft and updating an existing note. Keep required identity,
   qualification and link checks intact.
4. Merge/recovery: duplicate-profile resolution, browser cleanup, interrupted
   work or resumption. Keep initial work, operator waiting and recovery turns
   separate. Do not compare this path with a straightforward post.

## Capture from existing evidence, after the task

Record only what the saved transcript or Router diagnostics actually exposes.
Use an anonymous sample label, never caller details, addresses, email/phone,
customer IDs, note bodies, access codes, ticket links or connector payloads.
Keep actual observations local/private, outside the canonical distribution,
and do not attach those observations as runtime context.

For each sample, record:

- Date/time with America/New_York timezone and anonymous sample label.
- Runtime/transport (Codex desktop or Router, when known), model/reasoning when
  exposed, and whether instruction versions changed.
- One of the four paths, instruction state (attached/read/reused/unknown),
  first versus later call, link-lookup flag, and create/update/no-write outcome.
- Visible total turn duration in seconds. If available, separately record
  request-to-Ready, request-to-first-visible-output, and request-to-result.
  A final turn duration does not prove time to first useful reply.
- Visible tool calls and independent lookup batches. Count sequential rounds
  only if the trace shows grouping; never assume calls were parallel from order.
- Recorded OpsHub and browser call durations, with units. A sum of call times
  is not wall-clock tool time when calls overlap; do not subtract it from total
  duration and call the remainder model time.
- Provider-reported input, cached-input and output tokens only when exposed.
  Missing usage is unknown. Attachment characters are not billed token usage,
  and cache hits or total cost cannot be inferred from instruction length.
- Evidence coverage, completion/blocker/interruption state and any unavailable
  fields, each labeled Not verified.

Never retrieve customer records again to fill timing fields. Never regenerate,
post, update, merge, send or replay a live action for measurement. Use existing
receipts to avoid duplicates; an uncertain write is a verification issue, not
permission for a retry.

## Comparison and acceptance

Collect up to five naturally occurring, relevant samples per available path.
Do not manufacture missing paths, make the XA wait for a quota or alter their
workflow to get a sample. Report the actual count and missing paths.

Compare like with like: same path, entry state, runtime, model/reasoning and
link/merge needs where known. Keep failures and interrupted runs visible rather
than hiding them in a successful-only average. Report median and range only
when sufficient comparable measured durations exist, with the sample size.
Do not claim a causal improvement from mixed workflows or changed configuration.

Quality must pass before calling a result faster: preserve the five fields,
current personal wording, shorthand expansions, caller continuity, report links,
posting authorization, destination and verified result. The offline fixture suite
alone does not establish live compliance.

The earlier "original sped-up pace" has no verified comparable baseline here.
Do not promise it is restored or report a percentage improvement until sufficient
before/after evidence exists. Instruction consistency is not a timing measurement.

## Status — November 17, 2026

Items 2 and 4 define a consistent preparation contract and this measurement
protocol. No post-change live timing sample or provider usage was collected as
part of the maintenance. Original-speed restoration: Not verified.

The previous empty log mentioned roughly 38–44 seconds total and 1–2 seconds
of OpsHub calls without comparable sample metadata. Retain that as a legacy
qualitative note only, not a validated baseline or a measured improvement.

Actual observations must remain in the existing private evidence store or a
private untracked log, not this public-distribution protocol. No automation or
per-call logging has been enabled.
