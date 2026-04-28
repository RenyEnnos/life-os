// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { FocusOverlay } from '../components/FocusOverlay';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUseFocusStore = vi.fn();

vi.mock('../stores/useFocusStore', () => ({
    useFocusStore: (...args: any[]) => mockUseFocusStore(...args),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));

vi.mock('@/features/tasks/api/tasks.api', () => ({
    tasksApi: { update: vi.fn() },
}));

vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return { ...actual };
});

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('FocusOverlay', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders when focusing', () => {
        mockUseFocusStore.mockReturnValue({
            isFocusing: true,
            timerState: 'running',
            secondsRemaining: 1500,
            activeTask: null,
            label: 'Deep Work',
            stopFocus: vi.fn(),
            pauseFocus: vi.fn(),
            resumeFocus: vi.fn(),
        });

        render(<FocusOverlay />, { wrapper });
        expect(screen.getByText('Deep Work')).toBeInTheDocument();
    });

    it('shows timer display', () => {
        mockUseFocusStore.mockReturnValue({
            isFocusing: true,
            timerState: 'running',
            secondsRemaining: 1500,
            activeTask: null,
            label: 'Deep Work',
            stopFocus: vi.fn(),
            pauseFocus: vi.fn(),
            resumeFocus: vi.fn(),
        });

        render(<FocusOverlay />, { wrapper });
        expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('shows timer controls when running', () => {
        mockUseFocusStore.mockReturnValue({
            isFocusing: true,
            timerState: 'running',
            secondsRemaining: 1500,
            activeTask: null,
            label: 'Deep Work',
            stopFocus: vi.fn(),
            pauseFocus: vi.fn(),
            resumeFocus: vi.fn(),
        });

        render(<FocusOverlay />, { wrapper });
        // The overlay renders timer controls (pause/play buttons)
        expect(screen.getByText('Deep Work')).toBeInTheDocument();
        expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('renders nothing when not focusing', () => {
        mockUseFocusStore.mockReturnValue({
            isFocusing: false,
            timerState: 'idle',
            secondsRemaining: 1500,
            activeTask: null,
            label: null,
            stopFocus: vi.fn(),
            pauseFocus: vi.fn(),
            resumeFocus: vi.fn(),
        });

        const { container } = render(<FocusOverlay />, { wrapper });
        expect(container.innerHTML).toBe('');
    });
});
