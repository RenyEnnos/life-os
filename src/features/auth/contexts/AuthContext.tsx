import React, { createContext, useContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { LoginRequest, RegisterRequest, User } from '@/shared/types';
import { clearAuthToken, setAuthToken } from '@/shared/api/authToken';
import { normalizeEmail, normalizeName } from '@/shared/lib/normalize';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateThemePreference: (theme: 'light' | 'dark') => Promise<void>;
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<void>;
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
  const queryClient = useQueryClient();

  // Hydrate initial user from localStorage for immediate feedback
  const getInitialUser = (): User | null => {
    const cached = localStorage.getItem('auth_user');
    return cached ? JSON.parse(cached) : null;
  };

  const { data: user, isLoading, isFetching } = useQuery({
    queryKey: ['auth_user'],
    queryFn: async () => {
      try {
        const user = await authApi.verify();
        localStorage.setItem('auth_user', JSON.stringify(user));
        return user;
      } catch (error) {
        console.warn('[AuthContext] Session verification failed:', error);
        localStorage.removeItem('auth_user');
        clearAuthToken();
        // Return null instead of throwing to avoid error state, allowing UI to show public view
        return null;
      }
    },
    initialData: getInitialUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(['auth_user'], data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
      if (data?.token) {
        setAuthToken(data.token);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(['auth_user'], data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
      if (data?.token) {
        setAuthToken(data.token);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth_user'], null);
      localStorage.removeItem('auth_user');
      clearAuthToken();
      queryClient.clear(); // Clear all data on logout
    },
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      logoutMutation.mutate();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logoutMutation]);

  const updateThemePreference = async (theme: 'light' | 'dark') => {
    await updateProfileMutation.mutateAsync({ theme, preferences: { theme } });
  };

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(['auth_user'], data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
    }
  });

  const value = {
    user: user || null,
    session: null, // Session management is abstracted/cookie-based usually
    loading: isLoading || isFetching,
    login: async (creds: LoginRequest) => { 
      const normalized = { ...creds, email: normalizeEmail(creds.email) }
      await loginMutation.mutateAsync(normalized); 
    },
    register: async (creds: RegisterRequest) => { 
      const normalized = { ...creds, email: normalizeEmail(creds.email), name: normalizeName(creds.name) }
      await registerMutation.mutateAsync(normalized); 
    },
    logout: async () => { await logoutMutation.mutateAsync(); },
    updateThemePreference,
    updateProfile: async (data: { name?: string; avatar_url?: string }) => { await updateProfileMutation.mutateAsync(data); }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
