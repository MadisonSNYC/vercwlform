-- scripts/fix-reports-schema.sql

-- This script is intended to fix the 'fare_reports' table schema
-- by ensuring all columns are correctly defined.

-- Add missing columns or alter existing ones if they are incorrect.
-- Example: If 'incident_time' was missing or had the wrong type.

-- Check if 'incident_time' column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='incident_time') THEN
        ALTER TABLE public.fare_reports ADD COLUMN incident_time TEXT;
    END IF;
END $$;

-- Check if 'location' column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='location') THEN
        ALTER TABLE public.fare_reports ADD COLUMN location TEXT;
    END IF;
END $$;

-- Check if 'borough' column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='borough') THEN
        ALTER TABLE public.fare_reports ADD COLUMN borough TEXT;
    END IF;
END $$;

-- Check if 'fare_amount' column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='fare_amount') THEN
        ALTER TABLE public.fare_reports ADD COLUMN fare_amount NUMERIC;
    END IF;
END $$;

-- Check if 'description' column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='description') THEN
        ALTER TABLE public.fare_reports ADD COLUMN description TEXT;
    END IF;
END $$;

-- Check if 'contact_permission' column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='contact_permission') THEN
        ALTER TABLE public.fare_reports ADD COLUMN contact_permission BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Ensure existing columns have correct constraints (e.g., NOT NULL)
-- This part should be handled carefully as it might fail if existing data violates the constraint.
-- For example, to make 'reporter_name' NOT NULL, you'd first ensure no NULLs exist:
-- UPDATE public.fare_reports SET reporter_name = 'Unknown' WHERE reporter_name IS NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN reporter_name SET NOT NULL;

-- Example for other columns:
-- ALTER TABLE public.fare_reports ALTER COLUMN reporter_email SET NOT NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN incident_date SET NOT NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN incident_time SET NOT NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN location SET NOT NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN borough SET NOT NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN fare_amount SET NOT NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN description SET NOT NULL;
-- ALTER TABLE public.fare_reports ALTER COLUMN contact_permission SET NOT NULL;

-- Re-enable Row Level Security (RLS) if it was disabled or ensure it's enabled
ALTER TABLE public.fare_reports ENABLE ROW LEVEL SECURITY;

-- Re-create or ensure RLS policy for public insert
-- This policy allows anyone to insert new rows into the fare_reports table.
CREATE POLICY IF NOT EXISTS "Allow public insert on fare_reports" ON public.fare_reports
  FOR INSERT WITH CHECK (true);
