"""Chapters whose llama-index index sits in Azure Blob Storage.

The libraries load inside the functions. A service without them runs Qdrant.
"""

import asyncio
import os
import shutil
import tempfile
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from typing import Any, Literal


@dataclass(frozen=True)
class BlobIndex:
    path: str
    kind: Literal["graph", "vector"]
    container: str
    prefix: str


@dataclass
class Entry:
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    ops: Any = None
    users: int = 0


ENTRIES: dict[str, Entry] = {}


def local_dir(index: BlobIndex) -> str:
    return os.path.join(tempfile.gettempdir(), index.path.replace("/", "_"))


def check_container(index: BlobIndex) -> None:
    allowed = {
        c.strip()
        for c in os.environ.get("LEGACY_INDEX_CONTAINERS", "").split(",")
        if c.strip()
    }
    if not allowed:
        raise ValueError(
            f"Chapter index '{index.path}' is stored in Azure Blob Storage. "
            "Set LEGACY_INDEX_CONTAINERS to the container names that hold "
            "chapter indexes."
        )
    if index.container not in allowed:
        raise ValueError(
            f"Chapter index '{index.path}' is in container "
            f"'{index.container}', which is not in LEGACY_INDEX_CONTAINERS."
        )


async def download(index: BlobIndex, target: str) -> list[str]:
    check_container(index)
    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient

    connection_string, account_url = (
        os.environ.get("BLOB_STORE_CONNECTION_STRING"),
        os.environ.get("BLOB_STORE_URL"),
    )
    if connection_string:
        service = BlobServiceClient.from_connection_string(connection_string)
    elif account_url:
        service = BlobServiceClient(
            account_url=account_url, credential=DefaultAzureCredential()
        )
    else:
        raise ValueError(
            f"Chapter index '{index.path}' is stored in Azure Blob Storage. "
            "Set BLOB_STORE_CONNECTION_STRING or BLOB_STORE_URL."
        )
    written: list[str] = []
    os.makedirs(target, exist_ok=True)
    async with service:
        client = service.get_container_client(index.container)
        async for blob in client.list_blobs(name_starts_with=index.prefix):
            data = await (
                await client.get_blob_client(blob.name).download_blob()
            ).readall()
            path = os.path.join(target, blob.name.split("/")[-1])
            with open(path, "wb") as f:
                f.write(data)
            written.append(path)
    return written


async def load(index: BlobIndex, model: str, embed_model: str) -> Any:
    from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
    from llama_index.llms.azure_openai import AzureOpenAI
    from rag_wrapper import InMemGraphRagOps, InMemRagOps

    env = os.environ
    common = {
        "api_key": env.get("AZURE_OPENAI_API_KEY"),
        "azure_endpoint": env.get("AZURE_OPENAI_API_BASE"),
        "api_version": env["AZURE_OPENAI_API_VERSION"],
    }
    llm = AzureOpenAI(
        model=env.get("AZURE_OPENAI_BASE_MODEL") or model.lower(),
        deployment_name=model,
        model_kwargs={"response_format": {"type": "json_object"}},
        **common,
    )
    embedder = AzureOpenAIEmbedding(
        model=embed_model, deployment_name=embed_model, **common
    )
    target = local_dir(index)
    ops = (InMemGraphRagOps if index.kind == "graph" else InMemRagOps)(
        persist_dir=target, completion_llm=llm, emb_llm=embedder
    )
    if not await ops.index_exists():
        try:
            if not await download(index, target):
                raise RuntimeError(
                    f"No files downloaded for index path: {index.path}"
                )
        except BaseException:
            shutil.rmtree(target, ignore_errors=True)
            raise
    await ops.initiate_index()
    return ops


async def answer(
    index: BlobIndex, query: str, model: str, embed_model: str
) -> str:
    entry = ENTRIES[index.path]
    async with entry.lock:
        if entry.ops is None:
            entry.ops = await load(index, model, embed_model)
    return str(await entry.ops.query_index(text_str=query))


@asynccontextmanager
async def session(index: BlobIndex) -> AsyncIterator[None]:
    """Keep the downloaded index while a plan uses it."""
    entry = ENTRIES.setdefault(index.path, Entry())
    entry.users += 1
    try:
        yield
    finally:
        entry.users -= 1
        if entry.users <= 0:
            ENTRIES.pop(index.path, None)
            shutil.rmtree(local_dir(index), ignore_errors=True)
