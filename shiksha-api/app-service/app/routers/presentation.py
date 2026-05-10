import asyncio
from contextlib import asynccontextmanager
import pathlib
import uuid
from app.services.presentation.service import PresentationService, new_default as new_pres_svc
from fastapi import APIRouter, Depends, FastAPI, File, Form, Request, UploadFile, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import Response

from app.models.presentation import JobDetail, ToolInfo
from app.services.presentation.agent import planner, designer, finalizer, designer_toolset
from app.services.presentation.utils import save_file_with_hash


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pres_svc = new_pres_svc()
    async with app.state.pres_svc.run():
        yield


router = APIRouter(tags=["Presentation Generation"], prefix="/presentation", lifespan=lifespan)


def pres(request: Request) -> PresentationService:
    return request.app.state.pres_svc


@router.post("/job")
async def create_job(textbook_file: UploadFile = File(...), slides: int | None = Form(None), instruction: str | None = Form(None), use_pre_generated_outline: bool = Form(True), service: PresentationService = Depends(pres)) -> JobDetail:
    """ Schedule a new PPTX generation job. """
    textbook_path = await save_file_with_hash(service.storage, textbook_file)
    return await service.jobs.create(textbook_path, slides, instruction, use_pre_generated_outline)


@router.get("/job")
async def get_job(id: uuid.UUID, service: PresentationService = Depends(pres)) -> JobDetail | None:
    """ Get details about a specific job. """
    return await service.jobs.get(id)


@router.delete("/job")
async def delete_job(id: uuid.UUID, service: PresentationService = Depends(pres)) -> bool:
    """ Terminate and delete a job. """
    return await service.jobs.delete(id)


@router.head("/job/{job_id}", include_in_schema=False)
@router.get("/job/{job_id}")
async def download_job_pptx(job_id: uuid.UUID, service: PresentationService = Depends(pres)) -> Response:
    """ Download the output PPTX file from a completed job. """
    job = await service.jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    storage_path = service.storage.path("out", pathlib.Path(job.textbook_file).stem, "%s.pptx" % job_id)
    if not await service.storage.exists(storage_path):
        raise HTTPException(status_code=404, detail="File not found")
    content, size = await asyncio.gather(service.storage.read_bytes(storage_path), service.storage.size(storage_path))
    return Response(
        content=content,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={
            "Content-Disposition": f'attachment; filename="{job_id}.pptx"',
            "X-File-Size": str(size)
        }
    )


@router.get("/tools")
async def get_tools() -> list[ToolInfo]:
    """ Get information about all agent tools. """
    return list({
        tool.function: ToolInfo(name=tool.metadata.get("action", tool.name), function_name=tool.function.__name__, description=tool.description or "")
        for agent in (planner, designer, finalizer)
        for toolset in [*agent.toolsets, designer_toolset]
        for tool in toolset.tools.values()
    }.values())


@router.websocket("/events/{id}")
async def events_handle(ws: WebSocket, id: uuid.UUID, service: PresentationService = Depends(pres)):
    await ws.accept()
    shutdown = asyncio.create_task(ws.receive())
    q = asyncio.Queue()
    service.jobs.log_subscribers.add(q)
    rtid = service.jobs.on_online(id)
    id_ = str(id)
    try:
        async for e in service.jobs.get_logs(id):
            if e["id"] == id_ and not shutdown.done():
                await ws.send_json(e)
        await service.jobs.pub(id)
        while True:
            task = asyncio.create_task(q.get())
            done, _ = await asyncio.wait([task, shutdown], return_when=asyncio.FIRST_COMPLETED)
            task.cancel()
            if shutdown.done():
                break
            e = list(done)[0].result()
            if e is None:
                await ws.close()
                break
            assert(isinstance(e, dict))
            if e["id"] != id_:
                continue
            await ws.send_json(e)
    except WebSocketDisconnect:
        pass
    finally:
        service.jobs.log_subscribers.discard(q)
        service.jobs.on_offline(id, rtid)