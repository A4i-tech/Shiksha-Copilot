import json
import logging
import time
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta
from typing import Self

import nats
from nats.aio.client import Client
from nats.aio.msg import Msg
from nats.errors import TimeoutError as NatsTimeout
from nats.js import JetStreamContext
from nats.js.api import ConsumerConfig, RetentionPolicy, StorageType, StreamConfig
from nats.js.errors import NotFoundError
from pydantic import ValidationError

from app.messaging.broker import DeadLetter
from app.messaging.message import JobMessage

logger = logging.getLogger(__name__)


class _NatsDelivery:
    def __init__(self, msg: Msg, message: JobMessage):
        self._msg = msg
        self.message = message
        self.num_delivered = msg.metadata.num_delivered
        self.fence = f"{msg.metadata.sequence.stream}:{self.num_delivered}"

    # NATS never tells a worker its lock expired, so ack and in_progress never raise LockLost
    async def ack(self) -> None:
        await self._msg.ack_sync()

    async def in_progress(self) -> None:
        await self._msg.in_progress()


class NatsBroker:
    def __init__(
        self,
        url: str,
        *,
        queues: list[str],
        stream: str = "PRES",
        durable: str = "pres-workers",
        ack_wait: float = 60.0,
        max_deliver: int = 5,
        replicas: int = 1,
        creds: str | None = None,
    ):
        self.url = url
        self.queues = queues
        self.stream = stream
        self.durable = durable
        self.ack_wait = ack_wait
        self.max_deliver = max_deliver
        self.replicas = replicas
        self.creds = creds
        self._nc: Client | None = None
        self._js: JetStreamContext | None = None
        self._subs: dict[str, JetStreamContext.PullSubscription] = {}

    async def __aenter__(self) -> Self:
        await self.connect()
        return self

    async def __aexit__(self, *exc_info: object) -> None:
        await self.close()

    def _consumer(self, queue: str) -> str:
        return f"{self.durable}_{queue}".replace(".", "_")

    async def connect(self) -> None:
        self._nc = await nats.connect(
            self.url, user_credentials=self.creds, max_reconnect_attempts=-1
        )
        try:
            self._js = js = self._nc.jetstream()
            config = StreamConfig(
                name=self.stream,
                subjects=self.queues + [f"{q}.sched" for q in self.queues],
                retention=RetentionPolicy.WORK_QUEUE,
                storage=StorageType.FILE,
                num_replicas=self.replicas,
                duplicate_window=120,
                allow_msg_ttl=True,
                allow_msg_schedules=True,
            )
            try:
                await js.stream_info(self.stream)
                await js.update_stream(config)
            except NotFoundError:
                await js.add_stream(config)
            for queue in self.queues:
                name = self._consumer(queue)
                # add_consumer on an existing durable updates ack_wait and max_deliver
                await js.add_consumer(
                    self.stream,
                    ConsumerConfig(
                        durable_name=name,
                        ack_policy="explicit",
                        ack_wait=self.ack_wait,
                        max_deliver=self.max_deliver,
                        filter_subject=queue,
                    ),
                )
                self._subs[queue] = await js.pull_subscribe(
                    queue, durable=name, stream=self.stream
                )
        except Exception:
            await self.close()
            raise

    async def close(self) -> None:
        if self._nc:
            await self._nc.close()
        self._nc = self._js = None
        self._subs.clear()

    async def publish(
        self,
        queue: str,
        message: JobMessage,
        *,
        delay: float = 0,
        msg_id: str | None = None,
    ) -> None:
        assert self._js
        headers = {"Nats-Msg-Id": msg_id} if msg_id is not None else {}
        subject = queue
        if delay > 0:
            at = datetime.now(UTC) + timedelta(seconds=delay)
            headers["Nats-Schedule"] = f"@at {at.strftime('%Y-%m-%dT%H:%M:%S.%fZ')}"
            headers["Nats-Schedule-Target"] = queue
            subject = f"{queue}.sched"
        await self._js.publish(
            subject, message.model_dump_json().encode(), headers=headers or None
        )

    async def fetch(self, queue: str, timeout: float) -> _NatsDelivery | None:
        sub = self._subs[queue]
        give_up = time.monotonic() + timeout
        while (remaining := give_up - time.monotonic()) > 0:
            try:
                (msg,) = await sub.fetch(1, timeout=remaining)
            except NatsTimeout:
                return None
            try:
                message = JobMessage.model_validate_json(msg.data)
            except ValidationError:
                logger.error("Terminating invalid message on %s: %r", queue, msg.data)
                await msg.term()
                continue
            return _NatsDelivery(msg, message)
        return None

    async def dead_letters(self, queue: str) -> AsyncIterator[DeadLetter]:
        assert self._nc and self._js
        advisory = (
            "$JS.EVENT.ADVISORY.CONSUMER.MAX_DELIVERIES."
            f"{self.stream}.{self._consumer(queue)}"
        )
        # queue group: with several API pods, one pod gets each advisory
        sub = await self._nc.subscribe(advisory, queue=f"{self.durable}-reapers")
        await self._nc.flush()
        try:
            async for event in sub.messages:
                seq = json.loads(event.data)["stream_seq"]
                try:
                    raw = await self._js.get_msg(self.stream, seq)
                    message = JobMessage.model_validate_json(raw.data)
                except (NotFoundError, ValidationError):
                    logger.error("Dead letter %s on %s is gone or invalid", seq, queue)
                    continue
                try:
                    yield DeadLetter(message, self.max_deliver)
                finally:
                    await self._js.delete_msg(self.stream, seq)
        finally:
            await sub.unsubscribe()

    async def notify(self, subject: str, data: bytes) -> None:
        assert self._nc
        await self._nc.publish(subject, data)
        await self._nc.flush()

    async def subscribe(self, subject: str) -> AsyncIterator[bytes]:
        assert self._nc
        sub = await self._nc.subscribe(subject)
        await self._nc.flush()
        try:
            async for msg in sub.messages:
                yield msg.data
        finally:
            await sub.unsubscribe()
