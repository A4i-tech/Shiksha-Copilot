import logging
from unittest.mock import MagicMock

import pytest
from opentelemetry.sdk._logs import LoggerProvider
from opentelemetry.sdk._logs.export import InMemoryLogRecordExporter, SimpleLogRecordProcessor
from opentelemetry.instrumentation.logging.handler import LoggingHandler
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, SpanExportResult
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter

from app.observability.context import EnvironmentSpanProcessor
from app.observability.scrub import RedactingLogRecordProcessor, ScrubbingSpanExporter, redact


class TestRedact:
    def test_masks_openai_style_keys(self):
        text = "Error code: 401 - Incorrect API key provided: sk-proj-ab**********cd4e. Retry."
        assert "sk-proj" not in redact(text)
        assert "sk-***" in redact(text) and redact(text).endswith("Retry.")

    def test_masks_bearer_tokens_and_key_value_credentials(self):
        assert redact("Authorization: Bearer abcdef1234567890") == "Authorization: Bearer ***"
        assert redact("conn AccountKey=AbC123+/== next") == "conn AccountKey=*** next"
        assert redact("https://x/y?sig=SECRETVALUE&a=1") == "https://x/y?sig=***&a=1"
        assert redact("password=hunter2;user=bob") == "password=***;user=bob"

    @pytest.mark.parametrize("text", ["risk-based assessment", "task-force plan", "ask-me", "tokens used: 30", "no secrets here"])
    def test_leaves_ordinary_text_alone(self, text):
        assert redact(text) == text


def _span(name="op", attributes=None):
    memory = InMemorySpanExporter()
    provider = TracerProvider()
    provider.add_span_processor(SimpleSpanProcessor(memory))
    with provider.get_tracer("t").start_as_current_span(name, attributes=attributes or {}):
        pass
    return memory.get_finished_spans()[0]


class TestSpanExportFiltering:
    def test_redacts_secrets_in_span_attributes(self):
        delegate = MagicMock()
        delegate.export.return_value = SpanExportResult.SUCCESS
        span = _span(attributes={"exception.message": "bad key sk-live-abcdef123456", "http.route": "/x"})
        ScrubbingSpanExporter(delegate, 256).export([span])
        (exported,) = delegate.export.call_args.args[0]
        assert "sk-live" not in exported.attributes["exception.message"]

    def test_drops_asgi_send_receive_spans_but_keeps_real_ones(self):
        delegate = MagicMock()
        delegate.export.return_value = SpanExportResult.SUCCESS
        noise = _span("GET /x http send", {"asgi.event.type": "http.response.start"})
        real = _span("GET /x", {"http.route": "/x"})
        ScrubbingSpanExporter(delegate, 256).export([noise, real])
        (exported,) = delegate.export.call_args.args[0]
        assert exported.name == "GET /x"

    def test_only_noise_means_nothing_is_sent(self):
        delegate = MagicMock()
        noise = _span("GET /x http receive", {"asgi.event.type": "http.request"})
        assert ScrubbingSpanExporter(delegate, 256).export([noise]) == SpanExportResult.SUCCESS
        delegate.export.assert_not_called()


class TestRedactingLogRecordProcessor:
    @pytest.fixture
    def logger_and_exporter(self):
        exporter = InMemoryLogRecordExporter()
        provider = LoggerProvider()
        provider.add_log_record_processor(RedactingLogRecordProcessor())  # before the exporter, like the distro
        provider.add_log_record_processor(SimpleLogRecordProcessor(exporter))
        log = logging.getLogger("app.redaction-test")
        log.setLevel(logging.INFO)
        log.propagate = False
        handler = LoggingHandler(logger_provider=provider)
        log.addHandler(handler)
        yield log, exporter
        log.removeHandler(handler)

    def test_masks_secrets_in_body_and_exception_text(self, logger_and_exporter):
        log, exporter = logger_and_exporter
        try:
            raise RuntimeError("Incorrect API key provided: sk-proj-ab******cd4e")
        except RuntimeError:
            log.exception("OpenAI call failed with key sk-proj-ab******cd4e")

        (emitted,) = exporter.get_finished_logs()
        record = emitted.log_record
        assert "sk-proj" not in record.body
        assert "sk-proj" not in record.attributes["exception.message"]
        assert "sk-proj" not in record.attributes["exception.stacktrace"]
        assert record.attributes["exception.type"] == "RuntimeError"  # still reported as an exception

    def test_plain_logs_pass_through_unchanged(self, logger_and_exporter):
        log, exporter = logger_and_exporter
        log.info("Processing request for user 42")
        (emitted,) = exporter.get_finished_logs()
        assert emitted.log_record.body == "Processing request for user 42"


class TestEnvironmentSpanProcessor:
    def test_stamps_environment_on_every_span(self):
        memory = InMemorySpanExporter()
        provider = TracerProvider()
        provider.add_span_processor(EnvironmentSpanProcessor("staging"))
        provider.add_span_processor(SimpleSpanProcessor(memory))
        tracer = provider.get_tracer("t")
        with tracer.start_as_current_span("request"):
            with tracer.start_as_current_span("child"):
                pass
        assert [s.attributes["deployment.environment"] for s in memory.get_finished_spans()] == ["staging", "staging"]
