'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, RefreshCcw } from 'lucide-react';

function buildApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  return `${base}${path}`;
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  async function fetchPatients() {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(buildApiUrl('/api/patients'), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to fetch patients');
      }

      setPatients(Array.isArray(json?.patients) ? json.patients : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return patients;

    return patients.filter((p) =>
      [
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [patients, search]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Patients
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Patient Directory
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Search and open patient records.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPatients}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none"
            />
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold">All Patients</h2>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-slate-500">Loading patients...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">No patients found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Phone</th>
                    <th className="px-6 py-4 text-left">DOB</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-6 py-4 font-semibold">
                        {`${patient.first_name || ''} ${patient.last_name || ''}`.trim() || '—'}
                      </td>
                      <td className="px-6 py-4">{patient.email || '—'}</td>
                      <td className="px-6 py-4">{patient.phone || '—'}</td>
                      <td className="px-6 py-4">{patient.date_of_birth || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/patients/${patient.id}`)}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                        >
                          <Eye className="h-4 w-4" />
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}