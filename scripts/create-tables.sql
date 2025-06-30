-- Create a table for public "profiles"
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies for RLS
create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- Create a table for "leads"
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    borough TEXT,
    lease_term TEXT,
    move_in_date DATE,
    budget NUMERIC,
    notes TEXT,
    payment_method TEXT,
    agreed_to_terms BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create a table for "reports"
create table reports (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  report_type text not null,
  title text not null,
  description text not null,
  severity text not null,
  email text
);

-- Create a table for fare reports
CREATE TABLE IF NOT EXISTS public.fare_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    reporter_name TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TEXT NOT NULL,
    location TEXT NOT NULL,
    borough TEXT NOT NULL,
    fare_amount NUMERIC NOT NULL,
    description TEXT NOT NULL,
    contact_permission BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable RLS for leads and reports tables (optional, depending on your needs)
alter table public.leads enable row level security;
alter table reports enable row level security;
ALTER TABLE public.fare_reports ENABLE ROW LEVEL SECURITY;

-- Policies for leads (example: only authenticated users can insert)
create policy "Authenticated users can insert leads."
  on public.leads for insert with check (auth.role() = 'authenticated');

-- Policies for reports (example: everyone can insert, but only authenticated can view/update/delete)
create policy "Everyone can insert reports."
  on reports for insert with check (true);

create policy "Authenticated users can view reports."
  on reports for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update reports."
  on reports for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete reports."
  on reports for delete using (auth.role() = 'authenticated');

-- Create policies for public access (read-only for anonymous users)
-- For leads:
CREATE POLICY "Allow public read access to leads" ON public.leads
FOR SELECT
USING (true);

-- For fare_reports:
CREATE POLICY "Allow public read access to fare_reports" ON public.fare_reports
FOR SELECT
USING (true);

-- Policies for authenticated users (if you implement authentication later)
-- For leads:
-- CREATE POLICY "Allow authenticated users to insert leads" ON public.leads
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- For fare_reports:
-- CREATE POLICY "Allow authenticated users to insert fare reports" ON public.fare_reports
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- Allow anonymous users to insert into 'leads' and 'fare_reports'
CREATE POLICY "Allow public insert on leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on fare_reports" ON public.fare_reports
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read their own leads (if authentication is implemented)
-- This policy assumes you have a 'users' table or similar for auth
-- CREATE POLICY "Allow authenticated read on leads" ON public.leads
--   FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to read their own fare reports
-- CREATE POLICY "Allow authenticated read on fare_reports" ON public.fare_reports
--   FOR SELECT USING (auth.uid() = user_id);

-- You might want to add more sophisticated RLS policies based on your auth strategy.
-- For now, public insert is enabled for demonstration purposes.
