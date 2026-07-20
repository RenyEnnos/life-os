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
  NavigationSystem: () => <nav>Navigation</nav>,
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
