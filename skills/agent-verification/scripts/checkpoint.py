"""Owner-side readback evidence, not assistant claims or click acknowledgements.

No I/O: Router supplies reconciled probe sources and persists returned metadata.
Unknown UI shapes or an unbound Alfred identity cannot produce completion.
"""
import hashlib
import json
import re
from urllib.parse import urlsplit


def url(value, host, pattern):
    if not isinstance(value, str) or len(value) > 500:
        return None
    parsed = urlsplit(value)
    if parsed.scheme != 'https' or parsed.netloc != host or parsed.query or parsed.fragment:
        return None
    return value.rstrip('/') if re.fullmatch(pattern, parsed.path) else None


def payload(result):
    if not isinstance(result, dict) or result.get('isError'):
        return None
    blocks = result.get('content')
    if not isinstance(blocks, list) or len(blocks) != 1 or blocks[0].get('type') != 'text':
        return None
    try:
        data = json.loads(blocks[0]['text'])
    except (ValueError, KeyError, TypeError):
        return None
    if (not isinstance(data, dict) or any(data.get(k) for k in ('error', 'maybe_landed'))
            or any(data.get(k) is False for k in ('ok', 'found', 'landed'))):
        return None
    value = data.get('result')
    if not isinstance(value, dict) or value.get('protocol') != 'agent-verification-observation-v1':
        return None
    if any(not isinstance(value.get(key), str) for key in
           ('url', 'page', 'email', 'license_number', 'home_access', 'agent_status')):
        return None
    if value['page'] == 'case' and (not isinstance(value.get('closed'), bool)
                                  or not isinstance(value.get('customer_urls'), list)):
        return None
    return value


class Observer:
    def __init__(self, sources, context):
        self.probes = {sources[name]:page for name, page in (
            ('read_customer.js', 'customer'), ('read_case.js', 'case'), ('final_customer.js', 'final-customer'))}
        self.customer = None
        self.case = None
        self.closed = None
        self.seen = set()
        self.invalidated = False
        query = context.get('query', '')
        self.emails = {x.casefold() for x in re.findall(r'[\w.+-]+@[\w.-]+\.[A-Za-z]+', query)}
        self.phones = {re.sub(r'\D', '', x)[-10:] for x in re.findall(r'(?<!\w)(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}(?!\w)', query)}
        self.resolved = {}

    def observe(self, event):
        if self.invalidated:
            return None
        item = event.get('item', {})
        if (event.get('type') != 'item.completed' or item.get('type') not in {'mcp_tool_call', 'mcpToolCall'}
                or item.get('status') != 'completed' or item.get('error')):
            return None
        if item.get('server') == 'opshub' and item.get('tool') == 'list_customers':
            self.resolve(item)
            return None
        if item.get('server') != 'browser-mcp' or item.get('tool') != 'browser_execute_script':
            return None
        arguments = item.get('arguments')
        if not isinstance(arguments, dict):
            return None
        page = self.probes.get(arguments.get('code'))
        data = payload(item.get('result')) if page else None
        if not data or data.get('page') != page:
            return None
        signature = hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
        if signature in self.seen:
            return None
        self.seen.add(signature)
        if page == 'customer':
            customer_url = url(data.get('url'), 'opshub.apps.opendoor.com', r'/customers/[A-Za-z0-9-]+/?')
            if not customer_url:
                return None
            candidate = self.resolved.get(customer_url)
            if customer_url not in self.resolved or str(data['email']).casefold() != candidate:
                return self.blocked('Customer readback is not bound to an exact input identifier from the OpsHub lookup.')
            if self.customer and self.customer['url'].rstrip('/') != customer_url:
                return self.blocked('Customer changed during verification; completion is not confirmed.')
            self.customer = {**data, 'url':customer_url}
            return self.partial('Customer identity read; case closure and final saved statuses are not yet verified.')
        if page == 'case':
            case_url = url(data.get('url'), 'alfred.ops.opendoor.com', r'/user-reviews/[A-Za-z0-9-]+/?')
            if not self.customer or not case_url:
                return None
            # An actual customer link is strongest. Otherwise require BOTH exact
            # account email and license, never name-only or license-only matching.
            linked = {x.rstrip('/') for x in data.get('customer_urls', []) if isinstance(x, str)} == {self.customer['url']}
            identity = (bool(self.customer['email']) and bool(self.customer['license_number'])
                        and str(data.get('email', '')).casefold() == self.customer['email'].casefold()
                        and data.get('license_number') == self.customer['license_number'])
            if not (linked or identity):
                return self.blocked('Alfred case identity could not be bound to the resolved customer; completion is not confirmed.')
            if self.case and self.case != case_url:
                return self.blocked('Alfred case changed during verification; completion is not confirmed.')
            self.case = case_url
            if data.get('closed') is True and data.get('home_access') in {'Allow', 'Deny'} and data.get('agent_status') in {'Verified', 'Denied', 'Unverified', 'Pending'}:
                self.closed = data
                return self.partial('Alfred case closure verified. Final OpsHub saved statuses are not yet verified.')
            return self.partial('Matching Alfred case retained; closure is not yet verified.')
        if page == 'final-customer':
            if not self.customer or not self.closed:
                return self.blocked('Completion checkpoint is missing bound Alfred closure evidence.')
            if (url(data.get('url'), 'opshub.apps.opendoor.com', r'/customers/[A-Za-z0-9-]+/?') != self.customer['url']
                    or data.get('email', '').casefold() != self.customer['email'].casefold()
                    or data.get('license_number') != self.customer['license_number']):
                return self.blocked('Final customer identity does not match the retained verification.')
            if (data.get('home_access') != self.closed['home_access']
                    or data.get('agent_status') != self.closed['agent_status']):
                return self.partial('Alfred case closure verified; OpsHub statuses have not yet matched the saved case outcome.')
            return {'version':1, 'state':'complete',
                'summary':f"Case: closed | Outcome: {data['home_access']} | Agent: {data['agent_status']}",
                'evidence':{'customer_url':self.customer['url'], 'case_url':self.case,
                    'case_closed':True, 'home_access':data['home_access'], 'agent_status':data['agent_status']}}
        return None

    def resolve(self, item):
        result = item.get('result')
        if not isinstance(result, dict) or result.get('isError'):
            return
        blocks = result.get('content') or []
        if len(blocks) != 1 or blocks[0].get('type') != 'text':
            return
        try:
            data = json.loads(blocks[0]['text'])
            candidates = data['web']['searchCustomers']
        except (ValueError, TypeError, KeyError):
            return
        if not isinstance(candidates, list) or not (self.emails or self.phones):
            return
        matches = {}
        for row in candidates[:100]:
            if not isinstance(row, dict):
                continue
            email = str(row.get('email') or '').casefold()
            phones = {re.sub(r'\D', '', x)[-10:] for x in str(row.get('phone_numbers') or '').split('/')}
            customer_id = row.get('uuid')
            if (not isinstance(customer_id, str) or not re.fullmatch(r'[A-Za-z0-9-]{1,200}', customer_id)
                    or (self.emails and email not in self.emails)
                    or (self.phones and not self.phones.intersection(phones))):
                continue
            matches['https://opshub.apps.opendoor.com/customers/' + customer_id] = email
        if len(matches) == 1:
            self.resolved.update(matches)

    def partial(self, summary):
        return {'version':1, 'state':'partial', 'summary':summary,
            'evidence':{'customer_url':self.customer['url'] if self.customer else None,
                        'case_url':self.case, 'case_closed':self.closed is not None}}

    def blocked(self, summary):
        self.invalidated = True
        value = self.partial(summary)
        value['state'] = 'blocked'
        return value
