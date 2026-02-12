import os
from pathlib import Path
import logging
import re
from typing import Optional
from app.config import settings
from app.models.chat import LessonChatRequest
from app.utils.prompt_template import PromptTemplate
from app.services.rag_adapters import BaseRagAdapter
from app.services.rag_adapter_cache import RAG_ADAPTER_CACHE
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.core.llms import ChatMessage

logger = logging.getLogger(__name__)


class LessonChatService:
    """Service for handling lesson chat interactions using RAGWrapper."""

    def __init__(self):
        """Initialize the lesson chat service with LLM models and blob store."""
        # Initialize prompt template with the chat prompts file
        prompts_file_path = (
            Path(__file__).parent.parent.parent / "prompts" / "chat_prompts.yaml"
        )
        self._prompt_template = PromptTemplate(str(prompts_file_path))

        # Initialize Azure OpenAI completion model
        self._completion_llm = AzureOpenAI(
            model=settings.azure_openai_deployment_name,
            deployment_name=settings.azure_openai_deployment_name,
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint,
        )

        # Initialize Azure OpenAI embedding model
        self._embedding_llm = AzureOpenAIEmbedding(
            model=settings.azure_openai_embed_model,
            deployment_name=settings.azure_openai_embed_model,
            api_key=settings.azure_openai_api_key,
            azure_endpoint=settings.azure_openai_endpoint,
            api_version=settings.azure_openai_api_version,
        )

        # Initialize LRU cache for RAG adapter instances (max 32 items)
        self._rag_adapter_cache = RAG_ADAPTER_CACHE

    async def __call__(
        self,
        request: LessonChatRequest,
    ) -> dict:
        """
        Process a lesson chat request and return the response.

        Args:
            request: The lesson chat request containing messages and index path

        Returns:
            dict: Contains 'response' (str) and 'references' (list of dicts)
        """
        try:
            # Get or create cached RAG adapter instance
            rag_adapter = await self._get_or_create_rag_adapter(request.index_path)

            # Initiate the index (download files for InMem, no-op for Qdrant)
            await rag_adapter.initiate_index()

            # Extract chapter details and build system message
            system_message = self._prompt_template.get_prompt_with_variables(
                "lesson_chat", **self._extract_details(request.chapter_id)
            )

            # Convert request messages to chat format
            chat_messages = [
                ChatMessage(role=message.role.value, content=message.message)
                for message in request.messages
            ]

            # Build chat history with system message and previous messages
            chat_history = [
                ChatMessage(role="system", content=system_message)
            ] + chat_messages[:-1]

            # Get response from RAG system using current message and chat history
            result = await rag_adapter.chat_with_index(
                curr_message=chat_messages[-1].content, chat_history=chat_history
            )

            response_text = result.get("response", "")
            source_nodes = result.get("source_nodes", [])

            # Format source nodes as references
            references = self._format_source_references(source_nodes)

            return {"response": response_text, "references": references}

        except Exception as e:
            logger.error(f"Error in lesson chat service: {e}", exc_info=True)
            raise

    def _format_source_references(self, source_nodes) -> list:
        """
        Format RAG source nodes into a list of reference dicts.

        Args:
            source_nodes: List of LlamaIndex NodeWithScore objects

        Returns:
            List of dicts with 'title' and 'text' keys
        """
        references = []
        seen_pages = set()

        for node in source_nodes:
            metadata = getattr(node, "metadata", {}) or {}
            if hasattr(node, "node"):
                metadata = getattr(node.node, "metadata", metadata) or metadata

            page_label = metadata.get("page_label", "")
            source = metadata.get("source", metadata.get("file_name", ""))

            # Create a meaningful title
            if page_label:
                title = f"Page {page_label}"
                if source:
                    title += f" - {source}"
            elif source:
                title = source
            else:
                title = "Source Document"

            # Deduplicate by page
            dedup_key = f"{source}_{page_label}"
            if dedup_key in seen_pages:
                continue
            seen_pages.add(dedup_key)

            # Get a text snippet from the source node
            text = ""
            if hasattr(node, "node") and hasattr(node.node, "text"):
                text = node.node.text[:200]
            elif hasattr(node, "text"):
                text = node.text[:200]

            if text:
                text = text.strip() + "..."

            references.append({"title": title, "text": text})

        return references

    def _extract_details(self, chapter_id: str):
        """
        Extract chapter details from the chapter ID string.

        Args:
            chapter_id: Formatted string containing chapter metadata

        Returns:
            dict: Dictionary with extracted chapter details (board, medium, grade, etc.)

        Raises:
            ValueError: If chapter_id format is invalid
        """
        # Define regex pattern to parse chapter ID format
        pattern = r"Board=(?P<board>[^,]+),Medium=(?P<medium>[^,]+),Grade=(?P<grade>[^,]+),Subject=(?P<subject>[^,]+),Number=(?P<number>[^,]+),Title=(?P<title>.+)"
        match = re.match(pattern, chapter_id)

        if match:
            return {
                "BOARD": match.group("board"),
                "MEDIUM": match.group("medium"),
                "GRADE": match.group("grade"),
                "SUBJECT": match.group("subject"),
                "CHAPTER_NUMBER": match.group("number"),
                "CHAPTER_TITLE": match.group("title"),
            }
        else:
            raise ValueError(f"Invalid chapter_id format: {chapter_id}")

    async def _get_or_create_rag_adapter(self, index_path: str) -> BaseRagAdapter:
        """
        Get or create a RAG adapter instance with LRU caching.

        Args:
            index_path: Path to the RAG index

        Returns:
            BaseRagAdapter: Cached or newly created RAG adapter instance
        """
        return await self._rag_adapter_cache.get_or_create_adapter(
            index_path=index_path,
            completion_llm=self._completion_llm,
            embedding_llm=self._embedding_llm,
        )

    async def cleanup(self) -> None:
        """Clear the RAG adapter cache and associated resources."""
        await self._rag_adapter_cache.cleanup()


LESSON_CHAT_SERVICE_INSTANCE = LessonChatService()
