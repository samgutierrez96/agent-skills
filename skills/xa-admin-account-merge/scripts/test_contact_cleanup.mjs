// Provider-free orchestration regression. Reserved synthetic contacts only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read = name => fs.readFileSync(new URL(name, import.meta.url), 'utf8');
const planner = vm.runInNewContext(read('contact_update_plan.js'));
const fresh = () => vm.runInNewContext(read('contact_cleanup.js'));
const clone = x => JSON.parse(JSON.stringify(x));
const phone = (number, type) => ({number: {value: number}, type});
const email = value => ({address: {value}});
const customer = {uuid: 'synthetic-caller', firstName: 'Alex', lastName: '', isAgent: false,
  primaryEmail: email('alex@example.invalid'), otherEmails: [email('other@example.invalid')],
  primaryPhoneNumber: phone('+12025550123', 'MOBILE'),
  otherPhoneNumbers: [phone('2025550123', 'OTHER'), phone('+12025550124', 'WORK')]};
const cleaned = clone(customer); cleaned.otherPhoneNumbers.shift();
const envelope = c => ({customer: clone(c), persisted: true, contactsComplete: true,
  preferences: [{name: 'sms', checked: 'false'}]});
function fixture(overrides = {}) {
  const calls = []; let saved = clone(customer);
  const options = {operationId: 'synthetic-request', mode: 'repeated-phone',
    customerUuid: customer.uuid, callerPhone: '+12025550123', identityVerified: true,
    cleanupAuthorized: true, accountConflict: false, planner,
    readSavedContacts: async ({phase, customerUuid}) => {
      calls.push(['read', phase, customerUuid]); return envelope(saved);
    },
    updateCustomer: async request => {
      calls.push(['update', clone(request)]); saved = clone(cleaned); return {accepted: true};
    }, ...overrides};
  return {calls, options, setSaved: value => {saved = clone(value);}};
}

{
  const cleanup = fresh();
  const expectedUrl = 'https://opshub.apps.opendoor.com/customers/synthetic-caller';
  assert.equal(typeof cleanup.agent360Reader({expectedUrl, pristineTaskWindow: true,
    tools: {}, guard: {}, probeSource: 'url => ({state: "editor-open"})'}), 'function',
    'the real worker has no URL global; constructing its reader must not require one');
  for (const bad of ['http://opshub.apps.opendoor.com/customers/synthetic-caller',
    expectedUrl + '?other=1', expectedUrl + '/elsewhere', expectedUrl + '#unsaved',
    'https://opshub.apps.opendoor.com.example.invalid/customers/synthetic-caller',
    'https://user@opshub.apps.opendoor.com/customers/synthetic-caller']) {
    assert.throws(() => cleanup.agent360Reader({expectedUrl: bad, pristineTaskWindow: true,
      tools: {}, guard: {}, probeSource: 'url => ({})'}), /fresh-owned-task-window/);
  }
}

