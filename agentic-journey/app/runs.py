"""Run log. Every turn writes its steps here so a person can watch the loop, not just trace it."""
from datetime import datetime, timezone

from pymongo import DESCENDING

from .memory import db

runs = db.runs


def init_indexes() -> None:
    runs.create_index([("started_at", DESCENDING)])
    runs.create_index("started_at", expireAfterSeconds=86400)


def start(run_id: str, session_id: str, actor_id: str, message: str | None) -> None:
    runs.update_one(
        {"_id": run_id},
        {
            "$set": {
                "session_id": session_id,
                "actor_id": actor_id,
                "message": message,
                "status": "running",
                "started_at": datetime.now(timezone.utc),
                "events": [],
            }
        },
        upsert=True,
    )


MAX_DETAIL = 400


def event(run_id: str, node: str, label: str, detail: str = "", state: str = "done") -> None:
    if not run_id:
        return
    # mark the cut: the verifier reads these as evidence and must not mistake a
    # truncation for a fabrication
    if len(detail) > MAX_DETAIL:
        detail = detail[:MAX_DETAIL] + " ...[truncated]"
    runs.update_one(
        {"_id": run_id},
        {
            "$push": {
                "events": {
                    "node": node,
                    "label": label,
                    "detail": detail,
                    "state": state,
                    "at": datetime.now(timezone.utc).isoformat(),
                }
            }
        },
    )


def finish(run_id: str, status: str, answer: str = "", usage: dict | None = None) -> None:
    runs.update_one(
        {"_id": run_id},
        {"$set": {"status": status, "answer": answer[:2000], "ended_at": datetime.now(timezone.utc),
                  "usage": usage or {}}},
    )


def usage_totals() -> dict:
    """What today has cost, by model. Read off the run log, so it cannot drift from reality."""
    since = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    by_model: dict[str, dict] = {}
    for doc in runs.find({"started_at": {"$gte": since}}, {"usage": 1}):
        u = doc.get("usage") or {}
        if not u:
            continue
        row = by_model.setdefault(u.get("model", "?"),
                                  {"runs": 0, "requests": 0, "input_tokens": 0,
                                   "output_tokens": 0, "tool_calls": 0})
        row["runs"] += 1
        for k in ("requests", "input_tokens", "output_tokens", "tool_calls"):
            row[k] += int(u.get(k) or 0)
    total = {"runs": sum(r["runs"] for r in by_model.values()),
             "requests": sum(r["requests"] for r in by_model.values()),
             "input_tokens": sum(r["input_tokens"] for r in by_model.values()),
             "output_tokens": sum(r["output_tokens"] for r in by_model.values()),
             "tool_calls": sum(r["tool_calls"] for r in by_model.values())}
    total["total_tokens"] = total["input_tokens"] + total["output_tokens"]
    return {"since": since.isoformat(), "by_model": by_model, "total": total}


def recent(limit: int = 25) -> list[dict]:
    out = []
    for doc in runs.find().sort("started_at", DESCENDING).limit(limit):
        doc["run_id"] = doc.pop("_id")
        doc["started_at"] = doc["started_at"].isoformat()
        doc.pop("ended_at", None)
        out.append(doc)
    return out
