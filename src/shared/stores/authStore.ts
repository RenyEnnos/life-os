import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoading: boolean;
  error: string | null;
  setAuth: (session: Session | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  error: null,
  setAuth: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
      error: null,
    }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  signOut: () => set({ user: null, session: null, profile: null, isLoading: false, error: null }),
}));
