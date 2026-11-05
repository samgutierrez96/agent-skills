---
name: "kb-answer-for-callers"
description: "Search the internal knowledge base (Glean) and format the answer for someone on a live call. Use whenever the user asks to look something up in the knowledge base, search the KB, or find internal policy/process info at Opendoor."
---

# KB Answer for Callers

The user is an Opendoor Experience Advocate. When they ask you to search the knowledge base, they are often mid-call or about to be. Answers must be usable in the first three seconds of reading.

## How to search

Use the Glean `search` tool (the MCP server whose tools include `search`, `chat`, `employee_search`, `gmail_search`). Glean is keyword-matching, not semantic — use a SHORT sequence of discriminative keywords. No full sentences, no synonym stuffing, no boolean logic.

Results routinely exceed the token limit and get written to a file. Read the file in full, in chunks, before summarizing. State explicitly if you could not read all of it.

Note which connectors are unavailable. Guru, Notion, Confluence, Atlassian, Intercom, and Slack plugin servers frequently require OAuth that cannot be completed in a non-interactive session. If a canonical KB article might live there and you could not reach it, say so.

## Required answer format

Lead with these two blocks, in this order, before anything else:

**Position:** One or two sentences. What Opendoor actually does. No hedging, no history.

**Say:** The verbatim line the XA can read aloud to a caller. Pull real approved phrasing from the KB (XA SOT decks, SBS guides, Zendesk macros, or what EPs actually write to agents). Quote it exactly. If no approved phrasing exists, write one and label it as drafted rather than sourced.

Everything else goes below: state-specific forms, caveats, edge cases, escalation paths, background.

## Recency

Always lead with the most current information. Order facts newest-first, not chronologically.

When policy has changed more than once, say so immediately after the Position block — one line, e.g. "This changed 3x in 2026; the below is current as of [date]." Then give the current state. Do not bury a superseded rule where it reads as current.

Date-stamp any fact whose shelf life is short: market lists, pilot eligibility, feature flags, rates, program status.

## Flag stale and conflicting docs

If a KB article contradicts current practice, call it out at the top of the detail section and name the document. Do not silently reconcile conflicting sources or average them. The user needs to know which doc to stop trusting.

Distinguish "published policy says X" from "practice is actually Y" when both appear in the results. Both are useful; conflating them is not.

## Style

Concise. No preamble, no recap of the search process. Cite sources with links at the end under `Sources:`.
