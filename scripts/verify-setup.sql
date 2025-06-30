-- Verify that all tables exist and have the correct structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('waitlist', 'reports')
ORDER BY table_name, ordinal_position;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('waitlist', 'reports');

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('waitlist', 'reports');

-- Test insert permissions (this should work)
INSERT INTO waitlist (email, form_type, mailing_list_consent) 
VALUES ('test@example.com', 'waitlist', false);

-- Clean up test data
DELETE FROM waitlist WHERE email = 'test@example.com';
