'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CLIENT } from "@/lib/client";
import { getSubmissions, exportCsv } from '@/lib/api';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  LogOut,
  ClipboardList,
  RefreshCcw,
  ArrowUpDown,
  Inbox,
  Clock3,
  CheckCircle2,
  Activity,
} from 'lucide-react';

const STATUS_BADGES: Record<string, string> = {
  new: 'bg-redlux-500/12 border-redlux-500/35 text-steel-50',
  reviewed: 'bg-white/5 border-white/15 text-steel-50',
  completed: 'bg-emerald-500/12 border-emerald-500/30 text-steel-50',
};

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

  const fetchData = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          page: String(page),
          limit: '20',
          order: sortOrder,
        };
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;

        const token = localStorage.getItem('admin_token') || '';
        const res = await getSubmissions(token, params);

        setSubmissions(res.submissions || res.data || []);
        setPagination(res.pagination);
      } catch (err: any) {
        if (String(err?.message || '').includes('Authentication') || String(err?.message || '').includes('401')) {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, sortOrder, router]
  );

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [fetchData, router]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchData(1);
  }

  async function handleExport() {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const token = localStorage.getItem('admin_token') || '';
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
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  }

  const stats = useMemo(() => {
    const totalLoaded = submissions.length;
    const newCount = submissions.filter((s) => String(s.status || '').toLowerCase() === 'new').length;
    const reviewedCount = submissions.filter((s) => String(s.status || '').toLowerCase() === 'reviewed').length;
    const completedCount = submissions.filter((s) => String(s.status || '').toLowerCase() === 'completed').length;

    return { totalLoaded, newCount, reviewedCount, completedCount };
  }, [submissions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-zinc-900">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-red-600/10 blur-3xl opacity-70" />
        <div className="absolute top-[30%] right-[-220px] w-[720px] h-[720px] rounded-full bg-red-700/10 blur-3xl opacity-60" />
        <div className="absolute bottom-[-240px] left-[-160px] w-[720px] h-[720px] rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-obsidian-900/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="font-display text-lg font-bold text-steel-50 leading-tight">
                Submission Command Center
              </h1>
              <div className="space-y-1">
  <p className="text-xs text-steel-200/65 tracking-wide">
    {CLIENT.name}
  </p>
  <p className="text-[11px] uppercase tracking-wider text-steel-200/40">
    {CLIENT.systemProvider}
  </p>
</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-steel-200 hover:bg-white/5 transition border border-white/10 hover:border-white/15"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-10">
        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Inbox className="w-5 h-5 text-steel-50" />}
            label="Loaded Records"
            value={String(stats.totalLoaded)}
            subtext="Current page"
          />
          <StatCard
            icon={<Activity className="w-5 h-5 text-redlux-500" />}
            label="New"
            value={String(stats.newCount)}
            subtext="Needs review"
          />
          <StatCard
            icon={<Clock3 className="w-5 h-5 text-steel-50" />}
            label="Reviewed"
            value={String(stats.reviewedCount)}
            subtext="In workflow"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            label="Completed"
            value={String(stats.completedCount)}
            subtext="Closed out"
          />
        </div>

        {/* Toolbar */}
        <div className="rounded-2xl border border-white/10 bg-obsidian-900/60 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)] p-4 mb-6">
          <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient name or email..."
                className={[
                  'w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition',
                  'bg-obsidian-950/60 text-steel-50 placeholder:text-steel-400',
                  'border-white/10 focus:outline-none focus:ring-2 focus:ring-redlux-500/20 focus:border-white/20',
                ].join(' ')}
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
                  className={[
                    'pl-10 pr-10 py-3 rounded-xl border text-sm transition appearance-none',
                    'bg-obsidian-950/60 text-steel-50',
                    'border-white/10 focus:outline-none focus:ring-2 focus:ring-redlux-500/20 focus:border-white/20',
                  ].join(' ')}
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
                  setTimeout(() => fetchData(1), 0);
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-white/10 text-sm text-steel-200 hover:bg-white/5 hover:border-white/15 transition"
                title="Toggle sort order"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
              </button>

              <button
                type="button"
                onClick={() => fetchData(pagination.page)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-white/10 text-sm text-steel-200 hover:bg-white/5 hover:border-white/15 transition"
                title="Refresh"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Command table */}
        <div className="rounded-3xl border border-white/10 bg-obsidian-900/65 backdrop-blur-2xl shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-steel-50">Patient Submissions</h2>
              <p className="text-sm text-steel-200/65 mt-0.5">
                Review, triage, and move submissions through your workflow.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-steel-200/60">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {pagination.total} total
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80">Patient</th>
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80 hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80">Status</th>
                  <th className="text-left px-5 py-4 font-medium text-steel-200/80 hidden md:table-cell">Submitted</th>
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
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-steel-400">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map((s, index) => {
                    const fullName =
                      `${s.patients?.first_name || ''} ${s.patients?.last_name || ''}`.trim() || '—';
                    const email = s.patients?.email || '—';
                    const statusClass =
                      STATUS_BADGES[String(s.status || '').toLowerCase()] ||
                      'bg-white/5 border-white/10 text-steel-200';

                    return (
                      <tr
                        key={s.id}
                        className={[
                          'border-b border-white/[0.06] transition',
                          'hover:bg-white/[0.035]',
                          index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]',
                        ].join(' ')}
                      >
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-steel-50">{fullName}</span>
                            <span className="text-xs text-steel-200/50 mt-0.5">Record #{String(s.id).slice(0, 8)}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-steel-200/70 hidden sm:table-cell">{email}</td>

                        <td className="px-5 py-4">
                          <span
                            className={[
                              'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border',
                              statusClass,
                            ].join(' ')}
                          >
                            {s.status || 'unknown'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-steel-200/70 hidden md:table-cell">
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/submissions/${s.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition shadow-lg shadow-red-600/20 border border-red-500/30"
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
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 bg-white/[0.02]">
              <p className="text-xs text-steel-200/65">
                {pagination.total} total · Page {pagination.page} of {pagination.totalPages}
              </p>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => fetchData(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-xl hover:bg-white/5 disabled:opacity-30 transition border border-transparent hover:border-white/10"
                >
                  <ChevronLeft className="w-4 h-4 text-steel-200" />
                </button>

                <button
                  type="button"
                  onClick={() => fetchData(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-xl hover:bg-white/5 disabled:opacity-30 transition border border-transparent hover:border-white/10"
                >
                  <ChevronRight className="w-4 h-4 text-steel-200" />
                </button>
              </div>
            </div>
          )}
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
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-obsidian-900/60 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[11px] uppercase tracking-wider text-steel-200/45">{label}</span>
      </div>

      <div className="mt-5">
        <p className="font-display text-3xl font-bold text-steel-50 leading-none">{value}</p>
        <p className="text-xs text-steel-200/60 mt-2">{subtext}</p>
      </div>
    </div>
  );
}