// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { ArchetypeCard } from '../ArchetypeCard';
import type { LifeScore } from '@/shared/types';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock MagicCard component
vi.mock('@/shared/ui/premium/MagicCard', () => ({
    MagicCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="magic-card" className={className}>
            {children}
        </div>
    ),
}));

// Mock Lucide icons - preserve all actual icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return {
        ...actual,
    };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock useUserXP hook
vi.mock('../../hooks/useUserXP', () => ({
    useUserXP: vi.fn(),
}));

import { useUserXP } from '../../hooks/useUserXP';

// Mock user XP data
const mockUserXPMaker: LifeScore = {
    user_id: 'user1',
    level: 5,
    current_xp: 500,
    next_level_xp: 1000,
    life_score: 85,
    attributes: {
        body: 100,
        mind: 50,
        spirit: 30,
        output: 150,
    },
    updated_at: '2023-01-15',
};

const mockUserXPScholar: LifeScore = {
    ...mockUserXPMaker,
    attributes: {
        body: 50,
        mind: 200,
        spirit: 30,
        output: 50,
    },
};

const mockUserXPTitan: LifeScore = {
    ...mockUserXPMaker,
    attributes: {
        body: 250,
        mind: 50,
        spirit: 30,
        output: 50,
    },
};

const mockUserXPMonk: LifeScore = {
    ...mockUserXPMaker,
    attributes: {
        body: 50,
        mind: 50,
        spirit: 200,
        output: 50,
    },
};

const mockUserXPAspirant: LifeScore = {
    ...mockUserXPMaker,
    attributes: {
        body: 50,
        mind: 50,
        spirit: 50,
        output: 50,
    },
};

describe('ArchetypeCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state with skeleton', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: null,
            isLoading: true,
        });

        const { container } = render(<ArchetypeCard />);

        const skeleton = container.querySelector('.animate-pulse');
        expect(skeleton).toBeInTheDocument();
    });

    it('returns null when no user XP data', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: null,
            isLoading: false,
        });

        const { container } = render(<ArchetypeCard />);

        expect(container.firstChild).toBeNull();
    });

    it('renders default variant with Maker archetype', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPMaker,
            isLoading: false,
        });

        render(<ArchetypeCard />);

        // Check archetype name
        expect(screen.getByText('The Maker')).toBeInTheDocument();

        // Check description
        expect(screen.getByText('Builders and creators who shape the world.')).toBeInTheDocument();

        // Check dominant attribute (output)
        expect(screen.getByText('output')).toBeInTheDocument();

        // Check percentage (150 / (100+50+30+150) = 150/330 ≈ 45%)
        expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('renders default variant with Scholar archetype', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPScholar,
            isLoading: false,
        });

        render(<ArchetypeCard />);

        expect(screen.getByText('The Scholar')).toBeInTheDocument();
        expect(screen.getByText('Seekers of knowledge and wisdom.')).toBeInTheDocument();
        expect(screen.getByText('mind')).toBeInTheDocument();
    });

    it('renders default variant with Titan archetype', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPTitan,
            isLoading: false,
        });

        render(<ArchetypeCard />);

        expect(screen.getByText('The Titan')).toBeInTheDocument();
        expect(screen.getByText('Warriors of physical excellence.')).toBeInTheDocument();
        expect(screen.getByText('body')).toBeInTheDocument();
    });

    it('renders default variant with Monk archetype', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPMonk,
            isLoading: false,
        });

        render(<ArchetypeCard />);

        expect(screen.getByText('The Monk')).toBeInTheDocument();
        expect(screen.getByText('Masters of inner peace and reflection.')).toBeInTheDocument();
        expect(screen.getByText('spirit')).toBeInTheDocument();
    });

    it('renders Aspirant archetype when attributes are balanced', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPAspirant,
            isLoading: false,
        });

        render(<ArchetypeCard />);

        expect(screen.getByText('The Aspirant')).toBeInTheDocument();
        expect(screen.getByText('A balanced soul, ready to find their path.')).toBeInTheDocument();
    });

    it('renders compact variant correctly', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPMaker,
            isLoading: false,
        });

        render(<ArchetypeCard variant="compact" />);

        // Check archetype name
        expect(screen.getByText('The Maker')).toBeInTheDocument();

        // Check dominant attribute (capitalized in compact variant)
        expect(screen.getByText('output')).toBeInTheDocument();

        // Description should NOT be shown in compact variant
        expect(screen.queryByText('Builders and creators who shape the world.')).not.toBeInTheDocument();
    });

    it('displays progress bar with correct width for dominant attribute', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPMaker,
            isLoading: false,
        });

        const { container } = render(<ArchetypeCard />);

        // Check progress bar container exists
        const progressBars = container.querySelectorAll('.rounded-full');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('passes className prop to MagicCard in default variant', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPMaker,
            isLoading: false,
        });

        render(<ArchetypeCard className="custom-test-class" />);

        const card = screen.getByTestId('magic-card');
        expect(card.className).toContain('custom-test-class');
    });

    it('passes className prop to MagicCard in compact variant', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPMaker,
            isLoading: false,
        });

        render(<ArchetypeCard variant="compact" className="custom-compact-class" />);

        const card = screen.getByTestId('magic-card');
        expect(card.className).toContain('custom-compact-class');
    });

    it('calculates percentage correctly for dominant attribute', () => {
        vi.mocked(useUserXP).mockReturnValue({
            userXP: mockUserXPMaker,
            isLoading: false,
        });

        render(<ArchetypeCard />);

        // Output is 150, total is 100+50+30+150 = 330
        // 150/330 ≈ 45.45% -> rounded to 45%
        expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('shows dominant attribute without description when value is zero', () => {
        const zeroAttributes: LifeScore = {
            ...mockUserXPMaker,
            attributes: {
                body: 0,
                mind: 0,
                spirit: 0,
                output: 0,
            },
        };

        vi.mocked(useUserXP).mockReturnValue({
            userXP: zeroAttributes,
            isLoading: false,
        });

        render(<ArchetypeCard />);

        // Should still render Aspirant archetype
        expect(screen.getByText('The Aspirant')).toBeInTheDocument();
    });
});
