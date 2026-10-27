"""Chapters whose llama-index vector or graph index sits in Azure Blob Storage, not in Qdrant.

The libraries are imported inside the functions, so a service without them still runs every Qdrant chapter.
"""

import asyncio
import os
import shutil
import tempfile
from collections import Counter
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator

_OPS: dict[str, Any] = {}
_LOCKS: dict[str, asyncio.Lock] = {}
_USERS: Counter = Counter()


def kind(index_path: str) -> str:
    # Check graph first, then qdrant, then fall back to the vector index.
    if "graph-index" in index_path:
        return "graph"
    return "qdrant" if index_path.startswith("qdrant/") else "vector"


def is_legacy(index_path: str) -> bool:
    return kind(index_path) != "qdrant"


def local_dir(index_path: str) -> str:
    return os.path.join(tempfile.gettempdir(), index_path.replace("/", "_"))


def split_index_path(index_path: str) -> tuple[str, str]:
    """Return (container, prefix). The caller sets index_path, so only containers named in LEGACY_INDEX_CONTAINERS may be read."""
    allowed = {c.strip() for c in os.environ.get("LEGACY_INDEX_CONTAINERS", "").split(",") if c.strip()}
    if not allowed:
        raise ValueError(f"Chapter index '{index_path}' is stored in Azure Blob Storage. Set LEGACY_INDEX_CONTAINERS to the container names that hold chapter indexes.")
    container, sep, prefix = index_path.partition("/")
    if not sep:
        raise ValueError(f"Chapter index '{index_path}' must look like <container>/<path>.")
    if container not in allowed:
        raise ValueError(f"Chapter index '{index_path}' is in container '{container}', which is not in LEGACY_INDEX_CONTAINERS.")
    return container, prefix


async def download(index_path: str, target: str) -> list[str]:
    container, prefix = split_index_path(index_path)
    import aiofiles
    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient

    connection_string, account_url = os.environ.get("BLOB_STORE_CONNECTION_STRING"), os.environ.get("BLOB_STORE_URL")
    if connection_string:
        service = BlobServiceClient.from_connection_string(connection_string)
    elif account_url:
        service = BlobServiceClient(account_url=account_url, credential=DefaultAzureCredential())
    else:
        raise ValueError(f"Chapter index '{index_path}' is stored in Azure Blob Storage. Set BLOB_STORE_CONNECTION_STRING or BLOB_STORE_URL.")
    written: list[str] = []
    async with service:
        client = service.get_container_client(container)
        async for blob in client.list_blobs(name_starts_with=prefix):
            data = await (await client.get_blob_client(blob.name).download_blob()).readall()
            path = os.path.join(target, blob.name.split("/")[-1])
            os.makedirs(target, exist_ok=True)
            async with aiofiles.open(path, "wb") as f:
                await f.write(data)
            written.append(path)
    return written


async def load(index_path: str) -> Any:
    from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
    from llama_index.llms.azure_openai import AzureOpenAI
    from rag_wrapper import InMemGraphRagOps, InMemRagOps

    env = os.environ
    model, embed_model = env.get("AZURE_OPENAI_MODEL", "GPT-4.1"), env.get("AZURE_OPENAI_EMBED_MODEL", "text-embedding-ada-002")
    common = {"api_key": env.get("AZURE_OPENAI_API_KEY"), "azure_endpoint": env.get("AZURE_OPENAI_API_BASE"), "api_version": env["AZURE_OPENAI_API_VERSION"]}
    # llama-index checks the base model name, which is not always the deployment name.
    base_model = env.get("AZURE_OPENAI_BASE_MODEL") or model.lower()
    llm = AzureOpenAI(model=base_model, deployment_name=model, model_kwargs={"response_format": {"type": "json_object"}}, **common)
    embedder = AzureOpenAIEmbedding(model=embed_model, deployment_name=embed_model, **common)
    target = local_dir(index_path)
    ops = (InMemGraphRagOps if kind(index_path) == "graph" else InMemRagOps)(persist_dir=target, completion_llm=llm, emb_llm=embedder)
    if not await ops.index_exists():
        try:
            if not await download(index_path, target):
                raise RuntimeError(f"No files downloaded for index path: {index_path}")
        except BaseException:
            shutil.rmtree(target, ignore_errors=True)  # the next run must not trust a partial index
            raise
    await ops.initiate_index()
    return ops


async def answer(index_path: str, query: str) -> str:
    async with _LOCKS.setdefault(index_path, asyncio.Lock()):
        if index_path not in _OPS:
            _OPS[index_path] = await load(index_path)
    return str(await _OPS[index_path].query_index(text_str=query))


@asynccontextmanager
async def session(index_path: str) -> AsyncIterator[None]:
    """Keep the downloaded index while a plan uses it, and delete it when the last plan ends."""
    if not index_path or not is_legacy(index_path):
        yield
        return
    _USERS[index_path] += 1
    try:
        yield
    finally:
        _USERS[index_path] -= 1
        if _USERS[index_path] <= 0:
            _USERS.pop(index_path, None)
            _OPS.pop(index_path, None)
            shutil.rmtree(local_dir(index_path), ignore_errors=True)
