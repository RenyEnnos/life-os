import type {
  MvpAnalyticsSnapshot,
  MvpEvent,
  MvpOnboardingDraft,
  MvpPlan,
  MvpReviewDraft,
  MvpWorkspaceSnapshot,
} from './types';

export const initialOnboardingDraft: MvpOnboardingDraft = {
  displayName: '',
  role: '',
  lifeSeason: '',
  planningPain: '',
  successDefinition: '',
  goals: [],
  commitments: [],
  constraints: [],
  completedAt: null,
};

export const initialReviewDraft: MvpReviewDraft = {
  wins: [],
  unfinishedWork: [],
  constraints: [],
  focusArea: '',
  energyLevel: 3,
  notes: '',
  generatedAt: null,
};

export const initialPlan: MvpPlan = {
  summary: '',
  weekLabel: '',
  priorities: [],
  generatedAt: null,
  confirmedAt: null,
};

export function makeMvpId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function pushMvpEvent(
  events: MvpEvent[],
  type: MvpEvent['type'],
  createdAt = new Date().toISOString()
): MvpEvent[] {
  return [...events, { id: makeMvpId(type), type, createdAt }];
}

export function createEmptyWorkspace(): MvpWorkspaceSnapshot {
  return {
    onboarding: initialOnboardingDraft,
    review: initialReviewDraft,
    plan: initialPlan,
    dailyCheckIns: [],
    reflections: [],
    feedback: [],
    events: [],
    analytics: createEmptyAnalytics(),
  };
}

export function createEmptyAnalytics(): MvpAnalyticsSnapshot {
  return {
    onboardingCompleted: false,
    weeklyPlanConfirmed: false,
    completedActions: 0,
    totalActions: 0,
    dailyCheckIns: 0,
    reflections: 0,
    feedbackEntries: 0,
    eventCounts: {
      onboarding_started: 0,
      onboarding_completed: 0,
      weekly_review_started: 0,
      weekly_review_completed: 0,
      weekly_plan_generated: 0,
      weekly_plan_confirmed: 0,
      daily_checkin_completed: 0,
      reflection_completed: 0,
      user_feedback_submitted: 0,
    },
  };
}

export function computeMvpAnalytics(snapshot: Omit<MvpWorkspaceSnapshot, 'analytics'>): MvpAnalyticsSnapshot {
  const totalActions = snapshot.plan.priorities.reduce((sum, priority) => sum + priority.actions.length, 0);
  const completedActions = snapshot.plan.priorities.reduce(
    (sum, priority) => sum + priority.actions.filter((action) => action.status === 'done').length,
    0
  );

  const eventCounts = snapshot.events.reduce<MvpAnalyticsSnapshot['eventCounts']>(
    (accumulator, event) => ({
      ...accumulator,
      [event.type]: (accumulator[event.type] ?? 0) + 1,
    }),
    createEmptyAnalytics().eventCounts
  );

  return {
    onboardingCompleted: Boolean(snapshot.onboarding.completedAt),
    weeklyPlanConfirmed: Boolean(snapshot.plan.confirmedAt),
    completedActions,
    totalActions,
    dailyCheckIns: snapshot.dailyCheckIns.length,
    reflections: snapshot.reflections.length,
    feedbackEntries: snapshot.feedback.length,
    eventCounts,
  };
}

export function withComputedAnalytics(snapshot: Omit<MvpWorkspaceSnapshot, 'analytics'>): MvpWorkspaceSnapshot {
  return {
    ...snapshot,
    analytics: computeMvpAnalytics(snapshot),
  };
}
