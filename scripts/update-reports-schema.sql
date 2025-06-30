-- Update the reports table to match the current form structure
-- This adds any missing columns and ensures compatibility

-- Add missing columns if they don't exist
ALTER TABLE reports ADD COLUMN IF NOT EXISTS additional_context TEXT;

-- Ensure all expected columns exist
ALTER TABLE reports ADD COLUMN IF NOT EXISTS landlord_entries JSONB;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS broker_entries JSONB;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS brokerage_entries JSONB;

-- Update existing data structure if needed
-- This is safe to run multiple times
UPDATE reports 
SET 
  landlord_entries = CASE 
    WHEN landlord_name IS NOT NULL THEN 
      jsonb_build_array(jsonb_build_object('name', landlord_name, 'company', ''))
    ELSE NULL 
  END,
  broker_entries = CASE 
    WHEN broker_name IS NOT NULL THEN 
      jsonb_build_array(jsonb_build_object('name', broker_name, 'company', brokerage_name, 'phone', '', 'email', ''))
    ELSE NULL 
  END,
  brokerage_entries = CASE 
    WHEN brokerage_name IS NOT NULL AND broker_name IS NULL THEN 
      jsonb_build_array(jsonb_build_object('name', brokerage_name, 'address', '', 'phone', '', 'email', ''))
    ELSE NULL 
  END
WHERE landlord_entries IS NULL AND broker_entries IS NULL AND brokerage_entries IS NULL;

-- Add indexes for the new JSONB columns
CREATE INDEX IF NOT EXISTS idx_reports_landlord_entries ON reports USING GIN(landlord_entries);
CREATE INDEX IF NOT EXISTS idx_reports_broker_entries ON reports USING GIN(broker_entries);
CREATE INDEX IF NOT EXISTS idx_reports_brokerage_entries ON reports USING GIN(brokerage_entries);

-- Verify the schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reports' 
ORDER BY ordinal_position;
