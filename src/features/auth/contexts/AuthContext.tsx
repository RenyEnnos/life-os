import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  // Use null as initial state, not mock data, to allow proper loading state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to hydrate from localStorage first (for immediate offline support)
    const cachedUser = localStorage.getItem('auth_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        // We assume if we have a user, we are not loading. 
        // The network verification happens in background.
      } catch { }
    }

    // Check active sessions via API (verifying the cookie)
    authApi.verify()
      .then((user) => {
        setUser(user);
        // Persist fresh user data
        localStorage.setItem('auth_user', JSON.stringify(user));
        setLoading(false);
      })
      .catch((err) => {
        // If verify fails, user is not logged in OR offline
        // If offline (network error), we keep the cached user if we have one

        const msg = err.message || '';
        // Check for specific auth errors (401/403) to clear cache
        if (msg.includes('Access token required') || msg.includes('Invalid token') || msg.includes('status 401') || msg.includes('status 403')) {
          setUser(null);
          localStorage.removeItem('auth_user');
        } else {
          // Network error or other. Keep cached user if exists.
          console.log('Auth verification failed (likely offline), using cache if available');
        }
        setLoading(false);
      });
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      // response.user is the user object
      // response.token is available but we rely on cookie.
      // We can optionally store it in memory or localStorage if we need it for non-cookie auth (e.g. websockets?)
      // But for now, just user.
      if (response?.user) {
        setUser(response.user as User);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authApi.register(credentials);
      if (response?.user) {
        setUser(response.user as User);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('auth_user');
      setLoading(false);
    }
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
