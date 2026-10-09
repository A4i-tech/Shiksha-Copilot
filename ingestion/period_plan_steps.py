import asyncio
import json
import logging
import re
import time
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from textwrap import dedent
from typing import Any, Awaitable, Callable, Literal

from omni_ingest.core.model import Step, StepResult, StepStatus
from pydantic import AliasChoices, BaseModel, Field
from qdrant_client.http.models import FieldCondition, Filter, MatchValue

log = logging.getLogger(__name__)
PREVIOUS = "Previously Generated Section: "
CYCLE_ERROR = "Detected a cycle in the workflow dependencies"
FENCE = re.compile(r"^\s*```[A-Za-z]*\s*|\s*```\s*$")


@dataclass
class Connections:
    qdrant: Any
    llm: Any
    post_status: Callable[[dict], Awaitable[None]]
    is_done: Callable[[str], bool]
    save: Callable[[str, dict], None]


CONN: Connections


class LPLevel(str, Enum):
    CHAPTER = "CHAPTER"
    SUBTOPIC = "SUBTOPIC"
    TELANGANA_ENGLISH_RESOURCE_PLAN = "TELANGANA_ENGLISH_RESOURCE_PLAN"


class EnglishLPType(str, Enum):
    PROSE = "PROSE"
    POEM = "POEM"
    NONE = "NONE"


class Dependency(BaseModel):
    section_id: str


class SectionDef(BaseModel):
    id: str
    title: str
    description: str
    mode: Literal["rag", "gpt"]
    dependencies: list[Dependency] = []
    output_format: dict[str, Any] | None = None


class Workflow(BaseModel):
    id: str = Field(alias="_id")
    sections: list[SectionDef]


class ChapterInfo(BaseModel):
    id: str
    index_path: str
    chapter_title: str


class Section(BaseModel):
    section_id: str
    section_title: str
    content: Any
    regen_feedback: str | None = None


class LessonPlanContent(BaseModel):
    sections: list[Section] = []


class LessonPlanGenerationInput(BaseModel):
    user_id: str = "ADMIN"
    workflow: Workflow
    lp_id: str = Field("", validation_alias=AliasChoices("lp_id", "_id"))
    chapter_info: ChapterInfo
    lp_level: LPLevel
    learning_outcomes: list[str]
    lp_type_english: EnglishLPType = EnglishLPType.NONE
    start_from_section_id: str | None = None
    subtopics: list[str] = []
    lesson_plan: LessonPlanContent | None = None
    prompt_variables: dict[str, Any] = {}
    additional_context: str | None = None
    created_at: int | None = None


@dataclass
class Node:
    title: str
    mode: str
    deps: list[str]
    out: Any = None
    done: bool = False


def parse_json(text: str, sec: SectionDef | None = None) -> Any:
    try:
        return json.loads(FENCE.sub("", text.strip()))
    except ValueError:
        if sec and sec.output_format:
            raise ValueError(f"The model reply for section '{sec.id}' is not valid JSON, but the section has an output_format.") from None
        return text


def plan_id_of(raw: dict) -> str:
    return raw.get("lp_id") or raw.get("_id", "")


def build_nodes(inp: LessonPlanGenerationInput, force_mode: Literal["", "rag", "gpt"] = "") -> dict[str, Node]:
    nodes = {s.id: Node(s.title, force_mode or s.mode, [d.section_id for d in s.dependencies]) for s in inp.workflow.sections}
    for s in inp.workflow.sections:
        for d in s.dependencies:
            if d.section_id not in nodes:
                raise ValueError(f"Section '{s.id}' depends on '{d.section_id}', which is not a section in the workflow.")
    if inp.lesson_plan is None:
        return nodes
    sections = inp.lesson_plan.sections
    if sid := inp.start_from_section_id:
        if sid not in nodes:
            raise ValueError(f"Section ID '{sid}' not found in workflow")
        content = {s.section_id: s.content for s in sections}
        if missing := [d for d in nodes[sid].deps if d not in content]:
            raise ValueError(f"Missing dependency content for section '{sid}'. Required dependencies not provided: {missing}")
        for k, v in content.items():
            if k in nodes:
                nodes[k].out, nodes[k].done = v, True
        return nodes
    for s in sections:
        if s.section_id in nodes:
            note = f"\n\n**Feedback for regeneration: {s.regen_feedback}**" if s.regen_feedback else ""
            nodes[f"other_{s.section_id}"] = Node(PREVIOUS + s.section_title, "gpt", [], json.dumps(s.content, ensure_ascii=False) + note, True)
            nodes[s.section_id].deps.append(f"other_{s.section_id}")
    return nodes


