import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export function useRewards() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: rewards, isLoading: loadingRewards } = useQuery({
        queryKey: ['rewards', user?.id],
        queryFn: async () => {
            return apiFetch('/api/rewards');
        },
        enabled: !!user,
    });

    const { data: achievements, isLoading: loadingAchievements } = useQuery({
        queryKey: ['achievements', user?.id],
        queryFn: async () => {
            return apiFetch('/api/rewards/achievements');
        },
        enabled: !!user,
    });

    const { data: lifeScore, isLoading: loadingScore } = useQuery({
        queryKey: ['life-score', user?.id],
        queryFn: async () => {
            return apiFetch('/api/rewards/score');
        },
        enabled: !!user,
    });

    const createReward = useMutation({
        mutationFn: async (data: any) => {
            return apiFetch('/api/rewards', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
        },
    });

    const deleteReward = useMutation({
        mutationFn: async (id: string) => {
            return apiFetch(`/api/rewards/${id}`, {
                method: 'DELETE',
            });
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
