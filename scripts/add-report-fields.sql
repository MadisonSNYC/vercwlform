-- This script is intended to add new fields to the 'reports' table.
-- It is designed to be idempotent, meaning it can be run multiple times without error.

-- Add new fields for more detailed property information
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS property_type TEXT,
ADD COLUMN IF NOT EXISTS building_age INTEGER,
ADD COLUMN IF NOT EXISTS number_of_units INTEGER;

-- Add new fields for more detailed business contact information
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS business_phone TEXT,
ADD COLUMN IF NOT EXISTS business_email TEXT;

-- Add new fields for follow-up status and internal notes
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Add indexes for new fields if they will be frequently queried
CREATE INDEX IF NOT EXISTS idx_reports_property_type ON reports(property_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Example of adding a new check constraint if needed
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--       SELECT 1 FROM information_schema.table_constraints
--       WHERE constraint_name = 'reports_status_check'
--       AND table_name = 'reports'
--   ) THEN
--       ALTER TABLE reports ADD CONSTRAINT reports_status_check
--       CHECK (status IN ('new', 'in_progress', 'resolved', 'closed'));
--   END IF;
-- END $$;

-- You can add more ALTER TABLE statements here as new fields are identified.