{
  const cleanup = fresh(), f = fixture();
  const [a, b] = await Promise.all([cleanup.run(f.options), cleanup.run(f.options)]);
  assert.equal(a.state, 'verified'); assert.equal(a, b);
  assert.deepEqual(f.calls.map(c => c[0]), ['read', 'update', 'read']);
  assert.deepEqual(f.calls[1][1], {operation_name: 'UpdateCustomer', variables: {input: {
    uuid: customer.uuid, params: {phones: [{old: {number: '2025550123', type: 'OTHER'}}]}}}});
  assert.equal((await cleanup.run(f.options)).state, 'verified');
  assert.equal(f.calls.length, 3, 'repeated operation returns its receipt, not another save');
  assert.equal((await cleanup.run({...f.options, customerUuid: 'different'})).state, 'blocked');
  assert.equal(f.calls.length, 3, 'same request cannot target a different customer');
}
for (const changes of [{identityVerified: false}, {cleanupAuthorized: false}, {accountConflict: true},
  {priorWriteUncertain: true}, {nameCorrectionPending: true},
  {mode: 'consolidate', primaryEmail: 'alex@example.invalid'}]) {
  const f = fixture(changes);
  assert.equal((await fresh().run(f.options)).state, 'blocked');
  assert.equal(f.calls.length, 0, 'unmet gates stop before any tool');
}
for (const [key, value] of [['persisted', false], ['contactsComplete', false]]) {
  const f = fixture({readSavedContacts: async () => ({...envelope(customer), [key]: value})});
  assert.equal((await fresh().run(f.options)).state, 'blocked');
  assert.equal(f.calls.length, 0, 'incomplete or unsaved evidence cannot authorize a write');
}
{
  const f = fixture(); f.setSaved(cleaned);
  assert.equal((await fresh().run(f.options)).state, 'verified');
  assert.deepEqual(f.calls.map(c => c[0]), ['read'], 'already clean skips update and second verification');
}
{
  const f = fixture({readSavedContacts: async () => envelope({...customer, uuid: 'wrong'})});
  assert.equal((await fresh().run(f.options)).state, 'blocked');
  assert.equal(f.calls.length, 0, 'UUID mismatch never reaches update');
}
{
  const f = fixture({updateCustomer: async () => {f.calls.push(['update']); f.setSaved(cleaned); throw Error('lost response');}});
  const result = await fresh().run(f.options);
  assert.equal(result.state, 'verified', 'fresh exact persisted state reconciles a lost acknowledgement');
  assert.equal(f.calls.filter(c => c[0] === 'update').length, 1);
}
{
  const f = fixture({updateCustomer: async () => {f.calls.push(['update']); throw Error('unknown');}});
  const cleanup = fresh();
  assert.equal((await cleanup.run(f.options)).state, 'unconfirmed');
  assert.equal((await cleanup.run(f.options)).state, 'unconfirmed');
  assert.equal(f.calls.filter(c => c[0] === 'update').length, 1, 'uncertain save never retries');
}
for (const change of [c => {c.lastName = 'Unexpected';}, c => {c.otherEmails = [];},
  c => {c.primaryPhoneNumber.type = 'WORK';}, c => {c.isAgent = true;}]) {
  const wrong = clone(cleaned); change(wrong);
  const f = fixture({updateCustomer: async () => {f.setSaved(wrong);}});
  assert.equal((await fresh().run(f.options)).state, 'unconfirmed', 'unrelated fields must survive');
}
{
  let n = 0;
  const f = fixture({readSavedContacts: async () => {
    n++; return {...envelope(n === 1 ? customer : cleaned), preferences: [{name: 'sms', checked: String(n > 1)}]};
  }});
  assert.equal((await fresh().run(f.options)).state, 'unconfirmed', 'preference changes fail verification');
}
{
  const f = fixture({readSavedContacts: async ({phase}) => {
    if (phase === 'after') throw Error('read unavailable'); return envelope(customer);
  }});
  const result = await fresh().run(f.options);
  assert.equal(result.state, 'unconfirmed'); assert.equal(result.writeAttempted, true);
}
for (const phase of ['before', 'after']) {
  const f = fixture({readSavedContacts: async ({phase: current}) => {
    if (current === phase) throw Object.assign(Error('not customer data'), {cleanupCode: 'phone-type-unavailable'});
    return envelope(customer);
  }});
  const result = await fresh().run(f.options);
  assert.equal(result.state, phase === 'before' ? 'blocked' : 'unconfirmed');
  assert.deepEqual(clone(result.failure), {stage: phase, code: 'phone-type-unavailable'},
    'preserve a concrete safe blocker without another diagnostic/model round');
  assert.equal(f.calls.filter(c => c[0] === 'update').length, phase === 'before' ? 0 : 1);
}
for (const error of [null, 'unknown', Object.assign(Error('private data'), {cleanupCode: 'not safe: private data'})]) {
  const f = fixture({readSavedContacts: async () => {throw error;}});
  const result = await fresh().run(f.options);
  assert.deepEqual(clone(result.failure), {stage: 'before', code: 'executor-failed'},
    'unknown exceptions cannot leak raw profile data or escape the bounded result');
}
{
  const sole = clone(cleaned); sole.otherEmails = []; sole.otherPhoneNumbers = [];
  const f = fixture({mode: 'consolidate', detectionComplete: true, primaryEmail: 'alex@example.invalid',
    updateCustomer: async request => {f.calls.push(['update', clone(request)]); f.setSaved(sole);}});
  const result = await fresh().run(f.options);
  assert.equal(result.state, 'verified');
  assert.equal(f.calls[1][1].variables.input.params.emails.length, 1);
  assert.equal(f.calls[1][1].variables.input.params.phones.length, 2);
}
console.log('Contact cleanup: qualified one-pass edit/verify, preservation, dedup, no-op and uncertain-write gates passed.');

