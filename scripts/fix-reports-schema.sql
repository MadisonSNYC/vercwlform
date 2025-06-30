-- This script is intended to fix schema issues in the 'reports' table.
-- It will add missing columns and ensure data types are correct.

-- Add 'additional_context' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS additional_context TEXT;

-- Add 'desired_outcome_array' column if it does not exist, and ensure it's JSONB
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS desired_outcome_array JSONB;

-- Add 'desired_outcome_other' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS desired_outcome_other TEXT;

-- Add 'violations' column if it does not exist, and ensure it's JSONB
ALTER TABLE reports
ALTER COLUMN violations TYPE JSONB USING violations::JSONB;

-- Add 'violation_others' column if it does not exist, and ensure it's JSONB
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS violation_others JSONB;

-- Add 'illegal_broker_fee_charged' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS illegal_broker_fee_charged BOOLEAN;

-- Add 'requirement_to_use_broker' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS requirement_to_use_broker BOOLEAN;

-- Add 'fees_not_disclosed' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fees_not_disclosed BOOLEAN;

-- Add 'fees_not_disclosed_text' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fees_not_disclosed_text TEXT;

-- Add 'improper_fees_in_ad' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS improper_fees_in_ad BOOLEAN;

-- Add 'improper_fees_in_ad_url' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS improper_fees_in_ad_url TEXT;

-- Add 'fee_charges' column if it does not exist, and ensure it's JSONB
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fee_charges JSONB;

-- Add 'fee_charges_other' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fee_charges_other TEXT;

-- Add 'ai_refinement_option' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS ai_refinement_option TEXT;

-- Add 'report_description' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS report_description TEXT;

-- Add 'referral_source' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Add 'referral_source_other' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS referral_source_other TEXT;

-- Add 'document_info' column if it does not exist, and ensure it's JSONB
ALTER TABLE reports
ALTER COLUMN document_info TYPE JSONB USING document_info::JSONB;

-- Add 'updated_at' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add 'created_at' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add 'has_streeteasy_listing' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS has_streeteasy_listing BOOLEAN DEFAULT FALSE;

-- Add 'streeteasy_link' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS streeteasy_link TEXT;

-- Add 'manual_address' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS manual_address TEXT;

-- Add 'manual_price' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS manual_price TEXT;

-- Add 'manual_unit' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS manual_unit TEXT;

-- Add 'manual_bedrooms' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS manual_bedrooms TEXT;

-- Add 'manual_bathrooms' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS manual_bathrooms TEXT;

-- Add 'borough' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS borough TEXT;

-- Add 'neighborhood' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS neighborhood TEXT;

-- Add 'landlord_name' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS landlord_name TEXT;

-- Add 'landlord_company' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS landlord_company TEXT;

-- Add 'broker_name' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS broker_name TEXT;

-- Add 'broker_company' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS broker_company TEXT;

-- Add 'brokerage_name' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS brokerage_name TEXT;

-- Add 'business_address' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS business_address TEXT;

-- Add 'contacted_business' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS contacted_business BOOLEAN;

-- Add 'employee_name' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS employee_name TEXT;

-- Add 'what_happened' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS what_happened TEXT;

-- Add 'outcome' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS outcome TEXT;

-- Add 'dcwp_consent' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS dcwp_consent BOOLEAN DEFAULT FALSE;

-- Add 'proxy_consent' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS proxy_consent BOOLEAN DEFAULT FALSE;

-- Add 'mailing_list_consent' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS mailing_list_consent BOOLEAN DEFAULT FALSE;

-- Add 'is_veteran' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS is_veteran BOOLEAN DEFAULT FALSE;

-- Add 'preferred_contact' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS preferred_contact TEXT;

-- Add 'first_name' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS first_name TEXT;

-- Add 'last_name' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Add 'email' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add 'phone' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add 'narrative' column if it does not exist
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS narrative TEXT;

-- Ensure NOT NULL constraints for essential columns if they are currently nullable
-- This should be done carefully, potentially with a default value or data migration
-- For example:
-- ALTER TABLE reports ALTER COLUMN first_name SET NOT NULL;
-- ALTER TABLE reports ALTER COLUMN last_name SET NOT NULL;
-- ALTER TABLE reports ALTER COLUMN email SET NOT NULL;

-- Recreate indexes for JSONB columns if they were not created or need to be updated
CREATE INDEX IF NOT EXISTS idx_reports_violations ON reports USING GIN(violations);
CREATE INDEX IF NOT EXISTS idx_reports_violation_others ON reports USING GIN(violation_others);
CREATE INDEX IF NOT EXISTS idx_reports_fee_charges ON reports USING GIN(fee_charges);
CREATE INDEX IF NOT EXISTS idx_reports_desired_outcome_array ON reports USING GIN(desired_outcome_array);

-- Add or update indexes for other new columns
CREATE INDEX IF NOT EXISTS idx_reports_borough ON reports(borough);
CREATE INDEX IF NOT EXISTS idx_reports_neighborhood ON reports(neighborhood);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_email ON reports(email);
