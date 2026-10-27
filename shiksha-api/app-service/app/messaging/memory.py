import asyncio
import time
from collections import defaultdict
from collections.abc import AsyncIterator, Callable
from dataclasses import dataclass, field

from app.messaging.broker import DeadLetter, Delivery, LockLost
from app.messaging.message import JobMessage


@dataclass
class _Item:
    seq: int
    message: JobMessage
    ready: float
    num_delivered: int = 0
    deadline: float = 0


@dataclass
class _Queue:
    pending: list[_Item] = field(default_factory=list)
    in_flight: dict[int, _Item] = field(default_factory=dict)
    msg_ids: set[str] = field(default_factory=set)
    dead: asyncio.Queue[DeadLetter] = field(default_factory=asyncio.Queue)


class _MemoryDelivery:
    def __init__(self, broker: "MemoryBroker", queue: _Queue, item: _Item):
        self._broker = broker
        self._queue = queue
        self._seq = item.seq
        self.message = item.message
        self.num_delivered = item.num_delivered
        self.fence = f"{item.seq}:{item.num_delivered}"

    def _check(self) -> _Item:
        item = self._queue.in_flight.get(self._seq)
        now = self._broker.clock()
        if not item or item.num_delivered != self.num_delivered or item.deadline <= now:
            raise LockLost(f"message {self.fence} is no longer locked by this worker")
        return item

    async def ack(self) -> None:
        self._check()
        del self._queue.in_flight[self._seq]

    async def in_progress(self) -> None:
        item = self._check()
        item.deadline = self._broker.clock() + self._broker.ack_wait


class MemoryBroker:
    def __init__(
        self,
        ack_wait: float = 60,
        max_deliver: int = 5,
        clock: Callable[[], float] = time.perf_counter,
    ):
        self.ack_wait = ack_wait
        self.max_deliver = max_deliver
        self.clock = clock
        self._queues: defaultdict[str, _Queue] = defaultdict(_Queue)
        self._subs: defaultdict[str, list[asyncio.Queue[bytes]]] = defaultdict(list)
        self._seq = 0

    async def publish(
        self,
        queue: str,
        message: JobMessage,
        *,
        delay: float = 0,
        msg_id: str | None = None,
    ) -> None:
        q = self._queues[queue]
        if msg_id is not None:
            if msg_id in q.msg_ids:
                return
            # ponytail: no expiry window, the real broker has a duplicate window
            q.msg_ids.add(msg_id)
        self._seq += 1
        q.pending.append(_Item(self._seq, message, self.clock() + delay))

    def _expire(self, q: _Queue) -> None:
        now = self.clock()
        for seq, item in list(q.in_flight.items()):
            if item.deadline > now:
                continue
            del q.in_flight[seq]
            if item.num_delivered >= self.max_deliver:
                q.dead.put_nowait(DeadLetter(item.message, item.num_delivered))
            else:
                q.pending.append(item)

    async def fetch(self, queue: str, timeout: float) -> Delivery | None:
        q = self._queues[queue]
        give_up = self.clock() + timeout
        while True:
            self._expire(q)
            now = self.clock()
            ready = [item for item in q.pending if item.ready <= now]
            if ready:
                item = min(ready, key=lambda i: i.seq)
                q.pending.remove(item)
                item.num_delivered += 1
                item.deadline = now + self.ack_wait
                q.in_flight[item.seq] = item
                return _MemoryDelivery(self, q, item)
            if now >= give_up:
                return None
            await asyncio.sleep(0.005)

    async def dead_letters(self, queue: str) -> AsyncIterator[DeadLetter]:
        q = self._queues[queue]
        while True:
            yield await q.dead.get()

    async def notify(self, subject: str, data: bytes) -> None:
        for sub in self._subs[subject]:
            sub.put_nowait(data)

    async def subscribe(self, subject: str) -> AsyncIterator[bytes]:
        sub: asyncio.Queue[bytes] = asyncio.Queue()
        self._subs[subject].append(sub)
        try:
            while True:
                yield await sub.get()
        finally:
            self._subs[subject].remove(sub)
