import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
const probe = fs.readFileSync(new URL('./merge_result_probe.js', import.meta.url), 'utf8');
const pair = {keepingAdminId: '1001', keepingUuid: '11111111-1111-4111-8111-111111111111',
  duplicateUuid: '22222222-2222-4222-8222-222222222222'};
const browser = await chromium.launch({headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
try {
  const context = await browser.newContext();
  await context.route('**/*', route => route.fulfill({contentType: 'text/html', body: '<main></main>'}));
  const page = await context.newPage();
  await page.goto('https://admin.opendoor.com/admin/customers/1001/merge');
  const fixture = `<aside><input ng-model="customer_merge.query"><p>Alex Morgan — alex@example.invalid</p></aside>
    <section id="keeping"><div>Keeping this customer</div><input value="alex@example.invalid">
      <p>UUID: ${pair.keepingUuid}</p><div class="alert-danger">Both of these customers have logins (humans).</div></section>
    <section id="removing"><div>Removing/merging this customer</div><input value="alex.secondary@example.invalid">
      <p>UUID: ${pair.duplicateUuid}</p></section>
    <div id="warning" class="alert-danger">Are you really sure? This cannot be undone.
      <button ng-click="customer_merge.merge()">I'm sure. Merge them.</button></div>`;
  const inspect = options => page.evaluate(`(${probe})(${JSON.stringify({...pair, ...options})})`);
  await page.setContent(fixture);
  const dom = await page.content();
  const before = await inspect();
  assert.equal(before.state, 'confirmation-ready');
  assert.equal(await page.content(), dom, 'observation must not change the page');
  assert.equal((await inspect({before, submitted: true})).state, 'unverified', 'warning is not success');
  await page.locator('[ng-click="customer_merge.merge()"]').evaluate(e => {e.textContent = ''; e.disabled = true;});
  assert.equal((await inspect({before, submitted: true})).state, 'unverified', 'spinner is not success');
  await page.setContent(fixture);
  // Synthetic completion leaves the sidebar entry, but clears the submitted pair.
  await page.locator('#removing').evaluate(e => e.remove());
  await page.locator('#warning').evaluate(e => e.remove());
  let result = await inspect({before, submitted: true});
  assert.equal(result.state, 'verified');
  assert.equal(result.evidence, 'submitted-pair-panel-cleared');
  assert.equal(result.retryMerge, false);
  assert.equal(await page.locator('aside').innerText(), 'Alex Morgan — alex@example.invalid');
  for (const options of [{}, {submitted: true}, {before},
    {before: {...before, snapshot: {...before.snapshot, duplicateUuid: pair.keepingUuid}}, submitted: true}]) {
    assert.equal((await inspect(options)).state, 'unverified', 'blank panel alone is not a receipt');
  }
  await page.locator('#keeping').evaluate(e => e.insertAdjacentHTML('afterend', '<div class="fa-spinner">Loading</div>'));
  assert.equal((await inspect({before, submitted: true})).state, 'unverified', 'incomplete render is not completion');
  await page.setContent(fixture + '<div class="toast-message">Merged customers</div>');
  result = await inspect({before, submitted: true});
  assert.equal(result.state, 'verified', 'new success toast also suffices if the panel lingers');
  const staleToast = await inspect();
  assert.equal((await inspect({before: staleToast, submitted: true})).state, 'unverified', 'prior-pair toast is not new success');
  await page.locator('#removing p').evaluate(e => e.textContent = 'UUID: 33333333-3333-4333-8333-333333333333');
  assert.equal((await inspect({before, submitted: true})).state, 'unverified', 'new toast on a changed candidate is not this pair result');
  await page.setContent(fixture.replace(pair.keepingUuid, '33333333-3333-4333-8333-333333333333'));
  assert.equal((await inspect({before, submitted: true})).state, 'unverified', 'different survivor must stop');
  await page.setContent(fixture + '<div class="toast-error">Merge failed</div>');
  assert.equal((await inspect({before, submitted: true})).state, 'unverified', 'failure prevents completion');
  await page.goto('https://admin.opendoor.com/admin/customers/1002/merge');
  await assert.rejects(inspect({before, submitted: true}), 'wrong Admin route must stop');
  assert.equal(result.retryMerge, false, 'probe never recommends repeating a submitted write');
  console.log('Merge-result fixtures passed: toast, cleared pair, retained sidebar, loading/warning/error, stale/wrong pair and no-retry guards. No live browser or mutation.');
} finally {
  await browser.close();
}
