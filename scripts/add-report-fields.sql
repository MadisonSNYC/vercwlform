-- This script is intended to add new fields to the 'reports' table
-- that might be introduced in later iterations of the form.
-- It should be run after the initial 'create-tables.sql' and 'update-schema.sql'
-- to ensure the schema is always up-to-date with the latest form requirements.

-- Example: Adding a new field 'feedback_score'
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS feedback_score INTEGER;

-- Example: Adding a new field 'resolution_status'
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS resolution_status TEXT DEFAULT 'pending';

-- Example: Adding a new JSONB field for audit trail
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS audit_trail JSONB DEFAULT '[]'::jsonb;

-- Add indexes for new fields if they will be frequently queried
CREATE INDEX IF NOT EXISTS idx_reports_feedback_score ON reports(feedback_score);
CREATE INDEX IF NOT EXISTS idx_reports_resolution_status ON reports(resolution_status);

-- You can add more ALTER TABLE statements here as new fields are identified.
-- Remember to use ADD COLUMN IF NOT EXISTS to make the script idempotent.
