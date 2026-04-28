// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import type { Course, Assignment } from '../types';

vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, onClick }: any) => (
        <button data-testid="button" onClick={onClick}>{children}</button>
    ),
}));

vi.mock('@/shared/ui/premium/NeonGradientCard', () => ({
    NeonGradientCard: ({ children, className }: any) => (
        <div data-testid="neon-card" className={className}>{children}</div>
    ),
}));

const mockCourses: Course[] = [
    { id: 'c1', user_id: 'u1', name: 'Linear Algebra', grade: 7.5 },
    { id: 'c2', user_id: 'u1', name: 'Calculus', grade: 6.0 },
];

const mockAssignments: Assignment[] = [
    { id: 'a1', course_id: 'c1', title: 'Midterm', grade: 8, weight: 30, status: 'graded', due_date: '2025-06-01', type: 'exam' },
    { id: 'a2', course_id: 'c1', title: 'Final', weight: 50, status: 'todo', due_date: '2025-07-01', type: 'exam' },
];

describe('WhatIfSimulator', () => {
    it('renders course selector', () => {
        render(<WhatIfSimulator courses={mockCourses} assignments={mockAssignments} />);
        expect(screen.getByText(/Selecione uma matéria/)).toBeInTheDocument();
    });

    it('renders target grade input', () => {
        render(<WhatIfSimulator courses={mockCourses} assignments={mockAssignments} />);
        expect(screen.getByText('Meta de Nota Final')).toBeInTheDocument();
    });

    it('renders simulate button', () => {
        render(<WhatIfSimulator courses={mockCourses} assignments={mockAssignments} />);
        expect(screen.getAllByTestId('button').length).toBeGreaterThanOrEqual(1);
    });

    it('shows course names in dropdown', () => {
        render(<WhatIfSimulator courses={mockCourses} assignments={mockAssignments} />);
        expect(screen.getByText(/Linear Algebra/)).toBeInTheDocument();
        expect(screen.getByText(/Calculus/)).toBeInTheDocument();
    });

    it('calls simulate and shows result', async () => {
        render(<WhatIfSimulator courses={mockCourses} assignments={mockAssignments} />);
        const simBtn = screen.getAllByTestId('button').find(b => b.textContent?.includes('Calcular'));
        simBtn?.click();
        await vi.waitFor(() => {
            expect(screen.getByText(/Você precisa tirar/)).toBeInTheDocument();
        });
    });
});
