import { apiFetch } from '@/lib/api';

export const rewardsService = {
    getUserScore: async (userId: string) => {
        return apiFetch(`/rewards/score?userId=${userId}`);
    },

    getUnlockedAchievements: async (userId: string) => {
        return apiFetch(`/rewards/achievements?userId=${userId}`);
    }
};
