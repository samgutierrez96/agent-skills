"""Evidence-bound note-only completion. No I/O; Router supplies guarded MCP calls.

An explicit dry-run after the workflow's identity/merge/routing gates binds the
exact note, CONTACT and operator to a confirmed draft. It is not a post receipt.
Unknown shapes, edits, multiple contacts and unmatched messages fail closed.
"""
import copy
import hashlib
import html
import json
import re
import time


LABELS = ('Property Address:', 'Reason for Call:', 'Customer Concerns:',
          'Solution Offered:', 'Follow Up Link:')
CUSTOMER = r'https://opshub\.apps\.opendoor\.com/customers/[A-Za-z0-9-]{1,200}'
PROPERTY = r'https://opshub\.apps\.opendoor\.com/property/[A-Za-z0-9-]{1,200}'


def digest(body):
    return hashlib.sha256(body.replace('\r\n', '\n').strip().encode()).hexdigest()


def fingerprint(snapshot):
    keys = ('version','draft_id','channel_id','message','created','body','body_sha256',
            'customer_uuid','operator','property_url','keyword')
    return hashlib.sha256(json.dumps({key:snapshot.get(key) for key in keys},
        sort_keys=True, separators=(',', ':'), allow_nan=False).encode()).hexdigest()


def note(text):
    boxes = re.findall(r'```(?:text)?[ \t]*\n(.*?)\n```', text or '', re.S)
    if len(boxes) != 1:
        return None
    body = boxes[0].strip()
    if (len(body) > 12000 or not body.startswith(LABELS[0])
            or any(len(re.findall(r'^' + re.escape(label), body, re.M)) != 1 for label in LABELS)
            or [body.index(label) for label in LABELS] != sorted(body.index(label) for label in LABELS)):
        return None
    return body


def data(result):
    if not isinstance(result, dict) or result.get('isError'):
        return None
    values = []
    for block in result.get('content', []):
        try:
            value = json.loads(block.get('text', '')) if block.get('type') == 'text' else None
        except (ValueError, TypeError):
            continue
        if isinstance(value, dict):
            values.append(value)
    if len(values) != 1:
        return None
    value = values[0]
    if value.get('errors') or value.get('error') or value.get('_error') or value.get('ok') is False:
        return None
    return value


def normalized(message):
    message = html.unescape(message).replace('\\/', '/')
    message = re.sub(r'\[([^\]\n]+)\]\((https://[^\s)]+)\)', r'<\2|\1>', message)
    message = re.sub(r'<(https://[^>|\s]+)\|([^>]+)>', r'\1 \2', message)
    message = re.sub(r'<(https://[^>|\s]+)>', r'\1', message)
    message = re.sub(r'<!subteam\^([A-Z0-9]+)(?:\|[^>]+)?>', r'<@\1>', message)
    message = re.sub(r'<@([A-Z0-9]+)(?:\|[^>]+)?>', r'<@\1>', message)
    return re.sub(r'\s+', ' ', message).strip()


