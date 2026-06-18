import logging
from abc import ABC
from typing import Any, Dict, List, Optional
import uuid

from llama_index.core import Document, StorageContext, VectorStoreIndex
from llama_index.core.indices.prompt_helper import PromptHelper
from llama_index.core.llms import LLM
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
from llama_index.core.callbacks import CallbackManager, TokenCountingHandler
from llama_index.core.response_synthesizers import ResponseMode


class BaseRagOps(ABC):
    """
    Abstract base class for RAG operations.

    Attributes:
        rag_index: Main vector store index for semantic search
        vector_store: Vector store for similarity search
        storage_context: Storage context for data persistence
        emb_llm: Embedding language model
        completion_llm: Completion language model
        logger: Logger for debugging and monitoring
    """

    rag_index: Optional[VectorStoreIndex]
    vector_store: Optional[Any]
    storage_context: Optional[StorageContext]
    emb_llm: Optional[LLM]
    completion_llm: LLM
    logger: logging.Logger

    similarity_top_k: int
    response_mode: ResponseMode
    tokn_counter: TokenCountingHandler
    _callback_manager: CallbackManager
    _prompt_helper: PromptHelper

    def __init__(
        self,
        completion_llm: LLM,
        emb_llm: Optional[LLM],
        similarity_top_k: int,
        response_mode: ResponseMode,
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
        self.logger = logging.getLogger(__name__)
        self.token_counter = TokenCountingHandler()
        self._callback_manager = CallbackManager([self.token_counter])
        self._prompt_helper = PromptHelper.from_llm_metadata(self.completion_llm.metadata)


    def _create_metadata_filters(self, metadata_filter: Optional[Dict[str, str]] = None) -> Optional[MetadataFilters]:
        """Create metadata filters from key-value pairs."""
        if not metadata_filter:
            return None
        return MetadataFilters(filters=[ExactMatchFilter(key=k, value=v) for k, v in metadata_filter.items()])


    def _create_documents_from_text_chunks(self, text_chunks: List[str], metadata: Optional[dict] = None) -> tuple[List[Document], List[str]]:
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
