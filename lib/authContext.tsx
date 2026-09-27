'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_KEY = 'homing_thistle_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      // 1. Check Supabase session if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'admin@homingthistle.com',
              name: session.user.user_metadata?.name || 'Studio Director',
              role: 'admin',
            });
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase auth session check failed:', e);
        }
      }

      // 2. Check local simulated demo admin session
      try {
        const stored = localStorage.getItem(DEMO_ADMIN_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) {
            setUser(parsed);
          }
        }
      } catch (e) {
        console.warn('Local session check failed:', e);
      }

      setIsLoading(false);
    }

    initAuth();

    // Listen to Supabase auth state change if active
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'admin@homingthistle.com',
            name: session.user.user_metadata?.name || 'Studio Director',
            role: 'admin',
          });
        } else {
          // If no supabase session, fallback to local if present
          const stored = localStorage.getItem(DEMO_ADMIN_KEY);
          if (!stored) {
            setUser(null);
          }
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // If Supabase configured, attempt real Supabase sign-in
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          // If Supabase returns error, let's also allow demo credentials fallback for convenience
          if (email.toLowerCase() === 'admin@homingthistle.com' && password === 'admin123') {
            const demoUser: AdminUser = {
              id: 'demo-admin-id',
              email: 'admin@homingthistle.com',
              name: 'Studio Director',
              role: 'admin',
            };
            localStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(demoUser));
            setUser(demoUser);
            setIsLoading(false);
            return { success: true };
          }
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'Studio Director',
            role: 'admin',
          });
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase sign-in failed:', err);
      }
    }

    // Demo Authentication check (any valid-looking email or standard demo credentials)
    if (
      (email.toLowerCase() === 'admin@homingthistle.com' && password === 'admin123') ||
      (email.includes('@') && password.length >= 6)
    ) {
      const demoUser: AdminUser = {
        id: 'admin-' + Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()) || 'Studio Director',
        role: 'admin',
      };
      try {
        localStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(demoUser));
      } catch {}
      setUser(demoUser);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: 'Invalid credentials. Please use admin@homingthistle.com and password: admin123',
    };
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign-out failed:', e);
      }
    }
    try {
      localStorage.removeItem(DEMO_ADMIN_KEY);
    } catch {}
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        isDemoMode: !isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
