"""Private, metadata-only browser timing; no browser control or network access."""
import argparse
import json
import math
import os
from pathlib import Path
import re
import secrets
import statistics
import time

ENUMS = {
    'backend': ('native', 'agent360'),
    'runtime': ('desktop', 'router', 'cli', 'sdk'),
    'project': ('xa-notes', 'zendesk', 'escalations', 'bot-tasks',
                'agent-verification', 'account-merge', 'scheduling', 'other'),
    'site': ('example', 'opshub', 'admin', 'alfred', 'google', 'calendly', 'slack', 'other'),
    'scenario': ('public-smoke', 'navigation', 'lookup', 'iframe', 'form', 'workflow'),
    'mode': ('normal', 'benchmark'),
    'cache': ('cold', 'warm', 'unknown'),
    'clock': ('monotonic', 'wall', 'unknown'),
    'status': ('success', 'failed', 'blocked'),
    'fallback': ('none', 'unavailable', 'focus', 'iframe', 'input', 'timeout', 'disconnected', 'other'),
}
TOKEN = re.compile(r'[0-9a-f]{16}\Z')
GROUP = ('runtime', 'project', 'site', 'scenario', 'cache', 'clock')
LIMIT_MS = 86_400_000


def number(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not 0 <= value <= LIMIT_MS:
        raise ValueError(f'{name} must be a finite duration between zero and 24 hours')
    return round(value, 3)


def validate(row):
    row.setdefault('clock', 'unknown')
    allowed = set(ENUMS) | {'pair', 'order', 'browser_ms', 'workflow_ms', 'user_wait_ms',
                          'calls', 'retries', 'recorded_at', 'schema'}
    if set(row) - allowed:
        raise ValueError('Unknown telemetry fields are not permitted')
    for key, options in ENUMS.items():
        if row.get(key) not in options:
            raise ValueError(f'Invalid {key}')
    pair = row.get('pair')
    if pair is not None and (not isinstance(pair, str) or not TOKEN.fullmatch(pair)):
        raise ValueError('Pair must be a random 16-hex token, never a customer identifier')
    order = row.get('order')
    if row['mode'] == 'benchmark':
        if not pair or type(order) is not int or order not in (1, 2):
            raise ValueError('Benchmarks require a random pair token and order 1 or 2')
    elif pair is not None or order is not None:
        raise ValueError('Normal observations cannot be labeled as paired benchmarks')
    for key in ('calls', 'retries'):
        if type(row.get(key)) is not int or not 0 <= row[key] <= 10000:
            raise ValueError(f'Invalid {key}')
    for key in ('browser_ms', 'workflow_ms'):
        if row.get(key) is not None:
            row[key] = number(row[key], key)
    row['user_wait_ms'] = number(row.get('user_wait_ms', 0), 'user_wait_ms')
    if row.get('workflow_ms') is None and row['user_wait_ms']:
        raise ValueError('User wait requires workflow timing')
    if row.get('workflow_ms') is not None and row['user_wait_ms'] > row['workflow_ms']:
        raise ValueError('User wait exceeds workflow duration')
    if row['status'] == 'success' and row.get('browser_ms') is None:
        raise ValueError('Success requires an observed browser duration')
    if row.get('recorded_at') is not None and not re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ', str(row['recorded_at'])):
        raise ValueError('Invalid timestamp')
    if row.get('schema', 1) != 1:
        raise ValueError('Unsupported schema')
    return row


def private_root(root):
    if root.is_symlink():
        raise ValueError('Telemetry directory cannot be a symlink')
    root.mkdir(mode=0o700, parents=True, exist_ok=True)
    root.chmod(0o700)


def append(root, row):
    validate(row)
    private_root(root)
    flags = os.O_WRONLY | os.O_CREAT | os.O_APPEND | os.O_NOFOLLOW
    fd = os.open(root / 'events.jsonl', flags, 0o600)
    try:
        os.fchmod(fd, 0o600)
        os.write(fd, (json.dumps(row, allow_nan=False, separators=(',', ':')) + '\n').encode())
    finally:
        os.close(fd)


def load(root):
    target = root / 'events.jsonl'
    if target.is_symlink():
        raise ValueError('Telemetry file cannot be a symlink')
    if not target.exists():
        return []
    return [validate(json.loads(line)) for line in target.read_text().splitlines() if line.strip()]


def summarize(rows):
    groups, pairs, totals = {}, {}, {}
    for raw in rows:
        row = validate(dict(raw))
        key = row['backend']
        total = totals.setdefault(key, {'attempts': 0, 'success': 0, 'failed': 0, 'blocked': 0, 'fallbacks': 0, 'retries': 0})
        total['attempts'] += 1
        total[row['status']] += 1
        total['fallbacks'] += row['fallback'] != 'none'
        total['retries'] += row['retries']
        if row['mode'] == 'benchmark':
            pairs.setdefault(row['pair'], []).append(row)
    invalid = 0
    for attempts in pairs.values():
        if (len(attempts) != 2 or {r['backend'] for r in attempts} != {'native', 'agent360'}
                or {r['order'] for r in attempts} != {1, 2}
                or any(attempts[0][k] != attempts[1][k] for k in GROUP)):
            invalid += 1
            continue
        key = tuple(attempts[0][k] for k in GROUP)
        group = groups.setdefault(key, {'context': dict(zip(GROUP, key)), 'paired_attempts': 0,
                                       'paired_successes': 0, 'native_first': 0, 'agent360_first': 0,
                                       'browser': [], 'workflow': []})
        group['paired_attempts'] += 1
        if any(r['status'] != 'success' for r in attempts):
            continue
        group['paired_successes'] += 1
        first = next(r['backend'] for r in attempts if r['order'] == 1)
        group[first + '_first'] += 1
        ordered = {r['backend']: r for r in attempts}
        group['browser'].append([ordered[b]['browser_ms'] for b in ('native', 'agent360')])
        if all(r.get('workflow_ms') is not None for r in attempts):
            group['workflow'].append([ordered[b]['workflow_ms'] - ordered[b]['user_wait_ms']
                                      for b in ('native', 'agent360')])
    output = []
    for group in groups.values():
        for metric in ('browser', 'workflow'):
            samples = group.pop(metric)
            values = {'successful_pairs': len(samples)}
            if samples:
                values['median_native_ms'] = statistics.median(v[0] for v in samples)
                values['median_agent360_ms'] = statistics.median(v[1] for v in samples)
                values['median_native_minus_agent360_ms'] = statistics.median(v[0] - v[1] for v in samples)
            group[metric] = values
        balanced = abs(group['native_first'] - group['agent360_first']) <= 1
        group['browser_directional_signal'] = (group['context']['cache'] == 'warm'
                                               and group['context']['clock'] != 'unknown'
                                               and group['paired_successes'] >= 5 and balanced)
        output.append(group)
    return {'outcomes': totals, 'excluded_pair_groups': invalid, 'comparisons': output,
            'caution': 'Browser blocks and workflow timings are distinct. Public smoke tests do not establish internal workflow speed.'}


def parser():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--data-dir', type=Path, default=Path.home() / '.codex/browser-benchmarks')
    sub = p.add_subparsers(dest='command', required=True)
    sub.add_parser('pair')
    sub.add_parser('begin')
    sub.add_parser('summary')
    for command in ('record', 'finish'):
        item = sub.add_parser(command)
        if command == 'finish':
            item.add_argument('token')
        for key, options in ENUMS.items():
            item.add_argument('--' + key.replace('_', '-'), choices=options,
                              required=key not in ('mode', 'fallback', 'clock'),
                              default={'mode': 'normal', 'fallback': 'none', 'clock': 'unknown'}.get(key))
        item.add_argument('--pair')
        item.add_argument('--order', type=int)
        item.add_argument('--browser-ms', type=float)
        item.add_argument('--calls', type=int, required=True)
        item.add_argument('--retries', type=int, default=0)
        item.add_argument('--user-wait-ms', type=float, default=0)
    return p


def main(argv=None):
    p = parser()
    args = p.parse_args(argv)
    root = args.data_dir.expanduser()
    try:
        if args.command == 'pair':
            result = {'pair': secrets.token_hex(8)}
        elif args.command == 'begin':
            private_root(root)
            token = secrets.token_hex(8)
            state = {'monotonic_ns': time.monotonic_ns(), 'wall_ns': time.time_ns()}
            fd = os.open(root / (token + '.json'), os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
            with os.fdopen(fd, 'w') as stream:
                json.dump(state, stream)
            result = {'stopwatch': token}
        elif args.command == 'summary':
            result = summarize(load(root))
        else:
            row = {key: getattr(args, key) for key in ENUMS}
            row.update({key: getattr(args, key) for key in ('pair', 'order', 'browser_ms', 'calls', 'retries', 'user_wait_ms')})
            state_path = None
            if args.command == 'finish':
                if not TOKEN.fullmatch(args.token):
                    raise ValueError('Invalid stopwatch token')
                state_path = root / (args.token + '.json')
                if state_path.is_symlink():
                    raise ValueError('Stopwatch cannot be a symlink')
                state = json.loads(state_path.read_text())
                elapsed = (time.monotonic_ns() - state['monotonic_ns']) / 1_000_000
                wall_elapsed = (time.time_ns() - state['wall_ns']) / 1_000_000
                if elapsed < 0 or abs(wall_elapsed - elapsed) > 60000:
                    raise ValueError('Stopwatch invalid after restart/clock change; retain browser timing only')
                row['workflow_ms'] = elapsed
            row.update(schema=1, recorded_at=time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()))
            append(root, row)
            if state_path:
                state_path.unlink()
            result = {'saved': True, 'backend': row['backend'], 'status': row['status']}
        print(json.dumps(result, indent=2, allow_nan=False))
    except (ValueError, OSError, KeyError, TypeError) as exc:
        p.error(str(exc))


if __name__ == '__main__':
    main()
