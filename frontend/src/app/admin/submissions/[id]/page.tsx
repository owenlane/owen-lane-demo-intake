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

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
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
      const res = await getSubmissionById(id);
      setData(res);
    } catch (err: any) {
      if (String(err?.message || '').includes('Authentication') || String(err?.message || '').includes('401')) {
        router.push('/admin/login');
        return;
      }
      setError(err?.message || 'Failed to load submission');
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
      const res = await updateSubmissionStatus(data.id, status);
      // backend returns { message, submission }
      setData((prev: any) => ({ ...prev, ...res.submission }));
    } catch (err: any) {
      setError(err?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  const p = data?.patients;
  const payload = data?.json_payload;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/submissions')}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-dental-500 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-slate-900 leading-tight">Submission Detail</h1>
              <p className="text-[11px] text-slate-500">Bright Smile Dental</p>
            </div>
          </div>

          {data?.status && (
            <span
              className={`inline-block px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                STATUS_BADGE[data.status] || 'bg-slate-100 text-slate-600'
              }`}
            >
              {data.status}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-slate-500 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading submission...
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-6 text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-semibold">Error</div>
              <div className="text-sm">{error}</div>
              <button
                onClick={fetchOne}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !data ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-slate-500">
            Submission not found.
          </div>
        ) : (
          <>
            {/* Patient Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-4">Patient</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">Name</div>
                    <div className="font-semibold text-slate-900">
                      {p?.first_name} {p?.last_name}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">Email</div>
                    <div className="font-semibold text-slate-900">{p?.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">Phone</div>
                    <div className="font-semibold text-slate-900">{p?.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">DOB</div>
                    <div className="font-semibold text-slate-900">{p?.date_of_birth}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs">Address</div>
                    <div className="font-semibold text-slate-900">
                      {p?.address_street}, {p?.address_city}, {p?.address_state} {p?.address_zip}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-2">Workflow</h2>
              <p className="text-sm text-slate-500 mb-4">Update the status as your team reviews the form.</p>

              <div className="flex flex-wrap gap-2">
                {(['new', 'reviewed', 'completed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    disabled={saving || data.status === s}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                      data.status === s
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    } ${saving ? 'opacity-70' : ''}`}
                  >
                    {saving && data.status !== s ? 'Updating...' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {saving && (
                <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving status...
                </div>
              )}
            </div>

            {/* Raw Payload */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-2">Form Payload</h2>
              <p className="text-sm text-slate-500 mb-4">
                This is the exact JSON stored for this submission (useful for debugging + future automation).
              </p>

              <pre className="text-xs bg-slate-900 text-slate-100 rounded-2xl p-4 overflow-auto">
{JSON.stringify(payload, null, 2)}
              </pre>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Saved in Supabase
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}