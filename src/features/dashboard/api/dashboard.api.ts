import { apiClient } from '@/shared/api/http';
import { LifeScore } from '@/shared/types';

export type DashboardSummary = {
    lifeScore: LifeScore;
    habitConsistency: { percentage: number; weeklyData: number[] };
    vitalLoad: { totalImpact: number; state: 'balanced' | 'overloaded' | 'underloaded'; label: string };
    widgets: Record<string, unknown>;
};

export const dashboardApi = {
    getSummary: async (): Promise<DashboardSummary> => {
        return apiClient.get<DashboardSummary>('/api/dashboard/summary');
    },
};
