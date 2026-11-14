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
  return Object.freeze({build, stage});
})()
