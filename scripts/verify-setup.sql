-- Verify if the 'profiles' table exists
SELECT EXISTS (
   SELECT 1
   FROM   information_schema.tables
   WHERE  table_schema = 'public'
   AND    table_name = 'profiles'
) AS profiles_table_exists;

-- Verify if Row Level Security is enabled for 'profiles'
SELECT relrowsecurity AS profiles_rls_enabled FROM pg_class WHERE relname = 'profiles';

-- Verify if policies exist for 'profiles'
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Verify if the 'leads' table exists and has data
SELECT 'leads_table_exists' AS check_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN 'true' ELSE 'false' END AS status;

SELECT 'leads_row_count' AS check_name, COUNT(*) AS count FROM public.leads;

-- Verify columns in 'leads' table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
ORDER BY ordinal_position;

-- Verify if Row Level Security is enabled for 'leads'
SELECT relrowsecurity AS leads_rls_enabled FROM pg_class WHERE relname = 'leads';

-- Verify if policies exist for 'leads'
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'leads';

-- Verify RLS policies for 'leads'
SELECT 'leads_insert_policy_exists' AS check_name,
       CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'leads' AND policyname = 'Allow public insert on leads' AND permisive = true AND cmd = 'INSERT') THEN 'true' ELSE 'false' END AS status;

-- Verify if the 'fare_reports' table exists and has data
SELECT 'fare_reports_table_exists' AS check_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fare_reports') THEN 'true' ELSE 'false' END AS status;

SELECT 'fare_reports_row_count' AS check_name, COUNT(*) AS count FROM public.fare_reports;

-- Verify columns in 'fare_reports' table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'fare_reports'
ORDER BY ordinal_position;

-- Verify Row Level Security (RLS) status for 'fare_reports'
SELECT relrowsecurity AS fare_reports_rls_enabled FROM pg_class WHERE relname = 'fare_reports';

-- Verify policies for 'fare_reports' table
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'fare_reports';

-- Verify RLS policies for 'fare_reports'
SELECT 'fare_reports_insert_policy_exists' AS check_name,
       CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'fare_reports' AND policyname = 'Allow public insert on fare_reports' AND permisive = true AND cmd = 'INSERT') THEN 'true' ELSE 'false' END AS status;

-- Verify if the 'reports' table exists
SELECT EXISTS (
   SELECT 1
   FROM   information_schema.tables
   WHERE  table_schema = 'public'
   AND    table_name = 'reports'
) AS reports_table_exists;

-- Verify if Row Level Security is enabled for 'reports'
SELECT relrowsecurity AS reports_rls_enabled FROM pg_class WHERE relname = 'reports';

-- Verify if policies exist for 'reports'
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'reports';

-- Verify if the 'status' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='status'
) AS status_column_exists;

-- Verify the default value of the 'status' column
SELECT column_default AS status_default_value
FROM information_schema.columns
WHERE table_name = 'reports' AND column_name = 'status';

-- Verify if the 'status' column is NOT NULL
SELECT is_nullable AS status_is_nullable
FROM information_schema.columns
WHERE table_name = 'reports' AND column_name = 'status';

-- Verify if the index on 'status' column exists
SELECT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = 'reports' AND indexname = 'idx_reports_status'
) AS status_index_exists;

-- Verify if the check constraint for 'status' exists
SELECT conname AS status_check_constraint_name, pg_get_constraintdef(oid) AS status_check_constraint_def
FROM pg_constraint
WHERE conrelid = 'public.reports'::regclass AND contype = 'c' AND conname = 'reports_status_check';

-- Verify if the 'resolved_at' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='resolved_at'
) AS resolved_at_column_exists;

-- Verify if the 'priority' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='priority'
) AS priority_column_exists;

-- Verify if the check constraint for 'priority' exists
SELECT conname AS priority_check_constraint_name, pg_get_constraintdef(oid) AS priority_check_constraint_def
FROM pg_constraint
WHERE conrelid = 'public.reports'::regclass AND contype = 'c' AND conname = 'reports_priority_check';

-- Verify if the 'assigned_to' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='assigned_to'
) AS assigned_to_column_exists;

-- Verify if the index on 'assigned_to' column exists
SELECT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = 'reports' AND indexname = 'idx_reports_assigned_to'
) AS assigned_to_index_exists;

-- Verify if the 'last_updated_by' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='last_updated_by'
) AS last_updated_by_column_exists;

-- Verify if the trigger 'trg_update_report_metadata' exists
SELECT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_update_report_metadata'
) AS trg_update_report_metadata_exists;

-- Verify if the 'comments_count' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='comments_count'
) AS comments_count_column_exists;

-- Verify if the 'tags' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='tags'
) AS tags_column_exists;

-- Verify if the 'due_date' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='due_date'
) AS due_date_column_exists;

-- Verify if the 'attachments' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='attachments'
) AS attachments_column_exists;

-- Verify if the 'version' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='version'
) AS version_column_exists;

-- Verify if the 'environment' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='environment'
) AS environment_column_exists;

-- Verify if the check constraint for 'environment' exists
SELECT conname AS environment_check_constraint_name, pg_get_constraintdef(oid) AS environment_check_constraint_def
FROM pg_constraint
WHERE conrelid = 'public.reports'::regclass AND contype = 'c' AND conname = 'reports_environment_check';

-- Verify if the 'reproducible' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='reproducible'
) AS reproducible_column_exists;

-- Verify if the 'steps_to_reproduce' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='steps_to_reproduce'
) AS steps_to_reproduce_column_exists;

-- Verify if the 'expected_result' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='expected_result'
) AS expected_result_column_exists;

-- Verify if the 'actual_result' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='actual_result'
) AS actual_result_column_exists;

-- Verify if the 'browser_info' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='browser_info'
) AS browser_info_column_exists;

-- Verify if the 'os_info' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='os_info'
) AS os_info_column_exists;

-- Verify if the 'user_id' column exists in 'reports' table
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='reports' AND column_name='user_id'
) AS user_id_column_exists;

-- Verify if the 'report_comments' table exists
SELECT EXISTS (
   SELECT 1
   FROM   information_schema.tables
   WHERE  table_schema = 'public'
   AND    table_name = 'report_comments'
) AS report_comments_table_exists;

-- Verify if Row Level Security is enabled for 'report_comments'
SELECT relrowsecurity AS report_comments_rls_enabled FROM pg_class WHERE relname = 'report_comments';

-- Verify if policies exist for 'report_comments'
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'report_comments';

-- Verify if the trigger 'trg_update_report_comments_count' exists
SELECT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_update_report_comments_count'
) AS trg_update_report_comments_count_exists;

-- Check for any errors in the last few minutes (example, depends on logging setup)
-- SELECT 'recent_errors' AS check_name, COUNT(*) AS count FROM pg_log WHERE log_time > NOW() - INTERVAL '5 minutes' AND message ILIKE '%error%';
