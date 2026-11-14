// Read-only, exact-source evidence probe. Do not wrap or edit at invocation time.
(() => {
  if (location.origin !== 'https://alfred.ops.opendoor.com' ||
      !/^\/user-reviews\/[A-Za-z0-9-]+\/?$/.test(location.pathname)) throw Error('Not an Alfred case');
  const root = document.querySelector('main') || document.body;
  const lines = root.innerText.split('\n').map(x => x.trim()).filter(Boolean);
  const boundary = lines.findIndex(x => ['Threat Triggers', 'Activity', 'Narrative'].includes(x));
  const value = label => {
    const indices = lines.flatMap((x, i) => x === label ? [i] : []);
    return indices.length === 1 ? lines[indices[0] + 1] || '' : '';
  };
  return {protocol:'agent-verification-observation-v1', page:'case', url:location.href,
    closed:boundary >= 0 && lines.slice(0, boundary).includes('Case Closed') && !document.querySelector('[role="dialog"]'),
    home_access: lines.includes('Trust level: Allow') ? 'Allow' : lines.includes('Trust level: Deny') ? 'Deny' : value('Trust level'),
    agent_status:value('Verification status'), email:value('Email'), license_number:value('License #'),
    customer_urls:[...new Set([...root.querySelectorAll('a[href]')].map(a => a.href)
      .filter(x => /^https:\/\/opshub\.apps\.opendoor\.com\/customers\/[A-Za-z0-9-]+\/?$/.test(x)))]};
})()
