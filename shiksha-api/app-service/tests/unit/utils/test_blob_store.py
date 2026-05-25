import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.utils.blob_store import BlobStore
from azure.core.exceptions import AzureError


class TestBlobStoreInitialization:
    """Tests for BlobStore initialization."""

    @patch("app.utils.blob_store.settings")
    @patch("app.utils.blob_store.AsyncBlobServiceClient")
    def test_init_with_connection_string(self, mock_async_client, mock_settings):
        """Test initialization with connection string."""
        mock_settings.blob_store_connection_string = (
            "DefaultEndpointsProtocol=https;AccountName=test"
        )
        mock_settings.blob_store_url = None

        blob_store = BlobStore()

        mock_async_client.from_connection_string.assert_called_once()
        assert blob_store._async_svc is not None

    @patch("app.utils.blob_store.settings")
    @patch("app.utils.blob_store.AsyncBlobServiceClient")
    @patch("app.utils.blob_store.DefaultAzureCredential")
    def test_init_with_account_url(self, mock_cred, mock_async_client, mock_settings):
        """Test initialization with account URL and credentials."""
        mock_settings.blob_store_connection_string = None
        mock_settings.blob_store_url = "https://testaccount.blob.core.windows.net"

        blob_store = BlobStore()

        mock_cred.assert_called_once()
        mock_async_client.assert_called_once()
        assert blob_store._async_svc is not None

    @patch("app.utils.blob_store.settings")
    def test_init_without_credentials_raises_error(self, mock_settings):
        """Test that initialization without credentials raises ValueError."""
        mock_settings.blob_store_connection_string = None
        mock_settings.blob_store_url = None

        with pytest.raises(
            ValueError,
            match="Either BLOB_STORE_CONNECTION_STRING or BLOB_STORE_URL must be set",
        ):
            BlobStore()


