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
  function plan({customer, customerUuid, primaryEmail, callerPhone, identityVerified,
                 cleanupAuthorized, contactsComplete, nameCorrectionPending = false} = {}) {
    if (nameCorrectionPending !== false) return blocked('pending-name-correction');
    if (identityVerified !== true || cleanupAuthorized !== true || contactsComplete !== true) {
      return blocked('unresolved-identity-authority-or-completeness');
    }
    if (!customerUuid || customer?.uuid !== customerUuid) return blocked('customer-mismatch');
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
    if (emailDiffs.length) params.emails = emailDiffs;
    if (phoneDiffs.length) params.phones = phoneDiffs;
    const expected = {
      uuid: customerUuid, firstName: customer.firstName, lastName: customer.lastName,
      isAgent: customer.isAgent, email: keepEmail.address, phone: keepPhone.number, phoneType: keepPhone.type,
    };
    return Object.keys(params).length ? {
      state: 'ready', expected,
      request: {operation_name: 'UpdateCustomer', variables: {input: {uuid: customerUuid, params}}},
    } : {state: 'noop', expected};
  }
  function verify(result, customer, contactsComplete) {
    if (!['ready', 'noop'].includes(result?.state) || contactsComplete !== true) return false;
    let contacts;
    try {contacts = read(customer);} catch {return false;}
    const e = result.expected;
    return customer.uuid === e.uuid && customer.firstName === e.firstName
      && customer.lastName === e.lastName && customer.isAgent === e.isAgent
      && contacts.emails.length === 1 && contacts.emails[0].primary
      && emailKey(contacts.emails[0].address) === emailKey(e.email)
      && contacts.phones.length === 1 && contacts.phones[0].primary
      && phoneKey(contacts.phones[0].number) === phoneKey(e.phone)
      && contacts.phones[0].type === e.phoneType;
  }
  return {plan, verify};
})()
