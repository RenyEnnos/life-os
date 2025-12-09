export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    password_hash: string
                    name: string
                    preferences: Json
                    theme: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    password_hash: string
                    name: string
                    preferences?: Json
                    theme?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    password_hash?: string
                    name?: string
                    preferences?: Json
                    theme?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            habits: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    type: 'binary' | 'numeric'
                    goal: number
                    schedule: Json
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    type?: 'binary' | 'numeric'
                    goal?: number
                    schedule?: Json
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    type?: 'binary' | 'numeric'
                    goal?: number
                    schedule?: Json
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    area_of_life: Json
                    tags: Json
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    area_of_life?: Json
                    tags?: Json
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    area_of_life?: Json
                    tags?: Json
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            habit_logs: {
                Row: {
                    id: string
                    habit_id: string
                    user_id: string
                    value: number
                    logged_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    habit_id: string
                    user_id: string
                    value?: number
                    logged_date: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    habit_id?: string
                    user_id?: string
                    value?: number
                    logged_date?: string
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string
                    project_id: string | null
                    title: string
                    description: string | null
                    due_date: string | null
                    completed: boolean
                    tags: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    project_id?: string | null
                    title: string
                    description?: string | null
                    due_date?: string | null
                    completed?: boolean
                    tags?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    project_id?: string | null
                    title?: string
                    description?: string | null
                    due_date?: string | null
                    completed?: boolean
                    tags?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    type: 'income' | 'expense'
                    amount: number
                    description: string
                    tags: Json
                    transaction_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'income' | 'expense'
                    amount: number
                    description: string
                    tags?: Json
                    transaction_date: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'income' | 'expense'
                    amount?: number
                    description?: string
                    tags?: Json
                    transaction_date?: string
                    created_at?: string
                }
            }
        }
    }
}
