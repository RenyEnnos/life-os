import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskWidget } from '../TaskWidget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    CheckCircle2: () => <span data-testid="icon-check" />,
    Circle: () => <span data-testid="icon-circle" />,
    Plus: () => <span data-testid="icon-plus" />,
    Play: () => <span data-testid="icon-play" />,
    Calendar: () => <span data-testid="icon-calendar" />
}));

// Mock hooks
const mockStartFocus = vi.fn();

vi.mock('@/features/dashboard/hooks/useDashboardData', () => ({
    useDashboardData: () => ({
        agenda: [
            { id: '1', title: 'Test Task 1', completed: false },
            { id: '2', title: 'Test Task 2', completed: true }
        ],
        isLoading: false
    })
}));

vi.mock('@/features/focus/stores/useFocusStore', () => ({
    useFocusStore: (selector: (state: unknown) => unknown) => selector({
        startFocus: mockStartFocus
    })
}));

vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 'test-user' }
    })
}));

// Setup QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
    }
});

describe('TaskWidget', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders tasks correctly', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskWidget />
            </QueryClientProvider>
        );
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('has accessible add task button', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskWidget />
            </QueryClientProvider>
        );
        const addButton = screen.getByRole('button', { name: /add new task/i });
        expect(addButton).toBeInTheDocument();

        fireEvent.click(addButton);

        expect(screen.getByRole('button', { name: /cancel adding task/i })).toBeInTheDocument();
    });

    it('has accessible task input and create button', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskWidget />
            </QueryClientProvider>
        );

        // Click add button first to show form
        const addButton = screen.getByRole('button', { name: /add new task/i });
        fireEvent.click(addButton);

        const input = screen.getByLabelText(/new task title/i);
        expect(input).toBeInTheDocument();

        const createButton = screen.getByRole('button', { name: /create task/i });
        expect(createButton).toBeInTheDocument();
    });

    it('has accessible task toggle buttons with task specific names', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskWidget />
            </QueryClientProvider>
        );

        // Task 1 is incomplete (Test Task 1)
        expect(screen.getByRole('button', { name: /mark task test task 1 as completed/i })).toBeInTheDocument();

        // Task 2 is complete (Test Task 2)
        expect(screen.getByRole('button', { name: /mark task test task 2 as incomplete/i })).toBeInTheDocument();
    });

    it('has accessible start focus button', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskWidget />
            </QueryClientProvider>
        );

        const focusButton = screen.getByRole('button', { name: /start focus session for test task 1/i });
        expect(focusButton).toBeInTheDocument();

        // Check for focus-visible class
        expect(focusButton).toHaveClass('focus-visible:opacity-100');
    });
});
