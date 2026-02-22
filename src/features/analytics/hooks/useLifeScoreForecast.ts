import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { apiFetch } from '@/shared/api/http';

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

            const data = await apiFetch<any[]>('/api/predictive/forecast');

            // Map backend data to frontend interface
            return data.map(p => ({
                date: p.date,
                score: p.score,
                lifeScore: p.score, // Backend 'score' is already 0-100 Life Score logic
                isForecast: p.isForecast
            }));
        },
        enabled: !!user?.id
    });
}
