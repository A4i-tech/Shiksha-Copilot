"""A schedule starts a session without an actor present. Same path, different trigger."""
import os

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from . import identity, journey

INTERVAL_MINUTES = int(os.getenv("SCHEDULE_MINUTES", "15"))
_scheduler = AsyncIOScheduler()


async def scheduled_session() -> None:
    ident = identity.resolve("system")
    # writes through the same memory path as an interactive session
    await journey.run_turn(ident, "Summarise what changed for this scope since your last check.")


def start() -> AsyncIOScheduler:
    if os.getenv("SCHEDULE_ENABLED", "0") == "1":
        _scheduler.add_job(scheduled_session, "interval", minutes=INTERVAL_MINUTES, id="journey")
        _scheduler.start()
    return _scheduler
