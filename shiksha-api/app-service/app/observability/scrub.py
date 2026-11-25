"""Strip prompt/response content from spans before they leave the process for Azure Monitor.

Langfuse and pydantic-ai share the global tracer provider with App Insights (so one trace shows the
whole request), but their spans carry full prompts, model output and request bodies. Langfuse is the
approved home for that content; App Insights is not. This exporter wrapper sits in front of the
Azure exporter only, so Langfuse still receives the unmodified spans.

Fails closed: a span we cannot scrub is dropped rather than exported as-is.
"""

import logging
import re
from typing import Any, Mapping, Optional, Sequence

from opentelemetry.sdk._logs import LogRecordProcessor, ReadWriteLogRecord
from opentelemetry.sdk.trace import Event, ReadableSpan
from opentelemetry.sdk.trace.export import SpanExporter, SpanExportResult

logger = logging.getLogger(__name__)

# Attribute keys (exact or prefix) known to carry user/LLM content. Dropped entirely.
CONTENT_ATTRIBUTE_PREFIXES: tuple[str, ...] = (
    "langfuse.observation.input",
    "langfuse.observation.output",
    "langfuse.trace.input",
    "langfuse.trace.output",
    "langfuse.observation.prompt",
    "gen_ai.input.messages",
    "gen_ai.output.messages",
    "gen_ai.system_instructions",
    "gen_ai.prompt",
    "gen_ai.completion",
    "gen_ai.tool.call.arguments",
    "gen_ai.tool.call.result",
    "pydantic_ai.all_messages",
    "all_messages_events",
    "final_result",
    "tool_arguments",
    "tool_response",
    "model_request_parameters",
    "input.value",
    "output.value",
)

# Span event names carrying message content (legacy pydantic-ai / GenAI event conventions).
CONTENT_EVENT_PREFIXES: tuple[str, ...] = ("gen_ai.",)

# Keys that are legitimately long; cap them separately instead of at the default limit.
PER_KEY_LIMITS: Mapping[str, int] = {
    "exception.stacktrace": 16_384,
    "exception.message": 2_048,
    "url.full": 2_048,
    "http.url": 2_048,
    "db.statement": 1_024,
    "db.query.text": 1_024,
}


# Secrets that leak through error messages, e.g. OpenAI echoes a masked key ("sk-proj-ab****cd") in a 401.
_SECRET_PATTERNS: tuple[re.Pattern[str], ...] = (
    re.compile(r"(?<![A-Za-z0-9])sk-[A-Za-z0-9_*\-]{4,}"),
    re.compile(r"(?i)(?<![A-Za-z0-9])bearer\s+[A-Za-z0-9._~+/=\-]{8,}"),
    re.compile(r"(?i)(?<![A-Za-z0-9_])(api[_-]?key|account[_-]?key|access[_-]?key|sharedaccesssignature|password|secret|token|sig)=[^&\s;\"']+"),
)

# ASGI send/receive child spans: ~2 per request, no diagnostic value, ~65% of dependency volume.
_NOISE_SPAN_ATTRIBUTE = "asgi.event.type"


def redact(text: str) -> str:
    """Mask API keys, bearer tokens and ``key=value`` credentials in free text."""
    text = _SECRET_PATTERNS[0].sub("sk-***", text)
    text = _SECRET_PATTERNS[1].sub("Bearer ***", text)
    return _SECRET_PATTERNS[2].sub(lambda m: f"{m.group(1)}=***", text)


def _truncate(value: str, limit: int) -> str:
    if len(value) <= limit:
        return value
    return f"{value[:limit]}...[truncated {len(value) - limit} chars]"


def scrub_attributes(attributes: Optional[Mapping[str, Any]], max_length: int) -> dict[str, Any]:
    """Return a copy of ``attributes`` with content keys removed and long strings capped."""
    clean: dict[str, Any] = {}
    for key, value in (attributes or {}).items():
        if key.startswith(CONTENT_ATTRIBUTE_PREFIXES):
            continue
        if isinstance(value, str):
            value = _truncate(redact(value), PER_KEY_LIMITS.get(key, max_length))
        elif isinstance(value, (list, tuple)):
            value = type(value)(_truncate(redact(v), max_length) if isinstance(v, str) else v for v in value)
        clean[key] = value
    return clean


def scrub_span(span: ReadableSpan, max_length: int) -> ReadableSpan:
    events = tuple(
        Event(e.name, scrub_attributes(e.attributes, max_length), e.timestamp)
        for e in span.events
        if not e.name.startswith(CONTENT_EVENT_PREFIXES)
    )
    return ReadableSpan(
        name=span.name,
        context=span.context,
        parent=span.parent,
        resource=span.resource,
        attributes=scrub_attributes(span.attributes, max_length),
        events=events,
        links=span.links,
        kind=span.kind,
        status=span.status,
        start_time=span.start_time,
        end_time=span.end_time,
        instrumentation_scope=span.instrumentation_scope,
    )


class ScrubbingSpanExporter(SpanExporter):
    """Wraps another exporter: drops ASGI send/receive noise and scrubs every other span first."""

    def __init__(self, delegate: SpanExporter, max_attribute_length: int) -> None:
        self._delegate = delegate
        self._max_length = max_attribute_length

    def export(self, spans: Sequence[ReadableSpan]) -> SpanExportResult:
        safe: list[ReadableSpan] = []
        for span in spans:
            if _NOISE_SPAN_ATTRIBUTE in (span.attributes or {}):
                continue
            try:
                safe.append(scrub_span(span, self._max_length))
            except Exception:  # fail closed: never export a span we could not scrub
                logger.warning("Dropping span %r: scrubbing failed", span.name, exc_info=True)
        if not safe:
            return SpanExportResult.SUCCESS
        return self._delegate.export(safe)

    def shutdown(self) -> None:
        self._delegate.shutdown()

    def force_flush(self, timeout_millis: int = 30_000) -> bool:
        return self._delegate.force_flush(timeout_millis)


class RedactingLogRecordProcessor(LogRecordProcessor):
    """Masks secrets in log bodies and in exception text before logs reach Azure Monitor.

    Exception rows are built from ``exception.message`` / ``exception.stacktrace`` attributes, which
    a ``logging.Filter`` cannot reach.
    """

    _TEXT_ATTRIBUTES = ("exception.message", "exception.stacktrace")

    def on_emit(self, log_record: ReadWriteLogRecord) -> None:
        try:
            record = log_record.log_record
            if isinstance(record.body, str):
                record.body = redact(record.body)
            attributes = record.attributes
            if attributes:
                for key in self._TEXT_ATTRIBUTES:
                    value = attributes.get(key)
                    if isinstance(value, str):
                        attributes[key] = redact(value)
        except Exception:  # never let redaction break logging
            logger.warning("Log redaction failed", exc_info=True)

    def shutdown(self) -> None:
        pass

    def force_flush(self, timeout_millis: int = 30_000) -> bool:
        return True
