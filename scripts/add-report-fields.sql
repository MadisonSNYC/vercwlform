-- Add new columns for AI refinement and document URLs to the 'reports' table
ALTER TABLE reports
ADD COLUMN ai_refinement_option TEXT DEFAULT 'none',
ADD COLUMN report_description TEXT,
ADD COLUMN document_urls TEXT[];

-- Optional: Add a Supabase Storage bucket for report files
-- You would typically do this in the Supabase UI or via a migration tool.
-- For manual setup, go to Storage -> New bucket and name it 'report_files'.
-- Set up appropriate RLS policies for public uploads if needed, or handle uploads via server-side logic.
