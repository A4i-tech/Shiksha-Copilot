ALTER TABLE dim_regions DROP CONSTRAINT IF EXISTS dim_regions_type_check;
ALTER TABLE dim_regions ADD CONSTRAINT dim_regions_type_check CHECK (type IN ('state', 'zone', 'district', 'block'));

ALTER TABLE dim_schools ADD COLUMN IF NOT EXISTS source_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uidx_dim_schools_source_id ON dim_schools(source_id);

ALTER TABLE dim_users DROP CONSTRAINT IF EXISTS dim_users_role_check;