class Observer:
    """Keep only this turn's confirmed draft and matching dry-run payload."""
    def __init__(self):
        self.draft = self.preview = None

    def observe(self, event):
        if event.get('type') != 'item.completed':
            return
        item = event.get('item', {})
        if item.get('type') != 'mcp_tool_call' or item.get('status') != 'completed' or item.get('error'):
            return
        args = item.get('arguments') or {}
        value = data(item.get('result'))
        if value is None or not isinstance(args, dict):
            return
        if (item.get('server') in {'slack', 'codex_apps'}
                and item.get('tool') in {'slack_send_message_draft', 'slack.slack_send_message_draft'}):
            self.draft = None
            if (re.fullmatch(r'[A-Za-z0-9_-]{1,200}', str(value.get('draft_id', '')))
                    and re.fullmatch(r'[A-Z0-9]{1,100}', str(args.get('channel_id', '')))
                    and isinstance(args.get('message'), str) and not args.get('thread_ts')
                    and len(args['message']) < 12000):
                self.draft = {'draft_id':value['draft_id'], 'channel_id':args['channel_id'],
                              'message':args['message'], 'created':time.time()}
        if (item.get('server') == 'opshub' and item.get('tool') == 'call_operation'
                and args.get('operation_name') == 'CreateCustomerNote' and args.get('dry_run') is True):
            self.preview = None
            variables = args.get('variables', {})
            if (value.get('_dry_run') is True and value.get('would_execute') == {
                    'operation':'CreateCustomerNote', 'variables':variables}):
                self.preview = copy.deepcopy(variables)

    def prepare(self, response):
        body = note(response.get('result', ''))
        draft, preview = self.draft, self.preview
        if (response.get('status') != 'finished' or response.get('needs_input') or not body
                or not draft or not isinstance(preview, dict)
                or set(preview) != {'contextType','contextIdentifier','body','createdByToken'}
                or preview.get('contextType') != 'CONTACT' or preview.get('body') != body
                or not re.fullmatch(r'[A-Za-z0-9-]{1,200}', str(preview.get('contextIdentifier', '')))
                or not re.fullmatch(r'[A-Za-z0-9_-]{1,200}', str(preview.get('createdByToken', '')))):
            return None
        customers = set(re.findall(CUSTOMER, draft['message']))
        properties = set(re.findall(PROPERTY, draft['message']))
        if customers != {'https://opshub.apps.opendoor.com/customers/' + preview['contextIdentifier']} or len(properties) != 1:
            return None
        property_url = next(iter(properties))
        labels = re.findall(r'\[([^\]\n]+)\]\(' + re.escape(property_url) + r'\)|<' + re.escape(property_url) + r'\|([^>]+)>', draft['message'])
        address = body.splitlines()[0].split(':', 1)[1].strip()
        if len(labels) != 1 or (labels[0][0] or labels[0][1]).strip() != address:
            return None
        # Do not silently rewrite an existing link pack or a multi-artifact task.
        if body.split('Follow Up Link:', 1)[1].strip():
            return None
        street = body.splitlines()[0].split(':', 1)[1].split(',', 1)[0]
        words = [word for word in re.findall(r'[A-Za-z]+', street)
                 if word.lower() not in {'st','street','rd','road','dr','drive','ave','avenue','ln','lane','ct','court'}]
        if not words:
            return None
        snapshot = {'version':1, **draft, 'body':body, 'body_sha256':digest(body),
                'customer_uuid':preview['contextIdentifier'], 'operator':preview['createdByToken'],
                'property_url':properties.pop(), 'keyword':max(words, key=len)}
        return {**snapshot, 'snapshot_sha256':fingerprint(snapshot)}


