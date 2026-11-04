import os
from typing import AsyncIterator, List, Optional, Tuple, Union

import aiofiles
from aiobotocore.session import get_session
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
        from azure.core.exceptions import AzureError
        from azure.identity.aio import DefaultAzureCredential
        from azure.storage.blob.aio import BlobServiceClient as AsyncBlobServiceClient

        self._azure_error = AzureError
        connection_string = settings.blob_store_connection_string

        if connection_string:
            # async client from connection string
            self._async_svc = AsyncBlobServiceClient.from_connection_string(
                connection_string.get_secret_value()
            )
        else:
            cred = DefaultAzureCredential()
            self._async_svc = AsyncBlobServiceClient(
                account_url=str(settings.blob_store_url), credential=cred
            )

    async def iter_blobs(
        self, container: str, prefix: str
    ) -> AsyncIterator[Tuple[str, bytes]]:
        try:
            async with self._async_svc.get_container_client(
                container
            ) as container_client:
                # list_blobs is async iterable
                async for blob_props in container_client.list_blobs(
                    name_starts_with=prefix
                ):
                    if blob_props.name.endswith("/"):
                        continue
                    blob_client = container_client.get_blob_client(blob_props.name)
                    stream = await blob_client.download_blob()
                    yield blob_props.name, await stream.readall()
        except self._azure_error as e:
            raise RuntimeError(f"Failed to download blobs asynchronously: {e}") from e


class _S3Backend:
    def __init__(self):
        self._session = get_session()
        secret = settings.s3_secret_access_key
        endpoint = settings.s3_endpoint_url
        self._client_args = dict(
            service_name="s3",
            endpoint_url=str(endpoint) if endpoint else None,
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=secret.get_secret_value() if secret else None,
            region_name=settings.s3_region,
            config=_S3_CONFIG,
        )

    async def iter_blobs(
        self, bucket: str, prefix: str
    ) -> AsyncIterator[Tuple[str, bytes]]:
        try:
            async with self._session.create_client(**self._client_args) as s3:
                paginator = s3.get_paginator("list_objects_v2")
                async for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
                    if "Contents" not in page:
                        continue
                    for obj in page["Contents"]:
                        key = obj["Key"]
                        if key.endswith("/"):
                            continue
                        response = await s3.get_object(Bucket=bucket, Key=key)
                        async with response["Body"] as body:
                            yield key, await body.read()
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(
                f"Failed to download objects from S3 bucket '{bucket}' with prefix '{prefix}': {e}"
            ) from e


class BlobStore:
    """
    Async helper for interacting with Azure Blob Storage.

    STORAGE_BACKEND selects the backend: "s3" (default) or "azure".
    """

    def __init__(self, backend: Optional[Union[_AzureBackend, _S3Backend]] = None):
        if backend is not None:
            self._backend = backend
        elif settings.storage_backend == "azure":
            self._backend = _AzureBackend()
        elif settings.storage_backend == "s3":
            self._backend = _S3Backend()
        else:
            raise ValueError(
                f"Unknown STORAGE_BACKEND '{settings.storage_backend}'. Set it to 's3' or 'azure'."
            )

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

        async for blob_name, data in self._backend.iter_blobs(
            container_name, blob_prefix
        ):
            file_name = blob_name.split("/")[-1]
            local_path = os.path.join(target_folder, file_name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            # write without blocking the event loop
            async with aiofiles.open(local_path, "wb") as f:
                await f.write(data)

            downloaded_files.append(local_path)
        return downloaded_files
