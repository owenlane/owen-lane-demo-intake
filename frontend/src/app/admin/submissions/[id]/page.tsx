'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSubmissionById, updateSubmissionStatus } from '@/lib/api';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

const STATUS_META: Record<
  string,
  { label: string; pill: string; dot: string; activeBtn: string; idleBtn: string }
> = {
  new: {
    label: 'New',
    pill: 'border-white/10 bg-white/5 text-steel-50',
    dot: 'bg-red-600',
    activeBtn: 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20',
    idleBtn: 'bg-obsidian-950/30 text-steel-200 border-white/10 hover:bg-white/5 hover:border-white/15',
  },
  reviewed: {
    label: 'Reviewed',
    pill: 'border-white/10 bg-white/5 text-steel-50',
    dot: 'bg-amber-400',
    activeBtn: 'bg-white/10 text-steel-50 border-white/15',
    idleBtn: 'bg-obsidian-950/30 text-steel-200 border-white/10 hover:bg-white/5 hover:border-white/15',
  },
  completed: {
    label: 'Completed',
    pill: 'border-white/10 bg-white/5 text-steel-50',
    dot: 'bg-emerald-400',
    activeBtn: 'bg-white/10 text-steel-50 border-white/15',
    idleBtn: 'bg-obsidian-950/30 text-steel-200 border-white/10 hover:bg-white/5 hover:border-white/15',
  },
};

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function fetchOne() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await getSubmissionById(token, id);
      setData(res);
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes('Authentication') || msg.includes('401')) {
        router.push('/admin/login');
        return;
      }
      setError(msg || 'Failed to load submission');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (id) fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function setStatus(status: 'new' | 'reviewed' | 'completed') {
    if (!data?.id) return;
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await updateSubmissionStatus(token, data.id, status);
      setData((prev: any) => ({ ...prev, ...res.submission }));
    } catch (err: any) {
      setError(err?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  const p = data?.patients;
  const payload = data?.json_payload;
  const currentStatus = (data?.status || 'new') as 'new' | 'reviewed' | 'completed';
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.new;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-zinc-900">
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] w-[760px] h-[760px] rounded-full bg-red-700/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-obsidian-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/submissions')}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              title="Back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 text-steel-50" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-steel-50" />
            </div>

            <div>
              <h1 className="font-display text-base font-bold text-steel-50 leading-tight">
                Submission Detail
              </h1>
              <p className="text-[11px] text-steel-200/70">Bright Smile Dental</p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border ${statusMeta.pill}`}>
            <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
            {statusMeta.label}
          </span>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-obsidian-900/70 backdrop-blur-xl p-10 text-steel-200/70 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading submission...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-redlux-500/30 bg-redlux-500/10 backdrop-blur-xl p-6 text-redlux-500 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-semibold">Error</div>
              <div className="text-sm text-redlux-200/80">{error}</div>
              <button
                onClick={fetchOne}
                type="button"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !data ? (
          <div className="rounded-2xl border border-white/10 bg-obsidian-900/70 backdrop-blur-xl p-10 text-steel-200/70">
            Submission not found.
          </div>
        ) : (
          <>
            {/* Patient Card */}
            <div className="rounded-2xl border border-white/10 bg-obsidian-900/70 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)] p-6">
              <h2 className="font-display text-lg font-bold text-steel-50 mb-4">Patient</h2>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-steel-200/40 mt-0.5" />
                  <div>
                    <div className="text-steel-200/60 text-xs">Name</div>
                    <div className="font-semibold text-steel-50">
                      {p?.first_name} {p?.last_name}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-steel-200/40 mt-0.5" />
                  <div>
                    <div className="text-steel-200/60 text-xs">Email</div>
                    <div className="font-semibold text-steel-50 break-all">{p?.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-steel-200/40 mt-0.5" />
                  <div>
                    <div className="text-steel-200/60 text-xs">Phone</div>
                    <div className="font-semibold text-steel-50">{p?.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-steel-200/40 mt-0.5" />
                  <div>
                    <div className="text-steel-200/60 text-xs">DOB</div>
                    <div className="font-semibold text-steel-50">{p?.date_of_birth}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-steel-200/40 mt-0.5" />
                  <div>
                    <div className="text-steel-200/60 text-xs">Address</div>
                    <div className="font-semibold text-steel-50">
                      {p?.address_street}, {p?.address_city}, {p?.address_state} {p?.address_zip}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Controls */}
            <div className="rounded-2xl border border-white/10 bg-obsidian-900/70 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)] p-6">
              <h2 className="font-display text-lg font-bold text-steel-50 mb-2">Workflow</h2>
              <p className="text-sm text-steel-200/70 mb-4">Update the status as your team reviews the form.</p>

              <div className="flex flex-wrap gap-2">
                {(['new', 'reviewed', 'completed'] as const).map((s) => {
                  const meta = STATUS_META[s] || STATUS_META.new;
                  const isActive = data.status === s;

                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      disabled={saving || isActive}
                      className={[
                        'px-4 py-2 rounded-xl text-sm font-semibold transition border',
                        isActive ? meta.activeBtn : meta.idleBtn,
                        saving ? 'opacity-70' : '',
                      ].join(' ')}
                    >
                      {saving && !isActive ? 'Updating...' : meta.label}
                    </button>
                  );
                })}
              </div>

              {saving && (
                <div className="mt-3 text-sm text-steel-200/70 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving status...
                </div>
              )}
            </div>

            {/* Form Summary (your upgraded block kept) */}
            <div className="rounded-2xl border border-white/10 bg-obsidian-900/70 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)] p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-steel-50">Form Summary</h2>
                  <p className="text-sm text-steel-200/70">
                    A clean snapshot of what the patient submitted.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-obsidian-950/40 px-3 py-1 text-xs text-steel-200">
                  <CheckCircle2 className="h-4 w-4 text-redlux-500" />
                  Stored in Supabase
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Consent */}
                <div className="rounded-xl border border-white/10 bg-obsidian-950/35 p-4">
                  <p className="text-xs uppercase tracking-wider text-steel-200/70 mb-3">Consent</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-steel-200/80">HIPAA acknowledged</span>
                      <span
                        className={[
                          'text-xs font-semibold px-2.5 py-1 rounded-lg border',
                          payload?.consent?.hipaaAcknowledged
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                            : 'border-redlux-500/30 bg-redlux-500/10 text-redlux-200',
                        ].join(' ')}
                      >
                        {payload?.consent?.hipaaAcknowledged ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-steel-200/80">Treatment consent</span>
                      <span
                        className={[
                          'text-xs font-semibold px-2.5 py-1 rounded-lg border',
                          payload?.consent?.treatmentConsent
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                            : 'border-redlux-500/30 bg-redlux-500/10 text-redlux-200',
                        ].join(' ')}
                      >
                        {payload?.consent?.treatmentConsent ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-steel-200/80">Signature</span>
                      <span className="font-semibold text-steel-50 truncate max-w-[60%]">
                        {payload?.consent?.signatureText || '—'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-steel-200/80">Signature date</span>
                      <span className="font-semibold text-steel-50">
                        {payload?.consent?.signatureDate || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical */}
                <div className="rounded-xl border border-white/10 bg-obsidian-950/35 p-4">
                  <p className="text-xs uppercase tracking-wider text-steel-200/70 mb-3">Medical</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-steel-200/70 mb-1.5">Conditions</p>
                      {Array.isArray(payload?.medicalHistory?.conditions) &&
                      payload.medicalHistory.conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {payload.medicalHistory.conditions.map((c: string) => (
                            <span
                              key={c}
                              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-steel-200/70">None selected</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-white/10 bg-obsidian-950/30 p-3">
                        <p className="text-xs text-steel-200/70 mb-1">Medications</p>
                        <p className="text-sm text-steel-50 whitespace-pre-wrap break-words">
                          {payload?.medicalHistory?.medications || '—'}
                        </p>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-obsidian-950/30 p-3">
                        <p className="text-xs text-steel-200/70 mb-1">Allergies</p>
                        <p className="text-sm text-steel-50 whitespace-pre-wrap break-words">
                          {payload?.medicalHistory?.allergies || '—'}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-obsidian-950/30 p-3">
                      <p className="text-xs text-steel-200/70 mb-1">Previous dental surgeries</p>
                      <p className="text-sm text-steel-50 whitespace-pre-wrap break-words">
                        {payload?.medicalHistory?.dentalSurgeries || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <details className="mt-5 rounded-xl border border-white/10 bg-obsidian-950/25 p-4">
                <summary className="cursor-pointer text-sm font-medium text-steel-200 hover:text-steel-50 select-none">
                  View raw JSON
                </summary>
                <pre className="mt-3 text-xs rounded-xl border border-white/10 bg-obsidian-950/50 p-4 overflow-auto text-steel-200">
{JSON.stringify(payload, null, 2)}
                </pre>
              </details>
            </div>
          </>
        )}
      </main>
    </div>
  );
}