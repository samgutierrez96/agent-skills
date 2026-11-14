import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('./agent360_guard.js', import.meta.url), 'utf8');
const guard = vm.runInNewContext(source);
const result = value => ({ content: [{ type: 'text', text: JSON.stringify(value) }] });
let tests = 0;
async function test(name, run) {
  await run();
  tests++;
  console.log(`ok - ${name}`);
}

await test('parses nested MCP JSON instead of matching escaped error strings', () => {
  assert.throws(() => guard.read(result({ ok: false, error: 'synthetic failure' })));
  assert.throws(() => guard.read(result({ found: false })));
  assert.equal(guard.read(result({ result: { visible: true } })).result.visible, true);
});
await test('fails closed on malformed and ambiguous responses', () => {
  for (const value of [null, {}, { isError: true }, { content: [] },
    { content: [{ type: 'text', text: 'not JSON' }] }, result(null), result([]),
    { content: [...result({ ok: true }).content, ...result({ ok: true }).content] }]) {
    assert.throws(() => guard.read(value));
  }
});
await test('uncertain background click resolves from fresh state without replay', async () => {
  let writes = 0, reads = 0;
  const value = await guard.step(async () => {
    writes++;
    return result({ ok: false, landed: false, maybe_landed: true, error: 'synthetic timeout' });
  }, async () => { reads++; return true; });
  assert.equal(value.verified, true);
  assert.equal(writes, 1);
  assert.equal(reads, 1);
});
await test('unresolved mutation blocks every later dependent action', async () => {
  let first = 0, later = 0;
  await assert.rejects(guard.steps([
    { action: async () => { first++; return result({ ok: false, maybe_landed: true }); }, observe: async () => false },
    { action: async () => { later++; return result({ ok: true }); }, observe: async () => true },
  ]));
  assert.equal(first, 1);
  assert.equal(later, 0);
});
await test('hard failures do not continue or retry', async () => {
  let reads = 0, calls = 0;
  await assert.rejects(guard.step(async () => {
    calls++; return result({ ok: false, landed: false, error: 'key-not-delivered' });
  }, async () => { reads++; return true; }));
  assert.equal(calls, 1);
  assert.equal(reads, 0);
});
await test('truthy or missing postconditions cannot authorize continuation', async () => {
  for (const observed of [undefined, null, 1, 'true', { verified: true }]) {
    await assert.rejects(guard.step(async () => result({ ok: true }), async () => observed));
  }
  let calls = 0;
  await assert.rejects(guard.step(async () => { calls++; return result({ ok: true }); }));
  assert.equal(calls, 0);
});
await test('invalid later batch steps are rejected before the first mutation', async () => {
  let calls = 0;
  await assert.rejects(guard.steps([
    { action: async () => { calls++; return result({ ok: true }); }, observe: async () => true },
    { action: async () => result({ ok: true }) },
  ]));
  assert.equal(calls, 0);
});
await test('unknown action acknowledgements cannot continue', async () => {
  let reads = 0;
  await assert.rejects(guard.step(async () => result({ unexpected: true }), async () => { reads++; return true; }));
  assert.equal(reads, 0);
});
await test('several deterministic steps share a call and preserve order', async () => {
  const order = [];
  await guard.steps([1, 2, 3].map(n => ({
    action: async () => { order.push(`action${n}`); return result({ ok: true }); },
    observe: async () => { order.push(`read${n}`); return true; },
  })));
  assert.deepEqual(order, ['action1', 'read1', 'action2', 'read2', 'action3', 'read3']);
});
await test('exceptions in tools or observations halt the batch', async () => {
  await assert.rejects(guard.step(async () => { throw Error('synthetic disconnect'); }, async () => true));
  await assert.rejects(guard.step(async () => result({ ok: true }), async () => {
    throw Error('synthetic read failure');
  }));
});
console.log(`${tests} synthetic browser guard tests passed; no browser invoked.`);
