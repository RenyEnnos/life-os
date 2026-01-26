import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ProjectsPage from '../index';

// Mock the hooks
vi.mock('@/features/projects/hooks/useProjects', () => ({
    useProjects: () => ({
        projects: [
            {
                id: 'p1',
                title: 'Test Project 1',
                description: 'Description 1',
                status: 'active',
                priority: 'high',
                deadline: new Date().toISOString(),
            }
        ],
        isLoading: false,
        createProject: { mutate: vi.fn() },
        deleteProject: { mutate: vi.fn() },
    }),
}));

vi.mock('@/features/ai-assistant/hooks/useAI', () => ({
    useAI: () => ({
        generateSwot: { mutateAsync: vi.fn() },
    }),
}));

describe('ProjectsPage Accessibility', () => {
    it('should have accessible header buttons', () => {
        render(<ProjectsPage />);

        // Should find Search button by accessible name
        // This will fail until aria-label="Search" is added
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();

        // Should find Notifications/Bell button by accessible name
        // This will fail until aria-label="Notifications" is added
        expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    });

    it('should have accessible delete project button', () => {
        render(<ProjectsPage />);

        // Should find delete button by accessible name
        const deleteBtn = screen.getByRole('button', { name: /delete project/i });
        expect(deleteBtn).toBeInTheDocument();

        // Should have focus-visible class for keyboard accessibility
        // This will fail until the class is added
        expect(deleteBtn).toHaveClass('focus-visible:opacity-100');
    });
});
