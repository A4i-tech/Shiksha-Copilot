import asyncio
from collections import OrderedDict
import logging
from typing import Awaitable, Callable, Generic, TypeVar

from app.services.rag_adapters import BaseRagAdapter
from llama_index.llms.openai import OpenAIResponses
from llama_index.embeddings.openai import OpenAIEmbedding


logger = logging.getLogger(__name__)


T = TypeVar("T", bound=BaseRagAdapter)
class RagAdapterCache(Generic[T]):
    """
    Cache manager for RAG adapters.
    """

    def __init__(self, builder: Callable[[str, OpenAIResponses, OpenAIEmbedding], Awaitable[T]], size: int = 32):
        self._builder = builder
        self._size = size
        self._instances: OrderedDict[str, T] = OrderedDict()
        self._locks = [asyncio.Lock() for _ in range(size)]


    def _lock_for(self, key: str) -> asyncio.Lock:
        return self._locks[hash(key) % len(self._locks)]


    async def _actually_get(self, index_path: str, completion_llm: OpenAIResponses, embedding_llm: OpenAIEmbedding) -> T:
        if index_path in self._instances:
            logger.debug(f"[RAG_ADAPTER] Cache HIT (post-lock) for path: {index_path}")
            adapter = self._instances.pop(index_path)
            self._instances[index_path] = adapter
            return adapter

        adapter = await self._builder(index_path, completion_llm, embedding_llm)
        await adapter.initialize()
        self._instances[index_path] = adapter

        if len(self._instances) > self._size:
            oldest_key = next(iter(self._instances))
            evicted = self._instances.pop(oldest_key)
            await evicted.cleanup()
        return adapter


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
