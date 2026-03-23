import pytest
import os
import tempfile
from unittest.mock import Mock, AsyncMock, patch, MagicMock
from pathlib import Path

# Import the modules to test
import sys
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "app"))

from app.services.rag_adapters import (
    BaseRagAdapter,
    InMemRagOpsAdapter,
    QdrantRagOpsAdapter,
    RagAdapterFactory
)


class TestBaseRagAdapter:
    """Test BaseRagAdapter abstract base class."""

    def test_cannot_instantiate_directly(self, mock_completion_llm, mock_embedding_llm):
        """BaseRagAdapter cannot be instantiated directly."""
        with pytest.raises(TypeError):
            BaseRagAdapter(mock_completion_llm, mock_embedding_llm)

    @pytest.mark.asyncio
    async def test_concrete_adapter_must_implement_methods(self, mock_completion_llm, mock_embedding_llm):
        """Concrete adapters must implement abstract methods."""

        class IncompleteAdapter(BaseRagAdapter):
            pass

        with pytest.raises(TypeError):
            IncompleteAdapter(mock_completion_llm, mock_embedding_llm)


class TestInMemRagOpsAdapter:
    """Test InMemRagOpsAdapter for blob storage-based RAG."""

    @pytest.mark.asyncio
    async def test_initialization(self, mock_completion_llm, mock_embedding_llm):
        """Test InMemRagOpsAdapter initialization."""
        index_path = "blob/test-container/test-index"

        adapter = InMemRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path=index_path
        )

        assert adapter.index_path == index_path
        assert adapter.completion_llm == mock_completion_llm
        assert adapter.embedding_llm == mock_embedding_llm
        assert adapter.persist_dir.endswith(index_path.replace("/", "_"))

    @pytest.mark.asyncio
    async def test_initialize_creates_rag_ops(self, mock_completion_llm, mock_embedding_llm):
        """Test initialize creates InMemRagOps instance."""
        adapter = InMemRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="blob/test-container/test-index"
        )

        with patch("app.services.rag_adapters.InMemRagOps") as MockInMemRagOps:
            mock_rag_ops = Mock()
            MockInMemRagOps.return_value = mock_rag_ops

            result = await adapter.initialize()

            MockInMemRagOps.assert_called_once_with(
                persist_dir=adapter.persist_dir,
                completion_llm=mock_completion_llm,
                emb_llm=mock_embedding_llm
            )
            assert result == mock_rag_ops
            assert adapter._rag_ops == mock_rag_ops

    @pytest.mark.asyncio
    async def test_initiate_index_downloads_when_not_exists(self, mock_completion_llm, mock_embedding_llm, mock_blob_store):
        """Test initiate_index downloads from blob storage when index doesn't exist."""
        adapter = InMemRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="blob/test-container/test-index"
        )

        # Mock InMemRagOps
        mock_rag_ops = AsyncMock()
        mock_rag_ops.index_exists = AsyncMock(return_value=False)
        adapter._rag_ops = mock_rag_ops

        # Mock BlobStore
        adapter._blob_store = mock_blob_store

        await adapter.initiate_index()

        # Verify blob download was called
        mock_blob_store.download_blobs_to_folder.assert_called_once_with(
            prefix=adapter.index_path,
            target_folder=adapter.persist_dir
        )

    @pytest.mark.asyncio
    async def test_initiate_index_skips_download_when_exists(self, mock_completion_llm, mock_embedding_llm):
        """Test initiate_index skips download when index already exists."""
        adapter = InMemRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="blob/test-container/test-index"
        )

        # Mock InMemRagOps with existing index
        mock_rag_ops = AsyncMock()
        mock_rag_ops.index_exists = AsyncMock(return_value=True)
        adapter._rag_ops = mock_rag_ops

        # Mock BlobStore
        mock_blob_store = AsyncMock()
        adapter._blob_store = mock_blob_store

        await adapter.initiate_index()

        # Verify blob download was NOT called
        mock_blob_store.download_blobs_to_folder.assert_not_called()

    @pytest.mark.asyncio
    async def test_initiate_index_raises_error_when_no_files_downloaded(self, mock_completion_llm, mock_embedding_llm):
        """Test initiate_index raises error when no files are downloaded."""
        adapter = InMemRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="blob/test-container/test-index"
        )

        # Mock InMemRagOps
        mock_rag_ops = AsyncMock()
        mock_rag_ops.index_exists = AsyncMock(return_value=False)
        adapter._rag_ops = mock_rag_ops

        # Mock BlobStore returning empty list
        mock_blob_store = AsyncMock()
        mock_blob_store.download_blobs_to_folder = AsyncMock(return_value=[])
        adapter._blob_store = mock_blob_store

        with pytest.raises(RuntimeError, match="No files downloaded"):
            await adapter.initiate_index()

    @pytest.mark.asyncio
    async def test_cleanup_removes_downloaded_files(self, mock_completion_llm, mock_embedding_llm):
        """Test cleanup removes downloaded index files."""
        adapter = InMemRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="blob/test-container/test-index"
        )

        with patch("os.path.exists", return_value=True), \
             patch("shutil.rmtree") as mock_rmtree:
            await adapter.cleanup()
            mock_rmtree.assert_called_once_with(adapter.persist_dir)

    @pytest.mark.asyncio
    async def test_chat_with_index(self, mock_completion_llm, mock_embedding_llm):
        """Test chat_with_index delegates to RAG ops."""
        adapter = InMemRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="blob/test-container/test-index"
        )

        # Mock RAG ops
        mock_rag_ops = AsyncMock()
        mock_rag_ops.chat_with_index = AsyncMock(return_value="Test response")
        adapter._rag_ops = mock_rag_ops

        from llama_index.core.llms import ChatMessage

        chat_history = [ChatMessage(role="system", content="You are a teacher")]
        result = await adapter.chat_with_index("What is photosynthesis?", chat_history)

        assert result["response"] == "Test response"
        mock_rag_ops.chat_with_index.assert_called_once()


