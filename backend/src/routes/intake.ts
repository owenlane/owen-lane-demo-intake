import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { intakeSubmissionSchema } from '../validators/schemas';
import { sanitizeObject } from '../lib/sanitize';

const router = Router();

// POST /api/intake/submit
router.post('/submit', async (req: Request, res: Response) => {
  try {
    // Validate
    const parsed = intakeSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const data = sanitizeObject(parsed.data as unknown as Record<string, unknown>) as unknown as typeof parsed.data;

    // Create patient record
    const patientId = uuidv4();
    const { error: patientError } = await supabase.from('patients').insert({
      id: patientId,
      first_name: data.personalInfo.firstName,
      last_name: data.personalInfo.lastName,
      date_of_birth: data.personalInfo.dateOfBirth,
      phone: data.personalInfo.phone,
      email: data.personalInfo.email,
      address_street: data.personalInfo.address.street,
      address_city: data.personalInfo.address.city,
      address_state: data.personalInfo.address.state,
      address_zip: data.personalInfo.address.zip,
    });

    if (patientError) {
      console.error('Patient insert error:', patientError);
      return res.status(500).json({ error: 'Failed to save patient data' });
    }

    // Create submission
    const submissionId = uuidv4();
    const { error: subError } = await supabase.from('intake_submissions').insert({
      id: submissionId,
      patient_id: patientId,
      json_payload: data,
      status: 'new',
    });

    if (subError) {
      console.error('Submission insert error:', subError);
      return res.status(500).json({ error: 'Failed to save submission' });
    }

    return res.status(201).json({
      message: 'Intake form submitted successfully',
      submissionId,
    });
  } catch (err) {
    console.error('Intake submit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
