-- Add new columns to the reports table
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS illegal_broker_fee_charged BOOLEAN,
ADD COLUMN IF NOT EXISTS requirement_to_use_broker BOOLEAN,
ADD COLUMN IF NOT EXISTS fees_not_disclosed BOOLEAN,
ADD COLUMN IF NOT EXISTS fees_not_disclosed_text TEXT,
ADD COLUMN IF NOT EXISTS improper_fees_in_ad BOOLEAN,
ADD COLUMN IF NOT EXISTS improper_fees_in_ad_url TEXT,
ADD COLUMN IF NOT EXISTS fee_charges JSONB,
ADD COLUMN IF NOT EXISTS fee_charges_other TEXT,
ADD COLUMN IF NOT EXISTS ai_refinement_option TEXT,
ADD COLUMN IF NOT EXISTS report_description TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS referral_source_other TEXT,
ADD COLUMN IF NOT EXISTS document_info JSONB,
ADD COLUMN IF NOT EXISTS violation_others JSONB,
ADD COLUMN IF NOT EXISTS desired_outcome_array JSONB,
ADD COLUMN IF NOT EXISTS desired_outcome_other TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for new JSONB columns
CREATE INDEX IF NOT EXISTS idx_reports_fee_charges ON reports USING GIN(fee_charges);
CREATE INDEX IF NOT EXISTS idx_reports_violation_others ON reports USING GIN(violation_others);
CREATE INDEX IF NOT EXISTS idx_reports_desired_outcome_array ON reports USING GIN(desired_outcome_array);

-- Add indexes for new text columns if beneficial for queries
CREATE INDEX IF NOT EXISTS idx_reports_referral_source ON reports(referral_source);
CREATE INDEX IF NOT EXISTS idx_reports_ai_refinement_option ON reports(ai_refinement_option);
