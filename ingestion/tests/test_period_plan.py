import asyncio
import contextlib
from types import SimpleNamespace

import httpx
import openai
import pytest
from omni_ingest.core.pipeline import create_pipeline_from_config
from pydantic import ValidationError
from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import Distance, PointStruct, VectorParams

import period_plan_steps as steps
from conftest import INDEX, PIPELINE, ROOT, graph, payload, run_plan, section

BACKEND_PAYLOAD = {
    "user_id": "ADMIN",
    "workflow": {
        "_id": "wf-english",
        "name": "English",
        "description": "English plan",
        "sections": [
            {
                "id": "engage",
                "title": "Engage",
                "description": "Engage the class with the chapter.",
                "mode": "gpt",
                "dependencies": [],
                "output_format": None,
            }
        ],
    },
    "lp_id": "lesson-1",
    "lp_level": "CHAPTER",
    "learning_outcomes": ["Read aloud"],
    "lp_type_english": "NONE",
    "chapter_info": {
        "id": (
            "Board=BSE-TG,Medium=english,Grade=6,Subject=English,"
            "Number=2,Title=The Lake"
        ),
        "index_path": (
            "shiksha/data_new_book/BSE-TG/english/6/English/pdf/2/index/pdf_idx"
        ),
        "chapter_title": "The Lake",
    },
    "subtopics": [],
    "lesson_plan": None,
}


def llm_failure():
    return openai.APIConnectionError(
        request=httpx.Request("POST", "http://llm")
    )


def answer_prompts(conn):
    return [p for p in conn.llm.prompts if "retrieval specialist" not in p]


def test_backend_payload_is_accepted():
    inp = steps.LessonPlanGenerationInput.model_validate(BACKEND_PAYLOAD)
    assert inp.lp_id == "lesson-1"
    assert inp.lp_level == steps.LPLevel.CHAPTER
    assert inp.lp_type_english == steps.EnglishLPType.NONE
    assert inp.subtopics == []
    assert inp.lesson_plan is None


def test_payload_needs_a_plan_id():
    raw = payload([section("a")])
    del raw["_id"]
    with pytest.raises(ValidationError, match="lp_id"):
        steps.LessonPlanGenerationInput.model_validate(raw)


def test_lp_id_is_accepted_in_place_of_underscore_id():
    raw = payload([section("a")]) | {"lp_id": "plan-9"}
    del raw["_id"]
    assert steps.LessonPlanGenerationInput.model_validate(raw).lp_id == "plan-9"


def test_subtopic_level_needs_subtopics():
    with pytest.raises(ValidationError, match="Subtopics must be provided"):
        steps.LessonPlanGenerationInput.model_validate(
            payload([section("a")], subtopics=[])
        )


def test_prompt_variables_must_be_text():
    with pytest.raises(ValidationError, match="prompt_variables"):
        steps.LessonPlanGenerationInput.model_validate(
            payload([section("a")], prompt_variables={"TOPIC": 5})
        )


def test_reason_names_the_exception_type_when_the_message_is_empty():
    assert steps.reason(RuntimeError()) == "RuntimeError"
    assert steps.reason(RuntimeError("boom")) == "boom"


def test_dependency_order_and_dependency_outputs(conn):
    conn.llm.reply = lambda p, kw: (
        "A-OUT" if "'A'" in p else "B-OUT" if "'B'" in p else "C-OUT"
    )
    result = run_plan(
        graph(conn),
        payload([section("c", ["b"]), section("b", ["a"]), section("a")]),
    )
    assert result.status == steps.PlanStatus.COMPLETED
    order = [
        next(t for t in "ABC" if f"'{t}' section" in p)
        for p in conn.llm.prompts
    ]
    assert order == ["A", "B", "C"]
    assert "A-OUT" in conn.llm.prompts[1]
    assert "B-OUT" in conn.llm.prompts[2]
    assert [s["section_id"] for s in result.plan["sections"]] == [
        "c",
        "b",
        "a",
    ]
    assert result.plan["_id"] == "plan-1"


def test_independent_sections_run_in_parallel():
    async def go():
        barrier = asyncio.Barrier(2)

        async def generate(key, deps):
            await asyncio.wait_for(barrier.wait(), 1)
            return key

        nodes = {k: steps.Node(k, []) for k in "ab"}
        await steps.run_graph(nodes, generate)
        return nodes

    assert {k: n.out for k, n in asyncio.run(go()).items()} == {
        "a": "a",
        "b": "b",
    }


