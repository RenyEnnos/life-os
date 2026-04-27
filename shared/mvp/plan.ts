import type {
  MvpActionItem,
  MvpOnboardingDraft,
  MvpPlan,
  MvpPriority,
  MvpReviewDraft,
} from './types';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function buildActionItems(seed: string, context: string[]): MvpActionItem[] {
  const normalizedSeed = seed.trim();
  const [primaryContext, secondaryContext] = context.filter(Boolean);

  return [
    {
      id: `${slugify(normalizedSeed)}-clarify`,
      title: `Clarify the next concrete move for ${normalizedSeed.toLowerCase()}`,
      details: primaryContext || 'Write the smallest next step before adding more work.',
      status: 'todo',
      note: '',
    },
    {
      id: `${slugify(normalizedSeed)}-schedule`,
      title: `Schedule protected time for ${normalizedSeed.toLowerCase()}`,
      details: secondaryContext || 'Reserve time on the calendar or protect one focus block.',
      status: 'todo',
      note: '',
    },
  ];
}

function buildPriority(seed: string, rationale: string, successMetric: string, context: string[]): MvpPriority {
  return {
    id: slugify(seed),
    title: seed,
    rationale,
    successMetric,
    actions: buildActionItems(seed, context),
  };
}

function createFallbackPriorities(review: MvpReviewDraft): MvpPriority[] {
  return [
    buildPriority(
      'Stabilize the week',
      'No goals or unfinished work were captured, so the system defaults to reducing ambiguity and creating structure.',
      'Finish the week with one named priority and two scheduled actions.',
      [review.focusArea, review.notes]
    ),
  ];
}

export function generateWeeklyPlan(onboarding: MvpOnboardingDraft, review: MvpReviewDraft, now = new Date()): MvpPlan {
  const seeds: MvpPriority[] = [];
  const nextGoal = onboarding.goals[0];
  const nextUnfinished = review.unfinishedWork[0];
  const nextCommitment = onboarding.commitments[0];

  if (nextGoal) {
    seeds.push(
      buildPriority(
        nextGoal,
        `Anchors the week around the stated success definition: ${onboarding.successDefinition || 'make measurable progress on what matters.'}`,
        `Ship visible progress on ${nextGoal.toLowerCase()}.`,
        [review.focusArea, onboarding.planningPain]
      )
    );
  }

  if (nextUnfinished) {
    seeds.push(
      buildPriority(
        `Close the loop on ${nextUnfinished}`,
        'Carry-over work should either move forward explicitly or get removed from mental load.',
        `Resolve or intentionally defer ${nextUnfinished.toLowerCase()}.`,
        [review.notes, review.constraints[0] || onboarding.constraints[0] || '']
      )
    );
  }

  if (nextCommitment) {
    seeds.push(
      buildPriority(
        `Protect ${nextCommitment}`,
        'Recurring commitments need deliberate capacity so they stop colliding with priority work.',
        `Reserve time and finish the key obligation tied to ${nextCommitment.toLowerCase()}.`,
        [onboarding.lifeSeason, onboarding.constraints[0] || '']
      )
    );
  }

  const priorities = seeds.length > 0 ? seeds.slice(0, 3) : createFallbackPriorities(review);

  return {
    weekLabel: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    generatedAt: now.toISOString(),
    confirmedAt: null,
    summary: `This week prioritizes ${priorities.length} focused tracks for ${onboarding.displayName || 'the operator'} while respecting current constraints and protecting daily execution.`,
    priorities,
  };
}
