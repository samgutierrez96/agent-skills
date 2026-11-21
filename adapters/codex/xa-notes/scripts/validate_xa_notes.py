#!/usr/bin/env python3
"""Offline XA note validation. Never calls a model, connector, or customer system.

No arguments checks fixtures, not generated model behavior.
--outputs checks supplied candidate outputs; missing cases fail unless
--allow-partial is explicitly supplied. Historical evidence is never rewritten.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

LABELS = [
    "Property Address", "Reason for Call", "Customer Concerns",
    "Solution Offered", "Follow Up Link",
]
KINDS = {"warmup", "note", "shape", "correction", "post"}


def normalize(value: str) -> str:
    return value.replace("\r\n", "\n").strip("\n")


def validate_note(output: str, kind: str = "note") -> list[str]:
    value = normalize(output)
    match = re.fullmatch(r"```(?:text)?\n(.*?)\n```(?:\n\n([^\n]+))?", value, re.DOTALL)
    if not match:
        return ["must contain one fenced note, with only an allowed result line outside it"]
    body, suffix = match.groups()
    errors = []
    if kind == "correction":
        if not suffix or not suffix.startswith("Route: "):
            errors.append("correction must have one Route line outside the fence")
    elif kind == "post":
        if not suffix:
            errors.append("post fixture must include one post-result line")
    elif suffix:
        errors.append("ordinary note must not have commentary outside the fence")

    lines = body.split("\n")
    if len(lines) != 9:
        errors.append(f"must contain five fields with four blank separators ({len(lines)} lines found)")
    for index, label in enumerate(LABELS):
        position = index * 2
        prefix = f"{label}: "
        if position >= len(lines):
            errors.append(f"missing {label}")
        elif not lines[position].startswith(prefix):
            errors.append(f"field {index + 1} must start with '{prefix}'")
        elif not lines[position][len(prefix):].strip():
            errors.append(f"{label} cannot be empty")
    for position in (1, 3, 5, 7):
        if position < len(lines) and lines[position] != "":
            errors.append(f"line {position + 1} must be blank")
    if "—" in body or "–" in body:
        errors.append("note body must not contain an em dash or en dash")
    # Mentioning completed Slack work or including its permalink is allowed.
    # A separate Slack draft still fails the one-fence/five-field boundaries.
    return errors


def validate_case(case: dict, output: str, operations: list[str] | None = None) -> list[str]:
    kind = case["kind"]
    value = normalize(output)
    if kind == "warmup":
        errors = [] if value == "Ready when you are." else ["warm-up response does not match exactly"]
    else:
        errors = validate_note(value, kind)
    if kind in {"warmup", "note"} and value != normalize(case["expected"]):
        errors.append("output does not match the golden expected wording")
    for phrase in case.get("required_phrases", []):
        if phrase not in value:
            errors.append(f"must contain '{phrase}'")
    for label, phrases in case.get("required_field_phrases", {}).items():
        matches = re.findall(r"^" + re.escape(label) + r": (.*)$", value, re.MULTILINE)
        for phrase in phrases:
            if len(matches) != 1 or phrase not in matches[0]:
                errors.append(f"{label} must contain '{phrase}'")
    for phrase in case.get("forbidden_phrases", []):
        if phrase.lower() in value.lower():
            errors.append(f"must not contain '{phrase}' for this case")
    for url in case.get("expected_urls", []):
        # Match a full URL, not a prefix of a longer/different URL.
        urls = re.findall(r"https?://[^\s<>]+", value)
        if urls.count(url) != 1:
            errors.append(f"must preserve URL exactly once: {url}")
    if "expected_operations" in case:
        if operations is None:
            errors.append("operation trace required; note text cannot verify posting authorization")
        elif operations != case["expected_operations"]:
            errors.append("operation trace does not match authorized operations")
    return errors


def load_records(path: Path, field: str) -> list[dict]:
    records = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError(f"{path.name}: expected a JSON array")
    seen = set()
    for record in records:
        if not isinstance(record, dict) or not isinstance(record.get("id"), str):
            raise ValueError(f"{path.name}: each record needs a string id")
        if record["id"] in seen:
            raise ValueError(f"{path.name}: duplicate id {record['id']}")
        seen.add(record["id"])
        if not isinstance(record.get(field), str):
            raise ValueError(f"{record['id']}: {field} must be supplied as text")
        for key in ("operations", "expected_operations"):
            if key in record and (
                not isinstance(record[key], list)
                or any(not isinstance(op, str) for op in record[key])
            ):
                raise ValueError(f"{record['id']}: {key} must be an array of operation names")
    return records


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cases", type=Path, default=Path(__file__).parents[1] / "tests" / "golden_cases.json")
    parser.add_argument("--outputs", type=Path, help="JSON array: id, output, optional operations trace")
    parser.add_argument("--allow-partial", action="store_true", help="explicitly permit missing candidate cases")
    args = parser.parse_args()
    try:
        if args.allow_partial and not args.outputs:
            raise ValueError("--allow-partial requires --outputs")
        cases = load_records(args.cases, "expected")
        if not cases:
            raise ValueError("no cases supplied")
        if any(case.get("kind") not in KINDS for case in cases):
            raise ValueError("unknown case kind")
        supplied = load_records(args.outputs, "output") if args.outputs else []
        outputs = {item["id"]: item for item in supplied}
        unknown = set(outputs) - {case["id"] for case in cases}
        if unknown:
            raise ValueError("unknown output ids: " + ", ".join(sorted(unknown)))
        if args.outputs and not outputs:
            raise ValueError("no candidate outputs supplied")
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"ERROR: {error}")
        return 2

    failures = checked = missing = 0
    print("Candidate-output checks" if args.outputs else "Fixture checks only (no model or live tool run)")
    for case in cases:
        case_id = case["id"]
        if args.outputs and case_id not in outputs:
            missing += 1
            if args.allow_partial:
                print(f"NOT VERIFIED {case_id}: no candidate output supplied")
            else:
                failures += 1
                print(f"FAIL {case_id}: missing candidate output")
            continue
        item = outputs[case_id] if args.outputs else {
            "output": case["expected"], "operations": case.get("expected_operations"),
        }
        errors = validate_case(case, item["output"], item.get("operations"))
        checked += 1
        if errors:
            failures += 1
            print(f"FAIL {case_id}: " + "; ".join(errors))
        else:
            print(f"PASS {case_id}")
    print(f"Checked {checked}; failed {failures}; missing {missing}.")
    if not args.outputs:
        print("Model behavior, real operation receipts, and Router latency: Not verified.")
    elif missing:
        print("Partial sample only; missing cases remain Not verified.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
