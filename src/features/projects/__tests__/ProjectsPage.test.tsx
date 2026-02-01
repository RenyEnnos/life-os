import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectsPage from '../index';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAI } from '@/features/ai-assistant/hooks/useAI';

// Mock dependencies
vi.mock('@/features/projects/hooks/useProjects');
vi.mock('@/features/ai-assistant/hooks/useAI');
vi.mock('@/shared/ui/Loader', () => ({
    Loader: () => <div data-testid="loader">Loading...</div>
}));

// Mock Lucide icons
vi.mock('lucide-react', async () => {
    return {
        Plus: () => <span data-testid="icon-plus" />,
        Trash2: () => <span data-testid="icon-trash" />,
        Clock: () => <span data-testid="icon-clock" />,
        Search: () => <span data-testid="icon-search" />,
        Bell: () => <span data-testid="icon-bell" />,
        BarChart3: () => <span data-testid="icon-barchart" />,
    };
});

describe('ProjectsPage', () => {
    it('renders accessible buttons', () => {
        // Setup mocks
        (useProjects as any).mockReturnValue({
            projects: [
                {
                    id: '1',
                    title: 'Test Project',
                    description: 'Description',
                    status: 'active',
                    deadline: new Date().toISOString()
                }
            ],
            isLoading: false,
            createProject: { mutate: vi.fn() },
            deleteProject: { mutate: vi.fn(), isPending: false }
        });

        (useAI as any).mockReturnValue({
            generateSwot: { mutateAsync: vi.fn() }
        });

        render(<ProjectsPage />);

        // Check for header accessible buttons
        expect(screen.getByLabelText('Search projects')).toBeInTheDocument();
        expect(screen.getByLabelText('Notifications')).toBeInTheDocument();

        // Check for accessible delete button
        const deleteBtn = screen.getByLabelText('Delete project: Test Project');
        expect(deleteBtn).toBeInTheDocument();

        // Verify delete button has focus-visible classes
        expect(deleteBtn.className).toContain('focus-visible:opacity-100');
        expect(deleteBtn.className).toContain('focus-visible:ring-2');
    });
});
