import asyncio

from app.services.rag_adapter_cache import RagAdapterCache
from app.services.rag_adapters import BaseRagAdapter


class Adapter(BaseRagAdapter):
    def __init__(self):
        super().__init__(None, None)
        self.cleanups = 0

    async def initialize(self):
        return self

    async def initiate_index(self):
        pass

    async def cleanup(self):
        self.cleanups += 1


def make_cache(size=32):
    adapters = []

    async def build(*_):
        await asyncio.sleep(0)
        adapter = Adapter()
        adapters.append(adapter)
        return adapter

    return RagAdapterCache(build, size), adapters


async def test_concurrent_get_builds_once():
    cache, built = make_cache()
    adapters = await asyncio.gather(*(cache.get("a", None, None) for _ in range(10)))
    assert all(adapter is adapters[0] for adapter in adapters)
    assert len(built) == 1


async def test_evicts_least_recently_used_adapter():
    cache, _ = make_cache(2)
    first = await cache.get("a", None, None)
    evicted = await cache.get("b", None, None)
    assert await cache.get("a", None, None) is first
    current = await cache.get("c", None, None)
    assert evicted.cleanups == 1
    assert first.cleanups == 0
    assert current.cleanups == 0


async def test_cleanup_cleans_each_adapter_once():
    cache, _ = make_cache()
    first = await cache.get("a", None, None)
    second = await cache.get("b", None, None)
    await cache.cleanup()
    await cache.cleanup()
    assert first.cleanups == 1
    assert second.cleanups == 1
