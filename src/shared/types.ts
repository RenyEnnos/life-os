import { Database } from './types/database';

export type DbUser = Database['public']['Tables']['users']['Row'];
export interface User extends DbUser { }

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export type DbHabit = Database['public']['Tables']['habits']['Row'];

export interface Habit extends Omit<DbHabit, 'schedule'> {
    frequency: string[];
    streak: number;
    routine: 'morning' | 'afternoon' | 'evening' | 'any';
    schedule: { frequency: string;[key: string]: any };
}

export type DbTask = Database['public']['Tables']['tasks']['Row'];

export interface Task extends Omit<DbTask, 'tags'> {
    tags?: string[];
}

export interface JournalEntry {
    id: string;
    user_id: string;
    entry_date: string;
    title?: string;
    content?: string;
    tags?: string[];
    created_at: string;
}

export type DbTransaction = Database['public']['Tables']['transactions']['Row'];

export interface Transaction extends Omit<DbTransaction, 'tags'> {
    tags?: string[];
    category: string;
}

export type DbProject = Database['public']['Tables']['projects']['Row'];

export interface Project extends Omit<DbProject, 'tags' | 'active' | 'name'> {
    title: string;
    status: 'active' | 'completed' | 'on_hold';
    priority: 'low' | 'medium' | 'high';
    deadline?: string;
    tags?: string[];
}

export interface HealthMetric {
    id: string;
    user_id: string;
    metric_type: string;
    value: number;
    unit?: string;
    recorded_date: string;
    created_at: string;
}

export interface MedicationReminder {
    id: string;
    user_id: string;
    name: string;
    dosage: string;
    times: string[];
    active: boolean;
    created_at: string;
}

export interface Reward {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    cost: number;
    redeemed: boolean;
    created_at: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xp_reward: number;
    condition_type: string;
    condition_value: number;
}

export interface LifeScore {
    user_id: string;
    level: number;
    current_xp: number;
    life_score: number;
    updated_at: string;
}

export interface FinanceSummary {
    income: number;
    expenses: number;
    balance: number;
    byCategory?: Record<string, number>;
}