async def run_graph(nodes: dict[str, Node], generate: Callable[[str, dict[str, Any]], Awaitable[Any]]) -> None:
    done = {k for k, n in nodes.items() if n.done}
    while left := set(nodes) - done:
        ready = {k for k in left if all(d in done for d in nodes[k].deps)}
        if not ready:
            raise ValueError(CYCLE_ERROR)
        done |= ready

    tasks: dict[str, asyncio.Task] = {}

    async def run(k: str) -> None:
        for d in nodes[k].deps:
            if d in tasks:
                await tasks[d]
        deps = {nodes[d].title: nodes[d].out for d in nodes[k].deps if nodes[d].out is not None}
        nodes[k].out = await generate(k, deps)

    for k, n in nodes.items():
        if not n.done:
            tasks[k] = asyncio.create_task(run(k))
    try:
        await asyncio.gather(*tasks.values())
    except BaseException:
        for t in tasks.values():
            t.cancel()
        raise


def fill(template: str, **slots: str) -> str:
    return re.sub(r"\n{3,}", "\n\n", template.format(**slots)).strip()


def dump(content: Any) -> str:
    return json.dumps(content, ensure_ascii=False)


def default_query(inp: LessonPlanGenerationInput, regen: bool) -> str:
    sep = "\n\n" if regen else "\n"
    outcomes = "\n".join(inp.learning_outcomes)
    if inp.lp_level == LPLevel.SUBTOPIC:
        if not regen and not inp.subtopics:
            raise ValueError("Subtopics must be provided for SUBTOPIC level lesson plans")
        return f"{'Topic Titles' if regen else 'Topic(s)'}: {'; '.join(inp.subtopics)}{sep}Learning Outcomes: {outcomes}"
    return f"Chapter Title: {inp.chapter_info.chapter_title}{sep}Learning Outcomes: {outcomes}"


def clean_query(query: str, limit: int = 500) -> str:
    query = query.strip()
    if not query:
        raise ValueError("Generated query is empty")
    for prefix in ("Retrieval Query:", "Query:", "Search Query:", "Generated Query:"):
        if query.startswith(prefix):
            query = query[len(prefix):].strip()
    if len(query) > limit:
        cut = query[:limit]
        period, comma, space = cut.rfind("."), cut.rfind(","), cut.rfind(" ")
        keep = limit * 0.7
        if max(period, comma, space) <= keep:
            return cut
        return cut[: period + 1] if period > keep else cut[:comma] if comma > keep else cut[:space]
    return query


class QdrantRetrieve(BaseModel):
    embed_model: str
    collection: str = ""
    top_k: int = 10
    vector_name: str = "text-dense"

    def _target(self, index_path: str) -> tuple[str, Filter]:
        try:
            _, collection, flt = index_path.split("/", 2)
            key, value = flt.split(":", 1)
        except ValueError:
            raise ValueError(f"index_path '{index_path}' must look like qdrant/<collection>/<key>:<value>") from None
        return self.collection or collection, Filter(must=[FieldCondition(key=key, match=MatchValue(value=value))])

    async def check(self, index_path: str) -> None:
        collection, flt = self._target(index_path)
        points, _ = await CONN.qdrant.scroll(collection_name=collection, scroll_filter=flt, with_payload=False, with_vectors=False, limit=1)
        if not points:
            raise ValueError(f"No data matches metadata filter in collection '{collection}': {index_path}. Check that the chapter was indexed.")

    async def search(self, index_path: str, query: str) -> list[str]:
        collection, flt = self._target(index_path)
        vector = (await CONN.llm.embeddings.create(model=self.embed_model, input=query)).data[0].embedding
        result = await CONN.qdrant.query_points(collection_name=collection, query=vector, using=self.vector_name, query_filter=flt, limit=self.top_k, with_payload=True)
        if not result.points:
            raise ValueError(f"Qdrant returned no passages for {index_path}. Check that the chapter was indexed.")
        texts = []
        for p in result.points:
            text = json.loads(p.payload["_node_content"])["text"] if "_node_content" in p.payload else p.payload.get("text")
            if not text:
                raise ValueError(f"Qdrant point {p.id} has no text payload. Check how the chapter was indexed.")
            texts.append(text)
        return texts


