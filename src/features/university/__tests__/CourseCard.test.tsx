// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { CourseCard } from '../components/CourseCard';
import type { Course } from '../types';

// Mock premium UI components
vi.mock('@/shared/ui/premium/MagicCard', () => ({
    MagicCard: ({ children, className, onClick }: any) => (
        <div data-testid="magic-card" className={className} onClick={onClick}>
            {children}
        </div>
    ),
}));

vi.mock('@/shared/ui/premium/BorderBeam', () => ({
    BorderBeam: () => <div data-testid="border-beam" />,
}));

vi.mock('@/shared/ui/premium/AnimatedCircularProgressBar', () => ({
    AnimatedCircularProgressBar: ({ value }: { value: number }) => (
        <div data-testid="progress-bar">{value}%</div>
    ),
}));

vi.mock('@/shared/ui/Button', () => ({
    Button: ({ children, onClick }: any) => (
        <button data-testid="button" onClick={onClick}>{children}</button>
    ),
}));

const mockCourse: Course = {
    id: 'c1',
    user_id: 'u1',
    name: 'Linear Algebra',
    professor: 'Dr. Smith',
    schedule: 'Mon/Wed 10:00',
    color: '#3b82f6',
    grade: 8.5,
    semester: '2025-1',
};

describe('CourseCard', () => {
    it('renders course name', () => {
        render(<CourseCard course={mockCourse} progress={75} />);
        expect(screen.getByText('Linear Algebra')).toBeInTheDocument();
    });

    it('renders professor name', () => {
        render(<CourseCard course={mockCourse} progress={75} />);
        expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    it('renders schedule', () => {
        render(<CourseCard course={mockCourse} progress={75} />);
        expect(screen.getByText('Mon/Wed 10:00')).toBeInTheDocument();
    });

    it('renders progress percentage', () => {
        render(<CourseCard course={mockCourse} progress={75} />);
        const matches = screen.getAllByText('75%');
        expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('calls onClick when card is clicked', () => {
        const onClick = vi.fn();
        render(<CourseCard course={mockCourse} progress={50} onClick={onClick} />);
        fireEvent.click(screen.getByTestId('magic-card'));
        expect(onClick).toHaveBeenCalled();
    });

    it('shows default text when professor is missing', () => {
        const courseNoProf = { ...mockCourse, professor: undefined };
        render(<CourseCard course={courseNoProf} progress={50} />);
        expect(screen.getByText('Sem Professor')).toBeInTheDocument();
    });
});
