import asyncio
import logging
import time
import uuid
from collections.abc import Callable

from app.config import settings
from app.messaging.consumer import Handler, run_consumer
from app.messaging.message import JobMessage
from app.messaging.nats_broker import NatsBroker
from app.services.presentation.job import JobManager, lease_owner
from app.services.presentation.service import PresentationService

logger = logging.getLogger(__name__)

JOBS_QUEUE = "pres.jobs"
CANCEL_SUBJECT = "pres.cancel"


def make_broker() -> NatsBroker:
    return NatsBroker(
        settings.nats_url,
        queues=[JOBS_QUEUE],
        ack_wait=settings.pres_ack_wait_seconds,
        max_deliver=settings.pres_max_deliver,
        replicas=settings.nats_replicas,
        creds=settings.nats_creds,
    )


async def publish_job(broker, jobs: JobManager, job, *, msg_id: str) -> None:
    message = JobMessage(type="presentation.run", job_id=job.id)
    await broker.publish(JOBS_QUEUE, message, msg_id=msg_id)
    await jobs.mark_enqueued(job.id)


async def _cancel_on_signal(broker, job_id: uuid.UUID, run: asyncio.Task, hit: list[bool]) -> None:
    try:
        async for data in broker.subscribe(CANCEL_SUBJECT):
            if data.decode() == str(job_id):
                hit.append(True)
                run.cancel()
                return
    except Exception:
        logger.warning("Cancel watcher for job %s stopped. The job stops at its next job write.", job_id, exc_info=True)


async def _fence_watch(jobs: JobManager, job_id: uuid.UUID, fence: str, run: asyncio.Task, every: float, lost: list[bool]) -> None:
    while True:
        await asyncio.sleep(every)
        try:
            held = await jobs.holds(job_id, fence)
        except Exception:
            logger.warning("Could not check the fence of job %s. Trying again.", job_id, exc_info=True)
            continue
        if not held:
            logger.warning("Job %s fence %s was taken by another delivery. Cancelling the run.", job_id, fence)
            lost.append(True)
            run.cancel()
            return


def make_handler(service: PresentationService, broker) -> Handler:
    async def handle(message: JobMessage, fence: str) -> None:
        job_id = message.job_id
        token = lease_owner.set(fence)
        try:
            if (job := await service.jobs.claim(job_id, fence)) is None:
                logger.info("Job %s: claim returned nothing (missing, complete, or failed for good)", job_id)
                return
            run = asyncio.create_task(service.run_job(job_id))
            hit: list[bool] = []
            lost: list[bool] = []
            watch = asyncio.create_task(_cancel_on_signal(broker, job_id, run, hit))
            fence_watch = asyncio.create_task(_fence_watch(service.jobs, job_id, fence, run, settings.pres_ack_wait_seconds / 3, lost))
            try:
                await run
            except asyncio.CancelledError:
                if hit:
                    await service.jobs.delete(job)
                elif not lost:
                    raise
            finally:
                watch.cancel()
                fence_watch.cancel()
        finally:
            lease_owner.reset(token)
            try:
                await asyncio.shield(service.jobs.release(job_id, fence))
            except Exception as exc:
                logger.warning("Could not release job %s: %s", job_id, exc)

    return handle


async def reap_dead_letters(broker, jobs: JobManager) -> None:
    while True:
        try:
            async for dead in broker.dead_letters(JOBS_QUEUE):
                job_id = dead.message.job_id
                try:
                    await jobs.fail_crashed(job_id, dead.num_delivered, f"Stopped after {dead.num_delivered} tries without finishing")
                except Exception:
                    logger.exception("Could not mark job %s as failed after a dead letter. The orphan sweep will.", job_id)
        except Exception:
            logger.exception("Could not read dead letters. Retrying.")
            await asyncio.sleep(5)


async def _republish(broker, jobs: JobManager, job, msg_id: str) -> None:
    try:
        await publish_job(broker, jobs, job, msg_id=msg_id)
    except Exception:
        logger.exception("Could not republish job %s. The next pass retries.", job.id)


async def reconcile(broker, jobs: JobManager, every: float, older_than: float) -> None:
    while True:
        try:
            for job in await jobs.unenqueued(older_than):
                await _republish(broker, jobs, job, f"{job.id}:0")
            for job in [*await jobs.retry_due(settings.pres_ack_wait_seconds, settings.pres_stall_seconds), *await jobs.idle_queued(settings.pres_stall_seconds)]:
                await _republish(broker, jobs, job, f"{job.id}:resched:{int(job.enqueued_at.timestamp())}")
            stale = settings.pres_stall_seconds + settings.pres_ack_wait_seconds * settings.pres_max_deliver
            for job in await jobs.orphaned(stale):
                await jobs.fail_crashed(job.id, settings.pres_max_deliver, "Stopped because the worker stopped responding")
        except Exception:
            logger.exception("Reconcile pass failed. Retrying.")
        await asyncio.sleep(every)


async def run_jobs(service: PresentationService, broker, stop: asyncio.Event) -> None:
    await run_consumer(
        broker,
        JOBS_QUEUE,
        make_handler(service, broker),
        stop=stop,
        heartbeat_every=settings.pres_ack_wait_seconds / 3,
        drain_timeout=settings.pres_drain_seconds,
        alive=worker_alive(service.jobs),
    )


def worker_alive(jobs: JobManager) -> Callable[[], bool]:
    return lambda: time.monotonic() - jobs.last_write < settings.pres_stall_seconds
