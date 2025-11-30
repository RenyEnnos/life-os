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
