// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { GradeAnalytics } from '../components/GradeAnalytics';

// Mock hooks - source imports from ../hooks/useUniversity relative to components dir
// From test file (__tests__), that's still ../hooks/useUniversity
vi.mock('../hooks/useUniversity', () => ({
    useUniversity: () => ({
        assignments: [
            { id: 'a1', course_id: 'c1', title: 'Midterm', grade: 8, weight: 30, status: 'graded', due_date: '2025-06-01', type: 'exam' },
            { id: 'a2', course_id: 'c1', title: 'Final', grade: 9, weight: 50, status: 'graded', due_date: '2025-07-01', type: 'exam' },
        ],
        courses: [
            { id: 'c1', name: 'Linear Algebra', grade: 8.5 },
            { id: 'c2', name: 'Calculus', grade: 7.0 },
        ],
        isLoading: false,
    }),
}));

vi.mock('../hooks/useGradeCalculation', () => ({
    useGradeCalculation: () => ({
        calculateGlobalGPA: () => 7.8,
        calculateCourseGrade: (courseId: string) => {
            const grades: Record<string, number> = { c1: 8.5, c2: 7.0 };
            return grades[courseId] ?? null;
        },
    }),
}));

vi.mock('../components/WhatIfSimulator', () => ({
    WhatIfSimulator: () => <div data-testid="what-if-simulator" />,
}));

describe('GradeAnalytics', () => {
    it('renders GPA value', () => {
        render(<GradeAnalytics />);
        expect(screen.getByText('7.8')).toBeInTheDocument();
    });

    it('renders course names', () => {
        render(<GradeAnalytics />);
        expect(screen.getByText('Linear Algebra')).toBeInTheDocument();
        expect(screen.getByText('Calculus')).toBeInTheDocument();
    });

    it('renders WhatIfSimulator', () => {
        render(<GradeAnalytics />);
        expect(screen.getByTestId('what-if-simulator')).toBeInTheDocument();
    });

    it('displays performance label', () => {
        render(<GradeAnalytics />);
        expect(screen.getByText(/Muito Bom|Bom|Regular|Insuficiente|Excelente/)).toBeInTheDocument();
    });

    it('shows course grades', () => {
        render(<GradeAnalytics />);
        expect(screen.getByText('8.5')).toBeInTheDocument();
        expect(screen.getByText('7.0')).toBeInTheDocument();
    });
});
