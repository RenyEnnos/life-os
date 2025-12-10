import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { getUserXP } from '../api/xpService';
import { UserXP } from '../api/types';

export function useUserXP() {
    const { user } = useAuth();

    const { data: userXP, isLoading } = useQuery<UserXP | null>({
        queryKey: ['user_xp', user?.id],
        queryFn: () => getUserXP(user!.id),
        enabled: !!user,
    });

    return {
        userXP,
        isLoading,
    };
}
