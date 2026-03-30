'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

function buildApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  return `${base}${path}`;
}

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchPatient() {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(buildApiUrl(`/api/patients/${id}`), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to fetch patient');
      }

      setData(json);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch patient');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-slate-100 p-8 text-sm text-slate-500">Loading patient...</main>;
  }

  if (error || !data) {
    return <main className="min-h-screen bg-slate-100 p-8 text-sm text-red-700">{error || 'Patient not found'}</main>;
  }

  const { patient, submissions, notes, activityLogs } = data;
  const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || '—';

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <button
          type="button"
          onClick={() => router.push('/admin/patients')}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
            <div><span className="font-semibold">Email:</span> {patient.email || '—'}</div>
            <div><span className="font-semibold">Phone:</span> {patient.phone || '—'}</div>
            <div><span className="font-semibold">DOB:</span> {patient.date_of_birth || '—'}</div>
            <div>
              <span className="font-semibold">Address:</span>{' '}
              {[patient.address_street, patient.address_city, patient.address_state, patient.address_zip]
                .filter(Boolean)
                .join(', ') || '—'}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold">Submission History</h2>
            </div>
            <div className="p-6 space-y-3">
              {submissions.length === 0 ? (
                <p className="text-sm text-slate-500">No submissions yet.</p>
              ) : (
                submissions.map((submission: any) => (
                  <div key={submission.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-semibold">{submission.status || '—'}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {submission.created_at ? new Date(submission.created_at).toLocaleString() : '—'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold">Internal Notes</h2>
            </div>
            <div className="p-6 space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-500">No notes yet.</p>
              ) : (
                notes.map((note: any) => (
                  <div key={note.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm">{note.note}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {note.created_at ? new Date(note.created_at).toLocaleString() : '—'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold">Activity Timeline</h2>
            </div>
            <div className="p-6 space-y-3">
              {activityLogs.length === 0 ? (
                <p className="text-sm text-slate-500">No activity yet.</p>
              ) : (
                activityLogs.map((log: any) => (
                  <div key={log.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-semibold">{log.action || '—'}</p>
                    {log.metadata?.note ? (
                      <p className="text-sm mt-2">{log.metadata.note}</p>
                    ) : null}
                    <p className="text-xs text-slate-500 mt-2">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}