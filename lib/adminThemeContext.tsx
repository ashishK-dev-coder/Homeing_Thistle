'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AdminTheme = 'light' | 'dark';

interface AdminThemeContextType {
  theme: AdminTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'homing_thistle_admin_theme_v2';

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  // Always default to clean, easily readable light mode
  const [theme, setThemeState] = useState<AdminTheme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as AdminTheme | null;
      if (stored === 'dark' || stored === 'light') {
        setThemeState(stored);
      } else {
        setThemeState('light');
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
      }
    } catch {
      setThemeState('light');
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <AdminThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      <div className={isDark ? 'admin-dark' : 'admin-light'}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}

