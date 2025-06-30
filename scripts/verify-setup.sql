-- Verify if the 'vercel' table exists
SELECT EXISTS (
  SELECT 1
  FROM   information_schema.tables
  WHERE  table_schema = 'public'
  AND    table_name = 'vercel'
);

-- Verify if the 'reports' table exists
SELECT EXISTS (
  SELECT 1
  FROM   information_schema.tables
  WHERE  table_schema = 'public'
  AND    table_name = 'reports'
);

-- Check columns in 'vercel' table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'vercel'
ORDER BY ordinal_position;

-- Check columns in 'reports' table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'reports'
ORDER BY ordinal_position;

-- Verify RLS is enabled for 'vercel'
SELECT relrowsecurity FROM pg_class WHERE relname = 'vercel';

-- Verify RLS is enabled for 'reports'
SELECT relrowsecurity FROM pg_class WHERE relname = 'reports';

-- Verify policies for 'vercel'
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'vercel';

-- Verify policies for 'reports'
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'reports';

-- Check for 'email' CHECK constraint on 'vercel' table
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.vercel'::regclass
  AND contype = 'c'
  AND pg_get_constraintdef(oid) LIKE '%email LIKE ''vercel%''%';

-- Check for 'vercel_form_type_check' constraint
SELECT conname
FROM pg_constraint
WHERE conrelid = 'public.vercel'::regclass
 AND conname = 'vercel_form_type_check';

-- Test insert into vercel (requires 'Allow public inserts on vercel' policy and email starting with 'vercel')
-- This insert will succeed:
-- INSERT INTO vercel (email, first_name, last_name, form_type)
-- VALUES ('vercel_test@example.com', 'Test', 'User', 'waitlist');
-- This insert will fail due to the CHECK constraint:
-- INSERT INTO vercel (email, first_name, last_name, form_type)
-- VALUES ('non_vercel@example.com', 'Another', 'User', 'waitlist');
-- SELECT * FROM vercel WHERE email LIKE 'vercel%';

-- Test insert into reports (requires 'Allow public inserts on reports' policy)
-- INSERT INTO reports (first_name, last_name, email, narrative)
-- VALUES ('Report', 'User', 'report@example.com', 'This is a test report.');
-- SELECT * FROM reports WHERE email = 'report@example.com';

-- Test select from vercel (requires 'Allow authenticated reads on vercel' policy for authenticated users)
-- SELECT * FROM vercel LIMIT 1;

-- Test select from reports (requires 'Allow authenticated reads on reports' policy for authenticated users)
-- SELECT * FROM reports LIMIT 1;
