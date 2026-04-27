export interface MvpSurface {
  slug: 'onboarding' | 'weekly-review' | 'today' | 'reflection' | 'admin';
  title: string;
  description: string;
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4';
  path: string;
  status: 'scaffolded' | 'ready' | 'active' | 'next';
}

export interface MvpMetric {
  label: string;
  value: string;
  helper: string;
}

export interface MvpChecklistItem {
  label: string;
  done: boolean;
}

export interface MvpActionItem {
  id: string;
  title: string;
  details: string;
  status: 'todo' | 'done' | 'deferred';
  note: string;
}

export interface MvpPriority {
  id: string;
  title: string;
  rationale: string;
  successMetric: string;
  actions: MvpActionItem[];
}

export interface MvpOnboardingDraft {
  displayName: string;
  role: string;
  lifeSeason: string;
  planningPain: string;
  successDefinition: string;
  goals: string[];
  commitments: string[];
  constraints: string[];
  completedAt: string | null;
}

export interface MvpReviewDraft {
  id?: string;
  wins: string[];
  unfinishedWork: string[];
  constraints: string[];
  focusArea: string;
  energyLevel: number;
  notes: string;
  generatedAt: string | null;
}

export interface MvpPlan {
  id?: string;
  summary: string;
  weekLabel: string;
  priorities: MvpPriority[];
  generatedAt: string | null;
  confirmedAt: string | null;
}

export interface MvpDailyCheckIn {
  date: string;
  energy: number;
  focus: number;
  blockers: string;
  note: string;
  createdAt: string;
}

export interface MvpReflectionEntry {
  id: string;
  period: 'daily' | 'weekly';
  body: string;
  createdAt: string;
}

export interface MvpFeedbackEntry {
  id: string;
  rating: number;
  message: string;
  createdAt: string;
}

export interface MvpEvent {
  id: string;
  type:
    | 'onboarding_started'
    | 'onboarding_completed'
    | 'weekly_review_started'
    | 'weekly_review_completed'
    | 'weekly_plan_generated'
    | 'weekly_plan_confirmed'
    | 'daily_checkin_completed'
    | 'reflection_completed'
    | 'user_feedback_submitted';
  createdAt: string;
}

export interface MvpAnalyticsSnapshot {
  onboardingCompleted: boolean;
  weeklyPlanConfirmed: boolean;
  completedActions: number;
  totalActions: number;
  dailyCheckIns: number;
  reflections: number;
  feedbackEntries: number;
  eventCounts: Record<MvpEvent['type'], number>;
}

export interface MvpWorkspaceSnapshot {
  onboarding: MvpOnboardingDraft;
  review: MvpReviewDraft;
  plan: MvpPlan;
  dailyCheckIns: MvpDailyCheckIn[];
  reflections: MvpReflectionEntry[];
  feedback: MvpFeedbackEntry[];
  events: MvpEvent[];
  analytics: MvpAnalyticsSnapshot;
}
