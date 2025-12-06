import { useState, useEffect } from 'react';
import { Course, Assignment } from '../types';

const STORAGE_KEY_COURSES = 'life-os-courses';
const STORAGE_KEY_ASSIGNMENTS = 'life-os-assignments';

const MOCK_COURSES: Course[] = [
    {
        id: '1',
        user_id: 'user-1',
        name: 'Anatomia Humana',
        professor: 'Dr. Estranho',
        schedule: 'Seg/Qua 10:00',
        color: '#ef4444',
        semester: '2025-1',
        grade: 8.5
    },
    {
        id: '2',
        user_id: 'user-1',
        name: 'Bioquímica',
        professor: 'Dr. Banner',
        schedule: 'Ter/Qui 14:00',
        color: '#10b981',
        semester: '2025-1',
        grade: 7.2
    },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
    { id: '1', course_id: '1', title: 'Quiz de Crânio', type: 'exam', due_date: '2025-03-20', status: 'todo', weight: 0.2, completed: false },
    { id: '2', course_id: '2', title: 'Ensaio de Dobramento', type: 'homework', due_date: '2025-03-15', status: 'submitted', weight: 0.1, completed: true },
];

export function useUniversity() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load from LocalStorage on mount
    useEffect(() => {
        const loadData = () => {
            const storedCourses = localStorage.getItem(STORAGE_KEY_COURSES);
            const storedAssignments = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);

            if (storedCourses) {
                setCourses(JSON.parse(storedCourses));
            } else {
                setCourses(MOCK_COURSES);
                localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(MOCK_COURSES));
            }

            if (storedAssignments) {
                setAssignments(JSON.parse(storedAssignments));
            } else {
                setAssignments(MOCK_ASSIGNMENTS);
                localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(MOCK_ASSIGNMENTS));
            }
            setIsLoading(false);
        };

        loadData();
    }, []);

    const addCourse = (newCourse: Omit<Course, 'id' | 'user_id'>) => {
        const course: Course = {
            ...newCourse,
            id: Math.random().toString(36).substr(2, 9),
            user_id: 'local-user', // Consistent with local storage approach
        };
        const updatedCourses = [...courses, course];
        setCourses(updatedCourses);
        localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(updatedCourses));
    };

    const removeCourse = (id: string) => {
        const updatedCourses = courses.filter(c => c.id !== id);
        setCourses(updatedCourses);
        localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(updatedCourses));

        // Also remove assignments for this course
        const updatedAssignments = assignments.filter(a => a.course_id !== id);
        setAssignments(updatedAssignments);
        localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(updatedAssignments));
    };

    const addAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
        const assignment: Assignment = {
            ...newAssignment,
            id: Math.random().toString(36).substr(2, 9),
        };
        const updatedAssignments = [...assignments, assignment];
        setAssignments(updatedAssignments);
        localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(updatedAssignments));
    };

    return {
        courses,
        assignments,
        isLoading,
        addCourse,
        removeCourse,
        addAssignment
    };
}
