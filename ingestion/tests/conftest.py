import asyncio
import io
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml
from openpyxl import Workbook

import period_plan_steps as steps

ROOT = Path(__file__).resolve().parents[1]
PIPELINE = yaml.safe_load(
    (ROOT / "period_plan.yaml").read_text(encoding="utf-8")
)
CONFIG = PIPELINE["steps"][-1]["config"]
INDEX = (
    "qdrant/BSE-TG/chapter_id:Medium=english,Grade=6,Subject=science,Number=1"
)
KEY = "secret-key"
TEMPLATE = {
    "_id": "wf-social",
    "name": "t",
    "description": "t",
    "sections": [
        {
            "id": "lesson_mind_mapping",
            "title": "Mind map",
            "description": "Map ${READING_CONTENT}",
            "mode": "gpt",
            "dependencies": [],
        },
        {
            "id": "section_engage",
            "title": "Engage",
            "description": "Engage with ${DISCOURSE_TYPES_MAJOR}",
            "mode": "gpt",
            "dependencies": [],
        },
    ],
}
ROWS = [
    (
        "Chapter Number ",
        "Chapter title",
        "Period ",
        "Topic",
        "Learning outcomes",
    ),
    (18, "Devotion", 1, " Hindu", " LO a"),
    (None, None, None, "Christian", "LO b"),
    (None, None, 2, "Sikh", "LO c"),
    (19.0, "Rivers", 1, "Rivers intro", "LO d"),
    (None, None, 3, "", None),
]


class FakeLLM:
    def __init__(self, reply=None):
        self.reply = reply or (lambda prompt, kw: f"text for {prompt[:40]}")
        self.prompts, self.kwargs, self.embedded = [], [], []
        self.chat = SimpleNamespace(
            completions=SimpleNamespace(create=self._create)
        )
        self.embeddings = SimpleNamespace(create=self._embed)

    async def _create(self, model, messages, **kw):
        self.prompts.append(messages[-1]["content"])
        self.kwargs.append(kw)
        content = self.reply(messages[-1]["content"], kw)
        return SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content=content))]
        )

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
        return SimpleNamespace(
            points=[SimpleNamespace(payload={"text": t}) for t in self.texts]
        )


class FakeConnections(steps.Connections):
    def __init__(self):
        self.qdrant, self.llm = FakeQdrant(), FakeLLM()
        self.posted, self.saved, self.sleeps = [], {}, []

    async def post_status(self, status):
        self.posted.append(status)

    def is_done(self, plan_id):
        return plan_id in self.saved

    def save(self, plan_id, plan):
        self.saved[plan_id] = plan


@pytest.fixture
def conn(monkeypatch):
    fake = FakeConnections()
    real_sleep = asyncio.sleep

    def sleep(seconds):
        fake.sleeps.append(seconds)
        return real_sleep(0)

    monkeypatch.setattr(asyncio, "sleep", sleep)
    return fake


@pytest.fixture(autouse=True)
def api_key(monkeypatch):
    monkeypatch.setenv("PIPELINE_API_KEY", KEY)


@pytest.fixture
def azure_env(monkeypatch):
    monkeypatch.setenv("AZURE_OPENAI_API_BASE", "https://example.invalid")
    monkeypatch.setenv("AZURE_OPENAI_API_KEY", "k")
    monkeypatch.setenv("AZURE_OPENAI_API_VERSION", "2024-06-01")


def graph(conn=None, **kw):
    return steps.SectionGraph.model_validate(
        {
            **CONFIG,
            "conn": conn,
            "model": "m",
            "webhook": True,
            "force_mode": "",
            "concurrency": 1,
            "retrieve": {"embed_model": "e"},
            **kw,
        }
    )


def section(sid, deps=(), mode="gpt", fmt=None):
    return {
        "id": sid,
        "title": sid.upper(),
        "description": f"Describe {sid} in detail.",
        "mode": mode,
        "dependencies": [{"section_id": d} for d in deps],
        "output_format": fmt,
    }


def payload(sections, **kw):
    return {
        "_id": "plan-1",
        "workflow": {"_id": "wf", "sections": sections},
        "chapter_info": {
            "id": "ch",
            "index_path": INDEX,
            "chapter_title": "Light",
        },
        "lp_level": "SUBTOPIC",
        "subtopics": ["Reflection"],
        "learning_outcomes": ["Explain reflection"],
        **kw,
    }


def run_plan(step, raw):
    inp = steps.LessonPlanGenerationInput.model_validate(raw)
    return asyncio.run(step.plan(inp))


def workbook(rows=None, sheet="Grade 6") -> bytes:
    book = Workbook()
    book.active.title = sheet
    for row in ROWS if rows is None else rows:
        book.active.append(row)
    buffer = io.BytesIO()
    book.save(buffer)
    return buffer.getvalue()
