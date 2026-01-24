import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import ProjectsPage from '../index';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAI } from '@/features/ai-assistant/hooks/useAI';

// Mocks
vi.mock('@/features/projects/hooks/useProjects');
vi.mock('@/features/ai-assistant/hooks/useAI');
vi.mock('lucide-react', () => ({
    Plus: () => <span data-testid="icon-plus" />,
    Trash2: () => <span data-testid="icon-trash" />,
    Clock: () => <span data-testid="icon-clock" />,
    Search: () => <span data-testid="icon-search" />,
    Bell: () => <span data-testid="icon-bell" />,
    BarChart3: () => <span data-testid="icon-barchart" />,
}));
vi.mock('@/shared/ui/Loader', () => ({
    Loader: () => <div data-testid="loader">Loading...</div>
}));
vi.mock('../components/ProjectModal', () => ({
    ProjectModal: () => <div data-testid="project-modal">Modal</div>
}));
vi.mock('../components/SwotAnalysis', () => ({
    SwotAnalysis: () => <div data-testid="swot-analysis">SWOT</div>
}));

// Mock Data
const mockProjects = [
    {
        id: '1',
        title: 'Project Alpha',
        status: 'active',
        deadline: '2025-12-31',
        description: 'Test project',
    },
    {
        id: '2',
        title: 'Project Beta',
        status: 'completed',
        deadline: null,
        description: 'Completed project',
    }
];

describe('ProjectsPage', () => {
    beforeEach(() => {
        (useProjects as Mock).mockReturnValue({
            projects: mockProjects,
            isLoading: false,
            createProject: { mutate: vi.fn() },
            deleteProject: { mutate: vi.fn() },
        });

        (useAI as Mock).mockReturnValue({
            generateSwot: { mutateAsync: vi.fn() },
        });
    });

    it('renders header buttons with aria-labels', () => {
        render(<ProjectsPage />);
        expect(screen.getByRole('button', { name: /search projects/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    });

    it('renders project cards with accessible delete buttons', () => {
        render(<ProjectsPage />);

        // Check delete button for Project Alpha
        const deleteBtnAlpha = screen.getByRole('button', { name: /delete project: project alpha/i });
        expect(deleteBtnAlpha).toBeInTheDocument();
        expect(deleteBtnAlpha).toHaveClass('focus-visible:opacity-100');

        // Check delete button for Project Beta
        const deleteBtnBeta = screen.getByRole('button', { name: /delete project: project beta/i });
        expect(deleteBtnBeta).toBeInTheDocument();
    });

    it('renders project titles as accessible buttons (stretched link pattern)', () => {
        render(<ProjectsPage />);

        const titleBtn = screen.getByRole('button', { name: /^project alpha$/i });
        expect(titleBtn).toBeInTheDocument();
        // Check for stretched link class
        expect(titleBtn).toHaveClass('after:absolute', 'after:inset-0');
    });
});
