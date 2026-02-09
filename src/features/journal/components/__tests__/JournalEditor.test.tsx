import { render, screen } from '@testing-library/react';
import { JournalEditor } from '../JournalEditor';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

// Mock dependencies
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
        div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
            <div className={className}>{children}</div>
        ),
        span: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
            <span className={className}>{children}</span>
        )
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

vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: { mutateAsync: vi.fn() }
    })
}));

vi.mock('../api/journal.api', () => ({
    journalApi: { analyzeEntry: vi.fn() }
}));

// Mock InsightCard to avoid complexity
vi.mock('../InsightCard', () => ({
    InsightCard: () => <div data-testid="insight-card" />
}));

describe('JournalEditor', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders editor elements with accessibility labels', () => {
        render(<JournalEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

        // Inputs should be accessible via label
        expect(screen.getByLabelText('Journal Title')).toBeInTheDocument();
        expect(screen.getByLabelText('Journal Content')).toBeInTheDocument();
        expect(screen.getByLabelText('Select Date')).toBeInTheDocument();
        expect(screen.getByLabelText('Add new tag')).toBeInTheDocument();

        // Buttons should be accessible via name (aria-label)
        expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });

    it('renders tags with accessible remove buttons', () => {
        const entry = {
            id: '1',
            user_id: 'u1',
            title: 'Test Entry',
            content: 'Test content',
            tags: ['tag1'],
            entry_date: '2023-01-01',
            created_at: '2023-01-01'
        };

        render(<JournalEditor entry={entry} onSave={mockOnSave} onCancel={mockOnCancel} />);

        // Check for specific tag remove button
        const removeBtn = screen.getByRole('button', { name: 'Remove tag tag1' });
        expect(removeBtn).toBeInTheDocument();

        // Verify focus-visible classes are present for keyboard accessibility
        expect(removeBtn.className).toContain('focus-visible:opacity-100');
    });
});
