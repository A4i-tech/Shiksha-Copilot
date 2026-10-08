import asyncio
import time
import uuid
from datetime import datetime, timedelta, timezone

import pytest
from pydantic_ai import RunContext
from pydantic_ai.usage import RunUsage

from app.models.presentation import JobDetail, PresentationOutline, SectionSpec, SlideSpec
from app.config import settings
from app.services.presentation.job import annotate_idle
from app.services.presentation.worker import _keep_lease
from app.services.presentation.agent import DesignerDeps, _ImageResolverMixin, designer, next_slide_spec
from app.services.presentation.service import PresentationService
from app.services.presentation.template import Templates
from app.utils.storage import Storage


def outline():
    slides = [SlideSpec(
        slide_type="body",
        title=title,
        content_goals=["Explain the concept", "Give an example"],
        engagement_strategy="Ask students a focused question.",
        context="Detailed classroom context for this presentation slide. " * 2,
    ) for title in ("First", "Second")]
    return PresentationOutline(
        title="Lesson",
        learning_objectives=["One", "Two", "Three", "Four"],
        sections=[SectionSpec(section_title=title, slides=[slide]) for title, slide in zip(("A", "B"), slides)],
    )


def test_advances_through_outline_with_stable_slide_ids():
    plan = outline()
    prs = Templates.new_presentation()
    deps = DesignerDeps(Storage("memory", ""), prs, Templates(prs), "", plan, None, {"slides_completed": ["welcome"]})
    context = RunContext(deps=deps, model=designer.model, usage=RunUsage())

    first = next_slide_spec(context)
    deps.metadata["slides_completed"].append("first")
    second = next_slide_spec(context)
    deps.metadata["slides_completed"].append("second")

    assert [first.slide_number, second.slide_number] == [1, 2]
    assert [plan.compute_slide_id(first.slide), plan.compute_slide_id(second.slide)] == [0, 64]
    assert next_slide_spec(context) is None


def test_image_url_mapping_is_and_reversible():
    resolver = _ImageResolverMixin()
    url = "https://example.com/diagram.gif"
    mapped = resolver.map_url(url)
    assert mapped.endswith(".gif")
    assert resolver.map_url(url) == mapped
    assert resolver.resolve_url(mapped) == url


class FakeJobs:
    def __init__(self, job: JobDetail | None):
        self.job = job

    async def get(self, job_id):
        if self.job is None:
            return None
        return self.job.model_copy(deep=True)

    async def update(self, job_id, fields_set=None, fields_unset=None):
        for key, value in (fields_set or {}).items():
            if key.startswith("metadata."):
                node = self.job.metadata
                *parents, leaf = key.split(".")[1:]
                for p in parents: node = node.setdefault(p, {})
                node[leaf] = value
            else:
                setattr(self.job, key, value)


def make_job(**kwargs):
    return JobDetail(user_id="0" * 24, textbook_file="a.pdf", textbook_mime="application/pdf", slides=None, instruction=None, **kwargs)


def make_service(job):
    return PresentationService(None, FakeJobs(job), False, 5, 1, 1, 1)


@pytest.mark.asyncio
async def test_run_job_runs_steps_until_complete(monkeypatch):
    service = make_service(make_job())
    steps = []

    async def step(job):
        steps.append(job.status)
        service.jobs.job.status = {"init": "creating_slides", "creating_slides": "complete"}[job.status]

    monkeypatch.setattr(service, "_run_job", step)
    await service.run_job(service.jobs.job.id)
    assert steps == ["init", "creating_slides"]


@pytest.mark.asyncio
async def test_run_job_step_failure_records_error_and_stops(monkeypatch):
    service = make_service(make_job())

    async def boom(job): raise RuntimeError("llm down")

    monkeypatch.setattr(service, "_run_job", boom)
    await service.run_job(service.jobs.job.id)
    job = service.jobs.job
    assert job.status == "error" and job.metadata["error"]["attempt"] == 1
    assert job.metadata["error"]["next_attempt"] > time.time()


@pytest.mark.asyncio
async def test_run_job_stops_when_job_deleted(monkeypatch):
    service = make_service(make_job())

    calls = []

    async def delete_during_step(job):
        calls.append(job.status)
        service.jobs.job = None

    monkeypatch.setattr(service, "_run_job", delete_during_step)
    await service.run_job(uuid.uuid4())
    assert calls == ["init"]


@pytest.mark.asyncio
async def test_error_step_resets_job_to_init():
    service = make_service(make_job(status="error", metadata={"error": {"attempt": 1, "attempting_recovery": True, "next_attempt": 0}}))
    await service._actually_run_job(service.jobs.job)
    assert service.jobs.job.status == "init"


@pytest.mark.asyncio
async def test_exhausted_retries_stop_and_run_job_terminates():
    service = make_service(make_job(status="error", metadata={"error": {"attempt": 6, "attempting_recovery": True, "next_attempt": 0}}))
    await service.run_job(service.jobs.job.id)
    job = service.jobs.job
    assert job.status == "error" and job.metadata["error"]["attempting_recovery"] is False


def test_job_is_idle_only_without_live_lease():
    now = datetime.now(timezone.utc)
    assert annotate_idle(make_job(status="creating_slides")).status == "idle"
    assert annotate_idle(make_job(status="creating_slides", lease_expires_at=now - timedelta(seconds=1))).status == "idle"
    assert annotate_idle(make_job(status="creating_slides", lease_expires_at=now + timedelta(seconds=30))).status == "creating_slides"
    assert annotate_idle(make_job(status="error")).status == "error"


@pytest.mark.asyncio
async def test_keep_lease_survives_renew_errors_and_cancels_run_when_lease_is_lost(monkeypatch):
    monkeypatch.setattr(settings, "pres_lease_seconds", 0.03)
    answers = [RuntimeError("mongo blip"), True, False]

    class Jobs:
        async def renew_lease(self, job_id, owner):
            answer = answers.pop(0)
            if isinstance(answer, Exception): raise answer
            return answer

    run = asyncio.create_task(asyncio.sleep(60))
    await asyncio.wait_for(_keep_lease(Jobs(), uuid.uuid4(), "w", run), 2)
    await asyncio.sleep(0)
    assert run.cancelled() and answers == []


@pytest.mark.asyncio
async def test_job_that_keeps_crashing_workers_is_stopped():
    service = make_service(make_job(status="creating_slides", crashes=6))
    await service.run_job(service.jobs.job.id)
    job = service.jobs.job
    assert job.status == "error" and job.metadata["error"]["attempting_recovery"] is False
