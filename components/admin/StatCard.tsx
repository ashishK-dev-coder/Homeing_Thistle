'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useAdminTheme } from '@/lib/adminThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  badge?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  badge,
}: StatCardProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-colors font-sans ${
        isDark
          ? 'bg-[#151514] border-[#262624] hover:border-[#383834] shadow-xs'
          : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-mono uppercase tracking-wider font-semibold ${
            isDark ? 'text-stone-400' : 'text-stone-500'
          }`}
        >
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            isDark
              ? 'bg-[#1e1e1c] text-amber-300 border-[#2e2e2a]'
              : 'bg-stone-100 text-stone-800 border-stone-200'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2.5">
          <span
            className={`text-3xl font-sans font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            {value}
          </span>
          {badge && (
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border ${
                isDark
                  ? 'bg-[#22221f] text-amber-200 border-[#33332e]'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p
            className={`text-xs font-sans mt-1 leading-relaxed ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
