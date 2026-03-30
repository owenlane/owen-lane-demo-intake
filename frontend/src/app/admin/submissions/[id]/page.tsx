'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CLIENT } from '@/lib/client';
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
  FileText,
  History,
} from 'lucide-react';

const STATUS_META: Record<
  string,
  { label: string; pill: string; dot: string; activeBtn: string; idleBtn: string }
> = {
  new: {
    label: 'New',
    pill: 'border-blue-200 bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
    activeBtn: 'bg-blue-600 text-white border-blue-600',
    idleBtn: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  },
  contacted: {
    label: 'Contacted',
    pill: 'border-violet-200 bg-violet-50 text-violet-700',
    dot: 'bg-violet-500',
    activeBtn: 'bg-violet-600 text-white border-violet-600',
    idleBtn: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  },
  scheduled: {
    label: 'Scheduled',
    pill: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    dot: 'bg-cyan-500',
    activeBtn: 'bg-cyan-600 text-white border-cyan-600',
    idleBtn: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  },
  checked_in: {
    label: 'Checked In',
    pill: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    dot: 'bg-indigo-500',
    activeBtn: 'bg-indigo-600 text-white border-indigo-600',
    idleBtn: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  },
  completed: {
    label: 'Completed',
    pill: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
    activeBtn: 'bg-emerald-600 text-white border-emerald-600',
    idleBtn: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  },
  no_show: {
    label: 'No Show',
    pill: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
    activeBtn: 'bg-rose-600 text-white border-rose-600',
    idleBtn: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  },
  cancelled: {
    label: 'Cancelled',
    pill: 'border-slate-300 bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
    activeBtn: 'bg-slate-700 text-white border-slate-700',
    idleBtn: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  },
};

const WORKFLOW_ORDER = [
  'new',
  'contacted',
  'scheduled',
  'checked_in',
  'completed',
  'no_show',
  'cancelled',
] as const;

type WorkflowStatus = (typeof WORKFLOW_ORDER)[number];

function normalizeId(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return '';
}

function safeText(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
}

function resolveAddress(patient: any, payload: any): string {
  const directPatientAddress = [
    safeText(patient?.address_street),
    safeText(patient?.address_city),
    safeText(patient?.address_state),
    safeText(patient?.address_zip),
  ].filter(Boolean);

  if (directPatientAddress.length > 0) {
    return directPatientAddress.join(', ');
  }

  if (patient?.address && typeof patient.address === 'object') {
    const nestedPatientAddress = [
      safeText(patient.address.street),
      safeText(patient.address.city),
      safeText(patient.address.state),
      safeText(patient.address.zip),
    ].filter(Boolean);

    if (nestedPatientAddress.length > 0) {
      return nestedPatientAddress.join(', ');
    }
  }

  if (typeof patient?.address === 'string' && patient.address.trim()) {
    return patient.address.trim();
  }

  const payloadAddress = payload?.personalInfo?.address;

  if (payloadAddress && typeof payloadAddress === 'object') {
    const nestedPayloadAddress = [
      safeText(payloadAddress.street),
      safeText(payloadAddress.city),
      safeText(payloadAddress.state),
      safeText(payloadAddress.zip),
    ].filter(Boolean);

    if (nestedPayloadAddress.length > 0) {
      return nestedPayloadAddress.join(', ');
    }
  }

  if (typeof payloadAddress === 'string' && payloadAddress.trim()) {
    return payloadAddress.trim();
  }

  return '—';
}

function buildApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  return `${base}${path}`;
}

function formatActionLabel(action: string) {
  switch (action) {
    case 'note_created':
      return 'Internal Note Added';
    case 'status_updated':
      return 'Status Updated';
    default:
      return action.replace(/_/g, ' ');
  }
}