class SectionGraph(BaseModel, Step):
    model: str
    prompts: dict[str, Any]
    retrieve: QdrantRetrieve
    webhook: bool = True
    force_mode: Literal["", "rag", "gpt"] = ""
    concurrency: int = 1

    async def _chat(self, content: str, system: bool = True, **kwargs: Any) -> str:
        messages = ([{"role": "system", "content": self.prompts["system"]}] if system else []) + [{"role": "user", "content": content}]
        response = await CONN.llm.chat.completions.create(model=self.model, messages=messages, **kwargs)
        return (response.choices[0].message.content or "").strip()

    async def _notify(self, plan_id: str, status: str, payload: dict, output: Any = None) -> None:
        if not self.webhook:
            return
        try:
            await CONN.post_status({"instance_id": plan_id, "status": status, "timestamp": datetime.now().isoformat(), "input": payload, "output": output})
        except Exception as e:
            log.error("Webhook post failed for plan %s (%s). Check WEBHOOK_URL and that the receiver is reachable.", plan_id, e)

    async def _summarize(self, text: str, limit: int = 800) -> str:
        if len(text.strip()) < 100:
            return text
        try:
            summary = await self._chat(self.prompts["summarize"].format(max=limit, text=text), temperature=0)
        except Exception as e:
            log.error("Context summary failed (%s). Using the truncated original.", e)
            return text[:limit] + "..." if len(text) > limit else text
        if len(summary) > limit:
            cut = summary[:limit]
            summary = cut[: cut.rfind(".") + 1] if cut.rfind(".") > limit * 0.8 else cut + "..."
        return summary.strip()

    async def _retrieval_query(self, inp: LessonPlanGenerationInput, sec: SectionDef, regen: bool) -> str:
        if len(sec.description.strip()) < 10:
            return default_query(inp, regen)
        topics = inp.subtopics if inp.lp_level == LPLevel.SUBTOPIC and inp.subtopics else [inp.chapter_info.chapter_title] if inp.chapter_info.chapter_title else []
        outcomes = inp.learning_outcomes
        extra = ("\nTopics/Subtopics:\n" + "\n".join(f"- {t}" for t in topics) if topics else "") + ("\nLearning Outcomes:\n" + "\n".join(f"- {o}" for o in outcomes) if outcomes else "")
        try:
            return clean_query(await self._chat(self.prompts["retrieval_query"].format(description=sec.description, extra=extra, max=500), temperature=0))
        except Exception as e:
            log.warning("Retrieval query generation failed (%s). Using the basic query.", e)
            parts = [sec.description] + ([f"topics: {' '.join(topics)}"] if topics else []) + ([f"learning outcomes: {' '.join(outcomes)}"] if outcomes else [])
            return " ".join(parts)[:500]

    def _synthesis(self, inp: LessonPlanGenerationInput, sec: SectionDef, deps: dict[str, Any], variant: str, mode: str) -> str:
        p = self.prompts[variant]
        titles = [s.title for s in inp.workflow.sections]
        slots = {
            "journey": self.prompts["journey"].format(sections=", ".join(titles), current=sec.title) if titles else "",
            "additional": self.prompts["additional"].format(text=inp.additional_context.strip()) if inp.additional_context and inp.additional_context.strip() else "",
            "description": dedent(sec.description),
            "rag": p["rag"] if mode == "rag" else "",
            "format": p["json"].format(schema=json.dumps(sec.output_format, ensure_ascii=False, indent=2)) if sec.output_format else p["md"],
        }
        sub = inp.lp_level == LPLevel.SUBTOPIC
        if variant == "fresh":
            query = default_query(inp, False).strip()
            slots["intro"] = fill(p["subtopic" if sub else "chapter"], title=sec.title)
            slots["outcomes"] = p["outcomes"].format(query=query) if query else ""
            body = "\n\n".join(f"# Section: {t}\n{dump(c)}" for t, c in deps.items())
            slots["deps"] = p["deps"].format(deps=body) if deps else ""
        elif variant == "regen":
            slots["intro"] = p["subtopic" if sub else "chapter"].format(title=sec.title, query=default_query(inp, True))
            current = "".join(f"# Section: {t}\n{dump(c)}\n\n" for t, c in deps.items() if not t.startswith(PREVIOUS))
            previous = [f"# {t}\n{c}" for t, c in deps.items() if t.startswith(PREVIOUS)]
            slots["deps"] = (p["deps_current"].format(deps=current) if current else "") + ("\n\n" + p["deps_previous"].format(previous=previous[-1]) if previous else "")
        else:
            slots["intro"] = p["intro"].format(title=sec.title)
            body = "\n\n".join(f"# Section: {t}\n{dump(c)}" for t, c in deps.items())
            slots["deps"] = p["deps"].format(deps=body) if deps else ""
        text = fill(p["template"], **slots)
        return re.sub(r"\$\{([A-Za-z0-9_]+)\}", lambda m: str(inp.prompt_variables.get(m.group(1), "")), text)

    async def _rag(self, inp: LessonPlanGenerationInput, sec: SectionDef, prompt: str, query: str) -> Any:
        path = inp.chapter_info.index_path
        await self.retrieve.check(path)
        options = {"response_format": {"type": "json_object"}} if sec.output_format else {}
        for attempt in range(3):
            try:
                context = "\n\n".join(await self.retrieve.search(path, query))
                text = await self._chat(self.prompts["rag_answer"].format(context=context, query=prompt), system=False, temperature=0.1, **options)
                if text and text != "504.0 GatewayTimeout":
                    return parse_json(text, sec)
                error = ValueError(f"The model returned an empty answer for section '{sec.id}'.")
            except Exception as e:
                error = e
            if attempt < 2:
                await asyncio.sleep(2**attempt)
        raise error

    async def _generate(self, inp: LessonPlanGenerationInput, sec: SectionDef, deps: dict[str, Any]) -> Any:
        regen = inp.lesson_plan is not None and not inp.start_from_section_id
        variant = "regen" if regen else "resource" if inp.lp_level == LPLevel.TELANGANA_ENGLISH_RESOURCE_PLAN else "fresh"
        mode = self.force_mode or sec.mode
        prompt = self._synthesis(inp, sec, deps, variant, mode)
        if mode == "rag":
            return await self._rag(inp, sec, prompt, await self._retrieval_query(inp, sec, regen))
        text = await self._chat(prompt, temperature=0)
        if not text:
            raise ValueError(f"The model returned an empty answer for section '{sec.id}'.")
        return parse_json(text, sec)

    async def _plan(self, raw: dict) -> dict:
        plan_id = plan_id_of(raw)
        if CONN.is_done(plan_id):
            return {"status": "skipped"}
        await self._notify(plan_id, "PENDING", raw)
        await self._notify(plan_id, "RUNNING", raw)
        try:
            inp = LessonPlanGenerationInput.model_validate(raw)
            if inp.additional_context:
                inp.additional_context = await self._summarize(inp.additional_context)
            nodes = build_nodes(inp, self.force_mode)
            sections = {s.id: s for s in inp.workflow.sections}
            await run_graph(nodes, lambda k, deps: self._generate(inp, sections[k], deps))
            plan = {
                "_id": inp.lp_id,
                "created_at": inp.created_at or int(time.time()),
                "workflow_id": inp.workflow.id,
                "chapter_id": inp.chapter_info.id,
                "subtopics": inp.subtopics,
                "learning_outcomes": inp.learning_outcomes,
                "lp_level": inp.lp_level.value,
                "lp_type_english": inp.lp_type_english.value,
                "sections": [{"section_id": s.id, "section_title": s.title, "content": nodes[s.id].out} for s in inp.workflow.sections if nodes[s.id].out is not None],
            }
            CONN.save(plan_id, plan)
        except Exception as e:
            log.exception("Plan %s failed", plan_id)
            await self._notify(plan_id, "FAILED", raw, str(e))
            return {"status": "failed", "error": str(e)}
        await self._notify(plan_id, "COMPLETED", raw, plan)
        return {"status": "completed", "plan": plan}

    async def run(self, ctx: Any) -> StepResult:
        payloads = ctx.metadata.get("payloads") or []
        if not payloads:
            return StepResult(status=StepStatus.FAILURE, error="No payloads found in metadata. Check that the transform step before section_graph produced payloads.")
        gate = asyncio.Semaphore(self.concurrency)

        async def one(raw: dict) -> dict:
            async with gate:
                return await self._plan(raw)

        results = await asyncio.gather(*(one(raw) for raw in payloads))
        ctx.metadata["lesson_plans"] = {plan_id_of(raw): r for raw, r in zip(payloads, results)}
        return StepResult(status=StepStatus.SUCCESS, metadata={"plans": len(results)})
