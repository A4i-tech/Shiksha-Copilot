import os
from typing import AsyncIterator, List, Tuple

import aioboto3
import aiofiles
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

from app.config import settings

_S3_CONFIG = Config(s3={"addressing_style": "path"})


class _AzureBackend:
    """
    Auth:
      - connection string (local/dev)
      - DefaultAzureCredential + account URL (prod/Azure)
    """

    def __init__(self):
        # The Azure SDK is optional (extra "azure"), so import it only when this backend is selected.
        try:
            from azure.core.exceptions import AzureError
            from azure.identity.aio import DefaultAzureCredential
            from azure.storage.blob.aio import BlobServiceClient as AsyncBlobServiceClient
        except ImportError as e:
            raise ImportError(
                "STORAGE_BACKEND=azure needs the Azure SDK, which is not installed. "
                "Run 'poetry install --extras azure' or set STORAGE_BACKEND=s3."
            ) from e

        self._azure_error = AzureError
        connection_string = settings.blob_store_connection_string
        account_url = settings.blob_store_url

        if connection_string:
            # async client from connection string
            self._async_svc = AsyncBlobServiceClient.from_connection_string(
                connection_string
            )
        elif account_url:
            cred = DefaultAzureCredential()
            self._async_svc = AsyncBlobServiceClient(
                account_url=account_url, credential=cred
            )
        else:
            raise ValueError(
                "Either BLOB_STORE_CONNECTION_STRING or BLOB_STORE_URL must be set."
            )

    async def iter_blobs(self, container: str, prefix: str) -> AsyncIterator[Tuple[str, bytes]]:
        try:
            async with self._async_svc.get_container_client(container) as container_client:
                # list_blobs is async iterable
                async for blob_props in container_client.list_blobs(name_starts_with=prefix):
                    blob_client = container_client.get_blob_client(blob_props.name)
                    stream = await blob_client.download_blob()
                    yield blob_props.name, await stream.readall()
        except self._azure_error as e:
            raise RuntimeError(f"Failed to download blobs asynchronously: {e}") from e


class _S3Backend:
    def __init__(self):
        # Empty settings become None so boto3 falls back to its default credential chain and AWS endpoint.
        self._endpoint_url = settings.s3_endpoint_url or None
        self._session = aioboto3.Session(
            aws_access_key_id=settings.s3_access_key_id or None,
            aws_secret_access_key=settings.s3_secret_access_key or None,
            region_name=settings.s3_region,
        )

    async def iter_blobs(self, bucket: str, prefix: str) -> AsyncIterator[Tuple[str, bytes]]:
        try:
            async with self._session.client(
                "s3", endpoint_url=self._endpoint_url, config=_S3_CONFIG
            ) as s3:
                paginator = s3.get_paginator("list_objects_v2")
                async for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
                    for obj in page.get("Contents", []):
                        key = obj["Key"]
                        # Folder placeholder objects have no file content to write.
                        if key.endswith("/"):
                            continue
                        response = await s3.get_object(Bucket=bucket, Key=key)
                        async with response["Body"] as body:
                            yield key, await body.read()
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(
                f"Failed to download objects from S3 bucket '{bucket}' with prefix '{prefix}': {e}. "
                "Check that the bucket exists and that S3_ENDPOINT_URL, S3_ACCESS_KEY_ID, "
                "and S3_SECRET_ACCESS_KEY are correct."
            ) from e


class BlobStore:
    """Async helper that downloads blobs from the backend that STORAGE_BACKEND selects."""

    def __init__(self):
        self._backend = _AzureBackend() if settings.storage_backend == "azure" else _S3Backend()

    async def download_blobs_to_folder(
        self, prefix: str, target_folder: str = "blob_downloads"
    ) -> List[str]:
        """
        Async download all blobs whose names start with `prefix`
        into a local subfolder under /tmp (or wherever you like).

        Args:
          prefix: in the form "container/prefix_path"
          target_folder: local directory root for downloads

        Returns:
          List of local file paths written.

        Raises:
          ValueError, RuntimeError
        """
        if not prefix or "/" not in prefix:
            raise ValueError("Prefix must be in the format 'container/prefix_path'.")

        container_name, blob_prefix = prefix.split("/", 1)
        downloaded_files: List[str] = []

        async for blob_name, data in self._backend.iter_blobs(container_name, blob_prefix):
            file_name = blob_name.split("/")[-1]
            local_path = os.path.join(target_folder, file_name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            # write without blocking the event loop
            async with aiofiles.open(local_path, "wb") as f:
                await f.write(data)

            downloaded_files.append(local_path)
        return downloaded_files
