import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, AsyncGenerator
from app.models.presentation import JobDetail, JobStatus, UserId
from pymongo import ASCENDING, DESCENDING, AsyncMongoClient


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
        self.online: dict[bytes, asyncio.Future[None]] = {}
        self._online: dict[bytes, set[bytes]] = {}

    async def __aenter__(self):
        await asyncio.gather(
            self.collection.create_index([("id", ASCENDING)], unique=True),
            self.collection.create_index([("user_id", ASCENDING), ("creation_time", DESCENDING)]),
            self.collection.create_index([("user_id", ASCENDING), ("status", ASCENDING), ("creation_time", DESCENDING)]),
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

    def on_online(self, job_id: uuid.UUID) -> uuid.UUID:
        id = uuid.uuid4()
        if job_id.bytes not in self._online:
            self._online[job_id.bytes] = set()
            self.online[job_id.bytes] = asyncio.Future()
        self._online[job_id.bytes].add(id.bytes)
        return id

    def on_offline(self, job_id: uuid.UUID, rtid: uuid.UUID):
        if job_id.bytes not in self._online:
            return
        self._online[job_id.bytes].discard(rtid.bytes)
        if len(self._online[job_id.bytes]) > 0:
            return
        del self._online[job_id.bytes]
        self.online[job_id.bytes].cancel()
        del self.online[job_id.bytes]

    async def pub(self, job_id: uuid.UUID):
        await self.queue.put(job_id)

    async def sub(self) -> AsyncGenerator[uuid.UUID | None, None]:
        while True:
            yield await self.queue.get()

    async def create(self, user_id: UserId, textbook_file: str, slides: int | None, instruction: str | None, use_pre_generated_outline: bool = True) -> JobDetail:
        job = JobDetail(user_id=user_id, textbook_file=textbook_file, slides=slides, instruction=instruction, use_pre_generated_outline=use_pre_generated_outline)
        doc = job.model_dump()
        doc["id"] = str(job.id)
        await self.collection.insert_one(doc)
        self._notify_listeners(job.id)
        await self.pub(job.id)
        self.logger.info("Created job for %s", textbook_file)
        return job

    async def latest_completed_outline(self, textbook_file: str) -> dict[str, Any] | None:
        doc = await self.collection.find_one({"textbook_file": textbook_file, "status": "complete", "metadata.plan.outline": {"$exists": True}}, sort=[("creation_time", -1)])
        return doc["metadata"]["plan"] if doc else None

    async def update(self, job_id: uuid.UUID, fields: dict[str, Any]):
        await self.collection.update_one({"id": str(job_id)}, {"$set": fields})
        self._notify_listeners(job_id)
        await self.pub(job_id)

    async def get(self, job_id: uuid.UUID) -> JobDetail | None:
        doc = await self.collection.find_one({"id": str(job_id)})
        return JobDetail(**doc) if doc else None

    async def list(self, user_id: UserId, offset: int = 0, limit: int = 20, status: JobStatus | None = None, created_after: datetime | None = None, created_before: datetime | None = None) -> list[JobDetail]:
        filter: dict[str, Any] = {"user_id": user_id}
        if status is not None:
            filter["status"] = status
        if created_after is not None or created_before is not None:
            filter["creation_time"] = {}
            if created_after is not None:
                filter["creation_time"]["$gte"] = created_after if created_after.tzinfo is not None else created_after.replace(tzinfo=timezone.utc)
            if created_before is not None:
                filter["creation_time"]["$lte"] = created_before if created_before.tzinfo is not None else created_before.replace(tzinfo=timezone.utc)
        cursor = self.collection.find(filter, sort=[("creation_time", DESCENDING)], skip=offset, limit=limit)
        return [JobDetail(**doc) async for doc in cursor]

    async def delete(self, job_id: uuid.UUID) -> bool:
        result = await self.collection.delete_one({"id": str(job_id), "status": {"$ne": "complete"}})
        if result.deleted_count == 0:
            return False
        await self.log_collection.delete_many({"job_id": str(job_id)})
        await self.pub(job_id)
        return True

    async def log(self, job_id: uuid.UUID, type: str, data: dict):
        dt_now = datetime.now()
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