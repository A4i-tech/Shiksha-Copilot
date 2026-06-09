from typing import Any, Dict, Optional
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.vector_stores.azureaisearch import AzureAISearchVectorStore, IndexManagement
from azure.search.documents.indexes.aio import SearchIndexClient
from azure.search.documents.aio import SearchClient
from azure.core.credentials import AzureKeyCredential
from azure.identity.aio import DefaultAzureCredential
from azure.core.exceptions import ResourceNotFoundError
from rag_wrapper.base.base_vector_index_rag_ops import BaseVectorIndexRagOps


class AzureAISearchRagOps(BaseVectorIndexRagOps):
    """Azure AI Search RAG operations with managed identity support and automatic index management."""

    _ERROR = ValueError(
        "Azure AI Search index is not properly initialized. "
        "Please check your configuration and ensure the service is accessible."
    )

    def __init__(
        self,
        search_service_name: str,
        index_name: str,
        emb_llm: Any,
        completion_llm: Any,
        metadata_fields: Optional[Dict[str, str]] = None,
        api_key: Optional[str] = None,
        use_managed_identity: bool = True,
        vector_store_kwargs: Optional[Dict] = None,
        **kwargs,
    ):
        """Initialize Azure AI Search RAG operations with authentication and LLM models.

        Args:
            search_service_name: Name of the Azure AI Search service
            index_name: Name of the search index
            emb_llm: Embedding language model
            completion_llm: Completion language model
            api_key: Optional API key for authentication
            use_managed_identity: Whether to use managed identity for auth
            vector_store_kwargs: Additional vector store configuration
            **kwargs: Additional arguments passed to BaseRagOps (similarity_top_k, response_mode)
        """
        super().__init__(emb_llm, completion_llm, **kwargs)
        self.search_service_endpoint = f"https://{search_service_name}.search.windows.net"
        self.index_name = index_name
        self.api_key = api_key
        self.use_managed_identity = use_managed_identity
        self.vector_store_kwargs = vector_store_kwargs or {}
        self.metadata_fields = metadata_fields


    async def index_exists(self) -> bool:
        index_client = SearchIndexClient(endpoint=self.search_service_endpoint, credential=self._get_credentials())
        try:
            # This will throw ResourceNotFoundError if the index doesn't exist
            await index_client.get_index(self.index_name)
            return True
        except ResourceNotFoundError:
            return False


    async def initiate_index(self):
        """Initialize Azure AI Search vector store and load the RAG index only if it already exists."""
        # Check if index exists
        vector_store_config = self.vector_store_kwargs.copy()
        index_exists = await self.index_exists()
        if not index_exists:
            self.logger.info(f"Index {self.index_name} does not exist. Use create_index() to create a new index.")
            im = IndexManagement.CREATE_IF_NOT_EXISTS
            client = SearchIndexClient(endpoint=self.search_service_endpoint, credential=self._get_credentials())
            vector_store_config = self.vector_store_kwargs.copy()
            if "index_name" not in vector_store_config:
                vector_store_config["index_name"] = self.index_name
        else:
            im = IndexManagement.VALIDATE_INDEX
            client = SearchClient(endpoint=self.search_service_endpoint, index_name=self.index_name, credential=self._get_credentials())

        vector_store = AzureAISearchVectorStore(
            search_or_index_client=client,
            id_field_key="id",
            chunk_field_key="chunk",
            embedding_field_key="embedding",
            doc_id_field_key="doc_id",
            metadata_string_field_key="metadata",
            filterable_metadata_field_keys=self.metadata_fields,
            index_management=im,
            embedding_dimensionality=1536,  # Default for OpenAI embeddings
            **vector_store_config
        )
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        rag_index = VectorStoreIndex.from_documents([], storage_context=storage_context, embed_model=self.emb_llm)

        self.logger.info(f"Successfully connected to existing Azure AI Search index: {self.index_name}")
        self.vector_store = vector_store
        self.storage_context = storage_context
        self.rag_index = rag_index


    async def persist_index(self):
        """No-op as Azure AI Search automatically persists the index."""
        # Index automatically persisted to Azure AI Search service - no action needed
        pass


    def _get_credentials(self):
        if self.use_managed_identity and not self.api_key:
            credential = DefaultAzureCredential()
            self.logger.info("Using Managed Identity for Azure AI Search authentication")
        elif self.api_key:
            credential = AzureKeyCredential(self.api_key)
            self.logger.info("Using API key for Azure AI Search authentication")
        else:
            raise ValueError("Either provide an API key or enable managed identity authentication")
        return credential
