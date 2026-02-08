// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuickCapture } from '../QuickCapture';
import { vi, describe, it, expect, type Mock } from 'vitest';
import React from 'react';
import * as aiApiModule from '@/features/ai-assistant/api/ai.api';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Sparkles: () => <span data-testid="icon-sparkles">Sparkles</span>,
    ArrowRight: () => <span data-testid="icon-arrow-right">ArrowRight</span>,
    Loader: () => <span data-testid="icon-loader">Loader</span>,
}));

// Mock useTasks
const mockCreateTask = {
    mutateAsync: vi.fn(),
};

vi.mock('@/features/tasks/hooks/useTasks', () => ({
    useTasks: () => ({
        createTask: mockCreateTask,
    }),
}));

// Mock useToast
const mockShowToast = vi.fn();
vi.mock('@/shared/ui/useToast', () => ({
    useToast: () => ({
        showToast: mockShowToast,
    }),
}));

// Mock aiApi
vi.mock('@/features/ai-assistant/api/ai.api', () => ({
    aiApi: {
        parseTask: vi.fn(),
    },
}));

describe('QuickCapture', () => {
    it('renders with correct accessibility labels', () => {
        render(<QuickCapture />);

        const input = screen.getByPlaceholderText(/Ask AI to capture task/i);
        expect(input).toBeInTheDocument();
        // Check for aria-label (will fail until implemented)
        expect(input).toHaveAttribute('aria-label', 'Quick capture task');

        const button = screen.getByRole('button', { name: /Capture task/i });
        expect(button).toBeInTheDocument();
    });

    it('disables button when input is empty', () => {
        render(<QuickCapture />);
        const button = screen.getByRole('button', { name: /Capture task/i });
        expect(button).toBeDisabled();
    });

    it('enables button when input has text', () => {
        render(<QuickCapture />);
        const input = screen.getByPlaceholderText(/Ask AI to capture task/i);
        const button = screen.getByRole('button', { name: /Capture task/i });

        fireEvent.change(input, { target: { value: 'New task' } });
        expect(button).toBeEnabled();
    });

    it('calls createTask on submit', async () => {
        const mockParsedTask = {
            title: 'Parsed Task',
            description: 'Parsed Description',
        };
        (aiApiModule.aiApi.parseTask as Mock).mockResolvedValue(mockParsedTask);
        mockCreateTask.mutateAsync.mockResolvedValue({});

        render(<QuickCapture />);
        const input = screen.getByPlaceholderText(/Ask AI to capture task/i);
        const button = screen.getByRole('button', { name: /Capture task/i });

        fireEvent.change(input, { target: { value: 'New task' } });
        fireEvent.click(button);

        expect(button).toBeDisabled(); // Should be disabled while thinking

        await waitFor(() => {
            expect(aiApiModule.aiApi.parseTask).toHaveBeenCalledWith('New task');
            expect(mockCreateTask.mutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Parsed Task',
                description: 'Parsed Description',
            }));
            expect(mockShowToast).toHaveBeenCalledWith('Task captured!', 'success');
        });

        // Input should be cleared
        expect(input).toHaveValue('');
    });

    it('shows status message for screen readers', async () => {
        const mockParsedTask = { title: 'Task' };
        (aiApiModule.aiApi.parseTask as Mock).mockResolvedValue(mockParsedTask);
        mockCreateTask.mutateAsync.mockResolvedValue({});

        render(<QuickCapture />);
        const input = screen.getByPlaceholderText(/Ask AI to capture task/i);
        const button = screen.getByRole('button', { name: /Capture task/i });

        // Status region should exist
        const status = screen.getByRole('status');
        expect(status).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'Task' } });
        fireEvent.click(button);

        await waitFor(() => {
             // We can check if the status text updates, but implementation details might vary.
             // For now just ensuring the role exists is good.
             expect(status).toHaveTextContent(/Thinking|captured/i);
        });
    });
});
