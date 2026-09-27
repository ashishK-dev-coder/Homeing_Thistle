'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/components/ui/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isDemoMode } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast('Welcome back to the Curatorial Dashboard.', 'success');
      router.push('/admin');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@homingthistle.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background subtle noise/glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-stone-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar with back to site */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
          Studio Access v1.0
        </span>
      </div>

      {/* Center login card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-12">
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-8">
          {/* Brand header */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-950 flex items-center justify-center font-serif text-xl font-bold mx-auto shadow-md">
              H
            </div>
            <h1 className="text-2xl font-serif font-medium text-stone-100">
              Curator Portal
            </h1>
            <p className="text-xs text-stone-400 font-light">
              Restricted management console for Homing Thistle products, collections, and archives.
            </p>
          </div>

          {/* Quick Demo Credentials Helper */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Reviewing demo?</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-[11px] font-medium transition-colors"
            >
              Fill Demo Login
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-900 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                Curator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@homingthistle.com"
                className="w-full px-4 py-3 bg-stone-950/80 border border-stone-800 focus:border-stone-500 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-stone-950/80 border border-stone-800 focus:border-stone-500 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-white text-stone-950 text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Atelier'}</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-stone-500 font-mono">
            {isDemoMode
              ? 'Local storage mode active. Connect Supabase anytime via .env.local.'
              : 'Connected to Supabase Authentication.'}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-stone-600 font-mono">
        © {new Date().getFullYear()} Homing Thistle Studio Ltd. Authorized curators only.
      </div>
    </div>
  );
}