def test_cycle_raises_clear_error():
    nodes = {
        "a": steps.Node("a", ["b"]),
        "b": steps.Node("b", ["a"]),
    }
    with pytest.raises(ValueError, match="cycle"):
        asyncio.run(steps.run_graph(nodes, lambda k, d: asyncio.sleep(0)))


def test_workflow_cycle_is_rejected_when_the_input_is_validated():
    raw = payload([section("a", ["b"]), section("b", ["a"])])
    with pytest.raises(ValidationError, match="cycle in the workflow"):
        steps.LessonPlanGenerationInput.model_validate(raw)


def test_start_from_section_id_fills_dependencies_and_generates_the_rest(conn):
    conn.llm.reply = lambda p, kw: "NEW"
    raw = payload(
        [section("a"), section("b", ["a"]), section("c", ["b"])],
        start_from_section_id="b",
        lesson_plan={
            "sections": [
                {"section_id": "a", "section_title": "A", "content": "OLD-A"}
            ]
        },
    )
    result = run_plan(graph(conn), raw)
    assert result.status == steps.PlanStatus.COMPLETED
    assert len(conn.llm.prompts) == 2
    assert "OLD-A" in conn.llm.prompts[0]
    assert "regenerating" not in conn.llm.prompts[0]
    assert {s["section_id"]: s["content"] for s in result.plan["sections"]} == {
        "a": "OLD-A",
        "b": "NEW",
        "c": "NEW",
    }


def test_start_from_section_id_needs_dependency_content():
    raw = payload(
        [section("a"), section("b", ["a"])],
        start_from_section_id="b",
        lesson_plan={"sections": []},
    )
    with pytest.raises(ValidationError, match="Missing dependency content"):
        steps.LessonPlanGenerationInput.model_validate(raw)


def test_start_from_unknown_section_fails():
    raw = payload(
        [section("a")],
        start_from_section_id="zzz",
        lesson_plan={"sections": []},
    )
    with pytest.raises(ValidationError, match="not found in workflow"):
        steps.LessonPlanGenerationInput.model_validate(raw)


def test_saved_section_content_may_not_be_null():
    raw = payload(
        [section("a"), section("b", ["a"])],
        start_from_section_id="b",
        lesson_plan={
            "sections": [
                {"section_id": "a", "section_title": "A", "content": None}
            ]
        },
    )
    with pytest.raises(ValidationError, match="no content for sections"):
        steps.LessonPlanGenerationInput.model_validate(raw)


def test_regen_mode_sends_previous_content_and_feedback(conn):
    conn.llm.reply = lambda p, kw: "REGEN"
    raw = payload(
        [section("a")],
        lesson_plan={
            "sections": [
                {
                    "section_id": "a",
                    "section_title": "A",
                    "content": {"k": "old body"},
                    "regen_feedback": "make it shorter",
                }
            ]
        },
    )
    result = run_plan(graph(conn), raw)
    prompt = conn.llm.prompts[0]
    assert "regenerating the 'A' section" in prompt
    assert "old body" in prompt
    assert "make it shorter" in prompt
    assert [s["section_id"] for s in result.plan["sections"]] == ["a"]
    assert result.plan["sections"][0]["content"] == "REGEN"


def test_regen_without_feedback_still_sends_previous_content(conn):
    raw = payload(
        [section("a")],
        lesson_plan={
            "sections": [
                {
                    "section_id": "a",
                    "section_title": "A",
                    "content": "kept body",
                }
            ]
        },
    )
    run_plan(graph(conn), raw)
    assert "kept body" in conn.llm.prompts[0]


def test_prompt_variables_are_substituted(conn):
    raw = payload(
        [{**section("a"), "description": "Teach ${TOPIC} now"}],
        prompt_variables={"TOPIC": "mirrors"},
    )
    run_plan(graph(conn), raw)
    assert "Teach mirrors now" in conn.llm.prompts[0]


def test_unknown_placeholder_fails_the_plan(conn):
    raw = payload(
        [{**section("a"), "description": "Teach ${TOPIC} then ${MISSING}x"}],
        prompt_variables={"TOPIC": "mirrors"},
    )
    result = run_plan(graph(conn), raw)
    assert result.status == steps.PlanStatus.FAILED
    assert "MISSING" in result.error
    assert conn.posted[-1]["status"] == "FAILED"


