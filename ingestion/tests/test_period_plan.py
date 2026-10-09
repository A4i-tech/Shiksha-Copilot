import asyncio
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import period_plan_steps as steps  # noqa: E402

PIPELINE = yaml.safe_load((ROOT / "period_plan.yaml").read_text(encoding="utf-8"))
CONFIG = PIPELINE["steps"][-1]["config"]
INDEX = "qdrant/BSE-TG/chapter_id:Medium=english,Grade=6,Subject=science,Number=1"


class FakeLLM:
    def __init__(self, reply=None):
        self.reply = reply or (lambda prompt, kw: f"text for {prompt[:40]}")
        self.prompts, self.kwargs, self.embedded = [], [], []
        self.chat = SimpleNamespace(completions=SimpleNamespace(create=self._create))
        self.embeddings = SimpleNamespace(create=self._embed)

    async def _create(self, model, messages, **kw):
        self.prompts.append(messages[-1]["content"])
        self.kwargs.append(kw)
        content = self.reply(messages[-1]["content"], kw)
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=content))])

    async def _embed(self, model, input):
        self.embedded.append(input)
        return SimpleNamespace(data=[SimpleNamespace(embedding=[0.1, 0.2])])


class FakeQdrant:
    def __init__(self, texts=("passage one", "passage two")):
        self.texts, self.scrolls, self.queries = list(texts), [], []

    async def scroll(self, **kw):
        self.scrolls.append(kw)
        return ([object()] if self.texts else []), None

    async def query_points(self, **kw):
        self.queries.append(kw)
        return SimpleNamespace(points=[SimpleNamespace(payload={"text": t}) for t in self.texts])


@pytest.fixture
def conn(monkeypatch):
    real_sleep = asyncio.sleep
    monkeypatch.setattr(asyncio, "sleep", lambda _: real_sleep(0))
    posted, saved = [], {}

    async def post(status):
        posted.append(status)

    steps.CONN = steps.Connections(FakeQdrant(), FakeLLM(), post, saved.__contains__, saved.__setitem__)
    steps.CONN.posted, steps.CONN.saved = posted, saved
    return steps.CONN


def graph(**kw):
    return steps.SectionGraph.model_validate({**CONFIG, "model": "m", "webhook": True, "force_mode": "", "concurrency": 1, "retrieve": {"embed_model": "e"}, **kw})


def section(sid, deps=(), mode="gpt", fmt=None):
    return {"id": sid, "title": sid.upper(), "description": f"Describe {sid} in detail.", "mode": mode, "dependencies": [{"section_id": d} for d in deps], "output_format": fmt}


def payload(sections, **kw):
    return {
        "_id": "plan-1",
        "workflow": {"_id": "wf", "sections": sections},
        "chapter_info": {"id": "ch", "index_path": INDEX, "chapter_title": "Light"},
        "lp_level": "SUBTOPIC",
        "subtopics": ["Reflection"],
        "learning_outcomes": ["Explain reflection"],
        **kw,
    }


def run_plan(step, raw):
    return asyncio.run(step._plan(raw))


def test_dependency_order_and_dependency_outputs(conn):
    conn.llm.reply = lambda p, kw: "A-OUT" if "'A'" in p else "B-OUT" if "'B'" in p else "C-OUT"
    result = run_plan(graph(), payload([section("c", ["b"]), section("b", ["a"]), section("a")]))
    assert result["status"] == "completed"
    order = [next(t for t in "ABC" if f"'{t}' section" in p) for p in conn.llm.prompts]
    assert order == ["A", "B", "C"]
    assert "A-OUT" in conn.llm.prompts[1] and "B-OUT" in conn.llm.prompts[2]
    assert [s["section_id"] for s in result["plan"]["sections"]] == ["c", "b", "a"]
    assert result["plan"]["_id"] == "plan-1"


def test_independent_sections_run_in_parallel():
    async def go():
        barrier = asyncio.Barrier(2)

        async def generate(key, deps):
            await asyncio.wait_for(barrier.wait(), 1)
            return key

        nodes = {k: steps.Node(k, "gpt", []) for k in "ab"}
        await steps.run_graph(nodes, generate)
        return nodes

    assert {k: n.out for k, n in asyncio.run(go()).items()} == {"a": "a", "b": "b"}


