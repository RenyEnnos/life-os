import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { useAuthStore } from '@/shared/stores/authStore';

const AuthContext = createContext<null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAuth, setLoading, setError, signOut } = useAuthStore();

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setAuth(session);
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
      (_event, session) => {
        setAuth(session);
        if (_event === 'SIGNED_OUT') {
          signOut();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, setLoading, setError, signOut]);

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user, session, isLoading, error, signOut } = useAuthStore();

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

  return {
    user,
    session,
    isLoading,
    loading: isLoading, // Compatibility
    error,
    login,
    register,
    logout,
  };
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
