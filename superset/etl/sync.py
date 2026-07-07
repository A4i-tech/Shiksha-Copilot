#!/usr/bin/env python3
"""
ETL: MongoDB prod -> analytics PostgreSQL (Superset star schema)
Full reload each run: truncate all tables, then rebuild from MongoDB.

Env vars:
  MONGO_URI  - mongodb://host:port/dbname  (required; sourced from K8s secret etl-secrets)
  PG_DSN     - postgresql://user:pass@host:port/db  (required; sourced from K8s secret superset-app-secrets)
"""
import logging
import os
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone

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

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/proddb")
PG_DSN    = os.environ.get("PG_DSN",    "postgresql://analytics:analytics@localhost:5432/analytics")

ROLE_MAP = {
    "power":    "HM",
    "standard": "HM",
    "hm":       "HM",
    "crp":      "CRP",
    "beo":      "BEO",
    "ddpi":     "DDPI",
    "admin":    "StateAdmin",
    "state":    "StateAdmin",
}
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

NOW = datetime.now(timezone.utc)


def _mask_uri(uri: str) -> str:
    return re.sub(r'://[^:@]+:[^@]+@', '://***:***@', uri)


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

        # ------------------------------------------------------------------ truncate
        logger.info("Truncating tables ...")
        cur.execute("""
            TRUNCATE fact_lba_attempts, fact_chatbot_sessions, fact_ai_actions,
                     fact_user_activities, fact_lesson_plans CASCADE;
            TRUNCATE dim_users CASCADE;
            TRUNCATE dim_schools CASCADE;
            TRUNCATE dim_regions CASCADE;
        """)

        # ------------------------------------------------------------------ dim_regions
        logger.info("Syncing dim_regions ...")
        users_raw = list(db.users.find(
            {"isDeleted": {"$ne": True}},
            {"state": 1, "district": 1, "block": 1}
        ))

        state_id = {}   # state_name       -> region_id
        dist_id  = {}   # (state, dist)    -> region_id
        block_id = {}   # (state, dist, b) -> region_id

        for s in sorted({u.get("state") for u in users_raw if u.get("state")}):
            cur.execute(
                "INSERT INTO dim_regions (name, type, parent_id) VALUES (%s, 'state', NULL) RETURNING region_id",
                (s,)
            )
            state_id[s] = cur.fetchone()[0]

        for u in users_raw:
            s, d = u.get("state"), u.get("district")
            if s and d and (s, d) not in dist_id:
                cur.execute(
                    "INSERT INTO dim_regions (name, type, parent_id) VALUES (%s, 'district', %s) RETURNING region_id",
                    (d, state_id.get(s))
                )
                dist_id[(s, d)] = cur.fetchone()[0]

        for u in users_raw:
            s, d, b = u.get("state"), u.get("district"), u.get("block")
            if s and d and b and (s, d, b) not in block_id:
                cur.execute(
                    "INSERT INTO dim_regions (name, type, parent_id) VALUES (%s, 'block', %s) RETURNING region_id",
                    (b, dist_id.get((s, d)))
                )
                block_id[(s, d, b)] = cur.fetchone()[0]

        logger.info("  %d states, %d districts, %d blocks", len(state_id), len(dist_id), len(block_id))

        # ------------------------------------------------------------------ dim_schools
        logger.info("Syncing dim_schools ...")
        mongo_school_to_pg = {}  # str(mongo _id) -> pg school_id

        for sch in db.schools.find({"isDeleted": {"$ne": True}}):
            s, d, b  = sch.get("state"), sch.get("district"), sch.get("block")
            d_id     = dist_id.get((s, d))
            b_id     = block_id.get((s, d, b)) or d_id
            if not d_id:
                continue
            cur.execute(
                "INSERT INTO dim_schools (name, block_id, district_id) VALUES (%s, %s, %s) RETURNING school_id",
                (sch.get("name", "Unknown"), b_id or d_id, d_id)
            )
            mongo_school_to_pg[str(sch["_id"])] = cur.fetchone()[0]

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

        for u in db.users.find({"isDeleted": {"$ne": True}}):
            roles  = u.get("role") or []
            mapped = next((ROLE_MAP.get(r.lower()) for r in roles if ROLE_MAP.get((r or "").lower())), "HM")
            s, d, b = u.get("state"), u.get("district"), u.get("block")
            region  = block_id.get((s, d, b)) or dist_id.get((s, d)) or state_id.get(s) or fallback_region
            _insert_user(str(u["_id"]), u.get("name", "Unknown"), mapped,
                         mongo_school_to_pg.get(str(u.get("school"))), region)

        for u in db.adminusers.find({"isDeleted": {"$ne": True}}):
            _insert_user(str(u["_id"]), u.get("name", "Unknown"), "StateAdmin",
                         None, fallback_region)

        logger.info("  %d users", len(valid_user_ids))
        if not valid_user_ids:
            logger.warning("No valid users — fact tables will be empty")
            pg.commit()
            return

        # ------------------------------------------------------------------ lesson lookup
        lessons = {
            str(l["_id"]): {"subject": l.get("subject", "General"), "grade": int(l.get("class") or 1)}
            for l in db.masterlessons.find({}, {"subject": 1, "class": 1})
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
            lp_rows.append((uid, subject, grade, status, coerce_dt(lp.get("createdAt"))))

        if lp_rows:
            execute_values(
                cur,
                "INSERT INTO fact_lesson_plans (user_id, subject, grade, status, created_at) VALUES %s",
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
        logger.info("Syncing fact_lba_attempts ...")
        lba_rows = []
        for a in db.useractivities.find({"moduleName": {"$in": list(AI_MODULE_SUBJECT.keys())}}):
            uid = str(a.get("userId", ""))
            if uid not in valid_user_ids:
                continue
            subject = AI_MODULE_SUBJECT.get(a.get("moduleName", ""), "General")
            score   = min(float(a.get("interactionTime") or 0) / 3.0, 100.0)
            lba_rows.append((uid, subject, 1, round(score, 2), coerce_dt(a.get("createdAt"))))

        if lba_rows:
            execute_values(
                cur,
                "INSERT INTO fact_lba_attempts (user_id, subject, grade, score, created_at) VALUES %s",
                lba_rows
            )
        logger.info("  %d LBA attempts", len(lba_rows))

        # ------------------------------------------------------------------ commit
        pg.commit()
        logger.info("Sync complete.")

    except Exception:
        if pg and not pg.closed:
            pg.rollback()
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
