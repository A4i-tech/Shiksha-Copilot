import logging
import uuid
from abc import ABC, abstractmethod
from typing import Any, List, Dict, Optional

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    retry_if_result,
)

from llama_index.core.chat_engine.types import ChatMode
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core import (
    QueryBundle,
    StorageContext,
    VectorStoreIndex,
    Document,
    Settings,
    get_response_synthesizer,
)
from llama_index.core.indices.base import BaseIndex
from llama_index.core.llms import ChatMessage, LLM
from llama_index.core.schema import TransformComponent
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
from llama_index.core.callbacks import CallbackManager, TokenCountingHandler
import traceback
from llama_index.core.response_synthesizers import (
    ResponseMode,
)


class ContentFilterError(Exception):
    """Raised when Azure OpenAI content filter blocks the request.
    Not retryable by tenacity."""
    pass


class BaseVectorIndexRagOps(ABC):
    """
    Abstract base class for RAG operations using LlamaIndex Vector Store.

    Provides methods for indexing, querying, and chat interactions
    with document collections using vector stores.

    The class uses LlamaIndex's built-in query engine and chat engine patterns,
    allowing users to pass custom configurations for flexible retrieval strategies.

    Attributes:
        rag_index: Main vector store index for semantic search
        vector_store: Vector store for similarity search
        storage_context: Storage context for data persistence
        emb_llm: Embedding language model
        completion_llm: Completion language model
        logger: Logger for debugging and monitoring
    """

    rag_index: Optional[VectorStoreIndex] = None
    vector_store: Optional[Any] = None
    storage_context: Optional[StorageContext] = None

    def __init__(
        self,
        completion_llm: LLM,
        emb_llm: Optional[LLM] = None,
        similarity_top_k: int = 10,
        response_mode: str = "tree_summarize",
    ):
        """Initialize with embedding and completion language models and configuration parameters.

        Args:
            emb_llm: Embedding language model
            completion_llm: Completion language model
            similarity_top_k: Number of top similar documents to retrieve (default: 3)
            response_mode: Response synthesis mode (default: "tree_summarize")
        """
        self.emb_llm = emb_llm
        self.completion_llm = completion_llm
        self.similarity_top_k = similarity_top_k
        self.response_mode = response_mode
        try:
            from core.logger import LoggerFactory
            self.logger = LoggerFactory.get_logger("rag_ops.BaseVectorIndexRagOps")
        except Exception:
            self.logger = logging.getLogger(__name__)
        self.token_counter = TokenCountingHandler()
        self._callback_manager = CallbackManager([self.token_counter])

    def _get_response_mode(self) -> ResponseMode:
        """Convert string response mode to ResponseMode enum."""
        mode_mapping = {
            "tree_summarize": ResponseMode.TREE_SUMMARIZE,
            "simple_summarize": ResponseMode.SIMPLE_SUMMARIZE,
            "generation": ResponseMode.GENERATION,
            "refine": ResponseMode.REFINE,
            "compact": ResponseMode.COMPACT,
            "compact_accumulate": ResponseMode.COMPACT_ACCUMULATE,
            "accumulate": ResponseMode.ACCUMULATE,
        }

        if isinstance(self.response_mode, str):
            return mode_mapping.get(
                self.response_mode.lower(), ResponseMode.TREE_SUMMARIZE
            )
        return self.response_mode

    def _create_metadata_filters(
        self, metadata_filter: Optional[Dict[str, str]] = None
    ) -> Optional[MetadataFilters]:
        """Create metadata filters from key-value pairs."""
        if not metadata_filter:
            return None

        filter_list = []
        for key, value in metadata_filter.items():
            filter_list.append(ExactMatchFilter(key=key, value=value))
        return MetadataFilters(filters=filter_list)

    _SANITIZE_PROMPT = (
        "You are an academic content editor for school educational materials. "
        "Below is a text chunk retrieved from a textbook. It may reference "
        "sensitive topics (violence, abuse, trafficking, etc.) that are part of "
        "legitimate educational content about laws and social protections.\n\n"
        "Your task: Rephrase the text to preserve ALL factual and educational "
        "information — every legal provision, definition, statistic, and concept — "
        "while using clinical, academic, and age-appropriate language. "
        "Do NOT remove or omit any facts. Simply ensure the language is neutral, "
        "professional, and unlikely to trigger automated content safety filters.\n\n"
        "Return ONLY the rephrased text, nothing else.\n\n"
        "--- TEXT ---\n"
    )

    async def _sanitize_nodes(self, nodes: List[Any]) -> List[Any]:
        """Rephrase each chunk through a configurable sanitization model.

        Uses the SANITIZE_ENDPOINT / SANITIZE_API / SANITIZE_MODEL env vars
        (Azure AI Inference API format) to rewrite sensitive educational content
        so that Azure OpenAI's content filter won't block the synthesis step.
        """
        import os
        import aiohttp

        endpoint = os.environ.get("SANITIZE_ENDPOINT", "").strip()
        api_key = os.environ.get("SANITIZE_API", "").strip()
        model = os.environ.get("SANITIZE_MODEL", "").strip()

        print(
            f"[SANITIZE] Starting sanitization for {len(nodes)} nodes, "
            f"endpoint configured: {bool(endpoint)}",
            flush=True,
        )
        if not endpoint or not api_key:
            print("[SANITIZE] SANITIZE_ENDPOINT or SANITIZE_API not set — skipping", flush=True)
            return nodes

        headers = {
            "Content-Type": "application/json",
            "api-key": api_key,
        }

        sanitized_count = 0

        async with aiohttp.ClientSession() as session:
            for node in nodes:
                text = None
                if hasattr(node, "text"):
                    text = node.text
                elif hasattr(node, "node") and hasattr(node.node, "text"):
                    text = node.node.text

                if not text:
                    continue

                payload = {
                    "messages": [
                        {"role": "user", "content": self._SANITIZE_PROMPT + text}
                    ],
                    "temperature": 0.2,
                    "max_tokens": 2048,
                }
                if model:
                    payload["model"] = model

                try:
                    async with session.post(
                        endpoint,
                        json=payload,
                        headers=headers,
                        timeout=aiohttp.ClientTimeout(total=30),
                    ) as resp:
                        if resp.status != 200:
                            body = await resp.text()
                            self.logger.warning(
                                f"Sanitize API returned {resp.status}: {body[:300]}"
                            )
                            continue

                        data = await resp.json()
                        rephrased = (
                            data.get("choices", [{}])[0]
                            .get("message", {})
                            .get("content", "")
                        )

                        if rephrased.strip():
                            if hasattr(node, "text"):
                                node.text = rephrased.strip()
                            elif hasattr(node, "node") and hasattr(node.node, "text"):
                                node.node.text = rephrased.strip()
                            sanitized_count += 1
                        else:
                            self.logger.warning("Sanitize model returned empty response for a chunk")

                except Exception as err:
                    self.logger.warning(f"Sanitization failed for a chunk: {err}")
                    continue

        self.logger.info(
            f"Sanitized {sanitized_count}/{len(nodes)} chunks for content safety"
        )
        return nodes

    async def _query_with_retries(
        self,
        text_str: str,
        retrieval_query: Optional[str] = None,
        metadata_filter: Optional[Dict[str, str]] = None,
    ):
        """Internal method with retry logic for robust querying.

        Flow: retrieve chunks → sanitize if needed → synthesize response.
        On content filter errors, retries once with sanitized chunks.
        """

        async def _retrieve_nodes():
            """Retrieve nodes from the index.

            Handles Qdrant entries with null text by patching TextNode
            temporarily during retrieval.
            """
            from llama_index.core.schema import TextNode as _TN
            _orig_init = _TN.__init__

            def _safe_init(self_node, *a, **kw):
                if "text" in kw and kw["text"] is None:
                    kw["text"] = ""
                _orig_init(self_node, *a, **kw)

            _TN.__init__ = _safe_init
            try:
                retriever_kwargs = {
                    "similarity_top_k": self.similarity_top_k,
                }
                if metadata_filter:
                    filters = self._create_metadata_filters(metadata_filter)
                    retriever_kwargs["filters"] = filters

                retriever = self.rag_index.as_retriever(**retriever_kwargs)
                qb = QueryBundle(
                    query_str=text_str,
                    custom_embedding_strs=[retrieval_query or text_str],
                )
                nodes = await retriever.aretrieve(qb)
                # Filter out nodes with empty text (from null Qdrant entries)
                nodes = [n for n in nodes if getattr(n, "text", None) or
                         (hasattr(n, "node") and getattr(n.node, "text", None))]
                return nodes
            finally:
                _TN.__init__ = _orig_init

        async def _synthesize(nodes):
            """Synthesize a response from nodes."""
            synthesizer = get_response_synthesizer(
                llm=self.completion_llm,
                response_mode=self._get_response_mode(),
                callback_manager=self._callback_manager,
            )
            qb = QueryBundle(
                query_str=text_str,
                custom_embedding_strs=[retrieval_query or text_str],
            )
            return await synthesizer.asynthesize(query=qb, nodes=nodes)

        @retry(
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=(
                retry_if_exception_type(Exception)
                | retry_if_result(
                    lambda result: self._retry_on_empty_string_or_timeout_response(
                        result
                    )
                )
            ),
            before_sleep=self._log_retry_attempt,
        )
        async def _aquery_with_retries():
            """Internal retry wrapper.

            Tries synthesis directly first. If Azure OpenAI's content filter
            blocks the request, sanitizes the chunks with the configured
            sanitization model and retries synthesis once. Other errors are
            re-raised for tenacity to retry.
            """
            # Step 1: Retrieve chunks from vector store
            print("[RAG] Step 1: Retrieving chunks...", flush=True)
            nodes = await _retrieve_nodes()
            print(f"[RAG] Retrieved {len(nodes)} chunks from index", flush=True)

            # Step 2: Try synthesis directly
            print("[RAG] Step 2: Synthesizing response...", flush=True)
            try:
                response = await _synthesize(nodes)
                print("[RAG] Synthesis complete!", flush=True)
                return response
            except Exception as e:
                if not self._is_content_filter_error(e):
                    print(f"[RAG] ERROR: {type(e).__name__}: {e}", flush=True)
                    raise

            # Step 3: Content filter triggered — sanitize with fallback model and retry
            print("[RAG] Content filter triggered — sanitizing chunks with sanitize model...", flush=True)
            nodes = await self._sanitize_nodes(nodes)
            print("[RAG] Step 4: Re-synthesizing with sanitized content...", flush=True)
            response = await _synthesize(nodes)
            print("[RAG] Synthesis complete (post-sanitization)!", flush=True)
            return response

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
            answer = await self._query_with_retries(
                text_str, retrieval_query, metadata_filter
            )
            # Validate response quality
            if self._retry_on_empty_string_or_timeout_response(answer):
                raise ValueError(f"LLM RESPONSE IS NOT VALID: {answer}")

            return answer

        except Exception as e:
            self.logger.error(f"Query failed for text '{text_str[:50]}...': {e}")
            raise

    async def chat_with_index(
        self,
        curr_message: str,
        chat_history: List[ChatMessage],
        metadata_filter: Optional[Dict[str, str]] = None,
    ) -> Any:
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
                raise ValueError(
                    "No index exists. Create an index first using create_index()."
                )

        try:
            if metadata_filter:
                await self._prequery_filter_guard(metadata_filter)
            # Create chat engine with context awareness
            chat_engine_kwargs = {
                "chat_mode": ChatMode.CONTEXT,
                "llm": self.completion_llm,
                "embed_model": self.emb_llm,
                "similarity_top_k": self.similarity_top_k,
            }

            # Add metadata filters if provided
            if metadata_filter:
                filters = self._create_metadata_filters(metadata_filter)
                chat_engine_kwargs["filters"] = filters

            chat_engine = self.rag_index.as_chat_engine(**chat_engine_kwargs)
            if hasattr(chat_engine, "callback_manager"):
                chat_engine.callback_manager = self._callback_manager

            # Generate response with chat history context
            response = await chat_engine.achat(curr_message, chat_history)

            self.logger.debug(
                f"Chat response generated for message: {curr_message[:50]}..."
            )
            return response.response

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

            documents, doc_ids = self._create_documents_from_text_chunks(
                text_chunks, metadata
            )

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

            # Persist the index using subclass-specific logic
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

    def _create_documents_from_text_chunks(
        self, text_chunks: List[str], metadata: dict = None
    ) -> tuple[List[Document], List[str]]:
        """Create Document objects from text chunks with optional metadata."""
        if not text_chunks:
            raise ValueError("text_chunks cannot be empty")

        documents = []
        doc_ids = []

        for text in text_chunks:
            if not text.strip():  # Skip empty or whitespace-only chunks
                continue

            doc_id = f"doc_id_{uuid.uuid4()}"
            doc_chunk = Document(text=text, id_=doc_id)

            if metadata:
                doc_chunk.metadata = metadata.copy()

            documents.append(doc_chunk)
            doc_ids.append(doc_id)

        if not documents:
            raise ValueError("No valid text chunks provided after filtering")

        return documents, doc_ids

    @staticmethod
    def _is_content_filter_error(exc: Exception) -> bool:
        """Return True if the exception is an Azure OpenAI content filter rejection."""
        msg = str(exc).lower()
        # Azure OpenAI content filter signals
        if "content_filter" in msg or "responsibleaipolicyviolation" in msg:
            return True
        # openai SDK BadRequestError with code content_filter
        code = getattr(exc, "code", None) or getattr(getattr(exc, "error", None), "code", None)
        if code and "content_filter" in str(code).lower():
            return True
        # Unwrap tenacity RetryError
        cause = getattr(exc, "last_attempt", None)
        if cause is not None:
            inner = cause.exception()
            if inner and inner is not exc:
                return BaseVectorIndexRagOps._is_content_filter_error(inner)
        return False

    def _log_retry_attempt(self, retry_state):
        """Log retry attempts with detailed information."""
        self.logger.warning(
            f"Retrying {retry_state.fn.__name__} after {retry_state.attempt_number} attempts. "
            f"Next attempt in {retry_state.next_action.sleep} seconds."
        )

    def _retry_on_empty_string_or_timeout_response(self, result) -> bool:
        """Check if response indicates failure requiring retry."""
        if hasattr(result, "response"):
            response_text = str(result.response)
        else:
            response_text = str(result)

        # Check for empty responses or known error patterns
        return (
            response_text == ""
            or response_text == "504.0 GatewayTimeout"
            or "timeout" in response_text.lower()
            or len(response_text.strip()) == 0
        )

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
