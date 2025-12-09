import React, { createContext, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  // Hydrate initial user from localStorage for immediate feedback
  const getInitialUser = (): User | null => {
    const cached = localStorage.getItem('auth_user');
    return cached ? JSON.parse(cached) : null;
  };

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth_user'],
    queryFn: async () => {
      try {
        const user = await authApi.verify();
        localStorage.setItem('auth_user', JSON.stringify(user));
        return user;
      } catch (error) {
        localStorage.removeItem('auth_user');
        throw error;
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
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(['auth_user'], data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth_user'], null);
      localStorage.removeItem('auth_user');
      queryClient.clear(); // Clear all data on logout
    },
  });

  const updateThemePreference = async (theme: 'light' | 'dark') => {
    console.log('Updating theme preference to:', theme);
  };

  const value = {
    user: user || null,
    session: null, // Session management is abstracted/cookie-based usually
    loading: isLoading,
    login: async (creds: LoginRequest) => { await loginMutation.mutateAsync(creds); },
    register: async (creds: RegisterRequest) => { await registerMutation.mutateAsync(creds); },
    logout: async () => { await logoutMutation.mutateAsync(); },
    updateThemePreference,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
