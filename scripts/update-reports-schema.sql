-- scripts/update-reports-schema.sql

-- This script is intended to update the 'fare_reports' table schema
-- by adding new columns or modifying existing ones without dropping the table.

-- Add 'reporter_name' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='reporter_name') THEN
        ALTER TABLE public.fare_reports ADD COLUMN reporter_name TEXT;
    END IF;
END $$;

-- Add 'reporter_email' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='reporter_email') THEN
        ALTER TABLE public.fare_reports ADD COLUMN reporter_email TEXT;
    END IF;
END $$;

-- Add 'incident_date' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='incident_date') THEN
        ALTER TABLE public.fare_reports ADD COLUMN incident_date DATE;
    END IF;
END $$;

-- Add 'incident_time' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='incident_time') THEN
        ALTER TABLE public.fare_reports ADD COLUMN incident_time TEXT;
    END IF;
END $$;

-- Add 'location' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='location') THEN
        ALTER TABLE public.fare_reports ADD COLUMN location TEXT;
    END IF;
END $$;

-- Add 'borough' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='borough') THEN
        ALTER TABLE public.fare_reports ADD COLUMN borough TEXT;
    END IF;
END $$;

-- Add 'fare_amount' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='fare_amount') THEN
        ALTER TABLE public.fare_reports ADD COLUMN fare_amount NUMERIC;
    END IF;
END $$;

-- Add 'description' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='description') THEN
        ALTER TABLE public.fare_reports ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add 'contact_permission' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fare_reports' AND column_name='contact_permission') THEN
        ALTER TABLE public.fare_reports ADD COLUMN contact_permission BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Set NOT NULL constraints for new columns, assuming data has been backfilled or is new.
-- If existing rows have NULLs for these columns, you must update them before setting NOT NULL.
-- Example: UPDATE public.fare_reports SET reporter_name = 'Anonymous' WHERE reporter_name IS NULL;
ALTER TABLE public.fare_reports ALTER COLUMN reporter_name SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN reporter_email SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN incident_date SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN incident_time SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN location SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN borough SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN fare_amount SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.fare_reports ALTER COLUMN contact_permission SET NOT NULL;

-- Re-enable Row Level Security (RLS) if it was disabled or ensure it's enabled
ALTER TABLE public.fare_reports ENABLE ROW LEVEL SECURITY;

-- Re-create or ensure RLS policy for public insert
-- This policy allows anyone to insert new rows into the fare_reports table.
CREATE POLICY IF NOT EXISTS "Allow public insert on fare_reports" ON public.fare_reports
  FOR INSERT WITH CHECK (true);