def test_cycle_raises_clear_error():
    nodes = {"a": steps.Node("a", "gpt", ["b"]), "b": steps.Node("b", "gpt", ["a"])}
    with pytest.raises(ValueError, match="cycle in the workflow dependencies"):
        asyncio.run(steps.run_graph(nodes, lambda k, d: asyncio.sleep(0)))


def test_cycle_fails_plan_and_posts_failed(conn):
    result = run_plan(graph(), payload([section("a", ["b"]), section("b", ["a"])]))
    assert result["status"] == "failed" and "cycle" in result["error"]
    assert [p["status"] for p in conn.posted] == ["PENDING", "RUNNING", "FAILED"]
    assert conn.llm.prompts == []


def test_start_from_section_id_fills_dependencies_and_generates_the_rest(conn):
    conn.llm.reply = lambda p, kw: "NEW"
    raw = payload(
        [section("a"), section("b", ["a"]), section("c", ["b"])],
        start_from_section_id="b",
        lesson_plan={"sections": [{"section_id": "a", "section_title": "A", "content": "OLD-A"}]},
    )
    result = run_plan(graph(), raw)
    assert result["status"] == "completed"
    assert len(conn.llm.prompts) == 2 and "OLD-A" in conn.llm.prompts[0]
    assert "regenerating" not in conn.llm.prompts[0]
    assert {s["section_id"]: s["content"] for s in result["plan"]["sections"]} == {"a": "OLD-A", "b": "NEW", "c": "NEW"}


def test_start_from_section_id_needs_dependency_content(conn):
    raw = payload([section("a"), section("b", ["a"])], start_from_section_id="b", lesson_plan={"sections": []})
    result = run_plan(graph(), raw)
    assert result["status"] == "failed" and "Missing dependency content" in result["error"]


def test_start_from_unknown_section_fails(conn):
    raw = payload([section("a")], start_from_section_id="zzz", lesson_plan={"sections": []})
    assert "not found in workflow" in run_plan(graph(), raw)["error"]


def test_regen_mode_sends_previous_content_and_feedback(conn):
    conn.llm.reply = lambda p, kw: "REGEN"
    raw = payload(
        [section("a")],
        lesson_plan={"sections": [{"section_id": "a", "section_title": "A", "content": {"k": "old body"}, "regen_feedback": "make it shorter"}]},
    )
    result = run_plan(graph(), raw)
    prompt = conn.llm.prompts[0]
    assert "regenerating the 'A' section" in prompt
    assert "old body" in prompt and "make it shorter" in prompt
    assert [s["section_id"] for s in result["plan"]["sections"]] == ["a"]
    assert result["plan"]["sections"][0]["content"] == "REGEN"


def test_regen_without_feedback_still_sends_previous_content(conn):
    raw = payload([section("a")], lesson_plan={"sections": [{"section_id": "a", "section_title": "A", "content": "kept body"}]})
    run_plan(graph(), raw)
    assert "kept body" in conn.llm.prompts[0]


def test_prompt_variables_are_substituted_and_unknown_removed(conn):
    raw = payload([{**section("a"), "description": "Teach ${TOPIC} then ${MISSING}x"}], prompt_variables={"TOPIC": "mirrors"})
    run_plan(graph(), raw)
    assert "Teach mirrors then x" in conn.llm.prompts[0]


def test_english_resource_plan_uses_resource_prompt(conn):
    run_plan(graph(), payload([section("a")], lp_level="TELANGANA_ENGLISH_RESOURCE_PLAN", lp_type_english="PROSE"))
    assert "resource plan for english subject" in conn.llm.prompts[0]


@pytest.mark.parametrize(
    "text, expected",
    [
        ('```json\n{"a": 1}\n```', {"a": 1}),
        ('```\n{"a": 1}\n```', {"a": 1}),
        ('{"a": 1}', {"a": 1}),
        ('```json\n{"j": "sjon"}\n```', {"j": "sjon"}),
        ("# Markdown body", "# Markdown body"),
        ("```json\nnot json\n```", "```json\nnot json\n```"),
    ],
)
def test_json_fence_parsing(text, expected):
    assert steps.parse_json(text) == expected


