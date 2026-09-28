-- Migration 004: Block-level GeoJSON table for choropleth drill-down
-- Run after 003_scoped_role_dimensions.sql.
-- Safe to re-run: CREATE TABLE IF NOT EXISTS.

BEGIN;

-- Parallel structure to geo_districts.
-- geo_name    : display name shown on map tooltip (e.g. "Nampally")
-- state_name  : parent state name (e.g. "Telangana")
-- district_name: parent district name (e.g. "Hyderabad")
-- db_name     : name as stored in dim_regions.name for this block
--               (used for RLS join: dim_regions r WHERE r.type='block' AND LOWER(r.name)=LOWER(db_name))
-- geojson     : GeoJSON Feature string with polygon geometry;
--               properties.block_name and properties.district_name injected by import script
CREATE TABLE IF NOT EXISTS geo_blocks (
    id            SERIAL PRIMARY KEY,
    geo_name      TEXT NOT NULL,
    state_name    TEXT NOT NULL,
    district_name TEXT NOT NULL,
    db_name       TEXT NOT NULL,
    geojson       TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_geo_blocks_district ON geo_blocks (LOWER(district_name));
CREATE INDEX IF NOT EXISTS idx_geo_blocks_db_name  ON geo_blocks (LOWER(db_name));

COMMIT;
