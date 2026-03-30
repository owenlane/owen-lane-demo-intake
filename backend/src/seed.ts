import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function upsertAdminUser() {
  const adminEmail = 'admin@demo.com';
  const adminPassword = 'DemoPass123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const { data: existingUser, error: findUserError } = await supabase
    .from('users')
    .select('id,email')
    .eq('email', adminEmail)
    .maybeSingle();

  if (findUserError) {
    console.error('Find admin user error:', findUserError);
    return;
  }

  if (existingUser) {
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        role: 'admin',
      })
      .eq('email', adminEmail);

    if (updateUserError) {
      console.error('Admin update error:', updateUserError);
      return;
    }

    console.log('Admin user password reset: admin@demo.com / DemoPass123!');
    return;
  }

  const { error: insertUserError } = await supabase.from('users').insert({
    id: uuidv4(),
    email: adminEmail,
    password_hash: passwordHash,
    role: 'admin',
  });

  if (insertUserError) {
    console.error('Admin insert error:', insertUserError);
    return;
  }

  console.log('Admin user created: admin@demo.com / DemoPass123!');
}

async function insertSamplePatientsAndSubmissions() {
  const patient1Id = uuidv4();
  const patient2Id = uuidv4();

  const { error: patientErr } = await supabase.from('patients').insert([
    {
      id: patient1Id,
      first_name: 'Jane',
      last_name: 'Smith',
      date_of_birth: '1988-03-15',
      phone: '(555) 123-4567',
      email: 'jane.smith@example.com',
      address_street: '123 Oak Avenue',
      address_city: 'Springfield',
      address_state: 'IL',
      address_zip: '62701',
    },
    {
      id: patient2Id,
      first_name: 'Robert',
      last_name: 'Johnson',
      date_of_birth: '1975-11-22',
      phone: '(555) 987-6543',
      email: 'rjohnson@example.com',
      address_street: '456 Maple Drive',
      address_city: 'Portland',
      address_state: 'OR',
      address_zip: '97201',
    },
  ]);

  if (patientErr) {
    console.error('Patient seed error:', patientErr);
    return;
  }

  const { error: submissionErr } = await supabase.from('intake_submissions').insert([
    {
      id: uuidv4(),
      patient_id: patient1Id,
      json_payload: {
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: '1988-03-15',
          phone: '(555) 123-4567',
          email: 'jane.smith@example.com',
          address: {
            street: '123 Oak Avenue',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
          },
        },
        insuranceInfo: {
          provider: 'Delta Dental',
          memberId: 'DD-998877',
          groupNumber: 'GRP-100',
        },
        medicalHistory: {
          conditions: ['High Blood Pressure', 'Diabetes'],
          medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
          allergies: 'Penicillin',
          dentalSurgeries: 'Wisdom teeth removed 2010',
        },
        consent: {
          hipaaAcknowledged: true,
          treatmentConsent: true,
          signatureText: 'Jane Smith',
          signatureDate: '2025-01-15',
        },
      },
      status: 'new',
    },
    {
      id: uuidv4(),
      patient_id: patient2Id,
      json_payload: {
        personalInfo: {
          firstName: 'Robert',
          lastName: 'Johnson',
          dateOfBirth: '1975-11-22',
          phone: '(555) 987-6543',
          email: 'rjohnson@example.com',
          address: {
            street: '456 Maple Drive',
            city: 'Portland',
            state: 'OR',
            zip: '97201',
          },
        },
        insuranceInfo: {
          provider: 'Cigna',
          memberId: 'CIG-112233',
          groupNumber: 'GRP-200',
        },
        medicalHistory: {
          conditions: ['Asthma'],
          medications: 'Albuterol inhaler as needed',
          allergies: 'None',
          dentalSurgeries: 'Root canal on tooth #19, 2018',
        },
        consent: {
          hipaaAcknowledged: true,
          treatmentConsent: true,
          signatureText: 'Robert Johnson',
          signatureDate: '2025-01-18',
        },
      },
      status: 'reviewed',
    },
  ]);

  if (submissionErr) {
    console.error('Submission seed error:', submissionErr);
    return;
  }

  console.log('2 sample submissions created');
}

async function seed() {
  console.log('Seeding database...');
  await upsertAdminUser();
  await insertSamplePatientsAndSubmissions();
  console.log('Seed complete!');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});