import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const api = vm.runInNewContext(fs.readFileSync(new URL('./contact_update_plan.js', import.meta.url), 'utf8'));
const clone = x => JSON.parse(JSON.stringify(x));
const email = value => ({address: {value}});
const phone = (value, type) => ({number: {value}, type});
const uuid = '00000000-0000-4000-8000-000000000001';
const original = {
  uuid, firstName: 'caller@example.invalid', lastName: '', isAgent: false,
  primaryEmail: email('caller@example.invalid'), otherEmails: [],
  primaryPhoneNumber: phone('+12025550123', 'MOBILE'),
  otherPhoneNumbers: [phone('+12025550123', 'HOME')],
};
const input = () => ({customer: clone(original), customerUuid: uuid,
  primaryEmail: 'caller@example.invalid', callerPhone: '(202) 555-0123',
  identityVerified: true, cleanupAuthorized: true, contactsComplete: true});
const before = input();
assert.equal(Boolean(before.customer.firstName && before.customer.lastName), false,
  'source-verified full editor name requirement blocks this synthetic profile');
const ready = clone(api.plan(before));
assert.equal(ready.state, 'ready', 'blank surname and email-as-name do not block contact-only update');
assert.deepEqual(before, input(), 'planner must not mutate its inputs');
assert.deepEqual(ready.request, {operation_name: 'UpdateCustomer', variables: {input: {uuid, params: {
  phones: [{old: {number: '+12025550123', type: 'HOME'}}],
}}}});
assert.deepEqual(Object.keys(ready.request.variables.input.params), ['phones'],
  'names, roles, marketing preferences and unchanged email must be omitted');
const persisted = clone(original); persisted.otherPhoneNumbers = [];
// Synthetic connector: apply the real old/new delta shape to persisted state.
// The read after this call must verify before a containing workflow can post.
const fakeStore = clone(original);
let writes = 0;
const fakeUpdateCustomer = request => {
  assert.equal(request.operation_name, 'UpdateCustomer');
  const {uuid: target, params} = request.variables.input;
  assert.equal(target, fakeStore.uuid);
  assert.deepEqual(Object.keys(params), ['phones']);
  for (const delta of params.phones) {
    assert.equal(delta.new, undefined);
    assert.notDeepEqual(delta.old, {number: fakeStore.primaryPhoneNumber.number.value,
      type: fakeStore.primaryPhoneNumber.type}, 'never remove the retained primary tuple');
    fakeStore.otherPhoneNumbers = fakeStore.otherPhoneNumbers.filter(p =>
      !(p.number.value === delta.old.number && p.type === delta.old.type));
  }
  writes++;
};
fakeUpdateCustomer(ready.request);
assert.equal(writes, 1);
assert.equal(api.verify(ready, fakeStore, true), true, 'contact-only path verifies without inventing a surname');
assert.equal(fakeStore.firstName, original.firstName);
assert.equal(fakeStore.lastName, '');
assert.equal(api.plan({...input(), nameCorrectionPending:true}).state, 'blocked',
  'contact-only path cannot discard an explicitly requested name correction');
assert.equal(api.verify(ready, persisted, true), true);
assert.equal(api.verify(ready, original, true), false, 'draft deletion is not a persisted-save receipt');
assert.equal(api.verify(ready, persisted, false), false, 'compact reads cannot verify full contact lists');
assert.equal(clone(api.plan({...input(), customer: persisted})).state, 'noop');
for (const field of ['identityVerified','cleanupAuthorized','contactsComplete']) {
  assert.equal(api.plan({...input(), [field]:false}).state, 'blocked');
}
for (const field of ['otherEmails','otherPhoneNumbers','primaryEmail','primaryPhoneNumber']) {
  const x=input(); delete x.customer[field]; assert.equal(api.plan(x).state, 'blocked');
}
let x=input(); x.customerUuid='another-customer'; assert.equal(api.plan(x).reason,'customer-mismatch');
x=input(); x.primaryEmail='unconfirmed@example.invalid'; assert.equal(api.plan(x).state,'blocked');
x=input(); x.callerPhone='2025550199'; assert.equal(api.plan(x).state,'blocked');
x=input(); x.customer.otherPhoneNumbers[0].type='MOBILE';
assert.equal(api.plan(x).reason,'ambiguous-phone-tuple', 'never delete an indistinguishable primary');
x=input(); delete x.customer.otherPhoneNumbers[0].type; assert.equal(api.plan(x).state,'blocked');
x=input(); x.customer.otherPhoneNumbers=[null]; assert.equal(api.plan(x).state,'blocked');
x=input(); x.customer.otherEmails=[email('extra@example.invalid')];
assert.deepEqual(clone(api.plan(x)).request.variables.input.params.emails,
  [{old:{address:'extra@example.invalid'}}]);
