import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingFallback, WidgetSkeleton, PageSkeleton } from '../LoadingFallback';

vi.mock('@/shared/ui/Loader', () => ({
  Loader: ({ text }: { text?: string }) => <div data-testid="loader">{text}</div>,
}));

describe('LoadingFallback', () => {
  it('renders with default loading text', () => {
    render(<LoadingFallback />);
    expect(screen.getByTestId('loader')).toBeTruthy();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders with custom text', () => {
    render(<LoadingFallback text="Saving..." />);
    expect(screen.getByText('Saving...')).toBeTruthy();
  });

  it('applies fullScreen classes when fullScreen is true', () => {
    const { container } = render(<LoadingFallback fullScreen />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('min-h-screen');
  });

  it('applies inline classes when fullScreen is false', () => {
    const { container } = render(<LoadingFallback fullScreen={false} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('py-12');
  });
});

describe('WidgetSkeleton', () => {
  it('renders skeleton structure', () => {
    const { container } = render(<WidgetSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
  });
});

describe('PageSkeleton', () => {
  it('renders multiple widget skeletons', () => {
    const { container } = render(<PageSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
    const skeletons = container.querySelectorAll('.glass-panel');
    expect(skeletons.length).toBe(6);
  });
});
