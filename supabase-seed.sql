-- ============================================================
-- Seed Data — Demo Mode
-- ============================================================
-- Admin password: DemoPass123!
-- bcrypt hash (cost 12): $2a$12$LJ3m4ys3Lk0TSwMCfVBXaOFmJ6gNcWH7jFCXVn.0oP2gK3BxJyKWe
-- 
-- NOTE: It's more reliable to run `npm run seed` from the
-- backend project which generates a fresh bcrypt hash.
-- This SQL uses a pre-computed hash as a convenience.
-- ============================================================

-- Admin user
INSERT INTO users (id, email, password_hash, role) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@demo.com', '$2a$12$LJ3m4ys3Lk0TSwMCfVBXaOFmJ6gNcWH7jFCXVn.0oP2gK3BxJyKWe', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Sample patients
INSERT INTO patients (id, first_name, last_name, date_of_birth, phone, email, address_street, address_city, address_state, address_zip) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Jane', 'Smith', '1988-03-15', '(555) 123-4567', 'jane.smith@example.com', '123 Oak Avenue', 'Springfield', 'IL', '62701'),
  ('b0000000-0000-0000-0000-000000000002', 'Robert', 'Johnson', '1975-11-22', '(555) 987-6543', 'rjohnson@example.com', '456 Maple Drive', 'Portland', 'OR', '97201')
ON CONFLICT DO NOTHING;

-- Sample submissions
INSERT INTO intake_submissions (id, patient_id, json_payload, status) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  '{
    "personalInfo": {"firstName":"Jane","lastName":"Smith","dateOfBirth":"1988-03-15","phone":"(555) 123-4567","email":"jane.smith@example.com","address":{"street":"123 Oak Avenue","city":"Springfield","state":"IL","zip":"62701"}},
    "insuranceInfo": {"provider":"Delta Dental","memberId":"DD-998877","groupNumber":"GRP-100"},
    "medicalHistory": {"conditions":["High Blood Pressure","Diabetes"],"medications":"Lisinopril 10mg daily, Metformin 500mg twice daily","allergies":"Penicillin","dentalSurgeries":"Wisdom teeth removed 2010"},
    "consent": {"hipaaAcknowledged":true,"treatmentConsent":true,"signatureText":"Jane Smith","signatureDate":"2025-01-15"}
  }'::jsonb,
  'new'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000002',
  '{
    "personalInfo": {"firstName":"Robert","lastName":"Johnson","dateOfBirth":"1975-11-22","phone":"(555) 987-6543","email":"rjohnson@example.com","address":{"street":"456 Maple Drive","city":"Portland","state":"OR","zip":"97201"}},
    "insuranceInfo": {"provider":"Cigna","memberId":"CIG-112233","groupNumber":"GRP-200"},
    "medicalHistory": {"conditions":["Asthma"],"medications":"Albuterol inhaler as needed","allergies":"None","dentalSurgeries":"Root canal on tooth #19, 2018"},
    "consent": {"hipaaAcknowledged":true,"treatmentConsent":true,"signatureText":"Robert Johnson","signatureDate":"2025-01-18"}
  }'::jsonb,
  'reviewed'
)
ON CONFLICT DO NOTHING;
