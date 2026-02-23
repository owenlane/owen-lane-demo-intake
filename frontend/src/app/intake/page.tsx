'use client';

import { CLIENT } from "@/lib/client";
import { useState, useEffect, useCallback } from 'react';
import { submitIntake } from '@/lib/api';
import { MEDICAL_CONDITIONS } from '@/lib/constants';
import {
  Shield,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Heart,
  ClipboardList,
  UserRound,
  FileCheck
} from 'lucide-react';

const STEPS = ['Personal Info', 'Insurance', 'Medical History', 'Consent'];
const STEP_ICONS = [UserRound, Shield, Heart, FileCheck];
const STORAGE_KEY = 'dental_intake_draft';

interface FormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    address: { street: string; city: string; state: string; zip: string };
  };
  insuranceInfo: { provider: string; memberId: string; groupNumber: string };
  medicalHistory: {
    conditions: string[];
    medications: string;
    allergies: string;
    dentalSurgeries: string;
  };
  consent: {
    hipaaAcknowledged: boolean;
    treatmentConsent: boolean;
    signatureText: string;
    signatureDate: string;
  };
}

const emptyForm: FormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: { street: '', city: '', state: '', zip: '' },
  },
  insuranceInfo: { provider: '', memberId: '', groupNumber: '' },
  medicalHistory: { conditions: [], medications: '', allergies: '', dentalSurgeries: '' },
  consent: {
    hipaaAcknowledged: false,
    treatmentConsent: false,
    signatureText: '',
    signatureDate: new Date().toISOString().slice(0, 10),
  },
};

