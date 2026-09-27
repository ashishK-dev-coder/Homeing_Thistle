'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ExternalLink,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useAdminTheme } from '@/lib/adminThemeContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isDemoMode } = useAuth();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const isDashboardActive = pathname === '/admin';
  const isAddProductActive = pathname === '/admin/products/new';
  const isCatalogActive =
    (pathname === '/admin/products' || pathname.startsWith('/admin/products/')) &&
    !isAddProductActive;
  const isCategoriesActive = pathname === '/admin/categories';

  const navItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      isActive: isDashboardActive,
    },
    {
      label: 'Product Catalog',
      href: '/admin/products',
      icon: Package,
      isActive: isCatalogActive,
    },
    {
      label: 'Add New Piece',
      href: '/admin/products/new',
      icon: PlusCircle,
      isActive: isAddProductActive,
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
      isActive: isCategoriesActive,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col transition-all duration-200 font-sans border-r lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark
            ? 'bg-[#111110] text-stone-200 border-[#262624]'
            : 'bg-white text-stone-800 border-stone-200 shadow-2xs'
        }`}
      >
        {/* Brand header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'border-[#262624]' : 'border-stone-200'
          }`}
        >
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-serif text-sm font-bold shadow-md shadow-amber-400/20">
              HT
            </div>
            <div>
              <span
                className={`font-serif tracking-widest text-sm uppercase font-bold block ${
                  isDark ? 'text-stone-100' : 'text-stone-950'
                }`}
              >
                Homing Thistle
              </span>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider font-medium ${
                  isDark ? 'text-amber-300' : 'text-amber-800'
                }`}
              >
                Atelier Curator Desk
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg lg:hidden ${
              isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode / Persistence Tag */}
        {isDemoMode && (
          <div
            className={`mx-4 mt-4 px-3 py-2 rounded-xl text-xs flex items-center gap-2 border ${
              isDark
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-200'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] font-mono leading-tight">
              Local persistent storage active.
            </span>
          </div>
        )}

        {/* Navigation items */}
        <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          <div
            className={`px-3 pb-2 text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            Catalog Management
          </div>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.isActive
                  ? isDark
                    ? 'bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/30 shadow-xs'
                    : 'bg-stone-900 text-white font-semibold shadow-xs'
                  : isDark
                  ? 'text-stone-300 hover:text-white hover:bg-[#1a1a18]'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 ${
                  item.isActive
                    ? isDark
                      ? 'text-amber-300'
                      : 'text-amber-300'
                    : isDark
                    ? 'text-stone-400'
                    : 'text-stone-500'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          ))}

          <div
            className={`pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            Live Showcase
          </div>
          <Link
            href="/"
            target="_blank"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isDark
                ? 'text-stone-300 hover:text-white hover:bg-[#1a1a18]'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <span className="flex items-center gap-3">
              <ExternalLink
                className={`w-4 h-4 shrink-0 ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}
              />
              <span>Public Website</span>
            </span>
            <span
              className={`text-[10px] font-mono ${
                isDark ? 'text-amber-300/80' : 'text-stone-400'
              }`}
            >
              View
            </span>
          </Link>
        </div>

        {/* User snippet & logout */}
        <div
          className={`p-4 border-t space-y-3 ${
            isDark ? 'bg-[#0d0d0c] border-[#262624]' : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-3 px-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                isDark
                  ? 'bg-[#242422] text-amber-200 border-[#383834]'
                  : 'bg-white text-stone-800 border-stone-300 shadow-2xs'
              }`}
            >
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-semibold truncate ${
                  isDark ? 'text-stone-200' : 'text-stone-900'
                }`}
              >
                {user?.name || 'Studio Director'}
              </p>
              <p
                className={`text-[10px] font-mono truncate ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                {user?.email || 'admin@homingthistle.in'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Atelier</span>
          </button>
        </div>
      </aside>
    </>
  );
}
