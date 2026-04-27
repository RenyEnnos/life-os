import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { MvpSurfacePage } from '@/features/mvp/pages/MvpSurfacePage';
import { useMvpStore } from '@/features/mvp/store/useMvpStore';

function renderSurface(surface: Parameters<typeof MvpSurfacePage>[0]['surface']) {
  return render(
    <MemoryRouter>
      <MvpSurfacePage surface={surface} />
    </MemoryRouter>
  );
}

describe('MVP loop integration', () => {
  beforeEach(async () => {
    localStorage.clear();
    window.gtag = vi.fn() as typeof window.gtag;
    await useMvpStore.getState().resetWorkspace();
  });

  it('moves through the MVP loop and emits production telemetry events', { timeout: 15000 }, async () => {
    const user = userEvent.setup({ delay: null });

    const onboardingView = renderSurface('onboarding');

    await user.type(screen.getByPlaceholderText('Display name'), 'Pedro');
    await user.type(screen.getByPlaceholderText('Role'), 'Founder');
    await user.type(screen.getByPlaceholderText('Life season'), 'Building the first design-partner loop');
    await user.type(screen.getByPlaceholderText('Success definition for this season'), 'Turn intent into a clear week.');
    await user.type(screen.getByPlaceholderText('Goals, one per line'), 'Ship MVP\nRun design partner');
    await user.type(screen.getByPlaceholderText('Recurring commitments, one per line'), 'Family logistics');
    await user.type(screen.getByPlaceholderText('Constraints or realities, one per line'), 'School pickup twice a week');
    await user.click(screen.getByRole('button', { name: 'Save intake' }));

    await waitFor(() => {
      expect(useMvpStore.getState().onboarding.completedAt).toBeTruthy();
    });
    onboardingView.unmount();

    const weeklyReviewView = renderSurface('weekly-review');

    await user.type(screen.getByPlaceholderText('Primary focus area'), 'Activation');
    await user.clear(screen.getByPlaceholderText('Energy level 1-5'));
    await user.type(screen.getByPlaceholderText('Energy level 1-5'), '4');
    await user.type(screen.getByPlaceholderText('Unfinished work still pulling attention, one per line'), 'Confirm landing page copy');
    await user.type(screen.getByPlaceholderText('Notes that should shape the plan'), 'Keep the week narrow.');
    await user.click(screen.getByRole('button', { name: 'Generate weekly plan' }));

    expect(await screen.findByText('Generated weekly plan')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm weekly plan' }));
    await waitFor(() => {
      expect(useMvpStore.getState().plan.confirmedAt).toBeTruthy();
    });
    weeklyReviewView.unmount();

    renderSurface('today');

    expect(await screen.findByText('Daily execution board')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Complete' })[0]);

    await user.clear(screen.getByPlaceholderText('Execution note'));
    await user.type(screen.getByPlaceholderText('Execution note'), 'Focused block booked for the first action.');
    await user.click(screen.getByRole('button', { name: 'Save daily check-in' }));

    await waitFor(() => {
      const analytics = useMvpStore.getState().getAnalytics();
      expect(analytics.completedActions).toBe(1);
      expect(analytics.dailyCheckIns).toBe(1);
    });

    const todayView = screen.getByText('Daily execution board');
    expect(todayView).toBeInTheDocument();

    renderSurface('reflection');

    await user.type(screen.getByPlaceholderText('Daily reflection'), 'The daily loop stayed clear.');
    await user.click(screen.getByRole('button', { name: 'Save daily reflection' }));
    await user.type(screen.getByPlaceholderText('What created clarity or friction?'), 'Weekly plan confirmation made execution obvious.');
    await user.click(screen.getByRole('button', { name: 'Submit feedback' }));
    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'mvp_user_feedback_submitted',
        expect.objectContaining({ product_area: 'mvp', rating: 4 })
      );
    });

    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'mvp_activation_completed',
      expect.objectContaining({ product_area: 'mvp', goals_count: 2 })
    );
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'mvp_weekly_review_completed',
      expect.objectContaining({ product_area: 'mvp', energy_level: 4 })
    );
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'mvp_weekly_plan_generated',
      expect.objectContaining({ product_area: 'mvp' })
    );
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'mvp_weekly_plan_confirmed',
      expect.objectContaining({ product_area: 'mvp' })
    );
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'mvp_daily_checkin_completed',
      expect.objectContaining({ product_area: 'mvp', energy: 3, focus: 3 })
    );
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'mvp_reflection_completed',
      expect.objectContaining({ product_area: 'mvp', period: 'daily' })
    );
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'mvp_user_feedback_submitted',
      expect.objectContaining({ product_area: 'mvp', rating: 4 })
    );
  });
});