x=input(); x.customer.otherEmails=[email('CALLER@example.invalid')]; assert.equal(api.plan(x).state,'blocked');
x=input(); x.customer.primaryEmail=email('extra@example.invalid');
x.customer.otherEmails=[email('caller@example.invalid')];
assert.equal(clone(api.plan(x)).request.variables.input.params.emails[1].new.makePrimary,true);
x=input(); x.customer.primaryPhoneNumber=phone('+12025550199','WORK');
assert.equal(clone(api.plan(x)).request.variables.input.params.phones[1].new.makePrimary,true);
for (const [field,value] of [['uuid','wrong'],['firstName','Invented'],['lastName','Unknown'],['isAgent',true]]) {
  assert.equal(api.verify(ready,{...persisted,[field]:value},true),false,'unrelated fields must remain unchanged');
}
const changedType=clone(persisted); changedType.primaryPhoneNumber.type='HOME';
assert.equal(api.verify(ready,changedType,true),false);
console.log('Contact-only planner checks passed: blank name, contact deltas, no invention or unrelated writes, exact-customer/type/identity gates, ambiguity, no-op and persisted verification. No live tools.');

// Repeated-number cleanup is NOT sole-contact consolidation. Preserve every
// email and different number; no keeping-email selection or account search.
const repeatedInput = () => ({...input(), primaryEmail: undefined, accountConflict: false});
let repeated = repeatedInput();
repeated.customer.otherEmails = [email('secondary@example.invalid')];
repeated.customer.otherPhoneNumbers.push(phone('+12025550199', 'WORK'));
const untouched = clone(repeated);
const narrow = clone(api.planRepeatedPhone(repeated));
assert.equal(narrow.state, 'ready');
assert.deepEqual(clone(repeated), untouched);
assert.deepEqual(narrow.request.variables.input.params,
  {phones:[{old:{number:'+12025550123',type:'HOME'}}]});
const narrowSaved = clone(repeated.customer);
narrowSaved.otherPhoneNumbers = narrowSaved.otherPhoneNumbers.filter(p => p.type !== 'HOME');
assert.equal(api.verify(narrow, narrowSaved, true), true);
assert.equal(api.verify(narrow, repeated.customer, true), false);
assert.equal(api.planRepeatedPhone({...repeated,customer:narrowSaved}).state, 'noop');
for (const field of ['identityVerified','cleanupAuthorized','contactsComplete','accountConflict']) {
  const wrong = {...repeated, [field]:field === 'accountConflict' ? true : false};
  assert.equal(api.planRepeatedPhone(wrong).state,'blocked');
  delete wrong[field]; assert.equal(api.planRepeatedPhone(wrong).state,'blocked');
}
for (const mutate of [
  p => p.otherEmails.pop(),
  p => p.otherEmails.push(email('unexpected@example.invalid')),
  p => p.otherPhoneNumbers.pop(),
  p => p.otherPhoneNumbers[0].type = 'HOME',
  p => p.primaryEmail = email('unexpected@example.invalid'),
  p => p.firstName = 'Changed',
  p => p.uuid = 'wrong-customer',
]) {
  const changed=clone(narrowSaved); mutate(changed);
  assert.equal(api.verify(narrow,changed,true),false,'Full persisted preservation is required');
}
repeated=repeatedInput();repeated.customer.primaryEmail=null;
assert.equal(api.planRepeatedPhone(repeated).state,'ready','No email is needed for phone-only deduplication');
repeated=repeatedInput();repeated.customer.otherPhoneNumbers[0].type='MOBILE';
assert.equal(api.planRepeatedPhone(repeated).reason,'ambiguous-phone-tuple');
repeated=repeatedInput();repeated.customer.primaryPhoneNumber=phone('+12025550199','WORK');
assert.equal(api.planRepeatedPhone(repeated).reason,'caller-number-is-not-the-saved-primary');
repeated=repeatedInput();delete repeated.customer.otherPhoneNumbers[0].type;
assert.equal(api.planRepeatedPhone(repeated).state,'blocked');
console.log('PASS: repeated-number-only read/edit/verify planning, no email choice, preserved distinct contacts, no account-conflict bypass and no live tools.');
