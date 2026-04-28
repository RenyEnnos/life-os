// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { AssignmentKanban } from '../components/AssignmentKanban';
import type { Assignment } from '../types';

// Mock dnd-kit - comprehensive mock
vi.mock('@dnd-kit/core', () => ({
    DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
    DragOverlay: ({ children }: any) => <div>{children}</div>,
    closestCorners: vi.fn(),
    KeyboardSensor: vi.fn(),
    PointerSensor: vi.fn(),
    useSensor: () => ({}),
    useSensors: () => [],
    useDraggable: () => ({
        attributes: { role: 'button', tabIndex: 0 },
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        isDragging: false,
    }),
    useDroppable: () => ({
        isOver: false,
        setNodeRef: vi.fn(),
    }),
}));

vi.mock('@dnd-kit/sortable', () => ({
    sortableKeyboardCoordinates: vi.fn(),
}));

vi.mock('@dnd-kit/utilities', () => ({
    CSS: {
        Translate: {
            toString: (transform: any) => transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        },
    },
}));

vi.mock('@/shared/ui/Card', () => ({
    Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
    CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('@/shared/ui/Badge', () => ({
    Badge: ({ children, className }: any) => <span data-testid="badge" className={className}>{children}</span>,
}));

const mockAssignments: Assignment[] = [
    { id: 'a1', course_id: 'c1', title: 'Midterm Exam', type: 'exam', due_date: '2025-06-01', weight: 30, status: 'todo' },
    { id: 'a2', course_id: 'c1', title: 'Homework 1', type: 'homework', due_date: '2025-05-15', weight: 10, status: 'submitted' },
    { id: 'a3', course_id: 'c1', title: 'Project', type: 'project', due_date: '2025-06-15', weight: 40, status: 'graded', grade: 9 },
];

describe('AssignmentKanban', () => {
    it('renders three columns', () => {
        render(<AssignmentKanban assignments={mockAssignments} />);
        expect(screen.getByText('A Fazer')).toBeInTheDocument();
        expect(screen.getByText('Entregue')).toBeInTheDocument();
        expect(screen.getByText('Avaliado')).toBeInTheDocument();
    });

    it('renders assignment titles', () => {
        render(<AssignmentKanban assignments={mockAssignments} />);
        expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
        expect(screen.getByText('Homework 1')).toBeInTheDocument();
        expect(screen.getByText('Project')).toBeInTheDocument();
    });

    it('renders DndContext wrapper', () => {
        render(<AssignmentKanban assignments={mockAssignments} />);
        expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    });

    it('shows empty state when no assignments', () => {
        render(<AssignmentKanban assignments={[]} />);
        expect(screen.getAllByText('Arraste aqui')).toHaveLength(3);
    });

    it('displays assignment type badges', () => {
        render(<AssignmentKanban assignments={mockAssignments} />);
        const badges = screen.getAllByTestId('badge');
        expect(badges.length).toBeGreaterThanOrEqual(3);
    });
});
