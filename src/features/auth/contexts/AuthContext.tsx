import React, { createContext, useContext, useEffect } from 'react';
import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/shared/stores/authStore';
import { useShallow } from 'zustand/react/shallow';
import { ApiError } from '@/shared/api/ApiError';
import { clearAuthToken, setAuthToken } from '@/shared/api/authToken';
import type { UserProfile } from '@/shared/types/profile';

interface AuthContextValue {
  user: ReturnType<typeof useAuth>['user'];
  session: ReturnType<typeof useAuth>['session'];
  profile: ReturnType<typeof useAuth>['profile'];
  isLoading: boolean;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  error: string | null;
  login: (creds: { email: string; password: string }) => Promise<void>;
  register: (creds: { email: string; password: string; name?: string; inviteCode?: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAuth, setProfile, setLoading, setError } = useAuthStore(
    useShallow((s) => ({
      setAuth: s.setAuth,
      setProfile: s.setProfile,
      setLoading: s.setLoading,
      setError: s.setError,
    }))
  );

  const getDefaultProfile = (userId: string): UserProfile => ({
    id: userId,
    full_name: 'Usuário',
    nickname: 'Usuário',
    is_invited_partner: false,
    theme: 'dark',
    onboarding_completed: false,
  });

  const fetchProfile = async (userId: string) => {
    try {
      const profile = await authApi.getProfile(userId);
      setProfile(profile ?? getDefaultProfile(userId));
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(getDefaultProfile(userId));
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { session, profile } = await authApi.checkSession();
        setError(null);
        setAuth(session);
        if (session?.user) {
          if (profile) {
            setProfile(profile);
          } else {
            await fetchProfile(session.user.id);
          }
        } else {
          clearAuthToken();
        }
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 401) {
          clearAuthToken();
          setAuth(null);
          setProfile(null);
          setError(null);
        } else {
          console.error('Auth initialization error:', err);
          setError(err instanceof Error ? err.message : 'Failed to initialize session');
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setAuth, setProfile, setLoading, setError]);

  const authValues = useAuth();

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user, session, profile, isLoading, error, setAuth, setProfile, setLoading, setError, clearAuthState } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      session: s.session,
      profile: s.profile,
      isLoading: s.isLoading,
      error: s.error,
      setAuth: s.setAuth,
      setProfile: s.setProfile,
      setLoading: s.setLoading,
      setError: s.setError,
      clearAuthState: s.signOut,
    }))
  );

  const getDefaultProfile = (userId: string): UserProfile => ({
    id: userId,
    full_name: 'Usuário',
    nickname: 'Usuário',
    is_invited_partner: false,
    theme: 'dark',
    onboarding_completed: false,
  });

  const login = async (creds: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.login(creds);
      setAuthToken(result.token ?? result.session?.access_token ?? null);
      setAuth(result.session);
      if (result.session?.user?.id) {
        setProfile(result.profile ?? getDefaultProfile(result.session.user.id));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (creds: { email: string; password: string; name?: string; inviteCode?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.register({
        email: creds.email,
        password: creds.password,
        name: creds.name ?? '',
        inviteCode: creds.inviteCode ?? '',
      });
      setAuthToken(result.token ?? result.session?.access_token ?? null);
      setAuth(result.session);
      if (result.session?.user?.id) {
        setProfile(result.profile ?? getDefaultProfile(result.session.user.id));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    clearAuthToken();
    clearAuthState();
  };

  const resetPassword = async (email: string) => {
    await authApi.resetPassword(email, `${window.location.origin}/reset-password`);
  };

  const updatePassword = async (password: string) => {
    const result = await authApi.updatePassword(password);
    setAuthToken(result.token ?? result.session?.access_token ?? null);
    setAuth(result.session);
    if (result.session?.user?.id) {
      setProfile(result.profile ?? getDefaultProfile(result.session.user.id));
    }
  };

  return {
    user,
    session,
    profile,
    isLoading,
    loading: isLoading, // Compatibility
    hasCompletedOnboarding: profile?.onboarding_completed || false,
    error,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
  };
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
