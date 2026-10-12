import asyncio
import json
import logging
import time
import uuid
from datetime import datetime, timedelta, timezone
from collections.abc import Sequence
from contextvars import ContextVar
from typing import Any, AsyncGenerator

from app.models.presentation import JobDetail, JobStatus, UserId
from pymongo import ASCENDING, DESCENDING, AsyncMongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError


# retries exhausted: never claimed, not counted toward the user cap
_PERMANENT_ERROR = {"status": "error", "metadata.error.attempting_recovery": False}

lease_owner: ContextVar[str | None] = ContextVar("lease_owner", default=None)


def iso_z(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def annotate_idle(job: JobDetail):
    leased = job.lease_expires_at is not None and job.lease_expires_at > datetime.now(timezone.utc)
    if job.status not in {"complete", "error"} and not leased:
        job.status = "idle"
    return job


class JobManager:

    def __init__(self, mongo_uri: str, lease_seconds: int):
        self.client = AsyncMongoClient(mongo_uri, tz_aware=True)
        self.db = self.client.get_database()
        self.collection = self.db["presentation_jobs"]
        self.log_collection = self.db["presentation_job_logs"]
        self.lease_seconds = lease_seconds
        self.logger = logging.getLogger(__name__)

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

    def _lease_expiry(self) -> datetime:
        return datetime.now(timezone.utc) + timedelta(seconds=self.lease_seconds)

    async def claim_next(self, owner: str) -> JobDetail | None:
        now = datetime.now(timezone.utc)
        doc = await self.collection.find_one_and_update(
            {
                "status": {"$ne": "complete"},
                "$and": [
                    {"$or": [{"lease_expires_at": None}, {"lease_expires_at": {"$lt": now}}]},
                    {"$or": [{"metadata.error.next_attempt": None}, {"metadata.error.next_attempt": {"$lte": time.time()}}]},
                    {"$nor": [_PERMANENT_ERROR]},
                ],
            },
            [{"$set": {
                "lease_owner": owner,
                "lease_expires_at": self._lease_expiry(),
                # a lease_owner still set on an expired lease means the last worker died without releasing it
                "crashes": {"$add": [{"$ifNull": ["$crashes", 0]}, {"$cond": [{"$ifNull": ["$lease_owner", False]}, 1, 0]}]},
            }}],
            sort=[("creation_time", ASCENDING)],
            return_document=ReturnDocument.AFTER,
        )
        if not doc:
            return None
        return JobDetail(**doc)

    async def renew_lease(self, job_id: uuid.UUID, owner: str) -> bool:
        result = await self.collection.update_one({"id": str(job_id), "lease_owner": owner}, {"$set": {"lease_expires_at": self._lease_expiry()}})
        return result.matched_count > 0

    async def release_lease(self, job_id: uuid.UUID, owner: str):
        await self.collection.update_one({"id": str(job_id), "lease_owner": owner}, {"$unset": {"lease_owner": 1, "lease_expires_at": 1}})

    async def create(self, user_id: UserId, textbook_file: str, textbook_mime: str, slides: int | None, instruction: str | None, tags: list[str]) -> JobDetail:
        job = JobDetail(user_id=user_id, textbook_file=textbook_file, textbook_mime=textbook_mime, slides=slides, instruction=instruction, tags=set(tags))
        await self.collection.insert_one(job.model_dump(mode="json"))
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
            self.logger.warning("Dropped write to job %s: lease is held by another worker.", job_id)
        if doc:
            data = json.loads(JobDetail(**doc).model_dump_json())
            await self.log(job_id, "update", data)
            if fields_set and fields_set.get("status") == "complete":
                await self.log(job_id, "complete", data)

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
        return await self.collection.count_documents({"user_id": user_id, "status": {"$ne": "complete"}, "$nor": [_PERMANENT_ERROR]})

    async def delete(self, job: JobDetail) -> bool:
        result = await self.collection.delete_one({"id": str(job.id), "status": {"$ne": "complete"}})
        if result.deleted_count == 0:
            return False
        await self.log(job.id, "terminate", json.loads(job.model_copy(update={"status": "error"}).model_dump_json()))
        await self.log_collection.delete_many({"job_id": str(job.id), "type": {"$ne": "terminate"}})  # keeps terminate so seq never restarts
        return True

    async def log(self, job_id: uuid.UUID, type: str, data: dict) -> int:
        # unique (job_id, seq): a late writer hits a duplicate and retries higher, so readers never skip a seq
        while True:
            seq = (await self.last_log_seq(job_id) or 0) + 1
            try:
                await self.log_collection.insert_one({"job_id": str(job_id), "seq": seq, "type": type, "data": data, "timestamp": datetime.now(timezone.utc)})
                return seq
            except DuplicateKeyError:
                continue

    async def last_log_seq(self, job_id: uuid.UUID) -> int | None:
        doc = await self.log_collection.find_one({"job_id": str(job_id)}, sort=[("seq", DESCENDING)], projection=["seq"])
        if not doc:
            return None
        return doc.get("seq", 0)

    async def logs_after(self, job_id: uuid.UUID, after: int | None) -> Sequence[dict]:
        query: dict[str, Any] = {"job_id": str(job_id)}
        if after is not None: query["seq"] = {"$gt": after}
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
