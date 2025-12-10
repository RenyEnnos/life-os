import { supabase } from '@/shared/api/supabase';
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
    try {
        // 1. Fetch current user_xp
        const { data: userXp, error: fetchError } = await supabase
            .from('user_xp')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError) {
            // If row doesn't exist, create it (should happen on signup trigger, but good for safety)
            if (fetchError.code === 'PGRST116') {
                const { error: insertError } = await supabase.from('user_xp').insert({ user_id: userId });
                if (insertError) throw insertError;
                // Retry fetch
                return awardXP(userId, amount, category, source);
            }
            throw fetchError;
        }

        // 2. Anti-Cheat: Check for spamming
        // Allow max 1 journal entry reward per day
        if (source === 'journal_entry') {
            const today = new Date().toISOString().split('T')[0];
            const history = (userXp.xp_history as unknown as XPHistoryEntry[]) || [];
            const hasJournaledToday = history.some(
                (entry) =>
                    entry.source === 'journal_entry' &&
                    entry.date.startsWith(today)
            );

            if (hasJournaledToday) {
                console.log('XP Limit reached for journal_entry today');
                return { success: false, error: 'Daily limit reached' };
            }
        }

        // 3. Calculate new values
        const currentAttributes = (userXp.attributes as unknown as Record<string, number>) || {
            body: 0,
            mind: 0,
            spirit: 0,
            output: 0,
        };

        const newAttributes = {
            ...currentAttributes,
            [category]: (currentAttributes[category] || 0) + amount,
        };

        const newTotalXp = userXp.total_xp + amount;
        const newLevel = calculateLevel(newTotalXp);
        const leveledUp = newLevel > userXp.level;

        const historyEntry: XPHistoryEntry = {
            date: new Date().toISOString(),
            amount,
            category,
            source,
            previous_level: userXp.level,
            new_level: newLevel,
        };

        // Keep history manageable (last 365 entries for Visual Legacy)
        const currentHistory = (userXp.xp_history as unknown as XPHistoryEntry[]) || [];
        const newHistory = [historyEntry, ...currentHistory].slice(0, 365);

        // 4. Update Database
        const { error: updateError } = await supabase
            .from('user_xp')
            .update({
                total_xp: newTotalXp,
                level: newLevel,
                attributes: newAttributes,
                xp_history: newHistory as any, // Cast to any for JSONB
            })
            .eq('user_id', userId);

        if (updateError) throw updateError;

        // 5. Check and Unlock Achievements
        try {
            const { checkAndUnlockAchievements, notifyAchievementUnlock } = await import('./achievementService');
            const newlyUnlocked = await checkAndUnlockAchievements(userId);
            if (newlyUnlocked.length > 0) {
                notifyAchievementUnlock(newlyUnlocked);
            }
        } catch (achievementError) {
            console.warn('Achievement check failed:', achievementError);
            // Non-critical, don't fail the XP award
        }

        return { success: true, newLevel: leveledUp ? newLevel : undefined };

    } catch (error) {
        console.error('Error awarding XP:', error);
        return { success: false, error };
    }
};
// ... existing code ...

export const getUserXP = async (userId: string): Promise<UserXP | null> => {
    const { data, error } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching user XP:', error);
        throw error;
    }

    return data;
};

export interface DailyXP {
    date: string;
    count: number;
    level: number; // 0-4 intensity
}

export const getDailyXP = async (userId: string): Promise<DailyXP[]> => {
    const userXP = await getUserXP(userId);
    if (!userXP || !userXP.xp_history) return [];

    const history = userXP.xp_history as unknown as XPHistoryEntry[];
    const dailyMap = new Map<string, number>();

    history.forEach(entry => {
        // Date is ISO string, split to YYYY-MM-DD
        const dateKey = entry.date.split('T')[0];
        const current = dailyMap.get(dateKey) || 0;
        dailyMap.set(dateKey, current + entry.amount);
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
