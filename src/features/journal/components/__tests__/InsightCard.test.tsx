import { render, screen } from '@testing-library/react';
import { InsightCard } from '../InsightCard';
import { describe, it, expect, vi } from 'vitest';
import type { JournalInsightContent } from '@/shared/types';
import React from 'react';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    BrainCircuit: () => <div data-testid="brain-icon" />,
    Sparkles: () => <div data-testid="sparkles-icon" />,
    Activity: () => <div data-testid="activity-icon" />
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
            <div className={className}>{children}</div>
        )
    }
}));

const mockContent: JournalInsightContent = {
    sentiment: "Reflective and calm",
    keywords: ["peace", "growth", "mindfulness"],
    advice: "Take a deep breath and continue your journey.",
    mood_score: 8,
    correlation_hypothesis: "Morning meditation likely improved focus."
};

describe('InsightCard', () => {
    it('renders mood score correctly', () => {
        render(<InsightCard content={mockContent} />);
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('/10')).toBeInTheDocument();
    });

    it('renders sentiment text', () => {
        render(<InsightCard content={mockContent} />);
        expect(screen.getByText('"Reflective and calm"')).toBeInTheDocument();
    });

    it('renders advice', () => {
        render(<InsightCard content={mockContent} />);
        expect(screen.getByText('Take a deep breath and continue your journey.')).toBeInTheDocument();
    });

    it('renders all keywords', () => {
        render(<InsightCard content={mockContent} />);
        mockContent.keywords.forEach(keyword => {
            expect(screen.getByText(`#${keyword}`)).toBeInTheDocument();
        });
    });

    it('renders headers and icons', () => {
        render(<InsightCard content={mockContent} />);
        expect(screen.getByText('Neural Resonance')).toBeInTheDocument();
        expect(screen.getByText('Nexus Advice')).toBeInTheDocument();
        expect(screen.getByTestId('brain-icon')).toBeInTheDocument();
    });
});
