import { createHash } from 'node:crypto';

import { z } from 'zod';

import { withComputedAnalytics } from '../shared/mvp/state';
import type { MvpWorkspaceSnapshot } from '../shared/mvp/types';

const text = (max: number) => z.string().max(max);
const id = z.string().trim().min(1).max(128);
const isoDateTime = z.string().datetime({ offset: true });
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Invalid calendar date');
const rating = z.number().int().min(1).max(5);
const itemList = z.array(text(300)).max(20);
const eventType = z.enum([
  'onboarding_started',
  'onboarding_completed',
  'weekly_review_started',
  'weekly_review_completed',
  'weekly_plan_generated',
  'weekly_plan_confirmed',
  'daily_checkin_completed',
  'reflection_completed',
  'user_feedback_submitted',
]);

const actionSchema = z.object({
  id,
  title: text(300),
  details: text(2_000),
  status: z.enum(['todo', 'done', 'deferred']),
  note: text(2_000),
}).strict();

const prioritySchema = z.object({
  id,
  title: text(300),
  rationale: text(2_000),
  successMetric: text(300),
  actions: z.array(actionSchema).max(100),
}).strict();

const workspaceSchema = z.object({
  onboarding: z.object({
    displayName: text(100),
    role: text(200),
    lifeSeason: text(200),
    planningPain: text(2_000),
    successDefinition: text(200),
    goals: itemList,
    commitments: itemList,
    constraints: itemList,
    completedAt: isoDateTime.nullable(),
  }).strict(),
  review: z.object({
    id: id.optional(),
    wins: itemList,
    unfinishedWork: itemList,
    constraints: itemList,
    focusArea: text(200),
    energyLevel: rating,
    notes: text(2_000),
    generatedAt: isoDateTime.nullable(),
  }).strict(),
  plan: z.object({
    id: id.optional(),
    summary: text(4_000),
    weekLabel: text(100),
    priorities: z.array(prioritySchema).max(20),
    generatedAt: isoDateTime.nullable(),
    confirmedAt: isoDateTime.nullable(),
  }).strict(),
  dailyCheckIns: z.array(z.object({
    date: calendarDate,
    energy: rating,
    focus: rating,
    blockers: text(2_000),
    note: text(2_000),
    createdAt: isoDateTime,
  }).strict()).max(2_000),
  reflections: z.array(z.object({
    id,
    period: z.enum(['daily', 'weekly']),
    body: text(4_000),
    createdAt: isoDateTime,
  }).strict()).max(2_000),
  feedback: z.array(z.object({
    id,
    rating,
    message: text(4_000),
    createdAt: isoDateTime,
  }).strict()).max(2_000),
  events: z.array(z.object({ id, type: eventType, createdAt: isoDateTime }).strict()).max(10_000),
  analytics: z.object({
    onboardingCompleted: z.boolean(),
    weeklyPlanConfirmed: z.boolean(),
    completedActions: z.number().int().nonnegative(),
    totalActions: z.number().int().nonnegative(),
    dailyCheckIns: z.number().int().nonnegative(),
    reflections: z.number().int().nonnegative(),
    feedbackEntries: z.number().int().nonnegative(),
    eventCounts: z.record(eventType, z.number().int().nonnegative()),
  }).strict(),
}).strict().superRefine((workspace, context) => {
  const ids = [
    ...workspace.plan.priorities.flatMap((priority) => [priority.id, ...priority.actions.map((action) => action.id)]),
    ...workspace.reflections.map((entry) => entry.id),
    ...workspace.feedback.map((entry) => entry.id),
    ...workspace.events.map((entry) => entry.id),
  ];
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Workspace IDs must be unique' });
  }
  const dates = workspace.dailyCheckIns.map((entry) => entry.date);
  if (new Set(dates).size !== dates.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Daily check-in dates must be unique' });
  }
  if (workspace.dailyCheckIns.length > 0 && !workspace.plan.id) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Daily check-ins require a plan' });
  }
  if ((workspace.review.id === undefined) !== (workspace.review.generatedAt === null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Review ID and generation timestamp must appear together' });
  }
  if (!workspace.review.id && (
    workspace.review.wins.length > 0
    || workspace.review.unfinishedWork.length > 0
    || workspace.review.constraints.length > 0
    || workspace.review.focusArea !== ''
    || workspace.review.energyLevel !== 3
    || workspace.review.notes !== ''
  )) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Review content requires a persisted review' });
  }
  if ((workspace.plan.id === undefined) !== (workspace.plan.generatedAt === null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Plan ID and generation timestamp must appear together' });
  }
  if (!workspace.plan.id && (workspace.plan.summary !== '' || workspace.plan.weekLabel !== '')) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Plan metadata requires a persisted plan' });
  }
  if (!workspace.plan.id && workspace.plan.priorities.length > 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Plan priorities require a plan' });
  }
  if (!workspace.plan.id && workspace.plan.confirmedAt !== null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Plan confirmation requires a plan' });
  }
});

const workspaceExportValidator = z.object({
  format: z.literal('lifeos.mvp.workspace'),
  version: z.literal(1),
  exportedAt: isoDateTime,
  workspace: workspaceSchema,
}).strict().refine(
  (value) => Buffer.byteLength(JSON.stringify(value), 'utf8') <= 8 * 1024 * 1024,
  'Portable workspace export exceeds 8 MiB',
);

export interface MvpWorkspaceExport {
  format: 'lifeos.mvp.workspace';
  version: 1;
  exportedAt: string;
  workspace: MvpWorkspaceSnapshot;
}

export const workspaceExportSchema = workspaceExportValidator as unknown as z.ZodType<MvpWorkspaceExport>;

export interface MvpWorkspaceRecovery {
  id: string;
  export: MvpWorkspaceExport;
}

export function normalizeWorkspace(workspace: MvpWorkspaceSnapshot): MvpWorkspaceSnapshot {
  const parsed = workspaceSchema.parse(workspace);
  const { analytics: _analytics, ...withoutAnalytics } = parsed;
  void _analytics;
  return withComputedAnalytics(withoutAnalytics as Omit<MvpWorkspaceSnapshot, 'analytics'>);
}

export function createWorkspaceExport(
  workspace: MvpWorkspaceSnapshot,
  exportedAt = new Date().toISOString(),
): MvpWorkspaceExport {
  return workspaceExportSchema.parse({
    format: 'lifeos.mvp.workspace',
    version: 1,
    exportedAt,
    workspace: normalizeWorkspace(workspace),
  });
}

export function digestWorkspace(workspace: MvpWorkspaceSnapshot) {
  return createHash('sha256').update(JSON.stringify(normalizeWorkspace(workspace))).digest('hex');
}

export function digestWorkspaceExport(portableExport: MvpWorkspaceExport) {
  const normalized = createWorkspaceExport(portableExport.workspace, portableExport.exportedAt);
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}
