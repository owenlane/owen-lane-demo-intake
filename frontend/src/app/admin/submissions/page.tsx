'use client';

import { CLIENT } from '@/lib/client';
import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { exportCsv } from '@/lib/api';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  LogOut,
  RefreshCcw,
  ArrowUpDown,
  Inbox,
  Clock3,
  CheckCircle2,
  Activity,
  QrCode,
  ExternalLink,
  CalendarCheck2,
  UserRoundCheck,
  XCircle,
  Ban,
} from 'lucide-react';

const STATUS_META: Record<
  string,
  {
    label: string;
    badge: string;
    statLabel: string;
  }
> = {
  new: {
    label: 'New',
    badge: 'bg-blue-50 border-blue-200 text-blue-700',
    statLabel: 'New',
  },
  contacted: {
    label: 'Contacted',
    badge: 'bg-violet-50 border-violet-200 text-violet-700',
    statLabel: 'Contacted',
  },
  scheduled: {
    label: 'Scheduled',
    badge: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    statLabel: 'Scheduled',
  },
  checked_in: {
    label: 'Checked In',
    badge: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    statLabel: 'Checked In',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    statLabel: 'Completed',
  },
  no_show: {
    label: 'No Show',
    badge: 'bg-rose-50 border-rose-200 text-rose-700',
    statLabel: 'No Show',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-slate-100 border-slate-300 text-slate-700',
    statLabel: 'Cancelled',
  },
};

const STATUS_OPTIONS = [
  'new',
  'contacted',
  'scheduled',
  'checked_in',
  'completed',
  'no_show',
  'cancelled',
] as const;

function formatStatusLabel(status: string) {
  return STATUS_META[status]?.label || status.replace(/_/g, ' ');
}

