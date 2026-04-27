import { create } from 'zustand';

import { mvpApi } from '@/features/mvp/api/mvp.api';
import { createEmptyWorkspace } from '@/features/mvp/lib/state';
import { captureMvpError, MvpTelemetryEvents, trackMvpEvent } from '@/features/mvp/lib/telemetry';
import type {
  MvpAnalyticsSnapshot,
  MvpDailyCheckIn,
  MvpOnboardingDraft,
  MvpPlan,
  MvpReviewDraft,
  MvpWorkspaceSnapshot,
} from '@/features/mvp/types';

function createInitialState() {
  return createEmptyWorkspace();
}

export interface MvpStoreState extends MvpWorkspaceSnapshot {
  isHydrating: boolean;
  error: string | null;
  hydrateWorkspace: (force?: boolean) => Promise<void>;
  saveOnboarding: (input: Omit<MvpOnboardingDraft, 'completedAt'>) => Promise<void>;
  runWeeklyReview: (input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>) => Promise<void>;
  confirmPlan: () => Promise<void>;
  updateActionStatus: (
    priorityId: string,
    actionId: string,
    patch: Partial<MvpPlan['priorities'][number]['actions'][number]>
  ) => Promise<void>;
  saveDailyCheckIn: (input: Omit<MvpDailyCheckIn, 'createdAt'>) => Promise<void>;
  addReflection: (period: 'daily' | 'weekly', body: string) => Promise<void>;
  submitFeedback: (rating: number, message: string) => Promise<void>;
  resetWorkspace: () => Promise<void>;
  getAnalytics: () => MvpAnalyticsSnapshot;
}

function applyWorkspace(snapshot: MvpWorkspaceSnapshot) {
  return {
    ...snapshot,
    error: null,
    isHydrating: false,
  };
}

const initialState = createInitialState();

export const useMvpStore = create<MvpStoreState>()((set, get) => ({
  ...initialState,
  isHydrating: false,
  error: null,

  hydrateWorkspace: async (force = false) => {
    if (get().isHydrating) {
      return;
    }
    if (!force && (get().events.length > 0 || get().onboarding.completedAt || get().plan.generatedAt)) {
      return;
    }

    set({ isHydrating: true, error: null });
    try {
      const snapshot = await mvpApi.getWorkspace();
      set(applyWorkspace(snapshot));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load MVP workspace.';
      captureMvpError(error, 'hydrate_workspace');
      set({ isHydrating: false, error: message });
    }
  },

  saveOnboarding: async (input) => {
    try {
      const snapshot = await mvpApi.saveOnboarding(input);
      set(applyWorkspace(snapshot));
      trackMvpEvent(MvpTelemetryEvents.ACTIVATION_COMPLETED, {
        goals_count: input.goals.length,
        commitments_count: input.commitments.length,
        constraints_count: input.constraints.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save onboarding.';
      captureMvpError(error, 'save_onboarding');
      set({ error: message });
    }
  },

  runWeeklyReview: async (input) => {
    try {
      const snapshot = await mvpApi.generateWeeklyPlan(input);
      set(applyWorkspace(snapshot));
      trackMvpEvent(MvpTelemetryEvents.WEEKLY_REVIEW_COMPLETED, {
        wins_count: input.wins.length,
        unfinished_count: input.unfinishedWork.length,
        constraints_count: input.constraints.length,
        energy_level: input.energyLevel,
      });
      trackMvpEvent(MvpTelemetryEvents.WEEKLY_PLAN_GENERATED, {
        priorities_count: snapshot.plan.priorities.length,
        actions_count: snapshot.plan.priorities.reduce((sum, priority) => sum + priority.actions.length, 0),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate weekly plan.';
      captureMvpError(error, 'run_weekly_review');
      set({ error: message });
    }
  },

  confirmPlan: async () => {
    const planId = get().plan.id;
    if (!planId) {
      return;
    }
    try {
      const snapshot = await mvpApi.confirmPlan(planId);
      set(applyWorkspace(snapshot));
      trackMvpEvent(MvpTelemetryEvents.WEEKLY_PLAN_CONFIRMED, {
        plan_id: planId,
        priorities_count: snapshot.plan.priorities.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to confirm weekly plan.';
      captureMvpError(error, 'confirm_plan', { planId });
      set({ error: message });
    }
  },

  updateActionStatus: async (_priorityId, actionId, patch) => {
    try {
      const snapshot = await mvpApi.updateActionStatus(actionId, {
        note: typeof patch.note === 'string' ? patch.note : undefined,
        status:
          patch.status === 'todo' || patch.status === 'done' || patch.status === 'deferred'
            ? patch.status
            : undefined,
      });
      set(applyWorkspace(snapshot));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update action status.';
      captureMvpError(error, 'update_action_status', { actionId, status: patch.status });
      set({ error: message });
    }
  },

  saveDailyCheckIn: async (input) => {
    try {
      const snapshot = await mvpApi.saveDailyCheckIn(input);
      set(applyWorkspace(snapshot));
      trackMvpEvent(MvpTelemetryEvents.DAILY_CHECKIN_COMPLETED, {
        energy: input.energy,
        focus: input.focus,
        has_blockers: Boolean(input.blockers.trim()),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save daily check-in.';
      captureMvpError(error, 'save_daily_checkin', { date: input.date });
      set({ error: message });
    }
  },

  addReflection: async (period, body) => {
    try {
      const snapshot = await mvpApi.addReflection({ period, body });
      set(applyWorkspace(snapshot));
      trackMvpEvent(MvpTelemetryEvents.REFLECTION_COMPLETED, {
        period,
        body_length: body.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save reflection.';
      captureMvpError(error, 'add_reflection', { period });
      set({ error: message });
    }
  },

  submitFeedback: async (rating, message) => {
    try {
      const snapshot = await mvpApi.submitFeedback({ rating, message });
      set(applyWorkspace(snapshot));
      trackMvpEvent(MvpTelemetryEvents.USER_FEEDBACK_SUBMITTED, {
        rating,
        message_length: message.length,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Failed to submit feedback.';
      captureMvpError(error, 'submit_feedback', { rating });
      set({ error: detail });
    }
  },

  resetWorkspace: async () => {
    try {
      const snapshot = await mvpApi.resetWorkspace();
      set(applyWorkspace(snapshot));
    } catch {
      set({
        ...createInitialState(),
        isHydrating: false,
        error: null,
      });
    }
  },

  getAnalytics: () => get().analytics,
}));
