import os
import uuid

import aiohttp
import pytest

from app.models.presentation import JobDetail, ToolInfo


@pytest.fixture
async def client():
    async with aiohttp.ClientSession(os.environ["SHIKSHA_BASE_URL"].rstrip("/"), headers={"X-User-ID": uuid.uuid4().hex[:24]}) as client:
        yield client


@pytest.mark.integration
async def test_presentation_job_lifecycle(client):
    user_id = client.headers["X-User-ID"]
    form = aiohttp.FormData()
    form.add_field("textbook_file", b"Plants use sunlight, water, and carbon dioxide to make food.", filename="photosynthesis.txt", content_type="text/plain")
    form.add_field("slides", "3")
    form.add_field("instruction", "Create a concise lesson for Grade 6 students.")
    form.add_field("tags", "integration-test")

    async with client.post("/presentation/job", data=form) as response:
        response.raise_for_status()
        job = JobDetail.model_validate(await response.json())
    assert job.user_id == user_id
    assert job.textbook_mime == "text/plain"
    assert job.slides == 3
    assert job.tags == {"integration-test"}

    async with client.get("/presentation/job", params={"id": str(job.id)}) as response:
        response.raise_for_status()
        current = JobDetail.model_validate(await response.json())
    assert current.id == job.id

    async with client.get("/presentation/job", params={"id": str(job.id)}, headers={"X-User-ID": uuid.uuid4().hex[:24]}) as response:
        await response.read()
    assert response.status == 404

    async with client.get("/presentation/jobs", params={"tags": "integration-test"}) as response:
        response.raise_for_status()
        jobs = [JobDetail.model_validate(item) for item in await response.json()]
    assert [item.id for item in jobs] == [job.id]

    async with client.get(f"/presentation/events/pending/{user_id}") as response:
        response.raise_for_status()
        event = await response.content.readline()
    assert event == b"data: 1\n"

    async with client.delete("/presentation/job", params={"id": str(job.id)}) as response:
        response.raise_for_status()
        deleted = await response.json()
    assert deleted is True

    async with client.get("/presentation/job", params={"id": str(job.id)}) as response:
        response.raise_for_status()
        deleted_job = await response.json()
    assert deleted_job is None


@pytest.mark.integration
async def test_presentation_tools(client):
    async with client.get("/presentation/tools") as response:
        response.raise_for_status()
        tools = [ToolInfo.model_validate(item) for item in await response.json()]
    assert tools
    assert len({tool.function_name for tool in tools}) == len(tools)
    assert all(tool.name and tool.description for tool in tools)
