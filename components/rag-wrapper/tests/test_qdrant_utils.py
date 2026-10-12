import asyncio

from rag_wrapper.utils import qdrant as qdrant_module
from rag_wrapper.utils.qdrant import QdrantUtils


class FakeClient:
    def __init__(self, *_, **__):
        self.closes = 0

    def close(self):
        self.closes += 1


class FakeAsyncClient(FakeClient):
    async def close(self):
        self.closes += 1


def make_utils(monkeypatch):
    monkeypatch.setattr(qdrant_module, "QdrantClient", FakeClient)
    monkeypatch.setattr(qdrant_module, "AsyncQdrantClient", FakeAsyncClient)
    return QdrantUtils()


def test_clients_are_reused(monkeypatch):
    utils = make_utils(monkeypatch)
    assert utils.sync_client is utils.sync_client
    assert utils.async_client is utils.async_client


def test_close_closes_both_clients_and_resets(monkeypatch):
    utils = make_utils(monkeypatch)
    sync, aclient = utils.sync_client, utils.async_client
    asyncio.run(utils.close())
    assert (sync.closes, aclient.closes) == (1, 1)
    assert utils.sync_client is not sync
    asyncio.run(utils.close())
    assert (sync.closes, aclient.closes) == (1, 1)