class TestQdrantRagOpsAdapter:
    """Test QdrantRagOpsAdapter for Qdrant vector database."""

    @pytest.mark.asyncio
    async def test_initialization_parses_index_path(self, mock_completion_llm, mock_embedding_llm):
        """Test QdrantRagOpsAdapter parses index_path correctly."""
        index_path = "qdrant/test-collection/chapter_id:6"

        adapter = QdrantRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path=index_path
        )

        assert adapter.index_path == index_path
        assert adapter.collection_name == "test-collection"
        assert adapter.metadata_filter == {"chapter_id": "6"}

    @pytest.mark.asyncio
    async def test_initialize_creates_qdrant_rag_ops(self, mock_completion_llm, mock_embedding_llm, mock_settings):
        """Test initialize creates QdrantRagOps instance."""
        adapter = QdrantRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="qdrant/test-collection/chapter_id:6"
        )

        with patch("app.services.rag_adapters.QdrantRagOps") as MockQdrantRagOps, \
             patch("app.services.rag_adapters.settings", mock_settings):
            mock_rag_ops = Mock()
            MockQdrantRagOps.return_value = mock_rag_ops

            result = await adapter.initialize()

            MockQdrantRagOps.assert_called_once_with(
                collection_name="test-collection",
                completion_llm=mock_completion_llm,
                emb_llm=mock_embedding_llm,
                url=mock_settings.qdrant_url,
                api_key=mock_settings.qdrant_api_key,
                similarity_top_k=5
            )
            assert result == mock_rag_ops

    @pytest.mark.asyncio
    async def test_initiate_index_is_noop(self, mock_completion_llm, mock_embedding_llm):
        """Test initiate_index is a no-op for Qdrant (no local downloads needed)."""
        adapter = QdrantRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="qdrant/test-collection/chapter_id:6"
        )

        # Should not raise any errors
        await adapter.initiate_index()

    @pytest.mark.asyncio
    async def test_cleanup_is_noop(self, mock_completion_llm, mock_embedding_llm):
        """Test cleanup is a no-op for Qdrant."""
        adapter = QdrantRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="qdrant/test-collection/chapter_id:6"
        )

        # Should not raise any errors
        await adapter.cleanup()

    @pytest.mark.asyncio
    async def test_chat_with_index_applies_metadata_filter(self, mock_completion_llm, mock_embedding_llm):
        """Test chat_with_index applies metadata filter."""
        adapter = QdrantRagOpsAdapter(
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm,
            index_path="qdrant/test-collection/chapter_id:6"
        )

        # Mock RAG ops
        mock_rag_ops = AsyncMock()
        mock_rag_ops.chat_with_index = AsyncMock(return_value="Filtered response")
        adapter._rag_ops = mock_rag_ops

        from llama_index.core.llms import ChatMessage

        chat_history = [ChatMessage(role="system", content="You are a teacher")]
        result = await adapter.chat_with_index("What is respiration?", chat_history)

        assert result["response"] == "Filtered response"
        # Verify metadata filter was passed
        call_args = mock_rag_ops.chat_with_index.call_args
        assert call_args[1]["metadata_filter"] == {"chapter_id": "6"}


class TestRagAdapterFactory:
    """Test RagAdapterFactory for adapter creation."""

    def test_create_qdrant_adapter_when_qdrant_in_path(self, mock_completion_llm, mock_embedding_llm):
        """Test factory creates QdrantRagOpsAdapter when 'qdrant' in path."""
        index_path = "qdrant/test-collection/chapter_id:6"

        adapter = RagAdapterFactory.create_adapter(
            index_path=index_path,
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm
        )

        assert isinstance(adapter, QdrantRagOpsAdapter)
        assert adapter.index_path == index_path

    def test_create_inmem_adapter_when_blob_in_path(self, mock_completion_llm, mock_embedding_llm):
        """Test factory creates InMemRagOpsAdapter when 'blob' in path."""
        index_path = "blob/test-container/test-index"

        adapter = RagAdapterFactory.create_adapter(
            index_path=index_path,
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm
        )

        assert isinstance(adapter, InMemRagOpsAdapter)
        assert adapter.index_path == index_path

    def test_create_inmem_adapter_by_default(self, mock_completion_llm, mock_embedding_llm):
        """Test factory creates InMemRagOpsAdapter by default."""
        index_path = "some/other/path"

        adapter = RagAdapterFactory.create_adapter(
            index_path=index_path,
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm
        )

        assert isinstance(adapter, InMemRagOpsAdapter)

    def test_factory_case_insensitive_qdrant_detection(self, mock_completion_llm, mock_embedding_llm):
        """Test factory detects 'qdrant' case-insensitively."""
        index_path = "QDRANT/test-collection/key:value"

        adapter = RagAdapterFactory.create_adapter(
            index_path=index_path,
            completion_llm=mock_completion_llm,
            embedding_llm=mock_embedding_llm
        )

        assert isinstance(adapter, QdrantRagOpsAdapter)
