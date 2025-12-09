import { renderHook, waitFor } from '@testing-library/react';
import { useHabits } from '../useHabits';
import { habitsApi } from '../../api/habits.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../api/habits.api', () => ({
    habitsApi: {
        list: vi.fn(),
        create: vi.fn(),
        getLogs: vi.fn(),
        log: vi.fn(),
    },
}));

vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'user-123' } }),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useHabits', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('fetches habits for the user', async () => {
        const mockHabits = [{ id: '1', title: 'Drink Water' }];
        (habitsApi.list as any).mockResolvedValue(mockHabits);
        (habitsApi.getLogs as any).mockResolvedValue([]);

        const { result } = renderHook(() => useHabits(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.habits).toEqual(mockHabits);
        expect(habitsApi.list).toHaveBeenCalledWith('user-123');
    });
});
