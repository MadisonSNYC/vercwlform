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

-- Verify RLS is enabled for 'leads'
SELECT relrowsecurity FROM pg_class WHERE relname = 'leads';

-- Verify RLS is enabled for 'reports'
SELECT relrowsecurity FROM pg_class WHERE relname = 'reports';

-- Verify policies for 'leads'
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'leads';

-- Verify policies for 'reports'
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'reports';

-- Check for 'additional_context' column in 'reports'
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reports'
  AND column_name = 'additional_context';

-- Check for 'has_streeteasy_listing' column in 'reports'
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reports'
  AND column_name = 'has_streeteasy_listing';

-- Check for 'streeteasy_link' column in 'reports'
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reports'
  AND column_name = 'streeteasy_link';

-- Check for 'form_type' column in 'leads'
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leads'
  AND column_name = 'form_type';

-- Check for 'leads_form_type_check' constraint
SELECT conname
FROM pg_constraint
WHERE conrelid = 'public.leads'::regclass
  AND conname = 'leads_form_type_check';
