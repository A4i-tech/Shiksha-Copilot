import asyncio
from collections import OrderedDict
import logging
from typing import Awaitable, Callable, Generic, TypeVar

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

    # ponytail: grace period instead of refcounting, a query running longer than this can hit a closed client
    retire_grace = 60.0
    max_retired = 8

    @classmethod
    async def from_factory(cls, index_path: str, completion_llm: OpenAIResponses, embedding_llm: OpenAIEmbedding):
        adapter = RagAdapterFactory.create_adapter(index_path, completion_llm, embedding_llm)
        await adapter.initialize()
        await adapter.initiate_index()
        return adapter


    def __init__(self, builder: Callable[[str, OpenAIResponses, OpenAIEmbedding], Awaitable[T]], size: int = settings.rag_adapter_cache_size):
        self._builder = builder
        self._size = size
        self._instances: OrderedDict[str, T] = OrderedDict()
        self._locks = [asyncio.Lock() for _ in range(size)]
        self._retired: list[T] = []
        self._retire_tasks: set[asyncio.Task] = set()


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
            self._retired.append(evicted)
            if len(self._retired) > self.max_retired:
                await self._retired.pop(0).cleanup()
            task = asyncio.create_task(self._retire(evicted))
            self._retire_tasks.add(task)
            task.add_done_callback(self._retire_tasks.discard)
        return adapter


    async def _retire(self, adapter: T):
        await asyncio.sleep(self.retire_grace)  # in-flight callers still hold the evicted adapter
        if adapter in self._retired:
            self._retired.remove(adapter)
            await adapter.cleanup()


    async def get(self, index_path: str, completion_llm: OpenAIResponses, embedding_llm: OpenAIEmbedding) -> T:
        async with self._lock_for(index_path):
            return await self._actually_get(index_path, completion_llm, embedding_llm)


    async def _cleanup_one(self, index_path: str):
        async with self._lock_for(index_path):
            adapter = self._instances.pop(index_path, None)
        if adapter is not None:
            await adapter.cleanup()


    async def cleanup(self):
        paths = list(self._instances.keys())
        await asyncio.gather(*(self._cleanup_one(p) for p in paths))
        self._instances.clear()
        retired, self._retired = self._retired, []
        await asyncio.gather(*(a.cleanup() for a in retired))