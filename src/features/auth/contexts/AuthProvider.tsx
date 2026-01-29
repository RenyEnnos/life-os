import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { AuthContext } from './AuthContext';
import { clearAuthToken, setAuthToken } from '@/shared/api/authToken';
import { normalizeEmail, normalizeName } from '@/shared/lib/normalize';
import type { LoginRequest, RegisterRequest, User } from '@/shared/types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
    mutationFn: (creds: LoginRequest) => authApi.login(creds),
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
    mutationFn: (creds: RegisterRequest) => authApi.register(creds),
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

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(['auth_user'], data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
    }
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      logoutMutation.mutate();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const updateThemePreference = useCallback(async (theme: 'light' | 'dark') => {
    await updateProfileMutation.mutateAsync({ theme, preferences: { theme } });
  }, [updateProfileMutation]);

  const login = useCallback(async (creds: LoginRequest) => {
    const normalized = { ...creds, email: normalizeEmail(creds.email) }
    await loginMutation.mutateAsync(normalized);
  }, [loginMutation]);

  const register = useCallback(async (creds: RegisterRequest) => {
    const normalized = { ...creds, email: normalizeEmail(creds.email), name: normalizeName(creds.name) }
    await registerMutation.mutateAsync(normalized);
  }, [registerMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const updateProfile = useCallback(async (data: { name?: string; avatar_url?: string }) => {
    await updateProfileMutation.mutateAsync(data);
  }, [updateProfileMutation]);

  const value = useMemo(() => ({
    user: user || null,
    session: null,
    loading: isLoading || isFetching,
    login,
    register,
    logout,
    updateThemePreference,
    updateProfile,
  }), [user, isLoading, isFetching, login, register, logout, updateThemePreference, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
