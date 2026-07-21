import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationSystem } from '@/app/layout/NavigationSystem';

vi.mock('@/shared/hooks/useMediaQuery', () => ({ useMediaQuery: () => false }));

it.each([
  ['/mvp', 'Home'],
  ['/mvp/weekly-review', 'Week'],
  ['/mvp/today', 'Today'],
  ['/mvp/reflection', 'Reflect'],
  ['/settings', 'Settings'],
] as const)('marks exactly one destination active on %s', (path, label) => {
  render(<MemoryRouter initialEntries={[path]}><NavigationSystem /></MemoryRouter>);
  const active = screen.getAllByRole('link').filter((link) => link.getAttribute('aria-current') === 'page');
  expect(active).toHaveLength(1);
  expect(active[0]).toHaveAccessibleName(label);
});

it('exposes only the five partner destinations', () => {
  render(<MemoryRouter initialEntries={['/mvp']}><NavigationSystem /></MemoryRouter>);
  expect(screen.getAllByRole('link')).toHaveLength(5);
  expect(screen.queryByRole('link', { name: /onboarding|admin|tasks|habits|finances/i })).not.toBeInTheDocument();
});
