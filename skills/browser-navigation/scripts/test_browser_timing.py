import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import browser_timing as timing


def sample(backend='native', **changes):
    row = dict(backend=backend, runtime='desktop', project='other', site='example',
               scenario='public-smoke', mode='benchmark', cache='warm', clock='monotonic',
               status='success', fallback='none', pair='0123456789abcdef',
               order=1 if backend == 'native' else 2, browser_ms=100 if backend == 'native' else 200,
               calls=2, retries=0, user_wait_ms=0)
    row.update(changes)
    return row


class TimingTests(unittest.TestCase):
    def test_paired_median(self):
        result = timing.summarize([sample(), sample('agent360')])
        group = result['comparisons'][0]
        self.assertEqual(group['browser']['median_native_minus_agent360_ms'], -100)
        self.assertFalse(group['browser_directional_signal'])

    def test_five_balanced_pairs(self):
        rows = []
        for i in range(5):
            pair = f'{i:016x}'
            rows += [sample(pair=pair, order=1 + i % 2), sample('agent360', pair=pair, order=2 - i % 2)]
        self.assertTrue(timing.summarize(rows)['comparisons'][0]['browser_directional_signal'])

    def test_order_bias_not_signal(self):
        rows = [r for i in range(5) for r in (sample(pair=f'{i:016x}'), sample('agent360', pair=f'{i:016x}'))]
        self.assertFalse(timing.summarize(rows)['comparisons'][0]['browser_directional_signal'])

    def test_mismatched_context_excluded(self):
        for changes in ({'runtime': 'cli'}, {'project': 'zendesk'}, {'cache': 'cold'}, {'scenario': 'lookup'}, {'site': 'opshub'}, {'clock': 'wall'}):
            with self.subTest(changes=changes):
                result = timing.summarize([sample(), sample('agent360', **changes)])
                self.assertEqual(result['excluded_pair_groups'], 1)
                self.assertFalse(result['comparisons'])

    def test_missing_duplicate_or_same_order_excluded(self):
        for rows in ([sample()], [sample(), sample(), sample('agent360')], [sample(), sample('agent360', order=1)]):
            self.assertEqual(timing.summarize(rows)['excluded_pair_groups'], 1)

    def test_failure_retained_not_timed_as_success(self):
        result = timing.summarize([sample(), sample('agent360', status='failed', retries=1)])
        self.assertEqual(result['outcomes']['agent360']['failed'], 1)
        self.assertEqual(result['outcomes']['agent360']['retries'], 1)
        self.assertEqual(result['comparisons'][0]['paired_attempts'], 1)
        self.assertEqual(result['comparisons'][0]['paired_successes'], 0)

    def test_unavailable_not_zero_duration(self):
        row = sample(status='blocked', browser_ms=None, calls=0, fallback='unavailable')
        result = timing.summarize([row])
        self.assertIsNone(row['browser_ms'])
        self.assertEqual(result['outcomes']['native']['fallbacks'], 1)

    def test_workflow_subtracts_user_wait_only(self):
        result = timing.summarize([sample(workflow_ms=1000, user_wait_ms=100),
                                   sample('agent360', workflow_ms=1500, user_wait_ms=200)])
        group = result['comparisons'][0]
        self.assertEqual(group['workflow']['median_native_ms'], 900)
        self.assertEqual(group['browser']['median_native_ms'], 100)

    def test_observational_rows_not_paired(self):
        result = timing.summarize([sample(mode='normal', pair=None, order=None)])
        self.assertEqual(result['outcomes']['native']['success'], 1)
        self.assertFalse(result['comparisons'])

    def test_unknown_clock_has_no_directional_signal(self):
        rows = [r for i in range(5) for r in
                (sample(pair=f'{i:016x}', order=1 + i % 2, clock='unknown'),
                 sample('agent360', pair=f'{i:016x}', order=2 - i % 2, clock='unknown'))]
        self.assertFalse(timing.summarize(rows)['comparisons'][0]['browser_directional_signal'])

    def test_rejects_private_free_text_and_invalid_values(self):
        cases = ({'url': 'https://example.com/private'}, {'project': 'customer@example.com'},
                 {'pair': '../private'}, {'browser_ms': float('nan')}, {'browser_ms': -1},
                 {'browser_ms': float('inf')}, {'browser_ms': None}, {'calls': -1},
                 {'calls': True}, {'user_wait_ms': 5}, {'workflow_ms': 2, 'user_wait_ms': 3},
                 {'mode': 'normal'}, {'recorded_at': 'customer private data'})
        for change in cases:
            with self.subTest(change=change), self.assertRaises(ValueError):
                timing.validate(sample(**change))

    def test_private_storage_and_roundtrip(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'data'
            timing.append(root, sample())
            self.assertEqual(timing.load(root)[0]['backend'], 'native')
            self.assertEqual(root.stat().st_mode & 0o777, 0o700)
            self.assertEqual((root / 'events.jsonl').stat().st_mode & 0o777, 0o600)

    def test_symlink_target_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'events.jsonl').symlink_to(root / 'other')
            with self.assertRaises(OSError):
                timing.append(root, sample())

    def test_cli_stopwatch(self):
        with tempfile.TemporaryDirectory() as directory:
            output = io.StringIO()
            with contextlib.redirect_stdout(output), patch.object(timing.time, 'monotonic_ns', return_value=1000000000), patch.object(timing.time, 'time_ns', return_value=1000000000):
                timing.main(['--data-dir', directory, 'begin'])
            token = json.loads(output.getvalue())['stopwatch']
            flags = ['--backend', 'native', '--runtime', 'desktop', '--project', 'other',
                     '--site', 'example', '--scenario', 'public-smoke', '--cache', 'warm',
                     '--browser-ms', '50', '--calls', '2', '--status', 'success']
            with contextlib.redirect_stdout(io.StringIO()), patch.object(timing.time, 'monotonic_ns', return_value=1100000000), patch.object(timing.time, 'time_ns', return_value=1100000000):
                timing.main(['--data-dir', directory, 'finish', token, *flags])
            self.assertEqual(timing.load(Path(directory))[0]['workflow_ms'], 100)
            self.assertFalse((Path(directory) / (token + '.json')).exists())
            with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
                timing.main(['--data-dir', directory, 'finish', token, *flags])
            self.assertEqual(len(timing.load(Path(directory))), 1)


if __name__ == '__main__':
    unittest.main()
