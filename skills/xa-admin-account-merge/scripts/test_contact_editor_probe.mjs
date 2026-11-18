import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
const probe = fs.readFileSync(new URL('./contact_editor_probe.js', import.meta.url), 'utf8');
const guard = vm.runInNewContext(fs.readFileSync(new URL('../../browser-navigation/scripts/agent360_guard.js', import.meta.url), 'utf8'));
const response = value => ({content: [{type: 'text', text: JSON.stringify(value)}]});
const expected = 'https://opshub.apps.opendoor.com/customers/synthetic';
const browser = await chromium.launch({headless: true});
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
