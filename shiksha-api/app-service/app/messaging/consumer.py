import asyncio
import logging
from collections.abc import Awaitable, Callable

from app.messaging.broker import Broker, Delivery, LockLost
from app.messaging.message import JobMessage

logger = logging.getLogger(__name__)

Handler = Callable[[JobMessage, str], Awaitable[None]]


class PermanentError(Exception):
    pass


class RetryAfter(Exception):
    def __init__(self, seconds: float):
        super().__init__(f"retry after {seconds} seconds")
        self.seconds = seconds


async def _ack(delivery: Delivery) -> None:
    try:
        await delivery.ack()
    except LockLost:
        logger.warning("Lock lost before ack of job %s", delivery.message.job_id)


async def _heartbeat(
    delivery: Delivery,
    every: float,
    job: asyncio.Task,
    alive: Callable[[], bool] | None,
) -> None:
    failures = 0
    while True:
        await asyncio.sleep(every)
        if alive is not None and not alive():
            logger.warning(
                "Job %s made no progress, cancelling handler", delivery.message.job_id
            )
            job.cancel()
            return
        try:
            await delivery.in_progress()
            failures = 0
        except LockLost:
            logger.warning(
                "Lock lost on job %s, cancelling handler", delivery.message.job_id
            )
            job.cancel()
            return
        except Exception as exc:  # noqa: BLE001
            failures += 1
            logger.warning("Heartbeat failed for job %s: %s", delivery.message.job_id, exc)
            if failures >= 3:
                logger.warning(
                    "Lock on job %s presumed lost, cancelling handler",
                    delivery.message.job_id,
                )
                job.cancel()
                return


async def _settle(
    broker: Broker, queue: str, delivery: Delivery, job: asyncio.Task
) -> None:
    message = delivery.message
    if job.cancelled():
        return
    exc = job.exception()
    if exc is None:
        await _ack(delivery)
    elif isinstance(exc, PermanentError):
        logger.error("Job %s failed permanently: %s", message.job_id, exc)
        await _ack(delivery)
    elif isinstance(exc, RetryAfter):
        attempt = message.attempt + 1
        retry = message.model_copy(update={"attempt": attempt})
        await broker.publish(
            queue, retry, delay=exc.seconds, msg_id=f"{message.job_id}:{attempt}"
        )
        await _ack(delivery)
    elif isinstance(exc, LockLost):
        logger.warning(
            "Job %s lost its lock or fence, it will be retried: %s", message.job_id, exc
        )
    else:
        logger.exception(
            "Job %s failed, it will be redelivered", message.job_id, exc_info=exc
        )


async def _hand_back(broker: Broker, queue: str, delivery: Delivery) -> None:
    message = delivery.message
    msg_id = f"{message.job_id}:{message.attempt}:handback:{delivery.num_delivered}"
    await broker.publish(queue, message, msg_id=msg_id)
    await _ack(delivery)


async def _process(
    broker: Broker,
    queue: str,
    handler: Handler,
    delivery: Delivery,
    stop: asyncio.Event,
    heartbeat_every: float,
    drain_timeout: float,
    alive: Callable[[], bool] | None = None,
) -> None:
    job = asyncio.create_task(handler(delivery.message, delivery.fence))
    beat = asyncio.create_task(_heartbeat(delivery, heartbeat_every, job, alive))
    stopped = asyncio.create_task(stop.wait())
    try:
        await asyncio.wait({job, stopped}, return_when=asyncio.FIRST_COMPLETED)
        drained = False
        if not job.done():
            await asyncio.wait({job}, timeout=drain_timeout)
            if not job.done():
                job.cancel()
                await asyncio.wait({job})
                drained = True
        if beat.done():
            return
        if drained:
            await _hand_back(broker, queue, delivery)
        else:
            await _settle(broker, queue, delivery, job)
    finally:
        for task in (beat, stopped, job):
            task.cancel()


async def run_consumer(
    broker: Broker,
    queue: str,
    handler: Handler,
    *,
    stop: asyncio.Event,
    heartbeat_every: float,
    fetch_timeout: float = 1.0,
    drain_timeout: float = 30.0,
    alive: Callable[[], bool] | None = None,
) -> None:
    while not stop.is_set():
        try:
            delivery = await broker.fetch(queue, fetch_timeout)
            if delivery is None:
                continue
            await _process(
                broker,
                queue,
                handler,
                delivery,
                stop,
                heartbeat_every,
                drain_timeout,
                alive,
            )
        except Exception:
            # an unacked message stays with the broker and is redelivered
            logger.exception("Consumer loop error, continuing")
            await asyncio.sleep(1)
