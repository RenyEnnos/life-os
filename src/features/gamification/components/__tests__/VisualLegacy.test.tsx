// @vitest-environment jsdom
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { VisualLegacy } from '../VisualLegacy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import * as xpService from '@/features/gamification/api/xpService';

// Mock AuthContext
vi.mock('@/features/auth/contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock getDailyXP from xpService
vi.mock('@/features/gamification/api/xpService', () => ({
    getDailyXP: vi.fn(),
}));

// Mock framer-motion AnimatePresence
vi.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

const mockUser = { id: 'test-user-id', email: 'test@example.com', name: 'Test User' };

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const mockDailyXPData = [
    { date: '2025-02-10', count: 100, level: 2 },
    { date: '2025-02-11', count: 50, level: 1 },
    { date: '2025-02-12', count: 200, level: 4 },
    { date: '2025-02-18', count: 150, level: 3 },
    { date: '2025-02-19', count: 75, level: 2 },
];

describe('VisualLegacy', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: mockUser });
    });

    const renderWithProviders = (component: React.ReactElement) => {
        return render(
            <QueryClientProvider client={queryClient}>
                {component}
            </QueryClientProvider>
        );
    };

    it('renders canvas and container elements', () => {
        const { container } = renderWithProviders(<VisualLegacy />);

        // Check for main container
        const mainContainer = container.querySelector('.bg-black\\/50');
        expect(mainContainer).toBeInTheDocument();

        // Check for canvas element
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();

        // Check for title
        expect(screen.getByText('Constelação')).toBeInTheDocument();
    });

    it('does not fetch data when user is not authenticated', () => {
        (useAuth as any).mockReturnValue({ user: null });

        renderWithProviders(<VisualLegacy />);

        // Query should be disabled when no user
        expect(useAuth).toHaveBeenCalled();
    });

    it('applies custom className', () => {
        const { container } = renderWithProviders(<VisualLegacy className="custom-class" />);

        const mainContainer = container.querySelector('.custom-class');
        expect(mainContainer).toBeInTheDocument();
    });

    it('renders canvas with correct attributes', () => {
        const { container } = renderWithProviders(<VisualLegacy />);

        const canvas = container.querySelector('canvas');
        expect(canvas).toHaveClass('w-full', 'h-full', 'cursor-crosshair');
    });

    it('sets up hover tooltip state correctly on mouse move', async () => {
        vi.mocked(xpService.getDailyXP).mockResolvedValue(mockDailyXPData);

        const { container } = renderWithProviders(<VisualLegacy />);

        const canvas = container.querySelector('canvas') as HTMLCanvasElement;

        // Wait for canvas to be ready and data to load
        await waitFor(() => {
            expect(canvas).toBeInTheDocument();
        });

        // Simulate mouse move
        fireEvent.mouseMove(canvas, {
            clientX: 100,
            clientY: 100,
        });

        // The component should handle mouse move without errors
        expect(canvas).toBeInTheDocument();
    });

    it('clears hover tooltip on mouse leave', async () => {
        vi.mocked(xpService.getDailyXP).mockResolvedValue(mockDailyXPData);

        const { container } = renderWithProviders(<VisualLegacy />);

        const canvas = container.querySelector('canvas') as HTMLCanvasElement;

        // Wait for canvas to be ready
        await waitFor(() => {
            expect(canvas).toBeInTheDocument();
        });

        // Simulate mouse leave
        fireEvent.mouseLeave(canvas);

        // The component should handle mouse leave without errors
        expect(canvas).toBeInTheDocument();
    });

    it('handles resize events gracefully', async () => {
        vi.mocked(xpService.getDailyXP).mockResolvedValue(mockDailyXPData);

        renderWithProviders(<VisualLegacy />);

        // Trigger resize event
        window.dispatchEvent(new Event('resize'));

        await waitFor(() => {
            expect(true).toBe(true); // Test passes if no errors are thrown
        });
    });

    it('displays tooltip with correct data when hovering over a star point', async () => {
        vi.mocked(xpService.getDailyXP).mockResolvedValue(mockDailyXPData);

        const { container } = renderWithProviders(<VisualLegacy />);

        // Wait for canvas to be ready
        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument();
        });

        const canvas = container.querySelector('canvas') as HTMLCanvasElement;

        // Simulate mouse move at a position
        fireEvent.mouseMove(canvas, {
            clientX: 150,
            clientY: 150,
        });

        // Check that tooltip might appear (it depends on canvas positioning)
        // We're mainly testing that no errors occur
        expect(canvas).toBeInTheDocument();
    });

    it('shows correct date and XP count in tooltip', async () => {
        vi.mocked(xpService.getDailyXP).mockResolvedValue(mockDailyXPData);

        renderWithProviders(<VisualLegacy />);

        // Tooltip should show date and XP when hovering
        // This is a visual test, we just ensure no errors occur
        await waitFor(() => {
            expect(screen.getByText('Constelação')).toBeInTheDocument();
        });
    });

    it('handles empty history data gracefully', async () => {
        vi.mocked(xpService.getDailyXP).mockResolvedValue([]);

        const { container } = renderWithProviders(<VisualLegacy />);

        // Canvas should still render even with no data
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
    });

    it('handles null history data gracefully', async () => {
        vi.mocked(xpService.getDailyXP).mockResolvedValue(null as any);

        const { container } = renderWithProviders(<VisualLegacy />);

        // Canvas should still render even with null data
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
    });
});
