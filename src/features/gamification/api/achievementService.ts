import { apiClient } from '@/shared/api/http';
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
    const data = await apiClient.get<Achievement[]>('/api/rewards/achievements/full');
    return (data as Achievement[]) || [];
}

/**
 * Fetches achievements with user's unlock status.
 */
export async function getAchievementsWithStatus(userId: string): Promise<AchievementWithStatus[]> {
    void userId;
    const data = await apiClient.get<AchievementWithStatus[]>('/api/rewards/achievements/full');
    return data || [];
}

/**
 * Fetches user's unlocked achievements.
 */
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
    void userId;
    const data = await apiClient.get<UserAchievement[]>('/api/rewards/achievements');
    return data as UserAchievement[] || [];
}

/**
 * Unlocks an achievement for a user.
 */
export async function unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
    void userId;
    void achievementId;
    console.warn('unlockAchievement is handled server-side; call backend endpoints instead.');
    return false;
}

/**
 * Checks and unlocks any achievements the user qualifies for.
 * Returns newly unlocked achievements.
 */
export async function checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    void userId;
    console.warn('Achievement unlocking logic is handled server-side.');
    return [];
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
