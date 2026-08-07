-- Migration 002: Add latitude/longitude to dim_regions and dim_schools
-- Run once on existing deployments after 001_materialized_views.sql.
-- Safe to re-run: ADD COLUMN IF NOT EXISTS + UPDATE with WHERE lat IS NULL.

BEGIN;

ALTER TABLE dim_regions ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION;
ALTER TABLE dim_regions ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

ALTER TABLE dim_schools ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION;
ALTER TABLE dim_schools ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Seed Karnataka region centroids (approximate block/district centres)
UPDATE dim_regions SET latitude =  15.3173, longitude =  75.7139 WHERE name = 'Karnataka'       AND type = 'state'    AND latitude IS NULL;
UPDATE dim_regions SET latitude =  13.2257, longitude =  77.5778 WHERE name = 'Bengaluru Rural' AND type = 'district' AND latitude IS NULL;
UPDATE dim_regions SET latitude =  12.2958, longitude =  76.6394 WHERE name = 'Mysuru'          AND type = 'district' AND latitude IS NULL;
UPDATE dim_regions SET latitude =  13.3379, longitude =  77.1173 WHERE name = 'Tumkur'          AND type = 'district' AND latitude IS NULL;
UPDATE dim_regions SET latitude =  13.2468, longitude =  77.7110 WHERE name = 'Devanahalli'     AND type = 'block'    AND latitude IS NULL;
UPDATE dim_regions SET latitude =  13.2956, longitude =  77.5367 WHERE name = 'Doddaballapur'   AND type = 'block'    AND latitude IS NULL;
UPDATE dim_regions SET latitude =  12.2993, longitude =  76.2913 WHERE name = 'Hunsur'          AND type = 'block'    AND latitude IS NULL;
UPDATE dim_regions SET latitude =  12.3299, longitude =  76.4857 WHERE name = 'Periyapatna'     AND type = 'block'    AND latitude IS NULL;
UPDATE dim_regions SET latitude =  13.2583, longitude =  76.4783 WHERE name = 'Tiptur'          AND type = 'block'    AND latitude IS NULL;
UPDATE dim_regions SET latitude =  13.3132, longitude =  76.9411 WHERE name = 'Gubbi'           AND type = 'block'    AND latitude IS NULL;

-- Refresh materialized views so Superset picks up new columns immediately
REFRESH MATERIALIZED VIEW vw_lesson_plans;
REFRESH MATERIALIZED VIEW vw_user_activities;
REFRESH MATERIALIZED VIEW vw_chatbot_sessions;
REFRESH MATERIALIZED VIEW vw_lba_attempts;

COMMIT;