def match_message(result, snapshot, now):
    value = data(result)
    results = value.get('results') if value else None
    if not isinstance(results, str):
        raise ValueError('Slack did not return readable sent-message evidence.')
    pagination = value.get('pagination_info')
    if (not isinstance(pagination, str) or 'no more pages' not in pagination.lower()
            or value.get('next_cursor') or value.get('has_more')):
        raise ValueError('The sent-message search is incomplete. No note was posted.')
    results = results.replace('\\n', '\n').replace('\\/', '/')
    count = re.search(r'^## Messages \(([0-9]+) results?\)\s*$', results, re.M)
    headings = list(re.finditer(r'^### Result ([1-9][0-9]*) of ([1-9][0-9]*)[ \t]*$', results, re.M))
    if (not count or not 1 <= int(count[1]) <= 20 or len(headings) != int(count[1])
            or any(isinstance(value.get(key), int) and value[key] > int(count[1]) for key in ('total','total_count'))
            or any(int(header[1]) != index or header[2] != count[1]
                   for index, header in enumerate(headings, 1))):
        raise ValueError('Slack returned incomplete or ambiguous message boundaries. No note was posted.')
    matches = set()
    for index, header in enumerate(headings):
        record = results[header.end():headings[index+1].start() if index+1 < len(headings) else len(results)]
        metadata, separator, text = record.partition('\nText:')
        if not separator:
            continue
        channel = re.search(r'^Channel: [^\r\n]*\(ID: ([A-Z0-9]+)\)', metadata, re.M)
        stamp = re.search(r'^Message_ts: ([0-9]+\.[0-9]{6})\s*$', metadata, re.M)
        link = re.search(r'^Permalink: \[[^\]\r\n]*\]\((https://[a-zA-Z0-9.-]+\.slack\.com/archives/([A-Z0-9]+)/p([0-9]+))\)', metadata, re.M)
        if (not channel or not stamp or not link or channel[1] != snapshot['channel_id']
                or link[2] != channel[1] or link[3] != stamp[1].replace('.', '')
                or not snapshot['created'] - 5 <= float(stamp[1]) <= now + 60):
            continue
        text = re.sub(r'\n[ \t\r\n]*---[ \t\r\n]*$', '', text)
        if normalized(text) == normalized(snapshot['message']):
            matches.add(link[1])
    if len(matches) != 1:
        raise ValueError('The exact sent Slack message could not be matched uniquely. No note was posted.')
    return matches.pop()


def complete(snapshot, call, before_write, confirmed, now=None):
    """One lexical lookup and one exact CONTACT post; no model or write retry."""
    now = time.time() if now is None else now
    if (snapshot.get('version') != 1 or digest(snapshot.get('body', '')) != snapshot.get('body_sha256')
            or snapshot.get('snapshot_sha256') != fingerprint(snapshot)
            or not 0 <= now - snapshot.get('created', 0) <= 1800):
        raise ValueError('The saved posting snapshot is stale or changed. Use the checked workflow.')
    result = call('codex_apps', 'slack.slack_search_public_and_private', {
        'keywords':[snapshot['keyword']], 'filters':'in:<#' + snapshot['channel_id'] + '>',
        'after':str(snapshot['created'] - 5),
        'content_types':'messages', 'include_context':False, 'limit':10,
        'sort':'timestamp', 'response_format':'detailed', 'natural_language_query':''})
    url = match_message(result, snapshot, now)
    body = snapshot['body']
    body = re.sub(r'(?m)^Solution Offered: Prepared an escalation to (.+)$',
                  r'Solution Offered: Escalated to \1', body)
    body = body.rstrip() + ' ' + url + '\n\n' + snapshot['property_url']
    args = {'operation_name':'CreateCustomerNote', 'dry_run':False, 'variables':{
        'contextType':'CONTACT', 'contextIdentifier':snapshot['customer_uuid'],
        'body':body, 'createdByToken':snapshot['operator']}}
    before_write(args, url)
    result = call('opshub', 'call_operation', args)
    value = data(result)
    try:
        identity = value['notes']['createNote']['note']['id'] if value and not value.get('_dry_run') else None
    except (KeyError, TypeError):
        identity = None
    if not isinstance(identity, str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,200}', identity):
        raise ValueError('The note-posting outcome is unconfirmed. Verify OpsHub before retrying; no second post was attempted.')
    receipt = {'note_id':identity, 'customer_url':'https://opshub.apps.opendoor.com/customers/' + snapshot['customer_uuid'],
               'body':body, 'body_sha256':digest(body)}
    response = {'status':'finished', 'execution_mode':'direct-post-completion', 'result':'```\n' + body + '\n```\n\nOpsHub note posted.',
                'note_receipts':[receipt], 'escalation_evidence':{'posted_notes':[receipt], 'slack_urls':[url],
                'note_targets':[{'customer_url':receipt['customer_url'], 'body_sha256':receipt['body_sha256']}]}}
    confirmed(response, receipt, url)
    return response
