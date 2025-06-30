-- This script is a comprehensive fix for the 'reports' table schema.
-- It ensures all columns expected by the form are present and correctly typed.
-- It also handles renaming of old columns to new names if they exist.

-- Add missing columns using ADD COLUMN IF NOT EXISTS for idempotency
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact TEXT,
ADD COLUMN IF NOT EXISTS is_veteran BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_streeteasy_listing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS streeteasy_link TEXT,
ADD COLUMN IF NOT EXISTS manual_address TEXT,
ADD COLUMN IF NOT EXISTS manual_price TEXT,
ADD COLUMN IF NOT EXISTS manual_unit TEXT,
ADD COLUMN IF NOT EXISTS manual_bedrooms TEXT,
ADD COLUMN IF NOT EXISTS manual_bathrooms TEXT,
ADD COLUMN IF NOT EXISTS borough TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS landlord_name TEXT,
ADD COLUMN IF NOT EXISTS landlord_company TEXT,
ADD COLUMN IF NOT EXISTS broker_name TEXT,
ADD COLUMN IF NOT EXISTS broker_company TEXT,
ADD COLUMN IF NOT EXISTS brokerage_name TEXT,
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS contacted_business BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS employee_name TEXT,
ADD COLUMN IF NOT EXISTS what_happened TEXT,
ADD COLUMN IF NOT EXISTS outcome TEXT,
ADD COLUMN IF NOT EXISTS violations JSONB,
ADD COLUMN IF NOT EXISTS violation_others JSONB,
ADD COLUMN IF NOT EXISTS illegal_broker_fee_charged BOOLEAN,
ADD COLUMN IF NOT EXISTS requirement_to_use_broker BOOLEAN,
ADD COLUMN IF NOT EXISTS fees_not_disclosed BOOLEAN,
ADD COLUMN IF NOT EXISTS fees_not_disclosed_text TEXT,
ADD COLUMN IF NOT EXISTS improper_fees_in_ad BOOLEAN,
ADD COLUMN IF NOT EXISTS improper_fees_in_ad_url TEXT,
ADD COLUMN IF NOT EXISTS fee_charges JSONB,
ADD COLUMN IF NOT EXISTS fee_charges_other TEXT,
ADD COLUMN IF NOT EXISTS narrative TEXT,
ADD COLUMN IF NOT EXISTS additional_context TEXT,
ADD COLUMN IF NOT EXISTS desired_outcome_array JSONB,
ADD COLUMN IF NOT EXISTS desired_outcome_other TEXT,
ADD COLUMN IF NOT EXISTS ai_refinement_option TEXT,
ADD COLUMN IF NOT EXISTS report_description TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS referral_source_other TEXT,
ADD COLUMN IF NOT EXISTS dcwp_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS proxy_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mailing_list_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS document_info JSONB,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Conditionally rename columns if they exist, using DO block for robust checks
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='has_street_easy_listing') THEN
        ALTER TABLE reports RENAME COLUMN has_street_easy_listing TO has_streeteasy_listing_old;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='street_easy_link') THEN
        ALTER TABLE reports RENAME COLUMN street_easy_link TO streeteasy_link_old;
    END IF;
    -- Add more conditional renames here if needed
END $$;

-- Ensure correct types for existing columns if they were created with different types
-- This part is more complex and might require data migration if types are incompatible.
-- For now, we assume initial types from create-tables.sql are mostly correct.
-- Example: ALTER TABLE reports ALTER COLUMN violations TYPE JSONB USING violations::JSONB;

-- Create indexes for new/updated fields for better performance
CREATE INDEX IF NOT EXISTS idx_reports_borough ON reports(borough);
CREATE INDEX IF NOT EXISTS idx_reports_neighborhood ON reports(neighborhood);
CREATE INDEX IF NOT EXISTS idx_reports_fee_charges ON reports USING GIN(fee_charges);
CREATE INDEX IF NOT EXISTS idx_reports_violation_others ON reports USING GIN(violation_others);
CREATE INDEX IF NOT EXISTS idx_reports_desired_outcome_array ON reports USING GIN(desired_outcome_array);

-- Update the leads table structure to match what the form expects
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS form_type TEXT DEFAULT 'waitlist';

-- Add check constraint for form_type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'leads_form_type_check'
      AND table_name = 'leads'
  ) THEN
      ALTER TABLE leads ADD CONSTRAINT leads_form_type_check
      CHECK (form_type IN ('schedule', 'waitlist', 'report'));
  END IF;
END $$;
