export interface Habit {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    active: boolean;
    frequency: string[]; // db: frequency (text[])
    routine: 'morning' | 'afternoon' | 'evening' | 'any'; // strictly typed logic
    created_at?: string;
    streak: number; // db: streak

    // Compatibility with Shared Type
    type: 'binary' | 'numeric'; // Made required to match shared
    goal: number; // Made required to match shared

    // Optional extras
    name?: string;
    updated_at?: string;
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
