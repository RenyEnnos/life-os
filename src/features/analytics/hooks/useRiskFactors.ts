import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { apiFetch } from '@/shared/api/http';

export interface RiskFactor {
    factor: string;
    impact: string;
    probability: number;
    suggestion: string;
}

export function useRiskFactors() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['analytics', 'risk-factors', user?.id],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');
            return apiFetch<RiskFactor[]>('/api/predictive/risk-factors');
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 60, // 1 hour - insights don't change that fast
    });
}