function formatStatusLabel(status: string) {
  return STATUS_META[status]?.label || status.replace(/_/g, ' ');
}

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = normalizeId(params?.id);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [notes, setNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState('');

  async function fetchOne() {
    if (!id) {
      setError('Invalid submission ID');
      setLoading(false);
      return;
    }

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

  async function fetchNotes(submissionId: string) {
    setNotesLoading(true);
    setNotesError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(
        buildApiUrl(`/api/admin/notes?submission_id=${encodeURIComponent(submissionId)}`),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to fetch notes');
      }

      setNotes(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setNotesError(err?.message || 'Failed to fetch notes');
    } finally {
      setNotesLoading(false);
    }
  }

  async function fetchActivityLogs(submissionId: string) {
    setActivityLoading(true);
    setActivityError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(
        buildApiUrl(`/api/admin/activity-logs?submission_id=${encodeURIComponent(submissionId)}`),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to fetch activity logs');
      }

      setActivityLogs(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setActivityError(err?.message || 'Failed to fetch activity logs');
    } finally {
      setActivityLoading(false);
    }
  }

  async function refreshSupportPanels(submissionId: string) {
    await Promise.all([fetchNotes(submissionId), fetchActivityLogs(submissionId)]);
  }

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (id) {
      fetchOne();
    } else {
      setLoading(false);
      setError('Invalid submission ID');
    }
  }, [id, router]);

  useEffect(() => {
    if (data?.id) {
      refreshSupportPanels(data.id);
    }
  }, [data?.id]);

  async function setStatus(status: WorkflowStatus) {
    if (!data?.id) return;

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await updateSubmissionStatus(token, data.id, status);
      setData((prev: any) => ({ ...prev, ...res.submission }));
      await fetchActivityLogs(data.id);
    } catch (err: any) {
      setError(err?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim() || !data?.id) return;

    setAddingNote(true);
    setNotesError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(buildApiUrl('/api/admin/notes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          submission_id: data.id,
          patient_id: data.patient_id || data?.patients?.id || null,
          note: newNote.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to create note');
      }

      setNewNote('');
      await refreshSupportPanels(data.id);
    } catch (err: any) {
      setNotesError(err?.message || 'Failed to create note');
    } finally {
      setAddingNote(false);
    }
  }

  const p = data?.patients;
  const payload = data?.json_payload;

  const currentStatus = (data?.status || 'new') as WorkflowStatus;
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

  const patientName = useMemo(() => {
    return (
      `${safeText(p?.first_name) || safeText(payload?.personalInfo?.firstName)} ${
        safeText(p?.last_name) || safeText(payload?.personalInfo?.lastName)
      }`.trim() || '—'
    );
  }, [p, payload]);

  const patientEmail = safeText(p?.email) || safeText(payload?.personalInfo?.email) || '—';
  const patientPhone = safeText(p?.phone) || safeText(payload?.personalInfo?.phone) || '—';
  const patientDob =
    safeText(p?.date_of_birth) || safeText(payload?.personalInfo?.dateOfBirth) || '—';
  const patientAddress = resolveAddress(p, payload);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/submissions')}
              className="p-2.5 rounded-2xl border border-black/10 bg-obsidian-900 transition print:hidden"
              title="Back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 text-steel-50" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-obsidian-900 border border-black/10 flex items-center justify-center">
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
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-black/10 bg-obsidian-900 text-steel-200 text-xs font-semibold hover:bg-obsidian-900 transition"
            >
              <Printer className="w-4 h-4" />
              Print Intake
            </button>

            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-semibold capitalize border ${statusMeta.pill}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 print:max-w-none print:px-0 print:py-0">
        {loading ? (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-steel-200/70 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading submission...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-redlux-500/30 bg-redlux-500/10 p-6 text-redlux-500 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-semibold">Error</div>
              <div className="text-sm text-redlux-500/80">{error}</div>
              <button
                onClick={fetchOne}
                type="button"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-redlux-500 text-white text-sm font-semibold hover:bg-redlux-600 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !data ? (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-steel-200/70">
            Submission not found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-4">
                <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
                  Submission ID
                </p>
                <p className="font-mono text-sm text-steel-50 break-all">
                  {data?.id || '—'}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-4">
                <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
                  Submitted
                </p>
                <p className="text-sm text-steel-50">{submittedAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
              <div className="rounded-3xl border border-black/10 bg-white overflow-hidden">
                <div className="border-b border-black/10 bg-obsidian-900 px-6 py-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-steel-50">Patient</h2>
                    <p className="text-sm text-steel-200/65 mt-1">
                      Primary contact and intake identity
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-steel-200/70">
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <InfoTile
                      icon={<User className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="Name"
                      value={patientName}
                    />
                    <InfoTile
                      icon={<Mail className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="Email"
                      value={patientEmail}
                      breakWords
                    />
                    <InfoTile
                      icon={<Phone className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="Phone"
                      value={patientPhone}
                    />
                    <InfoTile
                      icon={<Calendar className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                      label="DOB"
                      value={patientDob}
                    />
                    <div className="sm:col-span-2">
                      <InfoTile
                        icon={<MapPin className="w-5 h-5 text-steel-200/40 mt-0.5" />}
                        label="Address"
                        value={patientAddress}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-black/10 bg-white overflow-hidden print:hidden">
                  <div className="border-b border-black/10 bg-obsidian-900 px-6 py-5">
                    <h2 className="font-display text-xl font-bold text-steel-50">Workflow</h2>
                    <p className="text-sm text-steel-200/65 mt-1">
                      Move this submission through your internal review process.
                    </p>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-4">
                      <p className="text-xs uppercase tracking-wider text-steel-200/55 mb-2">
                        Current Status
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-black/10 bg-white text-sm font-semibold text-steel-50">
                        <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                        {statusMeta.label}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-steel-200/55 mb-3">
                        Update Status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {WORKFLOW_ORDER.map((s) => {
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

                <div className="rounded-3xl border border-black/10 bg-white overflow-hidden print:hidden">
                  <div className="border-b border-black/10 bg-obsidian-900 px-6 py-5 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-steel-50" />
                    <div>
                      <h2 className="font-display text-xl font-bold text-steel-50">Internal Notes</h2>
                      <p className="text-sm text-steel-200/65 mt-1">
                        Private staff notes tied to this submission.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Write internal note..."
                      className="w-full min-h-[120px] rounded-2xl border border-black/10 bg-white p-4 text-sm text-steel-50 placeholder:text-steel-200/45 focus:outline-none focus:ring-2 focus:ring-redlux-500/20"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddNote}
                        disabled={addingNote || !newNote.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-obsidian-900 text-white text-sm font-semibold disabled:opacity-60"
                      >
                        {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {addingNote ? 'Adding Note...' : 'Add Note'}
                      </button>

                      {notesLoading ? (
                        <span className="text-sm text-steel-200/65 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading notes...
                        </span>
                      ) : null}
                    </div>

                    {notesError ? (
                      <div className="rounded-2xl border border-redlux-500/30 bg-redlux-500/10 p-4 text-sm text-redlux-500">
                        {notesError}
                      </div>
                    ) : null}

                    <div className="space-y-3">
                      {notes.length === 0 && !notesLoading ? (
                        <div className="rounded-2xl border border-dashed border-black/10 bg-white p-4 text-sm text-steel-200/65">
                          No notes yet.
                        </div>
                      ) : null}

                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-2xl border border-black/10 bg-white p-4"
                        >
                          <p className="text-sm text-steel-50 whitespace-pre-wrap break-words">
                            {note.note}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-steel-200/60">
                            <span>{note.created_by || 'admin'}</span>
                            <span>•</span>
                            <span>
                              {note.created_at ? new Date(note.created_at).toLocaleString() : '—'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white overflow-hidden print:hidden">
                  <div className="border-b border-black/10 bg-obsidian-900 px-6 py-5 flex items-center gap-2">
                    <History className="w-5 h-5 text-steel-50" />
                    <div>
                      <h2 className="font-display text-xl font-bold text-steel-50">
                        Activity Timeline
                      </h2>
                      <p className="text-sm text-steel-200/65 mt-1">
                        Full action history tied to this submission.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    {activityLoading ? (
                      <div className="text-sm text-steel-200/65 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading activity...
                      </div>
                    ) : null}

                    {activityError ? (
                      <div className="rounded-2xl border border-redlux-500/30 bg-redlux-500/10 p-4 text-sm text-redlux-500">
                        {activityError}
                      </div>
                    ) : null}

                    {activityLogs.length === 0 && !activityLoading ? (
                      <div className="rounded-2xl border border-dashed border-black/10 bg-white p-4 text-sm text-steel-200/65">
                        No activity yet.
                      </div>
                    ) : null}

                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-black/10 bg-white p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-steel-50 capitalize">
                            {formatActionLabel(log.action)}
                          </span>
                          {log.metadata?.new_status ? (
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                STATUS_META[log.metadata.new_status]?.pill ||
                                'border-slate-200 bg-slate-50 text-slate-700'
                              }`}
                            >
                              {formatStatusLabel(log.metadata.new_status)}
                            </span>
                          ) : null}
                        </div>

                        {log.metadata?.note ? (
                          <p className="mt-2 text-sm text-steel-200/80 whitespace-pre-wrap break-words">
                            {log.metadata.note}
                          </p>
                        ) : null}

                        <p className="mt-3 text-xs text-steel-200/60">
                          {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white overflow-hidden">
              <div className="border-b border-black/10 bg-obsidian-900 px-6 py-5 flex items-start justify-between gap-4">
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
                    <SummaryTextRow label="Signature" value={payload?.consent?.signatureText || '—'} />
                    <SummaryTextRow
                      label="Signature date"
                      value={payload?.consent?.signatureDate || '—'}
                    />
                  </div>
                </div>

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
                              className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-steel-200"
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
                <details className="rounded-2xl border border-black/10 bg-white p-4 print:hidden">
                  <summary className="cursor-pointer text-sm font-medium text-steel-200 hover:text-steel-50 select-none">
                    View raw JSON
                  </summary>
                  <pre className="mt-3 text-xs rounded-2xl border border-black/10 bg-obsidian-900 p-4 overflow-auto text-steel-200">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </details>
              </div>
            </div>

            <div className="pt-2 text-center space-y-1 print:hidden">
              <p className="text-[11px] uppercase tracking-wider text-steel-200/35">
                {CLIENT.systemProvider}
              </p>
              <p className="text-[11px] text-steel-200/25">{CLIENT.systemTagline}</p>
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
  icon: ReactNode;
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
          {value || '—'}
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