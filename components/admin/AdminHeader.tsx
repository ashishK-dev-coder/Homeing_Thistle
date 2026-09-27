'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Plus, Eye, Database, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useAdminTheme } from '@/lib/adminThemeContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenSidebar: () => void;
  action?: {
    label: string;
    href: string;
  };
}

export function AdminHeader({
  title,
  subtitle,
  onOpenSidebar,
  action,
}: AdminHeaderProps) {
  const { isDemoMode } = useAuth();
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-30 px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between font-sans transition-colors duration-200 border-b backdrop-blur-md ${
        isDark
          ? 'bg-[#121211]/95 border-[#262624] text-white shadow-xs'
          : 'bg-white/95 border-stone-200 text-stone-900 shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          aria-label="Open navigation sidebar"
          className={`p-2 rounded-xl lg:hidden transition-colors ${
            isDark
              ? 'text-stone-300 hover:text-white hover:bg-[#1f1f1d]'
              : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1
            className={`text-base sm:text-xl font-sans font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-xs mt-0.5 font-normal ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* LIGHT & DARK DUAL SEGMENTED TOGGLE IN NAVBAR */}
        <div
          role="group"
          aria-label="Theme selector"
          className={`flex items-center p-1 rounded-xl border transition-colors ${
            isDark
              ? 'bg-[#181816] border-[#2e2e2a]'
              : 'bg-stone-100 border-stone-200'
          }`}
        >
          <button
            type="button"
            onClick={() => !isDark || toggleTheme()}
            title="Switch to Clean Light Mode"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isDark
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200/80 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-600 fill-amber-500/20' : 'text-stone-400'}`} />
            <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Light</span>
          </button>

          <button
            type="button"
            onClick={() => isDark || toggleTheme()}
            title="Switch to Dark Mode"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isDark
                ? 'bg-[#272724] text-amber-300 shadow-xs border border-[#383834] font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400 fill-amber-400/20' : 'text-stone-500'}`} />
            <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Dark</span>
          </button>
        </div>

        {/* Database indicator */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono border ${
            isDark
              ? 'bg-[#181816] text-stone-300 border-[#2a2a27]'
              : 'bg-stone-50 text-stone-600 border-stone-200'
          }`}
        >
          <Database className="w-3 h-3 text-amber-500" />
          <span>{isDemoMode ? 'Local Storage' : 'Supabase Live'}</span>
        </div>

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            isDark
              ? 'text-stone-300 hover:text-white border-[#2e2e2a] hover:bg-[#1a1a18]'
              : 'text-stone-700 hover:text-stone-950 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-stone-400" />
          <span>View Site</span>
        </Link>

        {/* Primary Action CTA */}
        {action && (
          <Link
            href={action.href}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
              isDark
                ? 'text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-amber-400/10'
                : 'text-white bg-stone-900 hover:bg-stone-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{action.label}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
