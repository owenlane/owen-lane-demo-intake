'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CLIENT } from "@/lib/client";
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
  ShieldCheck,
  HeartPulse,
  Printer,
} from 'lucide-react';

const STATUS_META: Record<
  string,
  { label: string; pill: string; dot: string; activeBtn: string; idleBtn: string }
> = {
  new: {
    label: 'New',
    pill: 'border-redlux-500/25 bg-redlux-500/10 text-steel-50',
    dot: 'bg-redlux-500',
    activeBtn: 'bg-redlux-500 text-white border-red-600 shadow-lg shadow-red-600/20',
    idleBtn: 'bg-white text-steel-200 border-black/10 hover:bg-obsidian-900 hover:border-black/10',
  },
  reviewed: {
    label: 'Reviewed',
    pill: 'border-black/10 bg-obsidian-900 text-steel-50',
    dot: 'bg-amber-400',
    activeBtn: 'bg-white/10 text-steel-50 border-black/10 shadow-lg shadow-black/20',
    idleBtn: 'bg-white text-steel-200 border-black/10 hover:bg-obsidian-900 hover:border-black/10',
  },
  completed: {
    label: 'Completed',
    pill: 'border-emerald-500/25 bg-emerald-500/10 text-steel-50',
    dot: 'bg-emerald-400',
    activeBtn: 'bg-emerald-500/15 text-steel-50 border-emerald-500/25 shadow-lg shadow-emerald-500/10',
    idleBtn: 'bg-white text-steel-200 border-black/10 hover:bg-obsidian-900 hover:border-black/10',
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
  const submittedAt = data?.created_at
  ? new Date(data.created_at).toLocaleString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  : '—';

  return (
    <div className="min-h-screen bg-white">
      {/* Ambient glow */}

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
  onClick={() => router.push('/admin/submissions')}
  className="p-2.5 rounded-2xl border border-black/10 bg-obsidian-900 hover:bg-obsidian-900 transition shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] print:hidden"
  title="Back"
  type="button"
>
              <ArrowLeft className="w-5 h-5 text-steel-50" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-black/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <ClipboardList className="w-5 h-5 text-steel-50" />
            </div>

            <div>
              <h1 className="font-display text-lg font-bold text-steel-50 leading-tight">
                Submission Detail
              </h1>
              <div className="space-y-1">
  <p className="text-xs text-steel-200/65 tracking-wide">{CLIENT.name}</p>
  <p className="text-[11px] uppercase tracking-wider text-steel-200/40">
    {CLIENT.systemProvider}
  </p>
</div>
            </div>
          </div>

        <div className="flex items-center gap-2 print:hidden">
<button
  type="button"
  onClick={() => window.print()}
  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-black/10 bg-obsidian-900 text-steel-200 text-xs font-semibold hover:bg-obsidian-900 hover:border-black/10 transition"
>
  <Printer className="w-4 h-4" />
  Print Intake
</button>

<span
  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-semibold capitalize border shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${statusMeta.pill}`}
>
  <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
  {statusMeta.label}
</span>
      </div>
      </div>
    </header>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 print:max-w-none print:px-0 print:py-0">
        {loading ? (
          <div className="rounded-3xl border border-black/10 bg-white backdrop-blur-2xl p-10 text-steel-200/70 flex items-center gap-2 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading submission...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-redlux-500/30 bg-redlux-500/10 backdrop-blur-xl p-6 text-redlux-500 flex items-start gap-3 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)]">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-semibold">Error</div>
              <div className="text-sm text-redlux-200/80">{error}</div>
              <button
                onClick={fetchOne}
                type="button"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-redlux-500 text-white text-sm font-semibold hover:bg-redlux-600 transition shadow-lg shadow-red-600/20"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !data ? (
          <div className="rounded-3xl border border-black/10 bg-white backdrop-blur-xl p-10 text-steel-200/70 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)]">
            Submission not found.
          </div>
        ) : (
          <>
  {/* Audit strip */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="rounded-2xl border border-black/10 bg-obsidian-900/60 backdrop-blur-xl shadow-smp-4">
      <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
        Submission ID
      </p>
      <p className="font-mono text-sm text-steel-50 break-all">
        {data?.id || '—'}
      </p>
    </div>

    <div className="rounded-2xl border border-black/10 bg-obsidian-900/60 backdrop-blur-xl shadow-smp-4">
      <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
        Submitted
      </p>
      <p className="text-sm text-steel-50">
        {submittedAt}
      </p>
    </div>
  </div>

  {/* Top grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
              {/* Patient Card */}
              <div className="rounded-3xl border border-black/10 bg-white backdrop-blur-2xl shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="border-b border-black/10 bg-white/[0.03] px-6 py-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-steel-50">Patient</h2>
                    <p className="text-sm text-steel-200/65 mt-1">Primary contact and intake identity</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 rounded-full border border-black/10 bg-obsidian-900 px-3 py-1.5 text-xs text-steel-200/70">
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <InfoTile
                      icon={<User className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="Name"
                      value={`${p?.first_name || ''} ${p?.last_name || ''}`.trim() || '—'}
                    />
                    <InfoTile
                      icon={<Mail className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="Email"
                      value={p?.email || '—'}
                      breakWords
                    />
                    <InfoTile
                      icon={<Phone className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="Phone"
                      value={p?.phone || '—'}
                    />
                    <InfoTile
                      icon={<Calendar className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="DOB"
                      value={p?.date_of_birth || '—'}
                    />
                    <div className="sm:col-span-2">
                      <InfoTile
                        icon={<MapPin className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                        label="Address"
                        value={
                          [
                            p?.address_street,
                            p?.address_city,
                            p?.address_state,
                            p?.address_zip,
                          ]
                            .filter(Boolean)
                            .join(', ') || '—'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Card */}
              <div className="rounded-3xl border border-black/10 bg-white backdrop-blur-2xl shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] overflow-hidden print:hidden">
                <div className="border-b border-black/10 bg-white/[0.03] px-6 py-5">
                  <h2 className="font-display text-xl font-bold text-steel-50">Workflow</h2>
                  <p className="text-sm text-steel-200/65 mt-1">
                    Move this submission through your internal review process.
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-steel-200/55 mb-2">Current Status</p>
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-black/10 bg-obsidian-900 text-sm font-semibold text-steel-50">
                      <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                      {statusMeta.label}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-steel-200/55 mb-3">Update Status</p>
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
                              'px-4 py-2.5 rounded-2xl text-sm font-semibold transition border',
                              isActive ? meta.activeBtn : meta.idleBtn,
                              saving ? 'opacity-70' : '',
                            ].join(' ')}
                          >
                            {saving && !isActive ? 'Updating...' : meta.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {saving && (
                    <div className="text-sm text-steel-200/70 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving status...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Summary */}
            <div className="rounded-3xl border border-black/10 bg-white backdrop-blur-2xl shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="border-b border-black/10 bg-white/[0.03] px-6 py-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-steel-50">Form Summary</h2>
                  <p className="text-sm text-steel-200/65 mt-1">
                    Clean human-readable breakdown of the submitted intake.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-steel-200/70">
                  <CheckCircle2 className="h-4 w-4 text-redlux-500" />
                  Stored in Supabase
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Consent */}
                <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-redlux-500" />
                    <p className="text-xs uppercase tracking-wider text-steel-200/65">Consent</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <SummaryRow
                      label="HIPAA acknowledged"
                      value={payload?.consent?.hipaaAcknowledged ? 'Yes' : 'No'}
                      positive={!!payload?.consent?.hipaaAcknowledged}
                    />
                    <SummaryRow
                      label="Treatment consent"
                      value={payload?.consent?.treatmentConsent ? 'Yes' : 'No'}
                      positive={!!payload?.consent?.treatmentConsent}
                    />
                    <SummaryTextRow
                      label="Signature"
                      value={payload?.consent?.signatureText || '—'}
                    />
                    <SummaryTextRow
                      label="Signature date"
                      value={payload?.consent?.signatureDate || '—'}
                    />
                  </div>
                </div>

                {/* Medical */}
                <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <HeartPulse className="w-4 h-4 text-redlux-500" />
                    <p className="text-xs uppercase tracking-wider text-steel-200/65">Medical</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-steel-200/65 mb-2">Conditions</p>
                      {Array.isArray(payload?.medicalHistory?.conditions) &&
                      payload.medicalHistory.conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {payload.medicalHistory.conditions.map((c: string) => (
                            <span
                              key={c}
                              className="inline-flex items-center rounded-full border border-black/10 bg-obsidian-900 px-3 py-1 text-xs text-steel-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-steel-200/65">None selected</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SummaryBox
                        label="Medications"
                        value={payload?.medicalHistory?.medications || '—'}
                      />
                      <SummaryBox
                        label="Allergies"
                        value={payload?.medicalHistory?.allergies || '—'}
                      />
                    </div>

                    <SummaryBox
                      label="Previous dental surgeries"
                      value={payload?.medicalHistory?.dentalSurgeries || '—'}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <details className="rounded-2xl border border-black/10 bg-obsidian-950/25 p-4 print:hidden">
                  <summary className="cursor-pointer text-sm font-medium text-steel-200 hover:text-steel-50 select-none">
                    View raw JSON
                  </summary>
                  <pre className="mt-3 text-xs rounded-2xl border border-black/10 bg-obsidian-950/50 p-4 overflow-auto text-steel-200">
{JSON.stringify(payload, null, 2)}
                  </pre>
                </details>
              </div>
                        </div>

            <div className="pt-2 text-center space-y-1 print:hidden">
              <p className="text-[11px] uppercase tracking-wider text-steel-200/35">
                {CLIENT.systemProvider}
              </p>
              <p className="text-[11px] text-steel-200/25">
                {CLIENT.systemTagline}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
  breakWords = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  breakWords?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 flex items-start gap-3">
      {icon}
      <div className="min-w-0">
        <div className="text-steel-200/60 text-xs mb-1">{label}</div>
        <div className={`font-semibold text-steel-50 ${breakWords ? 'break-all' : ''}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-steel-200/80">{label}</span>
      <span
        className={[
          'text-xs font-semibold px-2.5 py-1 rounded-lg border',
          positive
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
            : 'border-redlux-500/30 bg-redlux-500/10 text-redlux-200',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryTextRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-steel-200/80">{label}</span>
      <span className="font-semibold text-steel-50 max-w-[60%] truncate">{value}</span>
    </div>
  );
}

function SummaryBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-3">
      <p className="text-xs text-steel-200/65 mb-1">{label}</p>
      <p className="text-sm text-steel-50 whitespace-pre-wrap break-words">{value}</p>
    </div>
  );
}