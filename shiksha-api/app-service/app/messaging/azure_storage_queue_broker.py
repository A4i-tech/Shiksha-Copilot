import asyncio
import logging
import math
import time
from collections.abc import AsyncIterator, Awaitable
from typing import Self, TypeVar

from azure.core.exceptions import HttpResponseError, ResourceExistsError
from azure.storage.queue import QueueMessage
from azure.storage.queue.aio import QueueClient, QueueServiceClient
from pydantic import BaseModel, ValidationError

from app.messaging.broker import DeadLetter, lost
from app.messaging.message import JobMessage

logger = logging.getLogger(__name__)

T = TypeVar("T")

POLL_SECONDS = 1.0
LOST_CODES = {"MessageNotFound", "PopReceiptMismatch"}


class _Envelope(BaseModel):
    msg_id: str
    message: JobMessage
    delivered: int = 0


def _parse(content: str) -> _Envelope | None:
    try:
        return _Envelope.model_validate_json(content)
    except ValidationError:
        return None


class _StorageDelivery:
    def __init__(self, client: QueueClient, msg: QueueMessage, message: JobMessage, ack_wait: float):
        self._client = client
        self._msg = msg
        self._ack_wait = ack_wait
        self._receipt = msg.pop_receipt
        self.message = message
        self.num_delivered = msg.dequeue_count
        self.fence = msg.pop_receipt

    async def _guard(self, call: Awaitable[T]) -> T:
        try:
            return await call
        except HttpResponseError as exc:
            if exc.error_code in LOST_CODES:
                raise lost(self._msg.id) from exc
            raise

    async def ack(self) -> None:
        await self._guard(self._client.delete_message(self._msg.id, self._receipt))

    async def in_progress(self) -> None:
        updated = await self._guard(
            self._client.update_message(
                self._msg.id, self._receipt, visibility_timeout=math.ceil(self._ack_wait)
            )
        )
        self._receipt = updated.pop_receipt


class AzureStorageQueueBroker:
    def __init__(
        self,
        conn_str: str,
        *,
        queues: list[str],
        ack_wait: float = 60.0,
        max_deliver: int = 5,
    ):
        self.conn_str = conn_str
        self.queues = queues
        self.ack_wait = ack_wait
        self.max_deliver = max_deliver
        self._service: QueueServiceClient | None = None

    async def __aenter__(self) -> Self:
        await self.connect()
        return self

    async def __aexit__(self, *exc_info: object) -> None:
        await self.close()

    @staticmethod
    def _name(queue: str) -> str:
        return queue.replace(".", "-")

    def _client(self, name: str) -> QueueClient:
        if not self._service:
            raise RuntimeError("Azure Storage Queue not connected")
        return self._service.get_queue_client(name)

    def _poison(self, queue: str) -> str:
        return f"{self._name(queue)}-poison"

    async def connect(self) -> None:
        logger.warning("Azure Storage Queue cannot broadcast. A cancel reaches a worker at the next job write.")
        self._service = QueueServiceClient.from_connection_string(self.conn_str)
        try:
            for queue in self.queues:
                for name in (self._name(queue), self._poison(queue)):
                    try:
                        await self._service.create_queue(name)
                    except ResourceExistsError:
                        pass
        except Exception:
            await self.close()
            raise

    async def close(self) -> None:
        if self._service:
            await self._service.close()
        self._service = None

    # Storage Queue has no msg_id dedupe. A duplicate publish is delivered twice.
    async def publish(
        self,
        queue: str,
        message: JobMessage,
        *,
        delay: float = 0,
        msg_id: str,
    ) -> None:
        body = _Envelope(msg_id=msg_id, message=message).model_dump_json()
        await self._client(self._name(queue)).send_message(
            body, visibility_timeout=math.ceil(delay)
        )

    async def fetch(self, queue: str, timeout: float) -> _StorageDelivery | None:
        client = self._client(self._name(queue))
        give_up = time.monotonic() + timeout
        while True:
            found = False
            async for msg in client.receive_messages(
                max_messages=1, visibility_timeout=math.ceil(self.ack_wait)
            ):
                found = True
                envelope = _parse(msg.content)
                if envelope is None:
                    logger.error("Invalid message on %s moved to the poison queue: %r", queue, msg.content)
                    await self._client(self._poison(queue)).send_message(msg.content)
                    await client.delete_message(msg.id, msg.pop_receipt)
                    continue
                if msg.dequeue_count > self.max_deliver:
                    dead = envelope.model_copy(update={"delivered": msg.dequeue_count})
                    await self._client(self._poison(queue)).send_message(dead.model_dump_json())
                    await client.delete_message(msg.id, msg.pop_receipt)
                    continue
                return _StorageDelivery(client, msg, envelope.message, self.ack_wait)
            remaining = give_up - time.monotonic()
            if remaining <= 0:
                return None
            if not found:
                await asyncio.sleep(min(POLL_SECONDS, remaining))

    async def dead_letters(self, queue: str) -> AsyncIterator[DeadLetter]:
        client = self._client(self._poison(queue))
        while True:
            found = False
            async for msg in client.receive_messages(
                max_messages=1, visibility_timeout=math.ceil(self.ack_wait)
            ):
                found = True
                envelope = _parse(msg.content)
                if envelope is None:
                    logger.error("Dead letter on %s is invalid: %r", queue, msg.content)
                else:
                    yield DeadLetter(envelope.message, envelope.delivered)
                await client.delete_message(msg.id, msg.pop_receipt)
            if not found:
                await asyncio.sleep(POLL_SECONDS)

    async def notify(self, subject: str, data: bytes) -> None:
        ...

    async def subscribe(self, subject: str) -> AsyncIterator[bytes]:
        await asyncio.Event().wait()
        yield b""
