import asyncio
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, AsyncGenerator
from app.models.presentation import JobDetail, JobStatus, UserId
from pymongo import ASCENDING, DESCENDING, AsyncMongoClient, ReturnDocument


class JobManager:

    def __init__(self, mongo_uri: str):
        self.client = AsyncMongoClient(mongo_uri)
        self.db = self.client.get_database()
        self.collection = self.db["presentation_jobs"]
        self.log_collection = self.db["presentation_job_logs"]
        self.logger = logging.getLogger(__name__)

        self.queue: asyncio.Queue[uuid.UUID | None] = asyncio.Queue()
        self.listeners: set[asyncio.Queue[uuid.UUID | None]] = set()
        self.log_subscribers: set[asyncio.Queue[dict | None]] = set()

    async def __aenter__(self):
        await asyncio.gather(
            self.collection.create_index([("id", ASCENDING)], unique=True),
            self.collection.create_index([("user_id", ASCENDING), ("creation_time", DESCENDING)]),
            self.collection.create_index([("user_id", ASCENDING), ("status", ASCENDING), ("creation_time", DESCENDING)]),
            self.collection.create_index([("tags", ASCENDING)]),
            self.log_collection.create_index([("job_id", ASCENDING), ("timestamp", ASCENDING)]),
        )
        return self

    async def __aexit__(self, exc_type, exc, tb):
        self.queue.put_nowait(None)
        for listener in list(self.listeners):
            listener.put_nowait(None)
        self.listeners.clear()
        for q in list(self.log_subscribers):
            q.put_nowait(None)
        self.log_subscribers.clear()
        await self.client.close()

    async def pub(self, job_id: uuid.UUID):
        await self.queue.put(job_id)

    async def sub(self) -> AsyncGenerator[uuid.UUID | None, None]:
        while True:
            yield await self.queue.get()

    async def create(self, user_id: UserId, textbook_file: str, slides: int | None, instruction: str | None, tags: set[str]) -> JobDetail:
        job = JobDetail(user_id=user_id, textbook_file=textbook_file, slides=slides, instruction=instruction, tags=tags)
        await self.collection.insert_one(job.model_dump(mode="json"))
        self._notify_listeners(job.id)
        await self.pub(job.id)
        await self.log(job.id, "create", json.loads(job.model_dump_json()), False)
        self.logger.info("Created job for %s", textbook_file)
        return job

    async def update(self, job_id: uuid.UUID, fields: dict[str, Any]):
        doc = await self.collection.find_one_and_update({"id": str(job_id)}, {"$set": fields}, return_document=ReturnDocument.AFTER)
        self._notify_listeners(job_id)
        await self.pub(job_id)
        if doc and "status" in fields and fields["status"] == "complete":
            job = JobDetail(**doc)
            await self.log(job.id, "complete", json.loads(job.model_dump_json()), False)

    async def get(self, job_id: uuid.UUID) -> JobDetail | None:
        doc = await self.collection.find_one({"id": str(job_id)})
        return JobDetail(**doc) if doc else None

    async def list(self, user_id: UserId, offset: int = 0, limit: int = 20, textbook_file: str | None = None, status: JobStatus | None = None, created_after: datetime | None = None, created_before: datetime | None = None, tags: set[str] | None = None) -> list[JobDetail]:
        filter: dict[str, Any] = {"user_id": user_id}
        if textbook_file is not None:
            filter["textbook_file"] = textbook_file
        if status is not None:
            filter["status"] = status
        if tags:
            filter["tags"] = {"$in": list(tags)}
        if created_after is not None or created_before is not None:
            filter["creation_time"] = {}
            if created_after is not None:
                filter["creation_time"]["$gte"] = created_after if created_after.tzinfo is not None else created_after.replace(tzinfo=timezone.utc)
            if created_before is not None:
                filter["creation_time"]["$lte"] = created_before if created_before.tzinfo is not None else created_before.replace(tzinfo=timezone.utc)
        cursor = self.collection.find(filter, sort=[("creation_time", DESCENDING)], skip=offset, limit=limit)
        return [JobDetail(**doc) async for doc in cursor]

    async def get_pending_count(self, user_id: UserId) -> int:
        return await self.collection.count_documents({"user_id": user_id, "status": {"$ne": "complete"}})

    async def delete(self, job: JobDetail) -> bool:
        result = await self.collection.delete_one({"id": str(job.id), "status": {"$ne": "complete"}})
        if result.deleted_count == 0:
            return False
        await self.log_collection.delete_many({"job_id": str(job.id)})
        await self.pub(job.id)
        await self.log(job.id, "terminate", json.loads(job.model_copy(update={"status": "error"}).model_dump_json()), False)
        return True

    async def log(self, job_id: uuid.UUID, type: str, data: dict, store: bool = True):
        dt_now = datetime.now()
        if store:
            await self.log_collection.insert_one({"job_id": str(job_id), "type": type, "data": data, "timestamp": dt_now})
        dead = []
        for q in self.log_subscribers:
            try:
                q.put_nowait({"id": str(job_id), "type": type, "data": data, "timestamp": dt_now.isoformat()})
            except asyncio.QueueFull:
                dead.append(q)
        for q in dead:
            self.log_subscribers.discard(q)

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

    def _notify_listeners(self, job_id: uuid.UUID):
        dead: list[asyncio.Queue[uuid.UUID | None]] = []
        for listener in list(self.listeners):
            try:
                listener.put_nowait(job_id)
            except asyncio.QueueFull:
                dead.append(listener)
        for listener in dead:
            self.listeners.discard(listener)
