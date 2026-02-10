import { render, screen, fireEvent } from '@testing-library/react';
import { JournalEditor } from '../JournalEditor';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { JournalEntry } from '@/shared/types';
import React from 'react';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Save: () => <div data-testid="save-icon" />,
    X: () => <div data-testid="x-icon" />,
    Sparkles: () => <div data-testid="sparkles-icon" />,
    BrainCircuit: () => <div data-testid="brain-icon" />,
    Calendar: () => <div data-testid="calendar-icon" />,
    Hash: () => <div data-testid="hash-icon" />,
    ArrowLeft: () => <div data-testid="arrow-left-icon" />
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: React.ComponentProps<'div'>) => (
            <div className={className} data-testid="motion-div" {...props}>{children}</div>
        ),
        span: ({ children, className, ...props }: React.ComponentProps<'span'>) => (
            <span className={className} data-testid="motion-span" {...props}>{children}</span>
        )
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock Hooks
const mockGenerateTags = { mutateAsync: vi.fn().mockResolvedValue({ tags: ['new-tag'] }) };
const mockInvalidateQueries = vi.fn();

vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateTags: mockGenerateTags
    })
}));

vi.mock('@tanstack/react-query', () => ({
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries
    }),
    useMutation: ({ onSuccess }: { onSuccess?: (data: unknown) => void }) => ({
        mutate: vi.fn().mockImplementation(() => {
            if (onSuccess) onSuccess({ content: { sentiment: 'positive', keywords: [], advice: '', mood_score: 8 } });
        }),
        isPending: false
    })
}));

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

vi.mock('../api/journal.api', () => ({
    journalApi: {
        analyzeEntry: vi.fn()
    }
}));

describe('JournalEditor', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();
    const defaultProps = {
        onSave: mockOnSave,
        onCancel: mockOnCancel
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<JournalEditor {...defaultProps} />);
        expect(screen.getByPlaceholderText('Untitled Entry')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Start writing...')).toBeInTheDocument();
    });

    it('renders existing entry data', () => {
        const entry: JournalEntry = {
            id: '1',
            user_id: 'user1',
            entry_date: '2023-01-01',
            title: 'My Journal',
            content: 'Today was great.',
            tags: ['happy', 'coding'],
            created_at: '2023-01-01T10:00:00Z'
        };
        render(<JournalEditor {...defaultProps} entry={entry} />);
        expect(screen.getByDisplayValue('My Journal')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Today was great.')).toBeInTheDocument();
        expect(screen.getByText('happy')).toBeInTheDocument();
        expect(screen.getByText('coding')).toBeInTheDocument();
    });

    it('calls onCancel when back button is clicked', () => {
        render(<JournalEditor {...defaultProps} />);
        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton!);
        expect(mockOnCancel).toHaveBeenCalled();
    });

    // Failing tests (until fixes applied)
    it('has accessible label for back button', () => {
        render(<JournalEditor {...defaultProps} />);
        // This will fail if aria-label is missing
        expect(screen.getByRole('button', { name: /back|cancel/i })).toBeInTheDocument();
    });

    it('has accessible label for remove tag button', () => {
        const entry: JournalEntry = {
            id: '1',
            user_id: 'user1',
            entry_date: '2023-01-01',
            tags: ['test-tag'],
            created_at: '2023-01-01T10:00:00Z'
        };
        render(<JournalEditor {...defaultProps} entry={entry} />);

        // This will fail if aria-label is missing
        const removeButtons = screen.getAllByRole('button', { name: /remove tag test-tag/i });
        expect(removeButtons.length).toBeGreaterThan(0);
    });

    it('has accessible labels for inputs', () => {
        render(<JournalEditor {...defaultProps} />);
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/add a tag/i)).toBeInTheDocument();
    });

    it('remove tag button becomes visible on focus', () => {
        const entry: JournalEntry = {
            id: '1',
            user_id: 'user1',
            entry_date: '2023-01-01',
            tags: ['test-tag'],
            created_at: '2023-01-01T10:00:00Z'
        };
        render(<JournalEditor {...defaultProps} entry={entry} />);
        const removeButton = screen.getByRole('button', { name: /remove tag test-tag/i });
        expect(removeButton.className).toContain('focus-visible:opacity-100');
    });
});
