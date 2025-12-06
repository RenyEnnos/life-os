export interface Course {
    id: string;
    user_id: string;
    name: string;
    professor?: string;
    schedule?: string;
    color?: string;
    grade?: number;
    semester?: string;
    created_at?: string;
}

export interface Assignment {
    id: string;
    course_id: string;
    title: string;
    description?: string;
    type: 'exam' | 'homework' | 'paper' | 'project';
    due_date: string;
    grade?: number;
    weight: number;
    status: 'todo' | 'submitted' | 'graded';
    completed?: boolean;
}
