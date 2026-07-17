import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MvpSurfacePage } from '@/features/mvp/pages/MvpSurfacePage';
import { createEmptyWorkspace } from '@/features/mvp/lib/state';
import { useMvpStore } from '@/features/mvp/store/useMvpStore';

const { getAdminOverview } = vi.hoisted(() => ({ getAdminOverview: vi.fn() }));

vi.mock('@/features/mvp/api/mvp.api', () => ({
  mvpApi: { getAdminOverview },
}));

describe('MVP admin surface', () => {
  beforeEach(() => {
    getAdminOverview.mockReset();
  });

  it('renders only the protected overview and does not hydrate or expose reset controls', async () => {
    const workspace = createEmptyWorkspace();
    const hydrateWorkspace = vi.fn();
    useMvpStore.setState({ hydrateWorkspace });
    getAdminOverview.mockResolvedValue({
      analytics: { ...workspace.analytics, onboardingCompleted: true },
      events: [{ id: 'event-1', type: 'user_feedback_submitted', createdAt: '2026-07-17T12:00:00.000Z' }],
      feedback: [{ id: 'feedback-1', rating: 4, message: 'Useful signal.', createdAt: '2026-07-17T12:00:00.000Z' }],
    });

    render(
      <MemoryRouter>
        <MvpSurfacePage surface="admin" />
      </MemoryRouter>
    );

    expect(await screen.findByText('Useful signal.')).toBeInTheDocument();
    expect(screen.getByText('user_feedback_submitted')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset mvp workspace/i })).not.toBeInTheDocument();
    expect(hydrateWorkspace).not.toHaveBeenCalled();
    expect(getAdminOverview).toHaveBeenCalledOnce();
  });
});
