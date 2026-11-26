import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
const source = fs.readFileSync(new URL('./merge_actions.js', import.meta.url), 'utf8');
const probeSource = fs.readFileSync(new URL('./merge_result_probe.js', import.meta.url), 'utf8');
const guardSource = fs.readFileSync(new URL('../../browser-navigation/scripts/agent360_guard.js', import.meta.url), 'utf8');
const pair = {keepingAdminId: '1001', keepingUuid: '11111111-1111-4111-8111-111111111111',
  duplicateUuid: '22222222-2222-4222-8222-222222222222'};
const browser = await chromium.launch({headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
const mcp = value => ({content: [{type: 'text', text: JSON.stringify(value)}]});
let checks = 0;
try {
  const context = await browser.newContext();
  await context.route('**/*', route => route.fulfill({contentType: 'text/html', body: '<main></main>'}));
  const page = await context.newPage();
  await page.goto('https://admin.opendoor.com/admin/customers/1001/merge');
  let reads, clicks, journal, checkpoints, saved, loseReply, rejectClick, checkpointFailure;
  const actions = eval(source);
  const guard = eval(guardSource);
  const tools = {
    async mcp__browser_mcp__browser_execute_script({code}) {
      reads++;
      return mcp({result: await page.evaluate(code)});
    },
    async mcp__browser_mcp__browser_click({selector}) {
      const control = page.locator(selector);
      assert.equal(await control.count(), 1, 'only an exact, unique observed control may be clicked');
      const action = await control.getAttribute('ng-click');
      clicks.push(action);
      if (rejectClick) return mcp({ok: false, error: 'fixture-click-rejected'});
      await control.click({timeout: 1000});
      if (loseReply && action === 'customer_merge.merge()') throw Error('fixture-lost-reply');
      return mcp({ok: true, landed: true});
    },
  };
  const io = actions.agent360({tools, guard, probeSource, timeoutMs: 80});
  const gates = {operationId: 'synthetic-request:pair-1', pair, identityVerified: true, mergeAuthorized: true, io};
  const checkpoint = async entries => {
    checkpoints++;
    if (checkpoints === 1) assert.equal(await page.evaluate('window.submits'), 0, 'save intent before final click');
    if (checkpointFailure === true || (checkpointFailure === 'after' && checkpoints > 1)) {
      throw Error('fixture-checkpoint-failed');
    }
    saved = JSON.parse(JSON.stringify(entries));
  };
  async function fixture({confirmation = false, delay = 0, error = false, complete = true, profileWarning = false} = {}) {
    reads = 0; clicks = []; journal = []; checkpoints = 0; saved = null;
    loseReply = false; rejectClick = false; checkpointFailure = false;
    await page.setContent('<aside><input ng-model="customer_merge.query"><p>Retained suggestion</p></aside>'
      + '<section id="keeping"><div>Keeping this customer</div><input value="Alex"><input value="Morgan">'
      + '<input value="alex@example.invalid"><p>UUID: ' + pair.keepingUuid + '</p>'
      + (profileWarning ? '<div role="alert">"Could not find an MLS agent with that MLS ID."</div>' : '') + '</section>'
      + '<section id="removing"><div>Removing/merging this customer</div><input value="Alex"><input value="Morgan">'
      + '<input value="alex.secondary@example.invalid"><p>UUID: ' + pair.duplicateUuid + '</p>'
      + '<div class="alert-danger">This qualification data will be deleted</div></section>'
      + '<div id="warning" class="alert-warning"><button ng-click="customer_merge.warned = true">Merge</button></div>');
    await page.evaluate(({confirmation, delay, error, complete}) => {
      window.submits = 0;
      const warning = document.querySelector('#warning');
      const installFinal = () => {
        warning.className = 'alert-danger';
        warning.innerHTML = 'Are you really sure? This cannot be undone. '
          + '<button ng-click="customer_merge.merge()">I\'m sure. Merge them.</button>';
        warning.querySelector('button').addEventListener('click', () => {
          window.submits++;
          if (error) {
            document.body.insertAdjacentHTML('beforeend', '<div class="toast-error">Merge failed</div>');
            return;
          }
          if (!complete) return;
          const finish = () => {
            document.querySelector('#removing').remove();
            warning.remove();
            document.body.insertAdjacentHTML('beforeend', '<div class="toast-message">Merged customers</div>');
          };
          if (delay) {
            warning.querySelector('button').disabled = true;
            warning.querySelector('button').textContent = '';
            setTimeout(finish, delay);
          } else finish();
        });
      };
      warning.querySelector('button').addEventListener('click', installFinal, {once: true});
      if (confirmation) installFinal();
    }, {confirmation, delay, error, complete});
  }
  async function review() {
    const selected = await io.read({...pair, includeIdentity: true});
    const result = await actions.review({...gates, selected});
    assert.equal(result.state, 'confirmation-ready');
    assert.match(result.before.warningText, /cannot be undone/);
    assert.equal(await page.evaluate('window.submits'), 0, 'warning review never submits');
    return result;
  }
  const submit = (reviewed, overrides = {}) => actions.submit({...gates, reviewed,
    warningReviewed: true, journal, checkpoint, ...overrides});

  await fixture();
  let reviewed = await review();
  let result = await submit(reviewed);
  assert.equal(result.state, 'verified');
  assert.equal(reads, 5, 'selected identity, grouped warning and grouped submission need only five focused reads');
  assert.equal(clicks.length, 2, 'one warning click and exactly one final click');
  assert.equal(await page.evaluate('window.submits'), 1);
  assert.equal(saved[0].state, 'verified');
  const completedReads = reads;
  assert.deepEqual(await submit(reviewed), result, 'duplicate completed request reuses its receipt');
  assert.equal(reads, completedReads, 'verified completion does not re-read the page');
  assert.equal((await submit(reviewed, {operationId: 'another-request'})).state, 'blocked');
  const restored = eval(source);
  assert.deepEqual(await restored.submit({...gates, reviewed, warningReviewed: true,
    journal: saved, checkpoint}), result, 'restored journal survives helper re-evaluation');
  assert.equal(clicks.length, 2);
  checks++;

  await fixture({profileWarning: true});
  reviewed = await review();
  assert.equal(reviewed.before.profileWarnings.length, 1);
  result = await submit(reviewed);
  assert.equal(result.state, 'verified', 'embedded profile validation permits the reviewed merge and verified result');
  assert.equal(clicks.length, 2);
  assert.equal(await page.evaluate('window.submits'), 1);
  assert.deepEqual(await submit(reviewed), result, 'profile warning never permits a completed-pair replay');
  assert.equal(clicks.length, 2);
  checks++;

  await fixture({confirmation: true});
  reviewed = await review();
  assert.equal(clicks.length, 0, 'already-visible final warning skips first Merge');
  assert.equal((await submit(reviewed)).state, 'verified');
  assert.equal(clicks.length, 1);
  checks++;

  await fixture({delay: 15});
  reviewed = await review();
  assert.equal((await submit(reviewed)).state, 'verified');
  assert.equal(reads, 5, 'delayed rendering stays inside the same read-only observation, not more tool calls');
  checks++;

  await fixture();
  reviewed = await review(); loseReply = true;
  assert.equal((await submit(reviewed)).state, 'verified', 'actual result can settle a lost click response');
  assert.equal(await page.evaluate('window.submits'), 1);
  checks++;

  for (const options of [{error: true}, {complete: false}]) {
    await fixture(options);
    reviewed = await review();
    result = await submit(reviewed);
    assert.equal(result.state, 'unconfirmed');
    assert.equal((await submit(reviewed)).state, 'unconfirmed');
    assert.equal(await page.evaluate('window.submits'), 1, 'ambiguous/rejected result is never submitted twice');
    checks++;
  }

  for (const change of ['identity', 'target', 'warning']) {
    await fixture(); reviewed = await review();
    await page.evaluate(change => {
      if (change === 'identity') document.querySelector('#removing input').value = 'Changed';
      if (change === 'target') document.querySelector('#removing p').textContent = 'UUID: 33333333-3333-4333-8333-333333333333';
      if (change === 'warning') document.querySelector('#warning').prepend('Unexpected new restriction. ');
    }, change);
    assert.equal((await submit(reviewed)).state, 'blocked');
    assert.equal(await page.evaluate('window.submits'), 0);
    checks++;
  }

  await fixture(); reviewed = await review();
  const beforeReads = reads;
  for (const override of [{warningReviewed: false}, {mergeAuthorized: false}, {identityVerified: false},
    {journal: undefined}, {checkpoint: undefined},
    {reviewed: {...reviewed, operationId: 'other-request'}}]) {
    assert.equal((await submit(reviewed, override)).state, 'blocked');
  }
  assert.equal(reads, beforeReads, 'missing authority/review/journal stops before tools');
  checks++;

  await fixture(); reviewed = await review(); checkpointFailure = true;
  assert.equal((await submit(reviewed)).reason, 'submission-checkpoint-failed');
  assert.equal(await page.evaluate('window.submits'), 0);
  checkpointFailure = false;
  assert.equal((await submit(reviewed)).state, 'unconfirmed');
  assert.equal(await page.evaluate('window.submits'), 0, 'checkpoint uncertainty never permits a later blind click');
  checks++;

  await fixture(); reviewed = await review(); rejectClick = true;
  assert.equal((await submit(reviewed)).state, 'unconfirmed');
  rejectClick = false;
  assert.equal((await submit(reviewed)).state, 'unconfirmed');
  assert.equal(await page.evaluate('window.submits'), 0, 'hard tool failure is not retried');
  checks++;

  await fixture({delay: 15}); reviewed = await review();
  const outcomes = await Promise.all([submit(reviewed), submit(reviewed)]);
  assert.ok(outcomes.every(r => ['verified', 'unconfirmed'].includes(r.state)));
  assert.equal(await page.evaluate('window.submits'), 1, 'concurrent calls reserve the pair before writing');
  assert.equal(journal.length, 1);
  checks++;

  await fixture(); reviewed = await review(); checkpointFailure = 'after';
  assert.equal((await submit(reviewed)).reason, 'receipt-checkpoint-failed');
  assert.equal(saved[0].state, 'submitted', 'lost final checkpoint retains pre-click evidence');
  checkpointFailure = false;
  assert.equal((await submit(reviewed, {journal: saved})).state, 'verified');
  assert.equal(await page.evaluate('window.submits'), 1, 'lost receipt checkpoint is read-only recovery');
  checks++;

  await fixture(); reviewed = await review();
  journal.push({operationId: gates.operationId, pair: {...pair, duplicateUuid: pair.keepingUuid}, state: 'submitted'});
  assert.equal((await submit(reviewed)).reason, 'operation-or-pair-already-bound');
  assert.equal(await page.evaluate('window.submits'), 0, 'one request cannot be rebound to another pair');
  checks++;

  await fixture();
  const selected = await io.read({...pair, includeIdentity: true});
  await page.locator('#removing input').first().fill('Changed');
  assert.equal((await actions.review({...gates, selected})).state, 'blocked');
  assert.equal(clicks.length, 0, 'identity drift blocks even the warning click');
  checks++;
  console.log('Merge-action fixtures passed: ' + checks
    + ' scenarios; ready path uses five focused reads and two clicks across identity/warning review boundaries.'
    + ' Delayed rendering, stale identities, real errors, lost replies, checkpoint failures, resumed/concurrent requests and no-replay guards pass. Synthetic isolated browser only.');
} finally { await browser.close(); }
