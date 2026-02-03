import { render, screen } from '@testing-library/react';
import { JournalEditor } from '../JournalEditor';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

// Mock dependencies
vi.mock('lucide-react', () => ({
    Save: () => <span data-testid="save-icon">Save</span>,
    X: () => <span data-testid="x-icon">X</span>,
    Sparkles: () => <span data-testid="sparkles-icon">Sparkles</span>,
    BrainCircuit: () => <span data-testid="brain-icon">Brain</span>,
    Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
    Hash: () => <span data-testid="hash-icon">Hash</span>,
    ArrowLeft: () => <span data-testid="arrow-left-icon">Back</span>
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: { children?: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
        span: ({ children, className }: { children?: React.ReactNode; className?: string }) => <span className={className}>{children}</span>
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

vi.mock('@tanstack/react-query', () => ({
    useMutation: () => ({ mutate: vi.fn(), isPending: false }),
    useQueryClient: () => ({ invalidateQueries: vi.fn() })
}));

vi.mock('react-hot-toast', () => ({
    toast: { success: vi.fn(), error: vi.fn() }
}));

vi.mock('../api/journal.api', () => ({
    journalApi: { analyzeEntry: vi.fn() }
}));

vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: { mutateAsync: vi.fn() }
    })
}));

describe('JournalEditor Accessibility', () => {
    const mockProps = {
        onSave: vi.fn(),
        onCancel: vi.fn(),
        entry: {
            id: '123',
            user_id: 'u1',
            title: 'Test Entry',
            content: 'This is a test entry content.',
            entry_date: '2025-01-01',
            tags: ['test-tag'],
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z'
        }
    };

    it('renders necessary accessibility labels', () => {
        render(<JournalEditor {...mockProps} />);

        // Check for "Go back" button - using getByRole to ensure it's accessible
        expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();

        // Check for inputs by label
        expect(screen.getByLabelText(/entry date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/entry title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/new tag/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/journal content/i)).toBeInTheDocument();
    });

    it('renders remove tag button with accessible label', () => {
        render(<JournalEditor {...mockProps} />);

        // The tag "test-tag" should have a remove button
        expect(screen.getByRole('button', { name: /remove tag test-tag/i })).toBeInTheDocument();
    });
});