def test_english_resource_plan_uses_resource_prompt(conn):
    run_plan(
        graph(conn),
        payload(
            [section("a")],
            lp_level="TELANGANA_ENGLISH_RESOURCE_PLAN",
            lp_type_english="PROSE",
        ),
    )
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
    result = run_plan(
        graph(conn), payload([section("a", fmt={"type": "object"})])
    )
    assert result.plan["sections"][0]["content"] == {"title": "x"}
    assert conn.llm.kwargs[0] == {"temperature": 0}


def test_a_json_null_model_reply_fails_the_section_instead_of_dropping_it(conn):
    conn.llm.reply = lambda prompt, kw: "null"
    result = run_plan(graph(conn), payload([section("a")]))
    assert result.status == steps.PlanStatus.FAILED
    assert "JSON null" in result.error


def test_rag_mode_filters_by_chapter_and_uses_top_k(conn):
    def reply(prompt, kw):
        return (
            "generated query"
            if "retrieval specialist" in prompt
            else '{"ok": true}'
        )

    conn.llm.reply = reply
    result = run_plan(
        graph(conn), payload([section("a", mode="rag", fmt={"type": "object"})])
    )
    assert result.plan["sections"][0]["content"] == {"ok": True}
    query = conn.qdrant.queries[0]
    assert query["collection_name"] == "BSE-TG"
    assert query["limit"] == 10
    assert query["using"] == "text-dense"
    assert query["query_filter"].must[0].key == "chapter_id"
    assert (
        query["query_filter"].must[0].match.value
        == "Medium=english,Grade=6,Subject=science,Number=1"
    )
    assert conn.llm.embedded == ["generated query"]
    assert "passage one\n\npassage two" in conn.llm.prompts[-1]
    assert conn.llm.kwargs[-1]["response_format"] == {"type": "json_object"}


def test_rag_falls_back_when_query_generation_fails(conn):
    def reply(prompt, kw):
        if "retrieval specialist" in prompt:
            raise llm_failure()
        return "answer"

    conn.llm.reply = reply
    result = run_plan(graph(conn), payload([section("a", mode="rag")]))
    assert result.status == steps.PlanStatus.COMPLETED
    assert conn.llm.embedded[0].startswith("Describe a in detail.")


def test_rag_without_matching_data_fails_plan(conn):
    conn.qdrant.texts = []
    result = run_plan(graph(conn), payload([section("a", mode="rag")]))
    assert result.status == steps.PlanStatus.FAILED
    assert "no passages" in result.error


def test_rag_retries_empty_answer_then_succeeds(conn):
    answers = iter(["", "second try"])
    conn.llm.reply = lambda p, kw: (
        "q" if "retrieval specialist" in p else next(answers)
    )
    result = run_plan(graph(conn), payload([section("a", mode="rag")]))
    assert result.plan["sections"][0]["content"] == "second try"
    assert conn.sleeps == [1]


def test_rag_retries_an_api_error_then_succeeds(conn):
    def reply(prompt, kw):
        if "retrieval specialist" in prompt:
            return "q"
        if not conn.sleeps:
            raise llm_failure()
        return "second try"

    conn.llm.reply = reply
    result = run_plan(graph(conn), payload([section("a", mode="rag")]))
    assert result.plan["sections"][0]["content"] == "second try"
    assert conn.sleeps == [1]


def test_rag_gives_up_after_three_attempts_with_growing_waits(conn):
    conn.llm.reply = lambda p, kw: "q" if "retrieval specialist" in p else ""
    result = run_plan(graph(conn), payload([section("a", mode="rag")]))
    assert result.status == steps.PlanStatus.FAILED
    assert "empty answer" in result.error
    assert len(answer_prompts(conn)) == 3
    assert conn.sleeps == [1, 2]


def test_rag_does_not_retry_other_errors(conn):
    def reply(prompt, kw):
        if "retrieval specialist" in prompt:
            return "q"
        raise RuntimeError("bug")

    conn.llm.reply = reply
    result = run_plan(graph(conn), payload([section("a", mode="rag")]))
    assert result.status == steps.PlanStatus.FAILED
    assert result.error == "bug"
    assert len(answer_prompts(conn)) == 1
    assert conn.sleeps == []