for (const outcome of ['saved', 'lost-response', 'unchanged', 'wrong-name', 'wrong-email', 'changed-preference']) {
  const original = clone(customer); original.lastName = 'Morgan (Example Appraisals)';
  original.primaryEmail = email('alex.morgan@example.invalid');
  const expected = clone(original); expected.lastName = 'Morgan'; expected.otherEmails = []; expected.otherPhoneNumbers = [];
  let saved = clone(original), writes = 0, reads = 0;
  const cleanup = fresh();
  const options = {operationId: 'synthetic-name-request', mode: 'consolidate',
    customerUuid: customer.uuid, primaryEmail: 'alex.morgan@example.invalid', callerPhone: '+12025550123',
    identityVerified: true, cleanupAuthorized: true, accountConflict: false, detectionComplete: true,
    nameCorrectionPending: true, nameCorrection: {firstName: 'Alex', lastName: 'Morgan'},
    nameCorrectionConfirmed: true, planner,
    readSavedContacts: async () => {
      reads++;
      const result = envelope(saved);
      if (writes && outcome === 'changed-preference') result.preferences[0].checked = 'true';
      return result;
    },
    updateCustomer: async request => {
      writes++;
      assert.deepEqual(clone(request.variables.input.params), {
        firstName: 'Alex', lastName: 'Morgan',
        emails: [{old: {address: 'other@example.invalid'}}],
        phones: [{old: {number: '2025550123', type: 'OTHER'}}, {old: {number: '+12025550124', type: 'WORK'}}],
      });
      if (outcome !== 'unchanged') saved = clone(expected);
      if (outcome === 'wrong-name') saved.lastName = original.lastName;
      if (outcome === 'wrong-email') saved.primaryEmail.address.value = 'alex@example.invalid';
      if (outcome === 'lost-response') throw Error('lost acknowledgement');
      return {accepted: true};
    }};
  const result = await cleanup.run(options);
  assert.equal(result.state, ['saved', 'lost-response'].includes(outcome) ? 'verified' : 'unconfirmed', outcome);
  assert.equal(writes, 1); assert.equal(reads, 2);
  assert.equal(await cleanup.run(options), result); assert.equal(writes, 1); assert.equal(reads, 2);
  assert.equal((await cleanup.run({...options, nameCorrection: {firstName: 'Alex', lastName: 'Different'}})).reason,
    'operation-scope-mismatch', 'a prior result cannot settle a different selected name');
}
for (const changes of [{nameCorrectionConfirmed: false}, {nameCorrection: {firstName: 'Alex'}},
  {mode: 'repeated-phone'}, {priorWriteUncertain: true}, {cleanupAuthorized: false}]) {
  const f = fixture({mode: 'consolidate', detectionComplete: true, primaryEmail: 'alex@example.invalid',
    nameCorrectionPending: true, nameCorrection: {firstName: 'Alex', lastName: 'Morgan'},
    nameCorrectionConfirmed: true, ...changes});
  assert.equal((await fresh().run(f.options)).state, 'blocked');
  assert.equal(f.calls.length, 0, 'unresolved name, authority or prior write stops before any tool');
}
console.log('PASS: confirmed name/contact single-save orchestration, unchanged primary email, receipt scope, no replay and full saved verification.');

for (const malformed of ['alex.@example.invalid', 'alex @example.invalid', 'alex@example..invalid']) {
  const f = fixture({mode: 'consolidate', detectionComplete: true, primaryEmail: malformed});
  const result = await fresh().run(f.options);
  assert.equal(result.state, 'blocked'); assert.equal(result.writeAttempted, false);
  assert.equal(result.reason, 'email-format-confirmation-required');
  assert.equal(result.emailFormatReview.originalEmail, malformed);
  assert.equal(f.calls.length, 0, 'retained format evidence asks for a choice without new lookups or saves');
}
// Repeated-phone-only cleanup does not audit or change an unrelated email.
const narrowLegacy = fixture(); const withLegacy = clone(customer);
withLegacy.primaryEmail = email('alex.@example.invalid');
narrowLegacy.options.readSavedContacts = async ({phase}) => envelope(phase === 'before' ? withLegacy : {...withLegacy, otherPhoneNumbers: cleaned.otherPhoneNumbers});
assert.equal((await fresh().run(narrowLegacy.options)).state, 'verified');
console.log('PASS: format correction requests stop before tools, preserve the retained case and do not broaden phone-only cleanup.');
