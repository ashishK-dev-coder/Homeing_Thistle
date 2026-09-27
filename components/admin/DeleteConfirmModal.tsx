'use client';

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useAdminTheme } from '@/lib/adminThemeContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Catalog Purge"
      maxWidth="sm"
    >
      <div className="space-y-4 font-sans">
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl text-xs border ${
            isDark
              ? 'bg-rose-950/50 border-rose-900/70 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <span className="leading-relaxed">
            Permanent action. This piece and all associated specifications will be removed from the catalog.
          </span>
        </div>

        <p
          className={`text-sm leading-relaxed ${
            isDark ? 'text-stone-300' : 'text-stone-700'
          }`}
        >
          Are you sure you wish to delete{' '}
          <strong
            className={`font-semibold ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}
          >
            &ldquo;{productName}&rdquo;
          </strong>?
        </p>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
              isDark
                ? 'border-[#33332e] text-stone-300 hover:text-white'
                : 'border-stone-300 text-stone-700 hover:text-stone-950'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Purging...' : 'Delete Piece'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