export default function IntakePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Load draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm({ ...emptyForm, ...parsed });
      }
    } catch {}
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (!submissionId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form, submissionId]);

  const updatePersonal = useCallback((field: string, value: string) => {
    setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, [field]: value } }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }, []);

  const updateAddress = useCallback((field: string, value: string) => {
    setForm((f) => ({
      ...f,
      personalInfo: { ...f.personalInfo, address: { ...f.personalInfo.address, [field]: value } },
    }));
    setErrors((e) => ({ ...e, [`address.${field}`]: '' }));
  }, []);

  const updateInsurance = useCallback((field: string, value: string) => {
    setForm((f) => ({ ...f, insuranceInfo: { ...f.insuranceInfo, [field]: value } }));
  }, []);

  const updateMedical = useCallback((field: string, value: string | string[]) => {
    setForm((f) => ({ ...f, medicalHistory: { ...f.medicalHistory, [field]: value } }));
  }, []);

  const toggleCondition = useCallback((condition: string) => {
    setForm((f) => {
      const conditions = f.medicalHistory.conditions.includes(condition)
        ? f.medicalHistory.conditions.filter((c) => c !== condition)
        : [...f.medicalHistory.conditions, condition];
      return { ...f, medicalHistory: { ...f.medicalHistory, conditions } };
    });
  }, []);

  const updateConsent = useCallback((field: string, value: boolean | string) => {
    setForm((f) => ({ ...f, consent: { ...f.consent, [field]: value } }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }, []);

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 0) {
      const p = form.personalInfo;
      if (!p.firstName.trim()) errs.firstName = 'Required';
      if (!p.lastName.trim()) errs.lastName = 'Required';
      if (!p.dateOfBirth) errs.dateOfBirth = 'Required';
      if (!p.phone.trim()) errs.phone = 'Required';
      if (!p.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errs.email = 'Valid email required';
      if (!p.address.street.trim()) errs['address.street'] = 'Required';
      if (!p.address.city.trim()) errs['address.city'] = 'Required';
      if (!p.address.state.trim()) errs['address.state'] = 'Required';
      if (!p.address.zip.trim()) errs['address.zip'] = 'Required';
    }
    if (s === 3) {
      if (!form.consent.hipaaAcknowledged) errs.hipaaAcknowledged = 'Required';
      if (!form.consent.treatmentConsent) errs.treatmentConsent = 'Required';
      if (!form.consent.signatureText.trim()) errs.signatureText = 'Typed signature required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;
    setSubmitting(true);
    try {
      const res = await submitIntake(form);
      setSubmissionId(res.submissionId);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  // Confirmation screen
  if (submissionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dental-50 via-white to-emerald-50">
        <div className="max-w-md w-full text-center space-y-6 p-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-dental-500 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h1 className="font-display text-3xl font-bold text-slate-900">Form Submitted!</h1>

          <p className="text-slate-600">
            Your intake form has been received. Please save your confirmation ID for your records.
          </p>

          <div className="bg-white border-2 border-dental-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Confirmation ID</p>
            <p className="font-mono text-lg font-semibold text-dental-700 break-all">{submissionId}</p>
          </div>

          <p className="text-sm text-slate-500">
            If you have any questions, call our office {CLIENT.phone}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dental-500 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-slate-900 leading-tight">{CLIENT.name}</h1>
            <p className="text-xs text-slate-500">{CLIENT.intakeTitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((label, i) => {
              const Icon = STEP_ICONS[i];
              const isActive = i === step;
              const isDone = i < step;

              return (
                <button
                  key={label}
                  onClick={() => i < step && setStep(i)}
                  className={`flex flex-col items-center gap-1.5 transition-all ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-medium ${
                      isDone
                        ? 'bg-dental-500 text-white'
                        : isActive
                        ? 'bg-dental-500 text-white ring-4 ring-dental-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>

                  <span
                    className={`text-[11px] font-medium hidden sm:block ${
                      isActive ? 'text-dental-700' : isDone ? 'text-dental-600' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full bg-gradient-to-r from-dental-400 to-dental-500 rounded-full"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 step-enter" key={step}>
          {step === 0 && (
            <Step1
              data={form.personalInfo}
              errors={errors}
              updatePersonal={updatePersonal}
              updateAddress={updateAddress}
            />
          )}

          {step === 1 && <Step2 data={form.insuranceInfo} updateInsurance={updateInsurance} />}

          {step === 2 && (
            <Step3
              data={form.medicalHistory}
              updateMedical={updateMedical}
              toggleCondition={toggleCondition}
            />
          )}

          {step === 3 && <Step4 data={form.consent} errors={errors} updateConsent={updateConsent} />}

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t border-slate-200 p-4 z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-dental-500 text-white font-semibold hover:bg-dental-600 transition shadow-lg shadow-dental-500/20"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-dental-500 text-white font-semibold hover:bg-dental-600 transition shadow-lg shadow-dental-500/20 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Form
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step Components ────────────────────────────────────── */

function InputField({
  label,
  id,
  value,
  onChange,
  error,
  type = 'text',
  placeholder = '',
  required = false,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:ring-red-200 bg-red-50'
            : 'border-slate-300 focus:ring-dental-200 focus:border-dental-400 bg-white'
        }`}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Step1({
  data,
  errors,
  updatePersonal,
  updateAddress,
}: {
  data: FormData['personalInfo'];
  errors: Record<string, string>;
  updatePersonal: (f: string, v: string) => void;
  updateAddress: (f: string, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500 mt-1">Please provide your basic contact details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          id="firstName"
          value={data.firstName}
          onChange={(v) => updatePersonal('firstName', v)}
          error={errors.firstName}
          required
        />
        <InputField
          label="Last Name"
          id="lastName"
          value={data.lastName}
          onChange={(v) => updatePersonal('lastName', v)}
          error={errors.lastName}
          required
        />
      </div>

      <InputField
        label="Date of Birth"
        id="dob"
        type="date"
        value={data.dateOfBirth}
        onChange={(v) => updatePersonal('dateOfBirth', v)}
        error={errors.dateOfBirth}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Phone"
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(v) => updatePersonal('phone', v)}
          error={errors.phone}
          placeholder="(702) 555-0123"
          required
        />
        <InputField
          label="Email"
          id="email"
          type="email"
          value={data.email}
          onChange={(v) => updatePersonal('email', v)}
          error={errors.email}
          placeholder="you@email.com"
          required
        />
      </div>

      <hr className="border-slate-100" />

      <InputField
        label="Street Address"
        id="street"
        value={data.address.street}
        onChange={(v) => updateAddress('street', v)}
        error={errors['address.street']}
        required
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <InputField
          label="City"
          id="city"
          value={data.address.city}
          onChange={(v) => updateAddress('city', v)}
          error={errors['address.city']}
          required
        />
        <InputField
          label="State"
          id="state"
          value={data.address.state}
          onChange={(v) => updateAddress('state', v)}
          error={errors['address.state']}
          required
        />
        <InputField
          label="ZIP"
          id="zip"
          value={data.address.zip}
          onChange={(v) => updateAddress('zip', v)}
          error={errors['address.zip']}
          required
        />
      </div>
    </div>
  );
}

function Step2({
  data,
  updateInsurance,
}: {
  data: FormData['insuranceInfo'];
  updateInsurance: (f: string, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Insurance Information</h2>
        <p className="text-sm text-slate-500 mt-1">Optional — leave blank if self-pay.</p>
      </div>

      <InputField
        label="Insurance Provider"
        id="provider"
        value={data.provider}
        onChange={(v) => updateInsurance('provider', v)}
        placeholder="e.g. Delta Dental, Cigna"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Member ID"
          id="memberId"
          value={data.memberId}
          onChange={(v) => updateInsurance('memberId', v)}
          placeholder="Member ID #"
        />
        <InputField
          label="Group Number"
          id="groupNumber"
          value={data.groupNumber}
          onChange={(v) => updateInsurance('groupNumber', v)}
          placeholder="Group #"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">Don&apos;t have your insurance card handy?</p>
        <p>No worries — you can bring it to your appointment and we&apos;ll update your file then.</p>
      </div>
    </div>
  );
}

function Step3({
  data,
  updateMedical,
  toggleCondition,
}: {
  data: FormData['medicalHistory'];
  updateMedical: (f: string, v: string | string[]) => void;
  toggleCondition: (c: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Medical History</h2>
        <p className="text-sm text-slate-500 mt-1">Check any conditions that apply to you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
        {MEDICAL_CONDITIONS.map((c) => (
          <label
            key={c}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition text-sm ${
              data.conditions.includes(c) ? 'bg-dental-50 text-dental-800' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <input
              type="checkbox"
              checked={data.conditions.includes(c)}
              onChange={() => toggleCondition(c)}
              className="w-4 h-4 rounded border-slate-300 text-dental-500 focus:ring-dental-300 cursor-pointer"
            />
            {c}
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Medications</label>
        <textarea
          value={data.medications}
          onChange={(e) => updateMedical('medications', e.target.value)}
          placeholder="List current medications and dosages..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-dental-200 focus:border-dental-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Allergies</label>
        <textarea
          value={data.allergies}
          onChange={(e) => updateMedical('allergies', e.target.value)}
          placeholder="List any known allergies (medications, latex, etc.)..."
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-dental-200 focus:border-dental-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Previous Dental Surgeries</label>
        <textarea
          value={data.dentalSurgeries}
          onChange={(e) => updateMedical('dentalSurgeries', e.target.value)}
          placeholder="Describe any past dental surgeries or procedures..."
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-dental-200 focus:border-dental-400 resize-none"
        />
      </div>
    </div>
  );
}

function Step4({
  data,
  errors,
  updateConsent,
}: {
  data: FormData['consent'];
  errors: Record<string, string>;
  updateConsent: (f: string, v: boolean | string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Consent &amp; Authorization</h2>
        <p className="text-sm text-slate-500 mt-1">Please review and acknowledge the following.</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 max-h-40 overflow-y-auto leading-relaxed">
        <p className="font-semibold text-sm text-slate-800 mb-2">HIPAA Notice of Privacy Practices</p>
        <p>
          This practice is committed to protecting your health information. Under HIPAA, you have the right to
          access, amend, and request restrictions on the use and disclosure of your protected health information
          (PHI). Your PHI will only be used for treatment, payment, and healthcare operations unless otherwise
          authorized by you. We maintain administrative, technical, and physical safeguards to protect the
          confidentiality, integrity, and availability of your information. By acknowledging below, you confirm
          that you have been informed of our privacy practices and your rights under HIPAA.
        </p>
      </div>

      <label
        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
          errors.hipaaAcknowledged
            ? 'border-red-300 bg-red-50'
            : data.hipaaAcknowledged
            ? 'border-dental-300 bg-dental-50'
            : 'border-slate-200 hover:bg-slate-50'
        }`}
      >
        <input
          type="checkbox"
          checked={data.hipaaAcknowledged}
          onChange={(e) => updateConsent('hipaaAcknowledged', e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-dental-500 focus:ring-dental-300 mt-0.5 cursor-pointer flex-shrink-0"
        />
        <div>
          <p className="text-sm font-medium text-slate-800">HIPAA Acknowledgment</p>
          <p className="text-xs text-slate-500 mt-0.5">
            I acknowledge that I have been informed of the practice&apos;s Notice of Privacy Practices.
          </p>
        </div>
      </label>

      <label
        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
          errors.treatmentConsent
            ? 'border-red-300 bg-red-50'
            : data.treatmentConsent
            ? 'border-dental-300 bg-dental-50'
            : 'border-slate-200 hover:bg-slate-50'
        }`}
      >
        <input
          type="checkbox"
          checked={data.treatmentConsent}
          onChange={(e) => updateConsent('treatmentConsent', e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-dental-500 focus:ring-dental-300 mt-0.5 cursor-pointer flex-shrink-0"
        />
        <div>
          <p className="text-sm font-medium text-slate-800">Treatment Consent</p>
          <p className="text-xs text-slate-500 mt-0.5">
            I consent to dental examination and treatment as recommended by the dental team.
          </p>
        </div>
      </label>

      <hr className="border-slate-100" />

      <div>
        <label htmlFor="sig" className="block text-sm font-medium text-slate-700 mb-1.5">
          Typed Signature <span className="text-red-400">*</span>
        </label>
        <input
          id="sig"
          type="text"
          value={data.signatureText}
          onChange={(e) => updateConsent('signatureText', e.target.value)}
          placeholder="Type your full legal name"
          className={`w-full px-4 py-3 rounded-xl border text-sm italic font-serif transition focus:outline-none focus:ring-2 ${
            errors.signatureText
              ? 'border-red-300 focus:ring-red-200 bg-red-50'
              : 'border-slate-300 focus:ring-dental-200 focus:border-dental-400'
          }`}
        />
        {errors.signatureText && <p className="text-xs text-red-500 mt-1">{errors.signatureText}</p>}
      </div>

      <div>
        <label htmlFor="sigDate" className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
        <input
          id="sigDate"
          type="date"
          value={data.signatureDate}
          onChange={(e) => updateConsent('signatureDate', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-dental-200 focus:border-dental-400"
        />
      </div>
    </div>
  );
}