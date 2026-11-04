import asyncio
from collections import OrderedDict
from contextlib import asynccontextmanager
import logging
from typing import AsyncIterator, Awaitable, Callable, Generic, TypeVar

from app.config import settings
from app.services.rag_adapters import BaseRagAdapter, RagAdapterFactory
from llama_index.llms.openai import OpenAIResponses
from llama_index.embeddings.openai import OpenAIEmbedding


logger = logging.getLogger(__name__)


T = TypeVar("T", bound=BaseRagAdapter)
class RagAdapterCache(Generic[T]):
    """
    Cache manager for RAG adapters.
    """

    @classmethod
    async def from_factory(cls, index_path: str, completion_llm: OpenAIResponses, embedding_llm: OpenAIEmbedding):
        adapter = RagAdapterFactory.create_adapter(index_path, completion_llm, embedding_llm)
        await adapter.initialize()
        await adapter.initiate_index()
        return adapter


    def __init__(self, builder: Callable[[str, OpenAIResponses, OpenAIEmbedding], Awaitable[T]], size: int = settings.rag_adapter_cache_size):
        self._builder = builder
        size = size or settings.rag_adapter_cache_size
        self._size = size
        self._instances: OrderedDict[str, T] = OrderedDict()
        self._locks = [asyncio.Lock() for _ in range(size)]
        self._retired: list[T] = []
        self._refs: dict[int, int] = {}


    def _lock_for(self, key: str) -> asyncio.Lock:
        return self._locks[hash(key) % len(self._locks)]


    async def _actually_get(self, index_path: str, completion_llm: OpenAIResponses, embedding_llm: OpenAIEmbedding) -> T:
        if index_path in self._instances:
            logger.debug(f"[RAG_ADAPTER] Cache HIT (post-lock) for path: {index_path}")
            adapter = self._instances.pop(index_path)
            self._instances[index_path] = adapter
            return adapter

        adapter = await self._builder(index_path, completion_llm, embedding_llm)
        self._instances[index_path] = adapter

        if len(self._instances) > self._size:
            oldest_key = next(iter(self._instances))
            evicted = self._instances.pop(oldest_key)
            if self._refs.get(id(evicted)):
                self._retired.append(evicted)
            else:
                await evicted.cleanup()
        return adapter


    @asynccontextmanager
    async def lease(self, index_path: str, completion_llm: OpenAIResponses, embedding_llm: OpenAIEmbedding) -> AsyncIterator[T]:
        async with self._lock_for(index_path):
            adapter = await self._actually_get(index_path, completion_llm, embedding_llm)
            self._refs[id(adapter)] = self._refs.get(id(adapter), 0) + 1
        try:
            yield adapter
        finally:
            self._refs[id(adapter)] -= 1
            if not self._refs[id(adapter)]:
                del self._refs[id(adapter)]
                if adapter in self._retired:
                    self._retired.remove(adapter)
                    await adapter.cleanup()


    async def _cleanup_one(self, index_path: str):
        async with self._lock_for(index_path):
            adapter = self._instances.pop(index_path, None)
        if adapter is not None:
            await adapter.cleanup()


    async def cleanup(self):
        paths = list(self._instances.keys())
        await asyncio.gather(*(self._cleanup_one(p) for p in paths))
        retired, self._retired = self._retired, []
        await asyncio.gather(*(a.cleanup() for a in retired))
