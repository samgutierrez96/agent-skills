// Pure contact-only UpdateCustomer planner and persisted-read verifier.
// No tools, network, DOM, writes or authorization decisions. Gates belong to SKILL.md.
(() => {
  const phoneTypes = new Set(['HOME', 'MOBILE', 'OTHER', 'WORK']);
  const emailKey = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
  const phoneKey = value => {
    if (typeof value !== 'string') return '';
    const digits = value.replace(/\D/g, '');
    return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  };
  const blocked = reason => ({state: 'blocked', reason});
  // Conservative preflight for obvious formatting faults, not mailbox identity,
  // deliverability, or a replacement for OpsHub's complete schema validation.
  function reviewEmailFormat(value) {
    if (typeof value !== 'string' || !value) return null;
    const reasons = [];
    if (/\s/.test(value)) reasons.push('whitespace');
    const parts = value.replace(/\s/g, '').split('@');
    if (parts.length !== 2 || parts.some(part => !part)) reasons.push('missing-or-multiple-at-sign');
    else {
      if (/^\.|\.$|\.\./.test(parts[0])) reasons.push('local-dot-placement');
      if (/^\.|\.$|\.\./.test(parts[1]) || !parts[1].includes('.')) reasons.push('domain-dot-placement');
    }
    if (!reasons.length) return null;
    let suggestedEmail = null;
    if (parts.length === 2) {
      const local = parts[0].replace(/^\.+|\.+$/g, '').replace(/\.{2,}/g, '.');
      const domain = parts[1];
      // Offer only punctuation/space cleanup of supplied characters. Never
      // invent a domain, remove legitimate interior dots/+tags or select it.
      if (/^[A-Z0-9_+.!#$%&'*\/=?^{}|~-]+$/i.test(local)
          && !/^\.|\.$|\.\./.test(local)
          && /^(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,63}$/i.test(domain)) {
        const candidate = local + '@' + domain;
        if (candidate !== value && candidate.length <= 254) suggestedEmail = candidate;
      }
    }
    return {originalEmail: value, reasons, suggestedEmail};
  }
  function read(customer) {
    if (!customer || typeof customer.uuid !== 'string'
        || typeof customer.firstName !== 'string' || typeof customer.lastName !== 'string'
        || typeof customer.isAgent !== 'boolean'
        || !Array.isArray(customer.otherEmails) || !Array.isArray(customer.otherPhoneNumbers)
        || [...customer.otherEmails, ...customer.otherPhoneNumbers].some(e => !e)
        || !Object.hasOwn(customer, 'primaryEmail') || !Object.hasOwn(customer, 'primaryPhoneNumber')) {
      throw Error('incomplete-contact-snapshot');
    }
    const emails = [customer.primaryEmail, ...customer.otherEmails].filter(Boolean).map(e => {
      if (typeof e.address?.value !== 'string' || !emailKey(e.address.value)) throw Error('incomplete-email');
      return {address: e.address.value, primary: e === customer.primaryEmail};
    });
    const phones = [customer.primaryPhoneNumber, ...customer.otherPhoneNumbers].filter(Boolean).map(p => {
      if (typeof p.number?.value !== 'string' || !phoneKey(p.number.value)
          || !phoneTypes.has(p.type)) throw Error('incomplete-phone-type-or-number');
      return {number: p.number.value, type: p.type, primary: p === customer.primaryPhoneNumber};
    });
    return {emails, phones};
  }
  const confirmedNameCorrection = (name, confirmed) => confirmed === true && name !== null
    && typeof name === 'object' && !Array.isArray(name) && Object.keys(name).length === 2
    && ['firstName', 'lastName'].every(key => Object.hasOwn(name, key)
      && typeof name[key] === 'string' && name[key].trim().length > 0);
  function plan({customer, customerUuid, primaryEmail, callerPhone, identityVerified,
                 cleanupAuthorized, contactsComplete, nameCorrectionPending = false,
                 nameCorrection, nameCorrectionConfirmed = false} = {}) {
    const hasName = nameCorrection !== undefined;
    if (hasName && !confirmedNameCorrection(nameCorrection, nameCorrectionConfirmed)) {
      return blocked('unconfirmed-or-incomplete-name-correction');
    }
    if (nameCorrectionPending !== false && !(nameCorrectionPending === true && hasName)) {
      return blocked('pending-name-correction');
    }
    if (identityVerified !== true || cleanupAuthorized !== true || contactsComplete !== true) {
      return blocked('unresolved-identity-authority-or-completeness');
    }
    if (!customerUuid || customer?.uuid !== customerUuid) return blocked('customer-mismatch');
    const emailFormatReview = reviewEmailFormat(primaryEmail);
    if (emailFormatReview) return {...blocked('email-format-confirmation-required'), emailFormatReview};
    const wantedEmail = emailKey(primaryEmail);
    const wantedPhone = phoneKey(callerPhone);
    if (!wantedEmail || wantedPhone.length !== 10) return blocked('missing-confirmed-email-or-caller-phone');
    let contacts;
    try {contacts = read(customer);} catch (error) {return blocked(error.message);}
    const {emails, phones} = contacts;
    const matchingEmails = emails.filter(e => emailKey(e.address) === wantedEmail);
    const matchingPhones = phones.filter(p => phoneKey(p.number) === wantedPhone);
    // Do not fabricate missing contacts or choose an unconfirmed phone type.
    if (matchingEmails.length !== 1) return blocked('missing-or-ambiguous-keeping-email');
    const keepEmail = matchingEmails[0];
    const keepPhone = matchingPhones.find(p => p.primary)
      || (matchingPhones.length === 1 ? matchingPhones[0] : null);
    if (!keepPhone) return blocked('missing-or-ambiguous-keeping-phone');
    // Old Phone identifies number + type, not a row index. An indistinguishable
    // duplicate cannot be safely removed without risking the retained primary.
    const phoneTuple = p => phoneKey(p.number) + ':' + p.type;
    if (new Set(phones.map(phoneTuple)).size !== phones.length) return blocked('ambiguous-phone-tuple');
    if (new Set(emails.map(e => emailKey(e.address))).size !== emails.length) return blocked('ambiguous-email-address');
    const emailDiffs = emails.filter(e => e !== keepEmail).map(e => ({old: {address: e.address}}));
    if (!keepEmail.primary) emailDiffs.push({
      old: {address: keepEmail.address}, new: {address: keepEmail.address, makePrimary: true},
    });
    const phoneDiffs = phones.filter(p => p !== keepPhone).map(p => ({
      old: {number: p.number, type: p.type},
    }));
    if (!keepPhone.primary) phoneDiffs.push({
      old: {number: keepPhone.number, type: keepPhone.type},
      new: {number: keepPhone.number, type: keepPhone.type, makePrimary: true},
    });
    const params = {};
    if (hasName && (nameCorrection.firstName !== customer.firstName || nameCorrection.lastName !== customer.lastName)) {
      params.firstName = nameCorrection.firstName;
      params.lastName = nameCorrection.lastName;
    }
    if (emailDiffs.length) params.emails = emailDiffs;
    if (phoneDiffs.length) params.phones = phoneDiffs;
    const expected = {
      uuid: customerUuid, firstName: hasName ? nameCorrection.firstName : customer.firstName,
      lastName: hasName ? nameCorrection.lastName : customer.lastName,
      isAgent: customer.isAgent, email: keepEmail.address, phone: keepPhone.number, phoneType: keepPhone.type,
    };
    return Object.keys(params).length ? {
      state: 'ready', expected,
      request: {operation_name: 'UpdateCustomer', variables: {input: {uuid: customerUuid, params}}},
    } : {state: 'noop', expected};
  }
  const contactSignature = contacts => JSON.stringify({
    emails: contacts.emails.map(e => [emailKey(e.address), e.primary]).sort(),
    phones: contacts.phones.map(p => [phoneKey(p.number), p.type, p.primary]).sort(),
  });
  function planRepeatedPhone({customer, customerUuid, callerPhone, identityVerified,
                             cleanupAuthorized, contactsComplete, accountConflict,
                             nameCorrectionPending = false, nameCorrection} = {}) {
    if (nameCorrectionPending !== false || nameCorrection !== undefined) return blocked('pending-name-correction');
    if (identityVerified !== true || cleanupAuthorized !== true || contactsComplete !== true
        || accountConflict !== false) return blocked('unresolved-identity-authority-completeness-or-account-conflict');
    if (!customerUuid || customer?.uuid !== customerUuid) return blocked('customer-mismatch');
    const wantedPhone = phoneKey(callerPhone);
    if (wantedPhone.length !== 10) return blocked('missing-verified-caller-phone');
    let contacts;
    try {contacts = read(customer);} catch (error) {return blocked(error.message);}
    const keep = contacts.phones.find(p => p.primary && phoneKey(p.number) === wantedPhone);
    if (!keep) return blocked('caller-number-is-not-the-saved-primary');
    const redundant = contacts.phones.filter(p => !p.primary && phoneKey(p.number) === wantedPhone);
    const tuples = contacts.phones.map(p => phoneKey(p.number) + ':' + p.type);
    if (new Set(tuples).size !== tuples.length) return blocked('ambiguous-phone-tuple');
    const expected = {mode: 'repeated-phone', uuid: customerUuid,
      firstName: customer.firstName, lastName: customer.lastName, isAgent: customer.isAgent,
      contacts: contactSignature({...contacts, phones: contacts.phones.filter(p => !redundant.includes(p))})};
    if (!redundant.length) return {state: 'noop', expected};
    return {state: 'ready', expected, request: {operation_name: 'UpdateCustomer', variables: {input: {
      uuid: customerUuid, params: {phones: redundant.map(p => ({old: {number: p.number, type: p.type}}))},
    }}}};
  }
  function verify(result, customer, contactsComplete) {
    if (!['ready', 'noop'].includes(result?.state) || contactsComplete !== true) return false;
    let contacts;
    try {contacts = read(customer);} catch {return false;}
    const e = result.expected;
    if (e.mode === 'repeated-phone') return customer.uuid === e.uuid
      && customer.firstName === e.firstName && customer.lastName === e.lastName
      && customer.isAgent === e.isAgent && contactSignature(contacts) === e.contacts;
    return customer.uuid === e.uuid && customer.firstName === e.firstName
      && customer.lastName === e.lastName && customer.isAgent === e.isAgent
      && contacts.emails.length === 1 && contacts.emails[0].primary
      && emailKey(contacts.emails[0].address) === emailKey(e.email)
      && contacts.phones.length === 1 && contacts.phones[0].primary
      && phoneKey(contacts.phones[0].number) === phoneKey(e.phone)
      && contacts.phones[0].type === e.phoneType;
  }
  return {plan, planRepeatedPhone, verify, confirmedNameCorrection, reviewEmailFormat};
})()
