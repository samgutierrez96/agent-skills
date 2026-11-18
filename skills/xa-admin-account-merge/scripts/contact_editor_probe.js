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
  const inputs = [...document.querySelectorAll('input[name^="emails."], input[name^="phones."]')].filter(visible);
  if (inputs.length) {
    const forms = new Set(inputs.map(e => e.closest('form') || e.parentElement));
    if (forms.size !== 1) throw Error('Ambiguous contact editor; inspect current state');
    return {state: 'editor-open', input_count: inputs.length};
  }
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,span,[role="heading"]')]
    .filter(e => visible(e) && e.textContent.trim() === 'Customer Info')
    .filter(e => ![...e.children].some(child => child.textContent.trim() === 'Customer Info'));
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
  if (targets.size !== 1) throw Error('Missing or ambiguous Customer Info Edit');
  const target = [...targets][0];
  // Plain structural CSS avoids style-token coupling and tool text-selector dialects.
  const parts = [];
  for (let node = target; node && node !== document.documentElement; node = node.parentElement) {
    const tag = node.localName;
    const peers = [...node.parentElement.children].filter(e => e.localName === tag);
    parts.unshift(`${tag}:nth-of-type(${peers.indexOf(node) + 1})`);
  }
  const selector = `html > ${parts.join(' > ')}`;
  const matches = document.querySelectorAll(selector);
  if (matches.length !== 1 || matches[0] !== target) throw Error('Editor target changed; inspect again');
  return {state: 'edit-ready', selector};
})
