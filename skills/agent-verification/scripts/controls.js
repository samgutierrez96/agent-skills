// Agent 360 ONLY. Code builders for observed UI controls, not a native-browser API.
// No network, credentials, focus changes, automatic retries or business decisions.
(() => {
  function build(actions) {
    if (!Array.isArray(actions) || !actions.length || actions.length > 12) throw Error('Invalid UI batch');
    for (const a of actions) {
      if (!['click', 'fill', 'open'].includes(a.kind) || !a.selector || typeof a.selector !== 'string' ||
          (a.text !== undefined && typeof a.text !== 'string') ||
          (a.kind === 'fill' && typeof a.value !== 'string')) throw Error('Invalid observed control');
    }
    // Selectors are ordinary CSS; exact text is matched separately. This avoids
    // browser-specific pseudo-selectors such as button:text(...).
    return `(() => {
      const allowed = ['opshub.apps.opendoor.com','alfred.ops.opendoor.com','script.google.com'];
      if (!allowed.includes(location.hostname) && !location.hostname.endsWith('.script.googleusercontent.com') && location.hostname !== 'script.googleusercontent.com' && location.hostname !== '127.0.0.1') throw Error('Unexpected workflow host');
      const actions = ${JSON.stringify(actions)};
      const visible = e => !!(e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden';
      const controls = actions.map(a => {
        const roots = a.scope ? [...document.querySelectorAll(a.scope)].filter(visible) : [document];
        if (roots.length !== 1) throw Error('Missing or ambiguous control scope');
        const found = [...roots[0].querySelectorAll(a.selector)].filter(e => visible(e) && (a.text === undefined || e.textContent.trim() === a.text));
        if (found.length !== 1 || found[0].disabled || found[0].getAttribute('aria-disabled') === 'true') throw Error('Missing, ambiguous or disabled control');
        const e = found[0];
        if (a.kind === 'fill' && !['INPUT','TEXTAREA'].includes(e.tagName)) throw Error('Not a text field');
        return e;
      });
      // All controls must be observed before any action. Newly opened dialogs
      // and menus belong in a later batch after their fresh state is inspected.
      actions.forEach((a, i) => {
        const e = controls[i];
        if (!e.isConnected) throw Error('Control became stale');
        if (a.kind === 'fill') {
          const proto = e.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, a.value);
          e.dispatchEvent(new Event('input', {bubbles:true}));
          e.dispatchEvent(new Event('change', {bubbles:true}));
        } else if (a.kind === 'open') e.dispatchEvent(new MouseEvent('mousedown', {bubbles:true,button:0}));
        else e.click();
      });
      return {ok:true, action_count:actions.length};
    })()`;
  }

  async function stage(state, key, guard, action, observe) {
    if (!state || typeof key !== 'string' || !/^[a-z-]{1,60}$/.test(key)) throw Error('Invalid stage key');
    state.attempted ||= [];
    if (state.blocked || state.attempted.includes(key)) throw Error('Stage already attempted or workflow blocked; inspect outcome without replay');
    state.attempted.push(key);
    try {
      const result = await guard.step(action, observe);
      state.completed ||= [];
      state.completed.push(key);
      return result;
    } catch (error) {
      state.blocked = key;
      throw error;
    }
  }

  // Read-only bounded in-page wait. One call replaces a polling loop of many
  // execute_script round trips. It observes only; it clicks nothing, submits
  // nothing and never retries a mutation. A timeout is reported, not inferred
  // as success: callers must check `settled` before acting on the result.
  function waitFor({present = [], absent = [], timeoutMs = 20000, intervalMs = 250} = {}) {
    for (const spec of [...present, ...absent]) {
      if (!spec || typeof spec.selector !== 'string' || !spec.selector ||
          (spec.text !== undefined && typeof spec.text !== 'string') ||
          (spec.scope !== undefined && typeof spec.scope !== 'string')) throw Error('Invalid wait condition');
    }
    if (!present.length && !absent.length) throw Error('A wait needs at least one condition');
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 25000) throw Error('Wait timeout must be 1..25000 ms');
    if (!Number.isFinite(intervalMs) || intervalMs <= 0 || intervalMs > 5000) throw Error('Wait interval must be 1..5000 ms');
    return `(async () => {
      const allowed = ['opshub.apps.opendoor.com','alfred.ops.opendoor.com','script.google.com'];
      if (!allowed.includes(location.hostname) && !location.hostname.endsWith('.script.googleusercontent.com') && location.hostname !== 'script.googleusercontent.com' && location.hostname !== '127.0.0.1') throw Error('Unexpected workflow host');
      const present = ${JSON.stringify(present)};
      const absent = ${JSON.stringify(absent)};
      const timeoutMs = ${timeoutMs};
      const intervalMs = ${intervalMs};
      const visible = e => !!(e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden';
      const count = spec => {
        const roots = spec.scope ? [...document.querySelectorAll(spec.scope)].filter(visible) : [document];
        if (roots.length !== 1) return -1; // Missing or ambiguous scope is not a settled observation.
        return roots[0].querySelectorAll(spec.selector).length
          ? [...roots[0].querySelectorAll(spec.selector)].filter(e => visible(e) && (spec.text === undefined || e.textContent.trim() === spec.text)).length
          : 0;
      };
      const started = Date.now();
      const deadline = started + timeoutMs;
      let presentCounts = [], absentCounts = [], settled = false;
      for (;;) {
        presentCounts = present.map(count);
        absentCounts = absent.map(count);
        settled = presentCounts.every(n => n === 1) && absentCounts.every(n => n === 0);
        if (settled || Date.now() >= deadline) break;
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
      // found mirrors settled so the shared guard's read() rejects a timeout by
      // default; an unsettled wait cannot be mistaken for a satisfied state.
      return {ok:true, found:settled, settled, present_counts:presentCounts, absent_counts:absentCounts, elapsed_ms:Date.now() - started};
    })()`;
  }
  return Object.freeze({build, stage, waitFor});
})()
