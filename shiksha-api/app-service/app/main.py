from app.config import settings

if __name__ == "__main__":
    if settings.transport == "http":
        import app.serve_http
    elif settings.transport in ("mcp-http", "mcp-sse", "mcp-stdio"):
        import app.serve_mcp
    else:
        raise ValueError("Unexpected transport: " + settings.transport)
