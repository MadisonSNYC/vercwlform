-- Update the existing tables to match the form data structure
-- Run this script to add missing columns and fix schema mismatches

-- First, let's check if we need to rename the waitlist table to leads
-- The form is trying to insert into 'leads' but the table is 'waitlist'
ALTER TABLE IF EXISTS waitlist RENAME TO leads;

-- Update the reports table to match the form data structure
ALTER TABLE reports 
  -- Add missing location fields
  ADD COLUMN IF NOT EXISTS borough TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  
  -- Add missing business information fields
  ADD COLUMN IF NOT EXISTS landlord_company TEXT,
  ADD COLUMN IF NOT EXISTS broker_company TEXT,
  ADD COLUMN IF NOT EXISTS business_address TEXT,
  
  -- Add missing property fields (rename existing ones to match form)
  ADD COLUMN IF NOT EXISTS has_streeteasy_listing BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS streeteasy_link TEXT;

-- Rename columns to match form field names
ALTER TABLE reports RENAME COLUMN IF EXISTS has_street_easy_listing TO has_streeteasy_listing_old;
ALTER TABLE reports RENAME COLUMN IF EXISTS street_easy_link TO streeteasy_link_old;

-- Add DCWP fee detail fields
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS illegal_broker_fee_charged BOOLEAN,
  ADD COLUMN IF NOT EXISTS requirement_to_use_broker BOOLEAN,
  ADD COLUMN IF NOT EXISTS fees_not_disclosed BOOLEAN,
  ADD COLUMN IF NOT EXISTS fees_not_disclosed_text TEXT,
  ADD COLUMN IF NOT EXISTS improper_fees_in_ad BOOLEAN,
  ADD COLUMN IF NOT EXISTS improper_fees_in_ad_url TEXT;

-- Add fee charges fields
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS fee_charges JSONB,
  ADD COLUMN IF NOT EXISTS fee_charges_other TEXT;

-- Add AI enhancement fields
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS ai_refinement_option TEXT,
  ADD COLUMN IF NOT EXISTS report_description TEXT;

-- Add referral fields
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS referral_source TEXT,
  ADD COLUMN IF NOT EXISTS referral_source_other TEXT;

-- Add document info field
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS document_info JSONB;

-- Update violation fields to match form structure
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS violation_others JSONB;

-- Update desired outcome to be JSONB array instead of TEXT
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS desired_outcome_array JSONB,
  ADD COLUMN IF NOT EXISTS desired_outcome_other TEXT;

-- Add updated_at field
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for new fields
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
