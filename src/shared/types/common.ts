export interface NavItem {
    label: string;
    path: string;
    icon: string;
    activeIcon?: boolean; // filled variation
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    tag: string;
    tagColor: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

export interface Task {
    id: string;
    title: string;
    due?: string;
    tags: { label: string; color: string }[];
    completed: boolean;
}

export interface Habit {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    completed: boolean;
    type: 'binary' | 'numeric';
    progress?: number;
    goal?: number;
    active?: boolean;
}

export interface Onboarding {
    id: string | null;
    user_id: string;
    current_step: string;
    steps_completed: Record<string, boolean>;
    completed: boolean;
    skipped: boolean;
    created_at: string | null;
    updated_at: string | null;
    completed_at?: string | null;
}
