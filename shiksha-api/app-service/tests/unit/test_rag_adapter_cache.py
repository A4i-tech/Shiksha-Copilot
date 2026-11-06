import asyncio

import pytest

from app.services.rag_adapter_cache import RagAdapterCache
from app.services.rag_adapters import BaseRagAdapter, QdrantRagOpsAdapter


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


async def lease(cache, path):
    async with cache.lease(path, None, None) as adapter:
        return adapter


async def test_concurrent_lease_builds_once():
    cache, built = make_cache()
    adapters = await asyncio.gather(*(lease(cache, "a") for _ in range(10)))
    assert all(adapter is adapters[0] for adapter in adapters)
    assert len(built) == 1


async def test_evicts_least_recently_used_adapter():
    cache, _ = make_cache(2)
    first = await lease(cache, "a")
    evicted = await lease(cache, "b")
    assert await lease(cache, "a") is first
    current = await lease(cache, "c")
    assert evicted.cleanups == 1
    assert first.cleanups == 0
    assert current.cleanups == 0


async def test_evict_while_leased_cleans_after_release():
    cache, _ = make_cache(1)
    async with cache.lease("a", None, None) as first:
        await lease(cache, "b")
        assert first.cleanups == 0
    assert first.cleanups == 1


async def test_cleanup_cleans_each_adapter_once():
    cache, _ = make_cache()
    first = await lease(cache, "a")
    second = await lease(cache, "b")
    await cache.cleanup()
    await cache.cleanup()
    assert first.cleanups == 1
    assert second.cleanups == 1

async def test_nested_leases_clean_after_last_release():
    cache, _ = make_cache(1)
    async with cache.lease("a", None, None) as outer:
        async with cache.lease("a", None, None):
            await lease(cache, "b")
        assert outer.cleanups == 0
    assert outer.cleanups == 1


async def test_evict_then_error_in_lease_still_cleans():
    cache, _ = make_cache(1)
    with pytest.raises(ValueError):
        async with cache.lease("a", None, None) as first:
            await lease(cache, "b")
            raise ValueError
    assert first.cleanups == 1


class FakeRagOps:
    def __init__(self):
        self.closes = 0

    async def close(self):
        self.closes += 1


async def test_eviction_closes_qdrant_rag_ops():
    async def build(path, *_):
        adapter = QdrantRagOpsAdapter(None, None, path)
        adapter._rag_ops = FakeRagOps()
        return adapter

    cache = RagAdapterCache(build, 1)
    async with cache.lease("qdrant/c1/k:v", None, None) as first:
        await lease(cache, "qdrant/c2/k:v")
        assert first.rag_ops.closes == 0
    assert first.rag_ops.closes == 1


async def test_cleanup_closes_leased_adapter_once():
    async def build(path, *_):
        adapter = QdrantRagOpsAdapter(None, None, path)
        adapter._rag_ops = FakeRagOps()
        return adapter

    cache = RagAdapterCache(build, 1)
    async with cache.lease("qdrant/c1/k:v", None, None) as first:
        await lease(cache, "qdrant/c2/k:v")
        await cache.cleanup()
    assert first.rag_ops.closes == 1
