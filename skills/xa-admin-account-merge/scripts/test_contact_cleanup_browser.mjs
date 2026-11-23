// New isolated browser, intercepted synthetic pages, no production connections.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
const source = name => fs.readFileSync(new URL(name, import.meta.url), 'utf8');
const helperSource = source('contact_cleanup.js');
const probeSource = source('contact_editor_probe.js');
const planner = vm.runInNewContext(source('contact_update_plan.js'));
const guard = vm.runInNewContext(source('../../browser-navigation/scripts/agent360_guard.js'));
const expectedUrl = 'https://opshub.apps.opendoor.com/customers/synthetic-caller';
const response = value => ({content: [{type: 'text', text: JSON.stringify(value)}]});
const browser = await chromium.launch({headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
try {
  const context = await browser.newContext();
  let cleaned = false, navigations = 0, updates = 0, warning = false, layout = 'expanded';
  let lostResponse = false, preserveWrite = true, damageAfter = false, promote = false, named = false, nameFix = false;
  const calls = [];
  const fixture = () => `<main><button id="details" ${layout === 'collapsed' ? '' : 'hidden'}>Details</button>
    <section id="customer" ${layout === 'collapsed' ? 'hidden' : ''}><header ${layout === 'open' ? 'hidden' : ''}><span>Customer Info</span><button id="edit">Edit</button></header>
    <form ${layout === 'open' ? '' : 'hidden'}><input name="firstName" value="Alex"><input name="lastName" value="${nameFix ? cleaned ? 'Morgan' : 'Morgan (Example Appraisals)' : named ? 'Morgan' : ''}">
      <div><input name="emails.0.email" value="${nameFix ? 'alex.morgan@example.invalid' : 'alex@example.invalid'}"><button type="button" aria-pressed="true">Primary</button></div>
      <div><input name="emails.1.email" value="other@example.invalid"><button type="button" aria-pressed="false">Make primary</button></div>
      <div><input name="phones.0.number" value="${promote && !cleaned ? '+12025550125' : '+12025550123'}"><button type="button" role="combobox">${promote && cleaned ? 'Other' : 'Mobile'}</button><button type="button" aria-pressed="true">Primary</button></div>
      ${cleaned ? '' : '<div><input name="phones.1.number" value="2025550123"><button type="button" role="combobox">Other</button><button type="button" aria-pressed="false">Make primary</button></div>'}
      <div><input name="phones.${cleaned ? 1 : 2}.number" value="+12025550124"><button type="button" role="combobox">Work</button><button type="button" aria-pressed="false">Make primary</button></div>
      <div><label for="isAgent">Agent</label><button id="isAgent" type="button" role="switch" aria-checked="${named}"><span></span></button>
        <input type="checkbox" aria-hidden="true" tabindex="-1" style="position:absolute;opacity:0;pointer-events:none" ${named ? 'checked' : ''}></div>
      <div><label for="isVendor">Vendor</label><button id="isVendor" type="button" role="switch" aria-checked="false"><span></span></button>
        <input type="checkbox" aria-hidden="true" tabindex="-1" style="position:absolute;opacity:0;pointer-events:none"></div>
      <div><div><label for="smsMarketing">SMS Marketing</label><p>Enrolled</p></div>
        <button id="smsMarketing" type="button" role="switch" aria-checked="true"><span></span></button>
        <input type="checkbox" aria-hidden="true" tabindex="-1" style="position:absolute;opacity:0;pointer-events:none" checked></div>
      <div><div><label for="callMarketing">Call Marketing</label><p>Unenrolled</p></div>
        <button id="callMarketing" type="button" role="switch" aria-checked="false"><span></span></button>
        <input type="checkbox" aria-hidden="true" tabindex="-1" style="position:absolute;opacity:0;pointer-events:none"></div>
      <button type="submit" ${named && !nameFix ? '' : 'disabled'}>Save</button>
    </form></section><section><span>Agent Info</span><button id="wrong">Edit</button></section>
    <script>document.querySelector('#details').onclick=()=>{document.querySelector('#customer').hidden=false;document.querySelector('#details').hidden=true;};
      document.querySelector('#edit').onclick=()=>{document.querySelector('form').hidden=false;document.querySelector('#customer header').hidden=true;};
      document.querySelector('#wrong').onclick=()=>{throw Error('wrong editor');};</script></main>`;
  await context.route('**/*', route => route.fulfill({contentType: 'text/html', body: fixture()}));
  const page = await context.newPage();
  await page.goto(expectedUrl);
  const tools = {
    mcp__browser_mcp__browser_execute_script: async ({code}) => {
      calls.push('read');
      // Agent 360 wraps an expression; it does not inject Node/host globals.
      try {return response({result: await page.evaluate('(' + code + '\n)')});}
      catch {return response({ok: false, error: 'synthetic-page-read-failed'});}
    },
    mcp__browser_mcp__browser_wait: async ({selector, timeout}) => {
      calls.push('wait');
      throw Error('Ready editor must not wait for a hidden Customer Info heading: ' + selector);
    },
    mcp__browser_mcp__browser_click: async ({selector}) => {
      if (await page.locator(selector).getAttribute('type') === 'submit') calls.push('save');
      calls.push('click'); await page.locator(selector).click();
      return response(warning ? {ok: false, maybe_landed: true} : {ok: true});
    },
    mcp__browser_mcp__browser_navigate: async ({url}) => {
      calls.push('navigate'); navigations++; await page.goto(url); return response({ok: true, url});
    },
  };
  for (const scenario of [{layout: 'expanded'}, {layout: 'collapsed'}, {layout: 'open'},
    {layout: 'collapsed', warning: true}, {layout: 'open', noop: true},
    {layout: 'collapsed', mode: 'consolidate'}, {layout: 'open', mode: 'consolidate', promote: true, named: true},
    {layout: 'open', mode: 'consolidate', correction: true, named: true},
    {layout: 'collapsed', mode: 'consolidate', correction: true, named: true, lost: true},
    {layout: 'open', mode: 'consolidate', correction: true, named: true, unchanged: true},
    {layout: 'open', mode: 'consolidate', correction: true, named: true, damaged: true},
    {layout: 'collapsed', lost: true}, {layout: 'collapsed', unchanged: true}, {layout: 'collapsed', damaged: true},
    ...['isAgent', 'isVendor', 'smsMarketing', 'callMarketing'].map(damaged => ({layout: 'open', damaged}))]) {
    layout = scenario.layout; cleaned = false; warning = scenario.warning || false; calls.length = 0;
    cleaned = scenario.noop || false;
    lostResponse = scenario.lost || false; preserveWrite = !scenario.unchanged; damageAfter = scenario.damaged || false;
    promote = scenario.promote || false; named = scenario.named || false; nameFix = scenario.correction || false;
    await page.goto(expectedUrl);
    // functions.exec has no URL, document, timers, process or require.
    const cleanup = vm.runInNewContext(helperSource);
    const reader = cleanup.agent360Reader({tools, guard, probeSource, expectedUrl, pristineTaskWindow: true});
    const before = await page.content();
    const open = await page.evaluate(`(${probeSource})(${JSON.stringify(expectedUrl)})`);
    assert.equal(open.state, layout === 'collapsed' ? 'details-ready' : layout === 'open' ? 'editor-open' : 'edit-ready');
    assert.equal(await page.content(), before, 'probe is read-only');
    const oldUpdates = updates, oldNavigations = navigations;
    const options = {operationId: 'synthetic-request', mode: scenario.mode || 'repeated-phone',
      customerUuid: 'synthetic-caller', callerPhone: '+12025550123', identityVerified: true,
      cleanupAuthorized: true, accountConflict: false, planner, readSavedContacts: reader,
      ...(scenario.mode === 'consolidate' ? {detectionComplete: true,
        primaryEmail: nameFix ? 'alex.morgan@example.invalid' : 'alex@example.invalid'} : {}),
      ...(nameFix ? {nameCorrectionPending: true, nameCorrectionConfirmed: true,
        nameCorrection: {firstName: 'Alex', lastName: 'Morgan'}} : {}),
      updateCustomer: async request => {
        calls.push('update'); updates++;
        if (!scenario.mode) assert.deepEqual(JSON.parse(JSON.stringify(request.variables.input.params)), {
          phones: [{old: {number: '2025550123', type: 'OTHER'}}]});
        if (nameFix) {
          assert.equal(request.variables.input.params.firstName, 'Alex');
          assert.equal(request.variables.input.params.lastName, 'Morgan');
          assert.deepEqual(JSON.parse(JSON.stringify(request.variables.input.params.emails)),
            [{old: {address: 'other@example.invalid'}}], 'never rewrite the selected primary email');
        }
        cleaned = preserveWrite;
        if (lostResponse) throw Error('synthetic lost reply');
        return response({accepted: true});
      }};
    // Consolidation reuses the same adapter, but retains its separate qualification/choices.
    const originalNavigate = tools.mcp__browser_mcp__browser_navigate;
    tools.mcp__browser_mcp__browser_navigate = async args => {
      const result = await originalNavigate(args);
      if (cleaned && scenario.mode === 'consolidate') {
        await page.locator('input[name="emails.1.email"]').locator('..').evaluate(e => e.remove());
        await page.locator('input[name="phones.1.number"]').locator('..').evaluate(e => e.remove());
      }
      if (damageAfter === true) await page.locator('input[name="lastName"]').evaluate(e => e.value = 'Unrequested');
      else if (damageAfter) await page.locator('#' + damageAfter).evaluate(e => {
        e.setAttribute('aria-checked', String(e.getAttribute('aria-checked') !== 'true'));
      });
      return result;
    };
    const result = await cleanup.run(options);
    tools.mcp__browser_mcp__browser_navigate = originalNavigate;
    assert.equal(result.state, scenario.unchanged || scenario.damaged ? 'unconfirmed' : 'verified',
      JSON.stringify({scenario, failure: result.failure}));
    assert.equal(updates - oldUpdates, scenario.noop ? 0 : 1);
    assert.equal(navigations - oldNavigations, scenario.noop ? 0 : 1, 'at most one persisted-state revisit');
    const perVisit = layout === 'collapsed' ? 2 : layout === 'open' ? 0 : 1;
    const visits = scenario.noop ? 1 : 2;
    assert.equal(calls.filter(c => c === 'click').length, perVisit * visits, 'one click per required control; never reopen an open editor');
    assert.equal(calls.filter(c => c === 'read').length, (perVisit + 1) * visits,
      'each ready state is read once; the final editor read includes complete saved evidence');
    assert.equal(calls.includes('wait'), false, 'no redundant heading/input wait or hidden-heading timeout');
    assert.equal(calls.includes('save'), false, 'the editor is read-only before and after the single connector update');
    if (nameFix) {
      assert.equal(await page.locator('input[name="emails.0.email"]').inputValue(), 'alex.morgan@example.invalid');
      assert.equal(await page.locator('button[type="submit"]').isDisabled(), true,
        'an inspection editor cannot force a UI save or suppress persisted delta verification');
    }
    assert.equal(await page.locator('input[name^="phones."]').count(), scenario.unchanged ? 3 : scenario.mode ? 1 : 2);
    assert.equal(await page.locator('input[name^="emails."]').count(), scenario.mode && !scenario.unchanged ? 1 : 2,
      'preserve emails unless qualified consolidation actually persisted');
    const settledCalls = calls.length;
    assert.equal(await cleanup.run(options), result, 'repeat returns the original outcome, including an uncertain save');
    assert.equal(calls.length, settledCalls, 'never re-read, re-open or re-save on a duplicate operation');
    await assert.rejects(reader({phase: scenario.noop ? 'before' : 'after', customerUuid: 'synthetic-caller'}),
      /unexpected-contact-read/, 'no extra verification loop');
  }
  layout = 'expanded'; promote = false; named = false; damageAfter = false; nameFix = false;
  const cleanup = vm.runInNewContext(helperSource);
  assert.throws(() => cleanup.agent360Reader({tools, guard, probeSource, expectedUrl}), /fresh-owned-task-window/);
  cleaned = false; calls.length = 0;
  await page.goto(expectedUrl);
  // Async rendering is observed inside the same read, not another model/tool round.
  const markup = await page.locator('main').innerHTML();
  await page.locator('main').evaluate(e => e.innerHTML = 'Loading');
  const delayedReader = cleanup.agent360Reader({tools, guard, probeSource, expectedUrl, pristineTaskWindow: true});
  const delayedRead = delayedReader({phase: 'before', customerUuid: 'synthetic-caller'});
  await page.locator('main').evaluate((e, html) => {
    e.innerHTML = html;
    e.querySelector('#edit').onclick = () => {e.querySelector('form').hidden = false;e.querySelector('header').hidden = true;};
  }, markup);
  assert.equal((await delayedRead).contactsComplete, true);
  assert.equal(calls.filter(c => c === 'read').length, 2, 'delayed DOM readiness stays inside the initial read');
  assert.equal(calls.includes('wait'), false);

  // An exact read blocker is returned immediately and cannot authorize a write.
  await page.goto(expectedUrl); await page.locator('#edit').click();
  await page.locator('button[role="combobox"]').first().evaluate(e => e.textContent = 'Unknown');
  let blockedWrites = 0;
  const blockedOptions = {operationId: 'synthetic-blocked', mode: 'repeated-phone',
    customerUuid: 'synthetic-caller', callerPhone: '+12025550123', identityVerified: true,
    cleanupAuthorized: true, accountConflict: false, planner,
    readSavedContacts: cleanup.agent360Reader({tools, guard, probeSource, expectedUrl, pristineTaskWindow: true}),
    updateCustomer: async () => {blockedWrites++;}};
  const blocked = await cleanup.run(blockedOptions);
  assert.equal(blocked.state, 'blocked'); assert.equal(blocked.failure.code, 'phone-type-unavailable');
  assert.equal(blockedWrites, 0, 'unknown contact types never reach the update');

  for (const scenario of ['wrong-customer', 'ambiguous-details', 'not-ready', 'click-failed', 'click-uncertain']) {
    await page.goto(scenario === 'wrong-customer' ? expectedUrl + '-other' : expectedUrl);
    if (scenario === 'ambiguous-details') await page.locator('main').evaluate(e => {
      e.innerHTML = '<button>Details</button><button>Details</button>';
    });
    if (scenario === 'not-ready') await page.locator('main').evaluate(e => e.innerHTML = 'Loading');
    let ticks = 0;
    const bounded = vm.runInNewContext(helperSource, {Date: {now: () => ticks++ * 10000}});
    const originalClick = tools.mcp__browser_mcp__browser_click;
    let clicks = 0, writes = 0;
    if (scenario.startsWith('click-')) tools.mcp__browser_mcp__browser_click = async () => {
      clicks++;
      return response({ok: false, ...(scenario === 'click-uncertain' ? {maybe_landed: true} : {})});
    };
    const options = {operationId: 'synthetic-' + scenario, mode: 'repeated-phone',
      customerUuid: 'synthetic-caller', callerPhone: '+12025550123', identityVerified: true,
      cleanupAuthorized: true, accountConflict: false, planner,
      readSavedContacts: bounded.agent360Reader({tools, guard, probeSource, expectedUrl, pristineTaskWindow: true}),
      updateCustomer: async () => {writes++;}};
    const result = await bounded.run(options);
    tools.mcp__browser_mcp__browser_click = originalClick;
    assert.equal(result.state, 'blocked', scenario);
    assert.equal(writes, 0, 'route, readiness and unresolved clicks must stop before any contact write');
    assert.equal(clicks, scenario.startsWith('click-') ? 1 : 0, 'a failed/uncertain click is never replayed');
    const reason = {'wrong-customer': 'customer-page-mismatch', 'ambiguous-details': 'ambiguous-customer-details',
      'not-ready': 'contact-editor-readiness-timeout', 'click-uncertain': 'contact-editor-readiness-timeout'}[scenario];
    if (reason) assert.equal(result.failure.code, reason);
    assert.equal(await bounded.run(options), result, 'a repeated blocked request stays bounded');
  }
  await page.goto(expectedUrl);
  await page.locator('#edit').click();
  const snapshotCode = `(${cleanup.snapshot.toString()})((${probeSource}),${JSON.stringify(expectedUrl)})`;
  let unchanged = await page.content();
  const snapshot = await page.evaluate(snapshotCode);
  assert.equal(snapshot.customer.lastName, '', 'unknown names are preserved, not repaired');
  assert.equal(snapshot.customer.isAgent, false);
  assert.deepEqual(snapshot.preferences.map(r => [r.name, r.text, r.checked]), [
    ['isAgent', 'Agent', 'false'], ['isVendor', 'Vendor', 'false'],
    ['smsMarketing', 'SMS Marketing', 'true'], ['callMarketing', 'Call Marketing', 'false'],
  ], 'use labelled public switches once, excluding the rendered Radix form-input mirrors');
  assert.ok(await page.locator('input[aria-hidden="true"]').first().evaluate(e => e.getClientRects().length),
    'the old dimensions-only visibility filter includes the hidden mirror and reproduces the failure');
  assert.equal(await page.content(), unchanged, 'complete snapshot is read-only');
  await page.locator('button[role="combobox"]').first().evaluate(e => e.textContent = 'Unknown');
  await assert.rejects(page.evaluate(snapshotCode), /phone-type-unavailable/);
  await page.goto(expectedUrl); await page.locator('#edit').click();
  await page.locator('button[aria-pressed]').first().evaluate(e => e.removeAttribute('aria-pressed'));
  await assert.rejects(page.evaluate(snapshotCode), /primary-state-ambiguous/);
  await page.goto(expectedUrl); await page.locator('#edit').click();
  await page.locator('form').evaluate(e => e.insertAdjacentHTML('beforeend',
    '<label>Agent<button type="button" role="switch" aria-checked="true"></button></label>'));
  await assert.rejects(page.evaluate(snapshotCode), /agent-role-ambiguous/, 'real duplicate Agent controls still block');
  await page.goto(expectedUrl); await page.locator('#edit').click();
  await page.locator('#smsMarketing').evaluate(e => e.removeAttribute('aria-checked'));
  await assert.rejects(page.evaluate(snapshotCode), /preference-state-unavailable/, 'missing state is not false');
  await page.goto('https://opshub.apps.opendoor.com/customers/wrong');
  await assert.rejects(page.evaluate(snapshotCode), /Customer page mismatch/);
  await context.close();
  console.log('Contact cleanup browser: one-pass exact read/edit/verify, read-only snapshots, preserved contacts and guarded warnings passed.');
} finally {await browser.close();}
