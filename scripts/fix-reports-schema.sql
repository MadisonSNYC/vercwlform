-- First, let's see what columns actually exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reports' 
ORDER BY ordinal_position;

-- Add missing columns that the form expects
ALTER TABLE reports ADD COLUMN IF NOT EXISTS landlord_name TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS broker_name TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS brokerage_name TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS additional_context TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reports' 
AND column_name IN ('landlord_name', 'broker_name', 'brokerage_name', 'additional_context')
ORDER BY column_name;
