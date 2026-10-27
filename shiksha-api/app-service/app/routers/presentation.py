import asyncio
from contextlib import asynccontextmanager
import io
import json
import logging
import mimetypes
import pathlib
import time
from datetime import datetime, timezone
from typing import Annotated, AsyncIterator
import uuid
import weakref
from app.config import settings
from app.messaging.nats_broker import NatsBroker
from app.services.presentation.consumer import CANCEL_SUBJECT, make_broker, publish_job, reap_dead_letters, reconcile, run_jobs
from app.services.presentation.job import iso_z
from app.services.presentation.service import PresentationService, new_default as new_pres_svc
from fastapi import APIRouter, Depends, FastAPI, File, Form, Header, Request, status, UploadFile, HTTPException, Query
from fastapi.responses import Response, StreamingResponse

from app.models.presentation import SYSTEM_USER_ID, JobDetail, JobInfo, JobStatus, ToolInfo, UserId, to_info
from app.services.presentation.agent import planner, designer, finalizer, designer_toolset
from app.services.presentation.utils import LibreOffice, LibreOfficeOutputFormat, save_file_with_hash


logger = logging.getLogger(__name__)


async def _connect(broker: NatsBroker, connected: asyncio.Event):
    while True:
        try:
            await broker.connect()
            break
        except Exception:
            logger.exception("Could not reach NATS. Retrying in 5 seconds.")
            await asyncio.sleep(5)
    connected.set()


async def _after_connect(connected: asyncio.Event, fn, *args, **kwargs):
    await connected.wait()
    try:
        await fn(*args, **kwargs)
    except Exception:
        logger.exception("Presentation background task %s failed", fn.__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    svc = app.state.pres_svc = new_pres_svc()
    broker = app.state.broker = make_broker()
    stop, connected = asyncio.Event(), asyncio.Event()
    every = settings.pres_reconcile_seconds
    async with svc.jobs:
        tasks = [
            asyncio.create_task(_connect(broker, connected)),
            asyncio.create_task(_after_connect(connected, reap_dead_letters, broker, svc.jobs)),
            asyncio.create_task(_after_connect(connected, reconcile, broker, svc.jobs, every, every)),
        ]
        if settings.shiksha_role == "all":
            tasks.append(asyncio.create_task(_after_connect(connected, run_jobs, svc, broker, stop)))
        try:
            yield
        finally:
            stop.set()
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)
            await broker.close()


router = APIRouter(tags=["Presentation Generation"], prefix="/presentation", lifespan=lifespan)
XUserIDHeader = Annotated[UserId, Header(alias="X-User-ID")]
libre_office = LibreOffice()

ALLOWED_MIMES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/markdown",
}


def pres(request: Request) -> PresentationService:
    return request.app.state.pres_svc


def get_broker(request: Request) -> NatsBroker:
    return request.app.state.broker


ja_conversions_sem = asyncio.Semaphore(settings.pres_max_file_conversions)
ja_locks: weakref.WeakValueDictionary[tuple[uuid.UUID, LibreOfficeOutputFormat], asyncio.Lock] = weakref.WeakValueDictionary()
ja_locks_guard = asyncio.Lock()
async def _ja_lock(key):
    async with ja_locks_guard:
        lock = ja_locks.get(key)
        if lock is None:
            lock = asyncio.Lock()
            ja_locks[key] = lock
        return lock


@router.post("/job")
async def create_job(
    user_id: XUserIDHeader,
    content_length: int = Header(lt=settings.pres_upload_max_filesize),  # bail early
    textbook_file: UploadFile = File(...),
    slides: int | None = Form(None, ge=1, le=settings.pres_max_slide_count),
    instruction: str | None = Form(None, max_length=settings.pres_max_instruction_size),
    tags: list[str] = Form(default_factory=list, max_length=16),
    service: PresentationService = Depends(pres),
    broker: NatsBroker = Depends(get_broker),
) -> JobDetail:
    """ Schedule a new PPTX generation job. """
    if user_id != SYSTEM_USER_ID and settings.pres_max_jobs_per_user != -1 and (n_jobs := await service.jobs.get_pending_count(user_id)) >= settings.pres_max_jobs_per_user:
        raise HTTPException(status_code=429, detail="You already have %d job(s) ongoing." % n_jobs)

    filename = textbook_file.filename
    if not filename: raise HTTPException(status_code=400, detail="Unsupported file type (cannot read filename)")
    if textbook_file.size is not None and textbook_file.size > settings.pres_upload_max_filesize: raise HTTPException(status_code=400, detail="Bad file size")  # bail early
    try:
        textbook_path, textbook_mime = await save_file_with_hash(service.storage, textbook_file, filename, ALLOWED_MIMES, settings.pres_download_chunk_size, settings.pres_upload_max_filesize)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    job = await service.jobs.create(user_id, textbook_path, textbook_mime, slides, instruction, tags)
    try:
        await publish_job(broker, service.jobs, job)
    except Exception:
        logger.exception("Could not queue job %s", job.id)
        await service.jobs.delete(job)
        raise HTTPException(status_code=503, detail="The presentation queue is not reachable. Wait a minute and try again.")
    return job


@router.get("/job")
async def get_job(user_id: XUserIDHeader, id: uuid.UUID, service: PresentationService = Depends(pres)) -> JobInfo | None:
    """ Get details about a specific job. """
    job = await service.jobs.get(id)
    if job is not None and job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")
    return to_info(job) if job is not None else None


