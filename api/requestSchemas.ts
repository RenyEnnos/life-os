import { z } from 'zod';

const shortText = (max: number) => z.string().trim().max(max);
const requiredText = (max: number) => shortText(max).min(1);
const itemList = z.array(requiredText(300)).max(20);
const rating = z.number().int().min(1).max(5);
const bcryptPassword = (minimumLength: number) => z.string().min(minimumLength).max(128)
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'Password exceeds bcrypt limit');

const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Invalid calendar date');

export const registerRequestSchema = z.object({
  email: z.string().trim().email().max(254),
  password: bcryptPassword(8),
  name: requiredText(100),
  inviteCode: requiredText(128),
}).strict();

export const loginRequestSchema = z.object({
  email: z.string().trim().email().max(254),
  password: bcryptPassword(1),
}).strict();

export const profileRequestSchema = z.object({
  name: requiredText(100).optional(),
  theme: z.enum(['light', 'dark']).optional(),
}).strict().refine((value) => value.name !== undefined || value.theme !== undefined, 'At least one field is required');

export const onboardingRequestSchema = z.object({
  displayName: requiredText(100),
  role: shortText(200),
  lifeSeason: shortText(200),
  planningPain: shortText(2_000),
  successDefinition: shortText(200),
  goals: itemList,
  commitments: itemList,
  constraints: itemList,
}).strict();

export const weeklyReviewRequestSchema = z.object({
  wins: itemList,
  unfinishedWork: itemList,
  constraints: itemList,
  focusArea: shortText(200),
  energyLevel: rating,
  notes: shortText(2_000),
}).strict();

export const actionItemIdSchema = requiredText(128);
export const planIdSchema = requiredText(128);

export const actionUpdateRequestSchema = z.object({
  status: z.enum(['todo', 'done', 'deferred']).optional(),
  note: shortText(2_000).optional(),
}).strict().refine((value) => value.status !== undefined || value.note !== undefined, 'At least one field is required');

export const dailyCheckInRequestSchema = z.object({
  date: calendarDate,
  energy: rating,
  focus: rating,
  blockers: shortText(2_000),
  note: shortText(2_000),
}).strict();

export const reflectionRequestSchema = z.object({
  period: z.enum(['daily', 'weekly']),
  body: requiredText(4_000),
}).strict();

export const feedbackRequestSchema = z.object({
  rating,
  message: requiredText(4_000),
}).strict();

export const emptyRequestSchema = z.object({}).strict();
