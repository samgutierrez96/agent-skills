// Read-only, pair-bound Admin observation. No clicks, network, focus or retries.
// Keep the returned pre-submit snapshot; pass it back only after invoking the
// final reviewed merge, on the same page without another candidate selection.
(({keepingAdminId, keepingUuid, duplicateUuid, before = null, submitted = false}) => {
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
  const finalButtons = [...document.querySelectorAll('button[ng-click="customer_merge.merge()"]')].filter(visible);
  const searchReady = [...document.querySelectorAll('input[ng-model="customer_merge.query"]')]
    .some(e => visible(e) && !e.disabled);
  const busy = [...document.querySelectorAll('[aria-busy="true"],.fa-spinner,.glyphicon-refresh.glyphicon-spin,.loading-spinner')]
    .some(visible) || finalButtons.some(e => e.disabled || /merging/i.test(e.innerText)
      || !e.innerText.trim());
  const errors = [...document.querySelectorAll('[role="alert"],.alert-danger,.toast-error')]
    .filter(e => visible(e) && !/Are you really sure\? This cannot be undone\.|Both of these customers have logins/i.test(e.innerText))
    .map(e => e.innerText.trim()).filter(Boolean);
  const success = [...document.querySelectorAll('[role="status"],.toast,.toast-message,.md-toast-content')]
    .some(e => visible(e) && /^Merged customers[.!]?$/i.test(e.innerText.trim()));
  const snapshot = {keepingAdminId: route, keepingUuid: keeping ? uuid(keeping.innerText) : null,
    duplicateUuid: removing ? uuid(removing.innerText) : null,
    removingPresent: Boolean(removing), confirmationPresent: finalButtons.length > 0,
    successVisible: success, ready: Boolean(keeping && searchReady && !busy && !errors.length && finalButtons.length <= 1)};
  const result = (state, evidence = null) => ({state, evidence, snapshot, errors,
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
  return result(snapshot.duplicateUuid === duplicateUuid && snapshot.confirmationPresent
    ? 'confirmation-ready' : 'unverified');
})
