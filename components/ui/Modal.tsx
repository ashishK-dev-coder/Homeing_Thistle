'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAdminTheme } from '@/lib/adminThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  dark?: boolean;
}

function useIsDark(darkProp?: boolean): boolean {
  if (darkProp !== undefined) return darkProp;
  try {
    const { isDark } = useAdminTheme();
    return isDark;
  } catch {
    return false;
  }
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  dark,
}: ModalProps) {
  const isDark = useIsDark(dark);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses} rounded-2xl shadow-2xl p-6 md:p-8 z-10 transition-all transform duration-200 overflow-hidden border ${
          isDark
            ? 'bg-[#151514] border-[#2e2e2a] text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                {title}
              </h3>
            )}
            {description && (
              <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-stone-400 hover:text-white hover:bg-[#22221f]'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
