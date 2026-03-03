import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { useAuthStore } from '@/shared/stores/authStore';

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAuth, setProfile, setLoading, setError, signOut } = useAuthStore();

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
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setError(err.message || 'Failed to initialize session');
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
          await fetchProfile(session.user.id);
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
  const { user, session, profile, isLoading, error, signOut } = useAuthStore();

  const login = async (creds: { email: string; password: any }) => {
    const { error } = await supabase.auth.signInWithPassword(creds);
    if (error) throw error;
  };

  const register = async (creds: { email: string; password: any; name?: string }) => {
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
