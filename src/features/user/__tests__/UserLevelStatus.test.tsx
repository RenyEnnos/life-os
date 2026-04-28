// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { UserLevelStatus } from '../components/UserLevelStatus';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/features/gamification/hooks/useUserXP', () => ({
    useUserXP: vi.fn(),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        circle: ({ children, ...props }: any) => <circle {...props}>{children}</circle>,
    },
}));

vi.mock('@/shared/lib/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('UserLevelStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading skeleton when loading', async () => {
        const { useUserXP } = await import('@/features/gamification/hooks/useUserXP');
        vi.mocked(useUserXP).mockReturnValue({ userXP: null, isLoading: true } as any);

        const { container } = render(<UserLevelStatus />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders level badge when loaded', async () => {
        const { useUserXP } = await import('@/features/gamification/hooks/useUserXP');
        vi.mocked(useUserXP).mockReturnValue({
            userXP: { level: 5, current_xp: 150, xp_to_next_level: 300 },
            isLoading: false,
        } as any);

        render(<UserLevelStatus />);
        expect(screen.getByText('L5')).toBeInTheDocument();
    });

    it('applies custom className', async () => {
        const { useUserXP } = await import('@/features/gamification/hooks/useUserXP');
        vi.mocked(useUserXP).mockReturnValue({
            userXP: { level: 1, current_xp: 10, xp_to_next_level: 100 },
            isLoading: false,
        } as any);

        const { container } = render(<UserLevelStatus className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
