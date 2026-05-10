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
from fastapi import APIRouter, Depends, FastAPI, File, Form, Header, Request, UploadFile, HTTPException, Query
from fastapi.responses import Response, StreamingResponse

from app.models.presentation import JobDetail, JobStatus, ToolInfo, UserId
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


locks: dict[uuid.UUID, asyncio.Lock] = defaultdict(asyncio.Lock)
async def one_job(job_id: uuid.UUID):
    lock = locks[job_id]

    async with lock:
        try:
            yield job_id
        finally:
            if not lock.locked():
                locks.pop(job_id, None)


@router.post("/job")
async def create_job(user_id: XUserIDHeader, textbook_file: UploadFile = File(...), slides: int | None = Form(None), instruction: str | None = Form(None), use_pre_generated_outline: bool = Form(True), service: PresentationService = Depends(pres)) -> JobDetail:
    """ Schedule a new PPTX generation job. """
    textbook_path = await save_file_with_hash(service.storage, textbook_file)
    return await service.jobs.create(user_id, textbook_path, slides, instruction, use_pre_generated_outline)


@router.get("/job")
async def get_job(user_id: XUserIDHeader, id: uuid.UUID, service: PresentationService = Depends(pres)) -> JobDetail | None:
    """ Get details about a specific job. """
    job = await service.jobs.get(id)
    if job is not None and job.user_id != user_id:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/jobs")
async def list_jobs(user_id: XUserIDHeader, offset: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), status: JobStatus | None = None, created_after: datetime | None = None, created_before: datetime | None = None, service: PresentationService = Depends(pres)) -> list[JobDetail]:
    """ List available jobs. """
    return await service.jobs.list(user_id, offset, limit, status, created_after, created_before)


@router.delete("/job")
async def delete_job(user_id: XUserIDHeader, id: uuid.UUID, service: PresentationService = Depends(pres)) -> bool:
    """ Terminate and delete a job. """
    job = await service.jobs.get(id)
    if job is not None and job.user_id != user_id:
        raise HTTPException(status_code=404, detail="Job not found")
    return await service.jobs.delete(id)


@router.head("/job/{job_id}", include_in_schema=False)
@router.get("/job/{job_id}")
async def download_job_artifact(user_id: XUserIDHeader, job_id: uuid.UUID = Depends(one_job), file_format: LibreOfficeOutputFormat = "pptx", service: PresentationService = Depends(pres)) -> Response:
    """ Download the output PPTX file from a completed job. """
    job = await service.jobs.get(job_id)
    if job is None or job.user_id != user_id:
        raise HTTPException(status_code=404, detail="Job not found")

    stem = pathlib.Path(job.textbook_file).stem
    pptx_path = service.storage.path("out", stem, "%s.pptx" % job_id)
    storage_path = service.storage.path("out", stem, "%s.%s" % (job_id, file_format))
    media_type, _ = mimetypes.guess_type(storage_path)

    if await service.storage.exists(storage_path):
        content, size = await asyncio.gather(service.storage.read_bytes(storage_path), service.storage.size(storage_path))
        return Response(content=content, media_type=media_type, headers={
            "Content-Disposition": f'attachment; filename="{job_id}.{file_format}"',
            "X-File-Size": str(size)
        })

    if file_format == "pptx":
        raise HTTPException(status_code=404, detail="File not found")

    content = await libre_office.convert(io.BytesIO(await service.storage.read_bytes(pptx_path)), output_format=file_format)
    size = len(content)
    await service.storage.write_bytes(storage_path, content)
    return Response(content=content, media_type=media_type, headers={
        "Content-Disposition": f'attachment; filename="{job_id}.{file_format}"',
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


@router.get("/events/{id}")
async def events_handle(request: Request, id: uuid.UUID, service: PresentationService = Depends(pres)):
    """
    Subscribe to job events.
    """

    async def stream():
        q = asyncio.Queue()
        service.jobs.log_subscribers.add(q)
        rtid = service.jobs.on_online(id)
        id_ = str(id)

        try:
            async for e in service.jobs.get_logs(id):
                if await request.is_disconnected(): break
                if e["id"] == id_: yield f"data: {json.dumps(e)}\n\n"

            await service.jobs.pub(id)
            while not await request.is_disconnected():
                e = await q.get()
                if e is None: break
                assert(isinstance(e, dict))
                if e["id"] != id_: continue
                yield f"data: {json.dumps(e)}\n\n"
        finally:
            service.jobs.log_subscribers.discard(q)
            service.jobs.on_offline(id, rtid)

    return StreamingResponse(stream(), media_type="text/event-stream")
