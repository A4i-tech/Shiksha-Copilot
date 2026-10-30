import asyncio
import contextlib
import os
import time
import uuid
from datetime import datetime, timedelta, timezone

import pytest

from app.services.presentation.job import FenceLost, JobCancelled, JobManager, lease_owner

pytestmark = pytest.mark.integration


@pytest.fixture
async def jobs():
    if "PRES_TEST_MONGODB_URL" not in os.environ:
        pytest.skip("PRES_TEST_MONGODB_URL is not set")
    db = f"pres_test_{uuid.uuid4().hex[:8]}"
    manager = JobManager(os.environ["PRES_TEST_MONGODB_URL"].rstrip("/") + "/" + db)
    async with manager:
        yield manager
        await manager.client.drop_database(db)


async def create(jobs, user_id="0" * 24):
    return await jobs.create(user_id, "a.pdf", "application/pdf", None, None, [])


@contextlib.contextmanager
def fenced(fence):
    token = lease_owner.set(fence)
    try:
        yield
    finally:
        lease_owner.reset(token)


async def test_claim_sets_the_fence_and_refuses_complete_and_permanent_error_jobs(jobs):
    job, done, dead = await create(jobs), await create(jobs), await create(jobs)
    await jobs.update(done.id, {"status": "complete"})
    await jobs.update(dead.id, {"status": "error", "metadata.error": {"attempting_recovery": False}})
    assert (await jobs.claim(job.id, "f1")).lease_owner == "f1"
    assert (await jobs.get(job.id)).lease_owner == "f1"
    assert await jobs.claim(done.id, "f1") is None
    assert await jobs.claim(dead.id, "f1") is None
    assert await jobs.claim(uuid.uuid4(), "f1") is None


async def test_release_only_clears_a_matching_fence(jobs):
    job = await create(jobs)
    await jobs.claim(job.id, "f1")
    await jobs.release(job.id, "other")
    assert (await jobs.get(job.id)).lease_owner == "f1"
    await jobs.release(job.id, "f1")
    assert (await jobs.get(job.id)).lease_owner is None


async def test_permanent_error_does_not_count_toward_user_cap(jobs):
    user = "1" * 24
    live, dead = await create(jobs, user), await create(jobs, user)
    await jobs.update(dead.id, {"status": "error", "metadata.error": {"attempting_recovery": False}})
    assert await jobs.get_pending_count(user) == 1
    await jobs.update(live.id, {"status": "complete"})
    assert await jobs.get_pending_count(user) == 0


async def test_logs_after_returns_only_newer_events_in_order(jobs):
    job = await create(jobs)
    marker = await jobs.last_log_seq(job.id)
    await jobs.update(job.id, {"message": "one"})
    await jobs.update(job.id, {"status": "complete"})
    events = await jobs.logs_after(job.id, marker)
    assert [e["type"] for e in events] == ["update", "update", "complete"]
    assert await jobs.logs_after(job.id, events[-1]["seq"]) == []


async def test_logs_after_skips_legacy_rows_without_seq(jobs):
    job_id = uuid.uuid4()
    await jobs.log_collection.insert_one({"job_id": str(job_id), "type": "update", "timestamp": time.time()})
    assert await jobs.last_log_seq(job_id) is None
    assert await jobs.logs_after(job_id, None) == []


async def test_concurrent_logs_get_distinct_increasing_seq(jobs):
    job = await create(jobs)
    await asyncio.gather(jobs.log(job.id, "x", {}), jobs.log(job.id, "x", {}))
    seqs = [e["seq"] for e in await jobs.logs_after(job.id, None)]
    assert seqs == sorted(set(seqs)) and len(seqs) == 3


async def test_update_with_a_stale_fence_raises_and_writes_nothing(jobs):
    job = await create(jobs)
    await jobs.claim(job.id, "a")
    with fenced("b"), pytest.raises(FenceLost):
        await jobs.update(job.id, {"message": "x"})
    assert (await jobs.get(job.id)).message == "Pending"


async def test_event_log_with_a_stale_fence_raises_and_writes_nothing(jobs):
    job = await create(jobs)
    await jobs.claim(job.id, "a")
    before = await jobs.last_log_seq(job.id)
    with fenced("b"), pytest.raises(FenceLost):
        await jobs.log(job.id, "event", {})
    assert await jobs.last_log_seq(job.id) == before


