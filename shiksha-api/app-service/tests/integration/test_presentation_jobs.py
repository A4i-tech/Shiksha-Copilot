import asyncio
import os
import time
import uuid

import pytest

from app.services.presentation.job import JobManager

pytestmark = pytest.mark.integration


@pytest.fixture
async def jobs():
    if "PRES_TEST_MONGODB_URL" not in os.environ:
        pytest.skip("PRES_TEST_MONGODB_URL is not set")
    db = f"pres_test_{uuid.uuid4().hex[:8]}"
    manager = JobManager(os.environ["PRES_TEST_MONGODB_URL"].rstrip("/") + "/" + db, lease_seconds=1)
    async with manager:
        yield manager
        await manager.client.drop_database(db)


async def create(jobs, user_id="0" * 24):
    return await jobs.create(user_id, "a.pdf", "application/pdf", None, None, [])


async def test_one_of_two_concurrent_claimers_wins(jobs):
    await create(jobs)
    won = await asyncio.gather(jobs.claim_next("a"), jobs.claim_next("b"))
    assert sum(job is not None for job in won) == 1


async def test_claim_is_oldest_first_and_skips_complete(jobs):
    first, second = await create(jobs), await create(jobs)
    await jobs.update(first.id, {"status": "complete"})
    assert (await jobs.claim_next("a")).id == second.id
    assert await jobs.claim_next("a") is None


async def test_expired_lease_is_reclaimed_live_lease_is_not(jobs):
    job = await create(jobs)
    assert await jobs.claim_next("dead-worker")
    assert await jobs.claim_next("b") is None
    await asyncio.sleep(1.5)
    assert (await jobs.claim_next("b")).id == job.id


async def test_renew_and_release_lease_belong_to_owner(jobs):
    job = await create(jobs)
    await jobs.claim_next("a")
    assert not await jobs.renew_lease(job.id, "other")
    assert await jobs.renew_lease(job.id, "a")
    await jobs.release_lease(job.id, "a")
    assert await jobs.claim_next("b")


async def test_error_job_waits_for_backoff_and_permanent_error_is_never_claimed(jobs):
    waiting, dead = await create(jobs), await create(jobs)
    await jobs.update(waiting.id, {"status": "error", "metadata.error": {"attempting_recovery": True, "next_attempt": time.time() + 60}})
    await jobs.update(dead.id, {"status": "error", "metadata.error": {"attempting_recovery": False, "next_attempt": 0}})
    assert await jobs.claim_next("a") is None
    await jobs.update(waiting.id, {"metadata.error.next_attempt": time.time() - 1})
    assert (await jobs.claim_next("a")).id == waiting.id


async def test_permanent_error_does_not_count_toward_user_cap(jobs):
    user = "1" * 24
    live, dead = await create(jobs, user), await create(jobs, user)
    await jobs.update(dead.id, {"status": "error", "metadata.error": {"attempting_recovery": False}})
    assert await jobs.get_pending_count(user) == 1
    await jobs.update(live.id, {"status": "complete"})
    assert await jobs.get_pending_count(user) == 0


async def test_logs_after_returns_only_newer_events_in_order(jobs):
    job = await create(jobs)
    marker = await jobs.last_log_id(job.id)
    await jobs.update(job.id, {"message": "one"})
    await jobs.update(job.id, {"status": "complete"})
    events = await jobs.logs_after(job.id, marker)
    assert [e["type"] for e in events] == ["update", "update", "complete"]
    assert await jobs.logs_after(job.id, events[-1]["_id"]) == []


async def test_takeover_of_an_expired_lease_counts_a_crash_but_a_release_does_not(jobs):
    job = await create(jobs)
    assert (await jobs.claim_next("a")).crashes == 0
    await jobs.release_lease(job.id, "a")
    assert (await jobs.claim_next("b")).crashes == 0
    await asyncio.sleep(1.5)
    assert (await jobs.claim_next("c")).crashes == 1
    await asyncio.sleep(1.5)
    assert (await jobs.claim_next("d")).crashes == 2
