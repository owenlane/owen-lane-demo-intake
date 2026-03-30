'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';

function buildApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  return `${base}${path}`;
}

const STATUS_META: Record<string, string> = {
  new: 'bg-blue-50 border-blue-200 text-blue-700',
  contacted: 'bg-violet-50 border-violet-200 text-violet-700',
  scheduled: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  checked_in: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  completed: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  no_show: 'bg-rose-50 border-rose-200 text-rose-700',
  cancelled: 'bg-slate-100 border-slate-300 text-slate-700',
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}

function getWeekDates(baseDate: Date) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  date.setDate(date.getDate() - diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date);
    d.setDate(date.getDate() + i);
    return d;
  });
}

function formatDateKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function AdminCalendarPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    for (const booking of bookings) {
      const key = booking.preferred_date || 'no-date';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(booking);
    }

    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => String(a.preferred_time || '').localeCompare(String(b.preferred_time || '')));
    }

    return grouped;
  }, [bookings]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Calendar Engine Phase 1
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Scheduling Calendar
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Live booking view built from real booking request data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const prev = new Date(currentDate);
                prev.setDate(prev.getDate() - 7);
                setCurrentDate(prev);
              }}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                const next = new Date(currentDate);
                next.setDate(next.getDate() + 7);
                setCurrentDate(next);
              }}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={fetchBookings}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading calendar...
          </div>
        ) : (
          <section className="grid gap-4 lg:grid-cols-7">
            {weekDates.map((date) => {
              const key = formatDateKey(date);
              const items = bookingsByDate[key] || [];

              return (
                <div
                  key={key}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {date.toLocaleDateString([], { weekday: 'short' })}
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="p-3 space-y-3 min-h-[280px]">
                    {items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-3 text-xs text-slate-400">
                        No bookings
                      </div>
                    ) : (
                      items.map((booking) => {
                        const fullName =
                          `${booking.first_name || ''} ${booking.last_name || ''}`.trim() || '—';

                        return (
                          <button
                            key={booking.id}
                            type="button"
                            onClick={() => router.push('/admin/bookings')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-slate-100 transition"
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {booking.preferred_time || 'No time'}
                            </p>
                            <p className="mt-1 text-sm font-bold">{fullName}</p>
                            <p className="mt-1 text-xs text-slate-600">
                              {booking.provider || 'No provider'}
                            </p>
                            <div className="mt-2">
                              <span
                                className={[
                                  'inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize',
                                  STATUS_META[booking.status] ||
                                    'bg-slate-100 border-slate-300 text-slate-700',
                                ].join(' ')}
                              >
                                {formatStatus(booking.status || 'unknown')}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}