def test_force_mode_overrides_section_mode(conn):
    run_plan(graph(conn, force_mode="gpt"), payload([section("a", mode="rag")]))
    assert conn.qdrant.queries == []


def test_webhook_failure_does_not_raise(conn):
    async def broken(status):
        raise ConnectionError("receiver down")

    conn.post_status = broken
    result = run_plan(graph(conn), payload([section("a")]))
    assert result.status == steps.PlanStatus.COMPLETED


def test_webhook_statuses_on_success(conn):
    run_plan(graph(conn), payload([section("a")]))
    assert [p["status"] for p in conn.posted] == [
        "PENDING",
        "RUNNING",
        "COMPLETED",
    ]
    assert conn.posted[-1]["output"]["_id"] == "plan-1"
    assert conn.posted[0]["instance_id"] == "plan-1"


def test_webhook_timestamps_are_utc(conn):
    run_plan(graph(conn), payload([section("a")]))
    assert conn.posted[0]["timestamp"].endswith("+00:00")


def test_webhook_off_posts_nothing(conn):
    run_plan(graph(conn, webhook=False), payload([section("a")]))
    assert conn.posted == []


def test_a_validation_error_does_not_echo_the_request():
    secret = "teacher-secret-42"
    with pytest.raises(ValidationError) as e:
        steps.LessonPlanGenerationInput.model_validate(
            {"_id": "x", "user_id": secret, "lp_level": "BAD"}
        )
    assert "lp_level" in steps.reason(e.value)
    assert secret not in steps.reason(e.value)


def test_finished_plan_is_skipped(conn):
    conn.saved["plan-1"] = {}
    result = run_plan(graph(conn), payload([section("a")]))
    assert result == steps.PlanResult(status=steps.PlanStatus.SKIPPED)
    assert conn.llm.prompts == []


def test_additional_context_is_summarized_once(conn):
    long_text = "x" * 150
    conn.llm.reply = lambda p, kw: (
        "SUMMARY" if "Provide a structured summary" in p else "out"
    )
    run_plan(
        graph(conn),
        payload([section("a"), section("b")], additional_context=long_text),
    )
    assert (
        sum("Provide a structured summary" in p for p in conn.llm.prompts) == 1
    )
    assert all(
        "SUMMARY" in p
        for p in conn.llm.prompts
        if "Provide a structured summary" not in p
    )


def test_short_additional_context_is_returned_unchanged(conn):
    assert asyncio.run(graph(conn)._summarize("short note")) == "short note"
    assert conn.llm.prompts == []


def test_run_reports_plans_and_requires_payloads(conn):
    step = graph(conn)
    conn.saved["plan-2"] = {}
    ctx = SimpleNamespace(
        metadata={
            "payloads": [
                payload([section("a")]),
                payload([section("a")]) | {"_id": "plan-2"},
            ]
        }
    )
    result = asyncio.run(step.run(ctx))
    assert result.status.value == "success"
    assert {k: v.status for k, v in ctx.metadata["lesson_plans"].items()} == {
        "plan-1": "completed",
        "plan-2": "skipped",
    }
    assert (
        asyncio.run(step.run(SimpleNamespace(metadata={}))).status.value
        == "failure"
    )


def test_an_invalid_payload_fails_alone_and_the_other_plans_run(conn):
    ctx = SimpleNamespace(
        metadata={
            "payloads": [
                {"_id": "bad"},
                payload([section("a")]),
                "not a payload",
            ]
        }
    )
    result = asyncio.run(graph(conn).run(ctx))
    assert result.status.value == "success"
    plans = ctx.metadata["lesson_plans"]
    assert {k: v.status for k, v in plans.items()} == {
        "bad": "failed",
        "2": "failed",
        "plan-1": "completed",
    }
    assert "workflow" in plans["bad"].error


def test_yaml_config_builds_the_registered_steps():
    pipeline = create_pipeline_from_config(
        ROOT / "period_plan.yaml",
        config_args={
            "workflow_template": "{}",
            "model": "gpt-x",
            "top_k": 4,
            "force_mode": "gpt",
        },
    )
    step = pipeline.steps[-1]
    assert isinstance(step, steps.SectionGraph)
    assert (step.model, step.force_mode, step.webhook, step.concurrency) == (
        "gpt-x",
        "gpt",
        True,
        1,
    )
    assert (
        step.retrieve.top_k,
        step.retrieve.vector_name,
        step.retrieve.embed_model,
    ) == (
        4,
        "text-dense",
        PIPELINE["parameters"]["properties"]["embed_model"]["default"],
    )


