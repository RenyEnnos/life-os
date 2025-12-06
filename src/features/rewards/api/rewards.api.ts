import { supabase } from '@/shared/api/supabase';

export const rewardsApi = {
    getUserScore: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // If not found, return default (mocked empty state for now instead of inserting) or insert secure defaults if safe.
        // For security, let's just return a default if not found.
        return data || { current_xp: 0, level: 1 };
    },

    getUnlockedAchievements: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_achievements')
            .select('*, achievement:achievements(*)')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    },

    // MOCKED/DISABLED for Security Constraints (Logic moved to DB Triggers)
    addXp: async (userId: string, amount: number) => {
        console.warn('XP addition is now handled by Database Triggers for security.');
        return null;
    },

    checkAndUnlockAchievement: async (userId: string, achievementCode: string) => {
        console.warn('Achievement unlocking is now handled by Database Triggers for security.');
        return null;
    }
};
