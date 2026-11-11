import asyncio
from urllib.parse import unquote

from app.models.presentation import JobDetail
from app.routers.presentation import ARTIFACT_MEDIA_TYPES, download_job_artifact

TITLE = "భిన్నరాశి అంటే ఏమిటి"


def make_job() -> JobDetail:
    return JobDetail(
        user_id="0" * 24,
        textbook_file="a" * 64 + ".txt",
        textbook_mime="text/plain",
        slides=16,
        instruction=None,
        metadata={"plan": {"outline": {"title": TITLE}}},
    )


def test_download_response_names_the_deck_and_sets_the_presentation_type():
    job = make_job()

    class FakeJobs:
        async def get(self, _job_id):
            return job

    class FakeStorage:
        def path(self, *parts):
            return "/".join(parts)

        async def exists(self, _path):
            return True

        async def size(self, _path):
            return 4

        async def read_stream(self, path, chunk_size=1024 * 1024, size=None):
            yield b"PK\x03\x04"

    class FakeService:
        jobs = FakeJobs()
        storage = FakeStorage()

    response = asyncio.run(download_job_artifact(
        user_id="0" * 24, job_id=job.id, file_format="pptx", if_none_match=None, service=FakeService()
    ))
    disposition = response.headers["content-disposition"]
    assert response.headers["content-type"] == ARTIFACT_MEDIA_TYPES["pptx"]
    assert unquote(disposition.split("filename*=UTF-8''")[1]) == f"{TITLE}.pptx"