def test_strict_json_failure_names_section_and_fails_plan(conn):
    conn.llm.reply = lambda p, kw: "not json at all"
    result = run_plan(
        graph(conn), payload([section("a", fmt={"type": "object"})])
    )
    assert result.status == steps.PlanStatus.FAILED
    assert "The model reply for section 'a' is not valid JSON (" in result.error
    assert (
        "but the section has an output_format. It starts with: not json at all"
        in result.error
    )
    assert [p["status"] for p in conn.posted] == [
        "PENDING",
        "RUNNING",
        "FAILED",
    ]


def test_created_at_from_payload_is_used(conn):
    result = run_plan(graph(conn), payload([section("a")], created_at=123))
    assert result.plan["created_at"] == 123


def test_empty_qdrant_hits_raise(conn):
    async def none(**kw):
        return SimpleNamespace(points=[])

    conn.qdrant.query_points = none
    index = steps.parse_index(INDEX)
    with pytest.raises(ValueError, match="no passages for collection"):
        asyncio.run(graph(conn).retrieve.search(conn, index, "q"))


def test_retrieval_filter_returns_only_the_passages_of_the_requested_chapter(
    conn,
):
    async def go():
        client = AsyncQdrantClient(":memory:")
        await client.create_collection(
            "BSE-TG",
            vectors_config={
                "text-dense": VectorParams(size=2, distance=Distance.COSINE)
            },
        )
        points = [
            PointStruct(
                id=i,
                vector={"text-dense": [1.0, 0.0]},
                payload={
                    "chapter_id": chapter,
                    "text": f"passage {i} of {chapter}",
                },
            )
            for i, chapter in enumerate(["A", "B", "A"], 1)
        ]
        await client.upsert("BSE-TG", points)
        conn.qdrant = client
        retrieve = steps.QdrantRetrieve(embed_model="e")
        index = steps.parse_index("qdrant/BSE-TG/chapter_id:A")
        found = await retrieve.search(conn, index, "query")
        missing = steps.parse_index("qdrant/BSE-TG/chapter_id:C")
        with pytest.raises(ValueError, match="no passages"):
            await retrieve.search(conn, missing, "query")
        await client.close()
        return found

    assert sorted(asyncio.run(go())) == ["passage 1 of A", "passage 3 of A"]


def test_missing_dependency_id_names_both_ids():
    raw = payload([section("a", ["zz"])])
    with pytest.raises(ValidationError) as e:
        steps.LessonPlanGenerationInput.model_validate(raw)
    assert "'a'" in str(e.value)
    assert "'zz'" in str(e.value)


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


def test_clean_query_cuts_at_period_or_space():
    head = "w" * 18
    assert (
        steps.clean_query(head + ". " + "x" * 10 + " tail", limit=20)
        == head + "."
    )
    assert steps.clean_query(head + " " + "x" * 10 + " tail", limit=20) == head


def test_a_placeholder_in_generated_text_does_not_fail_the_plan(conn):
    conn.llm.reply = lambda prompt, kw: "costs ${X}"
    raw = payload([section("a"), section("b", deps=["a"])])
    result = run_plan(graph(conn), raw)
    assert result.status == steps.PlanStatus.COMPLETED
    assert "costs ${X}" in conn.llm.prompts[1]


class FakeLangfuse:
    def __init__(self):
        self.spans, self.flushes = [], 0

    def start_as_current_span(self, name, input=None):
        self.spans.append(name)
        span = SimpleNamespace(
            update=lambda **kw: None, update_trace=lambda **kw: None
        )
        return contextlib.nullcontext(span)

    def flush(self):
        self.flushes += 1


def test_each_plan_makes_one_plan_span_and_flushes_once(conn, monkeypatch):
    fake = FakeLangfuse()
    monkeypatch.setattr(steps, "get_client", lambda: fake)
    step = graph(conn)
    run_plan(step, payload([section("a"), section("b")]))
    run_plan(step, payload([section("a")], _id="plan-2"))
    assert fake.spans.count("Shiksha-LP") == 2
    assert fake.spans.count("section:a") == 2
    assert fake.flushes == 2
