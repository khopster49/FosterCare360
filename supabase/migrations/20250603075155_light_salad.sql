/*
  # Initial Database Schema Setup
  
  1. New Tables
    - `users`
      - Authentication and user management
    - `sessions`
      - Session management for authentication
    - `applicants` 
      - Main applicant information
    - `education_entries`
      - Educational history
    - `employment_entries`
      - Employment history
    - `employment_gaps`
      - Employment gap explanations
    - `dbs_checks`
      - DBS verification details
    - `references`
      - Reference tracking
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar NOT NULL PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'applicant',
  profile_image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applicants table
CREATE TABLE IF NOT EXISTS applicants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  nationality TEXT NOT NULL,
  right_to_work BOOLEAN NOT NULL,
  work_document_type TEXT NOT NULL,
  skills_and_experience TEXT,
  
  -- Disciplinary and criminal record fields
  has_disciplinary BOOLEAN,
  disciplinary_details TEXT,
  has_police_warning BOOLEAN,
  has_unresolved_charges BOOLEAN,
  has_police_investigation BOOLEAN,
  has_dismissed_for_misconduct BOOLEAN,
  has_professional_disqualification BOOLEAN,
  has_ongoing_investigation BOOLEAN,
  has_prohibition BOOLEAN,
  criminal_details TEXT,
  
  -- Data protection and declaration fields
  data_protection_agreed BOOLEAN,
  data_protection_signed_date TIMESTAMP WITH TIME ZONE,
  
  -- Privacy notice fields
  privacy_notice_acknowledged BOOLEAN,
  privacy_notice_date TIMESTAMP WITH TIME ZONE,
  
  -- Equal opportunities data
  equal_opportunities_completed BOOLEAN,
  equal_opportunities_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'in_progress'
);

-- Create education entries table
CREATE TABLE IF NOT EXISTS education_entries (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  institution TEXT NOT NULL,
  qualification TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  details TEXT
);

-- Create employment entries table
CREATE TABLE IF NOT EXISTS employment_entries (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  employer TEXT NOT NULL,
  employer_address TEXT NOT NULL,
  employer_postcode TEXT NOT NULL,
  employer_phone TEXT NOT NULL,
  employer_mobile TEXT,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  duties TEXT NOT NULL,
  reason_for_leaving TEXT,
  reference_name TEXT NOT NULL,
  reference_email TEXT NOT NULL,
  reference_phone TEXT NOT NULL,
  worked_with_vulnerable BOOLEAN DEFAULT FALSE,
  reference_requested BOOLEAN DEFAULT FALSE,
  reference_received BOOLEAN DEFAULT FALSE,
  reference_verified BOOLEAN DEFAULT FALSE
);

-- Create employment gaps table
CREATE TABLE IF NOT EXISTS employment_gaps (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  explanation TEXT NOT NULL
);

-- Create DBS checks table
CREATE TABLE IF NOT EXISTS dbs_checks (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  existing_dbs BOOLEAN DEFAULT FALSE,
  dbs_number TEXT,
  national_insurance TEXT,
  birth_place TEXT,
  five_year_address_history BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Create references table
CREATE TABLE IF NOT EXISTS references (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  employment_entry_id INTEGER NOT NULL REFERENCES employment_entries(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  employer TEXT NOT NULL,
  employer_address TEXT,
  position TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE dbs_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE references ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Applicants can view own data"
  ON applicants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Applicants can view own education entries"
  ON education_entries
  FOR SELECT
  TO authenticated
  USING (applicant_id IN (SELECT id FROM applicants WHERE user_id = auth.uid()));

CREATE POLICY "Applicants can view own employment entries"
  ON employment_entries
  FOR SELECT
  TO authenticated
  USING (applicant_id IN (SELECT id FROM applicants WHERE user_id = auth.uid()));

CREATE POLICY "Applicants can view own employment gaps"
  ON employment_gaps
  FOR SELECT
  TO authenticated
  USING (applicant_id IN (SELECT id FROM applicants WHERE user_id = auth.uid()));

CREATE POLICY "Applicants can view own DBS checks"
  ON dbs_checks
  FOR SELECT
  TO authenticated
  USING (applicant_id IN (SELECT id FROM applicants WHERE user_id = auth.uid()));

CREATE POLICY "Applicants can view own references"
  ON references
  FOR SELECT
  TO authenticated
  USING (applicant_id IN (SELECT id FROM applicants WHERE user_id = auth.uid()));