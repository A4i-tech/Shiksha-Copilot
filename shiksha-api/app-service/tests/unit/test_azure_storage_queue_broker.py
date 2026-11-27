import asyncio
import json
import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

pytest.importorskip("azure.storage.queue")

from azure.core.exceptions import HttpResponseError  # noqa: E402

from app.messaging.azure_storage_queue_broker import AzureStorageQueueBroker
from app.messaging.broker import LockLost
from app.messaging.message import JobMessage

MESSAGE = JobMessage(type="t", job_id=uuid.UUID(int=1))


def body(delivered=0):
    return json.dumps({"msg_id": "m1", "message": json.loads(MESSAGE.model_dump_json()), "delivered": delivered}, separators=(",", ":"))


def lost_error(code):
    error = HttpResponseError("x")
    error.error_code = code
    return error


def raw(count=1, receipt="r1", content=None):
    return SimpleNamespace(id="id1", pop_receipt=receipt, dequeue_count=count, content=content or body())


def paged(*items):
    async def gen(**_):
        for item in items:
            yield item

    return gen


def broker_with(**clients):
    broker = AzureStorageQueueBroker("conn", queues=["pres.jobs"], ack_wait=30, max_deliver=3)
    broker._service = SimpleNamespace(get_queue_client=lambda name: clients[name])
    return broker


def client(*items):
    c = MagicMock()
    c.send_message = AsyncMock()
    c.delete_message = AsyncMock()
    c.update_message = AsyncMock()
    c.receive_messages = paged(*items)
    return c


@pytest.mark.parametrize("delay, expected", [(0, 0), (90.2, 91)])
async def test_publish_sends_envelope_with_visibility_delay(delay, expected):
    main = client()
    await broker_with(**{"pres-jobs": main}).publish("pres.jobs", MESSAGE, delay=delay, msg_id="m1")
    content = main.send_message.call_args.args[0]
    assert json.loads(content)["msg_id"] == "m1"
    assert json.loads(content)["message"]["job_id"] == str(MESSAGE.job_id)
    assert main.send_message.call_args.kwargs["visibility_timeout"] == expected


async def test_fetch_maps_dequeue_count_and_pop_receipt():
    delivery = await broker_with(**{"pres-jobs": client(raw(count=2, receipt="rc"))}).fetch("pres.jobs", 1)
    assert delivery.num_delivered == 2
    assert delivery.fence == "rc"
    assert delivery.message == MESSAGE


async def test_fetch_returns_none_after_timeout(monkeypatch):
    monkeypatch.setattr("app.messaging.azure_storage_queue_broker.POLL_SECONDS", 0.01)
    assert await broker_with(**{"pres-jobs": client()}).fetch("pres.jobs", 0.03) is None


async def test_fetch_moves_over_delivered_message_to_poison_queue():
    main, poison = client(raw(count=4)), client()
    assert await broker_with(**{"pres-jobs": main, "pres-jobs-poison": poison}).fetch("pres.jobs", 0) is None
    assert json.loads(poison.send_message.call_args.args[0])["delivered"] == 4
    main.delete_message.assert_awaited_once_with("id1", "r1")


async def test_in_progress_uses_new_pop_receipt_and_keeps_fence():
    main = client(raw())
    main.update_message.return_value = SimpleNamespace(pop_receipt="r2")
    delivery = await broker_with(**{"pres-jobs": main}).fetch("pres.jobs", 1)
    await delivery.in_progress()
    assert delivery.fence == "r1"
    main.update_message.assert_awaited_once_with("id1", "r1", visibility_timeout=30)
    await delivery.ack()
    main.delete_message.assert_awaited_once_with("id1", "r2")


@pytest.mark.parametrize("code", ["MessageNotFound", "PopReceiptMismatch"])
async def test_ack_on_lost_lock_raises_lock_lost(code):
    main = client(raw())
    main.delete_message.side_effect = lost_error(code)
    delivery = await broker_with(**{"pres-jobs": main}).fetch("pres.jobs", 1)
    with pytest.raises(LockLost):
        await delivery.ack()


async def test_in_progress_on_lost_lock_raises_lock_lost():
    main = client(raw())
    main.update_message.side_effect = lost_error("PopReceiptMismatch")
    delivery = await broker_with(**{"pres-jobs": main}).fetch("pres.jobs", 1)
    with pytest.raises(LockLost):
        await delivery.in_progress()


async def test_ack_on_other_http_error_reraises():
    main = client(raw())
    main.delete_message.side_effect = lost_error("QueueNotFound")
    delivery = await broker_with(**{"pres-jobs": main}).fetch("pres.jobs", 1)
    with pytest.raises(HttpResponseError):
        await delivery.ack()


@pytest.mark.parametrize("content", ["[]", "null", "not json"])
async def test_fetch_moves_invalid_message_to_poison_queue(content):
    main, poison = client(raw(content=content)), client()
    assert await broker_with(**{"pres-jobs": main, "pres-jobs-poison": poison}).fetch("pres.jobs", 0) is None
    poison.send_message.assert_awaited_once_with(content)
    main.delete_message.assert_awaited_once_with("id1", "r1")


async def test_dead_letters_drops_invalid_message(monkeypatch):
    monkeypatch.setattr("app.messaging.azure_storage_queue_broker.POLL_SECONDS", 0.01)
    poison = client()
    batches = iter([[raw(content="[]")], [raw(content=body(delivered=4))]])

    async def receive(**_):
        for item in next(batches, []):
            yield item

    poison.receive_messages = receive
    dead = broker_with(**{"pres-jobs-poison": poison}).dead_letters("pres.jobs")
    letter = await asyncio.wait_for(anext(dead), 1)
    await dead.aclose()
    assert letter.num_delivered == 4
    poison.delete_message.assert_any_await("id1", "r1")


async def test_dead_letters_yields_from_poison_queue():
    poison = client(raw(content=body(delivered=4)))
    dead = broker_with(**{"pres-jobs-poison": poison}).dead_letters("pres.jobs")
    letter = await anext(dead)
    await dead.aclose()
    assert letter.message == MESSAGE
    assert letter.num_delivered == 4
