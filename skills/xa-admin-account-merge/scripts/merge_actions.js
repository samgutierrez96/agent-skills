// Staged Admin UI execution. Never selects people, authorizes a merge or retries a write.
(() => {
  const copy = value => JSON.parse(JSON.stringify(value));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const pairKeys = ['keepingAdminId', 'keepingUuid', 'duplicateUuid'];
  const pairMatches = (pair, p) => pairKeys.every(key => String(p?.snapshot?.[key]) === String(pair?.[key]));
  const identityMatches = (a, b) => a?.identities?.keeping && a?.identities?.removing
    && same(a.identities, b?.identities);
  const blocked = reason => ({state: 'blocked', reason, writeAttempted: false});

  // One read-only browser call waits for actual DOM changes, returning immediately when ready.
  function observe(probe, options, states, timeoutMs) {
    const read = () => {
      const p = probe(options);
      const s = p.snapshot;
      if (p.errors?.length || (s.keepingUuid && s.keepingUuid !== options.keepingUuid)
          || (s.duplicateUuid && s.duplicateUuid !== options.duplicateUuid)) return p;
      return states.includes(p.state) ? p : null;
    };
    const current = read();
    if (current || timeoutMs === 0) return current || probe(options);
    return new Promise((resolve, reject) => {
      let done = false, timer;
      const finish = (value, error) => {
        if (done) return;
        done = true; observer.disconnect(); clearTimeout(timer);
        error ? reject(error) : resolve(value);
      };
      const check = () => {
        try { const value = read(); if (value) finish(value); }
        catch (error) { finish(null, error); }
      };
      const observer = new MutationObserver(check);
      observer.observe(document.documentElement,
        {subtree: true, childList: true, attributes: true, characterData: true});
      timer = setTimeout(() => {
        try { finish(probe(options)); } catch (error) { finish(null, error); }
      }, timeoutMs);
      check();
    });
  }

  function agent360({tools, guard, probeSource, timeoutMs = 10000} = {}) {
    if (!tools || !guard || !probeSource || !Number.isFinite(timeoutMs)
        || timeoutMs < 0 || timeoutMs > 10000) throw Error('invalid-merge-adapter');
    return {
      async read({waitFor = ['selection-ready', 'confirmation-ready'], ...options}) {
        const code = '(' + observe.toString() + ')((' + probeSource + '),'
          + JSON.stringify(options) + ',' + JSON.stringify(waitFor) + ',' + timeoutMs + ')';
        return guard.read(await tools.mcp__browser_mcp__browser_execute_script({code})).result;
      },
      async click(selector) {
        return guard.read(await tools.mcp__browser_mcp__browser_click({selector}));
      },
    };
  }

  const authorized = o => o?.identityVerified === true && o?.mergeAuthorized === true
    && typeof o.operationId === 'string' && o.operationId
    && o.pair?.keepingUuid && o.pair?.duplicateUuid
    && o.pair.keepingUuid !== o.pair.duplicateUuid && /^\d+$/.test(String(o.pair.keepingAdminId));

  async function review(options = {}) {
    const {operationId, pair, selected, io} = options;
    if (!authorized(options)) return blocked('retained-identity-and-authority-required');
    if (!pairMatches(pair, selected) || !selected?.snapshot?.ready
        || !identityMatches(selected, selected)
        || !['selection-ready', 'confirmation-ready'].includes(selected.state)) {
      return blocked('inspected-qualified-pair-required');
    }
    try {
      let p = await io.read({...pair, includeIdentity: true});
      if (!pairMatches(pair, p) || !identityMatches(selected, p) || !p.snapshot.ready) {
        return blocked('selected-pair-changed');
      }
      if (p.state === 'selection-ready' && p.controls?.warning) {
        try { await io.click(p.controls.warning); } catch { /* Observe; never click again. */ }
        p = await io.read({...pair, includeIdentity: true, waitFor: ['confirmation-ready']});
      }
      if (p.state !== 'confirmation-ready' || !pairMatches(pair, p)
          || !identityMatches(selected, p) || !p.controls?.submit || !p.warningText) {
        return blocked('final-warning-not-established');
      }
      // Return for the agent's warning review; no final submission occurs in this phase.
      return {state: 'confirmation-ready', operationId, pair: copy(pair), before: p, writeAttempted: false};
    } catch { return blocked('merge-warning-read-failed'); }
  }

  async function submit(options = {}) {
    const {operationId, pair, reviewed, io, journal, checkpoint} = options;
    if (!authorized(options) || options.warningReviewed !== true) {
      return blocked('reviewed-warning-and-original-authority-required');
    }
    if (!Array.isArray(journal) || typeof checkpoint !== 'function') return blocked('retained-journal-required');
    if (reviewed?.operationId !== operationId || !same(pair, reviewed.pair)
        || reviewed.state !== 'confirmation-ready' || !pairMatches(pair, reviewed.before)
        || !reviewed.before?.snapshot?.ready || !reviewed.before.warningText) {
      return blocked('bound-warning-review-required');
    }
    const existing = journal.find(e => e.operationId === operationId || same(e.pair, pair));
    if (existing && (existing.operationId !== operationId || !same(existing.pair, pair))) {
      return blocked('operation-or-pair-already-bound');
    }
    if (existing?.state === 'verified') return copy(existing.outcome);
    let entry = existing;
    if (!entry) {
      let current;
      try { current = await io.read({...pair, includeIdentity: true, waitFor: ['confirmation-ready']}); }
      catch { return blocked('pre-submit-read-failed'); }
      if (current?.state !== 'confirmation-ready' || !pairMatches(pair, current)
          || !current.snapshot.ready || !identityMatches(reviewed.before, current)
          || current.warningText !== reviewed.before.warningText || !current.controls?.submit) {
        return blocked('reviewed-target-or-warning-changed');
      }
      // Another invocation may have reserved the same pair while this read was in flight.
      if (journal.some(e => e.operationId === operationId || same(e.pair, pair))) return submit(options);
      entry = {operationId, pair: copy(pair), state: 'submitted', before: copy(current)};
      journal.push(entry);
      // Save intent BEFORE calling the tool. Interrupted/lost replies can only be reconciled.
      try { await checkpoint(journal); } catch { return blocked('submission-checkpoint-failed'); }
      try { await io.click(current.controls.submit); } catch { /* Read outcome; never replay. */ }
    }
    let result;
    try { result = await io.read({...pair, before: entry.before, submitted: true, waitFor: ['verified']}); }
    catch { /* Receipt remains uncertain, never a reason for another click. */ }
    const verified = result?.state === 'verified'
      && result.snapshot?.keepingUuid === pair.keepingUuid;
    const outcome = {state: verified ? 'verified' : 'unconfirmed', writeAttempted: true,
      operationId, pair: copy(pair), ...(verified ? {evidence: result.evidence}
        : {reason: result?.errors?.length ? 'admin-reported-error' : 'submitted-result-unverified'})};
    entry.state = outcome.state; entry.outcome = outcome;
    try { await checkpoint(journal); }
    catch { return {...outcome, state: 'unconfirmed', reason: 'receipt-checkpoint-failed'}; }
    return copy(outcome);
  }
  return Object.freeze({agent360, review, submit});
})()