class TestBlobStoreDownloadBlobs:
    """Tests for download_blobs_to_folder method."""

    @pytest.fixture
    def blob_store(self):
        """Create a BlobStore instance with mocked service."""
        with patch("app.utils.blob_store.settings") as mock_settings:
            mock_settings.blob_store_connection_string = "test_connection"
            mock_settings.blob_store_url = None

            with patch("app.utils.blob_store.AsyncBlobServiceClient"):
                return BlobStore()

    @pytest.mark.asyncio
    async def test_download_blobs_invalid_prefix(self, blob_store):
        """Test download with invalid prefix format."""
        with pytest.raises(
            ValueError, match="Prefix must be in the format 'container/prefix_path'"
        ):
            await blob_store.download_blobs_to_folder("invalid_prefix")

    @pytest.mark.asyncio
    async def test_download_blobs_empty_prefix(self, blob_store):
        """Test download with empty prefix."""
        with pytest.raises(ValueError):
            await blob_store.download_blobs_to_folder("")

    @pytest.mark.asyncio
    @patch("app.utils.blob_store.os.makedirs")
    @patch("app.utils.blob_store.aiofiles.open")
    async def test_download_blobs_success(
        self, mock_aiofiles, mock_makedirs, blob_store
    ):
        """Test successful blob download."""
        # Setup mocks
        mock_blob = MagicMock()
        mock_blob.name = "test-prefix/file1.txt"

        mock_download_stream = AsyncMock()
        mock_download_stream.readall = AsyncMock(return_value=b"test data")

        mock_blob_client = AsyncMock()
        mock_blob_client.download_blob = AsyncMock(return_value=mock_download_stream)

        # Create async iterator for list_blobs
        async def async_blob_iterator():
            yield mock_blob

        mock_container_client = AsyncMock()
        mock_container_client.list_blobs = MagicMock(return_value=async_blob_iterator())
        mock_container_client.get_blob_client = MagicMock(return_value=mock_blob_client)

        blob_store._async_svc.get_container_client.return_value.__aenter__.return_value = mock_container_client

        # Mock aiofiles.open - setup context manager properly
        mock_file = AsyncMock()
        mock_file.write = AsyncMock()
        mock_context_manager = MagicMock()
        mock_context_manager.__aenter__ = AsyncMock(return_value=mock_file)
        mock_context_manager.__aexit__ = AsyncMock(return_value=False)
        mock_aiofiles.return_value = mock_context_manager

        # Execute
        result = await blob_store.download_blobs_to_folder("test-container/test-prefix")

        # Assert
        assert len(result) == 1
        assert "file1.txt" in result[0]
        mock_makedirs.assert_called()

    @pytest.mark.asyncio
    async def test_download_blobs_azure_error(self, blob_store):
        """Test download when Azure raises an error."""

        async def error_iterator():
            raise AzureError("Test error")
            yield  # pragma: no cover

        mock_container_client = AsyncMock()
        mock_container_client.list_blobs = MagicMock(return_value=error_iterator())

        blob_store._async_svc.get_container_client.return_value.__aenter__.return_value = mock_container_client

        with pytest.raises(
            RuntimeError, match="Failed to download blobs asynchronously"
        ):
            await blob_store.download_blobs_to_folder("container/prefix")

    @pytest.mark.asyncio
    @patch("app.utils.blob_store.os.makedirs")
    @patch("app.utils.blob_store.aiofiles.open")
    async def test_download_multiple_blobs(
        self, mock_aiofiles, mock_makedirs, blob_store
    ):
        """Test downloading multiple blobs."""
        # Setup mocks for multiple blobs
        mock_blobs = [
            MagicMock(name="prefix/file1.txt"),
            MagicMock(name="prefix/file2.txt"),
            MagicMock(name="prefix/file3.txt"),
        ]

        for blob in mock_blobs:
            blob.name = blob.name

        mock_download_stream = AsyncMock()
        mock_download_stream.readall = AsyncMock(return_value=b"test data")

        mock_blob_client = AsyncMock()
        mock_blob_client.download_blob = AsyncMock(return_value=mock_download_stream)

        async def async_blobs_iterator():
            for blob in mock_blobs:
                yield blob

        mock_container_client = AsyncMock()
        mock_container_client.list_blobs = MagicMock(
            return_value=async_blobs_iterator()
        )
        mock_container_client.get_blob_client = MagicMock(return_value=mock_blob_client)

        blob_store._async_svc.get_container_client.return_value.__aenter__.return_value = mock_container_client

        # Mock file writing - properly setup async context manager
        mock_file = AsyncMock()
        mock_file.write = AsyncMock()
        mock_context_manager = MagicMock()
        mock_context_manager.__aenter__ = AsyncMock(return_value=mock_file)
        mock_context_manager.__aexit__ = AsyncMock(return_value=False)
        mock_aiofiles.return_value = mock_context_manager

        # Execute
        result = await blob_store.download_blobs_to_folder("container/prefix")

        # Assert
        assert len(result) == 3
        assert all("file" in path for path in result)

    @pytest.mark.asyncio
    @patch("app.utils.blob_store.os.makedirs")
    @patch("app.utils.blob_store.aiofiles.open")
    async def test_download_with_custom_target_folder(
        self, mock_aiofiles, mock_makedirs, blob_store
    ):
        """Test download with custom target folder."""
        mock_blob = MagicMock()
        mock_blob.name = "prefix/file.txt"

        mock_download_stream = AsyncMock()
        mock_download_stream.readall = AsyncMock(return_value=b"data")

        mock_blob_client = AsyncMock()
        mock_blob_client.download_blob = AsyncMock(return_value=mock_download_stream)

        async def async_single_blob():
            yield mock_blob

        mock_container_client = AsyncMock()
        mock_container_client.list_blobs = MagicMock(return_value=async_single_blob())
        mock_container_client.get_blob_client = MagicMock(return_value=mock_blob_client)

        blob_store._async_svc.get_container_client.return_value.__aenter__.return_value = mock_container_client

        # Mock file writing - properly setup async context manager
        mock_file = AsyncMock()
        mock_file.write = AsyncMock()
        mock_context_manager = MagicMock()
        mock_context_manager.__aenter__ = AsyncMock(return_value=mock_file)
        mock_context_manager.__aexit__ = AsyncMock(return_value=False)
        mock_aiofiles.return_value = mock_context_manager

        # Execute with custom folder
        result = await blob_store.download_blobs_to_folder(
            "container/prefix", "custom_folder"
        )

        # Assert
        assert len(result) == 1
        assert "custom_folder" in result[0]
