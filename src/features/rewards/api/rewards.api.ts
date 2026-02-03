import { apiClient } from '@/shared/api/http';
import type { LifeScore, Achievement, Reward } from '@/shared/types';

export const rewardsApi = {
    getUserScore: async (): Promise<LifeScore> => {
        const data = await apiClient.get<LifeScore>('/api/rewards/score');
        return data;
    },

    getUnlockedAchievements: async (): Promise<Achievement[]> => {
        const data = await apiClient.get<Achievement[]>('/api/rewards/achievements');
        return data || [];
    },

    getAchievementsCatalog: async () => {
        const data = await apiClient.get<Array<Achievement & { unlocked?: boolean; unlockedAt?: string | null }>>('/api/rewards/achievements/full');
        return data || [];
    },

    addXp: async (amount: number) => {
        const data = await apiClient.post<{ success: boolean; current_xp: number; level: number }>('/api/rewards/xp', { amount });
        return data;
    },

    getAll: async (): Promise<Reward[]> => {
        const data = await apiClient.get<Reward[]>('/api/rewards');
        return data || [];
    },

    create: async (reward: Partial<Reward>): Promise<Reward> => {
        const data = await apiClient.post<Reward>('/api/rewards', reward);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete<void>(`/api/rewards/${id}`);
    },
};
