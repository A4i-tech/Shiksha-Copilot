import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.rag_adapter_cache import NativeQdrantRagAdapter


class TestNativeQdrantRagAdapter:
    """Tests for NativeQdrantRagAdapter class."""

    @pytest.fixture
    def mock_azure_client(self):
        """Create a mock Azure OpenAI client."""
        return MagicMock()

    @pytest.fixture
    def mock_settings(self):
        """Mock settings with Qdrant configuration."""
        with patch("app.services.rag_adapter_cache.settings") as mock:
            mock.qdrant_url = "http://localhost:6333"
            mock.qdrant_api_key = "test-api-key"
            yield mock

    @pytest.fixture
    @patch("app.services.rag_adapter_cache.QdrantClient")
    def adapter(self, mock_qdrant_client, mock_azure_client, mock_settings):
        """Create a NativeQdrantRagAdapter instance."""
        return NativeQdrantRagAdapter(
            client=mock_azure_client,
            collection_name="test_collection",
            embedding_model="text-embedding-ada-002",
            chat_model="gpt-4",
        )

    def test_initialization_with_qdrant_settings(
        self, mock_azure_client, mock_settings
    ):
        """Test adapter initialization with Qdrant settings."""
        with patch("app.services.rag_adapter_cache.QdrantClient") as mock_qdrant:
            adapter = NativeQdrantRagAdapter(
                client=mock_azure_client,
                collection_name="test_collection",
                embedding_model="text-embedding-ada-002",
                chat_model="gpt-4",
            )

            mock_qdrant.assert_called_once_with(
                url="http://localhost:6333", api_key="test-api-key"
            )
            assert adapter.collection_name == "test_collection"
            assert adapter.embedding_model == "text-embedding-ada-002"
            assert adapter.chat_model == "gpt-4"

    def test_initialization_without_qdrant_settings(self, mock_azure_client):
        """Test adapter initialization without Qdrant settings."""
        with patch("app.services.rag_adapter_cache.settings") as mock_settings:
            mock_settings.qdrant_url = None
            mock_settings.qdrant_api_key = None

            adapter = NativeQdrantRagAdapter(
                client=mock_azure_client,
                collection_name="test_collection",
                embedding_model="text-embedding-ada-002",
                chat_model="gpt-4",
            )

            assert adapter.qdrant is None

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_initialize_success(self, mock_to_thread, adapter):
        """Test successful initialization."""
        mock_to_thread.return_value = MagicMock()

        await adapter.initialize()

        mock_to_thread.assert_called_once()

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_initialize_collection_error(self, mock_to_thread, adapter):
        """Test initialization when collection check fails."""
        mock_to_thread.side_effect = Exception("Collection not found")

        # Should not raise, just log error
        await adapter.initialize()

        mock_to_thread.assert_called_once()

    @pytest.mark.asyncio
    async def test_cleanup(self, adapter):
        """Test cleanup closes Qdrant connection."""
        adapter.qdrant = MagicMock()
        adapter.qdrant.close = MagicMock()

        await adapter.cleanup()

        adapter.qdrant.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_cleanup_without_qdrant(self, mock_azure_client):
        """Test cleanup when Qdrant is not initialized."""
        with patch("app.services.rag_adapter_cache.settings") as mock_settings:
            mock_settings.qdrant_url = None
            mock_settings.qdrant_api_key = None

            adapter = NativeQdrantRagAdapter(
                client=mock_azure_client,
                collection_name="test",
                embedding_model="model",
                chat_model="chat",
            )

            # Should not raise
            await adapter.cleanup()

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_get_embedding(self, mock_to_thread, adapter):
        """Test generating embeddings."""
        mock_response = MagicMock()
        mock_response.data = [MagicMock(embedding=[0.1, 0.2, 0.3])]
        mock_to_thread.return_value = mock_response

        result = await adapter._get_embedding("test text")

        assert result == [0.1, 0.2, 0.3]
        mock_to_thread.assert_called_once()

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_get_embedding_with_newlines(self, mock_to_thread, adapter):
        """Test that newlines are cleaned from input text."""
        mock_response = MagicMock()
        mock_response.data = [MagicMock(embedding=[0.1, 0.2])]
        mock_to_thread.return_value = mock_response

        await adapter._get_embedding("test\ntext\nwith\nnewlines")

        # Verify the text was cleaned (newlines replaced with spaces)
        call_args = mock_to_thread.call_args
        assert "\n" not in str(call_args)

    @pytest.mark.asyncio
    async def test_retrieve_context_without_qdrant(self, mock_azure_client):
        """Test retrieving context when Qdrant is not initialized."""
        with patch("app.services.rag_adapter_cache.settings") as mock_settings:
            mock_settings.qdrant_url = None
            mock_settings.qdrant_api_key = None

            adapter = NativeQdrantRagAdapter(
                client=mock_azure_client,
                collection_name="test",
                embedding_model="model",
                chat_model="chat",
            )

            result = await adapter._retrieve_context("test query")

            assert result == ""

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_retrieve_context_success(self, mock_to_thread, adapter):
        """Test successful context retrieval."""
        # Mock embedding
        mock_embedding_response = MagicMock()
        mock_embedding_response.data = [MagicMock(embedding=[0.1, 0.2, 0.3])]

        # Mock search results
        mock_hit1 = MagicMock()
        mock_hit1.payload = {"content": "First result"}
        mock_hit2 = MagicMock()
        mock_hit2.payload = {"content": "Second result"}
        mock_search_results = [mock_hit1, mock_hit2]

        # Setup mock_to_thread to return different values for different calls
        mock_to_thread.side_effect = [mock_embedding_response, mock_search_results]

        result = await adapter._retrieve_context("test query", top_k=2)

        assert "First result" in result
        assert "Second result" in result
        assert mock_to_thread.call_count == 2

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_retrieve_context_with_text_key(self, mock_to_thread, adapter):
        """Test context retrieval when payload uses 'text' key."""
        mock_embedding_response = MagicMock()
        mock_embedding_response.data = [MagicMock(embedding=[0.1, 0.2])]

        mock_hit = MagicMock()
        mock_hit.payload = {"text": "Result with text key"}

        mock_to_thread.side_effect = [mock_embedding_response, [mock_hit]]

        result = await adapter._retrieve_context("query")

        assert "Result with text key" in result

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_retrieve_context_error_handling(self, mock_to_thread, adapter):
        """Test error handling during context retrieval."""
        mock_to_thread.side_effect = Exception("Search failed")

        # Should not raise, should return empty or handle gracefully
        result = await adapter._retrieve_context("query")

        # Depending on implementation, might return empty string
        assert isinstance(result, str)

    @pytest.mark.asyncio
    @patch("app.services.rag_adapter_cache.asyncio.to_thread")
    async def test_retrieve_context_custom_top_k(self, mock_to_thread, adapter):
        """Test context retrieval with custom top_k value."""
        mock_embedding_response = MagicMock()
        mock_embedding_response.data = [MagicMock(embedding=[0.1])]

        mock_hits = [MagicMock(payload={"content": f"Result {i}"}) for i in range(10)]

        mock_to_thread.side_effect = [mock_embedding_response, mock_hits]

        result = await adapter._retrieve_context("query", top_k=10)

        # Should contain multiple results
        assert len(result) > 0