def test_gpt_mode_returns_parsed_json(conn):
    conn.llm.reply = lambda p, kw: '```json\n{"title": "x"}\n```'
    result = run_plan(graph(), payload([section("a", fmt={"type": "object"})]))
    assert result["plan"]["sections"][0]["content"] == {"title": "x"}
    assert conn.llm.kwargs[0] == {"temperature": 0}


def test_rag_mode_filters_by_chapter_and_uses_top_k(conn):
    def reply(prompt, kw):
        return "generated query" if "retrieval specialist" in prompt else '{"ok": true}'

    conn.llm.reply = reply
    result = run_plan(graph(), payload([section("a", mode="rag", fmt={"type": "object"})]))
    assert result["plan"]["sections"][0]["content"] == {"ok": True}
    query = conn.qdrant.queries[0]
    assert query["collection_name"] == "BSE-TG" and query["limit"] == 10 and query["using"] == "text-dense"
    assert query["query_filter"].must[0].key == "chapter_id"
    assert query["query_filter"].must[0].match.value == "Medium=english,Grade=6,Subject=science,Number=1"
    assert conn.llm.embedded == ["generated query"]
    answer_prompt = conn.llm.prompts[-1]
    assert "passage one\n\npassage two" in answer_prompt
    assert conn.llm.kwargs[-1]["response_format"] == {"type": "json_object"}


def test_rag_falls_back_when_query_generation_fails(conn):
    def reply(prompt, kw):
        if "retrieval specialist" in prompt:
            raise RuntimeError("llm down")
        return "answer"

    conn.llm.reply = reply
    result = run_plan(graph(), payload([section("a", mode="rag")]))
    assert result["status"] == "completed"
    assert conn.llm.embedded[0].startswith("Describe a in detail.")


def test_rag_without_matching_data_fails_plan(conn):
    conn.qdrant.texts = []
    result = run_plan(graph(), payload([section("a", mode="rag")]))
    assert result["status"] == "failed" and "No data matches" in result["error"]


def test_rag_retries_empty_answer_then_succeeds(conn):
    answers = iter(["", "second try"])
    conn.llm.reply = lambda p, kw: "q" if "retrieval specialist" in p else next(answers)
    result = run_plan(graph(), payload([section("a", mode="rag")]))
    assert result["plan"]["sections"][0]["content"] == "second try"


def test_force_mode_overrides_section_mode(conn):
    run_plan(graph(force_mode="gpt"), payload([section("a", mode="rag")]))
    assert conn.qdrant.queries == []


def test_webhook_failure_does_not_raise(conn):
    async def broken(status):
        raise ConnectionError("receiver down")

    conn.post_status = broken
    result = run_plan(graph(), payload([section("a")]))
    assert result["status"] == "completed"


def test_webhook_statuses_on_success(conn):
    run_plan(graph(), payload([section("a")]))
    assert [p["status"] for p in conn.posted] == ["PENDING", "RUNNING", "COMPLETED"]
    assert conn.posted[-1]["output"]["_id"] == "plan-1" and conn.posted[0]["instance_id"] == "plan-1"


def test_webhook_off_posts_nothing(conn):
    run_plan(graph(webhook=False), payload([section("a")]))
    assert conn.posted == []


def test_finished_plan_is_skipped(conn):
    conn.saved["plan-1"] = {}
    result = run_plan(graph(), payload([section("a")]))
    assert result == {"status": "skipped"} and conn.llm.prompts == []


def test_additional_context_is_summarized_once(conn):
    long_text = "x" * 150
    conn.llm.reply = lambda p, kw: "SUMMARY" if "Provide a structured summary" in p else "out"
    run_plan(graph(), payload([section("a"), section("b")], additional_context=long_text))
    assert sum("Provide a structured summary" in p for p in conn.llm.prompts) == 1
    assert all("SUMMARY" in p for p in conn.llm.prompts if "Provide a structured summary" not in p)


