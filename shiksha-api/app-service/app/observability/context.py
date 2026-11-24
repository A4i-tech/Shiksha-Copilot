"""Attach the calling user to telemetry and mark failures the HTTP status cannot show.

The user id is stored as the ``enduser.id`` span attribute, which the Azure exporter maps to
``user_AuthenticatedId`` in App Insights. Child spans (LLM calls, Qdrant, Mongo, blob) inherit it
from their parent in ``UserSpanProcessor`` so a single ``where user_AuthenticatedId == ...`` query
finds everything a user triggered. A plain span attribute is used instead of OTel baggage on purpose:
baggage is propagated to outbound HTTP calls and would leak the id to OpenAI, Qdrant, etc.
"""

from contextlib import contextmanager
from typing import Any, Iterator, Optional

from opentelemetry import trace
from opentelemetry.context import Context
from opentelemetry.sdk.trace import ReadableSpan, Span, SpanProcessor
from opentelemetry.trace import Status, StatusCode

USER_ATTRIBUTE = "enduser.id"
_USER_HEADER = b"x-user-id"
_MAX_USER_ID_LENGTH = 64


def bind_user(user_id: object) -> None:
    """Tag the current span (normally the request span) with the calling user's id."""
    if not user_id:
        return
    span = trace.get_current_span()
    if span.is_recording():
        span.set_attribute(USER_ATTRIBUTE, str(user_id)[:_MAX_USER_ID_LENGTH])


@contextmanager
def span(name: str, user_id: object = None, **attributes: Any) -> Iterator[trace.Span]:
    """Open a custom span (for work that has no request span, e.g. background jobs).

    Attributes with a ``None`` value are skipped. An exception escaping the block is recorded on the span.
    """
    tracer = trace.get_tracer("shiksha-api")
    with tracer.start_as_current_span(name, attributes={k: v for k, v in attributes.items() if v is not None}) as current:
        bind_user(user_id)
        yield current


def mark_current_span_failed(description: str) -> None:
    """Mark the current span as failed.

    Needed for errors App Insights cannot infer from the HTTP status, e.g. a streaming response that
    already sent ``200`` before the generator failed.
    """
    span = trace.get_current_span()
    if span.is_recording():
        span.set_status(Status(StatusCode.ERROR, description[:256]))


class UserSpanProcessor(SpanProcessor):
    """Copies ``enduser.id`` from the parent span onto each new child span."""

    def on_start(self, span: Span, parent_context: Optional[Context] = None) -> None:
        parent_attributes = getattr(trace.get_current_span(parent_context), "attributes", None)
        if parent_attributes and (user_id := parent_attributes.get(USER_ATTRIBUTE)):
            span.set_attribute(USER_ATTRIBUTE, user_id)

    def on_end(self, span: ReadableSpan) -> None:
        pass

    def shutdown(self) -> None:
        pass

    def force_flush(self, timeout_millis: int = 30_000) -> bool:
        return True


class UserIdHeaderMiddleware:
    """Pure ASGI middleware (safe for SSE/streaming) that binds ``X-User-ID`` to the request span."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            for name, value in scope.get("headers", ()):
                if name == _USER_HEADER:
                    bind_user(value.decode("latin-1"))
                    break
        await self.app(scope, receive, send)
