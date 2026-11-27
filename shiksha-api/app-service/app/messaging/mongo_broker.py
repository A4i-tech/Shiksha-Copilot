import asyncio
import time
import uuid
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta
from typing import Any, Self

from bson import ObjectId
from pymongo import ASCENDING, AsyncMongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError

from app.messaging.broker import DeadLetter, lost
from app.messaging.message import JobMessage

POLL = 0.05


def _now() -> datetime:
    return datetime.now(UTC)


class _MongoDelivery:
    def __init__(self, broker: "MongoBroker", doc: dict[str, Any]):
        self._broker = broker
        self._id = doc["_id"]
        self.message = JobMessage.model_validate_json(doc["body"])
        self.num_delivered = doc["delivered"]
        self.fence = doc["fence"]

    def _held(self) -> dict[str, Any]:
        return {"_id": self._id, "fence": self.fence, "available_at": {"$gt": _now()}}

    async def ack(self) -> None:
        result = await self._broker._jobs.delete_one(self._held())
        if not result.deleted_count:
            raise lost(self.fence)

    async def in_progress(self) -> None:
        lease = _now() + timedelta(seconds=self._broker.ack_wait)
        result = await self._broker._jobs.update_one(
            self._held(), {"$set": {"available_at": lease}}
        )
        if not result.matched_count:
            raise lost(self.fence)


class MongoBroker:
    def __init__(
        self,
        url: str,
        *,
        database: str | None = None,
        collection: str = "queue_jobs",
        notify_collection: str = "queue_notify",
        ack_wait: float = 60.0,
        max_deliver: int = 5,
    ):
        self.ack_wait = ack_wait
        self.max_deliver = max_deliver
        self._client = AsyncMongoClient(url, tz_aware=True)
        db = self._client.get_database(database)
        self._jobs = db[collection]
        self._notes = db[notify_collection]

    async def __aenter__(self) -> Self:
        await self.connect()
        return self

    async def __aexit__(self, *exc_info: object) -> None:
        await self.close()

    async def connect(self) -> None:
        await self._jobs.create_index(
            [("queue", ASCENDING), ("msg_id", ASCENDING)], unique=True
        )
        await self._jobs.create_index(
            [("queue", ASCENDING), ("dead", ASCENDING), ("available_at", ASCENDING)]
        )
        await self._notes.create_index("at", expireAfterSeconds=60)
        await self._notes.create_index([("subject", ASCENDING), ("at", ASCENDING)])

    async def close(self) -> None:
        await self._client.close()

    async def publish(
        self,
        queue: str,
        message: JobMessage,
        *,
        delay: float = 0,
        msg_id: str,
    ) -> None:
        doc: dict[str, Any] = {
            "queue": queue,
            "msg_id": msg_id,
            "body": message.model_dump_json(),
            "available_at": _now() + timedelta(seconds=delay),
            "delivered": 0,
            "fence": None,
            "dead": False,
        }
        try:
            await self._jobs.insert_one(doc)
        except DuplicateKeyError:
            pass

    async def fetch(self, queue: str, timeout: float) -> _MongoDelivery | None:
        give_up = time.monotonic() + timeout
        while True:
            now = _now()
            expired = {"queue": queue, "dead": False, "available_at": {"$lte": now}}
            await self._jobs.update_many(
                {**expired, "delivered": {"$gte": self.max_deliver}},
                {"$set": {"dead": True}},
            )
            doc = await self._jobs.find_one_and_update(
                expired,
                {
                    "$set": {
                        "available_at": now + timedelta(seconds=self.ack_wait),
                        "fence": uuid.uuid4().hex,
                    },
                    "$inc": {"delivered": 1},
                },
                sort=[("_id", ASCENDING)],
                return_document=ReturnDocument.AFTER,
            )
            if doc:
                return _MongoDelivery(self, doc)
            remaining = give_up - time.monotonic()
            if remaining <= 0:
                return None
            await asyncio.sleep(min(POLL, remaining))

    async def dead_letters(self, queue: str) -> AsyncIterator[DeadLetter]:
        while True:
            doc = await self._jobs.find_one(
                {"queue": queue, "dead": True}, sort=[("_id", ASCENDING)]
            )
            if doc:
                yield DeadLetter(
                    JobMessage.model_validate_json(doc["body"]), doc["delivered"]
                )
                await self._jobs.delete_one({"_id": doc["_id"]})
            else:
                await asyncio.sleep(POLL)

    async def notify(self, subject: str, data: bytes) -> None:
        await self._notes.insert_one({"subject": subject, "data": data, "at": _now()})

    async def subscribe(self, subject: str) -> AsyncIterator[bytes]:
        now = _now()
        # Mongo stores milliseconds, so start 1 ms back to keep a same-millisecond notify
        last_at = now.replace(microsecond=now.microsecond // 1000 * 1000) - timedelta(milliseconds=1)
        last_id: ObjectId | None = None
        while True:
            newer: dict[str, Any] = {"at": {"$gt": last_at}}
            if last_id is not None:
                newer = {"$or": [newer, {"at": last_at, "_id": {"$gt": last_id}}]}
            async for note in self._notes.find(
                {"subject": subject, **newer}, sort=[("at", ASCENDING), ("_id", ASCENDING)]
            ):
                last_at, last_id = note["at"], note["_id"]
                yield bytes(note["data"])
            await asyncio.sleep(POLL)