async def test_cancel_request_makes_update_raise_after_the_write_but_not_on_complete(jobs):
    job = await create(jobs)
    await jobs.claim(job.id, "a")
    await jobs.request_cancel(job)
    with fenced("a"):
        with pytest.raises(JobCancelled):
            await jobs.update(job.id, {"message": "x"})
        assert (await jobs.get(job.id)).message == "x"
        await jobs.update(job.id, {"status": "complete"})
    assert (await jobs.get(job.id)).status == "complete"


async def test_request_cancel_deletes_an_unclaimed_job_and_flags_a_claimed_one(jobs):
    free, held, done = await create(jobs), await create(jobs), await create(jobs)
    await jobs.claim(held.id, "a")
    await jobs.update(done.id, {"status": "complete"})
    assert await jobs.request_cancel(free)
    assert await jobs.get(free.id) is None
    assert await jobs.request_cancel(held)
    assert (await jobs.get(held.id)).cancel_requested
    assert not await jobs.request_cancel(done)
    assert (await jobs.get(done.id)).status == "complete"
    assert not await jobs.request_cancel(free)


async def test_unenqueued_returns_old_jobs_that_are_not_marked_enqueued(jobs):
    old, marked, legacy, done = await create(jobs), await create(jobs), await create(jobs), await create(jobs)
    await jobs.mark_enqueued(marked.id)
    await jobs.collection.update_one({"id": str(legacy.id)}, {"$unset": {"enqueued": 1}})
    await jobs.update(done.id, {"status": "complete"})
    assert await jobs.unenqueued(60) == []
    await asyncio.sleep(0.05)
    assert {j.id for j in await jobs.unenqueued(0.01)} == {old.id, legacy.id}


async def test_orphaned_returns_claimed_jobs_with_no_recent_log_row(jobs):
    stale, fresh, _free = await create(jobs), await create(jobs), await create(jobs)
    await jobs.claim(stale.id, "a")
    await jobs.claim(fresh.id, "b")
    old = datetime.now(timezone.utc) - timedelta(seconds=120)
    await jobs.log_collection.update_many({"job_id": str(stale.id)}, {"$set": {"timestamp": old}})
    assert [j.id for j in await jobs.orphaned(60)] == [stale.id]
    await jobs.log_collection.delete_many({"job_id": str(fresh.id)})
    assert {j.id for j in await jobs.orphaned(60)} == {stale.id, fresh.id}


async def test_fail_crashed_writes_a_permanent_error_without_a_fence(jobs):
    job = await create(jobs)
    await jobs.claim(job.id, "a")
    await jobs.fail_crashed(job.id, 4)
    failed = await jobs.get(job.id)
    assert failed.status == "error" and failed.message == "Stopped after 4 tries without finishing"
    assert failed.metadata["error"]["attempting_recovery"] is False and failed.lease_owner is None
    assert (await jobs.last_snapshot(job.id))["data"]["status"] == "error"
    assert await jobs.get_pending_count(job.user_id) == 0
    assert await jobs.claim(job.id, "b") is None


async def test_fail_crashed_leaves_complete_and_missing_jobs_alone(jobs):
    done = await create(jobs)
    await jobs.update(done.id, {"status": "complete"})
    await jobs.fail_crashed(done.id, 4)
    await jobs.fail_crashed(uuid.uuid4(), 4)
    assert (await jobs.get(done.id)).status == "complete"


async def test_create_stores_enqueued_false_and_mark_enqueued_sets_it(jobs):
    job = await create(jobs)
    assert (await jobs.collection.find_one({"id": str(job.id)}))["enqueued"] is False
    await jobs.mark_enqueued(job.id)
    assert (await jobs.collection.find_one({"id": str(job.id)}))["enqueued"] is True


async def test_last_write_moves_forward_on_writes(jobs):
    job = await create(jobs)
    before = jobs.last_write
    await asyncio.sleep(0.01)
    await jobs.update(job.id, {"message": "x"})
    assert jobs.last_write > before


async def test_last_snapshot_skips_event_rows_and_gives_the_cursor(jobs):
    job = await create(jobs)
    await jobs.update(job.id, {"message": "x"})
    await jobs.log(job.id, "event", {})
    snap = await jobs.last_snapshot(job.id)
    assert snap["type"] == "update" and snap["data"]["message"] == "x"
    assert [d["type"] for d in await jobs.logs_after(job.id, snap["seq"])] == ["event"]


async def test_pending_count_ignores_a_job_with_a_cancel_request(jobs):
    await create(jobs)
    cancelled = await create(jobs)
    await jobs.claim(cancelled.id, "f1")
    await jobs.request_cancel(cancelled)
    assert await jobs.get_pending_count("0" * 24) == 1
