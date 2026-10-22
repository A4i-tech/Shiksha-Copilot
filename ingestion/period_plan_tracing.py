import logging
import os
from contextlib import contextmanager
from typing import Any, Callable, Iterator

from openai import AsyncAzureOpenAI

get_client = None
if os.environ.get("LANGFUSE_PUBLIC_KEY") and os.environ.get("LANGFUSE_SECRET_KEY"):
    try:
        from langfuse import get_client
        from langfuse.openai import AsyncAzureOpenAI
    except ImportError:  # Langfuse is optional. Without the package or the keys every helper here does nothing.
        logging.getLogger(__name__).warning("LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY are set but the langfuse package is not installed. Tracing is off.")


def enabled() -> bool:
    return get_client is not None and bool(os.environ.get("LANGFUSE_PUBLIC_KEY") and os.environ.get("LANGFUSE_SECRET_KEY"))


@contextmanager
def trace(name: str, input: Any = None, user_id: str | None = None, tags: list[str] | None = None) -> Iterator[Callable[..., None]]:
    if not enabled():
        yield lambda **_: None
        return
    with get_client().start_as_current_span(name=name, input=input) as span:
        if user_id or tags:
            span.update_trace(user_id=user_id, tags=tags)
        yield lambda **fields: span.update(**fields)


def flush() -> None:
    if enabled():
        get_client().flush()
