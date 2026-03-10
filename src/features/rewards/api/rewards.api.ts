import { apiClient } from '@/shared/api/http';
import type { LifeScore, Achievement, Reward } from '@/shared/types';

const REWARDS_API_BASE = '/' + 'api/rewards';

export const rewardsApi = {
    getUserScore: async (): Promise<LifeScore> => {
        const data = await apiClient.get<LifeScore>(`${REWARDS_API_BASE}/score`);
        return data;
    },

    getUnlockedAchievements: async (): Promise<Achievement[]> => {
        const data = await apiClient.get<Achievement[]>(`${REWARDS_API_BASE}/achievements`);
        return data || [];
    },

    getAchievementsCatalog: async () => {
        const data = await apiClient.get<Array<Achievement & { unlocked?: boolean; unlockedAt?: string | null }>>(`${REWARDS_API_BASE}/achievements/full`);
        return data || [];
    },

    addXp: async (amount: number) => {
        const data = await apiClient.post<{ success: boolean; current_xp: number; level: number }>(`${REWARDS_API_BASE}/xp`, { amount });
        return data;
    },

    getAll: async (): Promise<Reward[]> => {
        const data = await apiClient.get<Reward[]>(REWARDS_API_BASE);
        return data || [];
    },

    create: async (reward: Partial<Reward>): Promise<Reward> => {
        const data = await apiClient.post<Reward>(REWARDS_API_BASE, reward);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete<void>(`${REWARDS_API_BASE}/${id}`);
    },
};
