import asyncio
import logging
import signal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.config import settings
from app.routers import chat_router, presentation_router, question_paper_router, lesson_plan_router
from langfuse import get_client

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for proper startup and shutdown"""

    app.state.sigint = asyncio.Future()
    def sigint_handler(sig, frame):
        app.state.sigint.set_result(True)
        if callable(prev): prev(sig, frame)
    prev = signal.signal(signal.SIGINT, sigint_handler)

    yield

    get_client().flush()

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AI-powered educational chat API for Shiksha platform",
    debug=settings.debug,
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(presentation_router)
app.include_router(question_paper_router)
app.include_router(lesson_plan_router)


@app.get("/")
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "build": settings.build,
        "version": settings.version
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app", host=settings.host, port=settings.port, reload=settings.debug
    )
