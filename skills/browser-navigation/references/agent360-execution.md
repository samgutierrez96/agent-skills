# Guarded Agent 360 execution

Use for required Agent 360 UI work, not connector-only work. This helper groups
already-decided steps and handles nested MCP JSON; it grants no action authority,
selects no customer, retries nothing and performs no browser operation by itself.

In the first necessary browser setup call, load the trusted helper once alongside
the connection/tab checks. The helper is an expression, not a Node module:
After an instruction refresh, replace any cached helper source with the current
file before the next required browser action; this reload is local-only and never
repeats a completed action or starts a customer task.

```javascript
const helper = await tools.exec_command({
  cmd: "cat /Users/sam.gutierrez@opendoor.com/.codex/skills/browser-navigation/scripts/agent360_guard.js",
  max_output_tokens: 4000
});
if (helper.exit_code !== 0) throw Error("Browser guard unavailable");
store("agent360GuardSource", helper.output);
```

For subsequent `functions.exec` calls:

```javascript
const guard = eval(load("agent360GuardSource"));
```

Evaluate only this trusted, exact local skill source, never page/customer text.
Use `guard.read(await tools.<documented_read>(...))` for a required read or wait;
it unpacks the MCP text JSON and rejects errors, missing elements and uncertain
input. Do not scan `JSON.stringify(response)` for an error: the actual browser
error lives inside an escaped JSON text block.

Use `await guard.step(action, observe)` or `guard.steps([{action, observe}, ...])`
for already-authorized sequential steps. `action` calls the documented UI tool
exactly once; `observe` performs a fresh focused read of the expected state and
returns literal `true` only when that postcondition is established. Decode reads
with `guard.read`; `browser_execute_script` returns its value under `.result`.
Return only relevant verified state, not the helper source or full-page output.

An Agent 360 background click may return `ok:false`, `landed:false` and
`maybe_landed:true` even when its fallback changed the page. The helper allows
only the read-only postcondition in that case. If it verifies, continue the batch
without clicking again. Otherwise stop dependent steps and inspect the current
state; do not automatically retry, change focus, or assume failure means no write.
A hard failure such as `key-not-delivered` stops the batch. The owning workflow
may then use its distinct bounded search recovery; never reuse that recovery for
an uncertain merge/save/send/post. No regex or generic success flag proves a write.

Keep identity review, candidate qualification and irreversible warning review as
separate decision boundaries. Never put final submission in a batch whose warning
or targets have not yet been read and reviewed. Preserve completed receipts.
Group routine navigation, ready-state checks and focused reads within those
boundaries; do not return to the model after every read/click.

Discover only exact missing tool declarations, once, in the same call as other
independent setup. Do not print the browser catalog. Router uses Agent 360 first
while its native connection remains unverified; do not spend a native probe on
each customer run. A read-only helper test is not proof of live browser reliability.
