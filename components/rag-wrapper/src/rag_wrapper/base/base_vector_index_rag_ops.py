from abc import abstractmethod
from typing import Any, List, Dict, Optional, TypeVar, overload

from pydantic import BaseModel
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    retry_if_result,
)

from llama_index.core import (
    QueryBundle,
    StorageContext,
    VectorStoreIndex,
    get_response_synthesizer,
)
from llama_index.core.base.response.schema import RESPONSE_TYPE
from llama_index.core.chat_engine.types import AgentChatResponse
from llama_index.core.llms import ChatMessage, LLM
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.schema import TransformComponent
import traceback
from llama_index.core.response_synthesizers import ResponseMode
from llama_index.core.chat_engine import ContextChatEngine
from rag_wrapper.base.base_rag_ops import BaseRagOps


T = TypeVar("T", bound=BaseModel)


class BaseVectorIndexRagOps(BaseRagOps):
    """
    Abstract base class for RAG operations using LlamaIndex Vector Store.

    Provides methods for indexing, querying, and chat interactions
    with document collections using vector stores.

    The class uses LlamaIndex's built-in query engine and chat engine patterns,
    allowing users to pass custom configurations for flexible retrieval strategies.
    """

    rag_index: Optional[VectorStoreIndex] = None
    vector_store: Optional[Any] = None
    storage_context: Optional[StorageContext] = None

    def __init__(
        self,
        completion_llm: LLM,
        emb_llm: Optional[LLM] = None,
        similarity_top_k: int = 10,
        response_mode: ResponseMode = ResponseMode.TREE_SUMMARIZE,
    ):
        super().__init__(completion_llm, emb_llm, similarity_top_k, response_mode)

    async def _query_with_retries(
        self,
        text_str: str,
        retrieval_query: Optional[str] = None,
        metadata_filter: Optional[Dict[str, str]] = None,
    ):
        """Internal method with retry logic for robust querying."""

        @retry(
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=(retry_if_exception_type(Exception) | retry_if_result(self._retry_on_empty_string_or_timeout_response)),
            before_sleep=self._log_retry_attempt,
        )
        async def _aquery_with_retries():
            """Internal retry wrapper."""
            try:
                retriever = self.rag_index.as_retriever(similarity_top_k=self.similarity_top_k, filters=self._create_metadata_filters(metadata_filter) if metadata_filter else None)
                response_synthesizer = get_response_synthesizer(llm=self.completion_llm, response_mode=self.response_mode, callback_manager=self._callback_manager, prompt_helper=self._prompt_helper)
                query_engine = RetrieverQueryEngine(retriever=retriever, response_synthesizer=response_synthesizer, callback_manager=self._callback_manager)
                qb = QueryBundle(query_str=text_str, custom_embedding_strs=[retrieval_query or text_str])  # fallback if empty
                return await query_engine.aquery(qb)
            except Exception as e:
                self.logger.error(traceback.format_exc())
                raise e

        return await _aquery_with_retries()

    async def query_index(
        self,
        text_str: str,
        retrieval_query: Optional[str] = None,
        metadata_filter: Optional[Dict[str, str]] = None,
    ) -> Any:
        """
        Query the vector store index and generate a response using a query engine.

        Args:
            text_str: Main query for response generation
            metadata_filter: Optional metadata filters for results

        Returns:
            Generated response with context from retrieved documents
        """
        if not self.rag_index:
            exists = await self.index_exists()
            if exists:
                await self.initiate_index()
            else:
                raise ValueError(
                    "No index exists. Create an index first using create_index()."
                )

        try:
            if metadata_filter:
                await self._prequery_filter_guard(metadata_filter)
            answer = await self._query_with_retries(text_str, retrieval_query, metadata_filter)
            if self._retry_on_empty_string_or_timeout_response(answer):
                raise ValueError(f"LLM RESPONSE IS NOT VALID: {answer}")
            return answer
        except Exception as e:
            self.logger.error(f"Query failed for text '{text_str[:50]}...': {e}")
            raise

    @overload
    async def chat_with_index(self, curr_message: str, chat_history: List[ChatMessage], metadata_filter: Optional[Dict[str, str]] = None, output_cls: None = None) -> AgentChatResponse:
        ...

    @overload
    async def chat_with_index(self, curr_message: str, chat_history: List[ChatMessage], metadata_filter: Optional[Dict[str, str]] = None, output_cls: type[T] = ...) -> RESPONSE_TYPE:
        ...

    async def chat_with_index(self, curr_message: str, chat_history: List[ChatMessage], metadata_filter: Optional[Dict[str, str]] = None, output_cls: None = None) -> AgentChatResponse | RESPONSE_TYPE:
        """
        Engage in conversational interaction with the RAG index using a chat engine.

        Args:
            curr_message: Current user message
            chat_history: Previous messages for context
            metadata_filter: Optional metadata filters for results

        Returns:
            Generated response considering conversation history
        """
        if not self.rag_index:
            exists = await self.index_exists()
            if exists:
                await self.initiate_index()
            else:
                raise ValueError("No index exists. Create an index first using create_index().")

        try:
            retriever = self.rag_index.as_retriever(similarity_top_k=self.similarity_top_k, filters=self._create_metadata_filters(metadata_filter) if metadata_filter else None)
            if output_cls is not None:
                llm = self.completion_llm.as_structured_llm(output_cls=output_cls)
                response_synthesizer = get_response_synthesizer(llm=llm, response_mode=self.response_mode, callback_manager=self._callback_manager, prompt_helper=self._prompt_helper)
                query_engine = RetrieverQueryEngine(retriever=retriever, response_synthesizer=response_synthesizer, callback_manager=self._callback_manager)
                response = await query_engine.aquery(curr_message)
            else:
                chat_engine = ContextChatEngine.from_defaults(retriever=retriever, llm=self.completion_llm, chat_history=chat_history[-6:], callback_manager=self._callback_manager)
                response = await chat_engine.achat(curr_message)
            self.logger.debug(f"Chat response generated for message: {curr_message[:50]}...")
            return response
        except Exception as e:
            self.logger.error(f"Chat failed for message '{curr_message[:50]}...': {e}")
            self.logger.error(traceback.format_exc())
            raise

    async def create_index(
        self,
        text_chunks: List[str],
        metadata: dict = None,
        transformations: List[TransformComponent] = None,
    ) -> List[str]:
        """
        Create a new index from text chunks.

        Creates a new index object every time it is called, replacing any existing index.

        Args:
            text_chunks: List of text segments to index
            metadata: Optional metadata for all chunks

        Returns:
            List of document IDs for the indexed chunks
        """
        try:
            if not self.rag_index:
                await self.initiate_index()

            documents, doc_ids = self._create_documents_from_text_chunks(text_chunks, metadata)

            # Create a new index from documents
            self.rag_index = VectorStoreIndex.from_documents(
                documents,
                storage_context=self.storage_context,
                embed_model=self.emb_llm,
                use_async=True,
                transformations=transformations,
                callback_manager=self._callback_manager,
            )
            self.logger.info(f"Created new index with {len(documents)} documents")
            await self.persist_index()
            self.logger.info(f"Successfully indexed {len(documents)} documents")
            return doc_ids
        except Exception as e:
            self.logger.error(f"Failed to create index: {e}")
            raise

    async def insert_text_chunks(
        self,
        text_chunks: List[str],
        metadata: dict = None,
        transformations: List[TransformComponent] = None,
    ) -> List[str]:
        """
        Insert text chunks into an existing vector store index.

        Args:
            text_chunks: List of text segments to insert
            metadata: Optional metadata for all chunks
            transformations: Optional list of transformations to apply

        Returns:
            List of document IDs for the inserted chunks
        """
        if not self.rag_index:
            raise ValueError("Index must be created before inserting text chunks")

        try:
            # Create documents from text chunks
            documents, doc_ids = self._create_documents_from_text_chunks(
                text_chunks, metadata
            )

            # Set transformations on the index if provided
            if transformations:
                self.rag_index._transformations = transformations

            # Insert documents
            for document in documents:
                self.rag_index.insert(document)

            self.logger.info(f"Successfully inserted {len(documents)} text chunks")

            # Persist the updated index
            await self.persist_index()

            return doc_ids

        except Exception as e:
            self.logger.error(f"Failed to insert text chunks: {e}")
            raise

    async def delete_documents(
        self,
        doc_ids: List[str],
    ) -> None:
        """
        Delete documents from the vector store index.

        Args:
            doc_ids: List of document IDs to delete
        """
        if not self.rag_index:
            raise ValueError("Index must be created before deleting documents")

        try:
            for doc_id in doc_ids:
                self.rag_index.delete(doc_id)

            self.logger.info(f"Successfully deleted {len(doc_ids)} documents")

            # Persist the updated index
            await self.persist_index()

        except Exception as e:
            self.logger.error(f"Failed to delete documents: {e}")
            raise

    async def _prequery_filter_guard(
        self, metadata_filter: Optional[Dict[str, Any]]
    ) -> None:
        """Hook to validate that the metadata filter has at least one match.
        Default no-op; override in backend-specific subclasses."""
        return

    @abstractmethod
    async def persist_index(self):
        """Persist the index to storage backend."""
        pass

    @abstractmethod
    async def initiate_index(self):
        """Initialize the RAG index only if it already exists in the storage backend.

        This method should check if the index exists using index_exists(),
        and only instantiate an index object if it does exist.
        Otherwise, it should not create a new index.
        """
        pass

    @abstractmethod
    async def index_exists(self) -> bool:
        """Check if the index already exists in the storage backend."""
        pass

    # New utility methods for vector store operations

    def from_existing_vector_store(self, vector_store: Any, **kwargs) -> None:
        """Create a vector store index from existing vector store.

        Args:
            vector_store: Existing vector store
            **kwargs: Additional arguments for VectorStoreIndex.from_vector_store
        """
        try:
            self.vector_store = vector_store

            # Update storage context
            self.storage_context = StorageContext.from_defaults(
                vector_store=self.vector_store,
            )

            # Create index from existing store
            self.rag_index = VectorStoreIndex.from_vector_store(
                vector_store=self.vector_store,
                embed_model=self.emb_llm,
                callback_manager=self._callback_manager,
                **kwargs,
            )

            self.logger.info("Successfully created index from existing vector store")

        except Exception as e:
            self.logger.error(f"Failed to create index from existing vector store: {e}")
            raise
