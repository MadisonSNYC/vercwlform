-- This script is intended to fix the 'reports' table schema by adding a 'status' column
-- and updating existing rows with a default status.

-- Add the 'status' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='status') THEN
        ALTER TABLE reports ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END
$$;

-- Update existing rows to set 'status' to 'completed' where 'severity' is 'high'
-- This is an example of a data migration based on existing data.
UPDATE reports
SET status = 'completed'
WHERE severity = 'high' AND status IS NULL;

-- Add a NOT NULL constraint to the 'status' column if it's not already there
-- and all existing rows have a non-null status.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='status' AND is_nullable='YES') THEN
        -- Check if all existing rows have a non-null status before adding NOT NULL constraint
        IF (SELECT COUNT(*) FROM reports WHERE status IS NULL) = 0 THEN
            ALTER TABLE reports ALTER COLUMN status SET NOT NULL;
        ELSE
            RAISE NOTICE 'Cannot add NOT NULL constraint to "status" column because some existing rows have NULL values.';
        END IF;
    END IF;
END
$$;

-- Create an index on the 'status' column for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);

-- Add a check constraint to ensure 'status' is one of the allowed values
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reports_status_check') THEN
        ALTER TABLE reports ADD CONSTRAINT reports_status_check CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected'));
    END IF;
END
$$;

-- Add a 'resolved_at' timestamp column for when a report is resolved
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='resolved_at') THEN
        ALTER TABLE reports ADD COLUMN resolved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END
$$;

-- Update the 'resolved_at' for 'completed' reports that don't have it set
UPDATE reports
SET resolved_at = now()
WHERE status = 'completed' AND resolved_at IS NULL;

-- Add a 'priority' column with a default value
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='priority') THEN
        ALTER TABLE reports ADD COLUMN priority TEXT DEFAULT 'medium';
    END IF;
END
$$;

-- Add a check constraint for 'priority'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reports_priority_check') THEN
        ALTER TABLE reports ADD CONSTRAINT reports_priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical'));
    END IF;
END
$$;

-- Add a 'assigned_to' column for assigning reports to users (UUID for user ID)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='assigned_to') THEN
        ALTER TABLE reports ADD COLUMN assigned_to UUID REFERENCES auth.users(id);
    END IF;
END
$$;

-- Create an index on 'assigned_to' for faster lookups
CREATE INDEX IF NOT EXISTS idx_reports_assigned_to ON reports (assigned_to);

-- Add a 'last_updated_by' column to track who last modified the report
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='last_updated_by') THEN
        ALTER TABLE reports ADD COLUMN last_updated_by UUID REFERENCES auth.users(id);
    END IF;
END
$$;

-- Create a function to update 'last_updated_by' and 'resolved_at'
CREATE OR REPLACE FUNCTION update_report_metadata()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_by = auth.uid();
    IF NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
        NEW.resolved_at = now();
    ELSIF NEW.status IS DISTINCT FROM 'completed' THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before update on 'reports'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_report_metadata') THEN
        CREATE TRIGGER trg_update_report_metadata
        BEFORE UPDATE ON reports
        FOR EACH ROW
        EXECUTE FUNCTION update_report_metadata();
    END IF;
END
$$;

-- Add a 'comments_count' column with a default value
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='comments_count') THEN
        ALTER TABLE reports ADD COLUMN comments_count INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Add a 'tags' column for categorization
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='tags') THEN
        ALTER TABLE reports ADD COLUMN tags TEXT[];
    END IF;
END
$$;

-- Add a 'due_date' column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='due_date') THEN
        ALTER TABLE reports ADD COLUMN due_date DATE;
    END IF;
END
$$;

-- Add a 'attachments' column for file paths/URLs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='attachments') THEN
        ALTER TABLE reports ADD COLUMN attachments TEXT[];
    END IF;
END
$$;

-- Add a 'version' column to track software/app version related to the report
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='version') THEN
        ALTER TABLE reports ADD COLUMN version TEXT;
    END IF;
END
$$;

-- Add a 'environment' column (e.g., 'production', 'staging', 'development')
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='environment') THEN
        ALTER TABLE reports ADD COLUMN environment TEXT;
    END IF;
END
$$;

-- Add a check constraint for 'environment'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reports_environment_check') THEN
        ALTER TABLE reports ADD CONSTRAINT reports_environment_check CHECK (environment IN ('production', 'staging', 'development', 'local'));
    END IF;
