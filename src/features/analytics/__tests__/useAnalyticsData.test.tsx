import { renderHook, waitFor } from '@testing-library/react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { healthApi } from '@/features/health/api/health.api';
import { habitsApi } from '@/features/habits/api/habits.api';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUseAuth = vi.fn();

vi.mock('@/features/health/api/health.api', () => ({
    healthApi: { listMetrics: vi.fn() },
}));

vi.mock('@/features/habits/api/habits.api', () => ({
    habitsApi: { list: vi.fn(), getLogs: vi.fn() },
}));

vi.mock('@/features/tasks/api/tasks.api', () => ({
    tasksApi: { getAll: vi.fn() },
}));

vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: (...args: any[]) => mockUseAuth(...args),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAnalyticsData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        mockUseAuth.mockReturnValue({ user: { id: 'user-123' } });
    });

    it('fetches and aggregates analytics data', async () => {
        vi.mocked(healthApi.listMetrics).mockResolvedValue([
            { recorded_date: '2025-01-15T10:00:00Z', value: 8 },
        ] as any);
        vi.mocked(tasksApi.getAll).mockResolvedValue([
            { status: 'completed', completed_at: '2025-01-15T12:00:00Z' },
        ] as any);
        vi.mocked(habitsApi.list).mockResolvedValue([{ id: 'h1' }] as any);
        vi.mocked(habitsApi.getLogs).mockResolvedValue([
            { date: '2025-01-15' },
        ] as any);

        const { result } = renderHook(() => useAnalyticsData(30), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toBeDefined();
        expect(result.current.data!.length).toBeGreaterThan(0);
        expect(healthApi.listMetrics).toHaveBeenCalled();
        expect(tasksApi.getAll).toHaveBeenCalled();
    });

    it('returns undefined data when no user', async () => {
        mockUseAuth.mockReturnValue({ user: null });

        const { result } = renderHook(() => useAnalyticsData(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toBeUndefined();
    });

    it('handles empty health metrics gracefully', async () => {
        vi.mocked(healthApi.listMetrics).mockResolvedValue([]);
        vi.mocked(tasksApi.getAll).mockResolvedValue([]);
        vi.mocked(habitsApi.list).mockResolvedValue([]);
        vi.mocked(habitsApi.getLogs).mockResolvedValue([]);

        const { result } = renderHook(() => useAnalyticsData(5), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toBeDefined();
        expect(result.current.data!.length).toBe(5);
    });
});
