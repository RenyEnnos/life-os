import { useMemo } from 'react';
import { Assignment, Course } from '../types';

export function useGradeCalculation(assignments: Assignment[]) {

    // Calculate average for a specific course
    const calculateCourseGrade = (courseId: string): number | null => {
        const courseAssignments = assignments.filter(a => a.course_id === courseId && a.grade !== undefined && a.grade !== null);

        if (courseAssignments.length === 0) return null;

        let totalScore = 0;
        let totalWeight = 0;

        courseAssignments.forEach(a => {
            const weight = a.weight || 1; // Default weight 1 if not specified
            const grade = a.grade as number;

            totalScore += grade * weight;
            totalWeight += weight;
        });

        if (totalWeight === 0) return 0;

        // Round to 1 decimal place
        return Math.round((totalScore / totalWeight) * 10) / 10;
    };

    // Calculate progress (percentage of assignments completed/graded)
    const calculateProgress = (courseId: string) => {
        const courseAssignments = assignments.filter(a => a.course_id === courseId);
        if (courseAssignments.length === 0) return 0;

        const completed = courseAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
        return Math.round((completed / courseAssignments.length) * 100);
    };

    return {
        calculateCourseGrade,
        calculateProgress
    };
}
