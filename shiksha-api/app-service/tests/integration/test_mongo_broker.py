import asyncio
import os
import uuid

import pytest
import pytest_asyncio

from app.messaging.broker import LockLost
from app.messaging.message import JobMessage
from app.messaging.mongo_broker import MongoBroker

URL = os.environ.get("MONGO_TEST_URL")
pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio,
    pytest.mark.skipif(not URL, reason="MONGO_TEST_URL is not set"),
]

QUEUE = "jobs"


def job():
    return JobMessage(type="t", job_id=uuid.UUID(int=1))


@pytest_asyncio.fixture
async def make():
    brokers = []

    async def build(**kwargs):
        broker = MongoBroker(URL, database=f"qtest_{uuid.uuid4().hex[:8]}", **kwargs)
        await broker.connect()
        brokers.append(broker)
        return broker

    yield build
    for broker in brokers:
        await broker._client.drop_database(broker._jobs.database.name)
        await broker.close()


async def test_duplicate_msg_id_is_dropped(make):
    broker = await make(ack_wait=1)
    await broker.publish(QUEUE, job(), msg_id="a")
    await broker.publish(QUEUE, job(), msg_id="a")
    delivery = await broker.fetch(QUEUE, 0.2)
    await delivery.ack()
    assert await broker.fetch(QUEUE, 0.2) is None


async def test_delay_holds_message_back(make):
    broker = await make(ack_wait=1)
    await broker.publish(QUEUE, job(), delay=1, msg_id="a")
    assert await broker.fetch(QUEUE, 0.1) is None
    assert await broker.fetch(QUEUE, 2) is not None


async def test_expired_lease_is_redelivered_and_stale_ack_loses_lock(make):
    broker = await make(ack_wait=1)
    await broker.publish(QUEUE, job(), msg_id="a")
    first = await broker.fetch(QUEUE, 0.5)
    second = await broker.fetch(QUEUE, 3)
    assert (first.num_delivered, second.num_delivered) == (1, 2)
    assert first.fence != second.fence
    with pytest.raises(LockLost):
        await first.ack()
    with pytest.raises(LockLost):
        await first.in_progress()
    await second.ack()


async def test_in_progress_extends_lease(make):
    broker = await make(ack_wait=2)
    await broker.publish(QUEUE, job(), msg_id="a")
    delivery = await broker.fetch(QUEUE, 0.5)
    for _ in range(4):
        await asyncio.sleep(0.6)
        await delivery.in_progress()
    assert await broker.fetch(QUEUE, 0.1) is None
    await delivery.ack()


async def test_max_deliver_dead_letters_message(make):
    broker = await make(ack_wait=1, max_deliver=2)
    await broker.publish(QUEUE, job(), msg_id="a")
    for expected in (1, 2):
        assert (await broker.fetch(QUEUE, 2)).num_delivered == expected
    assert await broker.fetch(QUEUE, 2) is None
    dead = broker.dead_letters(QUEUE)
    letter = await asyncio.wait_for(anext(dead), 1)
    await dead.aclose()
    assert letter.num_delivered == 2
    assert letter.message == job()


async def test_concurrent_fetchers_deliver_each_message_once(make):
    broker = await make(ack_wait=30)
    for i in range(10):
        await broker.publish(QUEUE, JobMessage(type="t", job_id=uuid.UUID(int=i)), msg_id=f"m{i}")

    async def drain():
        got = []
        while (delivery := await broker.fetch(QUEUE, 0)) is not None:
            got.append(delivery)
        return got

    deliveries = [d for batch in await asyncio.gather(*(drain() for _ in range(5))) for d in batch]
    assert sorted(d.message.job_id.int for d in deliveries) == list(range(10))
    assert len({d.fence for d in deliveries}) == 10


async def test_subscriber_gets_each_later_notification_once(make):
    broker = await make()
    early = broker.subscribe("s")
    first = asyncio.create_task(anext(early))
    await asyncio.sleep(0)
    await broker.notify("s", b"one")
    await broker.notify("s", b"two")
    assert await asyncio.wait_for(first, 1) == b"one"
    assert await asyncio.wait_for(anext(early), 1) == b"two"
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(anext(early), 0.2)
    late = broker.subscribe("s")
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(anext(late), 0.2)
    await early.aclose()
    await late.aclose()
