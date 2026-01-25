import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, type Mock } from 'vitest';
import ProjectsPage from '../index';
import { useProjects } from '../hooks/useProjects';
import { useAI } from '@/features/ai-assistant/hooks/useAI';

// Mock dependencies
vi.mock('../hooks/useProjects');
vi.mock('@/features/ai-assistant/hooks/useAI');
vi.mock('@/shared/ui/Loader', () => ({
  Loader: () => <div>Loading...</div>
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus" />,
  Trash2: () => <span data-testid="icon-trash" />,
  Clock: () => <span data-testid="icon-clock" />,
  Search: () => <span data-testid="icon-search" />,
  Bell: () => <span data-testid="icon-bell" />,
  BarChart3: () => <span data-testid="icon-barchart" />,
  Target: () => <span data-testid="icon-target" />,
}));

// Mock the ProjectModal component
vi.mock('../components/ProjectModal', () => ({
  ProjectModal: () => <div data-testid="project-modal">Project Modal</div>
}));

// Mock the SwotAnalysis component
vi.mock('../components/SwotAnalysis', () => ({
  SwotAnalysis: () => <div data-testid="swot-analysis">SWOT Analysis</div>
}));

describe('ProjectsPage', () => {
  it('renders projects with accessible delete button', () => {
    const mockProjects = [
      {
        id: '1',
        title: 'Test Project',
        description: 'Desc',
        status: 'active',
        priority: 'high',
        deadline: '2024-01-01',
      },
    ];

    (useProjects as Mock).mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: { mutate: vi.fn() },
      deleteProject: { mutate: vi.fn() },
    });

    (useAI as Mock).mockReturnValue({
      generateSwot: { mutateAsync: vi.fn() },
    });

    render(<ProjectsPage />);

    // Check header buttons
    expect(screen.getByRole('button', { name: /search projects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view notifications/i })).toBeInTheDocument();

    // Check delete button
    const deleteBtn = screen.getByRole('button', { name: /delete project test project/i });
    expect(deleteBtn).toBeInTheDocument();

    // Check for accessibility class
    expect(deleteBtn.className).toContain('focus-visible:opacity-100');

    // Check that correct icon is used (Trash2 mock)
    expect(screen.getByTestId('icon-trash')).toBeInTheDocument();

    // Check SWOT button
    expect(screen.getByRole('button', { name: /generate swot analysis for test project/i })).toBeInTheDocument();
  });
});
