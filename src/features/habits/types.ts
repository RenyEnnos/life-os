import { Habit as SharedHabit } from '@/shared/types';

export interface Habit extends Omit<SharedHabit, 'title'> {
    // Frontend specific aliases or optional props
    title?: string; // Support for title (sometimes used interchangeably with name)
    active?: boolean;
    completed?: boolean;
    progress?: number;
    category?: string; // Legacy or future use
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
