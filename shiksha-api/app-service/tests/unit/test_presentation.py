import time
import uuid

import aiohttp
import pytest
from pydantic_ai import RunContext
from pydantic_ai.usage import RunUsage

from app.messaging.consumer import RetryAfter
from app.models.presentation import JobDetail, PresentationOutline, SectionSpec, SlideSpec, to_info
from app.services.presentation.job import FenceLost, JobCancelled
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
        self.deleted = False

    async def delete(self, job):
        self.job, self.deleted = None, True
        return True

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
@pytest.mark.parametrize("prior, seconds", [(0, 5), (2, 20), (4, 60)])
async def test_run_job_step_failure_records_error_and_asks_for_retry(monkeypatch, prior, seconds):
    service = make_service(make_job(metadata={"error": {"attempt": prior}} if prior else {}))

    async def boom(job): raise RuntimeError("llm down")

    monkeypatch.setattr(service, "_run_job", boom)
    with pytest.raises(RetryAfter) as raised:
        await service.run_job(service.jobs.job.id)
    job = service.jobs.job
    assert raised.value.seconds == seconds
    assert job.status == "error" and job.metadata["error"]["attempt"] == prior + 1
    assert job.metadata["error"]["next_attempt"] > time.time() and job.metadata["error"]["attempting_recovery"] is True


@pytest.mark.asyncio
async def test_run_job_step_failure_above_the_limit_stops_without_retry(monkeypatch):
    service = make_service(make_job(metadata={"error": {"attempt": 5}}))

    async def boom(job): raise RuntimeError("llm down")

    monkeypatch.setattr(service, "_run_job", boom)
    await service.run_job(service.jobs.job.id)
    job = service.jobs.job
    assert job.status == "error" and job.metadata["error"]["attempt"] == 6
    assert job.metadata["error"]["attempting_recovery"] is False


@pytest.mark.asyncio
async def test_run_job_resumes_a_job_that_starts_in_error(monkeypatch):
    service = make_service(make_job(status="error", metadata={"error": {"attempt": 1, "attempting_recovery": True}}))
    steps = []

    async def step(job):
        steps.append(job.status)
        if job.status == "error": await service._actually_run_job(job)
        else: service.jobs.job.status = "complete"

    monkeypatch.setattr(service, "_run_job", step)
    await service.run_job(service.jobs.job.id)
    assert steps == ["error", "init"]


@pytest.mark.asyncio
async def test_run_job_deletes_a_job_with_a_cancel_request(monkeypatch):
    service = make_service(make_job(cancel_requested=True))

    async def step(job): raise AssertionError("step must not run")

    monkeypatch.setattr(service, "_run_job", step)
    await service.run_job(service.jobs.job.id)
    assert service.jobs.deleted


@pytest.mark.asyncio
async def test_run_job_deletes_the_job_when_a_step_reports_cancel(monkeypatch):
    service = make_service(make_job())

    async def step(job): raise JobCancelled()

    monkeypatch.setattr(service, "_run_job", step)
    await service.run_job(service.jobs.job.id)
    assert service.jobs.deleted


@pytest.mark.asyncio
async def test_run_job_lets_a_lost_fence_propagate(monkeypatch):
    service = make_service(make_job())

    async def step(job): raise FenceLost()

    monkeypatch.setattr(service, "_run_job", step)
    with pytest.raises(FenceLost):
        await service.run_job(service.jobs.job.id)
    assert service.jobs.job.status == "init" and not service.jobs.deleted


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


@pytest.mark.parametrize("fields, phase", [
    ({"status": "complete", "lease_owner": "f"}, "complete"),
    ({"status": "error", "cancel_requested": True}, "error"),
    ({"status": "error", "metadata": {"error": {"attempting_recovery": True}}}, "retrying"),
    ({"status": "error", "metadata": {"error": {"attempting_recovery": False}}}, "error"),
    ({"status": "error", "cancel_requested": True, "metadata": {"error": {"attempting_recovery": True}}}, "cancelling"),
    ({"status": "creating_slides", "cancel_requested": True, "lease_owner": "f"}, "cancelling"),
    ({"status": "creating_slides", "lease_owner": "f"}, "running"),
    ({"status": "creating_slides"}, "queued"),
])
def test_to_info_phase(fields, phase):
    assert to_info(make_job(**fields)).phase == phase


@pytest.mark.parametrize("make_error, expected", [
    (lambda info: aiohttp.ClientResponseError(info, (), status=400, message="Bad Request"), "HTTP 400"),
    (lambda info: aiohttp.ContentTypeError(info, (), status=200, message="bad type"), "not JSON"),
])
async def test_youtube_error_does_not_carry_the_api_key(monkeypatch, make_error, expected):
    from yarl import URL
    from app.config import settings
    from app.services.presentation import utils

    url = URL("https://www.googleapis.com/youtube/v3/search?key=SECRET")

    class Client:
        async def __aenter__(self): return self
        async def __aexit__(self, *exc): return False
        async def get(self, *args, **kwargs):
            info = aiohttp.RequestInfo(url, "GET", {}, url)
            raise make_error(info)

    monkeypatch.setattr(utils, "_client", Client)
    monkeypatch.setattr(settings, "youtube_api_key", "SECRET")
    with pytest.raises(RuntimeError) as err:
        await utils.youtube_video_search("cells", 5)
    assert "SECRET" not in str(err.value) and expected in str(err.value)
