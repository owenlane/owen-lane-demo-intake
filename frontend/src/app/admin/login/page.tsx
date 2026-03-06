'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';
import { Lock, LogIn, Loader2, ClipboardList } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      localStorage.setItem('admin_token', res.token);
      router.push('/admin/submissions');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-zinc-900 flex items-center justify-center px-4">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] w-[700px] h-[700px] rounded-full bg-red-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center mb-4">
            <ClipboardList className="w-7 h-7 text-steel-50" />
          </div>
          <h1 className="font-display text-2xl font-bold text-steel-50">Admin Dashboard</h1>
          <p className="text-steel-200/70 text-sm mt-1">Bright Smile Dental</p>
        </div>

        {/* Glass card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-obsidian-900/70 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)] p-6 md:p-7 space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl border border-redlux-500/30 bg-redlux-500/10 text-sm text-redlux-500">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-steel-200 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              required
              className={[
                'w-full px-4 py-3 rounded-xl border text-sm transition',
                'bg-obsidian-950/60 text-steel-50 placeholder:text-steel-400',
                'border-white/10 focus:outline-none focus:ring-2 focus:ring-redlux-500/20 focus:border-white/20',
              ].join(' ')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-steel-200 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={[
                'w-full px-4 py-3 rounded-xl border text-sm transition',
                'bg-obsidian-950/60 text-steel-50 placeholder:text-steel-400',
                'border-white/10 focus:outline-none focus:ring-2 focus:ring-redlux-500/20 focus:border-white/20',
              ].join(' ')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={[
              'w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition',
              'bg-red-600 text-white hover:bg-red-700',
              'shadow-lg shadow-red-600/20 disabled:opacity-60',
              loading ? 'cursor-not-allowed' : '',
            ].join(' ')}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="pt-1">
            <p className="text-center text-xs text-steel-200/60 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Secure, encrypted connection
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
