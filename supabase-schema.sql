-- ============================================================
-- Dental Patient Intake — Supabase Schema
-- ============================================================

-- 1. Users (admin / staff)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- 2. Patients
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address_street TEXT NOT NULL DEFAULT '',
  address_city TEXT NOT NULL DEFAULT '',
  address_state TEXT NOT NULL DEFAULT '',
  address_zip TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_email ON patients(email);

-- 3. Intake Submissions
CREATE TABLE IF NOT EXISTS intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  json_payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_submissions_status ON intake_submissions(status);
CREATE INDEX idx_submissions_created ON intake_submissions(created_at DESC);
CREATE INDEX idx_submissions_patient ON intake_submissions(patient_id);

-- 4. Activity / Audit Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_action ON activity_logs(action);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);

-- ============================================================
-- RLS GUIDANCE (read this, don't run blindly)
-- ============================================================
-- 
-- The backend connects using the SERVICE ROLE KEY which
-- BYPASSES all RLS policies. This is intentional — the
-- Express server is the single access point to the DB.
--
-- If you still want to enable RLS as defense-in-depth:
--
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "service_role_full_access" ON users
--   FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "service_role_full_access" ON patients
--   FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "service_role_full_access" ON intake_submissions
--   FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "service_role_full_access" ON activity_logs
--   FOR ALL USING (auth.role() = 'service_role');
--
-- This ensures ONLY your backend can access data,
-- and the Supabase anon key (which you should NOT use)
-- cannot read anything.
-- ============================================================
