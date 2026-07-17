import { ActionItemStatus, CommitmentKind, MvpEventType, Prisma, PriorityStatus, ReflectionPeriod, WeeklyPlanStatus } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';

import type { StoredUser } from './authRepository';
import { prisma as defaultPrisma } from './prisma';
import type { MvpRepository } from './mvpRepository.types';

import { generateWeeklyPlan } from '../shared/mvp/plan';
import { createEmptyWorkspace, initialOnboardingDraft, initialReviewDraft, withComputedAnalytics } from '../shared/mvp/state';
import type {
  MvpDailyCheckIn,
  MvpEvent,
  MvpFeedbackEntry,
  MvpOnboardingDraft,
  MvpPlan,
  MvpReflectionEntry,
  MvpReviewDraft,
  MvpWorkspaceSnapshot,
} from '../shared/mvp/types';
import {
  createWorkspaceExport,
  digestWorkspace,
  normalizeWorkspace,
  workspaceExportSchema,
  type MvpWorkspaceExport,
  type MvpWorkspaceRecovery,
} from './workspaceRecovery';

type WorkspaceDb = PrismaClient | Prisma.TransactionClient;

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setUTCDate(next.getUTCDate() + diff);
  next.setUTCHours(0, 0, 0, 0);
  return next;
}

function endOfWeek(date: Date) {
  const next = startOfWeek(date);
  next.setUTCDate(next.getUTCDate() + 6);
  next.setUTCHours(23, 59, 59, 999);
  return next;
}

function parseCommitmentKind(value: string): CommitmentKind {
  const normalized = value.trim().toUpperCase();
  return Object.values(CommitmentKind).includes(normalized as CommitmentKind)
    ? (normalized as CommitmentKind)
    : CommitmentKind.OTHER;
}

function toMvpEventType(type: MvpEvent['type']): MvpEventType {
  switch (type) {
    case 'onboarding_started':
      return MvpEventType.ONBOARDING_STARTED;
    case 'onboarding_completed':
      return MvpEventType.ONBOARDING_COMPLETED;
    case 'weekly_review_started':
      return MvpEventType.WEEKLY_REVIEW_STARTED;
    case 'weekly_review_completed':
      return MvpEventType.WEEKLY_REVIEW_COMPLETED;
    case 'weekly_plan_generated':
      return MvpEventType.WEEKLY_PLAN_GENERATED;
    case 'weekly_plan_confirmed':
      return MvpEventType.WEEKLY_PLAN_CONFIRMED;
    case 'daily_checkin_completed':
      return MvpEventType.DAILY_CHECKIN_COMPLETED;
    case 'reflection_completed':
      return MvpEventType.REFLECTION_COMPLETED;
    case 'user_feedback_submitted':
      return MvpEventType.USER_FEEDBACK_SUBMITTED;
  }
}

function fromMvpEventType(type: MvpEventType): MvpEvent['type'] {
  switch (type) {
    case MvpEventType.ONBOARDING_STARTED:
      return 'onboarding_started';
    case MvpEventType.ONBOARDING_COMPLETED:
      return 'onboarding_completed';
    case MvpEventType.WEEKLY_REVIEW_STARTED:
      return 'weekly_review_started';
    case MvpEventType.WEEKLY_REVIEW_COMPLETED:
      return 'weekly_review_completed';
    case MvpEventType.WEEKLY_PLAN_GENERATED:
      return 'weekly_plan_generated';
    case MvpEventType.WEEKLY_PLAN_CONFIRMED:
      return 'weekly_plan_confirmed';
    case MvpEventType.DAILY_CHECKIN_COMPLETED:
      return 'daily_checkin_completed';
    case MvpEventType.REFLECTION_COMPLETED:
      return 'reflection_completed';
    case MvpEventType.USER_FEEDBACK_SUBMITTED:
      return 'user_feedback_submitted';
  }
}

function toActionStatus(status: 'todo' | 'done' | 'deferred'): ActionItemStatus {
  switch (status) {
    case 'done':
      return ActionItemStatus.DONE;
    case 'deferred':
      return ActionItemStatus.DEFERRED;
    case 'todo':
    default:
      return ActionItemStatus.TODO;
  }
}

