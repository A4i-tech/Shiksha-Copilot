-- ============================================================
-- Dimension tables
-- ============================================================

CREATE TABLE IF NOT EXISTS dim_regions (
    region_id   SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('state', 'district', 'block')),
    parent_id   INT REFERENCES dim_regions(region_id)
);

CREATE TABLE IF NOT EXISTS dim_schools (
    school_id   SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    block_id    INT NOT NULL REFERENCES dim_regions(region_id),
    district_id INT NOT NULL REFERENCES dim_regions(region_id)
);

CREATE TABLE IF NOT EXISTS dim_users (
    user_id     TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL CHECK (role IN ('HM', 'CRP', 'BEO', 'DDPI', 'StateAdmin')),
    school_id   INT REFERENCES dim_schools(school_id),
    region_id   INT NOT NULL REFERENCES dim_regions(region_id)
);

-- ============================================================
-- Fact tables
-- ============================================================

CREATE TABLE IF NOT EXISTS fact_lesson_plans (
    lp_id       SERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES dim_users(user_id),
    subject     TEXT NOT NULL,
    grade       INT NOT NULL,
    status      TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    created_at  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS fact_user_activities (
    activity_id   SERIAL PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES dim_users(user_id),
    activity_type TEXT NOT NULL,
    app_section   TEXT NOT NULL,
    created_at    TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS fact_ai_actions (
    action_id   SERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES dim_users(user_id),
    action_type TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS fact_chatbot_sessions (
    session_id    SERIAL PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES dim_users(user_id),
    message_count INT NOT NULL,
    resolved      BOOLEAN NOT NULL,
    created_at    TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS fact_lba_attempts (
    attempt_id  SERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES dim_users(user_id),
    subject     TEXT NOT NULL,
    grade       INT NOT NULL,
    score       NUMERIC(5,2) NOT NULL,
    created_at  TIMESTAMP NOT NULL
);

-- ============================================================
-- Indexes for dashboard query performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_fact_lesson_plans_user_created ON fact_lesson_plans(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_fact_user_activities_user_created ON fact_user_activities(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_fact_user_activities_type ON fact_user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_fact_ai_actions_user_created ON fact_ai_actions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_fact_chatbot_sessions_user_created ON fact_chatbot_sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_fact_lba_attempts_user_created ON fact_lba_attempts(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_fact_lba_attempts_subject ON fact_lba_attempts(subject);
