export interface Task {
    id: string;
    user_id: string;
    title: string; // db: title
    description?: string; // db: description
    completed: boolean; // db: completed
    due_date?: string; // db: due_date
    priority?: 'low' | 'medium' | 'high'; // db: priority
    tags?: string[]; // db: tags
    project_id?: string; // db: project_id
    created_at?: string;
    updated_at?: string;

    // Frontend helpers
    due?: string; // mapping due_date
}
