import asyncio
from collections import defaultdict
from contextlib import asynccontextmanager
import io
import json
import mimetypes
import pathlib
from datetime import datetime
from typing import Annotated
import uuid
from app.services.presentation.service import PresentationService, new_default as new_pres_svc
from fastapi import APIRouter, Depends, FastAPI, File, Form, Header, Request, status, UploadFile, HTTPException, Query
from fastapi.responses import Response, StreamingResponse

from app.models.presentation import SYSTEM_USER_ID, JobDetail, JobStatus, ToolInfo, UserId
from app.services.presentation.agent import planner, designer, finalizer, designer_toolset
from app.services.presentation.utils import LibreOffice, LibreOfficeOutputFormat, save_file_with_hash


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pres_svc = new_pres_svc()
    async with app.state.pres_svc.run():
        yield


router = APIRouter(tags=["Presentation Generation"], prefix="/presentation", lifespan=lifespan)
XUserIDHeader = Annotated[UserId, Header(alias="X-User-ID")]
libre_office = LibreOffice()


def pres(request: Request) -> PresentationService:
    return request.app.state.pres_svc


def annotate_idle(service: PresentationService, job: JobDetail):
    if job.status not in {"complete", "error"} and job.id.bytes not in service.processing:
        job.status = "idle"
    return job


@router.post("/job")
async def create_job(user_id: XUserIDHeader, textbook_file: UploadFile = File(...), slides: int | None = Form(None), instruction: str | None = Form(None), tags: list[str] = Form(list()), service: PresentationService = Depends(pres)) -> JobDetail:
    """ Schedule a new PPTX generation job. """
    textbook_path = await save_file_with_hash(service.storage, textbook_file)
    return await service.jobs.create(user_id, textbook_path, slides, instruction, tags)


@router.get("/job")
async def get_job(user_id: XUserIDHeader, id: uuid.UUID, service: PresentationService = Depends(pres)) -> JobDetail | None:
    """ Get details about a specific job. """
    job = await service.jobs.get(id)
    if job is not None and job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")
    if job is not None:
        annotate_idle(service, job)
    return job


@router.get("/jobs")
async def list_jobs(user_id: XUserIDHeader, offset: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), textbook_file: str | None = Query(None), status: JobStatus | None = Query(None), created_after: datetime | None = Query(None), created_before: datetime | None = Query(None), tags: list[str] | None = Query(None), service: PresentationService = Depends(pres)) -> list[JobDetail]:
    """ List available jobs. """
    jobs = await service.jobs.list(user_id, offset, limit, textbook_file, status, created_after, created_before, tags)
    list(map(lambda job: annotate_idle(service, job), jobs))
    return jobs


@router.delete("/job")
async def delete_job(user_id: XUserIDHeader, id: uuid.UUID, service: PresentationService = Depends(pres)) -> bool:
    """ Terminate and delete a job. """
    job = await service.jobs.get(id)
    if job is None or job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")
    return await service.jobs.delete(job)


locks: dict[tuple[uuid.UUID, LibreOfficeOutputFormat], asyncio.Lock] = defaultdict(asyncio.Lock)
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

    etag = '"%s-%s"' % (job_id, file_format)
    if if_none_match == etag:
        return Response(status_code=status.HTTP_304_NOT_MODIFIED, headers={"ETag": etag, "Cache-Control": "private, max-age=31536000, immutable"})

    stem = pathlib.Path(job.textbook_file).stem
    storage_path = service.storage.path("out", stem, "%s.%s" % (job_id, file_format))
    media_type, _ = mimetypes.guess_type(storage_path)
    async with locks[job_id, file_format]:
        try:
            if not await service.storage.exists(storage_path):
                if file_format == "pptx":
                    raise HTTPException(status_code=404, detail="File not found")

                pptx_path = service.storage.path("out", stem, "%s.pptx" % job_id)
                content = await libre_office.convert(io.BytesIO(await service.storage.read_bytes(pptx_path)), output_format=file_format)
                size = len(content)
                await service.storage.write_bytes(storage_path, content)
            else:
                content, size = await asyncio.gather(service.storage.read_bytes(storage_path), service.storage.size(storage_path))
        finally:
            if not locks[job_id, file_format].locked():
                del locks[job_id, file_format]

    return Response(content=content, media_type=media_type, headers={
        "Cache-Control": "private, max-age=31536000, immutable",
        "Content-Disposition": f'attachment; filename="{job_id}.{file_format}"',
        "ETag": etag,
        "X-File-Size": str(size)
    })


@router.get("/tools")
async def get_tools() -> list[ToolInfo]:
    """ Get information about all agent tools. """
    return list({
        tool.function: ToolInfo(name=tool.metadata.get("action", tool.name), function_name=tool.function.__name__, description=tool.description or "")
        for agent in (planner, designer, finalizer)
        for toolset in [*agent.toolsets, designer_toolset]
        for tool in toolset.tools.values()
    }.values())


@router.get("/events/pending/{user_id}")
async def events_pending(request: Request, user_id: UserId, service: PresentationService = Depends(pres)):
    """
    Subscribe to pending job counter.
    """

    async def stream():
        q = asyncio.Queue()
        service.jobs.log_subscribers.add(q)
        try:
            count = await service.jobs.get_pending_count(user_id)
            yield f"data: {count}\n\n"
            while not await request.is_disconnected():
                e = await q.get()
                if e is None: break
                assert(isinstance(e, dict))
                if e["type"] not in {"create", "complete", "terminate"} or e["data"]["user_id"] != str(user_id): continue
                new_count = await service.jobs.get_pending_count(user_id)
                if count != new_count:
                    count = new_count
                    yield f"data: {count}\n\n"
        finally:
            service.jobs.log_subscribers.discard(q)

    return StreamingResponse(stream(), media_type="text/event-stream")


@router.get("/events/{user_id}/{id}")
async def events_handle(request: Request, user_id: UserId, id: uuid.UUID, service: PresentationService = Depends(pres)):
    """
    Subscribe to job events.
    """

    job = await service.jobs.get(id)
    if job is None or job.user_id not in {user_id, SYSTEM_USER_ID}:
        raise HTTPException(status_code=404, detail="Job not found")

    async def stream():
        q = asyncio.Queue()
        service.jobs.log_subscribers.add(q)
        id_ = str(id)

        try:
            async for e in service.jobs.get_logs(id):
                if await request.is_disconnected(): break
                yield f"data: {json.dumps(e)}\n\n"

            await service.jobs.pub(id)
            while not await request.is_disconnected():
                e = await q.get()
                if e is None: break
                assert(isinstance(e, dict))
                if e["id"] != id_: continue
                yield f"data: {json.dumps(e)}\n\n"
        finally:
            service.jobs.log_subscribers.discard(q)

    return StreamingResponse(stream(), media_type="text/event-stream")
