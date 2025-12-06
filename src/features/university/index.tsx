import React, { useState } from 'react';
import { CourseCard } from './components/CourseCard';
import { AssignmentKanban } from './components/AssignmentKanban';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { Course, Assignment } from './types';
import { Button } from '@/shared/ui/Button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/features/auth/contexts/AuthContext';

// Mock data for now until we hook up the API hook properly
const MOCK_COURSES: Course[] = [
    {
        id: '1',
        user_id: 'user-1',
        name: 'Human Anatomy',
        professor: 'Dr. Strange',
        schedule: 'Mon/Wed 10:00',
        color: '#ef4444',
        semester: '2025-1',
        grade: 8.5
    },
    {
        id: '2',
        user_id: 'user-1',
        name: 'Biochemistry',
        professor: 'Dr. Banner',
        schedule: 'Tue/Thu 14:00',
        color: '#10b981',
        semester: '2025-1',
        grade: 7.2
    },
    {
        id: '3',
        user_id: 'user-1',
        name: 'Physics I',
        professor: 'Dr. Stark',
        schedule: 'Fri 08:00',
        color: '#3b82f6',
        semester: '2025-1',
        grade: 6.8
    }
];

export default function UniversityPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        🎓 University
                    </h1>
                    <p className="text-zinc-400 mt-2">Track grades, assignments, and academic progress.</p>
                </div>
                <Button className="gap-2 bg-primary text-black hover:bg-primary/90">
                    <Plus size={18} />
                    Add Course
                </Button>
            </header>

            {/* Courses Grid */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Current Semester (2025-1)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </section>

            {/* Assignment Kanban */}
            <section className="h-[500px]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Assignment Board</h2>
                </div>
                <AssignmentKanban assignments={MOCK_ASSIGNMENTS} />
            </section>

            {/* What-If Simulator */}
            <section className="max-w-xl mx-auto pb-10">
                <WhatIfSimulator courses={courses} />
            </section>
        </div>
    );
}

const MOCK_ASSIGNMENTS: Assignment[] = [
    { id: '1', course_id: '1', title: 'Skull Anatomy Quiz', type: 'exam', due_date: '2025-03-20', status: 'todo', weight: 0.2, completed: false },
    { id: '2', course_id: '2', title: 'Protein Folding Essay', type: 'homework', due_date: '2025-03-15', status: 'submitted', weight: 0.1, completed: true },
    { id: '3', course_id: '1', title: 'Midterm Exam', type: 'exam', due_date: '2025-02-10', status: 'graded', grade: 8.5, weight: 0.3, completed: true },
];
