import { renderHook, waitFor } from '@testing-library/react';
import { useUserXP } from '../useUserXP';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { LifeScore } from '@/shared/types';

// Mock dependencies
vi.mock('@/features/rewards/api/rewards.api', () => ({
    rewardsApi: {
        getUserScore: vi.fn(),
    },
}));

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

// Mock the auth context
const mockUseAuth = vi.fn();
vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createQueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useUserXP', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the auth mock to return a user by default
        mockUseAuth.mockReturnValue({ user: { id: 'user-123' } });
    });

    it('fetches user XP for the authenticated user', async () => {
        const userXPData = {
            user_id: 'user-123',
            level: 5,
            current_xp: 450,
            next_level_xp: 500,
            life_score: 75,
            attributes: { strength: 10, intelligence: 15 },
            updated_at: '2024-01-01T00:00:00Z',
        } as LifeScore;

        const mockedRewardsApi = vi.mocked(rewardsApi, true);
        mockedRewardsApi.getUserScore.mockResolvedValue(userXPData);

        const { result } = renderHook(() => useUserXP(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.userXP).toEqual(userXPData);
        expect(rewardsApi.getUserScore).toHaveBeenCalledWith();
    });

    it('returns loading state while fetching data', async () => {
        const userXPData = {
            user_id: 'user-123',
            level: 3,
            current_xp: 250,
            next_level_xp: 300,
            life_score: 60,
            attributes: {},
            updated_at: '2024-01-01T00:00:00Z',
        } as LifeScore;

        const mockedRewardsApi = vi.mocked(rewardsApi, true);
        mockedRewardsApi.getUserScore.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(userXPData), 100))
        );

        const { result } = renderHook(() => useUserXP(), { wrapper });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.userXP).toEqual(userXPData);
    });

    it('handles API errors gracefully', async () => {
        const mockedRewardsApi = vi.mocked(rewardsApi, true);
        mockedRewardsApi.getUserScore.mockRejectedValue(new Error('Failed to fetch user XP'));

        const { result } = renderHook(() => useUserXP(), { wrapper });

        // Wait for loading to complete (error state)
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // In error state, userXP might be undefined or the previous cached value
        expect(mockedRewardsApi.getUserScore).toHaveBeenCalledWith();
        expect(result.current.isLoading).toBe(false);
    });

    it('uses cached data on subsequent renders', async () => {
        const userXPData = {
            user_id: 'user-123',
            level: 7,
            current_xp: 650,
            next_level_xp: 700,
            life_score: 80,
            attributes: { agility: 12 },
            updated_at: '2024-01-01T00:00:00Z',
        } as LifeScore;

        const mockedRewardsApi = vi.mocked(rewardsApi, true);
        mockedRewardsApi.getUserScore.mockResolvedValue(userXPData);

        const { result, rerender } = renderHook(() => useUserXP(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(rewardsApi.getUserScore).toHaveBeenCalledTimes(1);
        expect(result.current.userXP).toEqual(userXPData);

        // Rerender should use cached data
        rerender();
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // API should still only be called once due to caching
        expect(rewardsApi.getUserScore).toHaveBeenCalledTimes(1);
        expect(result.current.userXP).toEqual(userXPData);
    });

    it('returns undefined for userXP when no user is authenticated', async () => {
        // Mock the auth context to return no user
        mockUseAuth.mockReturnValue({ user: null });

        const mockedRewardsApi = vi.mocked(rewardsApi, true);

        const { result } = renderHook(() => useUserXP(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // When no user is authenticated, the query is disabled, so userXP should be undefined
        expect(result.current.userXP).toBeUndefined();
        expect(mockedRewardsApi.getUserScore).not.toHaveBeenCalled();
    });

    it('fetches fresh data after cache invalidation', async () => {
        const firstUserXPData = {
            user_id: 'user-123',
            level: 2,
            current_xp: 150,
            next_level_xp: 200,
            life_score: 55,
            attributes: {},
            updated_at: '2024-01-01T00:00:00Z',
        } as LifeScore;

        const secondUserXPData = {
            user_id: 'user-123',
            level: 3,
            current_xp: 200,
            next_level_xp: 300,
            life_score: 60,
            attributes: {},
            updated_at: '2024-01-01T01:00:00Z',
        } as LifeScore;

        const mockedRewardsApi = vi.mocked(rewardsApi, true);
        mockedRewardsApi.getUserScore
            .mockResolvedValueOnce(firstUserXPData)
            .mockResolvedValueOnce(secondUserXPData);

        const queryClient = createQueryClient();
        const customWrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useUserXP(), { wrapper: customWrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.userXP).toEqual(firstUserXPData);
        expect(rewardsApi.getUserScore).toHaveBeenCalledTimes(1);

        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['user_xp', 'user-123'] });

        await waitFor(() => expect(result.current.userXP).toEqual(secondUserXPData));

        expect(rewardsApi.getUserScore).toHaveBeenCalledTimes(2);
    });
});
