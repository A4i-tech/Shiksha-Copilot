"""End-to-end turn wiring, on a fake model so it runs with no API key and no cost."""
import asyncio

import pytest
from pydantic_ai.models.test import TestModel

from app import journey, memory, subagents
from app.identity import resolve
from app.subagents import Verdict


@pytest.fixture(autouse=True)
def fake_model(monkeypatch):
    try:
        memory.db.command("ping")
    except Exception:
        pytest.skip("mongo not reachable")
    memory.facts.delete_many({})
    memory.episodes.delete_many({})
    memory.db.approvals.delete_many({})
    memory.init_indexes()
    monkeypatch.setattr("app.agent._model", lambda name: TestModel(call_tools=["recall"]))
    monkeypatch.setattr(subagents, "verify", _verdict(True, ""))
    monkeypatch.setattr(journey.subagents, "verify", _verdict(True, ""))


def _verdict(ok: bool, reason: str):
    async def _v(question, answer, deps):
        return Verdict(ok=ok, reason=reason)

    return _v


def test_turn_answers_and_persists_the_episode():
    ident = resolve("demo")
    out = asyncio.run(journey.run_turn(ident, "hello", session_id="actor-demo:t-ok"))
    assert out["status"] == "ok"
    assert memory.load_episode("actor-demo:t-ok")["messages"]


def test_high_consequence_tool_waits_for_a_person(monkeypatch):
    monkeypatch.setattr("app.agent._model", lambda name: TestModel(call_tools=["publish_note"]))
    ident = resolve("demo")
    out = asyncio.run(journey.run_turn(ident, "publish it", session_id="actor-demo:t-approve"))
    assert out["status"] == "approval_required"
    assert out["calls"][0]["tool_name"] == "publish_note"
    # nothing was written before a person decided
    assert not any(k.startswith("note:") for k in memory.retrieve(ident))

    denied = asyncio.run(journey.resume_with_approval(ident, "actor-demo:t-approve", approve=False, reason="no"))
    assert denied["status"] in {"ok", "degraded"}
    assert not any(k.startswith("note:") for k in memory.retrieve(ident))


def test_a_rejected_answer_is_never_returned_as_success(monkeypatch):
    monkeypatch.setattr(journey.subagents, "verify", _verdict(False, "unsupported claim"))
    out = asyncio.run(journey.run_turn(resolve("demo"), "hello", session_id="actor-demo:t-bad"))
    assert out["status"] == "degraded"


def test_a_session_id_is_not_a_capability():
    """One sandbox, one actor: a caller cannot attach to another actor's session."""
    from fastapi import HTTPException

    asyncio.run(journey.run_turn(resolve("demo"), "hello", session_id="actor-demo:shared"))
    try:
        asyncio.run(journey.run_turn(resolve("other"), "what did they say", session_id="actor-demo:shared"))
    except HTTPException as exc:
        assert exc.status_code == 403
    else:
        raise AssertionError("a foreign session id was accepted")
