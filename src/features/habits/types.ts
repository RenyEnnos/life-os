export interface Habit {
    id: string;
    user_id: string;
    name: string; // db: name
    streak: number; // db: streak
    frequency: string[]; // db: frequency (text[])
    active: boolean; // db: active
    created_at?: string;
    updated_at?: string;
    category?: string; // db: category
    routine?: 'morning' | 'afternoon' | 'evening' | 'any'; // db: routine

    // Frontend specific or joined properties (optional for now, to support legacy UI if needed)
    title?: string;
    subtitle?: string;
    icon?: string;
    completed?: boolean;
    type?: 'binary' | 'numeric';
    progress?: number;
    goal?: number;
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
