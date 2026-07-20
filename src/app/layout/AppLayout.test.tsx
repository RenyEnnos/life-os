import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AppLayout } from '@/app/layout/AppLayout';

vi.mock('@/shared/lib/platform', () => ({
  isDesktopApp: () => false,
}));

vi.mock('@/features/onboarding/OnboardingModal', () => ({
  OnboardingModal: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div>Legacy onboarding overlay</div> : null,
}));

vi.mock('@/app/layout/NavigationSystem', () => ({
  NavigationSystem: () => <nav aria-label="Navigation">Navigation</nav>,
}));

it('does not mount the legacy onboarding over the canonical web loop', async () => {
  window.scrollTo = vi.fn();
  localStorage.removeItem('life-os-onboarding-completed');

  render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>
  );

  expect(screen.queryByText('Legacy onboarding overlay')).not.toBeInTheDocument();
});

it('reserves mobile content clearance without a second fixed navigation wrapper', () => {
  window.scrollTo = vi.fn();

  const { container } = render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>
  );

  const [, navigation] = screen.getAllByRole('navigation', { name: 'Navigation' });
  expect(navigation.parentElement?.parentElement).not.toHaveClass('fixed');
  expect(container.querySelector('main > div')).toHaveClass(
    'pb-32',
    'md:pb-0'
  );
});
