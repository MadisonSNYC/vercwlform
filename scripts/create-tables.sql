-- Create the vercel table (renamed from leads)
CREATE TABLE IF NOT EXISTS vercel (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL CHECK (email LIKE 'vercel%'), -- Added CHECK constraint
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  form_type TEXT NOT NULL DEFAULT 'waitlist' CHECK (form_type IN ('waitlist', 'schedule', 'report')),
  contact_time TEXT,
  issue_snapshot TEXT,
  mailing_list_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the reports table with all necessary columns
CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT,
  is_veteran BOOLEAN DEFAULT FALSE,

  -- Property Information
  has_streeteasy_listing BOOLEAN DEFAULT FALSE,
  streeteasy_link TEXT,
  manual_address TEXT,
  manual_price TEXT,
  manual_unit TEXT,
  manual_bedrooms TEXT,
  manual_bathrooms TEXT,
  borough TEXT,
  neighborhood TEXT,

  -- Business Information
  landlord_name TEXT,
  landlord_company TEXT,
  broker_name TEXT,
  broker_company TEXT,
  brokerage_name TEXT,
  business_address TEXT,

  -- Contact Information
  contacted_business BOOLEAN DEFAULT FALSE,
  employee_name TEXT,
  what_happened TEXT,
  outcome TEXT,

  -- Violations
  violations JSONB,
  violation_others JSONB,

  -- DCWP Fee Details
  illegal_broker_fee_charged BOOLEAN,
  requirement_to_use_broker BOOLEAN,
  fees_not_disclosed BOOLEAN,
  fees_not_disclosed_text TEXT,
  improper_fees_in_ad BOOLEAN,
  improper_fees_in_ad_url TEXT,

  -- Fee charges
  fee_charges JSONB,
  fee_charges_other TEXT,

  -- Report Details
  narrative TEXT,
  additional_context TEXT,
  desired_outcome_array JSONB,
  desired_outcome_other TEXT,

  -- AI Enhancement
  ai_refinement_option TEXT,
  report_description TEXT,

  -- Referral
  referral_source TEXT,
  referral_source_other TEXT,

  -- Consents
  dcwp_consent BOOLEAN DEFAULT FALSE,
  proxy_consent BOOLEAN DEFAULT FALSE,
  mailing_list_consent BOOLEAN DEFAULT FALSE,

  -- Document metadata
  document_info JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vercel_email ON vercel(email);
CREATE INDEX IF NOT EXISTS idx_vercel_form_type ON vercel(form_type);
CREATE INDEX IF NOT EXISTS idx_vercel_created_at ON vercel(created_at);

CREATE INDEX IF NOT EXISTS idx_reports_email ON reports(email);
CREATE INDEX IF NOT EXISTS idx_reports_borough ON reports(borough);
CREATE INDEX IF NOT EXISTS idx_reports_neighborhood ON reports(neighborhood);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_violations ON reports USING GIN(violations);
CREATE INDEX IF NOT EXISTS idx_reports_fee_charges ON reports USING GIN(fee_charges);

-- Enable Row Level Security (RLS)
ALTER TABLE vercel ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to allow recreation
DROP POLICY IF EXISTS "Allow public inserts on leads" ON vercel; -- Changed from leads
DROP POLICY IF EXISTS "Allow authenticated reads on leads" ON vercel; -- Changed from leads
DROP POLICY IF EXISTS "Allow public inserts on reports" ON reports;
DROP POLICY IF EXISTS "Allow authenticated reads on reports" ON reports;

-- Create policies to allow inserts (you may want to adjust these based on your auth setup)
CREATE POLICY "Allow public inserts on vercel" ON vercel -- Changed from leads
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on reports" ON reports
FOR INSERT WITH CHECK (true);

-- Create policies to allow reads for authenticated users (adjust as needed)
CREATE POLICY "Allow authenticated reads on vercel" ON vercel -- Changed from leads
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated reads on reports" ON reports
FOR SELECT USING (auth.role() = 'authenticated');
