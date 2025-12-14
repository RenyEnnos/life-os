import { apiClient } from '@/shared/api/http';
import { AttributeType, UserXP, XPHistoryEntry } from './types';


// Calculate level based on total XP
// Level = floor(sqrt(total_xp / 100))
export const calculateLevel = (totalXp: number): number => {
    if (totalXp < 0) return 1;
    return Math.max(1, Math.floor(Math.sqrt(totalXp / 100)));
};

// Calculate XP needed for next level
// Next Level XP = (Level + 1)^2 * 100
export const calculateNextLevelXp = (currentLevel: number): number => {
    return Math.pow(currentLevel + 1, 2) * 100;
};

export const awardXP = async (
    userId: string,
    amount: number,
    category: AttributeType,
    source: string
): Promise<{ success: boolean; newLevel?: number; error?: any }> => {
    void userId; void category; void source;
    try {
        const res = await apiClient.post<{ success: boolean; current_xp: number; level: number }>('/api/rewards/xp', { amount });
        return { success: res.success, newLevel: res.level };
    } catch (error) {
        console.error('Error awarding XP:', error);
        return { success: false, error };
    }
};
// ... existing code ...

export const getUserXP = async (userId: string): Promise<UserXP | null> => {
    void userId;
    const data = await apiClient.get<{ current_xp: number; level: number; attributes?: Record<string, number>; xp_history?: XPHistoryEntry[]; created_at?: string; updated_at?: string }>('/api/rewards/score');
    if (!data) return null;
    return {
        user_id: userId,
        total_xp: data.current_xp ?? 0,
        level: data.level ?? 1,
        attributes: (data.attributes as any) ?? { body: 0, mind: 0, spirit: 0, output: 0 },
        xp_history: (data.xp_history as any) ?? [],
        created_at: data.created_at ?? new Date().toISOString(),
        updated_at: data.updated_at ?? new Date().toISOString(),
    };
};

export interface DailyXP {
    date: string;
    count: number;
    level: number; // 0-4 intensity
}

export const getDailyXP = async (userId: string): Promise<DailyXP[]> => {
    const xp = await getUserXP(userId);
    if (!xp || !xp.xp_history) return [];

    const history = xp.xp_history as unknown as XPHistoryEntry[];
    const dailyMap = new Map<string, number>();

    history.forEach(entry => {
        const dateKey = entry.date.split('T')[0];
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + entry.amount);
    });

    const result: DailyXP[] = [];
    dailyMap.forEach((count, date) => {
        let level = 0;
        if (count > 0) level = 1;
        if (count > 50) level = 2;
        if (count > 100) level = 3;
        if (count > 200) level = 4;
        result.push({ date, count, level });
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
};
