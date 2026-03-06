import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';
import { indexedDBStorage } from './storage';
import type { UserProfile } from '@/shared/types/profile';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean; // Flag para controle de reidratação
  setAuth: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (state: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      error: null,
      _hasHydrated: false,
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
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      signOut: () => set({ user: null, session: null, profile: null, isLoading: false, error: null }),
    }),
    {
      name: 'life-os-auth',
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Erro ao reidratar authStore:", error);
          }
          if (state) {
            state.setHasHydrated(true);
            state.setLoading(false);
          } else {
            setTimeout(() => {
              useAuthStore.getState().setHasHydrated(true);
              useAuthStore.getState().setLoading(false);
            }, 0);
          }
        };
      },
    }
  )
);
