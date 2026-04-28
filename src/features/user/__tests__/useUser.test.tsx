import { renderHook } from '@testing-library/react';
import { useUser } from '../hooks/useUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUseAuth = vi.fn();

vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: (...args: any[]) => mockUseAuth(...args),
}));

vi.mock('@/features/user/api/user.api', () => ({
    userApi: {
        getStoredPreferences: vi.fn().mockReturnValue({}),
        updatePreferences: vi.fn().mockResolvedValue({}),
    },
}));

vi.mock('@/shared/stores/themeStore', () => ({
    useThemeStore: {
        getState: vi.fn().mockReturnValue({ setTheme: vi.fn() }),
    },
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: {
                id: 'user-123',
                email: 'test@example.com',
                user_metadata: { full_name: 'Test User' },
                created_at: '2025-01-01T00:00:00Z',
            },
            profile: { full_name: 'Test User', theme: 'dark' },
            loading: false,
        });
    });

    it('returns user profile from auth context', () => {
        const { result } = renderHook(() => useUser(), { wrapper });

        expect(result.current.userProfile).not.toBeNull();
        expect(result.current.userProfile?.id).toBe('user-123');
        expect(result.current.userProfile?.email).toBe('test@example.com');
    });

    it('returns null profile when no user', () => {
        mockUseAuth.mockReturnValue({ user: null, profile: null, loading: false });

        const { result } = renderHook(() => useUser(), { wrapper });
        expect(result.current.userProfile).toBeNull();
    });

    it('is not loading when auth is loaded', () => {
        const { result } = renderHook(() => useUser(), { wrapper });
        expect(result.current.isLoading).toBe(false);
    });

    it('exposes updatePreferences mutation', () => {
        const { result } = renderHook(() => useUser(), { wrapper });
        expect(result.current.updatePreferences).toBeDefined();
        expect(typeof result.current.updatePreferences.mutate).toBe('function');
    });
});
