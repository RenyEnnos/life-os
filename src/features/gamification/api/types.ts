import { Database } from '@/shared/types/database';

export type UserXP = Database['public']['Tables']['user_xp']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];

export type AttributeType = 'body' | 'mind' | 'spirit' | 'output';

export interface XPAttributes {
    body: number;
    mind: number;
    spirit: number;
    output: number;
}

export interface XPHistoryEntry {
    date: string;
    amount: number;
    category: AttributeType;
    source: string;
    previous_level: number;
    new_level: number;
}
