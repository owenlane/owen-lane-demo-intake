'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CLIENT } from '@/lib/client';
import { adminLogin } from '@/lib/api';
import { Lock, LogIn, Loader2 } from 'lucide-react';

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
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-lg font-bold text-steel-50 leading-tight">
              {CLIENT.name}
            </h1>
            <p className="text-xs text-steel-200/80">
              {CLIENT.intakeTitle}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-steel-50">Admin Login</h2>
          <p className="text-steel-200/80 text-sm mt-2">
            Secure access for internal staff
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-black/10 shadow-sm p-6 space-y-4">
          {error && (
            <div className="p-3 bg-dental-100 border border-redlux-500/20 rounded-xl text-sm text-redlux-500">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-steel-50 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-steel-50 text-sm focus:outline-none focus:ring-2 focus:ring-redlux-500/15 focus:border-redlux-500/40"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-steel-50 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-steel-50 text-sm focus:outline-none focus:ring-2 focus:ring-redlux-500/15 focus:border-redlux-500/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-redlux-500 text-white font-semibold hover:bg-redlux-600 transition shadow-sm disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-steel-200/70 mt-6 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Secure, encrypted connection
        </p>
      </div>
    </div>
  );
}