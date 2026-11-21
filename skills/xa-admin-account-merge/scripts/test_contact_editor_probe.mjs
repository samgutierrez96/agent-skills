import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
const probe = fs.readFileSync(new URL('./contact_editor_probe.js', import.meta.url), 'utf8');
const guard = vm.runInNewContext(fs.readFileSync(new URL('../../browser-navigation/scripts/agent360_guard.js', import.meta.url), 'utf8'));
const response = value => ({content: [{type: 'text', text: JSON.stringify(value)}]});
const expected = 'https://opshub.apps.opendoor.com/customers/synthetic';
const browser = await chromium.launch({headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
try {
  const context = await browser.newContext();
  // Every request is intercepted. Never attach to working Chrome or external systems.
  await context.route('**/*', route => route.fulfill({contentType: 'text/html', body: '<main></main>'}));
  const page = await context.newPage();
  await page.goto(expected);
  const inspect = () => page.evaluate(`(${probe})(${JSON.stringify(expected)})`);
  const fixture = `<main>
    <section hidden><span>Customer Info</span><button>Edit</button></section>
    <section id="customer"><header><span>Customer Info</span><button id="correct">Edit</button></header></section>
    <section><header><span>Agent Info</span><button id="wrong">Edit</button></header></section>
    <output id="writes">0</output>
    <script>
      window.clicks=0;window.wrong=0;
      document.querySelector('#wrong').onclick=()=>window.wrong++;
      document.querySelector('#correct').onclick=()=>{window.clicks++;
        document.querySelector('#customer').innerHTML='<form><input name="firstName" value="Alex"><input name="emails.0.email" value="alex@example.invalid"><input name="phones.0.number" value="2025550123"><button id="save" type="button">Save</button></form>';
        document.querySelector('#save').onclick=()=>document.querySelector('#writes').textContent='1';
      };
    </script></main>`;
  await page.setContent(fixture);
  const before = await page.content();
  let ready = await inspect();
  assert.equal(ready.state, 'edit-ready');
  assert.equal(await page.locator(ready.selector).getAttribute('id'), 'correct');
  assert.equal(await page.content(), before, 'probe must not change the DOM');
  // Styling changes must not affect target resolution.
  await page.locator('#correct').evaluate(e => e.setAttribute('class', 'unrelated-new-style'));
  ready = await inspect();
  let calls = 0;
  await guard.step(async () => {
    calls++;
    await page.locator(ready.selector).click();
    return response({ok: false, landed: false, maybe_landed: true, error: 'synthetic background timeout'});
  }, async () => (await inspect()).state === 'editor-open');
  assert.equal(calls, 1);
  assert.equal(await page.evaluate('window.clicks'), 1);
  assert.equal(await page.evaluate('window.wrong'), 0);
  assert.equal(await page.locator('#writes').innerText(), '0', 'opening the editor must not save');
  assert.equal((await inspect()).state, 'editor-open', 'already open means no new click');

  // A page-global submit selector can inspect an entirely different form.
  const customerForm = `<form id="customer-form">
    <input name="firstName" value="caller@example.invalid">
    <input name="lastName" value="" aria-invalid="true" aria-describedby="lastName-hint lastName-error">
    <span id="lastName-hint">Customer last name</span><p id="lastName-error" class="text-red-500">Required</p>
    <input name="emails.0.email" value="caller@example.invalid">
    <input name="phones.0.number" value="2025550123">
    <button id="customer-save" type="submit" disabled>Save</button>
  </form>`;
  await page.setContent('<form><button type="submit">Save</button><p role="alert">Unrelated error</p></form>'
    + '<form hidden><button type="submit">Save</button></form>' + customerForm);
  const untouched = await page.content();
  let state = await inspect();
  assert.equal(state.editor.save.state, 'disabled');
  assert.equal(await page.locator(state.editor.save.selector).getAttribute('id'), 'customer-save');
  assert.deepEqual(state.editor.empty_name_fields, ['lastName']);
  assert.equal(state.editor.fields.find(f => f.name === 'lastName').invalid, true);
  assert.equal(state.editor.fields.find(f => f.name === 'emails.0.email').value, 'caller@example.invalid');
  assert.equal(await page.locator(state.editor.fields.find(f => f.name === 'phones.0.number').selector).inputValue(), '2025550123',
    'one probe supplies full values and exact controls without another input inventory');
  assert.deepEqual(state.editor.fields.find(f => f.name === 'lastName').described_errors,
    ['Customer last name', 'Required']);
  assert.deepEqual(state.editor.errors, ['Required'], 'ignore errors in other forms');
  assert.equal(await page.content(), untouched, 'full diagnostic remains read-only');
  await page.locator('#customer-save').evaluate(e => e.disabled = false);
  await page.locator('form').first().locator('button').evaluate(e => e.disabled = true);
  assert.equal((await inspect()).editor.save.state, 'ready',
    'disabled unrelated submit must not block the customer save');
  await page.locator('#customer-save').evaluate(e => e.textContent = 'Saving...');
  assert.equal((await inspect()).editor.save.state, 'saving', 'an in-flight save must not look ready to submit again');
  await page.locator('#customer-form').evaluate(e => e.insertAdjacentHTML('beforeend',
    '<button type="button" title="Remove email">Remove</button><button type="button" aria-pressed="true">Primary</button>'));
  state = await inspect();
  assert.equal(state.editor.controls.length, 2);
  assert.equal(await page.locator(state.editor.controls[0].selector).getAttribute('title'), 'Remove email');
  assert.equal(state.editor.controls[1].pressed, 'true');
  await page.locator('#customer-form').evaluate(e => e.insertAdjacentHTML('beforeend',
    '<button type="submit">Save</button>'));
  assert.equal((await inspect()).editor.save.state, 'ambiguous', 'never choose between two customer submits');
  await page.setContent(customerForm.replace('aria-invalid="true"', 'required'));
  state = await inspect();
  assert.equal(state.editor.fields.find(f => f.name === 'lastName').invalid, true,
    'read native validity without calling checkValidity or dispatching events');
  await page.setContent(customerForm + customerForm.replaceAll('customer-form','other-form'));
  await assert.rejects(inspect(), 'multiple contact editors must stop');

  // Structural paths must be handed straight from a fresh probe to the click.
  // Additional layout wrappers change the path without changing the intended Edit.
  const previousSelector = ready.selector;
  await page.setContent('<div><div><div>' + fixture + '</div></div></div>');
  ready = await inspect();
  assert.notEqual(ready.selector, previousSelector);
  await guard.step(async () => {
    await page.locator(ready.selector).click();
    return response({ok: true});
  }, async () => (await inspect()).state === 'editor-open');
  assert.equal(await page.evaluate('window.clicks'), 1, 'fresh returned target opens Customer Info once');
  assert.equal(await page.evaluate('window.wrong'), 0, 'structural changes never select Agent Info');
  assert.equal(await page.locator('#writes').innerText(), '0', 'editor inspection is not another save');
  assert.equal((await inspect()).state, 'editor-open');
  assert.equal(await page.evaluate('window.clicks'), 1, 'an already-open verification editor needs no second click');

  await page.setContent(fixture);
  let later = 0;
  ready = await inspect();
  await assert.rejects(guard.steps([
    {action: async () => response({ok: false, maybe_landed: true}), observe: async () => (await inspect()).state === 'editor-open'},
    {action: async () => {later++; return response({ok: true});}, observe: async () => true},
  ]));
  assert.equal(later, 0, 'no contact mutation after unresolved opening');
  assert.equal(await page.evaluate('window.clicks'), 0, 'an unresolved acknowledgement cannot replay a click');
  await page.locator('#correct').evaluate(e => e.disabled = true);
  await assert.rejects(inspect());
  await page.setContent(fixture);
  await page.locator('#customer header').evaluate(e => e.insertAdjacentHTML('beforeend', '<button>Edit</button>'));
  await assert.rejects(inspect());
  await page.setContent(fixture);
  await page.locator('#correct').evaluate(e => e.remove());
  await assert.rejects(inspect(), 'missing Customer Info Edit cannot select Agent Info Edit');
  await page.setContent(fixture);
  await page.locator('#customer').evaluate(e => e.remove());
  await assert.rejects(inspect(), 'must not fall through to Agent Info');
  await page.setContent(fixture);
  await page.goto('https://opshub.apps.opendoor.com/customers/other-synthetic');
  await assert.rejects(inspect(), 'retained customer mismatch must stop');
  console.log('Contact-editor synthetic checks passed: scoped Edit, hidden duplicates, style independence, false timeout, no replay/save, and mismatch/ambiguity guards. No live customer/browser connection.');
} finally {
  await browser.close();
}
