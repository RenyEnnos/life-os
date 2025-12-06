import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/shared/api/supabase';
import { authApi } from '../api/auth.api';
import { LoginRequest, RegisterRequest } from '@/shared/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateThemePreference: (theme: 'light' | 'dark') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'mock-user-id',
    email: 'mock@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  } as User);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginRequest) => {
    await authApi.login(credentials);
  };

  const register = async (credentials: RegisterRequest) => {
    await authApi.register(credentials);
  };

  const logout = async () => {
    await authApi.logout();
  };

  const updateThemePreference = async (theme: 'light' | 'dark') => {
    // Placeholder implementation
    console.log('Updating theme preference to:', theme);
    // In a real app, this would call an API or update Supabase user metadata
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    updateThemePreference,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
