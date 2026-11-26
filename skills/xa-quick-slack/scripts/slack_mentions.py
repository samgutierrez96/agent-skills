#!/usr/bin/env python3
"""Pure, typed Slack mention preflight. No lookups, sends, state or file writes.

Input on stdin: {"message": "...", "recipients": [
  {"kind": "group", "id": "S...", "handle": "verified-handle"},
  {"kind": "user", "id": "U..."}
]}
Recipients must come from verified workflow evidence, not from this parser.
A successful result returns the original message unchanged, never a repaired ID.
"""
import json
import re
import sys

USER = re.compile(r'<@([UW][A-Z0-9]{1,79})(?:\|[^<>\n]+)?>')
GROUP = re.compile(r'<!subteam\^(S[A-Z0-9]{1,79})(?:\|@?([A-Za-z0-9_.-]+))?>')
TOKEN = re.compile(r'<(?:@|!subteam)[^>\n]*>')
CODE = re.compile(r'```[\s\S]*?```|`[^`\n]*`')


def validate_message(message, recipients):
    """Require every verified target/cover, correct type and no extra mentions."""
    if not isinstance(message, str) or not message.strip() or len(message) > 12000:
        raise ValueError('The Slack message is missing or too long.')
    if not isinstance(recipients, list) or len(recipients) > 30:
        raise ValueError('Verified Slack recipients are required.')
    expected = {}
    for row in recipients:
        if not isinstance(row, dict) or set(row) - {'kind', 'id', 'handle'}:
            raise ValueError('A verified recipient has an invalid shape.')
        kind, identity = row.get('kind'), row.get('id')
        pattern = r'[UW][A-Z0-9]{1,79}' if kind == 'user' else r'S[A-Z0-9]{1,79}'
        if kind not in {'user', 'group'} or not isinstance(identity, str) or not re.fullmatch(pattern, identity):
            raise ValueError('A verified recipient ID does not match its type.')
        if identity in expected:
            raise ValueError('A verified recipient is duplicated or conflicting.')
        handle = row.get('handle')
        if kind == 'group':
            if not isinstance(handle, str) or not re.fullmatch(r'@?[A-Za-z0-9_.-]{1,80}', handle):
                raise ValueError('A verified group handle is required.')
            handle = handle.lstrip('@').lower()
        expected[identity] = (kind, handle)
    # A token inside code is display text, not a notification.
    visible = CODE.sub('', message)
    found = set()
    for token in TOKEN.finditer(visible):
        user, group = USER.fullmatch(token[0]), GROUP.fullmatch(token[0])
        if not user and not group:
            raise ValueError('Invalid Slack mention syntax; groups require subteam syntax.')
        match, kind = (group, 'group') if group else (user, 'user')
        identity = match[1]
        if identity not in expected or expected[identity][0] != kind:
            raise ValueError('A Slack mention does not match the verified recipients.')
        if group and group[2] and group[2].lower() != expected[identity][1]:
            raise ValueError('A Slack group label does not match the verified handle.')
        found.add(identity)
    remainder = TOKEN.sub('', visible)
    if '<@' in remainder or '<!subteam' in remainder:
        raise ValueError('A Slack mention is incomplete or malformed.')
    if found != set(expected):
        raise ValueError('A required Slack target or coverage mention is missing.')
    return message


def main():
    try:
        payload = json.loads(sys.stdin.read(24001))
        if not isinstance(payload, dict) or set(payload) != {'message', 'recipients'}:
            raise ValueError('Provide only the Slack message and verified recipients.')
        message = validate_message(payload['message'], payload['recipients'])
    except (ValueError, TypeError, KeyError):
        # Never echo customer text or an entire connector payload on failure.
        print(json.dumps({'ok': False, 'error': 'Slack mention preflight failed. Verify recipient types, IDs and handles before sending.'}))
        return 2
    print(json.dumps({'ok': True, 'message': message}))
    return 0


if __name__ == '__main__':
    sys.exit(main())
