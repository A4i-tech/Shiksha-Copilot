"""Mock implementations for Azure AI Search RAG operations used in tests."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core.schema import TransformComponent

from rag_wrapper.rag_ops.azure_ai_search_rag_ops import AzureAISearchRagOps


class MockAzureAISearchRagOps(AzureAISearchRagOps):
    """In-memory mock for AzureAISearchRagOps to support offline pytest runs."""

    def __init__(
        self,
        search_service_name: str = "mock-service",
        index_name: str = "mock-index",
        emb_llm: Optional[Any] = None,
        completion_llm: Optional[Any] = None,
        metadata_fields: Optional[Dict[str, str]] = None,
        **kwargs: Any,
    ) -> None:
        # Force API key auth path so parent init does not require managed identity
        kwargs.setdefault("api_key", "mock-key")
        kwargs.setdefault("use_managed_identity", False)
        super().__init__(
            search_service_name=search_service_name,
            index_name=index_name,
            emb_llm=emb_llm,
            completion_llm=completion_llm,
            metadata_fields=metadata_fields,
            **kwargs,
        )
        # The parent class initializes models using positional args, so correct them here
        self.emb_llm = emb_llm
        self.completion_llm = completion_llm
        self._index_initialized = False

    async def initiate_index(self) -> None:
        """Set up an in-memory index without reaching Azure."""
        if not self.storage_context:
            self.storage_context = StorageContext.from_defaults()

        if not self.rag_index:
            self.rag_index = VectorStoreIndex.from_documents(
                [],
                storage_context=self.storage_context,
                embed_model=self.emb_llm,
                callback_manager=self._callback_manager,
            )

        self._index_initialized = True

    async def index_exists(self) -> bool:
        """Report whether the mock index has been initialised."""
        return self._index_initialized

    async def persist_index(self) -> None:
        """No-op persistence for the in-memory mock."""
        return None

    def _get_credentials(self):
        """Bypass Azure credential acquisition in tests."""
        return None

    async def create_index(
        self,
        text_chunks: List[str],
        metadata: Optional[Dict[str, str]] = None,
        transformations: Optional[List[TransformComponent]] = None,
    ) -> List[str]:
        doc_ids = await super().create_index(
            text_chunks,
            metadata=metadata,
            transformations=transformations,
        )
        self._index_initialized = True
        return doc_ids

    async def insert_text_chunks(
        self,
        text_chunks: List[str],
        metadata: Optional[Dict[str, str]] = None,
        transformations: Optional[List[TransformComponent]] = None,
    ) -> List[str]:
        if not self.rag_index:
            await self.initiate_index()
        return await super().insert_text_chunks(
            text_chunks,
            metadata=metadata,
            transformations=transformations,
        )
