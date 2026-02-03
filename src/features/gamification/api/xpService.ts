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
): Promise<{ success: boolean; newLevel?: number; error?: unknown }> => {
    try {
        const res = await apiClient.post<{ success: boolean; current_xp: number; level: number }>('/api/rewards/xp', { amount, category, source });
        return { success: res.success, newLevel: res.level };
    } catch (error) {
        console.error('Error awarding XP:', error);
        return { success: false, error };
    }
};
// ... existing code ...

const defaultAttributes: Record<AttributeType, number> = {
    body: 0,
    mind: 0,
    spirit: 0,
    output: 0,
};

const toAttributes = (value: unknown): Record<AttributeType, number> => {
    if (!value || typeof value !== 'object') return { ...defaultAttributes };
    const record = value as Record<string, unknown>;
    return {
        body: typeof record.body === 'number' ? record.body : 0,
        mind: typeof record.mind === 'number' ? record.mind : 0,
        spirit: typeof record.spirit === 'number' ? record.spirit : 0,
        output: typeof record.output === 'number' ? record.output : 0,
    };
};

const toCategory = (value: unknown): AttributeType => {
    switch (value) {
        case 'mind':
        case 'spirit':
        case 'output':
        case 'body':
            return value;
        default:
            return 'body';
    }
};

const toXpHistory = (value: unknown): XPHistoryEntry[] => {
    if (!Array.isArray(value)) return [];
    return value.reduce<XPHistoryEntry[]>((acc, entry) => {
        if (!entry || typeof entry !== 'object') return acc;
        const record = entry as Record<string, unknown>;
        const date = typeof record.date === 'string' ? record.date : '';
        if (!date) return acc;
        acc.push({
            date,
            amount: typeof record.amount === 'number' ? record.amount : Number(record.amount ?? 0),
            category: toCategory(record.category),
            source: typeof record.source === 'string' ? record.source : '',
            previous_level: typeof record.previous_level === 'number' ? record.previous_level : 0,
            new_level: typeof record.new_level === 'number' ? record.new_level : 0,
        });
        return acc;
    }, []);
};

export const getUserXP = async (userId: string): Promise<UserXP | null> => {
    void userId;
    const data = await apiClient.get<{ current_xp: number; level: number; attributes?: Record<string, number>; xp_history?: XPHistoryEntry[]; created_at?: string; updated_at?: string }>('/api/rewards/score');
    if (!data) return null;
    return {
        user_id: userId,
        total_xp: data.current_xp ?? 0,
        level: data.level ?? 1,
        attributes: toAttributes(data.attributes),
        xp_history: toXpHistory(data.xp_history) as unknown as any,
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
