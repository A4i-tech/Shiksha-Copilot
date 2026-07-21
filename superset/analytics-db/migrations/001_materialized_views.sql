-- Migration 001: Convert regular views to materialized views
-- Run once on existing deployments. New deployments use init.sql directly.
--
-- Safe to re-run: DROP IF EXISTS + CREATE ... IF NOT EXISTS guards.

BEGIN;

DROP VIEW IF EXISTS vw_lesson_plans CASCADE;
DROP VIEW IF EXISTS vw_user_activities CASCADE;
DROP VIEW IF EXISTS vw_chatbot_sessions CASCADE;
DROP VIEW IF EXISTS vw_lba_attempts CASCADE;

CREATE MATERIALIZED VIEW IF NOT EXISTS vw_lesson_plans AS
SELECT
    lp.lp_id,
    lp.user_id,
    lp.subject,
    lp.grade,
    lp.status,
    lp.medium,
    lp.created_at,
    u.role,
    u.school_id,
    u.region_id,
    r.name       AS region_name,
    r.type       AS region_type,
    rp.name      AS parent_name,
    rp.type      AS parent_type,
    rp.region_id AS parent_region_id
FROM fact_lesson_plans lp
JOIN dim_users    u  ON u.user_id   = lp.user_id
JOIN dim_regions  r  ON r.region_id = u.region_id
LEFT JOIN dim_regions rp ON rp.region_id = r.parent_id
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_lesson_plans ON vw_lesson_plans(lp_id);
CREATE INDEX IF NOT EXISTS idx_mv_lesson_plans_user    ON vw_lesson_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_mv_lesson_plans_region  ON vw_lesson_plans(region_id);

CREATE MATERIALIZED VIEW IF NOT EXISTS vw_user_activities AS
SELECT
    a.activity_id,
    a.user_id,
    a.activity_type,
    a.app_section,
    a.created_at,
    u.role,
    u.school_id,
    u.region_id,
    r.name AS region_name,
    r.type AS region_type
FROM fact_user_activities a
JOIN dim_users   u  ON u.user_id   = a.user_id
JOIN dim_regions r  ON r.region_id = u.region_id
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_user_activities ON vw_user_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_mv_user_activities_user    ON vw_user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_mv_user_activities_region  ON vw_user_activities(region_id);

CREATE MATERIALIZED VIEW IF NOT EXISTS vw_chatbot_sessions AS
SELECT
    cs.session_id,
    cs.user_id,
    cs.message_count,
    cs.resolved,
    cs.created_at,
    DATE_TRUNC('month', cs.created_at) AS month,
    u.role,
    u.region_id,
    r.name AS region_name
FROM fact_chatbot_sessions cs
JOIN dim_users   u  ON u.user_id   = cs.user_id
JOIN dim_regions r  ON r.region_id = u.region_id
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_chatbot_sessions ON vw_chatbot_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_mv_chatbot_sessions_user    ON vw_chatbot_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mv_chatbot_sessions_region  ON vw_chatbot_sessions(region_id);

CREATE MATERIALIZED VIEW IF NOT EXISTS vw_lba_attempts AS
SELECT
    la.attempt_id,
    la.user_id,
    la.subject,
    la.grade,
    la.score,
    la.created_at,
    u.role,
    u.region_id,
    r.name AS region_name
FROM fact_lba_attempts la
JOIN dim_users   u  ON u.user_id   = la.user_id
JOIN dim_regions r  ON r.region_id = u.region_id
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_lba_attempts ON vw_lba_attempts(attempt_id);
CREATE INDEX IF NOT EXISTS idx_mv_lba_attempts_user    ON vw_lba_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mv_lba_attempts_region  ON vw_lba_attempts(region_id);

COMMIT;
