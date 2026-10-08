import asyncio
import logging
import socket
import uuid

from langfuse import get_client

from app.config import settings
from app.services.presentation.job import JobManager
from app.services.presentation.service import new_default

logger = logging.getLogger(__name__)


async def _keep_lease(jobs: JobManager, job_id: uuid.UUID, owner: str, run: asyncio.Task[None]):
    while True:
        await asyncio.sleep(settings.pres_lease_seconds / 3)
        try:
            renewed = await jobs.renew_lease(job_id, owner)
        except Exception:
            logger.exception("Could not renew lease on job %s. Retrying.", job_id)  # transient Mongo error must not end the heartbeat
            continue
        if not renewed:
            logger.warning("Lost lease on job %s (deleted or taken over). Stopping it.", job_id)
            run.cancel()
            return


async def main():
    owner = f"{socket.gethostname()}-{uuid.uuid4().hex[:8]}"
    service = new_default()
    if settings.pres_storage_filesystem == "file":
        logger.warning("PRES_STORAGE_FILESYSTEM=file: the API and this worker only share files if they use the same disk path. Use blob storage when deployed.")
    async with service.jobs:
        logger.info("Presentation worker %s started", owner)
        try:
            while True:
                try:
                    job = await service.jobs.claim_next(owner)
                except Exception:
                    logger.exception("Could not claim a job. Retrying.")
                    job = None
                if job is None:
                    await asyncio.sleep(settings.pres_worker_poll_seconds)
                    continue

                run = asyncio.create_task(service.run_job(job.id))
                beat = asyncio.create_task(_keep_lease(service.jobs, job.id, owner, run))
                try:
                    result, = await asyncio.gather(run, return_exceptions=True)
                    if isinstance(result, BaseException) and not isinstance(result, asyncio.CancelledError):
                        logger.error("Job %s failed outside a step", job.id, exc_info=result)
                finally:
                    beat.cancel()
                    run.cancel()
                    try:
                        await service.jobs.release_lease(job.id, owner)
                    except Exception:
                        logger.exception("Could not release lease on job %s. It expires in %ss.", job.id, settings.pres_lease_seconds)
        finally:
            get_client().flush()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
