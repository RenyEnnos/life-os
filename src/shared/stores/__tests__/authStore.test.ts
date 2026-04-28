import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';

vi.mock('../storage', () => ({
  indexedDBStorage: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      error: null,
      _hasHydrated: false,
    });
  });

  it('has correct default values', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('setAuth updates session and user, clears error', () => {
    const mockSession = {
      user: { id: 'user-1', email: 'test@test.com' },
      access_token: 'token',
    } as any;

    useAuthStore.getState().setAuth(mockSession);
    const state = useAuthStore.getState();
    expect(state.session).toBe(mockSession);
    expect(state.user).toEqual({ id: 'user-1', email: 'test@test.com' });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setAuth with null clears user and session', () => {
    useAuthStore.getState().setAuth(null);
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
  });

  it('setError sets error and clears loading', () => {
    useAuthStore.getState().setError('Something went wrong');
    expect(useAuthStore.getState().error).toBe('Something went wrong');
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('setLoading updates loading state', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('signOut clears all auth state', () => {
    const mockSession = { user: { id: 'u1' } } as any;
    useAuthStore.getState().setAuth(mockSession);
    useAuthStore.getState().setProfile({ id: 'profile-1' } as any);

    useAuthStore.getState().signOut();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setHasHydrated updates hydration flag', () => {
    useAuthStore.getState().setHasHydrated(true);
    expect(useAuthStore.getState()._hasHydrated).toBe(true);
  });
});
