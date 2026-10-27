import asyncio
import contextlib
import logging
import time

from app.config import settings
from app.messaging.broker import DeadLetter
from app.messaging.memory import MemoryBroker
from app.messaging.message import JobMessage
from app.models.presentation import JobDetail
from app.services.presentation import consumer as pc
from app.services.presentation.job import lease_owner


def make_job():
    return JobDetail(user_id="0" * 24, textbook_file="a.pdf", textbook_mime="application/pdf", slides=None, instruction=None)


class FakeJobs:
    def __init__(self, claimed=None, unenqueued=(), orphaned=(), fail_for=(), release_fails=False):
        self.claimed, self._unenqueued, self._orphaned = claimed, unenqueued, orphaned
        self.fail_for, self.release_fails = fail_for, release_fails
        self.events = []
        self.unenqueued_args, self.orphaned_args = [], []

    async def claim(self, job_id, fence):
        self.events.append(("claim", job_id, fence))
        return self.claimed

    async def release(self, job_id, fence):
        if self.release_fails:
            raise RuntimeError("mongo is down")
        self.events.append(("release", job_id, fence))

    async def mark_enqueued(self, job_id):
        self.events.append(("enqueued", job_id))

    async def delete(self, job):
        self.events.append(("delete", job.id))

    async def unenqueued(self, older_than):
        self.unenqueued_args.append(older_than)
        return self._unenqueued

    async def orphaned(self, older_than):
        self.orphaned_args.append(older_than)
        return self._orphaned

    async def fail_crashed(self, job_id, deliveries):
        if job_id in self.fail_for:
            raise RuntimeError("mongo is down")
        self.events.append(("fail", job_id, deliveries))


class FakeBroker:
    def __init__(self, *dead):
        self.dead = dead

    async def dead_letters(self, queue):
        for letter in self.dead:
            yield letter
        await asyncio.Event().wait()


class FakeService:
    def __init__(self, jobs, run=None):
        self.jobs, self.run, self.seen = jobs, run, []

    async def run_job(self, job_id):
        self.seen.append(lease_owner.get())
        if self.run:
            await self.run()


async def until(condition, timeout=1):
    give_up = time.perf_counter() + timeout
    while not condition():
        assert time.perf_counter() < give_up, "condition not met in time"
        await asyncio.sleep(0.005)


async def stop(task):
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError):
        await task


def message(job):
    return JobMessage(type="presentation.run", job_id=str(job.id))


async def test_handler_skips_run_job_when_claim_returns_none():
    job = make_job()
    service = FakeService(FakeJobs(claimed=None))
    await pc.make_handler(service, MemoryBroker())(message(job), "f1")
    assert service.seen == []


async def test_handler_runs_with_the_fence_and_releases_after():
    job = make_job()
    jobs = FakeJobs(claimed=job)
    service = FakeService(jobs)
    await pc.make_handler(service, MemoryBroker())(message(job), "f1")
    assert service.seen == ["f1"]
    assert jobs.events == [("claim", job.id, "f1"), ("release", job.id, "f1")]
    assert lease_owner.get() is None


async def test_cancelled_handler_still_releases():
    job = make_job()
    jobs = FakeJobs(claimed=job)
    service = FakeService(jobs, run=asyncio.Event().wait)
    task = asyncio.create_task(pc.make_handler(service, MemoryBroker())(message(job), "f1"))
    await until(lambda: service.seen)
    await stop(task)
    assert jobs.events[-1] == ("release", job.id, "f1")


async def test_cancel_signal_stops_the_run_deletes_the_job_and_returns():
    job = make_job()
    jobs, broker = FakeJobs(claimed=job), MemoryBroker()
    service = FakeService(jobs, run=asyncio.Event().wait)
    task = asyncio.create_task(pc.make_handler(service, broker)(message(job), "f1"))
    await until(lambda: service.seen)
    await until(lambda: broker._subs[pc.CANCEL_SUBJECT])
    await broker.notify(pc.CANCEL_SUBJECT, str(make_job().id).encode())
    await asyncio.sleep(0.05)
    assert not task.done()
    await broker.notify(pc.CANCEL_SUBJECT, str(job.id).encode())
    await asyncio.wait_for(task, 1)
    assert jobs.events[-2:] == [("delete", job.id), ("release", job.id, "f1")]


