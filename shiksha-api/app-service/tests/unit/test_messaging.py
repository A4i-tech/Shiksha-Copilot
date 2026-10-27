import asyncio
import logging
import time
from contextlib import asynccontextmanager

import pytest

from app.messaging.broker import LockLost
from app.messaging.consumer import PermanentError, RetryAfter, run_consumer
from app.messaging.memory import MemoryBroker
from app.messaging.message import JobMessage

QUEUE = "jobs"


class SpyDelivery:
    def __init__(self, inner, spy):
        self.inner = inner
        self.spy = spy
        self.message = inner.message
        self.num_delivered = inner.num_delivered
        self.fence = inner.fence

    async def ack(self):
        if self.spy.fail_ack:
            self.spy.fail_ack = False
            raise RuntimeError("nats down")
        await self.inner.ack()
        self.spy.acked.append(self.fence)

    async def in_progress(self):
        if self.spy.lose_lock:
            raise LockLost("injected")
        if self.spy.beat_errors:
            self.spy.beat_errors -= 1
            raise RuntimeError("nats timeout")
        await self.inner.in_progress()


class SpyBroker(MemoryBroker):
    def __init__(self, *args, lose_lock=False, beat_errors=0, **kwargs):
        super().__init__(*args, **kwargs)
        self.lose_lock = lose_lock
        self.beat_errors = beat_errors
        self.fail_fetch = False
        self.fail_ack = False
        self.fetched = []
        self.acked = []

    async def fetch(self, queue, timeout):
        if self.fail_fetch:
            self.fail_fetch = False
            raise RuntimeError("nats down")
        delivery = await super().fetch(queue, timeout)
        if delivery is None:
            return None
        spy = SpyDelivery(delivery, self)
        self.fetched.append(spy)
        return spy


def job(attempt=0):
    return JobMessage(type="t", job_id="j1", attempt=attempt)


async def until(condition, timeout=0.5):
    give_up = time.perf_counter() + timeout
    while not condition():
        assert time.perf_counter() < give_up, "condition not met in time"
        await asyncio.sleep(0.005)


@asynccontextmanager
async def consumer(broker, handler, heartbeat_every=0.02, **kwargs):
    stop = asyncio.Event()
    task = asyncio.create_task(
        run_consumer(
            broker,
            QUEUE,
            handler,
            stop=stop,
            heartbeat_every=heartbeat_every,
            fetch_timeout=0.02,
            **kwargs,
        )
    )
    try:
        yield stop, task
    finally:
        stop.set()
        await asyncio.wait_for(task, 1)


@pytest.mark.asyncio
async def test_handler_return_acks():
    broker = SpyBroker(ack_wait=0.1)

    async def handler(message, fence):
        pass

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: broker.acked)
    assert await broker.fetch(QUEUE, 0.3) is None


@pytest.mark.asyncio
async def test_retry_after_publishes_next_attempt():
    broker = SpyBroker(ack_wait=0.1)
    calls = []

    async def handler(message, fence):
        calls.append((message.attempt, time.perf_counter()))
        if message.attempt == 0:
            raise RetryAfter(0.1)

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: len(broker.acked) == 2)
    assert [attempt for attempt, _ in calls] == [0, 1]
    assert calls[1][1] - calls[0][1] >= 0.05
    assert broker.acked[0] == broker.fetched[0].fence


@pytest.mark.asyncio
async def test_permanent_error_acks_without_redelivery():
    broker = SpyBroker(ack_wait=0.1)
    calls = []

    async def handler(message, fence):
        calls.append(fence)
        raise PermanentError("bad input")

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: broker.acked)
    assert await broker.fetch(QUEUE, 0.3) is None
    assert len(calls) == 1


@pytest.mark.asyncio
async def test_unacked_message_is_redelivered_after_ack_wait():
    broker = MemoryBroker(ack_wait=0.1)
    await broker.publish(QUEUE, job())
    first = await broker.fetch(QUEUE, 0.5)
    second = await broker.fetch(QUEUE, 0.5)
    assert first.num_delivered == 1
    assert second.num_delivered == 2
    assert first.fence != second.fence
    with pytest.raises(LockLost):
        await first.ack()
    await second.ack()


@pytest.mark.asyncio
async def test_max_deliver_dead_letters_message():
    broker = MemoryBroker(ack_wait=0.05, max_deliver=3)
    await broker.publish(QUEUE, job())
    for expected in (1, 2, 3):
        delivery = await broker.fetch(QUEUE, 0.5)
        assert delivery.num_delivered == expected
    assert await broker.fetch(QUEUE, 0.2) is None
    dead = broker.dead_letters(QUEUE)
    letter = await asyncio.wait_for(anext(dead), 0.5)
    await dead.aclose()
    assert letter.num_delivered == 3
    assert letter.message == job()


@pytest.mark.asyncio
async def test_heartbeat_keeps_lock():
    broker = SpyBroker(ack_wait=0.1)
    done = []

    async def handler(message, fence):
        await asyncio.sleep(0.4)
        done.append(fence)

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler, heartbeat_every=0.02):
        await until(lambda: broker.acked, timeout=1)
    assert len(broker.fetched) == 1
    assert broker.acked == done == [broker.fetched[0].fence]


