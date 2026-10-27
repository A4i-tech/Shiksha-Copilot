import asyncio
import json
import logging
import time
import uuid
from datetime import datetime, timedelta, timezone
from collections.abc import Sequence
from contextvars import ContextVar
from typing import Any, AsyncGenerator

from app.messaging.broker import LockLost
from app.models.presentation import JobDetail, JobStatus, UserId
from pymongo import ASCENDING, DESCENDING, AsyncMongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError


# retries exhausted: never claimed, not counted toward the user cap
_PERMANENT_ERROR = {"status": "error", "metadata.error.attempting_recovery": False}
_ACTIVE = {"status": {"$ne": "complete"}, "$nor": [_PERMANENT_ERROR]}

lease_owner: ContextVar[str | None] = ContextVar("lease_owner", default=None)


def iso_z(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def error_fields(message: str, error_message: str, attempt: int, next_attempt: float, recovering: bool) -> dict:
    return {
        "status": "error",
        "message": message,
        "metadata.error.error_type": "unexpected_error",
        "metadata.error.timestamp": datetime.now().isoformat(),
        "metadata.error.error_message": error_message,
        "metadata.error.attempt": attempt,
        "metadata.error.next_attempt": next_attempt,
        "metadata.error.attempting_recovery": recovering,
    }


class JobCancelled(Exception):
    pass


class FenceLost(LockLost):
    pass


class JobManager:

    def __init__(self, mongo_uri: str):
        self.client = AsyncMongoClient(mongo_uri, tz_aware=True)
        self.db = self.client.get_database()
        self.collection = self.db["presentation_jobs"]
        self.log_collection = self.db["presentation_job_logs"]
        self.logger = logging.getLogger(__name__)
        self.last_write = time.monotonic()

    async def __aenter__(self):
        await asyncio.gather(
            self.collection.create_index([("id", ASCENDING)], unique=True),
            self.collection.create_index([("user_id", ASCENDING), ("creation_time", DESCENDING)]),
            self.collection.create_index([("user_id", ASCENDING), ("status", ASCENDING), ("creation_time", DESCENDING)]),
            self.collection.create_index([("tags", ASCENDING)]),
            self.collection.create_index([("status", ASCENDING), ("creation_time", ASCENDING)]),
            self.log_collection.create_index([("job_id", ASCENDING), ("timestamp", ASCENDING)]),
            self.log_collection.create_index([("job_id", ASCENDING), ("seq", ASCENDING)], unique=True, partialFilterExpression={"seq": {"$exists": True}}),  # legacy rows have no seq
        )
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.client.close()

    async def claim(self, job_id: uuid.UUID, fence: str) -> JobDetail | None:
        doc = await self.collection.find_one_and_update(
            {"id": str(job_id), **_ACTIVE},
            {"$set": {"lease_owner": fence}},
            return_document=ReturnDocument.AFTER,
        )
        if doc:
            self.last_write = time.monotonic()  # a claim counts as progress for the stall check
        return JobDetail(**doc) if doc else None

    async def release(self, job_id: uuid.UUID, fence: str) -> None:
        await self.collection.update_one({"id": str(job_id), "lease_owner": fence}, {"$unset": {"lease_owner": 1}})

    async def request_cancel(self, job: JobDetail) -> bool:
        job = await self.get(job.id)
        if job is None or job.status == "complete":
            return False
        if job.lease_owner is None:
            return await self.delete(job)
        result = await self.collection.update_one({"id": str(job.id), "status": {"$ne": "complete"}}, {"$set": {"cancel_requested": True}})
        return result.matched_count > 0

    async def mark_enqueued(self, job_id: uuid.UUID) -> None:
        await self.collection.update_one({"id": str(job_id)}, {"$set": {"enqueued": True}})

    async def unenqueued(self, older_than_seconds: float) -> list[JobDetail]:
        # creation_time is stored as a string, so the cutoff must use the same format
        # jobs created before the queue existed have no enqueued field, so $ne True catches them
        cutoff = (datetime.now(timezone.utc) - timedelta(seconds=older_than_seconds)).isoformat(timespec="microseconds").replace("+00:00", "Z")
        cursor = self.collection.find(
            {"enqueued": {"$ne": True}, **_ACTIVE, "creation_time": {"$lt": cutoff}},
            sort=[("creation_time", ASCENDING)],
            limit=100,
        )
        return [JobDetail(**doc) async for doc in cursor]

    async def orphaned(self, older_than_seconds: float) -> list[JobDetail]:
        cutoff = datetime.now(timezone.utc) - timedelta(seconds=older_than_seconds)
        cursor = self.collection.find(
            {"lease_owner": {"$ne": None}, **_ACTIVE},
            limit=100,
        )
        found = []
        async for doc in cursor:
            last = await self.log_collection.find_one({"job_id": doc["id"]}, sort=[("timestamp", DESCENDING)], projection=["timestamp"])
            if last is None or last["timestamp"] < cutoff:
                found.append(JobDetail(**doc))
        return found

    async def fail_crashed(self, job_id: uuid.UUID, deliveries: int) -> None:
        job = await self.get(job_id)
        if job is None or job.status == "complete":
            return
        message = f"Stopped after {deliveries} tries without finishing"
        await self.update(job_id, error_fields(message, message, deliveries, time.time(), False), ["lease_owner"])

    async def create(self, user_id: UserId, textbook_file: str, textbook_mime: str, slides: int | None, instruction: str | None, tags: list[str]) -> JobDetail:
        job = JobDetail(user_id=user_id, textbook_file=textbook_file, textbook_mime=textbook_mime, slides=slides, instruction=instruction, tags=set(tags))
        await self.collection.insert_one({**job.model_dump(mode="json"), "enqueued": False})
        await self.log(job.id, "create", json.loads(job.model_dump_json()))
        self.logger.info("Created job for %s", textbook_file)
        return job

    async def update(self, job_id: uuid.UUID, fields_set: dict[str, Any] | None = None, fields_unset: list[str] | None = None):
        updates = {}
        if fields_set: updates["$set"] = fields_set
        if fields_unset: updates["$unset"] = dict.fromkeys(fields_unset, 1)
        query = {"id": str(job_id)}
        # fencing covers Mongo writes only, blob writes are bounded by the heartbeat cancel
        if (owner := lease_owner.get()) is not None: query["lease_owner"] = owner
        doc = await self.collection.find_one_and_update(query, updates, return_document=ReturnDocument.AFTER)
        if doc is None and owner is not None:
            self.logger.warning("Dropped write to job %s: fence is held by another delivery.", job_id)
            raise FenceLost(f"Fence lost on job {job_id}")
        if doc:
            self.last_write = time.monotonic()
            data = json.loads(JobDetail(**doc).model_dump_json())
            await self.log(job_id, "update", data)
            completing = bool(fields_set) and fields_set.get("status") == "complete"
            if completing:
                await self.log(job_id, "complete", data)
            if owner is not None and doc.get("cancel_requested") and not completing:
                raise JobCancelled(f"Job {job_id} was cancelled")

    async def get(self, job_id: uuid.UUID) -> JobDetail | None:
        doc = await self.collection.find_one({"id": str(job_id)})
        return JobDetail(**doc) if doc else None

    async def list(self, user_id: UserId, offset: int = 0, limit: int = 20, textbook_file: str | None = None, status: JobStatus | None = None, created_after: datetime | None = None, created_before: datetime | None = None, tags: list[str] | None = None) -> list[JobDetail]:
        filter: dict[str, Any] = {"user_id": user_id}
        if textbook_file is not None:
            filter["textbook_file"] = textbook_file
        if status is not None:
            filter["status"] = status
        if tags:
            filter["tags"] = {"$in": tags}
        if created_after is not None or created_before is not None:
            filter["creation_time"] = {}
            if created_after is not None:
                filter["creation_time"]["$gte"] = created_after.astimezone(timezone.utc).isoformat()
            if created_before is not None:
                filter["creation_time"]["$lte"] = created_before.astimezone(timezone.utc).isoformat()
        cursor = self.collection.find(filter, sort=[("creation_time", DESCENDING)], skip=offset, limit=limit)
        return [JobDetail(**doc) async for doc in cursor]

    async def get_pending_count(self, user_id: UserId) -> int:
        # a cancelled job must not block a new one while the worker winds down
        return await self.collection.count_documents({"user_id": user_id, **_ACTIVE, "cancel_requested": {"$ne": True}})

    async def delete(self, job: JobDetail) -> bool:
        result = await self.collection.delete_one({"id": str(job.id), "status": {"$ne": "complete"}})
        if result.deleted_count == 0:
            return False
        await self._append(job.id, "terminate", json.loads(job.model_copy(update={"status": "error"}).model_dump_json()))  # no fence check: the row is gone
        await self.log_collection.delete_many({"job_id": str(job.id), "type": {"$ne": "terminate"}})  # keeps terminate so seq never restarts
        return True

    async def log(self, job_id: uuid.UUID, type: str, data: dict) -> int:
        # unique (job_id, seq): a late writer hits a duplicate and retries higher, so readers never skip a seq
        # check-then-act: shrinks the stale-writer window, the heartbeat cancel bounds the rest
        if (owner := lease_owner.get()) is not None and not await self.collection.count_documents({"id": str(job_id), "lease_owner": owner}, limit=1):
            self.logger.warning("Dropped %s log for job %s: fence is held by another delivery.", type, job_id)
            raise FenceLost(f"Fence lost on job {job_id}")
        return await self._append(job_id, type, data)

    async def _append(self, job_id: uuid.UUID, type: str, data: dict) -> int:
        while True:
            seq = (await self.last_log_seq(job_id) or 0) + 1
            try:
                await self.log_collection.insert_one({"job_id": str(job_id), "seq": seq, "type": type, "data": data, "timestamp": datetime.now(timezone.utc)})
                self.last_write = time.monotonic()
                return seq
            except DuplicateKeyError:
                continue

    async def last_log_seq(self, job_id: uuid.UUID) -> int | None:
        doc = await self.log_collection.find_one({"job_id": str(job_id), "seq": {"$exists": True}}, sort=[("seq", DESCENDING)], projection=["seq"])
        if not doc:
            return None
        return doc.get("seq", 0)

    async def last_snapshot(self, job_id: uuid.UUID) -> dict | None:
        return await self.log_collection.find_one({"job_id": str(job_id), "seq": {"$exists": True}, "type": {"$in": ["create", "update", "complete", "terminate"]}}, sort=[("seq", DESCENDING)])

    async def logs_after(self, job_id: uuid.UUID, after: int | None) -> Sequence[dict]:
        query: dict[str, Any] = {"job_id": str(job_id), "seq": {"$gt": after or 0}}  # $gt skips legacy rows that have no seq
        return [doc async for doc in self.log_collection.find(query, sort=[("seq", ASCENDING)])]

    async def get_logs(self, job_id: uuid.UUID) -> AsyncGenerator[dict, None]:
        async for doc in await self.log_collection.aggregate([
            {"$match": {"job_id": str(job_id)}},
            {"$sort": {"timestamp": 1}},
            {"$project": {
                "_id": 0,
                "id": "$job_id",
                "type": 1,
                "data": 1,
                "timestamp": {"$dateToString": {"date": "$timestamp", "format": "%Y-%m-%dT%H:%M:%S.%LZ"}}
            }}
        ]):
            yield doc
