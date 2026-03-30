import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { supabase } from '../lib/supabase';
import { intakeSubmissionSchema } from '../validators/schemas';
import { sanitizeObject } from '../lib/sanitize';

const router = Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/intake/submit
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const parsed = intakeSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const data = sanitizeObject(
      parsed.data as unknown as Record<string, unknown>
    ) as typeof parsed.data;

    const {
      firstName,
      lastName,
      dateOfBirth,
      phone,
      email,
      address,
    } = data.personalInfo;

    // ===== PATIENT LINKING (FIXED CORE LOGIC) =====

    // 1. Try find existing patient by email
    const { data: existingPatient, error: findError } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (findError) {
      console.error('Find patient error:', findError);
      return res.status(500).json({ error: 'Failed to check existing patient' });
    }

    let patientId = existingPatient?.id;

    // 2. If NOT found → create new patient
    if (!patientId) {
      const newId = uuidv4();

      const { data: newPatient, error: createError } = await supabase
        .from('patients')
        .insert({
          id: newId,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          phone,
          email,
          address_street: address?.street,
          address_city: address?.city,
          address_state: address?.state,
          address_zip: address?.zip,
        })
        .select()
        .single();

      if (createError) {
        console.error('Create patient error:', createError);
        return res.status(500).json({ error: 'Failed to create patient' });
      }

      patientId = newPatient.id;
    }

    // ===== CREATE SUBMISSION =====

    const submissionId = uuidv4();

    const { error: subError } = await supabase
      .from('intake_submissions')
      .insert({
        id: submissionId,
        patient_id: patientId,
        json_payload: data,
        status: 'new',
      });

    if (subError) {
      console.error('Submission insert error:', subError);
      return res.status(500).json({ error: 'Failed to save submission' });
    }

    // ===== EMAIL NOTIFICATION =====

    try {
      const officeEmail =
        process.env.OFFICE_NOTIFICATION_EMAIL || process.env.SMTP_USER || '';
      const dashboardUrl = process.env.ADMIN_DASHBOARD_URL || '';

      const patientName = `${firstName} ${lastName}`.trim();
      const submittedAt = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });

      if (officeEmail) {
        await transporter.sendMail({
          from: `"Lane Campos Group Intake" <${process.env.SMTP_USER}>`,
          to: officeEmail,
          subject: `New Patient Intake Submitted — ${patientName}`,
          text: `
New Patient Intake Submitted

Patient: ${patientName}
Phone: ${phone}
Email: ${email}
Submitted: ${submittedAt}
Submission ID: ${submissionId}

Dashboard:
${dashboardUrl}
          `.trim(),
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
              <h2>New Patient Intake Submitted</h2>
              <p><strong>Patient:</strong> ${patientName}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Submitted:</strong> ${submittedAt}</p>
              <p><strong>Submission ID:</strong> ${submissionId}</p>
              ${
                dashboardUrl
                  ? `<p><a href="${dashboardUrl}" style="padding:10px 14px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Open Admin Dashboard</a></p>`
                  : ''
              }
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Notification email error:', emailErr);
    }

    return res.status(201).json({
      message: 'Intake form submitted successfully',
      id: submissionId,
    });
  } catch (err) {
    console.error('Intake submit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;