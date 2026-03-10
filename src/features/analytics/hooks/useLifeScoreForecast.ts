import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';

export interface ForecastDataPoint {
    date: string;
    score: number;
    lifeScore: number;
    isForecast: boolean;
}

export function useLifeScoreForecast() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['analytics', 'life-score-forecast', user?.id],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');
            return [] as ForecastDataPoint[];
        },
        enabled: !!user?.id
    });
}