@router.get("/job/retry")
async def retry_job(user_id: XUserIDHeader, id: uuid.UUID, service: PresentationService = Depends(pres), broker: NatsBroker = Depends(get_broker)) -> bool:
    """ List available jobs. """
    job = await service.jobs.get(id)
    if job is not None and job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")
    if job is not None and job.status == "error" and "error" in job.metadata and not job.metadata["error"]["attempting_recovery"]:
        await service.jobs.update(job.id, {"status": "init", "message": "Retrying", "enqueued": False}, ["metadata.error"])
        try:
            await publish_job(broker, service.jobs, job, msg_id=f"{job.id}:retry:{int(time.time())}")
        except Exception:
            logger.warning("Could not queue retry of job %s. The reconcile loop will publish it.", job.id, exc_info=True)
        return True
    return False


@router.get("/jobs")
async def list_jobs(user_id: XUserIDHeader, offset: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), textbook_file: str | None = Query(None), status: JobStatus | None = Query(None), created_after: datetime | None = Query(None), created_before: datetime | None = Query(None), tags: list[str] | None = Query(None), service: PresentationService = Depends(pres)) -> list[JobInfo]:
    """ List available jobs. """
    jobs = await service.jobs.list(user_id, offset, limit, textbook_file, status, created_after, created_before, tags)
    return [to_info(job) for job in jobs]


@router.delete("/job")
async def delete_job(user_id: XUserIDHeader, id: uuid.UUID, service: PresentationService = Depends(pres), broker: NatsBroker = Depends(get_broker)) -> bool:
    """ Terminate and delete a job. """
    job = await service.jobs.get(id)
    if job is None or job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")
    cancelled = await service.jobs.request_cancel(job)
    if cancelled:
        try:
            await broker.notify(CANCEL_SUBJECT, str(id).encode())
        except Exception:
            logger.warning("Could not signal the worker to cancel job %s. It stops at its next job write.", id, exc_info=True)
    return cancelled


@router.head("/job/{job_id}", include_in_schema=False)
@router.get("/job/{job_id}")
async def download_job_artifact(
    user_id: XUserIDHeader,
    job_id: uuid.UUID,
    file_format: LibreOfficeOutputFormat = "pptx",
    if_none_match: str | None = Header(default=None),
    service: PresentationService = Depends(pres)
) -> Response:
    """ Download the output PPTX file from a completed job. """
    job = await service.jobs.get(job_id)
    if job is None or job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")

    stem = pathlib.Path(job.textbook_file).stem
    storage_path = service.storage.path("out", stem, "%s.%s" % (job_id, file_format))
    media_type, _ = mimetypes.guess_type(storage_path)
    async with await _ja_lock((job_id, file_format)):
        if not await service.storage.exists(storage_path):
            if file_format == "pptx":
                raise HTTPException(status_code=404, detail="File not found")

            pptx_path = service.storage.path("out", stem, "%s.pptx" % job_id)
            async with ja_conversions_sem:
                content = await libre_office.convert(io.BytesIO(await service.storage.read_bytes(pptx_path)), output_format=file_format)
            size = len(content)
            await service.storage.write_bytes(storage_path, content)
            stream = [content]
        else:
            size = await service.storage.size(storage_path)
            stream = service.storage.read_stream(storage_path, settings.pres_download_chunk_size, size)

    etag = '"%s-%s"' % (job_id, file_format)
    headers = {
        "ETag": etag,
        "Cache-Control": "private, max-age=31536000, immutable",
        "Content-Disposition": "attachment",
        "Content-Length": str(size),
        "X-File-Size": str(size)
    }
    if if_none_match == etag:
        return Response(status_code=status.HTTP_304_NOT_MODIFIED, headers=headers)
    return StreamingResponse(content=stream, media_type=media_type, headers=headers)


@router.get("/tools")
async def get_tools() -> list[ToolInfo]:
    """ Get information about all agent tools. """
    return list({
        tool.function: ToolInfo(name=tool.metadata.get("action", tool.name), function_name=tool.function.__name__, description=tool.description or "")
        for agent in (planner, designer, finalizer)
        for toolset in [*agent.toolsets, designer_toolset]
        for tool in toolset.tools.values()
    }.values())


async def _until_disconnected(request: Request) -> AsyncIterator[None]:
    while not request.app.state.sigint.done() and not await request.is_disconnected():
        yield
        await asyncio.sleep(settings.pres_sse_poll_seconds)


@router.get("/events/pending/{user_id}")
async def events_pending(request: Request, user_id: UserId, service: PresentationService = Depends(pres)):
    """
    Subscribe to pending job counter.
    """

    async def stream():
        count = None
        async for _ in _until_disconnected(request):
            new_count = await service.jobs.get_pending_count(user_id)
            if count != new_count:
                count = new_count
                yield f"data: {count}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")


@router.get("/events/{user_id}/{id}")
async def events_handle(request: Request, user_id: UserId, id: uuid.UUID, service: PresentationService = Depends(pres)):
    """
    Subscribe to job events.
    """

    after = await service.jobs.last_log_seq(id)  # read before the job, so no event falls between them
    job = await service.jobs.get(id)
    if job is None or job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")

    # the snapshot is a log row, so its seq is the exact cursor: no replay of older rows, no gap
    last = await service.jobs.last_snapshot(id)
    if last:
        after = last["seq"]

    async def stream():
        nonlocal after
        data = last["data"] if last else json.loads(job.model_dump_json())
        snapshot = {"id": str(id), "type": "update", "data": data, "timestamp": iso_z(datetime.now(timezone.utc))}
        yield f"data: {json.dumps(snapshot)}\n\n"
        async for _ in _until_disconnected(request):
            for doc in await service.jobs.logs_after(id, after):
                after = doc["seq"]
                e = {"id": doc["job_id"], "type": doc["type"], "data": doc["data"], "timestamp": iso_z(doc["timestamp"])}
                yield f"data: {json.dumps(e)}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")
