"""Rate control, approval control, failure control. Output control lives on the agent validator."""
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from pydantic_ai.messages import ModelMessagesTypeAdapter

from . import config
from .memory import db

_rate = db.rate
_approvals = db.approvals


def init_indexes() -> None:
    _rate.create_index("window_start", expireAfterSeconds=120)


def check_rate(actor_id: str) -> None:
    window = datetime.now(timezone.utc).replace(second=0, microsecond=0)
    doc = _rate.find_one_and_update(
        {"_id": f"{actor_id}:{window.isoformat()}"},
        {"$inc": {"n": 1}, "$setOnInsert": {"window_start": window}},
        upsert=True,
        return_document=True,
    )
    if doc["n"] > config.RATE_LIMIT_PER_MINUTE:
        raise HTTPException(
            429,
            f"Rate limit reached: {config.RATE_LIMIT_PER_MINUTE} requests per minute for this actor. "
            f"Wait until {(window + timedelta(minutes=1)).strftime('%H:%M:%S')} UTC, or raise "
            "RATE_LIMIT_PER_MINUTE in .env.",
        )


def save_pending(session_id: str, messages, requests) -> list[dict]:
    """Hold a high-consequence tool call until a person confirms it."""
    calls = [
        {"tool_call_id": c.tool_call_id, "tool_name": c.tool_name, "args": str(c.args)}
        for c in requests.approvals
    ]
    _approvals.update_one(
        {"_id": session_id},
        {
            "$set": {
                "messages": ModelMessagesTypeAdapter.dump_python(messages, mode="json"),
                "calls": calls,
                "created_at": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )
    return calls


def has_pending(session_id: str) -> bool:
    return _approvals.count_documents({"_id": session_id}, limit=1) > 0


def load_pending(session_id: str):
    doc = _approvals.find_one({"_id": session_id})
    if not doc:
        raise HTTPException(
            404,
            f"No tool call is waiting for approval on session {session_id!r}. "
            "Send a /chat turn first, or check GET /approvals for the sessions that are waiting.",
        )
    return ModelMessagesTypeAdapter.validate_python(doc["messages"]), doc["calls"]


def clear_pending(session_id: str) -> None:
    _approvals.delete_one({"_id": session_id})


def list_pending() -> list[dict]:
    return [{"session_id": d["_id"], "calls": d["calls"]} for d in _approvals.find()]
