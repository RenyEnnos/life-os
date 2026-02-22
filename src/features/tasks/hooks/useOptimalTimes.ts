import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/http';

export interface OptimalTimesData {
    peakHour: number | null;
    suggestions: string[];
}

export function useOptimalTimes() {
    return useQuery({
        queryKey: ['tasks', 'optimal-times'],
        queryFn: async () => {
            return apiFetch<OptimalTimesData>('/api/tasks/optimal-times');
        },
        staleTime: 1000 * 60 * 60, // 1 hour - productivity patterns don't change that fast
    });
}
