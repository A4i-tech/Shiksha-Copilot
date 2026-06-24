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

-- ============================================================
-- Seed: Dimensions
-- ============================================================

INSERT INTO dim_regions (name, type, parent_id) VALUES
  ('Karnataka', 'state', NULL),            -- region_id = 1
  ('Bengaluru Rural', 'district', 1),      -- 2
  ('Mysuru', 'district', 1),               -- 3
  ('Tumkur', 'district', 1),               -- 4
  ('Devanahalli', 'block', 2),             -- 5
  ('Doddaballapur', 'block', 2),           -- 6
  ('Hunsur', 'block', 3),                  -- 7
  ('Periyapatna', 'block', 3),             -- 8
  ('Tiptur', 'block', 4),                  -- 9
  ('Gubbi', 'block', 4);                   -- 10

INSERT INTO dim_schools (name, block_id, district_id) VALUES
  ('GHPS Devanahalli', 5, 2),     -- school_id = 1
  ('GHPS Doddaballapur', 6, 2),   -- 2
  ('GHPS Hunsur', 7, 3),          -- 3
  ('GHPS Periyapatna', 8, 3),     -- 4
  ('GHPS Tiptur', 9, 4),          -- 5
  ('GHPS Gubbi', 10, 4),          -- 6
  ('GPS Vijayapura', 5, 2),       -- 7
  ('GPS Manchanabele', 6, 2),     -- 8
  ('GPS Saragur', 7, 3),          -- 9
  ('GPS Arakere', 8, 3);          -- 10

INSERT INTO dim_users (user_id, name, role, school_id, region_id) VALUES
  ('u001', 'Ramesh Kumar',    'HM',        1,  5),
  ('u002', 'Suma Naik',       'HM',        2,  6),
  ('u003', 'Veena Patil',     'HM',        3,  7),
  ('u004', 'Ravi Gowda',      'HM',        4,  8),
  ('u005', 'Lakshmi Devi',    'HM',        5,  9),
  ('u006', 'Anand Murthy',    'HM',        6,  10),
  ('u007', 'Priya Shetty',    'CRP',       NULL, 5),
  ('u008', 'Suresh Rao',      'CRP',       NULL, 6),
  ('u009', 'Meena Joshi',     'CRP',       NULL, 7),
  ('u010', 'Kiran Bhat',      'CRP',       NULL, 8),
  ('u011', 'Deepa Hegde',     'BEO',       NULL, 2),
  ('u012', 'Mahesh Kulkarni', 'BEO',       NULL, 3),
  ('u013', 'Rekha Nair',      'BEO',       NULL, 4),
  ('u014', 'Vijay Sharma',    'DDPI',      NULL, 1),
  ('u015', 'Nirmala Rao',     'StateAdmin',NULL, 1);

-- ============================================================
-- Seed: Facts (generated over last 90 days)
-- ============================================================

INSERT INTO fact_lesson_plans (user_id, subject, grade, status, created_at)
SELECT
  'u00' || (1 + (n % 6))::text,
  (ARRAY['Maths','Science','Kannada','English','Social'])[1 + (n % 5)],
  (1 + (n % 5)),
  (ARRAY['draft','published','archived'])[1 + (n % 3)],
  NOW() - ((n % 90) || ' days')::interval
FROM generate_series(1, 300) AS n;

INSERT INTO fact_user_activities (user_id, activity_type, app_section, created_at)
SELECT
  'u00' || (1 + (n % 6))::text,
  (ARRAY['view','create','edit','share','download'])[1 + (n % 5)],
  (ARRAY['lessons','resources','chat','lba','dashboard'])[1 + (n % 5)],
  NOW() - ((n % 90) || ' days')::interval
FROM generate_series(1, 400) AS n;

INSERT INTO fact_ai_actions (user_id, action_type, created_at)
SELECT
  'u' || LPAD((1 + (n % 10))::text, 3, '0'),
  (ARRAY['generate_lp','regenerate_lp','ask_question','summarize','translate'])[1 + (n % 5)],
  NOW() - ((n % 90) || ' days')::interval
FROM generate_series(1, 250) AS n;

INSERT INTO fact_chatbot_sessions (user_id, message_count, resolved, created_at)
SELECT
  'u' || LPAD((1 + (n % 10))::text, 3, '0'),
  2 + (n % 10),
  (n % 3 != 0),
  NOW() - ((n % 90) || ' days')::interval
FROM generate_series(1, 200) AS n;

INSERT INTO fact_lba_attempts (user_id, subject, grade, score, created_at)
SELECT
  'u00' || (1 + (n % 6))::text,
  (ARRAY['Maths','Science','Kannada','English','Social'])[1 + (n % 5)],
  (1 + (n % 5)),
  ROUND((50 + (n % 50))::numeric, 2),
  NOW() - ((n % 90) || ' days')::interval
FROM generate_series(1, 300) AS n;
