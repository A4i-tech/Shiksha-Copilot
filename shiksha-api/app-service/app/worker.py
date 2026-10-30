import asyncio
import logging
import signal

from langfuse import get_client

from app.config import settings
from app.services.presentation.consumer import make_broker, run_jobs
from app.services.presentation.service import new_default

logger = logging.getLogger(__name__)


async def main():
    service = new_default()
    broker = make_broker()
    if settings.pres_storage_filesystem == "file":
        logger.warning("PRES_STORAGE_FILESYSTEM=file: the API and this worker only share files if they use the same disk path. Use blob storage when deployed.")
    loop = asyncio.get_running_loop()
    stop = asyncio.Event()
    for sig in (signal.SIGTERM, signal.SIGINT):
        signal.signal(sig, lambda *_: loop.call_soon_threadsafe(stop.set))
    try:
        async with service.jobs, broker:
            logger.info("Presentation worker started")
            await run_jobs(service, broker, stop)
    finally:
        get_client().flush()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
