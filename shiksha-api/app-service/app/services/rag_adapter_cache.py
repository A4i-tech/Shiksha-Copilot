import logging
import asyncio
import json
from collections import OrderedDict
from typing import List, Dict, Any

# 1. Native Azure Client
from openai import AzureOpenAI

# 2. Native Qdrant Client (replaces LlamaIndex vector store)
from qdrant_client import QdrantClient

from app.config import settings

logger = logging.getLogger(__name__)

class NativeQdrantRagAdapter:
    """
    Implements Manual RAG using Native Azure OpenAI (for Embeddings/Chat)
    and Native Qdrant Client (for Retrieval).
    """
    def __init__(
        self, 
        client: AzureOpenAI, 
        collection_name: str, 
        embedding_model: str,
        chat_model: str
    ):
        self.client = client
        self.collection_name = collection_name
        self.embedding_model = embedding_model
        self.chat_model = chat_model
        
        # Initialize Qdrant Client based on settings
        if settings.qdrant_url and settings.qdrant_api_key:
            self.qdrant = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
            )
        else:
            # Fallback for local dev if needed, or raise error
            logger.warning("Qdrant credentials missing, RAG may fail.")
            self.qdrant = None

    async def initialize(self):
        """Verify connection or collection existence."""
        if self.qdrant:
            try:
                # Optional: Check if collection exists
                await asyncio.to_thread(
                    self.qdrant.get_collection, self.collection_name
                )
            except Exception as e:
                logger.error(f"Failed to connect to Qdrant collection {self.collection_name}: {e}")

    async def cleanup(self):
        """Close connections if necessary."""
        if self.qdrant:
            self.qdrant.close()

    async def _get_embedding(self, text: str) -> List[float]:
        """Generate embedding using Azure OpenAI native client."""
        # Clean newlines to avoid embedding issues
        text = text.replace("\n", " ")
        response = await asyncio.to_thread(
            self.client.embeddings.create,
            input=[text],
            model=self.embedding_model
        )
        return response.data[0].embedding

    async def _retrieve_context(self, query: str, top_k: int = 5) -> str:
        """Search Qdrant for context."""
        if not self.qdrant:
            return ""

        try:
            # 1. Get Vector
            vector = await self._get_embedding(query)

            # 2. Search Qdrant
            search_result = await asyncio.to_thread(
                self.qdrant.search,
                collection_name=self.collection_name,
                query_vector=vector,
                limit=top_k
            )

            # 3. Extract Text (assuming payload has a 'text' or 'content' field)
            # Adjust 'content' key based on how your data was ingested
            context_chunks = []
            for hit in search_result:
                payload = hit.payload or {}
                # Common payload keys: 'content', 'text', 'document'
                text = payload.get("content") or payload.get("text") or str(payload)
                context_chunks.append(text)

            return "\n\n".join(context_chunks)

        except Exception as e:
            logger.error(f"Retrieval failed: {e}")
            return ""

    async def chat_with_index(self, curr_message: str, chat_history: List[Dict[str, str]]) -> str:
        """
        Performs RAG: Retrieve Context -> Append to System Prompt -> Chat.
        """
        try:
            # 1. Retrieve Context
            context_text = await self._retrieve_context(curr_message)
            
            # 2. Prepare Messages
            # We clone the history so we don't mutate the original list
            messages = list(chat_history)
            
            # 3. Inject Context into the System Prompt or as a new System message
            if context_text:
                rag_instruction = (
                    "\n\nContext information from the textbook is provided below. "
                    "Use this information to answer the user request strictly.\n"
                    f"---------------------\n{context_text}\n---------------------\n"
                )
                
                # If the first message is system, append to it. Otherwise add new system message.
                if messages and messages[0]['role'] == 'system':
                    messages[0]['content'] += rag_instruction
                else:
                    messages.insert(0, {"role": "system", "content": rag_instruction})

            # 4. Add user message
            messages.append({"role": "user", "content": curr_message})

            # 5. Call Chat Completion
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.chat_model,
                messages=messages,
                temperature=0.1, # Low temp for factual Q&A
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Error in Native Qdrant Adapter chat: {e}")
            raise e


class RagAdapterCache:
    """
    Cache manager for Qdrant-based RAG adapters.
    """

    def __init__(self, max_cache_size: int = 32):
        self._rag_adapter_cache: OrderedDict[str, NativeQdrantRagAdapter] = OrderedDict()
        self._cache_size = max_cache_size

    async def get_or_create_adapter(
        self,
        index_path: str, # Acts as Collection Name
        client: AzureOpenAI,
        embedding_model: str,
        chat_model: str,
    ) -> NativeQdrantRagAdapter:
        
        cache_key = index_path

        if cache_key in self._rag_adapter_cache:
            adapter = self._rag_adapter_cache.pop(cache_key)
            self._rag_adapter_cache[cache_key] = adapter
            return adapter

        # Create new adapter
        adapter = NativeQdrantRagAdapter(
            client=client,
            collection_name=index_path,
            embedding_model=embedding_model,
            chat_model=chat_model
        )

        await adapter.initialize()

        self._rag_adapter_cache[cache_key] = adapter

        if len(self._rag_adapter_cache) > self._cache_size:
            oldest_key = next(iter(self._rag_adapter_cache))
            evicted = self._rag_adapter_cache.pop(oldest_key)
            await evicted.cleanup()

        return adapter

    async def cleanup(self) -> None:
        for adapter in self._rag_adapter_cache.values():
            await adapter.cleanup()
        self._rag_adapter_cache.clear()

RAG_ADAPTER_CACHE = RagAdapterCache()