function fromActionStatus(status: ActionItemStatus): 'todo' | 'done' | 'deferred' {
  switch (status) {
    case ActionItemStatus.DONE:
      return 'done';
    case ActionItemStatus.DEFERRED:
      return 'deferred';
    default:
      return 'todo';
  }
}

function toJsonObject(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

export class PrismaBackedMvpRepository implements MvpRepository {
  private readonly mutationQueues = new Map<string, Promise<void>>();

  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  async ensureUser(user: StoredUser): Promise<void> {
    await this.db.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        inviteCode: user.inviteCode,
        fullName: user.fullName,
      },
      create: {
        id: user.id,
        email: user.email,
        inviteCode: user.inviteCode,
        fullName: user.fullName,
      },
    });
  }

  async getWorkspace(userId: string): Promise<MvpWorkspaceSnapshot> {
    return this.buildWorkspace(userId);
  }

  async saveOnboarding(userId: string, input: Omit<MvpOnboardingDraft, 'completedAt'>): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.saveOnboardingUnlocked(userId, input));
  }

  async generatePlan(userId: string, input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.generatePlanUnlocked(userId, input));
  }

  async confirmPlan(userId: string, planId: string): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.confirmPlanUnlocked(userId, planId));
  }

  async updateActionItem(
    userId: string,
    actionItemId: string,
    patch: { status?: 'todo' | 'done' | 'deferred'; note?: string }
  ): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.updateActionItemUnlocked(userId, actionItemId, patch));
  }

  async saveDailyCheckIn(userId: string, input: Omit<MvpDailyCheckIn, 'createdAt'>): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.saveDailyCheckInUnlocked(userId, input));
  }

  async addReflection(userId: string, input: Pick<MvpReflectionEntry, 'period' | 'body'>): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.addReflectionUnlocked(userId, input));
  }

  async submitFeedback(userId: string, input: { rating: number; message: string }): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.submitFeedbackUnlocked(userId, input));
  }

  async resetWorkspace(userId: string, preparedInput: MvpWorkspaceExport) {
    return this.runUserMutation(userId, () => this.resetWorkspaceUnlocked(userId, preparedInput));
  }

  async restoreWorkspace(userId: string, portableExportInput: MvpWorkspaceExport): Promise<MvpWorkspaceSnapshot> {
    return this.runUserMutation(userId, () => this.restoreWorkspaceUnlocked(userId, portableExportInput));
  }

  private async saveOnboardingUnlocked(userId: string, input: Omit<MvpOnboardingDraft, 'completedAt'>): Promise<MvpWorkspaceSnapshot> {
    const now = new Date();
    const existingProfile = await this.db.userProfile.findUnique({
      where: { userId },
      select: { onboardingAt: true },
    });

    await this.db.$transaction(async (tx) => {
      await tx.userProfile.upsert({
        where: { userId },
        update: {
          displayName: input.displayName,
          role: input.role || null,
          lifeSeason: input.lifeSeason || null,
          planningPain: input.planningPain || null,
          successDefinition: input.successDefinition || null,
          onboardingConstraints: input.constraints,
          onboardingAt: now,
        },
        create: {
          userId,
          displayName: input.displayName,
          role: input.role || null,
          lifeSeason: input.lifeSeason || null,
          planningPain: input.planningPain || null,
          successDefinition: input.successDefinition || null,
          onboardingConstraints: input.constraints,
          onboardingAt: now,
        },
      });

      await tx.goal.deleteMany({ where: { userId } });
      if (input.goals.length > 0) {
        await tx.goal.createMany({
          data: input.goals.map((goal, index) => ({
            userId,
            title: goal,
            sortOrder: index,
          })),
        });
      }

      await tx.commitment.deleteMany({ where: { userId } });
      if (input.commitments.length > 0) {
        await tx.commitment.createMany({
          data: input.commitments.map((commitment, _index) => ({
            userId,
            title: commitment,
            kind: parseCommitmentKind(commitment),
            cadence: null,
            timeBudget: null,
            active: true,
            createdAt: now,
            updatedAt: now,
          })),
        });
      }

      const events: Array<{ type: MvpEvent['type']; metadata?: Record<string, unknown> }> = [];
      if (!existingProfile?.onboardingAt) {
        events.push({ type: 'onboarding_started' });
      }
      events.push({
        type: 'onboarding_completed',
        metadata: {
              goalsCount: input.goals.length,
              commitmentsCount: input.commitments.length,
              constraintsCount: input.constraints.length,
            },
          });

      if (events.length > 0) {
        await tx.mvpEventLog.createMany({
          data: events.map((event) => ({
            userId,
            type: toMvpEventType(event.type),
            metadata: event.metadata ? toJsonObject(event.metadata) : undefined,
            createdAt: now,
          })),
        });
      }
    });

    return this.buildWorkspace(userId);
  }

  private async generatePlanUnlocked(userId: string, input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>): Promise<MvpWorkspaceSnapshot> {
    const onboarding = (await this.buildWorkspace(userId)).onboarding.completedAt
      ? (await this.buildWorkspace(userId)).onboarding
      : initialOnboardingDraft;
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const reviewInput: MvpReviewDraft = {
      ...input,
      generatedAt: now.toISOString(),
    };
    const generatedPlan = generateWeeklyPlan(onboarding, reviewInput, now);

    await this.db.$transaction(async (tx) => {
      const review = await tx.weeklyReview.upsert({
        where: {
          userId_weekStart: {
            userId,
            weekStart,
          },
        },
        update: {
          weekEnd,
          wins: input.wins,
          unfinishedWork: input.unfinishedWork,
          constraints: input.constraints,
          focusArea: input.focusArea || null,
          energyLevel: input.energyLevel,
          notes: input.notes || null,
          energySummary: input.energyLevel ? `Energy level ${input.energyLevel}/5` : null,
          rawContext: {
            notes: input.notes,
            focusArea: input.focusArea,
          },
          generatedPlanInput: toJsonObject(input),
        },
        create: {
          userId,
          weekStart,
          weekEnd,
          wins: input.wins,
          unfinishedWork: input.unfinishedWork,
          constraints: input.constraints,
          focusArea: input.focusArea || null,
          energyLevel: input.energyLevel,
          notes: input.notes || null,
          energySummary: input.energyLevel ? `Energy level ${input.energyLevel}/5` : null,
          rawContext: {
            notes: input.notes,
            focusArea: input.focusArea,
          },
          generatedPlanInput: toJsonObject(input),
        },
      });

      const existingPlan = await tx.weeklyPlan.findUnique({
        where: {
          userId_weekStart: {
            userId,
            weekStart,
          },
        },
        select: { id: true },
      });

      if (existingPlan) {
        await tx.weeklyPlan.delete({
          where: { id: existingPlan.id },
        });
      }

      await tx.weeklyPlan.create({
        data: {
          userId,
          weeklyReviewId: review.id,
          weekStart,
          weekEnd,
          status: WeeklyPlanStatus.GENERATED,
          summary: generatedPlan.summary,
          generationSource: 'structured_mvp_rules',
          generationInput: toJsonObject(input),
          generationOutput: toJsonObject(generatedPlan),
          createdAt: now,
          updatedAt: now,
          priorities: {
            create: generatedPlan.priorities.map((priority, priorityIndex) => ({
              title: priority.title,
              rationale: priority.rationale,
              successMetric: priority.successMetric,
              status: PriorityStatus.ACTIVE,
              sortOrder: priorityIndex,
              actionItems: {
                create: priority.actions.map((action, actionIndex) => ({
                  title: action.title,
                  details: action.details || null,
                  status: toActionStatus(action.status),
                  note: action.note || null,
                  sortOrder: actionIndex,
                })),
              },
            })),
          },
        },
      });

      await tx.mvpEventLog.createMany({
        data: [
          { userId, type: MvpEventType.WEEKLY_REVIEW_STARTED, createdAt: now },
          { userId, type: MvpEventType.WEEKLY_REVIEW_COMPLETED, createdAt: now },
          {
            userId,
            type: MvpEventType.WEEKLY_PLAN_GENERATED,
            createdAt: now,
            metadata: {
              prioritiesCount: generatedPlan.priorities.length,
            },
          },
        ],
      });
    });

    return this.buildWorkspace(userId);
  }

  private async confirmPlanUnlocked(userId: string, planId: string): Promise<MvpWorkspaceSnapshot> {
    const plan = await this.db.weeklyPlan.findFirst({
      where: {
        id: planId,
        userId,
      },
      select: { id: true },
    });

    if (!plan) {
      return this.buildWorkspace(userId);
    }

    const now = new Date();
    await this.db.$transaction([
      this.db.weeklyPlan.update({
        where: { id: planId },
        data: {
          confirmedAt: now,
          status: WeeklyPlanStatus.CONFIRMED,
        },
      }),
      this.db.mvpEventLog.create({
        data: {
          userId,
          type: MvpEventType.WEEKLY_PLAN_CONFIRMED,
          createdAt: now,
        },
      }),
    ]);

    return this.buildWorkspace(userId);
  }

  private async updateActionItemUnlocked(
    userId: string,
    actionItemId: string,
    patch: { status?: 'todo' | 'done' | 'deferred'; note?: string }
  ): Promise<MvpWorkspaceSnapshot> {
    const actionItem = await this.db.actionItem.findFirst({
      where: {
        id: actionItemId,
        weeklyPriority: {
          weeklyPlan: {
            userId,
          },
        },
      },
      select: { id: true, status: true },
    });

    if (!actionItem) {
      return this.buildWorkspace(userId);
    }

    const nextStatus = patch.status ? toActionStatus(patch.status) : actionItem.status;
    const now = new Date();

    await this.db.actionItem.update({
      where: { id: actionItemId },
      data: {
        status: nextStatus,
        note: typeof patch.note === 'string' ? patch.note : undefined,
        completedAt: nextStatus === ActionItemStatus.DONE ? now : null,
        deferredAt: nextStatus === ActionItemStatus.DEFERRED ? now : null,
      },
    });

    return this.buildWorkspace(userId);
  }

  private async saveDailyCheckInUnlocked(userId: string, input: Omit<MvpDailyCheckIn, 'createdAt'>): Promise<MvpWorkspaceSnapshot> {
    const latestPlan = await this.db.weeklyPlan.findFirst({
      where: { userId },
      orderBy: [{ confirmedAt: 'desc' }, { updatedAt: 'desc' }],
      select: { id: true },
    });

    if (!latestPlan) {
      throw new Error('Cannot save daily check-in without an active weekly plan.');
    }

    const date = new Date(`${input.date}T00:00:00.000Z`);
    const now = new Date();
    await this.db.$transaction([
      this.db.dailyCheckIn.upsert({
        where: {
          userId_date: {
            userId,
            date,
          },
        },
        update: {
          weeklyPlanId: latestPlan.id,
          energy: input.energy,
          focus: input.focus,
          blockers: input.blockers || null,
          note: input.note || null,
          updatedAt: now,
        },
        create: {
          userId,
          weeklyPlanId: latestPlan.id,
          date,
          energy: input.energy,
          focus: input.focus,
          blockers: input.blockers || null,
          note: input.note || null,
          createdAt: now,
          updatedAt: now,
        },
      }),
      this.db.mvpEventLog.create({
        data: {
          userId,
          type: MvpEventType.DAILY_CHECKIN_COMPLETED,
          createdAt: now,
          metadata: {
            energy: input.energy,
            focus: input.focus,
          },
        },
      }),
    ]);

    return this.buildWorkspace(userId);
  }

  private async addReflectionUnlocked(userId: string, input: Pick<MvpReflectionEntry, 'period' | 'body'>): Promise<MvpWorkspaceSnapshot> {
    const now = new Date();
    await this.db.$transaction([
      this.db.reflectionEntry.create({
        data: {
          userId,
          period: input.period === 'weekly' ? ReflectionPeriod.WEEKLY : ReflectionPeriod.DAILY,
          body: input.body,
          prompts: Prisma.JsonNull,
          title: null,
          createdAt: now,
          updatedAt: now,
        },
      }),
      this.db.mvpEventLog.create({
        data: {
          userId,
          type: MvpEventType.REFLECTION_COMPLETED,
          createdAt: now,
        },
      }),
    ]);

    return this.buildWorkspace(userId);
  }

  private async submitFeedbackUnlocked(userId: string, input: { rating: number; message: string }): Promise<MvpWorkspaceSnapshot> {
    const now = new Date();
    await this.db.$transaction([
      this.db.feedbackEntry.create({
        data: {
          userId,
          category: 'general',
          rating: input.rating,
          message: input.message,
          source: 'mvp_loop',
          createdAt: now,
          updatedAt: now,
        },
      }),
      this.db.mvpEventLog.create({
        data: {
          userId,
          type: MvpEventType.USER_FEEDBACK_SUBMITTED,
          createdAt: now,
          metadata: {
            rating: input.rating,
          },
        },
      }),
    ]);

    return this.buildWorkspace(userId);
  }

  async exportWorkspace(userId: string): Promise<MvpWorkspaceExport> {
    return createWorkspaceExport(await this.buildWorkspace(userId));
  }

  private async resetWorkspaceUnlocked(userId: string, preparedInput: MvpWorkspaceExport) {
    const parsed = workspaceExportSchema.parse(preparedInput);
    const prepared = createWorkspaceExport(parsed.workspace, parsed.exportedAt);
    return this.db.$transaction(async (tx) => {
      const current = await this.buildWorkspace(userId, tx);
      if (digestWorkspace(current) !== digestWorkspace(prepared.workspace as MvpWorkspaceSnapshot)) {
        throw new Error('Workspace changed after export');
      }

      const recovery = await tx.mvpWorkspaceRecovery.create({
        data: {
          userId,
          format: prepared.format,
          version: prepared.version,
          exportedAt: new Date(prepared.exportedAt),
          payload: toJsonObject(prepared),
        },
      });

      await this.deleteWorkspace(userId, tx);
      const expired = await tx.mvpWorkspaceRecovery.findMany({
        where: { userId, id: { not: recovery.id } },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: 4,
        select: { id: true },
      });
      if (expired.length > 0) {
        await tx.mvpWorkspaceRecovery.deleteMany({
          where: { id: { in: expired.map(({ id }) => id) }, userId },
        });
      }

      return { workspace: createEmptyWorkspace(), recoveryId: recovery.id, export: prepared };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async getLatestRecovery(userId: string): Promise<MvpWorkspaceRecovery | null> {
    const recovery = await this.db.mvpWorkspaceRecovery.findFirst({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
    if (!recovery) return null;
    return { id: recovery.id, export: workspaceExportSchema.parse(recovery.payload) };
  }

  private async restoreWorkspaceUnlocked(userId: string, portableExportInput: MvpWorkspaceExport): Promise<MvpWorkspaceSnapshot> {
    const portableExport = workspaceExportSchema.parse(portableExportInput);
    const workspace = normalizeWorkspace(portableExport.workspace as MvpWorkspaceSnapshot);
    return this.db.$transaction(async (tx) => {
      await this.deleteWorkspace(userId, tx);
      await this.createWorkspace(userId, workspace, tx);
      return this.buildWorkspace(userId, tx);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  private async deleteWorkspace(userId: string, tx: Prisma.TransactionClient) {
    await tx.mvpEventLog.deleteMany({ where: { userId } });
    await tx.dailyCheckIn.deleteMany({ where: { userId } });
    await tx.reflectionEntry.deleteMany({ where: { userId } });
    await tx.feedbackEntry.deleteMany({ where: { userId } });
    await tx.weeklyPlan.deleteMany({ where: { userId } });
    await tx.weeklyReview.deleteMany({ where: { userId } });
    await tx.goal.deleteMany({ where: { userId } });
    await tx.commitment.deleteMany({ where: { userId } });
    await tx.userProfile.deleteMany({ where: { userId } });
  }

  private runUserMutation<T>(userId: string, operation: () => Promise<T>): Promise<T> {
    const queued = this.mutationQueues.get(userId) ?? Promise.resolve();
    const result = queued.then(operation, operation);
    const settled = result.then(() => undefined, () => undefined);
    this.mutationQueues.set(userId, settled);
    void settled.then(() => {
      if (this.mutationQueues.get(userId) === settled) {
        this.mutationQueues.delete(userId);
      }
    });
    return result;
  }

  private async createWorkspace(userId: string, workspace: MvpWorkspaceSnapshot, tx: Prisma.TransactionClient) {
    const now = new Date();
    await tx.userProfile.create({ data: {
      userId,
      displayName: workspace.onboarding.displayName,
      role: workspace.onboarding.role || null,
      lifeSeason: workspace.onboarding.lifeSeason || null,
      planningPain: workspace.onboarding.planningPain || null,
      successDefinition: workspace.onboarding.successDefinition || null,
      onboardingConstraints: workspace.onboarding.constraints,
      onboardingAt: workspace.onboarding.completedAt ? new Date(workspace.onboarding.completedAt) : null,
    } });
    if (workspace.onboarding.goals.length) {
      await tx.goal.createMany({ data: workspace.onboarding.goals.map((title, sortOrder) => ({ userId, title, sortOrder })) });
    }
    if (workspace.onboarding.commitments.length) {
      await tx.commitment.createMany({ data: workspace.onboarding.commitments.map((title) => ({ userId, title, kind: parseCommitmentKind(title) })) });
    }

    const reviewCreatedAt = workspace.review.generatedAt ? new Date(workspace.review.generatedAt) : now;
    const weekStart = startOfWeek(reviewCreatedAt);
    const weekEnd = endOfWeek(reviewCreatedAt);
    let reviewId: string | undefined;
    if (workspace.review.generatedAt) {
      const review = await tx.weeklyReview.create({ data: {
        id: workspace.review.id,
        userId,
        weekStart,
        weekEnd,
        wins: workspace.review.wins,
        unfinishedWork: workspace.review.unfinishedWork,
        constraints: workspace.review.constraints,
        focusArea: workspace.review.focusArea || null,
        energyLevel: workspace.review.energyLevel,
        notes: workspace.review.notes || null,
        createdAt: reviewCreatedAt,
        updatedAt: reviewCreatedAt,
      } });
      reviewId = review.id;
    }

    if (workspace.plan.id) {
      const planCreatedAt = workspace.plan.generatedAt ? new Date(workspace.plan.generatedAt) : now;
      const planWeekStart = startOfWeek(planCreatedAt);
      await tx.weeklyPlan.create({ data: {
        id: workspace.plan.id,
        userId,
        weeklyReviewId: reviewId,
        weekStart: planWeekStart,
        weekEnd: endOfWeek(planCreatedAt),
        status: workspace.plan.confirmedAt ? WeeklyPlanStatus.CONFIRMED : WeeklyPlanStatus.GENERATED,
        summary: workspace.plan.summary,
        generationSource: 'workspace_restore',
        generationOutput: toJsonObject(workspace.plan),
        confirmedAt: workspace.plan.confirmedAt ? new Date(workspace.plan.confirmedAt) : null,
        createdAt: planCreatedAt,
        updatedAt: planCreatedAt,
        priorities: { create: workspace.plan.priorities.map((priority, sortOrder) => ({
          id: priority.id,
          title: priority.title,
          rationale: priority.rationale || null,
          successMetric: priority.successMetric || null,
          status: PriorityStatus.ACTIVE,
          sortOrder,
          actionItems: { create: priority.actions.map((action, actionSortOrder) => ({
            id: action.id,
            title: action.title,
            details: action.details || null,
            status: toActionStatus(action.status),
            note: action.note || null,
            sortOrder: actionSortOrder,
            createdAt: planCreatedAt,
            updatedAt: planCreatedAt,
          })) },
        })) },
      } });

      if (workspace.dailyCheckIns.length) {
        await tx.dailyCheckIn.createMany({ data: workspace.dailyCheckIns.map((entry) => ({
          userId,
          weeklyPlanId: workspace.plan.id!,
          date: new Date(`${entry.date}T00:00:00.000Z`),
          energy: entry.energy,
          focus: entry.focus,
          blockers: entry.blockers || null,
          note: entry.note || null,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.createdAt),
        })) });
      }
    }

    if (workspace.reflections.length) {
      await tx.reflectionEntry.createMany({ data: workspace.reflections.map((entry) => ({
        id: entry.id,
        userId,
        period: entry.period === 'weekly' ? ReflectionPeriod.WEEKLY : ReflectionPeriod.DAILY,
        body: entry.body,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.createdAt),
      })) });
    }
    if (workspace.feedback.length) {
      await tx.feedbackEntry.createMany({ data: workspace.feedback.map((entry) => ({
        id: entry.id,
        userId,
        category: 'general',
        rating: entry.rating,
        message: entry.message,
        source: 'workspace_restore',
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.createdAt),
      })) });
    }
    if (workspace.events.length) {
      await tx.mvpEventLog.createMany({ data: workspace.events.map((event) => ({
        id: event.id,
        userId,
        type: toMvpEventType(event.type),
        createdAt: new Date(event.createdAt),
      })) });
    }
  }

  private async buildWorkspace(userId: string, db?: WorkspaceDb): Promise<MvpWorkspaceSnapshot> {
    if (!db) {
      return this.db.$transaction((tx) => this.buildWorkspace(userId, tx));
    }
    const [profile, goals, commitments, review, plan, dailyCheckIns, reflections, feedback, events] = await Promise.all([
      db.userProfile.findUnique({ where: { userId } }),
      db.goal.findMany({ where: { userId, active: true }, orderBy: { sortOrder: 'asc' } }),
      db.commitment.findMany({ where: { userId, active: true }, orderBy: { createdAt: 'asc' } }),
      db.weeklyReview.findFirst({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
      db.weeklyPlan.findFirst({
        where: { userId },
        orderBy: [{ confirmedAt: 'desc' }, { updatedAt: 'desc' }],
        include: {
          priorities: {
            orderBy: { sortOrder: 'asc' },
            include: {
              actionItems: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      }),
      db.dailyCheckIn.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      db.reflectionEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      db.feedbackEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      db.mvpEventLog.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    ]);

    const onboarding: MvpOnboardingDraft = profile
      ? {
          displayName: profile.displayName,
          role: profile.role ?? '',
          lifeSeason: profile.lifeSeason ?? '',
          planningPain: profile.planningPain ?? '',
          successDefinition: profile.successDefinition ?? '',
          goals: goals.map((goal) => goal.title),
          commitments: commitments.map((commitment) => commitment.title),
          constraints: Array.isArray(profile.onboardingConstraints) ? (profile.onboardingConstraints as string[]) : [],
          completedAt: profile.onboardingAt?.toISOString() ?? null,
        }
      : initialOnboardingDraft;

    const reviewDraft: MvpReviewDraft = review
      ? {
          id: review.id,
          wins: Array.isArray(review.wins) ? (review.wins as string[]) : [],
          unfinishedWork: Array.isArray(review.unfinishedWork) ? (review.unfinishedWork as string[]) : [],
          constraints: Array.isArray(review.constraints) ? (review.constraints as string[]) : [],
          focusArea: review.focusArea ?? '',
          energyLevel: review.energyLevel ?? 3,
          notes: review.notes ?? '',
          generatedAt: review.createdAt.toISOString(),
        }
      : initialReviewDraft;

    const planSnapshot: MvpPlan = plan
      ? {
          id: plan.id,
          summary: plan.summary ?? '',
          weekLabel: plan.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          generatedAt: plan.createdAt.toISOString(),
          confirmedAt: plan.confirmedAt?.toISOString() ?? null,
          priorities: plan.priorities.map((priority) => ({
            id: priority.id,
            title: priority.title,
            rationale: priority.rationale ?? '',
            successMetric: priority.successMetric ?? '',
            actions: priority.actionItems.map((action) => ({
              id: action.id,
              title: action.title,
              details: action.details ?? '',
              status: fromActionStatus(action.status),
              note: action.note ?? '',
            })),
          })),
        }
      : {
          id: undefined,
          summary: '',
          weekLabel: '',
          generatedAt: null,
          confirmedAt: null,
          priorities: [],
        };

    const workspaceWithoutAnalytics = {
      onboarding,
      review: reviewDraft,
      plan: planSnapshot,
      dailyCheckIns: dailyCheckIns.map<MvpDailyCheckIn>((entry) => ({
        date: entry.date.toISOString().slice(0, 10),
        energy: entry.energy ?? 0,
        focus: entry.focus ?? 0,
        blockers: entry.blockers ?? '',
        note: entry.note ?? '',
        createdAt: entry.createdAt.toISOString(),
      })),
      reflections: reflections.map<MvpReflectionEntry>((entry) => ({
        id: entry.id,
        period: entry.period === ReflectionPeriod.WEEKLY ? 'weekly' : 'daily',
        body: entry.body,
        createdAt: entry.createdAt.toISOString(),
      })),
      feedback: feedback.map<MvpFeedbackEntry>((entry) => ({
        id: entry.id,
        rating: entry.rating ?? 0,
        message: entry.message,
        createdAt: entry.createdAt.toISOString(),
      })),
      events: events.map<MvpEvent>((event) => ({
        id: event.id,
        type: fromMvpEventType(event.type),
        createdAt: event.createdAt.toISOString(),
      })),
    };

    return withComputedAnalytics(workspaceWithoutAnalytics);
  }
}
