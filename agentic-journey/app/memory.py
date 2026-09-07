"""Memory primitive: hierarchical (scope chain) + episodic (session window)."""
from datetime import datetime, timedelta, timezone

from pymongo import ASCENDING, MongoClient

from . import config
from .identity import Identity

_client = MongoClient(config.MONGO_URL)
db = _client[config.DB_NAME]
facts = db.facts
episodes = db.episodes

PROMOTE_AT = 0.9
DEMOTE_AT = 0.3


def init_indexes() -> None:
    facts.create_index([("scope_key", ASCENDING), ("key", ASCENDING)])
    facts.create_index([("superseded_by", ASCENDING)])
    # Mongo removes a fact the moment its own valid_until passes; rows without one never expire
    facts.create_index("valid_until", expireAfterSeconds=0)
    # retention policy at creation, per the design doc: an episodic store without one is a liability
    episodes.create_index("updated_at", expireAfterSeconds=config.EPISODE_TTL_SECONDS)


def _key(scope_path: list[str]) -> str:
    return "/".join(scope_path)


def _prefixes(scope_path: list[str]) -> list[str]:
    return [_key(scope_path[: i + 1]) for i in range(len(scope_path))]


# --- hierarchical -----------------------------------------------------------


def write_fact(
    ident: Identity,
    key: str,
    value: str,
    scope_path: list[str] | None = None,
    ttl_hours: float | None = None,
) -> None:
    """Temporal supersession: the newer fact wins, the older one is marked in place."""
    scope = scope_path or ident.scope_path
    now = datetime.now(timezone.utc)
    doc = {
        "scope_path": scope,
        "scope_key": _key(scope),
        "key": key,
        "value": value,
        "actor_id": ident.actor_id,
        "valid_from": now,
        "confidence": 0.5,
        "superseded_by": None,
        # volatile shared state (weather, a closure, today's timetable change) is real memory
        # with a shelf life. Without one it keeps telling a region it is raining, forever.
        "valid_until": now + timedelta(hours=ttl_hours) if ttl_hours else None,
    }
    new_id = facts.insert_one(doc).inserted_id
    facts.update_many(
        {"scope_key": doc["scope_key"], "key": key, "superseded_by": None, "_id": {"$ne": new_id}},
        {"$set": {"superseded_by": new_id}},
    )


def retrieve(ident: Identity) -> dict[str, str]:
    return {row["key"]: row["value"] for row in retrieve_rows(ident)}


def retrieve_rows(ident: Identity) -> list[dict]:
    """Early scope binding: the filter comes from the authenticated identity, never from input.

    Each row carries the level it came from, so a reader can see what is theirs and what they
    inherited from their school, region or tenant.
    """
    now = datetime.now(timezone.utc)
    rows = facts.find(
        {
            "scope_key": {"$in": _prefixes(ident.scope_path)},
            "superseded_by": None,
            # the TTL monitor runs about once a minute; do not serve a stale fact meanwhile
            "$or": [{"valid_until": None}, {"valid_until": {"$gt": now}}],
        }
    ).sort("valid_from", ASCENDING)
    from .identity import LEVELS

    best: dict[str, dict] = {}
    for row in rows:
        d = len(row["scope_path"])
        # narrower scope wins; equal scope resolves by recency (sort order above)
        if d >= len(best.get(row["key"], {}).get("scope_path", [])) or row["key"] not in best:
            best[row["key"]] = {
                "key": row["key"],
                "value": row["value"],
                "scope_path": row["scope_path"],
                "scope_key": row["scope_key"],
                "expires_at": row.get("valid_until").isoformat() if row.get("valid_until") else None,
                "level": LEVELS[d - 1] if d <= len(LEVELS) else "actor",
            }
    return list(best.values())


def score_fact(fact_id, delta: float) -> None:
    """Promotion and demotion. A fact that holds true moves up the chain. One that fails retires."""
    row = facts.find_one({"_id": fact_id})
    if not row:
        return
    conf = min(1.0, max(0.0, row["confidence"] + delta))
    if conf <= DEMOTE_AT:
        facts.update_one({"_id": fact_id}, {"$set": {"superseded_by": "demoted"}})
        return
    update = {"confidence": conf}
    if conf >= PROMOTE_AT and len(row["scope_path"]) > 1:
        scope = row["scope_path"][:-1]
        update |= {"scope_path": scope, "scope_key": _key(scope), "confidence": 0.5}
    facts.update_one({"_id": fact_id}, {"$set": update})


# --- episodic ---------------------------------------------------------------


def episode_owner(session_id: str) -> str | None:
    doc = episodes.find_one({"_id": session_id}, {"actor_id": 1})
    return doc.get("actor_id") if doc else None


def load_episode(session_id: str) -> dict:
    return episodes.find_one({"_id": session_id}) or {"_id": session_id, "messages": []}


def save_episode(session_id: str, ident: Identity, messages: list, workspace_key: str | None) -> None:
    episodes.update_one(
        {"_id": session_id},
        {
            "$set": {
                "actor_id": ident.actor_id,
                "scope_key": _key(ident.scope_path),
                "messages": messages,
                "workspace_key": workspace_key,
                "updated_at": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )
