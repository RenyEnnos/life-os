import { render, screen } from '@testing-library/react';
import { JournalEditor } from '../JournalEditor';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

// Mocks
vi.mock('lucide-react', () => ({
    Save: () => <div data-testid="save-icon" />,
    X: () => <div data-testid="x-icon" />,
    Sparkles: () => <div data-testid="sparkles-icon" />,
    BrainCircuit: () => <div data-testid="brain-icon" />,
    Calendar: () => <div data-testid="calendar-icon" />,
    Hash: () => <div data-testid="hash-icon" />,
    ArrowLeft: () => <div data-testid="arrow-left-icon" />
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: { children?: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
        span: ({ children, className }: { children?: React.ReactNode; className?: string }) => <span className={className}>{children}</span>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: {
            mutateAsync: vi.fn(),
        }
    })
}));

vi.mock('../api/journal.api', () => ({
    journalApi: {
        analyzeEntry: vi.fn(),
    }
}));

vi.mock('@tanstack/react-query', () => ({
    useMutation: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
    useQueryClient: () => ({
        invalidateQueries: vi.fn(),
    })
}));

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    }
}));

vi.mock('../InsightCard', () => ({
    InsightCard: () => <div data-testid="insight-card" />
}));

describe('JournalEditor Accessibility', () => {
    const defaultProps = {
        onSave: vi.fn(),
        onCancel: vi.fn(),
        entry: {
            id: '1',
            user_id: 'user1',
            title: 'Test Entry',
            content: 'Test Content',
            entry_date: '2023-01-01',
            tags: ['test-tag'],
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
        }
    };

    it('has accessible buttons and inputs', () => {
        render(<JournalEditor {...defaultProps} />);

        // Check Back Button
        const backButton = screen.getByRole('button', { name: /go back/i });
        expect(backButton).toBeInTheDocument();

        // Check Date Input
        const dateInput = screen.getByLabelText(/entry date/i);
        expect(dateInput).toBeInTheDocument();

        // Check Title Input
        const titleInput = screen.getByLabelText(/entry title/i);
        expect(titleInput).toBeInTheDocument();

        // Check Tag Input
        const tagInput = screen.getByLabelText(/add new tag/i);
        expect(tagInput).toBeInTheDocument();

        // Check Remove Tag Button
        const removeTagButtons = screen.getAllByRole('button', { name: /remove tag test-tag/i });
        expect(removeTagButtons.length).toBeGreaterThan(0);
    });
});
