import { describe, expect, it } from 'vitest';

import { generateWeeklyPlan } from '@/features/mvp/lib/plan';
import type { MvpOnboardingDraft, MvpReviewDraft } from '@/features/mvp/types';

describe('generateWeeklyPlan', () => {
  it('builds a focused plan from onboarding and weekly review context', () => {
    const onboarding: MvpOnboardingDraft = {
      displayName: 'Riley',
      role: 'Founder',
      lifeSeason: 'Launching a product',
      planningPain: 'Too many open loops.',
      successDefinition: 'Finish the week with fewer competing priorities.',
      goals: ['Ship onboarding flow', 'Tighten weekly review copy'],
      commitments: ['Parenting logistics', 'Investor updates'],
      constraints: ['Two afternoons blocked'],
      completedAt: '2026-03-19T10:00:00.000Z',
    };

    const review: MvpReviewDraft = {
      wins: ['Closed design feedback'],
      unfinishedWork: ['Prototype dashboard'],
      constraints: ['Travel on Thursday'],
      focusArea: 'Activation',
      energyLevel: 4,
      notes: 'Need a realistic week, not an ambitious one.',
      generatedAt: null,
    };

    const plan = generateWeeklyPlan(onboarding, review, new Date('2026-03-19T12:00:00.000Z'));

    expect(plan.priorities).toHaveLength(3);
    expect(plan.summary).toContain('Riley');
    expect(plan.priorities[0].title).toContain('Ship onboarding flow');
    expect(plan.priorities[1].title).toContain('Prototype dashboard');
    expect(plan.priorities[2].title).toContain('Parenting logistics');
    expect(plan.priorities.every((priority) => priority.actions.length === 2)).toBe(true);
  });

  it('falls back to a stabilization plan when inputs are sparse', () => {
    const onboarding: MvpOnboardingDraft = {
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

    const review: MvpReviewDraft = {
      wins: [],
      unfinishedWork: [],
      constraints: [],
      focusArea: '',
      energyLevel: 3,
      notes: '',
      generatedAt: null,
    };

    const plan = generateWeeklyPlan(onboarding, review, new Date('2026-03-19T12:00:00.000Z'));

    expect(plan.priorities).toHaveLength(1);
    expect(plan.priorities[0].title).toBe('Stabilize the week');
  });
});
