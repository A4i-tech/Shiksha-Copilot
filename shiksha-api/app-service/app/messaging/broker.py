from collections.abc import AsyncIterator
from dataclasses import dataclass
from typing import Protocol

from app.messaging.message import JobMessage


class LockLost(Exception):
    pass


class Delivery(Protocol):
    message: JobMessage
    num_delivered: int
    fence: str

    async def ack(self) -> None:
        ...

    async def in_progress(self) -> None:
        ...


@dataclass
class DeadLetter:
    message: JobMessage
    num_delivered: int


class Broker(Protocol):
    async def publish(
        self,
        queue: str,
        message: JobMessage,
        *,
        delay: float = 0,
        msg_id: str | None = None,
    ) -> None:
        ...

    async def fetch(self, queue: str, timeout: float) -> Delivery | None:
        ...

    def dead_letters(self, queue: str) -> AsyncIterator[DeadLetter]:
        ...

    async def notify(self, subject: str, data: bytes) -> None:
        ...

    def subscribe(self, subject: str) -> AsyncIterator[bytes]:
        ...