END
$$;

-- Add a 'reproducible' boolean column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='reproducible') THEN
        ALTER TABLE reports ADD COLUMN reproducible BOOLEAN DEFAULT TRUE;
    END IF;
END
$$;

-- Add a 'steps_to_reproduce' text column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='steps_to_reproduce') THEN
        ALTER TABLE reports ADD COLUMN steps_to_reproduce TEXT;
    END IF;
END
$$;

-- Add a 'expected_result' text column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='expected_result') THEN
        ALTER TABLE reports ADD COLUMN expected_result TEXT;
    END IF;
END
$$;

-- Add a 'actual_result' text column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='actual_result') THEN
        ALTER TABLE reports ADD COLUMN actual_result TEXT;
    END IF;
END
$$;

-- Add a 'browser_info' text column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='browser_info') THEN
        ALTER TABLE reports ADD COLUMN browser_info TEXT;
    END IF;
END
$$;

-- Add an 'os_info' text column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='os_info') THEN
        ALTER TABLE reports ADD COLUMN os_info TEXT;
    END IF;
END
$$;

-- Add a 'user_id' column to link reports to authenticated users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='user_id') THEN
        ALTER TABLE reports ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END
$$;

-- Update existing reports to link to a user if their email matches an existing profile
-- This is a more complex data migration that might require careful consideration
-- and could be run separately or manually if data integrity is critical.
-- For demonstration, we'll assume a simple case where email in reports matches a profile's email.
-- NOTE: This assumes 'profiles' table has an 'email' column, which is not in the initial 'create-tables.sql'.
-- If 'profiles' does not have an email, this part needs adjustment or removal.
-- For now, I'll comment it out as 'profiles' table in create-tables.sql does not have an email column.
/*
UPDATE reports r
SET user_id = p.id
FROM profiles p
WHERE r.email = p.email AND r.user_id IS NULL;
*/

-- Create a table for comments on reports
CREATE TABLE IF NOT EXISTS report_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id), -- User who made the comment
    comment_text TEXT NOT NULL
);

-- Enable RLS for report_comments
ALTER TABLE report_comments ENABLE ROW LEVEL SECURITY;

-- Policies for report_comments
CREATE POLICY "Authenticated users can insert comments."
  ON report_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Everyone can view comments."
  ON report_comments FOR SELECT USING (true);

CREATE POLICY "Users can update their own comments."
  ON report_comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments."
  ON report_comments FOR DELETE USING (auth.uid() = user_id);

-- Function to update comments_count in reports table
CREATE OR REPLACE FUNCTION update_report_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE reports SET comments_count = comments_count + 1 WHERE id = NEW.report_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE reports SET comments_count = comments_count - 1 WHERE id = OLD.report_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update comments_count on insert/delete of report_comments
CREATE TRIGGER trg_update_report_comments_count
AFTER INSERT OR DELETE ON report_comments
FOR EACH ROW
EXECUTE FUNCTION update_report_comments_count();

-- This script is intended to fix the schema of the 'fare_reports' table
-- by ensuring all columns are correctly defined and handling potential
-- existing data if necessary.

-- IMPORTANT: Before running this in production, ensure you have a backup
-- of your database. This script assumes a fresh or test environment
-- where data loss is acceptable if the table needs to be recreated.

-- Step 1: Drop the existing 'fare_reports' table if it exists
-- This is a destructive operation and will delete all data in the table.
-- Only uncomment and run if you are sure you want to clear existing data.
-- DROP TABLE IF EXISTS public.fare_reports;

-- Step 2: Create the 'fare_reports' table with the correct schema
-- If the table already exists and you did not drop it, you would use ALTER TABLE
-- statements to modify columns. For a complete fix, recreating is often simpler
-- if data preservation is not a strict requirement for this specific fix.

CREATE TABLE IF NOT EXISTS public.fare_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    reporter_name TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TEXT NOT NULL,
    location TEXT NOT NULL,
    borough TEXT NOT NULL,
    fare_amount NUMERIC NOT NULL,
    description TEXT NOT NULL,
    contact_permission BOOLEAN NOT NULL DEFAULT FALSE
);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.fare_reports ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policy to allow anonymous users to insert data
-- This policy allows anyone to insert new rows into the fare_reports table.
CREATE POLICY "Allow public insert on fare_reports" ON public.fare_reports
  FOR INSERT WITH CHECK (true);
