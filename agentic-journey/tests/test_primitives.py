"""One runnable check per primitive rule. Run: docker compose exec app pytest -q"""
import pathlib
import re

import pytest

APP = pathlib.Path(__file__).resolve().parent.parent / "app"


def test_one_call_path():
    """Only agent.py may construct a model client. A second path opts out of every guardrail."""
    offenders = [
        p.name
        for p in APP.glob("*.py")
        if p.name != "agent.py" and re.search(r"AsyncOpenAI\(|openai\.OpenAI\(|OpenAIChatModel\(", p.read_text(encoding="utf-8"))
    ]
    assert offenders == [], f"raw model client outside agent.py: {offenders}"


def test_caller_cannot_supply_scope():
    from app.main import ChatIn

    assert "scope" not in ChatIn.model_fields
    assert "scope_path" not in ChatIn.model_fields


def test_prompts_are_versioned():
    from app.hooks import read_prompt

    for name in ("journey", "verifier"):
        version, text = read_prompt(name)
        assert version.isdigit() and text


def test_approval_gate_covers_the_write_tool():
    from app import tools

    assert "publish_note" in tools.APPROVAL_REQUIRED


mongo = pytest.importorskip("pymongo")


@pytest.fixture
def mem():
    from app import memory

    try:
        memory.db.command("ping")
    except Exception:
        pytest.skip("mongo not reachable")
    memory.facts.delete_many({})
    memory.episodes.delete_many({})
    memory.init_indexes()
    return memory


def test_newer_fact_supersedes(mem):
    from app.identity import resolve

    ident = resolve("demo")
    mem.write_fact(ident, "grade", "7")
    mem.write_fact(ident, "grade", "8")
    assert mem.retrieve(ident)["grade"] == "8"
    assert mem.facts.count_documents({"key": "grade", "superseded_by": None}) == 1


def test_scope_isolation(mem):
    from app.identity import resolve

    demo, other = resolve("demo"), resolve("other")
    mem.write_fact(demo, "secret", "demo-only")
    mem.write_fact(resolve("system"), "banner", "org-wide")
    assert mem.retrieve(demo) == {"secret": "demo-only", "banner": "org-wide"}
    assert mem.retrieve(other) == {"banner": "org-wide"}  # no leak across the sibling scope


def test_promotion_moves_a_fact_up(mem):
    from app.identity import resolve

    ident = resolve("demo")
    mem.write_fact(ident, "term", "T3")
    fact = mem.facts.find_one({"key": "term"})
    mem.score_fact(fact["_id"], 0.5)
    assert mem.facts.find_one({"_id": fact["_id"]})["scope_key"] == "a4i/south/school-12"


def test_episodes_have_a_retention_policy(mem):
    idx = mem.episodes.index_information()
    assert any("expireAfterSeconds" in spec for spec in idx.values())


def test_pool_placement_is_stable_across_restarts():
    """A salted hash would remap actors to pools on every process start."""
    from app import sandbox

    assert "zlib.crc32" in (APP / "sandbox.py").read_text(encoding="utf-8")
    a = sandbox.pool_for("actor-demo:2026-01-01").index
    b = sandbox.pool_for("actor-demo:2026-09-06").index
    assert a == b


def test_sandbox_limits_are_enforced():
    """Cooldown, hard lifetime, and a per-pool session ceiling all exist."""
    import time

    from app import config, sandbox

    now = time.time()
    assert sandbox._expired(sandbox.Entry(None, now, now), now) is None
    assert sandbox._expired(sandbox.Entry(None, now - config.SANDBOX_COOLDOWN_SECONDS - 1, now), now)
    assert sandbox._expired(sandbox.Entry(None, now, now - config.SANDBOX_MAX_LIFETIME_SECONDS - 1), now)


def test_a_scope_level_cannot_name_another_actors_chain():
    """shared_with picks a level, never an arbitrary scope: it can only widen along your own chain."""
    from app.identity import resolve

    priya = resolve("priya")
    assert priya.scope_at("school") == ["a4i", "south", "school-12"]
    assert priya.scope_at("tenant") == ["a4i"]
    assert priya.scope_at("actor") == priya.scope_path


