import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskWidget } from '../TaskWidget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
const mockTasks = [
  { id: '1', title: 'Task 1', completed: false },
  { id: '2', title: 'Task 2', completed: true }
];

vi.mock('@/features/dashboard/hooks/useDashboardData', () => ({
  useDashboardData: () => ({
    agenda: mockTasks,
    isLoading: false
  })
}));

vi.mock('@/features/tasks/api/tasks.api', () => ({
  tasksApi: {
    create: vi.fn(),
    update: vi.fn()
  }
}));

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user1' }
  })
}));

vi.mock('@/features/focus/stores/useFocusStore', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFocusStore: (selector: (state: any) => any) => {
        const state = {
            startFocus: vi.fn()
        };
        return selector(state);
    }
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

describe('TaskWidget Accessibility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <TaskWidget />
            </QueryClientProvider>
        );
    };

    it('renders the widget title', () => {
        renderComponent();
        expect(screen.getByText('Missão do Dia')).toBeInTheDocument();
    });

    it('has an accessible "Add Task" button', () => {
        renderComponent();
        const addButton = screen.getByRole('button', { name: /add new task/i });
        expect(addButton).toBeInTheDocument();

        fireEvent.click(addButton);
        expect(screen.getByRole('button', { name: /cancel adding task/i })).toBeInTheDocument();
    });

    it('has accessible input for new task', () => {
        renderComponent();
        // Open add mode
        const addButton = screen.getByRole('button', { name: /add new task/i });
        fireEvent.click(addButton);

        const input = screen.getByRole('textbox', { name: /new task title/i });
        expect(input).toBeInTheDocument();

        const confirmButton = screen.getByRole('button', { name: /confirm add task/i });
        expect(confirmButton).toBeInTheDocument();
    });

    it('has accessible toggle buttons for tasks', () => {
        renderComponent();
        const toggleTask1 = screen.getByRole('button', { name: /mark task 1 as complete/i });
        expect(toggleTask1).toBeInTheDocument();

        const toggleTask2 = screen.getByRole('button', { name: /mark task 2 as incomplete/i });
        expect(toggleTask2).toBeInTheDocument();
    });

    it('has accessible focus buttons', () => {
        renderComponent();
        const focusButton = screen.getByRole('button', { name: /start focus session for task 1/i });
        expect(focusButton).toBeInTheDocument();
        expect(focusButton).toHaveClass('focus-visible:opacity-100');
    });
});
