import type { MvpChecklistItem, MvpMetric, MvpSurface } from '@/features/mvp/types';

const allMvpSurfaces: MvpSurface[] = [
  {
    slug: 'onboarding',
    title: 'Onboarding',
    description: 'Capture role, goals, constraints, and planning pain in one tight intake flow.',
    phase: 'Phase 1',
    path: '/mvp/onboarding',
    status: 'ready',
  },
  {
    slug: 'weekly-review',
    title: 'Weekly Review',
    description: 'Turn current context into a focused weekly plan with explicit user confirmation.',
    phase: 'Phase 1',
    path: '/mvp/weekly-review',
    status: 'ready',
  },
  {
    slug: 'today',
    title: 'Today',
    description: 'Expose only active priorities, next actions, and a lightweight daily check-in.',
    phase: 'Phase 2',
    path: '/mvp/today',
    status: 'ready',
  },
  {
    slug: 'reflection',
    title: 'Reflection',
    description: 'Capture qualitative signal at the end of the day and end of the week.',
    phase: 'Phase 3',
    path: '/mvp/reflection',
    status: 'ready',
  },
  {
    slug: 'admin',
    title: 'Admin Analytics',
    description: 'Internal view for activation, completion, retention, and feedback patterns.',
    phase: 'Phase 4',
    path: '/mvp/admin',
    status: 'ready',
  },
];

export function getMvpSurfaces(canAccessInternalAdmin: boolean): MvpSurface[] {
  return canAccessInternalAdmin
    ? allMvpSurfaces
    : allMvpSurfaces.filter((surface) => surface.slug !== 'admin');
}

export const mvpFoundationChecklist: MvpChecklistItem[] = [
  { label: 'Implementation checklist committed to the repo', done: true },
  { label: 'Initial Prisma schema for the weekly loop committed', done: true },
  { label: 'Route map documented for frontend and backend contracts', done: true },
  { label: 'Invite-only auth flow wired to production auth provider', done: false },
  { label: 'Analytics events emitted from each MVP milestone', done: false },
  { label: 'Seed flow available for one design-partner demo account', done: false },
];

export const mvpMetrics: MvpMetric[] = [
  {
    label: 'Time to first plan',
    value: '< 30 min',
    helper: 'Primary activation benchmark from the architecture plan.',
  },
  {
    label: 'Weekly review completion',
    value: 'Target 70%+',
    helper: 'Core loop health metric for design partners.',
  },
  {
    label: 'Surfaces scaffolded',
    value: '5 / 5',
    helper: 'All MVP product surfaces now have a route shell in this workspace.',
  },
];
