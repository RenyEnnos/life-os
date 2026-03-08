import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { useAuthStore } from '@/shared/stores/authStore';
import { useShallow } from 'zustand/react/shallow';
import { clearAuthToken } from "@/shared/api/authToken";

interface AuthContextValue {
  user: ReturnType<typeof useAuth>['user'];
  session: ReturnType<typeof useAuth>['session'];
  profile: ReturnType<typeof useAuth>['profile'];
  isLoading: boolean;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  error: string | null;
  login: (creds: { email: string; password: string }) => Promise<void>;
  register: (creds: { email: string; password: string; name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAuth, setProfile, setLoading, setError, signOut } = useAuthStore(
    useShallow((s) => ({
      setAuth: s.setAuth,
      setProfile: s.setProfile,
      setLoading: s.setLoading,
      setError: s.setError,
      signOut: s.signOut,
    }))
  );

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') throw error;

      if (error?.code === 'PGRST205' || (!data && error?.code === 'PGRST116')) {
        setProfile({
          id: userId,
          full_name: 'Usuário',
          nickname: 'Usuário',
          theme: 'dark',
          onboarding_completed: false
        });
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setAuth(session);
        if (session?.user) {
          // setAuthToken removed
          await fetchProfile(session.user.id);
        }
      } catch (err: unknown) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setAuth(session);
        if (session?.user) {
          // setAuthToken removed
          await fetchProfile(session.user.id);
        } else {
          clearAuthToken();
        }
        if (_event === 'SIGNED_OUT') {
          signOut();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, setProfile, setLoading, setError, signOut]);

  const authValues = useAuth();

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user, session, profile, isLoading, error, signOut } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      session: s.session,
      profile: s.profile,
      isLoading: s.isLoading,
      error: s.error,
      signOut: s.signOut,
    }))
  );

  const login = async (creds: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword(creds);
    if (error) throw error;
  };

  const register = async (creds: { email: string; password: string; name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email: creds.email,
      password: creds.password,
      options: {
        data: {
          full_name: creds.name,
        },
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
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
