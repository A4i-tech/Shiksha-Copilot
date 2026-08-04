#!/usr/bin/env python3
"""
ETL: MongoDB prod -> analytics PostgreSQL (Superset star schema)
Full reload each run: truncate all tables, then rebuild from MongoDB.

Env vars:
  MONGO_URI  - mongodb://host:port/dbname  (required; sourced from K8s secret etl-secrets)
  PG_DSN     - postgresql://user:pass@host:port/db  (required; sourced from K8s secret superset-app-secrets)
"""
import json
import logging
import os
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from urllib.request import Request, urlopen

from pymongo import MongoClient
import psycopg2
from psycopg2.extras import execute_values

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [ETL] %(levelname)s %(message)s",
    stream=sys.stdout,
    force=True,
)
logger = logging.getLogger(__name__)

MONGO_URI          = os.environ.get("MONGO_URI", "mongodb://localhost:27017/proddb")
PG_DSN             = os.environ.get("PG_DSN",    "postgresql://analytics:analytics@localhost:5432/analytics")
ALERT_WEBHOOK_URL  = os.environ.get("ALERT_WEBHOOK_URL", "")  # optional: Slack/Teams incoming webhook


def _send_alert(title: str, success: bool, body_facts: list[dict] | None = None, error: str | None = None) -> None:
    if not ALERT_WEBHOOK_URL:
        return
    try:
        color   = "Good" if success else "Attention"
        icon    = "✅" if success else "❌"
        ts      = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

        items: list[dict] = [
            {"type": "TextBlock", "text": f"{icon} **{title}**", "size": "Large", "weight": "Bolder", "color": color, "wrap": True},
            {"type": "TextBlock", "text": ts, "size": "Small", "isSubtle": True, "spacing": "None"},
        ]

        if body_facts:
            items.append({
                "type": "FactSet",
                "spacing": "Medium",
                "facts": body_facts,
            })

        if error:
            items.append({"type": "TextBlock", "text": "Error", "weight": "Bolder", "spacing": "Medium"})
            items.append({"type": "TextBlock", "text": error[:500], "wrap": True, "fontType": "Monospace", "color": "Attention"})

        card = {
            "type": "message",
            "attachments": [{
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.4",
                    "body": items,
                },
            }],
        }
        payload = json.dumps(card).encode()
        req = Request(ALERT_WEBHOOK_URL, data=payload, headers={"Content-Type": "application/json"})
        urlopen(req, timeout=10)
    except Exception as exc:
        logger.warning("Failed to send alert webhook: %s", exc)

# useractivities modules that represent AI feature usage
AI_MODULES = {
    "lp-generation":            "lesson_plan_gen",
    "question-bank-generation": "qb_gen",
    "lr-generation":            "resource_gen",
    "chatbot":                  "chatbot",
    "lesson-chat":              "lesson_chat",
    "lo-regeneration":          "lo_regen",
    "content-generation":       "content_gen",
    "feedback-regeneration":    "feedback_regen",
}

# Map AI module names to human-readable subject labels for fact_lba_attempts
AI_MODULE_SUBJECT = {
    "lp-generation":            "Lesson Planning",
    "question-bank-generation": "Assessment",
    "lr-generation":            "Learning Resources",
    "chatbot":                  "AI Chat",
    "lesson-chat":              "Lesson Chat",
    "lo-regeneration":          "Learning Objectives",
    "content-generation":       "Content Gen",
    "feedback-regeneration":    "Feedback",
}

STATUS_MAP = {
    "completed":   "published",
    "published":   "published",
    "in_progress": "draft",
    "draft":       "draft",
    "archived":    "archived",
}

# Approximate centroid coordinates for known Karnataka regions.
# Keyed as (name_lower, type) → (lat, lon).
# ETL uses these when inserting dim_regions rows so Superset map charts work.
REGION_COORDS: dict[tuple[str, str], tuple[float, float]] = {
    ("karnataka",       "state"):    (15.3173, 75.7139),
    ("bengaluru rural", "district"): (13.2257, 77.5778),
    ("mysuru",          "district"): (12.2958, 76.6394),
    ("tumkur",          "district"): (13.3379, 77.1173),
    ("devanahalli",     "block"):    (13.2468, 77.7110),
    ("doddaballapur",   "block"):    (13.2956, 77.5367),
    ("hunsur",          "block"):    (12.2993, 76.2913),
    ("periyapatna",     "block"):    (12.3299, 76.4857),
    ("tiptur",          "block"):    (13.2583, 76.4783),
    ("gubbi",           "block"):    (13.3132, 76.9411),
}

NOW = datetime.now(timezone.utc)


def _mask_uri(uri: str) -> str:
    return re.sub(r'://[^:@]+:[^@]+@', '://***:***@', uri)


