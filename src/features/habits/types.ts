import { Habit as SharedHabit } from '@/shared/types';

export interface Habit extends SharedHabit {
    // Frontend specific aliases or optional props if not in shared yet
    title?: string; // Legacy support or alias
    active?: boolean; // Derived or missing in shared
    type?: 'binary' | 'numeric';
    goal?: number;
    category?: string;
    icon?: string;
    completed?: boolean;
    progress?: number;
}

export interface HabitLog {
    id: string;
    habit_id: string;
    user_id: string;
    date: string;
    value: number;
    notes?: string;
    created_at?: string;
}
