// Trusted orchestration, not a customer selector or authorization source.
// Inject documented connector/UI tools. Never retries a mutation or posts a note.
(() => {
  const attempts = new Map();
  const copy = value => JSON.parse(JSON.stringify(value));
  const stopped = (reason, writeAttempted = false) => ({
    state: writeAttempted ? 'unconfirmed' : 'blocked', reason, writeAttempted,
  });

  // Runs inside the verified, freshly opened, unchanged Customer Info editor.
  // DOM inspection only; form values are never edited or submitted here.
  function snapshot(probe, expectedUrl, inspected) {
    const p = inspected || probe(expectedUrl);
    if (p.state !== 'editor-open' || p.editor.save.state === 'saving') throw Error('saved-editor-unavailable');
    const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
    const first = p.editor.fields.find(f => f.name === 'firstName');
    const last = p.editor.fields.find(f => f.name === 'lastName');
    if (!first || !last) throw Error('name-preservation-evidence-missing');
    const form = document.querySelector(p.editor.form_selector);
    // Radix switches also render transparent, aria-hidden native inputs for
    // form submission. Those inputs have dimensions, but are not a second
    // Agent/preference control. Read the labelled public control exactly once.
    const roles = [...form.querySelectorAll('[role="switch"],[role="checkbox"],input[type="checkbox"]')]
      .filter(e => visible(e) && !e.closest('[aria-hidden="true"],[hidden],[inert]')
        && getComputedStyle(e).opacity !== '0').map(e => {
        const labels = [...(e.labels || [])].filter(label => form.contains(label) && visible(label));
        const labelled = (e.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean)
          .map(id => document.getElementById(id)).filter(label => label && form.contains(label) && visible(label));
        const text = e.getAttribute('aria-label')?.trim()
          || (labelled.length ? labelled : labels).map(label => label.innerText.trim()).join(' ')
          || e.parentElement.innerText.trim();
        const checked = e.getAttribute('aria-checked')
          ?? (e.matches('input[type="checkbox"]') ? String(e.checked) : '');
        if (!text || !['true', 'false'].includes(checked)) throw Error('preference-state-unavailable');
        return {name: e.name || e.id || '', text, checked};
      });
    const agents = roles.filter(r => r.text === 'Agent');
    if (agents.length !== 1 || !['true', 'false'].includes(agents[0].checked)) throw Error('agent-role-ambiguous');
    function contacts(prefix) {
      const fields = p.editor.fields.filter(f => f.name.startsWith(prefix + '.'));
      const rows = fields.map((f, index) => {
        const match = f.name.match(new RegExp('^' + prefix + '\\.(\\d+)\\.(?:email|number)$'));
        if (!match || Number(match[1]) !== index || !f.value.trim()) throw Error('contact-list-incomplete');
        const input = document.querySelector(f.selector);
        const row = input.parentElement;
        const primary = [...row.querySelectorAll('button[aria-pressed]')].filter(visible);
        if (primary.length !== 1 || !['true', 'false'].includes(primary[0].getAttribute('aria-pressed'))) {
          throw Error('primary-state-ambiguous');
        }
        const value = {primary: primary[0].getAttribute('aria-pressed') === 'true'};
        if (prefix === 'emails') value.address = {value: f.value};
        else {
          const types = [...row.querySelectorAll('button[role="combobox"]')].filter(visible);
          const type = types.length === 1 ? types[0].innerText.trim().toUpperCase() : '';
          if (!['HOME', 'MOBILE', 'OTHER', 'WORK'].includes(type)) throw Error('phone-type-unavailable');
          value.number = {value: f.value}; value.type = type;
        }
        return value;
      });
      if (rows.length && rows.filter(r => r.primary).length !== 1) throw Error('primary-state-ambiguous');
      return rows;
    }
    const emails = contacts('emails'), phones = contacts('phones');
    return {contactsComplete: true, persisted: true, preferences: roles,
      customer: {uuid: new URL(expectedUrl).pathname.split('/').filter(Boolean).at(-1),
        firstName: first.value, lastName: last.value, isAgent: agents[0].checked === 'true',
        primaryEmail: emails.find(e => e.primary) || null, otherEmails: emails.filter(e => !e.primary),
        primaryPhoneNumber: phones.find(e => e.primary) || null, otherPhoneNumbers: phones.filter(e => !e.primary)}};
  }

  // Browser-only, read-only condition wait. No host URL/timer/DOM dependencies.
  // One observation returns both readiness and complete saved editor evidence.
  function inspect(probe, snapshot, expectedUrl, allowedStates, timeoutMs) {
    const known = new Set(['saved-editor-unavailable', 'name-preservation-evidence-missing',
      'agent-role-ambiguous', 'preference-state-unavailable', 'contact-list-incomplete',
      'primary-state-ambiguous', 'phone-type-unavailable']);
    const probeErrors = {
      'Customer page mismatch; no editor target resolved': 'customer-page-mismatch',
      'Ambiguous contact editor; inspect current state': 'ambiguous-contact-editor',
      'Ambiguous customer Details control': 'ambiguous-customer-details',
      'Ambiguous or disabled Customer Info Edit': 'ambiguous-or-disabled-customer-edit',
      'Customer Info Edit not scoped; inspect collapsed customer card': 'customer-edit-not-scoped',
      'Missing or ambiguous Customer Info Edit': 'ambiguous-customer-edit',
      'Editor target changed; inspect again': 'editor-target-changed',
    };
    function read() {
      try {
        const p = probe(expectedUrl);
        if (!allowedStates.includes(p.state)) return null;
        return p.state === 'editor-open'
          ? {state: p.state, saved: snapshot(probe, expectedUrl, p)} : p;
      } catch (error) {
        if (error.code === 'contact-editor-not-ready') return null;
        return {state: 'blocked', reason: known.has(error.message) ? error.message
          : probeErrors[error.message] || 'saved-contact-read-failed'};
      }
    }
    const current = read();
    if (current) return current;
    // Observe only actual page changes; no sleeps, hidden-heading timeout or polling.
    return new Promise(resolve => {
      let finished = false, timer;
      const finish = result => {
        if (finished) return;
        finished = true; observer.disconnect(); clearTimeout(timer); resolve(result);
      };
      const check = () => {const result = read(); if (result) finish(result);};
      const observer = new MutationObserver(check);
      observer.observe(document.documentElement, {subtree: true, childList: true, attributes: true, characterData: true});
      timer = setTimeout(() => finish({state: 'blocked', reason: 'contact-editor-readiness-timeout'}), timeoutMs);
      check();
    });
  }

  function agent360Reader({tools, guard, probeSource, expectedUrl, pristineTaskWindow} = {}) {
    // functions.exec is a V8 isolate, not Node or a browser: URL is not a host global.
    const match = typeof expectedUrl === 'string'
      && /^https:\/\/opshub\.apps\.opendoor\.com\/customers\/([a-zA-Z0-9_-]+)\/?$/.exec(expectedUrl);
    if (pristineTaskWindow !== true || !match || !probeSource) {
      throw Error('fresh-owned-task-window-required');
    }
    let reads = 0;
    return async ({phase, customerUuid}) => {
      if (phase === 'before' ? reads !== 0 : phase !== 'after' || reads !== 1) throw Error('unexpected-contact-read');
      if (customerUuid !== match[1]) throw Error('contact-read-customer-mismatch');
      reads++;
      // Caller has just opened the exact customer in its own unfocused window.
      // After the single connector save, revisit once for persisted verification.
      if (phase === 'after') guard.read(await tools.mcp__browser_mcp__browser_navigate({url: expectedUrl}));
      const deadline = Date.now() + 10000;
      const read = async (states = ['details-ready', 'edit-ready', 'editor-open']) => {
        const code = `(${inspect.toString()})((${probeSource}),(${snapshot.toString()}),${JSON.stringify(expectedUrl)},${JSON.stringify(states)},${Math.max(0, deadline - Date.now())})`;
        const p = guard.read(await tools.mcp__browser_mcp__browser_execute_script({code})).result;
        if (!p || p.state === 'blocked') {
          const error = Error('saved-contact-read-failed');
          error.cleanupCode = p?.reason || 'saved-contact-read-failed';
          throw error;
        }
        return p;
      };
      let p = await read();
      if (p.state === 'details-ready') {
        const selector = p.selector;
        await guard.step(() => tools.mcp__browser_mcp__browser_click({selector}), async () => {
          p = await read(['edit-ready', 'editor-open']);
          return ['edit-ready', 'editor-open'].includes(p.state);
        });
      }
      if (p.state === 'edit-ready') {
        const selector = p.selector;
        await guard.step(() => tools.mcp__browser_mcp__browser_click({selector}), async () => {
          p = await read(['editor-open']);
          return p.state === 'editor-open';
        });
      } else if (p.state !== 'editor-open') throw Error('saved-editor-unavailable');
      if (!p.saved) throw Error('saved-contacts-incomplete');
      return p.saved;
    };
  }

  function run(options = {}) {
    const {operationId, mode, customerUuid, primaryEmail, callerPhone, identityVerified,
      cleanupAuthorized, accountConflict, detectionComplete, nameCorrectionPending = false,
      nameCorrection, nameCorrectionConfirmed = false,
      priorWriteUncertain = false, planner, readSavedContacts, updateCustomer} = options;
    if (!operationId || typeof operationId !== 'string' || !customerUuid
        || !['repeated-phone', 'consolidate'].includes(mode)) return Promise.resolve(stopped('missing-bound-operation'));
    // Decisions come from the owning skill and retained original request.
    // The helper never infers identity, a keeping contact or permission to edit.
    const hasName = nameCorrection !== undefined;
    const confirmedName = hasName && mode === 'consolidate'
      && planner?.confirmedNameCorrection?.(nameCorrection, nameCorrectionConfirmed) === true;
    if (identityVerified !== true || cleanupAuthorized !== true || accountConflict !== false
        || priorWriteUncertain !== false || (hasName && !confirmedName)
        || (nameCorrectionPending !== false && !(nameCorrectionPending === true && confirmedName))
        || (mode === 'consolidate' && detectionComplete !== true)) {
      return Promise.resolve(stopped('unresolved-identity-authority-detection-or-prior-write'));
    }
    const signature = JSON.stringify([mode, customerUuid, primaryEmail, callerPhone,
      hasName ? [nameCorrection.firstName, nameCorrection.lastName] : null]);
    const previous = attempts.get(operationId);
    if (previous) return previous.signature === signature ? previous.promise : Promise.resolve(stopped('operation-scope-mismatch'));
    if (mode === 'consolidate') {
      const emailFormatReview = planner?.reviewEmailFormat?.(primaryEmail);
      if (emailFormatReview) return Promise.resolve({
        ...stopped('email-format-confirmation-required'), emailFormatReview,
      });
    }
    if (typeof readSavedContacts !== 'function' || typeof updateCustomer !== 'function'
        || typeof planner?.verify !== 'function') return Promise.resolve(stopped('executor-unavailable'));
    const promise = (async () => {
      let attempted = false, plan, receipt, stage = 'before';
      try {
        const before = copy(await readSavedContacts({phase: 'before', customerUuid}));
        if (before.persisted !== true || before.contactsComplete !== true) return stopped('saved-contacts-incomplete');
        const args = {customer: before.customer, customerUuid, primaryEmail, callerPhone,
          identityVerified, cleanupAuthorized, accountConflict, contactsComplete: true,
          nameCorrectionPending, nameCorrection, nameCorrectionConfirmed};
        stage = 'plan';
        plan = mode === 'repeated-phone' ? planner.planRepeatedPhone(args) : planner.plan(args);
        if (!['ready', 'noop'].includes(plan.state)) return {
          ...stopped(plan.reason || 'unsafe-contact-plan'),
          ...(plan.emailFormatReview ? {emailFormatReview: plan.emailFormatReview} : {}),
        };
        if (plan.state === 'noop') {
          return planner.verify(plan, before.customer, true)
            ? {state: 'verified', customerUuid, writeAttempted: false, plan}
            : stopped('noop-verification-failed');
        }
        attempted = true; // Even a lost response might have applied the edit.
        stage = 'update';
        try {receipt = await updateCustomer(copy(plan.request));} catch { /* Inspect only; never retry. */ }
        stage = 'after';
        const after = copy(await readSavedContacts({phase: 'after', customerUuid}));
        if (after.persisted !== true || after.contactsComplete !== true
            || !planner.verify(plan, after.customer, true)
            || JSON.stringify(before.preferences) !== JSON.stringify(after.preferences)) {
          return {...stopped('persisted-contact-verification-failed', true), plan, receipt};
        }
        return {state: 'verified', customerUuid, writeAttempted: true, plan, receipt};
      } catch (error) {
        return {...stopped(attempted ? 'save-outcome-unverified' : 'saved-contact-read-failed', attempted),
          failure: {stage, code: /^[a-z][a-z-]{1,64}$/.test(error?.cleanupCode || '')
            ? error.cleanupCode : 'executor-failed'}, plan, receipt};
      }
    })();
    attempts.set(operationId, {signature, promise});
    return promise;
  }
  return {run, agent360Reader, snapshot};
})()
