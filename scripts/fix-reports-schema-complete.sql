-- Complete schema migration for reports table
-- This script adds all missing columns that the form expects

DO $$
BEGIN
    -- Add missing columns to reports table if they don't exist
    
    -- Basic form fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'form_type') THEN
        ALTER TABLE reports ADD COLUMN form_type TEXT;
        RAISE NOTICE 'Added form_type column';
    END IF;
    
    -- Property information
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'has_streeteasy_listing') THEN
        ALTER TABLE reports ADD COLUMN has_streeteasy_listing BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added has_streeteasy_listing column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'streeteasy_link') THEN
        ALTER TABLE reports ADD COLUMN streeteasy_link TEXT;
        RAISE NOTICE 'Added streeteasy_link column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'manual_address') THEN
        ALTER TABLE reports ADD COLUMN manual_address TEXT;
        RAISE NOTICE 'Added manual_address column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'manual_price') THEN
        ALTER TABLE reports ADD COLUMN manual_price TEXT;
        RAISE NOTICE 'Added manual_price column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'manual_unit') THEN
        ALTER TABLE reports ADD COLUMN manual_unit TEXT;
        RAISE NOTICE 'Added manual_unit column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'manual_bedrooms') THEN
        ALTER TABLE reports ADD COLUMN manual_bedrooms TEXT;
        RAISE NOTICE 'Added manual_bedrooms column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'manual_bathrooms') THEN
        ALTER TABLE reports ADD COLUMN manual_bathrooms TEXT;
        RAISE NOTICE 'Added manual_bathrooms column';
    END IF;
    
    -- Contact with business
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'contacted_business') THEN
        ALTER TABLE reports ADD COLUMN contacted_business BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added contacted_business column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'employee_name') THEN
        ALTER TABLE reports ADD COLUMN employee_name TEXT;
        RAISE NOTICE 'Added employee_name column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'what_happened') THEN
        ALTER TABLE reports ADD COLUMN what_happened TEXT;
        RAISE NOTICE 'Added what_happened column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'outcome') THEN
        ALTER TABLE reports ADD COLUMN outcome TEXT;
        RAISE NOTICE 'Added outcome column';
    END IF;
    
    -- Responsible parties
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'landlord_name') THEN
        ALTER TABLE reports ADD COLUMN landlord_name TEXT;
        RAISE NOTICE 'Added landlord_name column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'broker_name') THEN
        ALTER TABLE reports ADD COLUMN broker_name TEXT;
        RAISE NOTICE 'Added broker_name column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'brokerage_name') THEN
        ALTER TABLE reports ADD COLUMN brokerage_name TEXT;
        RAISE NOTICE 'Added brokerage_name column';
    END IF;
    
    -- Violations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'violations') THEN
        ALTER TABLE reports ADD COLUMN violations JSONB;
        RAISE NOTICE 'Added violations column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'violation_other_texts') THEN
        ALTER TABLE reports ADD COLUMN violation_other_texts JSONB;
        RAISE NOTICE 'Added violation_other_texts column';
    END IF;
    
    -- Narrative and context
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'narrative') THEN
        ALTER TABLE reports ADD COLUMN narrative TEXT;
        RAISE NOTICE 'Added narrative column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'additional_context') THEN
        ALTER TABLE reports ADD COLUMN additional_context TEXT;
        RAISE NOTICE 'Added additional_context column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'desired_outcome') THEN
        ALTER TABLE reports ADD COLUMN desired_outcome TEXT;
        RAISE NOTICE 'Added desired_outcome column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'desired_outcome_other') THEN
        ALTER TABLE reports ADD COLUMN desired_outcome_other TEXT;
        RAISE NOTICE 'Added desired_outcome_other column';
    END IF;
    
    -- Contact information
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'user_email') THEN
        ALTER TABLE reports ADD COLUMN user_email TEXT;
        RAISE NOTICE 'Added user_email column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'user_phone') THEN
        ALTER TABLE reports ADD COLUMN user_phone TEXT;
        RAISE NOTICE 'Added user_phone column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'preferred_contact') THEN
        ALTER TABLE reports ADD COLUMN preferred_contact TEXT;
        RAISE NOTICE 'Added preferred_contact column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'is_veteran') THEN
        ALTER TABLE reports ADD COLUMN is_veteran BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_veteran column';
    END IF;
    
    -- Consent fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'dcwp_consent') THEN
        ALTER TABLE reports ADD COLUMN dcwp_consent BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added dcwp_consent column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'proxy_consent') THEN
        ALTER TABLE reports ADD COLUMN proxy_consent BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added proxy_consent column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'mailing_list_consent') THEN
        ALTER TABLE reports ADD COLUMN mailing_list_consent BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added mailing_list_consent column';
    END IF;
    
    -- Additional fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'referral_source') THEN
        ALTER TABLE reports ADD COLUMN referral_source TEXT;
        RAISE NOTICE 'Added referral_source column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'contact_time') THEN
        ALTER TABLE reports ADD COLUMN contact_time TEXT;
        RAISE NOTICE 'Added contact_time column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reports' AND column_name = 'issue_snapshot') THEN
        ALTER TABLE reports ADD COLUMN issue_snapshot TEXT;
        RAISE NOTICE 'Added issue_snapshot column';
    END IF;
    
    RAISE NOTICE 'Schema migration completed successfully';
END
$$;

-- Verify all columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reports' 
ORDER BY column_name;
