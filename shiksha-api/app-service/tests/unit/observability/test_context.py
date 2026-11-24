import pytest
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from opentelemetry.trace import StatusCode

from app.observability.context import (
    USER_ATTRIBUTE,
    UserIdHeaderMiddleware,
    UserSpanProcessor,
    bind_user,
    mark_current_span_failed,
    span,
)


@pytest.fixture
def tracer_and_spans():
    memory = InMemorySpanExporter()
    provider = TracerProvider()
    provider.add_span_processor(UserSpanProcessor())
    provider.add_span_processor(SimpleSpanProcessor(memory))
    return provider.get_tracer("test"), memory


class TestBindUser:
    def test_sets_attribute_on_current_span(self, tracer_and_spans):
        tracer, memory = tracer_and_spans
        with tracer.start_as_current_span("request"):
            bind_user("user-1")
        assert memory.get_finished_spans()[0].attributes[USER_ATTRIBUTE] == "user-1"

    def test_child_spans_inherit_user(self, tracer_and_spans):
        tracer, memory = tracer_and_spans
        with tracer.start_as_current_span("request"):
            bind_user("user-1")
            with tracer.start_as_current_span("llm-call"):
                with tracer.start_as_current_span("http-call"):
                    pass
        by_name = {s.name: s for s in memory.get_finished_spans()}
        assert by_name["llm-call"].attributes[USER_ATTRIBUTE] == "user-1"
        assert by_name["http-call"].attributes[USER_ATTRIBUTE] == "user-1"

    def test_no_user_means_no_attribute(self, tracer_and_spans):
        tracer, memory = tracer_and_spans
        with tracer.start_as_current_span("request"):
            bind_user(None)
            bind_user("")
            with tracer.start_as_current_span("child"):
                pass
        assert all(USER_ATTRIBUTE not in s.attributes for s in memory.get_finished_spans())

    def test_user_id_is_capped(self, tracer_and_spans):
        tracer, memory = tracer_and_spans
        with tracer.start_as_current_span("request"):
            bind_user("u" * 500)
        assert len(memory.get_finished_spans()[0].attributes[USER_ATTRIBUTE]) == 64

    def test_without_active_span_is_a_noop(self):
        assert not trace.get_current_span().is_recording()
        bind_user("user-1")  # must not raise


class TestSpanHelper:
    def test_creates_span_with_attributes_and_user_skipping_none(self, tracer_and_spans, monkeypatch):
        tracer, memory = tracer_and_spans
        monkeypatch.setattr("app.observability.context.trace.get_tracer", lambda name: tracer)
        with span("presentation.job", user_id="u-9", **{"shiksha.job.id": "j1", "shiksha.job.attempt": None}):
            pass
        (finished,) = memory.get_finished_spans()
        assert finished.name == "presentation.job"
        assert finished.attributes["shiksha.job.id"] == "j1"
        assert finished.attributes[USER_ATTRIBUTE] == "u-9"
        assert "shiksha.job.attempt" not in finished.attributes

    def test_exception_is_recorded_and_propagates(self, tracer_and_spans, monkeypatch):
        tracer, memory = tracer_and_spans
        monkeypatch.setattr("app.observability.context.trace.get_tracer", lambda name: tracer)
        with pytest.raises(RuntimeError):
            with span("presentation.job"):
                raise RuntimeError("job failed")
        (finished,) = memory.get_finished_spans()
        assert finished.status.status_code == StatusCode.ERROR
        assert [e.name for e in finished.events] == ["exception"]


class TestMarkFailed:
    def test_sets_error_status(self, tracer_and_spans):
        tracer, memory = tracer_and_spans
        with tracer.start_as_current_span("request"):
            mark_current_span_failed("stream broke")
        status = memory.get_finished_spans()[0].status
        assert status.status_code == StatusCode.ERROR and status.description == "stream broke"


class TestUserIdHeaderMiddleware:
    async def _call(self, headers, scope_type="http"):
        seen = {}

        async def app(scope, receive, send):
            seen["called"] = True

        scope = {"type": scope_type, "headers": headers}
        await UserIdHeaderMiddleware(app)(scope, None, None)
        assert seen["called"]

    async def test_binds_header_value(self, tracer_and_spans):
        tracer, memory = tracer_and_spans
        with tracer.start_as_current_span("request"):
            await self._call([(b"content-type", b"x"), (b"x-user-id", b"abc-123")])
        assert memory.get_finished_spans()[0].attributes[USER_ATTRIBUTE] == "abc-123"

    async def test_missing_header_and_non_http_scope_pass_through(self, tracer_and_spans):
        tracer, memory = tracer_and_spans
        with tracer.start_as_current_span("request"):
            await self._call([])
            await self._call([(b"x-user-id", b"abc")], scope_type="lifespan")
        assert USER_ATTRIBUTE not in memory.get_finished_spans()[0].attributes
