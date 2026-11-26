import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

from app.services.question_paper_service import QuestionPaperService
from app.services.rag_adapter_cache import RagAdapterCache


class FakeAdapter:
    cleanups = 0

    async def cleanup(self):
        self.cleanups += 1


def make_service(builder) -> QuestionPaperService:
    service = QuestionPaperService.__new__(QuestionPaperService)
    service._rags = RagAdapterCache(builder, 1)
    service._rag_llm = service._rag_embed = None
    service.concurrency = asyncio.Semaphore(1)
    service._generate_questions_batch = AsyncMock(return_value=[])
    return service


async def run(service):
    record = SimpleNamespace(index_path="a", title="t")
    await service._generate_questions_batch_async("", None, [], record, [])
    return service._generate_questions_batch.call_args.args[-1]


async def test_builder_failure_passes_no_adapter():
    async def build(*_):
        raise RuntimeError("down")

    assert await run(make_service(build)) is None


async def test_adapter_is_leased_during_call_and_released_after():
    fake = FakeAdapter()

    async def build(*_):
        return fake

    service = make_service(build)
    assert await run(service) is fake
    assert fake.cleanups == 0
    await service._rags.cleanup()
    assert fake.cleanups == 1
