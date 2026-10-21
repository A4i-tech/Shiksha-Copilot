import asyncio
import sys
from contextlib import contextmanager
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import period_plan_tracing as tracing  # noqa: E402
from test_period_plan import conn, graph, payload, section  # noqa: E402,F401


class FakeSpan:
    def __init__(self, name, input):
        self.name, self.input, self.trace, self.output = name, input, {}, None

    def update_trace(self, **fields):
        self.trace = fields

    def update(self, **fields):
        self.output = fields["output"]


class FakeLangfuse:
    def __init__(self):
        self.spans, self.flushed = [], 0

    @contextmanager
    def start_as_current_span(self, name, input):
        span = FakeSpan(name, input)
        self.spans.append(span)
        yield span

    def flush(self):
        self.flushed += 1


@pytest.fixture
def langfuse(monkeypatch):
    client = FakeLangfuse()
    monkeypatch.setattr(tracing, "get_client", lambda: client)
    monkeypatch.setenv("LANGFUSE_PUBLIC_KEY", "pk")
    monkeypatch.setenv("LANGFUSE_SECRET_KEY", "sk")
    return client


def run_plan(raw):
    return asyncio.run(graph()._plan(raw))


def test_a_plan_run_is_traced_with_one_span_per_section(conn, langfuse):
    result = run_plan(payload([section("a"), section("b", ["a"])], user_id="teacher-1"))
    assert result["status"] == "completed"
    plan, *sections = langfuse.spans
    assert plan.name == "Shiksha-LP" and plan.trace == {"user_id": "teacher-1", "tags": ["flow:lesson-plan"]}
    assert plan.output == {"status": "completed", "error": None}
    assert [s.name for s in sections] == ["section:a", "section:b"]
    assert all(s.output for s in sections)
    assert langfuse.flushed == 1


def test_a_failed_plan_records_the_error(conn, langfuse):
    result = run_plan(payload([section("a", ["missing"])]))
    assert result["status"] == "failed"
    assert langfuse.spans[0].output["status"] == "failed" and "missing" in langfuse.spans[0].output["error"]


def test_tracing_does_nothing_without_keys(conn, monkeypatch):
    monkeypatch.setattr(tracing, "get_client", lambda: pytest.fail("Langfuse was called without keys"))
    monkeypatch.delenv("LANGFUSE_PUBLIC_KEY", raising=False)
    assert run_plan(payload([section("a")]))["status"] == "completed"


def test_tracing_does_nothing_when_langfuse_is_not_installed(conn, monkeypatch):
    monkeypatch.setattr(tracing, "get_client", None)
    monkeypatch.setenv("LANGFUSE_PUBLIC_KEY", "pk")
    monkeypatch.setenv("LANGFUSE_SECRET_KEY", "sk")
    assert tracing.enabled() is False
    assert run_plan(payload([section("a")]))["status"] == "completed"
