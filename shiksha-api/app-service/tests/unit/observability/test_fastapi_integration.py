"""End-to-end check of the assumptions the telemetry design rests on, against a real FastAPI app."""

import logging

import pytest
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.testclient import TestClient
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from opentelemetry.trace import StatusCode

from app.config import Settings
from app.observability import UserIdHeaderMiddleware, bind_user, mark_current_span_failed
from app.observability.context import USER_ATTRIBUTE, UserSpanProcessor


@pytest.fixture
def harness():
    memory = InMemorySpanExporter()
    provider = TracerProvider()
    provider.add_span_processor(UserSpanProcessor())
    provider.add_span_processor(SimpleSpanProcessor(memory))

    app = FastAPI()
    app.add_middleware(UserIdHeaderMiddleware)
    log = logging.getLogger("app.test")

    @app.get("/health")
    async def health():
        return {"status": "healthy"}

    @app.get("/boom")
    async def boom():
        raise RuntimeError("unhandled")

    @app.exception_handler(Exception)
    async def handler(request, exc):  # mirrors app.main.global_exception_handler
        log.error("Unhandled exception", exc_info=exc, extra={"telemetry_handled": True})
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

    @app.post("/caught")
    async def caught(body: dict):
        bind_user(body["user_id"])
        try:
            raise ValueError("inner")
        except ValueError as e:
            raise HTTPException(status_code=500, detail="Failed") from e

    @app.get("/stream")
    async def stream():
        async def gen():
            yield "one\n"
            mark_current_span_failed("stream broke")
            yield "two\n"

        return StreamingResponse(gen())

    @app.get("/child")
    async def child():
        with provider.get_tracer("test").start_as_current_span("work"):
            pass
        return {}

    FastAPIInstrumentor.instrument_app(app, tracer_provider=provider, excluded_urls=Settings(_env_file=None).telemetry_excluded_urls)
    yield TestClient(app, raise_server_exceptions=False), memory
    FastAPIInstrumentor.uninstrument_app(app)


def _server_spans(memory):
    return [s for s in memory.get_finished_spans() if s.kind.name == "SERVER"]


def test_health_endpoint_produces_no_telemetry(harness):
    client, memory = harness
    assert client.get("/health").status_code == 200
    assert memory.get_finished_spans() == ()


def test_root_path_produces_no_telemetry(harness):
    client, memory = harness
    client.get("/")
    assert memory.get_finished_spans() == ()


def test_unhandled_exception_is_recorded_exactly_once_on_request_span(harness):
    client, memory = harness
    assert client.get("/boom").status_code == 500
    (server,) = _server_spans(memory)
    exception_events = [e for e in server.events if e.name == "exception"]
    assert len(exception_events) == 1
    assert exception_events[0].attributes["exception.type"] == "RuntimeError"
    assert server.status.status_code == StatusCode.ERROR


def test_handler_log_is_flagged_so_it_is_not_double_reported(harness, caplog):
    client, _ = harness
    with caplog.at_level(logging.ERROR, logger="app.test"):
        client.get("/boom")
    assert [r.telemetry_handled for r in caplog.records] == [True]


def test_caught_and_reraised_http_500_fails_request_but_has_no_span_exception(harness):
    """Why routers must use logger.exception: the span alone would not carry the traceback."""
    client, memory = harness
    assert client.post("/caught", json={"user_id": "u-1"}).status_code == 500
    (server,) = _server_spans(memory)
    assert server.status.status_code == StatusCode.ERROR
    assert not [e for e in server.events if e.name == "exception"]
    assert server.attributes[USER_ATTRIBUTE] == "u-1"


def test_user_id_header_reaches_request_and_child_spans(harness):
    client, memory = harness
    client.get("/child", headers={"X-User-ID": "teacher-7"})
    by_name = {s.name: s for s in memory.get_finished_spans()}
    assert by_name["GET /child"].attributes[USER_ATTRIBUTE] == "teacher-7"
    assert by_name["work"].attributes[USER_ATTRIBUTE] == "teacher-7"


def test_streaming_failure_marks_request_failed_despite_200(harness):
    client, memory = harness
    response = client.get("/stream")
    assert response.status_code == 200
    (server,) = _server_spans(memory)
    assert server.status.status_code == StatusCode.ERROR
