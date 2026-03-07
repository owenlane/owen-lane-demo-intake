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
    // Validate
    const parsed = intakeSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const data = sanitizeObject(
      parsed.data as unknown as Record<string, unknown>
    ) as unknown as typeof parsed.data;

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

    // Send office notification email
    try {
      const officeEmail =
        process.env.OFFICE_NOTIFICATION_EMAIL || process.env.SMTP_USER || '';
      const dashboardUrl =
        process.env.ADMIN_DASHBOARD_URL || '';

      const patientName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim();
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
Phone: ${data.personalInfo.phone}
Email: ${data.personalInfo.email}
Submitted: ${submittedAt}
Submission ID: ${submissionId}

Dashboard:
${dashboardUrl}
          `.trim(),
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
              <h2 style="margin-bottom: 12px;">New Patient Intake Submitted</h2>

              <p><strong>Patient:</strong> ${patientName}</p>
              <p><strong>Phone:</strong> ${data.personalInfo.phone}</p>
              <p><strong>Email:</strong> ${data.personalInfo.email}</p>
              <p><strong>Submitted:</strong> ${submittedAt}</p>
              <p><strong>Submission ID:</strong> ${submissionId}</p>

              ${
                dashboardUrl
                  ? `<p style="margin-top: 20px;">
                      <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 14px; background: #111; color: #fff; text-decoration: none; border-radius: 8px;">
                        Open Admin Dashboard
                      </a>
                    </p>`
                  : ''
              }

              <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
              <p style="font-size: 12px; color: #666;">Secure Intake Infrastructure — Lane Campos Group</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Notification email error:', emailErr);
      // Do NOT fail the intake submission if email notification fails
    }

    return res.status(201).json({
      message: 'Intake form submitted successfully',
      id: submissionId,
      submissionId,
    });
  } catch (err) {
    console.error('Intake submit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
