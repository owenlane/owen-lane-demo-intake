import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  phone: z.string().min(7, 'Phone is required').max(20),
  email: z.string().email('Invalid email').max(255),
  address: z.object({
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(50),
    zip: z.string().min(3).max(20),
  }),
});

export const insuranceInfoSchema = z.object({
  provider: z.string().max(200).optional().default(''),
  memberId: z.string().max(100).optional().default(''),
  groupNumber: z.string().max(100).optional().default(''),
});

export const medicalHistorySchema = z.object({
  conditions: z.array(z.string()).default([]),
  medications: z.string().max(2000).optional().default(''),
  allergies: z.string().max(2000).optional().default(''),
  dentalSurgeries: z.string().max(2000).optional().default(''),
});

export const consentSchema = z.object({
  hipaaAcknowledged: z.literal(true, {
    errorMap: () => ({ message: 'HIPAA acknowledgment is required' }),
  }),
  treatmentConsent: z.literal(true, {
    errorMap: () => ({ message: 'Treatment consent is required' }),
  }),
  signatureText: z.string().min(2, 'Typed signature is required').max(200),
  signatureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
});

export const intakeSubmissionSchema = z.object({
  personalInfo: personalInfoSchema,
  insuranceInfo: insuranceInfoSchema,
  medicalHistory: medicalHistorySchema,
  consent: consentSchema,
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(255),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['new', 'reviewed', 'completed']),
});

export type IntakeSubmission = z.infer<typeof intakeSubmissionSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StatusUpdate = z.infer<typeof statusUpdateSchema>;