def _to_float(val, default=0.0) -> float:
    try:
        return float(val) if val is not None else default
    except (ValueError, TypeError):
        logger.warning("Invalid numeric value %r — using %s", val, default)
        return default


def coerce_dt(val):
    if val is None:
        return NOW
    if isinstance(val, datetime):
        return val
    logger.warning("Unexpected timestamp type %s — using NOW", type(val).__name__)
    return NOW


def main() -> None:
    mc = None
    pg = None
    cur = None
    try:
        logger.info("Connecting to MongoDB: %s", _mask_uri(MONGO_URI))
        mc = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10_000)
        db = mc.get_default_database()
        mc.admin.command("ping")
        logger.info("MongoDB OK")

        logger.info("Connecting to PostgreSQL ...")
        pg  = psycopg2.connect(PG_DSN, connect_timeout=10)
        cur = pg.cursor()
        logger.info("PostgreSQL OK")

        # ------------------------------------------------------------------ dim_regions
        # Read all MongoDB data before touching PostgreSQL so a Mongo failure
        # never leaves analytics tables empty.
        logger.info("Syncing dim_regions ...")
        regions_raw = list(db.regions.find({}))
        roles = {str(role["_id"]): role for role in db.roles.find({"isDeleted": {"$ne": True}})}

        state_id = {}   # state_name       -> region_id
        zone_id  = {}   # (state, zone)    -> region_id
        dist_id  = {}   # (state, zone, dist) -> region_id
        block_id = {}   # (state, zone, dist, block) -> region_id
        scope_region = {"STATE": {}, "ZONE": {}, "DISTRICT": {}, "BLOCK": {}}
        scope_fields = {
            "STATE": ("state",),
            "ZONE": ("state", "zone"),
            "DISTRICT": ("state", "zone", "district"),
            "BLOCK": ("state", "zone", "district", "block"),
        }

        # Truncate only after all MongoDB reads succeed — PostgreSQL TRUNCATE is
        # transactional so any subsequent failure rolls this back automatically.
        logger.info("Truncating tables ...")
        cur.execute("""
            TRUNCATE fact_lba_attempts, fact_chatbot_sessions, fact_ai_actions,
                     fact_user_activities, fact_lesson_plans CASCADE;
            TRUNCATE dim_users CASCADE;
            TRUNCATE dim_schools CASCADE;
            TRUNCATE dim_regions CASCADE;
        """)

        def _region_coords(name: str, rtype: str) -> tuple[float | None, float | None]:
            return REGION_COORDS.get((name.lower(), rtype), (None, None))

        for region in regions_raw:
            s = region.get("state")
            if not s:
                continue
            lat, lon = _region_coords(s, "state")
            cur.execute(
                "INSERT INTO dim_regions (name, type, parent_id, latitude, longitude) VALUES (%s, 'state', NULL, %s, %s) RETURNING region_id",
                (s, lat, lon)
            )
            state_id[s] = cur.fetchone()[0]
            scope_region["STATE"][(s,)] = state_id[s]
            for zone in region.get("zones") or []:
                z = zone.get("name")
                if not z:
                    continue
                cur.execute(
                    "INSERT INTO dim_regions (name, type, parent_id) VALUES (%s, 'zone', %s) RETURNING region_id",
                    (z, state_id[s])
                )
                zone_id[(s, z)] = cur.fetchone()[0]
                scope_region["ZONE"][(s, z)] = zone_id[(s, z)]
                for district in zone.get("districts") or []:
                    d = district.get("name")
                    if not d:
                        continue
                    lat, lon = _region_coords(d, "district")
                    cur.execute(
                        "INSERT INTO dim_regions (name, type, parent_id, latitude, longitude) VALUES (%s, 'district', %s, %s, %s) RETURNING region_id",
                        (d, zone_id[(s, z)], lat, lon)
                    )
                    dist_id[(s, z, d)] = cur.fetchone()[0]
                    scope_region["DISTRICT"][(s, z, d)] = dist_id[(s, z, d)]
                    for block in district.get("blocks") or []:
                        b = block.get("name")
                        if not b:
                            continue
                        lat, lon = _region_coords(b, "block")
                        cur.execute(
                            "INSERT INTO dim_regions (name, type, parent_id, latitude, longitude) VALUES (%s, 'block', %s, %s, %s) RETURNING region_id",
                            (b, dist_id[(s, z, d)], lat, lon)
                        )
                        block_id[(s, z, d, b)] = cur.fetchone()[0]
                        scope_region["BLOCK"][(s, z, d, b)] = block_id[(s, z, d, b)]

        logger.info("  %d states, %d zones, %d districts, %d blocks", len(state_id), len(zone_id), len(dist_id), len(block_id))

        # ------------------------------------------------------------------ dim_schools
        logger.info("Syncing dim_schools ...")
        mongo_school_to_pg = {}  # str(mongo _id) -> pg school_id
        school_region = {}       # str(mongo _id) -> pg region_id

        for sch in db.schools.find({"isDeleted": {"$ne": True}}):
            s, z, d, b = sch.get("state"), sch.get("zone"), sch.get("district"), sch.get("block")
            d_id = dist_id.get((s, z, d))
            b_id = block_id.get((s, z, d, b)) or d_id
            if not d_id:
                continue
            cur.execute(
                "INSERT INTO dim_schools (source_id, name, block_id, district_id, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s) RETURNING school_id",
                (str(sch["_id"]), sch.get("name", "Unknown"), b_id or d_id, d_id,
                 sch.get("latitude") or None, sch.get("longitude") or None)
            )
            school_key = str(sch["_id"])
            mongo_school_to_pg[school_key] = cur.fetchone()[0]
            school_region[school_key] = b_id

        logger.info("  %d schools", len(mongo_school_to_pg))

        # ------------------------------------------------------------------ dim_users
        logger.info("Syncing dim_users ...")
        valid_user_ids: set[str] = set()
        fallback_region = (
            list(state_id.values())[0]
            if state_id else None
        )

        def _insert_user(uid, name, role, school_pg, region):
            if not region:
                return
            cur.execute(
                "INSERT INTO dim_users (user_id, name, role, school_id, region_id) "
                "VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
                (uid, name, role, school_pg, region)
            )
            valid_user_ids.add(uid)

        for user in db.users.find({"isDeleted": {"$ne": True}}):
            assignments = [(roles.get(str(value.get("role"))), value.get("dep")) for value in user.get("roles") or []]
            assignments = [(role, dep) for role, dep in assignments if role]
            role_names = ", ".join(dict.fromkeys(role.get("name", "Unknown") for role, _ in assignments))
            school_dep = next((str(dep) for role, dep in assignments if role.get("scopeType") == "SCHOOL" and dep), None)
            region = school_region.get(school_dep)
            if not region:
                region = next((scope_region[role["scopeType"]].get(tuple(dep[field] for field in scope_fields[role["scopeType"]])) for role, dep in assignments if dep and role.get("scopeType") in scope_fields), None)
            if not region and any(role.get("scopeType") in ("GLOBAL", "UNBOUND") for role, _ in assignments):
                region = fallback_region
            identity = user.get("identity") or {}
            _insert_user(str(user["_id"]), identity.get("name", "Unknown"), role_names or "Unknown", mongo_school_to_pg.get(school_dep), region)

        logger.info("  %d users", len(valid_user_ids))
        if not valid_user_ids:
            logger.warning("No valid users — fact tables will be empty")
            pg.commit()
            return

        # ------------------------------------------------------------------ lesson lookup
        lessons = {
            str(l["_id"]): {
                "subject": l.get("subject", "General"),
                "grade":   int(l.get("class") or 1),
                "medium":  (l.get("medium") or "unknown").capitalize(),
            }
            for l in db.masterlessons.find({}, {"subject": 1, "class": 1, "medium": 1})
        }

        # ------------------------------------------------------------------ fact_lesson_plans
        logger.info("Syncing fact_lesson_plans ...")
        lp_rows = []
        for lp in db.teacherlessonplans.find({"isDeleted": {"$ne": True}}):
            uid = str(lp.get("teacherId", ""))
            if uid not in valid_user_ids:
                continue
            meta    = lessons.get(str(lp.get("lessonId", "")), {})
            subject = meta.get("subject", "General")
            grade   = meta.get("grade", 1)
            status  = STATUS_MAP.get(lp.get("status", ""), "draft")
            medium  = meta.get("medium", "Unknown")
            lp_rows.append((uid, subject, grade, status, medium, coerce_dt(lp.get("createdAt"))))

        if lp_rows:
            execute_values(
                cur,
                "INSERT INTO fact_lesson_plans (user_id, subject, grade, status, medium, created_at) VALUES %s",
                lp_rows
            )
        logger.info("  %d lesson plans", len(lp_rows))

        # ------------------------------------------------------------------ fact_user_activities
        logger.info("Syncing fact_user_activities ...")
        act_rows = []
        for a in db.useractivities.find({}):
            uid = str(a.get("userId", ""))
            if uid not in valid_user_ids:
                continue
            module = a.get("moduleName", "app")
            act_rows.append((uid, "session", module, coerce_dt(a.get("createdAt"))))

        if act_rows:
            execute_values(
                cur,
                "INSERT INTO fact_user_activities (user_id, activity_type, app_section, created_at) VALUES %s",
                act_rows
            )
        logger.info("  %d user activities", len(act_rows))

        # ------------------------------------------------------------------ fact_ai_actions
        logger.info("Syncing fact_ai_actions ...")
        ai_rows = []
        for a in db.useractivities.find({"moduleName": {"$in": list(AI_MODULES.keys())}}):
            uid = str(a.get("userId", ""))
            if uid not in valid_user_ids:
                continue
            action_type = AI_MODULES.get(a.get("moduleName", ""), "unknown")
            ai_rows.append((uid, action_type, coerce_dt(a.get("createdAt"))))

        if ai_rows:
            execute_values(
                cur,
                "INSERT INTO fact_ai_actions (user_id, action_type, created_at) VALUES %s",
                ai_rows
            )
        logger.info("  %d AI actions", len(ai_rows))

        # ------------------------------------------------------------------ fact_chatbot_sessions
        logger.info("Syncing fact_chatbot_sessions ...")
        sessions: dict[tuple, list] = defaultdict(list)
        for c in db.lessonchats.find({}):
            key = (str(c.get("teacherId", "")), str(c.get("recordId", "")))
            sessions[key].append(c.get("createdAt"))

        chat_rows = []
        for (tid, _), dates in sessions.items():
            if tid not in valid_user_ids:
                continue
            valid_dates = [d for d in dates if d]
            created     = min(valid_dates) if valid_dates else NOW
            resolved    = len(dates) >= 3
            chat_rows.append((tid, len(dates), resolved, created))

        if chat_rows:
            execute_values(
                cur,
                "INSERT INTO fact_chatbot_sessions (user_id, message_count, resolved, created_at) VALUES %s",
                chat_rows
            )
        logger.info("  %d chatbot sessions", len(chat_rows))

        # ------------------------------------------------------------------ fact_lba_attempts
        # NOTE: No real LBA (Learning-Based Assessment) data in MongoDB yet.
        # fact_lba_attempts is temporarily populated from useractivities as a proxy.
        # score = interactionTime (seconds) / 3, capped at 100 — NOT an assessment score.
        # Dashboard charts reading this table must be labelled accordingly,
        # e.g. "Avg Engagement Time (scaled)" rather than "Avg Score".
        # resolved in fact_chatbot_sessions = 3+ messages (engagement proxy, not actual resolution).
        logger.info("Syncing fact_lba_attempts ...")
        lba_rows = []
        for a in db.useractivities.find({"moduleName": {"$in": list(AI_MODULE_SUBJECT.keys())}}):
            uid = str(a.get("userId", ""))
            if uid not in valid_user_ids:
                continue
            subject = AI_MODULE_SUBJECT.get(a.get("moduleName", ""), "General")
            # Proxy score: interactionTime (seconds) / 3, capped at 100. Replace once real LBA exists.
            interaction_time_score = min(_to_float(a.get("interactionTime")) / 3.0, 100.0)
            lba_rows.append((uid, subject, 1, round(interaction_time_score, 2), coerce_dt(a.get("createdAt"))))

        if lba_rows:
            execute_values(
                cur,
                "INSERT INTO fact_lba_attempts (user_id, subject, grade, score, created_at) VALUES %s",
                lba_rows
            )
        logger.info("  %d LBA attempts", len(lba_rows))

        # ------------------------------------------------------------------ commit
        pg.commit()
        logger.info("Sync complete. Refreshing materialized views ...")
        for mv in ("vw_lesson_plans", "vw_user_activities", "vw_chatbot_sessions", "vw_lba_attempts"):
            cur.execute(f"REFRESH MATERIALIZED VIEW CONCURRENTLY {mv}")
            pg.commit()
            logger.info("  refreshed %s", mv)
        logger.info("All materialized views refreshed.")
        _send_alert(
            "Shiksha ETL Sync Completed",
            success=True,
            body_facts=[
                {"title": "Users",            "value": str(len(valid_user_ids))},
                {"title": "Lesson Plans",     "value": str(len(lp_rows))},
                {"title": "User Activities",  "value": str(len(act_rows))},
                {"title": "AI Actions",       "value": str(len(ai_rows))},
                {"title": "Chatbot Sessions", "value": str(len(chat_rows))},
                {"title": "LBA Attempts",     "value": str(len(lba_rows))},
            ],
        )

    except Exception as _exc:
        if pg and not pg.closed:
            pg.rollback()
        _send_alert("Shiksha ETL Sync Failed", success=False, error=str(_exc))
        raise
    finally:
        if cur:
            try: cur.close()
            except Exception: pass
        if pg:
            try: pg.close()
            except Exception: pass
        if mc:
            try: mc.close()
            except Exception: pass


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        logger.exception("FATAL: %s", exc)
        sys.exit(1)
