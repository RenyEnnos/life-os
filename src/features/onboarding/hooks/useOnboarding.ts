import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { onboardingApi } from '../api/onboarding.api';
import { Onboarding } from '@/shared/types';

export function useOnboarding() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: onboarding,
        isLoading,
        error,
    } = useQuery<Onboarding>({
        queryKey: ['onboarding', user?.id],
        queryFn: async () => {
            return onboardingApi.get();
        },
        enabled: !!user,
        retry: false,
    });

    const createOnboarding = useMutation({
        mutationFn: onboardingApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['onboarding'] });
        },
    });

    const updateOnboarding = useMutation({
        mutationFn: (data: Partial<Onboarding>) => onboardingApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['onboarding'] });
        },
    });

    const updateStepProgress = useMutation({
        mutationFn: ({ step, completed }: { step: string; completed: boolean }) =>
            onboardingApi.updateStepProgress(step, completed),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['onboarding'] });
        },
    });

    return {
        onboarding,
        isLoading,
        error,
        createOnboarding,
        updateOnboarding,
        updateStepProgress,
    };
}
