import asyncio
from app.config import settings
from app.routers import chat_router_mcp
from mcp.server.fastmcp import FastMCP

app = FastMCP(
    name=settings.app_name,
    host=settings.host,
    port=settings.port,
    debug=settings.debug
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

run_args = {}
if settings.transport == "mcp-http":
    print("Running MCP (streamable-http)")
    run_args = dict(transport="streamable-http")
elif settings.transport == "mcp-sse":
    print("Running MCP (sse)")
    run_args = dict(transport="mcp")
elif settings.transport == "mcp-stdio":
    print("Running MCP (stdio)")
    run_args = dict(transport="stdio")
else:
    raise ValueError("Unexpected transport: " + settings.transport)

try:
    app.run(**run_args)
finally:
    from app.services.general_chat_service import GENERAL_CHAT_SERVICE_INSTANCE
    from app.services.lesson_chat_service import LESSON_CHAT_SERVICE_INSTANCE
    try:
        asyncio.run(GENERAL_CHAT_SERVICE_INSTANCE.cleanup())
        asyncio.run(LESSON_CHAT_SERVICE_INSTANCE.cleanup())
    except Exception as e:
        print(f"Error during cleanup: {e}")