def test_run_reports_plans_and_requires_payloads(conn):
    step = graph()
    ctx = SimpleNamespace(metadata={"payloads": [payload([section("a")]), payload([section("a", ["zz"])]) | {"_id": "plan-2"}]})
    result = asyncio.run(step.run(ctx))
    assert result.status.value == "success"
    assert {k: v["status"] for k, v in ctx.metadata["lesson_plans"].items()} == {"plan-1": "completed", "plan-2": "failed"}
    assert asyncio.run(step.run(SimpleNamespace(metadata={}))).status.value == "failure"


def test_yaml_config_builds_the_registered_steps():
    from omni_ingest.core.pipeline import create_pipeline_from_config, register_step

    register_step("section_graph", steps.SectionGraph, override=True)
    runner = create_pipeline_from_config(ROOT / "period_plan.yaml", config_args={"workflow_template": "{}", "model": "gpt-x", "top_k": 4, "force_mode": "gpt"})
    step = runner.steps[-1]
    assert isinstance(step, steps.SectionGraph)
    assert (step.model, step.force_mode, step.webhook, step.concurrency) == ("gpt-x", "gpt", True, 1)
    assert (step.retrieve.top_k, step.retrieve.vector_name, step.retrieve.embed_model) == (4, "text-dense", PIPELINE["parameters"]["properties"]["embed_model"]["default"])


def test_strict_json_failure_names_section_and_fails_plan(conn):
    conn.llm.reply = lambda p, kw: "not json at all"
    result = run_plan(graph(), payload([section("a", fmt={"type": "object"})]))
    assert result["status"] == "failed" and "'a'" in result["error"]
    assert [p["status"] for p in conn.posted] == ["PENDING", "RUNNING", "FAILED"]


def test_created_at_from_payload_is_used(conn):
    result = run_plan(graph(), payload([section("a")], created_at=123))
    assert result["plan"]["created_at"] == 123


def test_atomic_save_leaves_no_partial_file(tmp_path, monkeypatch):
    import period_plan_runner as runner

    monkeypatch.setenv("AZURE_OPENAI_API_BASE", "https://example.invalid")
    monkeypatch.setenv("AZURE_OPENAI_API_KEY", "k")
    real = Path.write_text

    def crash(self, data, *a, **kw):
        real(self, data[:5], *a, **kw)
        raise OSError("disk full")

    monkeypatch.setattr(Path, "write_text", crash)
    c = runner.connect(tmp_path)
    with pytest.raises(OSError):
        c.save("plan-1", {"a": 1})
    assert not c.is_done("plan-1")


def test_empty_qdrant_hits_raise(conn):
    async def none(**kw):
        return SimpleNamespace(points=[])

    conn.qdrant.query_points = none
    with pytest.raises(ValueError, match="no passages for " + INDEX):
        asyncio.run(graph().retrieve.search(INDEX, "q"))


def test_missing_dependency_id_names_both_ids(conn):
    result = run_plan(graph(), payload([section("a", ["zz"])]))
    assert result["status"] == "failed" and "'a'" in result["error"] and "'zz'" in result["error"]


def test_short_additional_context_is_returned_unchanged(conn):
    assert asyncio.run(graph()._summarize("short note")) == "short note"
    assert conn.llm.prompts == []


@pytest.mark.parametrize(
    "query, expected",
    [
        ("Query: find light", "find light"),
        ("Retrieval Query:   reflection of light", "reflection of light"),
        ("a" * 10 + ". " + "b" * 30, "a" * 10 + ". " + "b" * 30),
        ("", ValueError),
        ("   ", ValueError),
    ],
)
def test_clean_query_prefix_and_empty(query, expected):
    if expected is ValueError:
        with pytest.raises(ValueError):
            steps.clean_query(query)
    else:
        assert steps.clean_query(query) == expected


def test_clean_query_cuts_at_period_comma_or_space():
    head = "w" * 15
    assert steps.clean_query(head + ". " + "x" * 10 + " tail", limit=20) == head + "."
    assert steps.clean_query(head + ", " + "x" * 10 + " tail", limit=20) == head
    assert steps.clean_query(head + " " + "x" * 10 + " tail", limit=20) == head
