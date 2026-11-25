#!/usr/bin/env python3
"""Read exact playbook sections in a bounded, revision-bound packet; no writes."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shlex
import sys

PLAYBOOK = Path(__file__).resolve().parents[1] / 'SKILL.md'
MAX_CHARS = 6000
DEFAULT_CHARS = 4000
COLLECTIONS = {'Per-type recipes', 'Fast recipe index'}


def select(text, headings, entry=None):
    """Keep whole named sections (including subordinate headings), in order."""
    if any(heading in COLLECTIONS for heading in headings) and entry is None:
        raise ValueError('This is a recipe collection, not one rule. Select its exact --entry '
                         'or the focused section named by the matching recipe; no collection pages were read.')
    matches = list(re.finditer(r'^(#{1,6}) (.+?)\s*$', text, re.M))
    parts = []
    for heading in headings:
        found = [i for i, match in enumerate(matches) if match[2] == heading]
        if len(found) != 1:
            raise ValueError('Required heading is missing or ambiguous: ' + heading)
        index = found[0]
        start = matches[index]
        stop = next((match.start() for match in matches[index + 1:]
                     if len(match[1]) <= len(start[1])), len(text))
        parts.append(text[start.start():stop])
    selected = '\n'.join(parts)
    if entry is not None:
        if len(headings) != 1:
            raise ValueError('An entry requires exactly one section.')
        # Only top-level bold recipe bullets: nested bullets stay with their
        # governing entry, and a guessed substring cannot select another rule.
        bullets = list(re.finditer(r'^- \*\*(.+?)\*\*', selected, re.M | re.S))
        key = lambda value: re.sub(r'\s+', ' ', value).strip().rstrip('.:')
        found = [i for i, match in enumerate(bullets) if key(match[1]) == key(entry)]
        if len(found) != 1:
            raise ValueError('Required recipe entry is missing or ambiguous: ' + entry)
        index = found[0]
        end = bullets[index + 1].start() if index + 1 < len(bullets) else len(selected)
        # Retain the section preamble; its scope/definitions govern each entry.
        selected = selected[:bullets[0].start()] + selected[bullets[index].start():end]
    return selected


def packet(text, headings, *, entry=None, offset=0, revision=None, limit=DEFAULT_CHARS):
    fingerprint = hashlib.sha256(text.encode()).hexdigest()
    if offset and revision is None:
        raise ValueError('A continuation requires the first page source revision.')
    if revision is not None and revision != fingerprint:
        raise ValueError('Playbook changed between pages. Restart the named selection.')
    if type(limit) is not int or not 1 <= limit <= MAX_CHARS:
        raise ValueError('Packet size must be between 1 and 6000 characters.')
    selected = select(text, headings, entry)
    if type(offset) is not int or not 0 <= offset < len(selected):
        raise ValueError('Offset is outside the selected material.')
    end = min(len(selected), offset + limit)
    line_ends = list(re.finditer('\n', selected[offset:end]))
    if len(line_ends) >= 200:
        end = offset + line_ends[199].end()
    if end < len(selected):
        newline = selected.rfind('\n', offset, end)
        if newline > offset:
            end = newline + 1
    result = {'source_sha256':fingerprint, 'sections':headings, 'entry':entry,
              'offset':offset, 'next_offset':end if end < len(selected) else None,
              'complete':end == len(selected), 'total_chars':len(selected),
              'text':selected[offset:end]}
    if not result['complete']:
        args = ['python3', 'skills/zendesk-record-retrieval/scripts/read_playbook.py']
        for heading in headings:
            args.extend(['--section', heading])
        if entry is not None:
            args.extend(['--entry', entry])
        args.extend(['--offset', str(end), '--revision', fingerprint, '--limit', str(limit)])
        result['continue_with'] = shlex.join(args)
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--section', action='append', required=True)
    parser.add_argument('--entry')
    parser.add_argument('--offset', type=int, default=0)
    parser.add_argument('--revision')
    parser.add_argument('--limit', type=int, default=DEFAULT_CHARS)
    args = parser.parse_args(argv)
    try:
        result = packet(PLAYBOOK.read_text(), args.section, entry=args.entry,
                        offset=args.offset, revision=args.revision, limit=args.limit)
    except (OSError, UnicodeError, ValueError) as exc:
        print(json.dumps({'complete':False, 'error':str(exc)}))
        return 1
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
