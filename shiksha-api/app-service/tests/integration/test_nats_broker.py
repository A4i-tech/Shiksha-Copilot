import asyncio
import contextlib
import os
import time
import uuid

import pytest

from app.messaging.consumer import RetryAfter, run_consumer
from app.messaging.message import JobMessage
from app.messaging.nats_broker import NatsBroker

pytestmark = pytest.mark.integration


@pytest.fixture
async def broker():
    if "NATS_URL" not in os.environ:
        pytest.skip("NATS_URL is not set")
    suffix = uuid.uuid4().hex[:8]
    queue = f"q{suffix}"
    nats_broker = NatsBroker(
        os.environ["NATS_URL"],
        queues=[queue],
        stream=f"T{suffix}",
        durable=f"d{suffix}",
        ack_wait=2,
        max_deliver=3,
    )
    nats_broker.test_queue = queue
    async with nats_broker:
        yield nats_broker
        with contextlib.suppress(Exception):
            await nats_broker._js.delete_stream(nats_broker.stream)


def job(attempt: int = 0) -> JobMessage:
    return JobMessage(type="t", job_id="j1", attempt=attempt)


async def first(gen):
    return await anext(gen)


async def stream_messages(broker) -> int:
    return (await broker._js.stream_info(broker.stream)).state.messages


async def queue_idle(broker) -> bool:
    info = await broker._js.consumer_info(
        broker.stream, broker._consumer(broker.test_queue)
    )
    return info.num_pending == 0 and info.num_ack_pending == 0


async def until(condition, timeout: float = 6):
    give_up = time.monotonic() + timeout
    while not await condition():
        assert time.monotonic() < give_up, "condition not met in time"
        await asyncio.sleep(0.1)


async def test_ack_removes_message(broker):
    queue = broker.test_queue
    await broker.publish(queue, job())
    delivery = await broker.fetch(queue, 3)
    assert delivery.message == job()
    assert delivery.num_delivered == 1
    await delivery.ack()
    assert await broker.fetch(queue, 0.5) is None


async def test_unacked_message_is_redelivered_with_new_fence(broker):
    queue = broker.test_queue
    await broker.publish(queue, job())
    first_delivery = await broker.fetch(queue, 3)
    second = await broker.fetch(queue, 6)
    assert second.num_delivered == 2
    assert second.fence != first_delivery.fence
    await second.ack()


async def test_in_progress_prevents_redelivery(broker):
    queue = broker.test_queue
    await broker.publish(queue, job())
    delivery = await broker.fetch(queue, 3)
    watcher = asyncio.create_task(broker.fetch(queue, 4.5))
    for _ in range(10):
        await asyncio.sleep(0.5)
        await delivery.in_progress()
    assert await watcher is None
    await delivery.ack()
    assert await broker.fetch(queue, 0.5) is None


async def test_dead_letter_after_max_deliver_is_removed_from_stream(broker):
    queue = broker.test_queue
    dead = broker.dead_letters(queue)
    waiting = asyncio.create_task(first(dead))
    await asyncio.sleep(0.2)
    await broker.publish(queue, job())
    for expected in (1, 2, 3):
        delivery = await broker.fetch(queue, 5)
        assert delivery.num_delivered == expected
    # the server only counts the last delivery as expired while a pull request waits
    assert await broker.fetch(queue, 4) is None
    letter = await asyncio.wait_for(waiting, 5)
    await dead.aclose()
    assert letter.message == job()
    assert letter.num_delivered == 3
    assert await stream_messages(broker) == 0


async def test_delayed_publish_is_not_early(broker):
    queue = broker.test_queue
    start = time.monotonic()
    await broker.publish(queue, job(), delay=2)
    assert await broker.fetch(queue, 1.2) is None
    delivery = await broker.fetch(queue, 5)
    assert delivery.message == job()
    assert time.monotonic() - start < 6
    await delivery.ack()


async def test_same_msg_id_is_delivered_once(broker):
    queue = broker.test_queue
    await broker.publish(queue, job(), msg_id="a")
    await broker.publish(queue, job(), msg_id="a")
    delivery = await broker.fetch(queue, 3)
    await delivery.ack()
    assert await broker.fetch(queue, 0.5) is None


async def test_notify_reaches_subscriber(broker):
    subject = f"s{uuid.uuid4().hex[:8]}"
    events = broker.subscribe(subject)
    waiting = asyncio.create_task(first(events))
    await asyncio.sleep(0.05)
    await broker.notify(subject, b"hello")
    assert await asyncio.wait_for(waiting, 3) == b"hello"
    await events.aclose()


@contextlib.asynccontextmanager
async def consumer(broker, handler):
    stop = asyncio.Event()
    task = asyncio.create_task(
        run_consumer(
            broker,
            broker.test_queue,
            handler,
            stop=stop,
            heartbeat_every=0.5,
            fetch_timeout=0.5,
        )
    )
    try:
        yield
    finally:
        stop.set()
        await asyncio.wait_for(task, 5)


async def test_consumer_acks_and_retries_with_next_attempt(broker):
    calls = []

    async def handler(message, fence):
        calls.append((message.job_id, message.attempt))
        if message.job_id == "retry" and message.attempt == 0:
            raise RetryAfter(1)

    await broker.publish(broker.test_queue, JobMessage(type="t", job_id="ok"))
    await broker.publish(broker.test_queue, JobMessage(type="t", job_id="retry"))
    async with consumer(broker, handler):

        async def retried():
            return ("retry", 1) in calls

        await until(retried)
        await until(lambda: queue_idle(broker))
    assert sorted(calls) == [("ok", 0), ("retry", 0), ("retry", 1)]


async def test_connect_updates_existing_consumer_config():
    if "NATS_URL" not in os.environ:
        pytest.skip("NATS_URL is not set")
    suffix = uuid.uuid4().hex[:8]
    settings = {
        "queues": [f"q{suffix}"],
        "stream": f"T{suffix}",
        "durable": f"d{suffix}",
    }
    first_broker = NatsBroker(
        os.environ["NATS_URL"], ack_wait=2, max_deliver=3, **settings
    )
    await first_broker.connect()
    await first_broker.close()
    second = NatsBroker(os.environ["NATS_URL"], ack_wait=3, max_deliver=4, **settings)
    async with second:
        try:
            info = await second._js.consumer_info(
                second.stream, second._consumer(settings["queues"][0])
            )
            assert info.config.ack_wait == 3
            assert info.config.max_deliver == 4
        finally:
            with contextlib.suppress(Exception):
                await second._js.delete_stream(second.stream)
