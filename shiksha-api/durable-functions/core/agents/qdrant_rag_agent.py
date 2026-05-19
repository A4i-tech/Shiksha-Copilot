import json
import os
import tempfile
import shutil
import abc
from typing import Dict, Union
from core.blob_store import BlobStore
from core.config import settings
from core.models.workflow_models import RAGInput
from core.logger import LoggerFactory
from rag_wrapper.rag_ops.qdrant_rag_ops import QdrantRagOps


class QdrantRAGAgent:
    """
    RAG agent for Qdrant vector store, handling index management and content generation.
    """

    INDEX_NAME = "qdrant"

    def __init__(self, index_path: str):
        """
        Index path is supposed to be in the format "qdrant/<collection_name>/<metadata_filter_key>:<value>"
        """
        [_, qdrant_collection, metadata_filter_key_val] = index_path.split("/", 2)
        [key, val] = metadata_filter_key_val.split(":", 1)
        self.metadata_filter = {key: val}
        # LLMs
        self._llm = self._get_llm()
        self._embed_llm = self._get_embed_llm()
        # Qdrant RAG ops
        self._rag_ops = QdrantRagOps(
            url=settings.qdrant_url,
            collection_name=qdrant_collection,
            api_key=settings.qdrant_api_key,
            emb_llm=self._embed_llm,
            completion_llm=self._llm,
        )
        self.logger = LoggerFactory.get_agent_logger("QdrantRAGAgent")

    def _get_llm(self):
        from llama_index.llms.azure_openai import AzureOpenAI

        return AzureOpenAI(
            model=settings.azure_openai_model,
            deployment_name=settings.azure_openai_model,
            api_key=settings.azure_openai_api_key,
            azure_endpoint=settings.azure_openai_api_base,
            api_version=settings.azure_openai_api_version,
            model_kwargs={"response_format": {"type": "json_object"}},
        )

    def _get_embed_llm(self):
        from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding

        return AzureOpenAIEmbedding(
            model=settings.azure_openai_embed_model,
            deployment_name=settings.azure_openai_embed_model,
            api_key=settings.azure_openai_api_key,
            azure_endpoint=settings.azure_openai_api_base,
            api_version=settings.azure_openai_api_version,
        )

    async def generate(self, rag_input: RAGInput) -> Union[str, Dict]:
        try:
            # Query
            content_text = str(
                await self._rag_ops.query_index(
                    text_str=rag_input.response_synthesis_query,
                    retrieval_query=rag_input.retrieval_query,
                    metadata_filter=self.metadata_filter,
                )
            )
            try:
                content = json.loads(content_text.strip("```json").strip("````"))
                self.logger.info("Successfully parsed RAG response as JSON")
            except json.JSONDecodeError as e:
                self.logger.warning(
                    f"Failed to parse RAG agent response as JSON: {str(e)}"
                )
                self.logger.warning(f"Response text: {content_text[:200]}...")
                content = content_text
            return content
        except Exception as e:
            self.logger.error(f"Error in Qdrant RAG generation: {str(e)}")
            raise

    def clear_resources(self):
        pass
