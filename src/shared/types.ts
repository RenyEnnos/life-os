export interface User {
    id: string;
    email: string;
    name: string;
    preferences?: Record<string, unknown>;
    theme?: string;
    created_at?: string;
    updated_at?: string;
}

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

export interface Habit {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    type: 'binary' | 'numeric';
    goal: number;
    routine: 'morning' | 'afternoon' | 'evening' | 'any';
    active: boolean;
    created_at: string;
}

export interface Task {
    id: string;
    user_id: string;
    project_id?: string;
    title: string;
    description?: string;
    due_date?: string;
    completed: boolean;
    tags?: string[];
    created_at: string;
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

export interface Transaction {
    id: string;
    user_id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
    transaction_date: string;
    tags?: string[];
    created_at: string;
}

export interface Project {
    id: string;
    user_id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'on_hold';
    priority: 'low' | 'medium' | 'high';
    deadline?: string;
    created_at: string;
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
    byCategory: Record<string, number>;
}
