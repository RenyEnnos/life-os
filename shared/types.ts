export interface User {
  id: string
  email: string
  name: string
  preferences: Record<string, any>
  theme: 'dark' | 'light'
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface Habit {
  id: string
  user_id: string
  title: string
  description?: string
  type: 'binary' | 'numeric'
  goal: number
  schedule: Record<string, any>
  active: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  area_of_life: string[]
  tags: string[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  entry_date: string
  title?: string
  content?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  tags: string[]
  transaction_date: string
  created_at: string
}

export interface HealthMetric {
  id: string
  user_id: string
  metric_type: string
  value: number
  unit?: string
  recorded_date: string
  created_at: string
}

export interface Reward {
  id: string
  user_id: string
  title: string
  description?: string
  criteria: Record<string, any>
  points_required: number
  achieved: boolean
  achieved_at?: string
  created_at: string
}