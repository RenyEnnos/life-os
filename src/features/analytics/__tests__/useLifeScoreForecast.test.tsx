import { renderHook, waitFor } from '@testing-library/react';
import { useLifeScoreForecast } from '../hooks/useLifeScoreForecast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUseAuth = vi.fn();

vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: (...args: any[]) => mockUseAuth(...args),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useLifeScoreForecast', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        mockUseAuth.mockReturnValue({ user: { id: 'user-123' } });
    });

    it('returns empty forecast data for authenticated user', async () => {
        const { result } = renderHook(() => useLifeScoreForecast(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual([]);
    });

    it('returns undefined data when no user', async () => {
        mockUseAuth.mockReturnValue({ user: null });

        const { result } = renderHook(() => useLifeScoreForecast(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toBeUndefined();
    });

    it('has successful dataUpdatedAt', async () => {
        const { result } = renderHook(() => useLifeScoreForecast(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
    });
});
