import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { rewardsApi } from '@/features/rewards/api/rewards.api';
import type { LifeScore } from '@/shared/types';

export function useUserXP() {
    const { user } = useAuth();

    const { data: userXP, isLoading } = useQuery<LifeScore | null>({
        queryKey: ['user_xp', user?.id],
        queryFn: async () => rewardsApi.getUserScore(),
        enabled: !!user,
    });

    return {
        userXP,
        isLoading,
    };
}
