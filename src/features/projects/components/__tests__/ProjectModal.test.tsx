import { render, screen } from '@testing-library/react';
import { ProjectModal } from '../ProjectModal';
import { vi, describe, it, expect } from 'vitest';

// Mock apiFetch
vi.mock('@/shared/api/http', () => ({
  apiFetch: vi.fn(),
}));

// Mock ResizeObserver for any layout dependencies
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ProjectModal Accessibility', () => {
  it('should have accessible form elements', () => {
    render(<ProjectModal onClose={() => {}} onSubmit={() => {}} />);

    // Check for accessible inputs

    // Title input
    expect(screen.getByRole('textbox', { name: /project title/i })).toBeInTheDocument();

    // Description input
    expect(screen.getByRole('textbox', { name: /project description/i })).toBeInTheDocument();

    // Status select
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();

    // Priority select
    expect(screen.getByLabelText(/prioridade/i)).toBeInTheDocument();

    // Deadline input
    expect(screen.getByLabelText(/prazo \(opcional\)/i)).toBeInTheDocument();

    // Shuffle button
    expect(screen.getByRole('button', { name: /shuffle cover image/i })).toBeInTheDocument();
  });
});
