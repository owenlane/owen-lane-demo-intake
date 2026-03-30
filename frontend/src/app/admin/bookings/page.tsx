'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone,
  Mail,
  CalendarDays,
  RefreshCcw,
} from 'lucide-react';

const STATUS_META: Record<string, string> = {
  new: 'bg-blue-50 border-blue-200 text-blue-700',
  contacted: 'bg-violet-50 border-violet-200 text-violet-700',
  scheduled: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  cancelled: 'bg-slate-100 border-slate-300 text-slate-700',
};

const STATUS_OPTIONS = ['new', 'contacted', 'scheduled', 'cancelled'] as const;

function buildApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  return `${base}${path}`;
}

export default function BookingRequestsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  async function fetchBookings() {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(buildApiUrl('/api/bookings'), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to fetch bookings');
      }

      setBookings(Array.isArray(json?.bookings) ? json.bookings : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    setError('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(buildApiUrl(`/api/bookings/${id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to update booking');
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: json.booking.status } : b))
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to update booking');
    } finally {
      setSavingId('');
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      newCount: bookings.filter((b) => b.status === 'new').length,
      contactedCount: bookings.filter((b) => b.status === 'contacted').length,
      scheduledCount: bookings.filter((b) => b.status === 'scheduled').length,
      cancelledCount: bookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Booking Requests
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Booking Pipeline
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              New requests before they become scheduled patient flow.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <Card label="Total" value={String(stats.total)} />
          <Card label="New" value={String(stats.newCount)} />
          <Card label="Contacted" value={String(stats.contactedCount)} />
          <Card label="Scheduled" value={String(stats.scheduledCount)} />
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold">All Booking Requests</h2>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-slate-500">Loading booking requests...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">No booking requests yet.</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {bookings.map((booking) => {
                const fullName =
                  `${booking.first_name || ''} ${booking.last_name || ''}`.trim() || '—';

                return (
                  <div key={booking.id} className="p-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold">{fullName}</h3>
                          <span
                            className={[
                              'inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize',
                              STATUS_META[booking.status] ||
                                'bg-slate-100 border-slate-300 text-slate-700',
                            ].join(' ')}
                          >
                            {String(booking.status || 'unknown').replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {booking.email || '—'}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {booking.phone || '—'}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {booking.preferred_date || 'No date'} / {booking.preferred_time || 'No time'}
                          </span>
                        </div>

                        <div className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-700">Type:</span>{' '}
                          {booking.appointment_type || '—'}
                        </div>

                        <div className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-700">Provider:</span>{' '}
                          {booking.provider || '—'}
                        </div>

                        {booking.notes ? (
                          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            {booking.notes}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((status) => {
                          const isActive = booking.status === status;

                          return (
                            <button
                              key={status}
                              type="button"
                              disabled={savingId === booking.id || isActive}
                              onClick={() => updateStatus(booking.id, status)}
                              className={[
                                'rounded-xl border px-4 py-2 text-sm font-semibold transition',
                                isActive
                                  ? 'bg-slate-900 border-slate-900 text-white'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                              ].join(' ')}
                            >
                              {status === 'contacted'
                                ? 'Contacted'
                                : status === 'scheduled'
                                ? 'Scheduled'
                                : status === 'cancelled'
                                ? 'Cancelled'
                                : 'New'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-bold tracking-tight">{value}</p>
    </div>
  );
}