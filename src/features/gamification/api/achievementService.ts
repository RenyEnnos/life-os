import { supabase } from '@/shared/api/supabase';
import type { Achievement, UserAchievement } from './types';
import { toast } from 'react-hot-toast';

export interface AchievementWithStatus extends Achievement {
    unlocked: boolean;
    unlockedAt?: string;
}

/**
 * Fetches all achievements from the database.
 */
export async function getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('xp_reward', { ascending: true });

    if (error) throw error;
    return data as Achievement[];
}

/**
 * Fetches achievements with user's unlock status.
 */
export async function getAchievementsWithStatus(userId: string): Promise<AchievementWithStatus[]> {
    const [achievements, userAchievements] = await Promise.all([
        getAchievements(),
        getUserAchievements(userId)
    ]);

    const unlockedMap = new Map(
        userAchievements.map(ua => [ua.achievement_id, ua.unlocked_at])
    );

    return achievements.map(a => ({
        ...a,
        unlocked: unlockedMap.has(a.id),
        unlockedAt: unlockedMap.get(a.id)
    }));
}

/**
 * Fetches user's unlocked achievements.
 */
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data as UserAchievement[];
}

/**
 * Unlocks an achievement for a user.
 */
export async function unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
    const { error } = await supabase
        .from('user_achievements')
        .insert({ user_id: userId, achievement_id: achievementId });

    if (error) {
        // Likely duplicate, ignore
        if (error.code === '23505') return false;
        throw error;
    }
    return true;
}

interface UserStats {
    tasksCompleted: number;
    habitsLogged: number;
    journalEntries: number;
    level: number;
    streak: number;
}

/**
 * Fetches user stats for achievement condition checking.
 */
async function getUserStats(userId: string): Promise<UserStats> {
    const [tasks, habits, journal, xp] = await Promise.all([
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('completed', true),
        supabase.from('habit_logs').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('user_xp').select('level').eq('user_id', userId).single()
    ]);

    return {
        tasksCompleted: tasks.count || 0,
        habitsLogged: habits.count || 0,
        journalEntries: journal.count || 0,
        level: xp.data?.level || 1,
        streak: 0 // TODO: Implement streak tracking
    };
}

/**
 * Checks and unlocks any achievements the user qualifies for.
 * Returns newly unlocked achievements.
 */
export async function checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const [allAchievements, userAchievements, stats] = await Promise.all([
        getAchievements(),
        getUserAchievements(userId),
        getUserStats(userId)
    ]);

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id));
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of allAchievements) {
        if (unlockedIds.has(achievement.id)) continue; // Already unlocked

        let qualifies = false;

        switch (achievement.condition_type) {
            case 'count':
                // Check based on slug prefix
                if (achievement.slug.includes('task') || achievement.slug === 'first-steps' || achievement.slug === 'centurion') {
                    qualifies = stats.tasksCompleted >= achievement.condition_value;
                } else if (achievement.slug.includes('habit')) {
                    qualifies = stats.habitsLogged >= achievement.condition_value;
                } else if (achievement.slug.includes('journal') || achievement.slug.includes('reflection') || achievement.slug.includes('mindful')) {
                    qualifies = stats.journalEntries >= achievement.condition_value;
                }
                break;
            case 'level':
                qualifies = stats.level >= achievement.condition_value;
                break;
            case 'streak':
                qualifies = stats.streak >= achievement.condition_value;
                break;
        }

        if (qualifies) {
            const unlocked = await unlockAchievement(userId, achievement.id);
            if (unlocked) {
                newlyUnlocked.push(achievement);
            }
        }
    }

    return newlyUnlocked;
}

/**
 * Shows toast notifications for newly unlocked achievements.
 */
export function notifyAchievementUnlock(achievements: Achievement[]) {
    for (const achievement of achievements) {
        toast.success(
            `🏆 Achievement Unlocked: ${achievement.name}! (+${achievement.xp_reward} XP)`,
            {
                duration: 5000,
                style: {
                    background: '#1a1a2e',
                    color: '#fff',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                }
            }
        );
    }
}
