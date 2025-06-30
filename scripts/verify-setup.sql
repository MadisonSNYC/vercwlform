-- Verify if the 'leads' table exists
SELECT EXISTS (
   SELECT 1
   FROM   information_schema.tables
   WHERE  table_schema = 'public'
   AND    table_name = 'leads'
);

-- Verify if the 'reports' table exists
SELECT EXISTS (
   SELECT 1
   FROM   information_schema.tables
   WHERE  table_schema = 'public'
   AND    table_name = 'reports'
);

-- Check columns in 'leads' table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;

-- Check columns in 'reports' table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'reports'
ORDER BY ordinal_position;

-- Verify RLS is enabled for 'leads'
SELECT relrowsecurity FROM pg_class WHERE relname = 'leads';

-- Verify RLS is enabled for 'reports'
SELECT relrowsecurity FROM pg_class WHERE relname = 'reports';

-- Verify policies for 'leads'
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'leads';

-- Verify policies for 'reports'
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'reports';

-- Test insert into leads (requires 'Allow public inserts on leads' policy)
-- INSERT INTO leads (email, first_name, last_name, form_type)
-- VALUES ('test@example.com', 'Test', 'User', 'waitlist');
-- SELECT * FROM leads WHERE email = 'test@example.com';

-- Test insert into reports (requires 'Allow public inserts on reports' policy)
-- INSERT INTO reports (first_name, last_name, email, narrative)
-- VALUES ('Report', 'User', 'report@example.com', 'This is a test report.');
-- SELECT * FROM reports WHERE email = 'report@example.com';

-- Test select from leads (requires 'Allow authenticated reads on leads' policy for authenticated users)
-- SELECT * FROM leads LIMIT 1;

-- Test select from reports (requires 'Allow authenticated reads on reports' policy for authenticated users)
-- SELECT * FROM reports LIMIT 1;
