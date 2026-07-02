import logging
import os
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from langfuse import Langfuse

logger = logging.getLogger(__name__)


def init_langfuse(app_env: str) -> Optional["Langfuse"]:
    """
    Initialize the Langfuse client. Returns None (no-op) when
    LANGFUSE_SECRET_KEY or LANGFUSE_PUBLIC_KEY are not set.
    """
    secret_key = os.getenv("LANGFUSE_SECRET_KEY")
    public_key = os.getenv("LANGFUSE_PUBLIC_KEY")

    if not secret_key or not public_key:
        logger.info("Langfuse keys not set — observability disabled.")
        logging.getLogger("langfuse").setLevel(logging.ERROR)
        return None

    # Defer import until after no-op check to avoid import overhead when keys are absent.
    from langfuse import Langfuse

    kwargs: dict[str, str] = {
        "environment": app_env,
        "secret_key": secret_key,
        "public_key": public_key,
    }

    host = os.getenv("LANGFUSE_HOST")
    if host:
        kwargs["host"] = host

    try:
        client = Langfuse(**kwargs)
        logger.info("Langfuse initialized (env=%s).", app_env)
        return client
    except Exception as exc:
        logger.warning("Langfuse initialization failed — observability disabled: %s", exc)
        return None
