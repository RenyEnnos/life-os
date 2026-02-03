import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { rewardsApi } from '../api/rewards.api';
import type { Reward, Achievement, LifeScore } from '@/shared/types';

export function useRewards() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: rewards, isLoading: loadingRewards } = useQuery<Reward[]>({
        queryKey: ['rewards', user?.id],
        queryFn: () => rewardsApi.getAll(),
        enabled: !!user,
    });

    const { data: achievements, isLoading: loadingAchievements } = useQuery<Achievement[]>({
        queryKey: ['achievements', user?.id],
        queryFn: () => rewardsApi.getUnlockedAchievements(),
        enabled: !!user,
    });

    const { data: lifeScore, isLoading: loadingScore } = useQuery<LifeScore>({
        queryKey: ['life-score', user?.id],
        queryFn: () => rewardsApi.getUserScore(),
        enabled: !!user,
    });

    const createReward = useMutation({
        mutationFn: (data: Partial<Reward>) => rewardsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
        },
    });

    const deleteReward = useMutation({
        mutationFn: (id: string) => rewardsApi.delete(id),
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