@pytest.mark.asyncio
async def test_lock_lost_cancels_handler_without_ack():
    broker = SpyBroker(ack_wait=0.1, lose_lock=True)
    cancelled = []

    async def handler(message, fence):
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            cancelled.append(fence)
            raise

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: cancelled)
    assert broker.acked == []


@pytest.mark.asyncio
async def test_unhandled_exception_is_redelivered():
    broker = SpyBroker(ack_wait=0.1)
    calls = []

    async def handler(message, fence):
        calls.append(fence)
        if len(calls) == 1:
            raise RuntimeError("boom")

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: broker.acked)
    assert len(calls) == 2
    assert [d.num_delivered for d in broker.fetched] == [1, 2]
    assert broker.acked == [broker.fetched[1].fence]


@pytest.mark.asyncio
async def test_drain_hands_job_back_with_same_attempt():
    broker = SpyBroker(ack_wait=0.1)
    started = asyncio.Event()
    cancelled = []

    async def handler(message, fence):
        started.set()
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            cancelled.append(fence)
            raise

    await broker.publish(QUEUE, job(attempt=2))
    async with consumer(broker, handler, drain_timeout=0.05) as (stop, task):
        await asyncio.wait_for(started.wait(), 0.5)
        stop.set()
        await asyncio.wait_for(task, 0.5)
    assert cancelled == [broker.fetched[0].fence]
    assert broker.acked == [broker.fetched[0].fence]
    handed_back = await broker.fetch(QUEUE, 0.5)
    assert handed_back.message.attempt == 2
    assert handed_back.num_delivered == 1


@pytest.mark.asyncio
async def test_duplicate_msg_id_is_dropped():
    broker = MemoryBroker(ack_wait=0.1)
    await broker.publish(QUEUE, job(), msg_id="a")
    await broker.publish(QUEUE, job(), msg_id="a")
    delivery = await broker.fetch(QUEUE, 0.1)
    await delivery.ack()
    assert await broker.fetch(QUEUE, 0.1) is None


@pytest.mark.asyncio
async def test_subscriber_gets_only_later_messages():
    broker = MemoryBroker()
    early = broker.subscribe("s")
    early_next = asyncio.create_task(anext(early))
    await asyncio.sleep(0)
    await broker.notify("s", b"hello")
    assert await asyncio.wait_for(early_next, 0.5) == b"hello"
    late = broker.subscribe("s")
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(anext(late), 0.1)
    await early.aclose()
    await late.aclose()


@pytest.mark.asyncio
async def test_lock_lost_error_is_not_acked_and_logs_a_warning_without_error(caplog):
    broker = SpyBroker(ack_wait=0.1)
    calls = []

    async def handler(message, fence):
        calls.append(fence)
        raise LockLost("fence moved")

    await broker.publish(QUEUE, job())
    with caplog.at_level(logging.INFO):
        async with consumer(broker, handler):
            await until(lambda: calls)
            await until(lambda: any("lost its lock" in r.message for r in caplog.records))
    assert broker.acked == []
    assert not [r for r in caplog.records if r.levelno >= logging.ERROR]
    assert [r.levelno for r in caplog.records if "lost its lock" in r.message] == [logging.WARNING]


@pytest.mark.asyncio
async def test_alive_false_cancels_handler_without_ack():
    broker = SpyBroker(ack_wait=0.1)
    cancelled = []

    async def handler(message, fence):
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            cancelled.append(fence)
            raise

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler, alive=lambda: False):
        await until(lambda: cancelled)
    assert broker.acked == []


@pytest.mark.asyncio
async def test_heartbeat_errors_below_limit_keep_handler_running():
    broker = SpyBroker(ack_wait=0.1, beat_errors=2)
    done = []

    async def handler(message, fence):
        await asyncio.sleep(0.3)
        done.append(fence)

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: broker.acked, timeout=1)
    assert broker.acked == done == [broker.fetched[0].fence]


@pytest.mark.asyncio
async def test_repeated_heartbeat_errors_cancel_handler_without_ack():
    broker = SpyBroker(ack_wait=0.1, beat_errors=1000)
    cancelled = []

    async def handler(message, fence):
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            cancelled.append(fence)
            raise

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: cancelled)
    assert broker.beat_errors == 1000 - 3
    assert broker.acked == []


@pytest.mark.asyncio
async def test_fetch_error_does_not_stop_consumer():
    broker = SpyBroker(ack_wait=0.1)
    broker.fail_fetch = True
    calls = []

    async def handler(message, fence):
        calls.append(fence)

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: broker.acked, timeout=2)
    assert len(calls) == 1


@pytest.mark.asyncio
async def test_ack_error_does_not_stop_consumer():
    broker = SpyBroker(ack_wait=0.1)
    broker.fail_ack = True
    calls = []

    async def handler(message, fence):
        calls.append(fence)

    await broker.publish(QUEUE, job())
    async with consumer(broker, handler):
        await until(lambda: broker.acked, timeout=3)
    assert len(calls) == 2
    assert broker.acked == [broker.fetched[1].fence]
