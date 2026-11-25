from unittest.mock import MagicMock, patch

from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, SpanExportResult
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter

from app.observability import scrub
from app.observability.scrub import ScrubbingSpanExporter, scrub_attributes


def _finished_span(attributes=None, events=()):
    memory = InMemorySpanExporter()
    provider = TracerProvider()
    provider.add_span_processor(SimpleSpanProcessor(memory))
    with provider.get_tracer("test").start_as_current_span("op", attributes=attributes or {}) as span:
        for name, attrs in events:
            span.add_event(name, attrs)
    return memory.get_finished_spans()[0]


class TestScrubAttributes:
    def test_drops_content_keys(self):
        clean = scrub_attributes(
            {
                "langfuse.observation.input": "teacher question",
                "langfuse.trace.output": "answer",
                "gen_ai.input.messages": "[...]",
                "gen_ai.output.messages": "[...]",
                "gen_ai.system_instructions": "you are...",
                "pydantic_ai.all_messages": "[...]",
                "http.route": "/chat/general",
            },
            max_length=256,
        )
        assert clean == {"http.route": "/chat/general"}

    def test_keeps_non_content_langfuse_and_genai_attributes(self):
        attrs = {"gen_ai.request.model": "gpt", "gen_ai.usage.input_tokens": 12, "langfuse.observation.type": "generation"}
        assert scrub_attributes(attrs, max_length=256) == attrs

    def test_truncates_long_strings_but_keeps_short_ones(self):
        clean = scrub_attributes({"a": "x" * 300, "b": "short"}, max_length=256)
        assert clean["a"].startswith("x" * 256) and "truncated 44 chars" in clean["a"]
        assert clean["b"] == "short"

    def test_per_key_limit_allows_long_stacktrace(self):
        trace_text = "line\n" * 500
        assert scrub_attributes({"exception.stacktrace": trace_text}, max_length=256)["exception.stacktrace"] == trace_text

    def test_truncates_strings_inside_sequences_and_keeps_numbers(self):
        clean = scrub_attributes({"tags": ["y" * 300, "ok"], "n": 5}, max_length=10)
        assert clean["tags"][0].startswith("y" * 10) and clean["tags"][1] == "ok"
        assert clean["n"] == 5

    def test_none_attributes(self):
        assert scrub_attributes(None, max_length=10) == {}


class TestScrubbingSpanExporter:
    def test_exports_scrubbed_copy_and_leaves_original_untouched(self):
        span = _finished_span(
            attributes={"langfuse.observation.input": "secret prompt", "http.route": "/x"},
            events=[("gen_ai.user.message", {"content": "secret"}), ("exception", {"exception.type": "ValueError"})],
        )
        delegate = MagicMock()
        delegate.export.return_value = SpanExportResult.SUCCESS

        assert ScrubbingSpanExporter(delegate, 256).export([span]) == SpanExportResult.SUCCESS

        (exported,) = delegate.export.call_args.args[0]
        assert dict(exported.attributes) == {"http.route": "/x"}
        assert [e.name for e in exported.events] == ["exception"]
        assert exported.name == "op" and exported.context == span.context and exported.status == span.status
        # the span Langfuse sees must still carry the content
        assert span.attributes["langfuse.observation.input"] == "secret prompt"
        assert [e.name for e in span.events] == ["gen_ai.user.message", "exception"]

    def test_fails_closed_when_scrubbing_raises(self):
        span = _finished_span(attributes={"http.route": "/x"})
        delegate = MagicMock()
        with patch.object(scrub, "scrub_span", side_effect=RuntimeError("boom")):
            result = ScrubbingSpanExporter(delegate, 256).export([span])
        assert result == SpanExportResult.SUCCESS
        delegate.export.assert_not_called()

    def test_shutdown_and_flush_delegate(self):
        delegate = MagicMock()
        exporter = ScrubbingSpanExporter(delegate, 256)
        exporter.force_flush(1234)
        exporter.shutdown()
        delegate.force_flush.assert_called_once_with(1234)
        delegate.shutdown.assert_called_once()
