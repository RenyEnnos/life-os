import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { rewardsApi } from '../api/rewards.api';
import type { Reward, Achievement, LifeScore } from '@/shared/types';

export function useRewards() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: rewards, isLoading: loadingRewards } = useQuery<Reward[]>({
        queryKey: ['rewards', user?.id],
        queryFn: async () => [], // Mocking empty rewards list safely
        enabled: !!user,
    });

    const { data: achievements, isLoading: loadingAchievements } = useQuery<Achievement[]>({
        queryKey: ['achievements', user?.id],
        queryFn: async () => rewardsApi.getUnlockedAchievements(user!.id),
        enabled: !!user,
    });

    const { data: lifeScore, isLoading: loadingScore } = useQuery<LifeScore>({
        queryKey: ['life-score', user?.id],
        queryFn: async () => rewardsApi.getUserScore(user!.id),
        enabled: !!user,
    });

    // MOCKED/DISABLED for Security Constraints
    const createReward = useMutation({
        mutationFn: async (data: Partial<Reward>) => {
            console.warn('Creating rewards is disabled for security');
            return null;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
        },
    });

    const deleteReward = useMutation({
        mutationFn: async (id: string) => {
            console.warn('Deleting rewards is disabled for security');
            return null;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
        },
    });

    return {
        rewards,
        achievements,
        lifeScore,
        isLoading: loadingRewards || loadingAchievements || loadingScore,
        createReward,
        deleteReward,
    };
}
