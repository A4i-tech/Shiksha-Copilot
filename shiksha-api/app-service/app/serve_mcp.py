from contextlib import asynccontextmanager
from app.config import settings
from app.routers import chat_router_mcp
from mcp.server.fastmcp import FastMCP

@asynccontextmanager
async def lifespan(app: FastMCP):
    """Lifespan context manager for proper startup and shutdown"""
    # Startup
    yield
    # Shutdown
    from app.services.general_chat_service import GENERAL_CHAT_SERVICE_INSTANCE
    from app.services.lesson_chat_service import LESSON_CHAT_SERVICE_INSTANCE

    try:
        await GENERAL_CHAT_SERVICE_INSTANCE.cleanup()
        await LESSON_CHAT_SERVICE_INSTANCE.cleanup()
    except Exception as e:
        print(f"Error during cleanup: {e}")


app = FastMCP(
    name=settings.app_name,
    host=settings.host,
    port=settings.port,
    debug=settings.debug,
    lifespan=lifespan
)

# Include tools
chat_router_mcp(app)

# Global exception handler -- TODO: find a FastMCP-equivalent for this
#@app.exception_handler(Exception)
#async def global_exception_handler(request, exc):
#    return HTTPException(status_code=500, detail="Internal server error")


@app.tool(name="version", description="Get the version")
async def mcp_version() -> str: return settings.version

@app.tool(name="app_name", description="Get the app name")
async def mcp_app_name() -> str: return settings.app_name

@app.tool(name="health", description="Get the health status")
async def mcp_health() -> str: return "healthy"

if settings.transport == "mcp-http":
    print("Running MCP (streamable-http)")
    app.run(transport="streamable-http")
elif settings.transport == "mcp-sse":
    print("Running MCP (sse)")
    app.run(transport="mcp")
elif settings.transport == "mcp-stdio":
    print("Running MCP (stdio)")
    app.run(transport="stdio")
else:
    raise ValueError("Unexpected transport: " + settings.transport)
