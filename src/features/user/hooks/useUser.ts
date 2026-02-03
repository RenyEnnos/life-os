import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userApi } from '../api/user.api';

export function useUser() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['user', user?.id],
        queryFn: () => userApi.getMe(),
        enabled: !!user,
    });

    const updatePreferences = useMutation({
        mutationFn: (preferences: Record<string, unknown>) => userApi.updatePreferences(preferences),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    return {
        userProfile,
        isLoading,
        updatePreferences,
    };
}