async function fetchSubmissionsDirect(
  token: string,
  params: Record<string, string> = {}
) {
  const qs = new URLSearchParams(params).toString();
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const url = `${base}/api/admin/submissions${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export default function SubmissionsPage() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [loading, setLoading] = useState(true);
  const [intakeUrl, setIntakeUrl] = useState('');
  const [pageError, setPageError] = useState('');

  const fetchData = useCallback(
    async (page = 1) => {
      setLoading(true);
      setPageError('');

      try {
        const params: Record<string, string> = {
          page: String(page),
          limit: '20',
          order: sortOrder,
        };

        if (search.trim()) params.search = search.trim();
        if (statusFilter) params.status = statusFilter;

        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('admin_token') ||
          '';

        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await fetchSubmissionsDirect(token, params);

        const nextSubmissions = Array.isArray(res?.submissions) ? res.submissions : [];
        const count =
          typeof res?.count === 'number'
            ? res.count
            : Array.isArray(nextSubmissions)
            ? nextSubmissions.length
            : 0;

        const nextPagination = res?.pagination || {
          page,
          limit: 20,
          total: count,
          totalPages: Math.max(1, Math.ceil(count / 20)),
        };

        setSubmissions(nextSubmissions);
        setPagination({
          page: Number(nextPagination.page) || page,
          limit: Number(nextPagination.limit) || 20,
          total: Number(nextPagination.total) || 0,
          totalPages: Number(nextPagination.totalPages) || Math.max(1, Math.ceil(count / 20)),
        });
      } catch (err: any) {
        console.error('Failed to fetch submissions:', err);

        const message = String(err?.message || '');

        if (
          message.includes('Authentication') ||
          message.includes('401') ||
          message.includes('Unauthorized')
        ) {
          router.push('/admin/login');
        } else {
          setPageError(message || 'Failed to load submissions');
          setSubmissions([]);
          setPagination({
            page,
            limit: 20,
            total: 0,
            totalPages: 0,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, sortOrder, router]
  );

  useEffect(() => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('admin_token') ||
      '';

    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchData(1);
  }, [fetchData, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIntakeUrl(`${window.location.origin}/intake`);
    }
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchData(1);
  }

  async function handleExport() {
    try {
      const params: Record<string, string> = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('admin_token') ||
        '';

      const csv = await exportCsv(token, params);

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'submissions.csv';
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  }

  const stats = useMemo(() => {
    const safeSubmissions = Array.isArray(submissions) ? submissions : [];

    const countFor = (status: string) =>
      safeSubmissions.filter((s) => String(s.status || '').toLowerCase() === status).length;

    return {
      totalLoaded: safeSubmissions.length,
      newCount: countFor('new'),
      contactedCount: countFor('contacted'),
      scheduledCount: countFor('scheduled'),
      checkedInCount: countFor('checked_in'),
      completedCount: countFor('completed'),
      noShowCount: countFor('no_show'),
      cancelledCount: countFor('cancelled'),
    };
  }, [submissions]);

  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-steel-50 leading-tight">
              Submission Command Center
            </h1>
            <div className="space-y-1">
              <p className="text-xs text-steel-200/65 tracking-wide">{CLIENT.name}</p>
              <p className="text-[11px] uppercase tracking-wider text-steel-200/40">
                {CLIENT.systemProvider}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-steel-50 border border-black/10 hover:bg-obsidian-900 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-10">
        <div className="rounded-3xl border border-black/10 bg-white overflow-hidden mb-6">
          <div className="border-b border-black/10 bg-obsidian-900 px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-steel-50">
                Practice System Overview
              </h2>
              <p className="text-sm text-steel-200/65 mt-0.5">
                Installed Digital Intake Infrastructure
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
              System Live
            </div>
          </div>

          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="rounded-xl border border-black/10 bg-obsidian-900 p-4">
              <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
                Practice
              </p>
              <p className="text-steel-50 font-semibold">{CLIENT.name}</p>
            </div>

            <div className="rounded-xl border border-black/10 bg-obsidian-900 p-4">
              <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
                System Type
              </p>
              <p className="text-steel-50 font-semibold">Digital Patient Intake</p>
            </div>

            <div className="rounded-xl border border-black/10 bg-obsidian-900 p-4">
              <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
                Notification Email
              </p>
              <p className="text-steel-50 font-semibold break-all">
                lanecamposgroup@gmail.com
              </p>
            </div>

            <div className="rounded-xl border border-black/10 bg-obsidian-900 p-4">
              <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-1">
                System Provider
              </p>
              <p className="text-steel-50 font-semibold">Lane Campos Group</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Inbox className="w-5 h-5 text-steel-50" />}
            label="Loaded Records"
            value={String(stats.totalLoaded)}
            subtext="Current page"
          />
          <StatCard
            icon={<Activity className="w-5 h-5 text-blue-500" />}
            label="New"
            value={String(stats.newCount)}
            subtext="Needs first touch"
          />
          <StatCard
            icon={<UserRoundCheck className="w-5 h-5 text-violet-500" />}
            label="Contacted"
            value={String(stats.contactedCount)}
            subtext="Reached by staff"
          />
          <StatCard
            icon={<CalendarCheck2 className="w-5 h-5 text-cyan-500" />}
            label="Scheduled"
            value={String(stats.scheduledCount)}
            subtext="Appointment booked"
          />
          <StatCard
            icon={<Clock3 className="w-5 h-5 text-indigo-500" />}
            label="Checked In"
            value={String(stats.checkedInCount)}
            subtext="Arrived at office"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            label="Completed"
            value={String(stats.completedCount)}
            subtext="Closed out"
          />
          <StatCard
            icon={<XCircle className="w-5 h-5 text-rose-500" />}
            label="No Show"
            value={String(stats.noShowCount)}
            subtext="Did not arrive"
          />
          <StatCard
            icon={<Ban className="w-5 h-5 text-slate-500" />}
            label="Cancelled"
            value={String(stats.cancelledCount)}
            subtext="Removed from flow"
          />
        </div>

        <div className="rounded-3xl border border-black/10 bg-white overflow-hidden mb-6 print:hidden">
          <div className="border-b border-black/10 bg-obsidian-900 px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-steel-50">
                Patient Intake Access
              </h2>
              <p className="text-sm text-steel-200/65 mt-0.5">
                Patients can scan this code to open the live intake form.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-steel-200/70">
              <QrCode className="w-3.5 h-3.5 text-redlux-500" />
              Front Desk Ready
            </div>
          </div>

          <div className="px-5 py-5 flex flex-col lg:flex-row items-start gap-6">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              {intakeUrl ? (
                <QRCodeSVG
                  value={intakeUrl}
                  size={180}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  includeMargin={true}
                />
              ) : (
                <div className="w-[180px] h-[180px] flex items-center justify-center text-black text-sm">
                  QR unavailable
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="rounded-2xl border border-black/10 bg-obsidian-900 p-4">
                <p className="text-[11px] uppercase tracking-wider text-steel-200/45 mb-2">
                  Intake URL
                </p>
                <p className="text-sm text-steel-50 break-all">
                  {intakeUrl || 'Unavailable on server render'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={intakeUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-steel-50 border border-black/10 text-sm font-semibold hover:bg-obsidian-900 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Intake
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-sm text-steel-200 hover:bg-obsidian-900 transition"
                >
                  <Download className="w-4 h-4" />
                  Print QR
                </button>
              </div>

              <p className="text-xs text-steel-200/50 leading-relaxed">
                Place this at the front desk or waiting room so patients can scan and complete the form on their phone.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 mb-6 print:hidden">
          <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient name or email..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 text-sm transition bg-white text-steel-50 placeholder:text-steel-400 focus:outline-none focus:ring-2 focus:ring-redlux-500/15 focus:border-redlux-500/30"
              />
            </form>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setTimeout(() => fetchData(1), 0);
                  }}
                  className="pl-10 pr-10 py-3 rounded-xl border border-black/10 text-sm transition appearance-none bg-white text-steel-50 focus:outline-none focus:ring-2 focus:ring-redlux-500/15 focus:border-redlux-500/30"
                >
                  <option value="">All Status</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
                  setTimeout(() => fetchData(1), 0);
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-black/10 text-sm text-steel-200 hover:bg-obsidian-900 transition"
                title="Toggle sort order"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
              </button>

              <button
                type="button"
                onClick={() => fetchData(pagination.page)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-black/10 text-sm text-steel-200 hover:bg-obsidian-900 transition"
                title="Refresh"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-redlux-500 text-white text-sm font-semibold hover:bg-redlux-600 transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white overflow-hidden">
          <div className="border-b border-black/10 bg-obsidian-900 px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-steel-50">
                Patient Submissions
              </h2>
              <p className="text-sm text-steel-200/65 mt-0.5">
                Review, triage, and move submissions through your workflow.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-steel-200/60">
              <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1">
                {pagination.total} total
              </span>
            </div>
          </div>

          {pageError ? (
            <div className="m-5 rounded-2xl border border-redlux-500/30 bg-redlux-500/10 p-4 text-sm text-redlux-500">
              {pageError}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-obsidian-900">
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80">Patient</th>
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80 hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80">Status</th>
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80 hidden md:table-cell">
                    Submitted
                  </th>
                  <th className="text-right px-5 py-4 font-medium text-steel-200/80">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-steel-400">
                      Loading...
                    </td>
                  </tr>
                ) : safeSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-steel-400">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  safeSubmissions.map((s, index) => {
                    const fullName =
                      `${s.patients?.first_name || s.first_name || ''} ${
                        s.patients?.last_name || s.last_name || ''
                      }`.trim() || '—';
                    const email = s.patients?.email || s.email || '—';
                    const statusKey = String(s.status || '').toLowerCase();
                    const statusMeta = STATUS_META[statusKey];
                    const statusClass =
                      statusMeta?.badge || 'bg-obsidian-900 border-black/10 text-steel-200';

                    return (
                      <tr
                        key={s.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-obsidian-900'}
                      >
                        <td className="px-5 py-4 border-b border-black/10">
                          <div className="flex flex-col">
                            <span className="font-semibold text-steel-50">{fullName}</span>
                            <span className="text-xs text-steel-200/50 mt-0.5">
                              Record #{String(s.id).slice(0, 8)}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-steel-200/70 hidden sm:table-cell border-b border-black/10">
                          {email}
                        </td>

                        <td className="px-5 py-4 border-b border-black/10">
                          <span
                            className={[
                              'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border',
                              statusClass,
                            ].join(' ')}
                          >
                            {formatStatusLabel(statusKey || 'unknown')}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-steel-200/70 hidden md:table-cell border-b border-black/10">
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}
                        </td>

                        <td className="px-5 py-4 text-right border-b border-black/10">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/submissions/${s.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-redlux-500 hover:bg-redlux-600 transition border border-transparent"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View File
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-black/10 bg-obsidian-900">
              <p className="text-xs text-steel-200/65">
                {pagination.total} total · Page {pagination.page} of {pagination.totalPages}
              </p>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => fetchData(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-xl hover:bg-white disabled:opacity-30 transition border border-transparent"
                >
                  <ChevronLeft className="w-4 h-4 text-steel-200" />
                </button>

                <button
                  type="button"
                  onClick={() => fetchData(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-xl hover:bg-white disabled:opacity-30 transition border border-transparent"
                >
                  <ChevronRight className="w-4 h-4 text-steel-200" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-5 text-center space-y-1 print:hidden">
          <p className="text-[11px] uppercase tracking-wider text-steel-200/35">
            {CLIENT.systemProvider}
          </p>
          <p className="text-[11px] text-steel-200/25">{CLIENT.systemTagline}</p>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-obsidian-900 border border-black/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[11px] uppercase tracking-wider text-steel-200/45">
          {label}
        </span>
      </div>

      <div className="mt-5">
        <p className="font-display text-3xl font-bold text-steel-50 leading-none">
          {value}
        </p>
        <p className="text-xs text-steel-200/60 mt-2">{subtext}</p>
      </div>
    </div>
  );
}