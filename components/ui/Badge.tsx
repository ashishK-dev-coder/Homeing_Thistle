import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'accent' | 'success' | 'outline' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-stone-900 text-stone-50 border-transparent',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    accent: 'bg-[#586357]/10 text-[#424c41] border-[#586357]/20',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    outline: 'bg-transparent text-stone-700 border-stone-300',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors tracking-wide ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
}
