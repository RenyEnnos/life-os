// Re-export shared Task type for consistency
export type { Task, TaskStatus } from '@/shared/types';

// Extended Task type with feature-specific fields if needed
export interface TaskWithExtras {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    /** @deprecated Use status === 'done' instead */
    completed: boolean;
    status: import('@/shared/types').TaskStatus;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    project_id?: string;
    created_at: string;
    updated_at?: string;
    // Frontend helpers
    due?: string;
}

export type Plan = Record<string, string[]>;
