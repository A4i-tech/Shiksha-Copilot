from collections.abc import AsyncIterator
from dataclasses import dataclass
from typing import Protocol, Self

from app.messaging.message import JobMessage


class LockLost(Exception):
    pass


def lost(ident: str) -> LockLost:
    return LockLost(f"message {ident} is no longer locked by this worker")


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
    async def connect(self) -> None:
        ...

    async def close(self) -> None:
        ...

    async def __aenter__(self) -> Self:
        ...

    async def __aexit__(self, *exc_info: object) -> None:
        ...

    async def publish(
        self,
        queue: str,
        message: JobMessage,
        *,
        delay: float = 0,
        msg_id: str,
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
