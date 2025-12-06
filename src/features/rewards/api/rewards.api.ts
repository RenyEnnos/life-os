import { supabase } from '@/shared/api/supabase';
import { UserScore, UserAchievement } from '../types';

export const rewardsApi = {
    getUserScore: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // If report not found, return default (or handle creation elsewhere)
            return { level: 1, current_xp: 0, life_score: 0 };
        }
        return data as UserScore;
    },

    getUnlockedAchievements: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_achievements')
            .select('*, achievement:achievements(*)')
            .eq('user_id', userId);

        if (error) throw error;
        return data as UserAchievement[];
    }
};
