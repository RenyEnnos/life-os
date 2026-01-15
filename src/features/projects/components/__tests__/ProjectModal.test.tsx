import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectModal } from '../ProjectModal';
import { vi, describe, it, expect } from 'vitest';

// Mock apiFetch since ProjectModal uses it
vi.mock('@/shared/api/http', () => ({
  apiFetch: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ProjectModal Accessibility', () => {
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  it('has correct dialog roles and attributes', () => {
    render(<ProjectModal onClose={onClose} onSubmit={onSubmit} />);
    // This is expected to fail initially as role="dialog" is missing
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // We expect it to be labelled by the title
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('closes on Escape key', () => {
    render(<ProjectModal onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on backdrop click', () => {
    render(<ProjectModal onClose={onClose} onSubmit={onSubmit} />);
    // In our implementation plan, we will add role="dialog" to the backdrop
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close on content click', () => {
    onClose.mockClear();
    render(<ProjectModal onClose={onClose} onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/Nome do Projeto/i);
    fireEvent.click(input);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shuffle button is accessible', () => {
    render(<ProjectModal onClose={onClose} onSubmit={onSubmit} />);
    // This expects the new aria-label we are planning to add
    const button = screen.getByRole('button', { name: /shuffle cover image/i });
    expect(button).toBeInTheDocument();
    // Check for focus visibility class
    expect(button.className).toContain('focus-visible:opacity-100');
  });
});
