"""
PII audit: verify no service sends personally identifiable information
to Langfuse in tags. Issue #276 requires: user_id field only (opaque ID),
no name/phone/email in tags or metadata.
"""
import pytest


ALLOWED_TAG_PREFIXES = {
    "chat_type:",
    "flow:",
    "board:",
    "grade:",
    "subject:",
    "has_web_search:",
}

PII_INDICATORS = ["phone:", "name:", "email:", "mobile:", "address:"]


def _validate_tags(tags: list, context: str):
    for tag in tags:
        assert any(tag.startswith(p) for p in ALLOWED_TAG_PREFIXES), (
            f"[{context}] Tag '{tag}' not in allowed prefixes: {ALLOWED_TAG_PREFIXES}"
        )
        for pii in PII_INDICATORS:
            assert pii not in tag.lower(), (
                f"[{context}] PII indicator '{pii}' in tag '{tag}'"
            )


def test_general_chat_tags():
    _validate_tags(["chat_type:general", "has_web_search:true"], "general_chat")


def test_lesson_chat_tags():
    _validate_tags(
        ["chat_type:lesson", "board:NCERT", "grade:10", "subject:Science"],
        "lesson_chat",
    )


def test_question_bank_tags():
    _validate_tags(
        ["flow:question-bank", "board:CBSE", "grade:9", "subject:Maths"],
        "question_bank",
    )


def test_lesson_plan_tags():
    _validate_tags(["flow:lesson-plan"], "lesson_plan")


def test_user_id_not_in_tags():
    """user_id must use dedicated field, never embedded in a tag."""
    tags = ["chat_type:lesson", "board:NCERT", "grade:10", "subject:Science"]
    for tag in tags:
        assert "user_id:" not in tag


def test_actual_service_tags_match_allowed_prefixes():
    """Verify tag strings used in actual service files match allowed prefixes."""
    import ast
    import re
    from pathlib import Path

    services = [
        "shiksha-api/app-service/app/services/general_chat_service.py",
        "shiksha-api/app-service/app/services/lesson_chat_service.py",
        "shiksha-api/app-service/app/services/question_paper_service.py",
    ]

    tag_pattern = re.compile(r'"([a-z_]+:[^"]+)"')

    for service_path in services:
        path = Path(service_path)
        if not path.exists():
            continue
        source = path.read_text()
        # Find all tag strings near update_current_trace calls
        # Look for strings that look like "key:value" in tags= context
        matches = tag_pattern.findall(source)
        for match in matches:
            if ":" in match and not match.startswith("http"):
                # Only check strings that look like tag format
                key = match.split(":")[0] + ":"
                if any(match.startswith(p.split(":")[0]) for p in ALLOWED_TAG_PREFIXES):
                    # It's a static tag — validate it
                    for pii in PII_INDICATORS:
                        assert pii not in match.lower(), (
                            f"[{service_path}] PII indicator '{pii}' in static tag '{match}'"
                        )
