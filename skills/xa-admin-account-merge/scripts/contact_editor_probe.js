// Read-only DOM probe. No clicks, writes, focus changes, network or customer selection.
// Evaluate on the already-verified customer page, passing its retained exact URL.
((expectedUrl) => {
  const expected = new URL(expectedUrl);
  if (expected.origin !== 'https://opshub.apps.opendoor.com'
      || !/^\/customers\/[^/]+\/?$/.test(expected.pathname)
      || location.origin !== expected.origin || location.pathname !== expected.pathname) {
    throw Error('Customer page mismatch; no editor target resolved');
  }
  const visible = e => e.getClientRects().length > 0
    && getComputedStyle(e).visibility !== 'hidden';
  const enabled = e => !e.disabled && e.getAttribute('aria-disabled') !== 'true';
  const selectorFor = target => {
    const parts = [];
    for (let node = target; node && node !== document.documentElement; node = node.parentElement) {
      const peers = [...node.parentElement.children].filter(e => e.localName === node.localName);
      parts.unshift(`${node.localName}:nth-of-type(${peers.indexOf(node) + 1})`);
    }
    const selector = `html > ${parts.join(' > ')}`;
    const matches = document.querySelectorAll(selector);
    if (matches.length !== 1 || matches[0] !== target) throw Error('Editor target changed; inspect again');
    return selector;
  };
  const inputs = [...document.querySelectorAll('input[name^="emails."], input[name^="phones."]')].filter(visible);
  if (inputs.length) {
    const forms = new Set(inputs.map(e => e.form));
    if (forms.size !== 1 || forms.has(null)) throw Error('Ambiguous contact editor; inspect current state');
    const form = [...forms][0];
    const elements = [...form.elements].filter(visible);
    const submits = elements.filter(e => ['BUTTON', 'INPUT'].includes(e.tagName)
      && e.type === 'submit' && /^(Save|Save changes|Saving(?:\.\.\.|…)?)$/.test((e.innerText || e.value || '').trim()));
    const fields = elements.filter(e => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.tagName) && e.name)
      .map(e => ({
        name: e.name,
        value: e.value,
        selector: selectorFor(e),
        checked: ['checkbox', 'radio'].includes(e.type) ? e.checked : undefined,
        required: Boolean(e.required || e.getAttribute('aria-required') === 'true'),
        invalid: e.getAttribute('aria-invalid') === 'true' || e.validity?.valid === false,
        message: e.validationMessage || '',
        described_errors: (e.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)
          .map(id => document.getElementById(id)).filter(e => e && visible(e) && form.contains(e))
          .map(e => e.innerText.trim()).filter(Boolean),
      }));
    const controls = elements.filter(e => e.tagName === 'BUTTON'
      && (['Remove email', 'Remove phone'].includes(e.title) || e.hasAttribute('aria-pressed')))
      .map(e => ({selector: selectorFor(e), title: e.title, text: e.innerText.trim(),
        pressed: e.getAttribute('aria-pressed'), enabled: enabled(e)}));
    const emptyNames = elements.filter(e => ['firstName', 'lastName'].includes(e.name) && !e.value.trim())
      .map(e => e.name);
    const errors = [...form.querySelectorAll('[role="alert"],[data-slot="form-message"],p[id$="-error"],p[class*="text-red"]')]
      .filter(visible).map(e => e.innerText.trim()).filter(Boolean);
    return {state: 'editor-open', input_count: inputs.length, editor: {
      form_selector: selectorFor(form),
      save: submits.length === 1 ? {state: /Saving(?:\.\.\.|…)?/i.test(submits[0].innerText || submits[0].value || '')
          || submits[0].getAttribute('aria-busy') === 'true' ? 'saving'
          : enabled(submits[0]) && !submits[0].matches(':disabled') ? 'ready' : 'disabled',
        selector: selectorFor(submits[0])} : {state: submits.length ? 'ambiguous' : 'missing'},
      empty_name_fields: emptyNames, fields, controls, errors: [...new Set(errors)],
    }};
  }
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,span,[role="heading"]')]
    .filter(e => visible(e) && e.textContent.trim() === 'Customer Info')
    .filter(e => ![...e.children].some(child => child.textContent.trim() === 'Customer Info'));
  // Details and the editor replace the heading in different settled layouts.
  // Resolve from current state instead of waiting for that heading unconditionally.
  if (!headings.length) {
    const details = [...document.querySelectorAll('button')]
      .filter(e => visible(e) && e.textContent.trim() === 'Details');
    if (details.length > 1) throw Error('Ambiguous customer Details control');
    if (details.length === 1 && enabled(details[0])) {
      return {state: 'details-ready', selector: selectorFor(details[0])};
    }
  }
  const targets = new Set();
  for (const heading of headings) {
    for (let card = heading.parentElement; card && card !== document.body; card = card.parentElement) {
      if ([...card.querySelectorAll('h1,h2,h3,h4,h5,h6,span,[role="heading"]')]
          .some(e => visible(e) && e.textContent.trim() === 'Agent Info')) {
        throw Error('Customer Info Edit not scoped; inspect collapsed customer card');
      }
      const edits = [...card.querySelectorAll('button')]
        .filter(e => visible(e) && e.textContent.trim() === 'Edit');
      if (!edits.length) continue;
      if (edits.length !== 1 || !enabled(edits[0])) throw Error('Ambiguous or disabled Customer Info Edit');
      targets.add(edits[0]);
      break;
    }
  }
  if (!targets.size) {
    const error = Error('Missing Customer Info Edit');
    error.code = 'contact-editor-not-ready';
    throw error;
  }
  if (targets.size !== 1) throw Error('Missing or ambiguous Customer Info Edit');
  const target = [...targets][0];
  const selector = selectorFor(target);
  return {state: 'edit-ready', selector};
})