async def test_handler_logs_a_failed_release_and_does_not_raise(caplog):
    job = make_job()
    service = FakeService(FakeJobs(claimed=job, release_fails=True))
    with caplog.at_level(logging.WARNING):
        await pc.make_handler(service, MemoryBroker())(message(job), "f1")
    assert f"Could not release job {job.id}: mongo is down" in caplog.text


async def test_publish_job_queues_once_per_msg_id_and_marks_enqueued():
    job = make_job()
    jobs, broker = FakeJobs(), MemoryBroker()
    await pc.publish_job(broker, jobs, job)
    await pc.publish_job(broker, jobs, job)
    assert (await broker.fetch(pc.JOBS_QUEUE, 0.1)).message == message(job)
    assert await broker.fetch(pc.JOBS_QUEUE, 0.1) is None
    assert len(jobs.events) == 2


async def test_reap_dead_letters_fails_the_job_at_max_deliver():
    job = make_job()
    jobs, broker = FakeJobs(), MemoryBroker(ack_wait=0.02, max_deliver=3)
    await pc.publish_job(broker, jobs, job)
    for _ in range(3):
        assert await broker.fetch(pc.JOBS_QUEUE, 0.5)
    assert await broker.fetch(pc.JOBS_QUEUE, 0.1) is None
    task = asyncio.create_task(pc.reap_dead_letters(broker, jobs))
    await until(lambda: len(jobs.events) > 1)
    await stop(task)
    assert jobs.events[1:] == [("fail", job.id, 3)]


async def test_reap_dead_letters_goes_on_when_one_job_cannot_be_failed():
    first, second = make_job(), make_job()
    jobs = FakeJobs(fail_for={first.id})
    broker = FakeBroker(DeadLetter(message(first), 3), DeadLetter(message(second), 3))
    task = asyncio.create_task(pc.reap_dead_letters(broker, jobs))
    await until(lambda: jobs.events)
    await stop(task)
    assert jobs.events == [("fail", second.id, 3)]


async def test_reconcile_publishes_unenqueued_and_fails_orphaned(monkeypatch):
    monkeypatch.setattr("app.services.presentation.consumer.settings.pres_max_deliver", 4)
    lost, stuck = make_job(), make_job()
    jobs, broker = FakeJobs(unenqueued=[lost], orphaned=[stuck]), MemoryBroker()
    task = asyncio.create_task(pc.reconcile(broker, jobs, 60, 7))
    await until(lambda: ("fail", stuck.id, 4) in jobs.events)
    await stop(task)
    assert (await broker.fetch(pc.JOBS_QUEUE, 0.1)).message == message(lost)
    assert ("enqueued", lost.id) in jobs.events
    assert ("fail", stuck.id, 4) in jobs.events
    assert jobs.unenqueued_args[0] == 7
    assert jobs.orphaned_args[0] == settings.pres_stall_seconds + settings.pres_ack_wait_seconds * 4



class CancelJobs:
    def __init__(self, job): self.job = job
    async def get(self, job_id): return self.job
    async def request_cancel(self, job): return True


class NotifyBroker:
    def __init__(self, fails=False): self.fails, self.sent = fails, []
    async def notify(self, subject, data):
        if self.fails:
            raise RuntimeError("nats is down")
        self.sent.append((subject, data))


async def test_delete_job_signals_the_worker():
    from app.routers.presentation import delete_job
    job, broker = make_job(), NotifyBroker()
    assert await delete_job(job.user_id, job.id, FakeService(CancelJobs(job)), broker)
    assert broker.sent == [(pc.CANCEL_SUBJECT, str(job.id).encode())]


async def test_delete_job_still_cancels_when_the_signal_fails():
    from app.routers.presentation import delete_job
    job = make_job()
    assert await delete_job(job.user_id, job.id, FakeService(CancelJobs(job)), NotifyBroker(fails=True))
