// Read-only, pair-bound Admin observation. No clicks, network, focus or retries.
// Keep the returned pre-submit snapshot; pass it back only after invoking the
// final reviewed merge, on the same page without another candidate selection.
(({keepingAdminId, keepingUuid, duplicateUuid, before = null, submitted = false, includeIdentity = false}) => {
  const visible = e => e.getClientRects().length > 0
    && getComputedStyle(e).visibility !== 'hidden';
  const uuid = text => text.match(/UUID:\s*([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i)?.[1] || null;
  const route = location.pathname.match(/^\/admin\/customers\/(\d+)\/merge\/?$/)?.[1];
  if (location.origin !== 'https://admin.opendoor.com' || route !== String(keepingAdminId)
      || !keepingUuid || !duplicateUuid || keepingUuid === duplicateUuid) {
    throw Error('Merge target/route mismatch; no completion established');
  }
  const card = label => {
    const headings = [...document.querySelectorAll('div,span,h1,h2,h3,h4,h5,h6')]
      .filter(e => visible(e) && e.textContent.trim().replace(/^[✔✓←]\s*/, '') === label)
      .filter(e => ![...e.children].some(c => c.textContent.trim().includes(label)));
    if (headings.length > 1) throw Error('Ambiguous merge panel');
    if (!headings.length) return null;
    for (let e = headings[0].parentElement; e && e !== document.body; e = e.parentElement) {
      if (e.querySelector('input') && uuid(e.innerText)) return e;
    }
    throw Error('Incomplete merge panel');
  };
  const keeping = card('Keeping this customer');
  const removing = card('Removing/merging this customer');
  const warningButtons = [...document.querySelectorAll('button[ng-click="customer_merge.warned = true"]')].filter(visible);
  const finalButtons = [...document.querySelectorAll('button[ng-click="customer_merge.merge()"]')].filter(visible);
  const searchReady = [...document.querySelectorAll('input[ng-model="customer_merge.query"]')]
    .some(e => visible(e) && !e.disabled);
  const busy = [...document.querySelectorAll('[aria-busy="true"],.fa-spinner,.glyphicon-refresh.glyphicon-spin,.loading-spinner')]
    .some(visible) || finalButtons.some(e => e.disabled || /merging/i.test(e.innerText)
      || !e.innerText.trim());
  const normalNotice = text => /^This qualification data will be (?:deleted|kept)[.!]?$/.test(text)
    || /^Are you really sure\? This cannot be undone\.(?:\s*I'm sure\. Merge them\.)?$/.test(text)
    || /^Both of these customers have logins \(humans\)\./.test(text);
  const alerts = [...document.querySelectorAll('[role="alert"],.alert-danger,.toast-error')].filter(visible);
  // Embedded agent-form validation is not a merge submission response. Retain
  // it as evidence; never suppress page/toast errors or a new post-submit error.
  const profileWarnings = [];
  const profileWarning = element => {
    if (element.closest('.toast-error,.toast,.toast-message,.md-toast-content')) return false;
    const text = element.innerText.trim()
      .replace(/^"([^"]+)"$/, '$1').replace(/^“([^”]+)”$/, '$1');
    if (text !== 'Could not find an MLS agent with that MLS ID.') return false;
    const panel = [keeping, removing].find(value => value?.contains(element));
    if (!panel) return false;
    const warning = {customerUuid: uuid(panel.innerText), message: text};
    if (submitted && !before?.profileWarnings?.some(value =>
      value.customerUuid === warning.customerUuid && value.message === warning.message)) return false;
    if (!profileWarnings.some(value => value.customerUuid === warning.customerUuid
      && value.message === warning.message)) profileWarnings.push(warning);
    return true;
  };
  const errors = alerts
    .filter(e => e.matches('.toast-error') || !normalNotice(e.innerText.trim()))
    .filter(e => !profileWarning(e))
    .map(e => e.innerText.trim()).filter(Boolean);
  const success = [...document.querySelectorAll('[role="status"],.toast,.toast-message,.md-toast-content')]
    .some(e => visible(e) && /^Merged customers[.!]?$/i.test(e.innerText.trim()));
  const snapshot = {keepingAdminId: route, keepingUuid: keeping ? uuid(keeping.innerText) : null,
    duplicateUuid: removing ? uuid(removing.innerText) : null,
    removingPresent: Boolean(removing), confirmationPresent: finalButtons.length > 0,
    successVisible: success, ready: Boolean(keeping && searchReady && !busy && !errors.length
      && finalButtons.length <= 1 && warningButtons.length <= 1)};
  const selector = element => {
    if (!element || element.disabled) return null;
    const parts = [];
    for (let e = element; e && e.nodeType === 1; e = e.parentElement) {
      parts.unshift(e.tagName.toLowerCase() + (e.parentElement
        ? ':nth-child(' + ([...e.parentElement.children].indexOf(e) + 1) + ')' : ''));
    }
    return parts.join(' > ');
  };
  const controls = {
    warning: warningButtons.length === 1 ? selector(warningButtons[0]) : null,
    submit: finalButtons.length === 1 ? selector(finalButtons[0]) : null,
  };
  const identity = panel => panel && ({uuid: uuid(panel.innerText),
    values: [...panel.querySelectorAll('input')].filter(e => visible(e)
      && !['checkbox', 'radio', 'hidden', 'submit', 'button'].includes(e.type)).map(e => e.value)});
  const result = (state, evidence = null) => ({state, evidence, snapshot, errors, profileWarnings, controls,
    ...(includeIdentity ? {identities: {keeping: identity(keeping), removing: identity(removing)},
      warningText: finalButtons.length ? [...new Set([
        finalButtons[0].closest('.alert-danger,.alert,[role="alert"]')?.innerText.trim() || '',
        ...alerts.filter(e => !e.matches('.toast-error') && normalNotice(e.innerText.trim()))
          .map(e => e.innerText.trim()),
      ].filter(Boolean))].join('\n') : ''} : {}),
    // A probe never authorizes a merge, including on an ambiguous submitted run.
    retryMerge: false});
  if (snapshot.keepingUuid !== keepingUuid || busy || errors.length || !snapshot.ready) {
    return result('unverified');
  }
  const bound = submitted === true && before?.state === 'confirmation-ready'
    && before.snapshot?.keepingAdminId === route && before.snapshot.keepingUuid === keepingUuid
    && before.snapshot.duplicateUuid === duplicateUuid && before.snapshot.removingPresent === true
    && before.snapshot.confirmationPresent === true && before.snapshot.ready === true;
  if (bound && success && before.snapshot.successVisible === false
      && (!snapshot.removingPresent || snapshot.duplicateUuid === duplicateUuid)) {
    return result('verified', 'merge-success-toast');
  }
  if (bound && !snapshot.removingPresent && !snapshot.confirmationPresent) {
    return result('verified', 'submitted-pair-panel-cleared');
  }
  if (submitted) return result('unverified');
  return result(snapshot.duplicateUuid === duplicateUuid
    ? snapshot.confirmationPresent ? 'confirmation-ready'
      : controls.warning ? 'selection-ready' : 'unverified'
    : 'unverified');
})
