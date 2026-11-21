#!/usr/bin/env python3
"""Synthetic offline regression checks for the validator, never for live customers."""
from __future__ import annotations

import json
import runpy
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = runpy.run_path(str(ROOT / "scripts" / "validate_xa_notes.py"))
CASES = json.loads((ROOT / "tests" / "golden_cases.json").read_text())
BY_ID = {case["id"]: case for case in CASES}
VALID = BY_ID["already-written-hodw-process"]["expected"]


class ValidatorTests(unittest.TestCase):
    def test_all_fixtures_are_present_and_valid(self):
        self.assertEqual(len(CASES), len(BY_ID))
        for case in CASES:
            with self.subTest(case=case["id"]):
                self.assertIsInstance(case["expected"], str)
                self.assertEqual(API["validate_case"](
                    case, case["expected"], case.get("expected_operations")), [])

    def test_empty_fields_are_failures_not_crashes(self):
        for label in API["LABELS"]:
            with self.subTest(field=label):
                lines = VALID.splitlines()
                lines = [label + ": " if line.startswith(label + ": ") else line for line in lines]
                self.assertIn(label + " cannot be empty", API["validate_note"]("\n".join(lines)))

    def test_assigned_name_must_be_in_solution_not_only_elsewhere(self):
        case = BY_ID["assigned-hsa-name-on-post"]
        for placement in ("Customer Concerns", "Reason for Call"):
            output = case["expected"].replace("home sale advisor, Alex Example.", "home sale advisor.")
            output = output.replace(placement + ": ", placement + ": Home sale advisor, Alex Example. ")
            self.assertIn("Alex Example", output)
            self.assertIn("Solution Offered must contain 'home sale advisor, Alex Example'",
                API["validate_case"](case, output, ["CreateCustomerNote"]))

    def test_other_lead_advisor_cannot_replace_matched_advisor(self):
        case = BY_ID["assigned-hsa-name-on-post"]
        output = case["expected"].replace("Alex Example", "Taylor Prior")
        self.assertTrue(API["validate_case"](case, output, ["CreateCustomerNote"]))

    def test_layout_and_output_boundaries(self):
        invalid = [
            VALID.replace("\n\nReason", "\nReason"),
            VALID.replace("Reason for Call:", "Reason:"),
            VALID.replace("Reason for Call: ", "Reason for Call:\n"),
            "Here is your note:\n" + VALID,
            VALID + "\n\nHere is a Slack draft.",
            VALID + "\n\n" + VALID,
            VALID.replace("Property manager", "Property manager — caller", 1),
        ]
        for output in invalid:
            with self.subTest(output=output[:50]):
                self.assertTrue(API["validate_note"](output))

    def test_slack_link_and_completed_work_are_allowed(self):
        for case_id in ("attach-existing-report-and-ticket", "completed-slack-work-link"):
            case = BY_ID[case_id]
            self.assertEqual(API["validate_case"](case, case["expected"], []), [])

    def test_links_must_be_preserved_once_and_in_full(self):
        case = BY_ID["attach-existing-report-and-ticket"]
        url = case["expected_urls"][0]
        for output in (
            case["expected"].replace(url, ""),
            case["expected"].replace(url, url + " " + url),
            case["expected"].replace(url, url + "-different"),
        ):
            self.assertTrue(API["validate_case"](case, output, []))

    def test_missing_report_link_is_not_invented(self):
        case = BY_ID["report-link-unverified"]
        altered = case["expected"].replace("Filed an incident report.", "Filed an incident report. https://example.com/made-up")
        self.assertTrue(API["validate_case"](case, altered, []))

    def test_unstated_final_offer_timing_is_rejected(self):
        for case_id in ("iwt-reschedule", "assessment-next-steps-seller", "refresh-confirmed-seller"):
            case = BY_ID[case_id]
            output = case["expected"].replace("\n\nFollow Up Link:", " Wait 3 to 5 business days.\n\nFollow Up Link:")
            self.assertTrue(API["validate_case"](case, output))

    def test_explicit_timing_is_required(self):
        case = BY_ID["timing-explicitly-stated"]
        self.assertTrue(API["validate_case"](case, case["expected"].replace("3 to 5 business days", "soon")))

    def test_continuation_preserves_context(self):
        case = BY_ID["same-call-continuation"]
        self.assertTrue(API["validate_case"](case, case["expected"].replace("spouse", "someone")))

    def test_named_caller_does_not_inherit_prior_call(self):
        case = BY_ID["new-caller-does-not-inherit"]
        output = case["expected"].replace("Solution Offered: ", "Solution Offered: Filed a home issue report. ")
        self.assertTrue(API["validate_case"](case, output, []))

    def test_correction_route_is_outside_note(self):
        case = BY_ID["correction-no-post"]
        self.assertEqual(API["validate_case"](case, case["expected"], []), [])
        self.assertTrue(API["validate_case"](case, case["expected"].split("\n\nRoute:")[0], []))

    def test_posting_authorization_requires_trace(self):
        for case_id in ("reported-post-is-not-authorization", "draft-only-is-not-authorization", "quoted-post-is-not-authorization"):
            case = BY_ID[case_id]
            self.assertEqual(API["validate_case"](case, case["expected"], []), [])
            self.assertTrue(API["validate_case"](case, case["expected"], ["CreateCustomerNote"]))
            self.assertTrue(API["validate_case"](case, case["expected"]))

    def test_corrected_post_updates_not_creates(self):
        case = BY_ID["explicit-corrected-post-updates-original"]
        self.assertEqual(API["validate_case"](case, case["expected"], ["UpdateCustomerNote"]), [])
        self.assertTrue(API["validate_case"](case, case["expected"], ["CreateCustomerNote"]))

    def test_direct_fix_preserves_facts_and_uses_one_update_only(self):
        case = BY_ID["direct-fix-updates-verified-original-without-invented-timing"]
        self.assertEqual(API["validate_case"](case, case["expected"], ["UpdateCustomerNote"]), [])
        for operations in ([], ["CreateCustomerNote"], ["UpdateCustomerNote", "UpdateCustomerNote"]):
            self.assertTrue(API["validate_case"](case, case["expected"], operations))
        invented = case["expected"].replace("I refreshed the offer.",
            "I refreshed the offer and told them to expect a Final Offer in 3 to 5 business days.")
        self.assertTrue(API["validate_case"](case, invented, ["UpdateCustomerNote"]))

    def test_post_keeps_property_and_report_links(self):
        case = BY_ID["explicit-post-preserves-both-links"]
        for url in case["expected_urls"]:
            self.assertTrue(API["validate_case"](case, case["expected"].replace(url, ""), ["CreateCustomerNote"]))

    def check_cli(self, records, *flags):
        with tempfile.TemporaryDirectory(prefix="xa-note-validator-test-") as directory:
            path = Path(directory) / "outputs.json"
            path.write_text(json.dumps(records), encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(ROOT / "scripts" / "validate_xa_notes.py"), "--outputs", str(path), *flags],
                capture_output=True, text=True, check=False,
            )

    def test_missing_outputs_fail_without_fallback_to_expected(self):
        record = {"id": "warmup-ready", "output": "Ready when you are."}
        result = self.check_cli([record])
        self.assertEqual(result.returncode, 1)
        self.assertIn("missing candidate output", result.stdout)
        self.assertNotIn("PASS iwt-reschedule", result.stdout)

    def test_partial_sample_must_be_explicit_and_labeled(self):
        result = self.check_cli([{"id": "warmup-ready", "output": "Ready when you are."}], "--allow-partial")
        self.assertEqual(result.returncode, 0)
        self.assertIn("NOT VERIFIED", result.stdout)
        self.assertIn("Partial sample only", result.stdout)

    def test_bad_candidate_input_fails_closed(self):
        for records in (
            [],
            {},
            [{"id": "warmup-ready", "output": None}],
            [{"id": "unknown", "output": VALID}],
            [{"id": "warmup-ready", "output": "Ready when you are."}] * 2,
            [{"id": "draft-only-is-not-authorization", "output": VALID, "operations": "CreateCustomerNote"}],
        ):
            with self.subTest(records=records):
                self.assertEqual(self.check_cli(records).returncode, 2)

    def test_fixture_check_does_not_claim_model_validation(self):
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "validate_xa_notes.py")],
            capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn("Fixture checks only", result.stdout)
        self.assertIn("Router latency: Not verified", result.stdout)


if __name__ == "__main__":
    unittest.main()
