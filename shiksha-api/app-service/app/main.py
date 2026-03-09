from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from fastmcp import FastMCP
from fastmcp.server.http import StarletteWithLifespan
from app.config import settings
from app.routers import chat_router, chat_router_mcp, question_paper_router

mcp = FastMCP(
    name=settings.app_name,
    instructions="AI-powered educational chat API for Shiksha platform",
    host=settings.host,
    port=settings.port,
    debug=settings.debug,
    stateless_http=True
)

mcp_app = mcp.http_app(path="/mcp")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for proper startup and shutdown"""

    assert isinstance(app.state.MCP_APP, StarletteWithLifespan)
    async with app.state.MCP_APP.lifespan(app):
        yield
    from app.services.general_chat_service import GENERAL_CHAT_SERVICE_INSTANCE
    from app.services.lesson_chat_service import LESSON_CHAT_SERVICE_INSTANCE
    from app.services.question_paper_service import QUESTION_PAPER_SERVICE_INSTANCE

    try:
        await GENERAL_CHAT_SERVICE_INSTANCE.cleanup()
        await LESSON_CHAT_SERVICE_INSTANCE.cleanup()
        await QUESTION_PAPER_SERVICE_INSTANCE.cleanup()
    except Exception as e:
        print(f"Error during cleanup: {e}")

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AI-powered educational chat API for Shiksha platform",
    debug=settings.debug,
    lifespan=lifespan,
    redirect_slashes=False,
    routes=[*mcp_app.routes] 
)


app.state.MCP_APP = mcp_app


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(question_paper_router)
chat_router_mcp(mcp)

@mcp.tool("version")
async def mcp_version() -> str:
    """Get the version"""
    return settings.version

@mcp.tool("app_name")
async def mcp_app_name() -> str:
    """Get the app name"""
    return settings.app_name

@mcp.tool("health")
async def mcp_health() -> str:
    """Get the health status"""
    return "healthy"


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
    return HTTPException(status_code=500, detail="Internal server error")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app", host=settings.host, port=settings.port, reload=settings.debug
    )