def test_widening_beyond_a_school_needs_a_person():
    from app import tools

    class Def:
        name = "remember"

    assert tools.needs_approval(None, Def(), {"shared_with": "tenant"})
    assert tools.needs_approval(None, Def(), {"shared_with": "region"})
    assert not tools.needs_approval(None, Def(), {"shared_with": "school"})
    assert not tools.needs_approval(None, Def(), {})


def test_one_command_at_a_time_per_workspace():
    """Concurrent tool calls share one sandbox; a read must not overtake its own write."""
    from app import sandbox

    src = (APP / "sandbox.py").read_text(encoding="utf-8")
    assert "_lock_for" in src and "async with _lock_for" in src
    assert sandbox._lock_for("a:1") is sandbox._lock_for("a:1")
    assert sandbox._lock_for("a:1") is not sandbox._lock_for("b:1")


def test_a_fact_can_have_a_shelf_life(mem):
    """Volatile shared state expires; a durable fact never does."""
    from datetime import datetime, timedelta, timezone

    from app.identity import resolve

    priya = resolve("priya")
    mem.write_fact(priya, "lab_microscopes", "12", scope_path=priya.scope_at("school"))
    mem.write_fact(priya, "weather", "raining", scope_path=priya.scope_at("region"), ttl_hours=6)

    rows = {r["key"]: r for r in mem.retrieve_rows(priya)}
    assert rows["lab_microscopes"]["expires_at"] is None
    assert rows["weather"]["expires_at"] and rows["weather"]["level"] == "region"

    # once the window passes the fact is not served, whether or not the TTL monitor has run
    mem.facts.update_one(
        {"key": "weather"},
        {"$set": {"valid_until": datetime.now(timezone.utc) - timedelta(minutes=1)}},
    )
    assert "weather" not in {r["key"] for r in mem.retrieve_rows(priya)}
    assert "lab_microscopes" in {r["key"] for r in mem.retrieve_rows(priya)}


def test_pools_scale_out_and_retire_without_moving_work():
    """Machines come and go with demand; a running session never moves."""
    import time

    from app import config, sandbox

    saved = (config.SANDBOX_AUTOSCALE, config.SANDBOX_MAX_CONCURRENT, list(sandbox._pools))
    try:
        config.SANDBOX_AUTOSCALE = True
        config.SANDBOX_MAX_CONCURRENT = 4
        sandbox._pools[:] = [sandbox.Pool(0)]

        assert sandbox.scale_decision() == "in" or len(sandbox._pools) == 1  # idle, one pool: nothing to do
        for i in range(3):                                    # 3 of 4 slots -> 75%
            sandbox._pools[0].bound[f"a{i}:s"] = sandbox.Entry(None, time.time(), time.time())
        assert sandbox.scale_decision() == "out"

        sandbox._pools.append(sandbox.Pool(1))                # capacity doubled -> pressure gone
        assert sandbox.scale_decision() is None

        # a session already bound stays in its pool even though the hash now points elsewhere
        held = sandbox.pool_for("a0:s")
        assert held is sandbox._pools[0]

        # retiring a pool stops placement into it but strands nobody
        sandbox._pools[1].accepting = False
        assert sandbox.pool_for("brand-new-actor:s") is sandbox._pools[0]
        assert sandbox.pool_for("a0:s") is sandbox._pools[0]

        # with only one pool still accepting there is nothing left to retire
        sandbox._pools[0].bound.clear()
        assert sandbox.scale_decision() is None

        # bring the second pool back and the idle fleet sheds one
        sandbox._pools[1].accepting = True
        assert sandbox.scale_decision() == "in"
        assert sandbox._retire_candidate() is sandbox._pools[1]  # the emptier of the two
    finally:
        config.SANDBOX_AUTOSCALE, config.SANDBOX_MAX_CONCURRENT = saved[0], saved[1]
        sandbox._pools[:] = saved[2]
