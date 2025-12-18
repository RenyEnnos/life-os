import { Database } from './types/database';

// User type definition - disconnected from Database type as 'users' table is not in public schema
export interface DbUser {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    preferences?: Record<string, any>;
    theme?: string;
    created_at: string;
    updated_at?: string;
}
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
    schedule: { frequency: string } & Record<string, string | number | boolean | null>;
}

export type DbTask = Database['public']['Tables']['tasks']['Row'];

export type EnergyLevel = 'high' | 'low' | 'any';
export type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'any';

export interface Task extends Omit<DbTask, 'tags'> {
    tags?: string[];
    energy_level?: EnergyLevel;
    time_block?: TimeBlock;
}

// Neural Resonance Types
export interface JournalInsightContent {
    sentiment: string;
    keywords: string[];
    advice: string;
    correlation_hypothesis?: string;
    mood_score: number;
    // Added fields for different insight types
    summary?: string;
    themes?: string[];
    recommendations?: string[];
}

export type InsightType = 'neural_resonance' | 'weekly' | 'mood' | 'theme';

export interface JournalInsight {
    id: string;
    journal_entry_id: string;
    user_id: string;
    insight_type: InsightType;
    content: JournalInsightContent;
    created_at: string;
}

export interface JournalEntry {
    id: string;
    user_id: string;
    entry_date: string;
    title?: string;
    content?: string;
    tags?: string[];
    mood_score?: number;
    last_analyzed_at?: string;
    created_at: string;
    insights?: JournalInsight[];
}

export type DbTransaction = Database['public']['Tables']['transactions']['Row'];

export interface Transaction extends Omit<DbTransaction, 'tags'> {
    tags?: string[];
    category: string;
    // Retrocompat for clients that still send transaction_date
    transaction_date?: string | null;
}

export type DbProject = Database['public']['Tables']['projects']['Row'];

export interface Project extends Omit<DbProject, 'tags' | 'active' | 'name' | 'deadline'> {
    title: string;
    status: 'active' | 'completed' | 'on_hold';
    priority: 'low' | 'medium' | 'high';
    deadline?: string;
    cover?: string;
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
    attributes?: any;
    updated_at: string;
}

export interface FinanceSummary {
    income: number;
    expenses: number;
    balance: number;
    byCategory?: Record<string, number>;
}

// Symbiosis (task ↔ habit links)
export interface SymbiosisLink {
    id: string;
    task_id: string;
    habit_id: string;
    impact_vital: number;
    custo_financeiro?: number | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export type VitalLoadState = 'balanced' | 'overloaded' | 'underloaded';

export interface VitalLoadSummary {
    totalImpact: number;
    state: VitalLoadState;
    label: string;
}
