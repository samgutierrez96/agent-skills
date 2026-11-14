// Read-only identity/status probe; this is not a terminal completion signal.
(() => {
  if (location.origin !== 'https://opshub.apps.opendoor.com' ||
      !/^\/customers\/[A-Za-z0-9-]+\/?$/.test(location.pathname)) throw Error('Not an OpsHub customer');
  const root = document.querySelector('main') || document.body;
  const text = root.innerText;
  const start = text.lastIndexOf('Customer Info');
  if (start < 0) throw Error('Customer Info is not ready');
  const lines = text.slice(start).split('\n').map(x => x.trim()).filter(Boolean);
  const value = label => {
    const indices = lines.flatMap((x, i) => x === label ? [i] : []);
    return indices.length === 1 ? lines[indices[0] + 1] || '' : '';
  };
  return {protocol:'agent-verification-observation-v1', page:'customer', url:location.href,
    email:value('Email'), phone:value('Phone'), license_number:value('License #'),
    home_access:value('Trust level'), agent_status:value('Verification')};
})()
