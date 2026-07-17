import path from 'node:path';
import { z } from 'zod';

import type { StoredUser } from './authRepository';
import { mutateJsonFile, readJsonFile } from './atomicJsonFile';
import type { MvpRepository } from './mvpRepository.types';
import {
  createWorkspaceExport,
  digestWorkspace,
  normalizeWorkspace,
  workspaceExportSchema,
  type MvpWorkspaceExport,
  type MvpWorkspaceRecovery,
} from './workspaceRecovery';

import { generateWeeklyPlan } from '../shared/mvp/plan';
import {
  createEmptyWorkspace,
  initialOnboardingDraft,
  makeMvpId,
  pushMvpEvent,
  withComputedAnalytics,
} from '../shared/mvp/state';
import type {
  MvpDailyCheckIn,
  MvpOnboardingDraft,
  MvpReflectionEntry,
  MvpReviewDraft,
  MvpWorkspaceSnapshot,
} from '../shared/mvp/types';

export interface PersistedMvpStore {
  users: Record<string, MvpWorkspaceSnapshot>;
  recoveries: Record<string, MvpWorkspaceRecovery[]>;
}

const workspaceSnapshotSchema = z.custom<MvpWorkspaceSnapshot>((value) => workspaceExportSchema.safeParse({
  format: 'lifeos.mvp.workspace', version: 1, exportedAt: '2026-01-01T00:00:00.000Z', workspace: value,
}).success, 'Invalid workspace snapshot');
const workspaceRecoverySchema = z.object({ id: z.string().min(1), export: workspaceExportSchema }).strict();
export const persistedMvpStoreSchema = z.object({
  users: z.record(z.string(), workspaceSnapshotSchema),
  recoveries: z.record(z.string(), z.array(workspaceRecoverySchema)).optional().default({}),
}).strict() as z.ZodType<PersistedMvpStore>;

function emptyStore(): PersistedMvpStore {
  return { users: {}, recoveries: {} };
}

const DEFAULT_DATA_FILE = path.join(process.cwd(), '.data', 'mvp-workspace.json');

function defaultWorkspace() {
  return createEmptyWorkspace();
}

function buildSnapshot(snapshot: MvpWorkspaceSnapshot): MvpWorkspaceSnapshot {
  const { analytics: _analytics, ...rest } = snapshot;
  void _analytics;
  return withComputedAnalytics(rest);
}

export class FileBackedMvpRepository implements MvpRepository {
  constructor(private readonly dataFilePath = process.env.MVP_DATA_FILE || DEFAULT_DATA_FILE) {}

  async ensureUser(_user: StoredUser): Promise<void> {
    return Promise.resolve();
  }

  async getWorkspace(userId: string): Promise<MvpWorkspaceSnapshot> {
    const store = await this.readStore();
    return buildSnapshot(store.users[userId] ?? defaultWorkspace());
  }

  async saveOnboarding(
    userId: string,
    input: Omit<MvpOnboardingDraft, 'completedAt'>
  ): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, (workspace) => {
      const completedAt = new Date().toISOString();
      let events = workspace.events;

      if (!workspace.onboarding.completedAt) {
        events = pushMvpEvent(events, 'onboarding_started', completedAt);
      }

      events = pushMvpEvent(events, 'onboarding_completed', completedAt);

      return {
        ...workspace,
        onboarding: { ...input, completedAt },
        events,
      };
    });
  }

  async generatePlan(
    userId: string,
    input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>
  ): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, (workspace) => {
      const generatedAt = new Date().toISOString();
      const review: MvpReviewDraft = {
        ...input,
        id: makeMvpId('review'),
        generatedAt,
      };
      const generatedPlan = generateWeeklyPlan(
        workspace.onboarding.completedAt ? workspace.onboarding : initialOnboardingDraft,
        review,
        new Date(generatedAt)
      );

      const plan = {
        ...generatedPlan,
        id: makeMvpId('plan'),
      };

      return {
        ...workspace,
        review,
        plan,
        events: pushMvpEvent(
          pushMvpEvent(
            pushMvpEvent(workspace.events, 'weekly_review_started', generatedAt),
            'weekly_review_completed',
            generatedAt
          ),
          'weekly_plan_generated',
          generatedAt
        ),
      };
    });
  }

  async confirmPlan(userId: string, planId: string): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, (workspace) => {
      if (workspace.plan.id !== planId || !workspace.plan.generatedAt) {
        return workspace;
      }

      const confirmedAt = new Date().toISOString();
      return {
        ...workspace,
        plan: {
          ...workspace.plan,
          confirmedAt,
        },
        events: pushMvpEvent(workspace.events, 'weekly_plan_confirmed', confirmedAt),
      };
    });
  }

  async updateActionItem(
    userId: string,
    actionItemId: string,
    patch: { status?: 'todo' | 'done' | 'deferred'; note?: string }
  ): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, (workspace) => ({
      ...workspace,
      plan: {
        ...workspace.plan,
        priorities: workspace.plan.priorities.map((priority) => ({
          ...priority,
          actions: priority.actions.map((action) =>
            action.id === actionItemId
              ? {
                  ...action,
                  status: patch.status ?? action.status,
                  note: typeof patch.note === 'string' ? patch.note : action.note,
                }
              : action
          ),
        })),
      },
    }));
  }

  async saveDailyCheckIn(
    userId: string,
    input: Omit<MvpDailyCheckIn, 'createdAt'>
  ): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, (workspace) => {
      const createdAt = new Date().toISOString();
      const nextEntry: MvpDailyCheckIn = { ...input, createdAt };
      const existingIndex = workspace.dailyCheckIns.findIndex((entry) => entry.date === input.date);
      const dailyCheckIns =
        existingIndex >= 0
          ? workspace.dailyCheckIns.map((entry, index) => (index === existingIndex ? nextEntry : entry))
          : [...workspace.dailyCheckIns, nextEntry];

      return {
        ...workspace,
        dailyCheckIns,
        events: pushMvpEvent(workspace.events, 'daily_checkin_completed', createdAt),
      };
    });
  }

  async addReflection(
    userId: string,
    input: Pick<MvpReflectionEntry, 'period' | 'body'>
  ): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, (workspace) => ({
      ...workspace,
      reflections: [
        {
          id: makeMvpId('reflection'),
          createdAt: new Date().toISOString(),
          ...input,
        },
        ...workspace.reflections,
      ],
      events: pushMvpEvent(workspace.events, 'reflection_completed'),
    }));
  }

  async submitFeedback(
    userId: string,
    input: { rating: number; message: string }
  ): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, (workspace) => ({
      ...workspace,
      feedback: [
        {
          id: makeMvpId('feedback'),
          createdAt: new Date().toISOString(),
          ...input,
        },
        ...workspace.feedback,
      ],
      events: pushMvpEvent(workspace.events, 'user_feedback_submitted'),
    }));
  }

  async exportWorkspace(userId: string): Promise<MvpWorkspaceExport> {
    return createWorkspaceExport(await this.getWorkspace(userId));
  }

  async resetWorkspace(userId: string, preparedInput: MvpWorkspaceExport) {
    return mutateJsonFile(this.dataFilePath, persistedMvpStoreSchema, emptyStore, async (store) => {
      const parsed = workspaceExportSchema.parse(preparedInput);
      const prepared = createWorkspaceExport(parsed.workspace, parsed.exportedAt);
      const current = buildSnapshot(store.users[userId] ?? defaultWorkspace());
      if (digestWorkspace(current) !== digestWorkspace(prepared.workspace)) {
        throw new Error('Workspace changed after export');
      }

      const recovery: MvpWorkspaceRecovery = {
        id: makeMvpId('recovery'),
        export: prepared,
      };
      store.recoveries[userId] = [recovery, ...(store.recoveries[userId] ?? [])].slice(0, 5);
      const workspace = defaultWorkspace();
      store.users[userId] = workspace;
      return { state: store, result: { workspace, recoveryId: recovery.id, export: recovery.export } };
    });
  }

  async getLatestRecovery(userId: string): Promise<MvpWorkspaceRecovery | null> {
    const store = await this.readStore();
    return store.recoveries[userId]?.[0] ?? null;
  }

  async restoreWorkspace(userId: string, portableExportInput: MvpWorkspaceExport) {
    return mutateJsonFile(this.dataFilePath, persistedMvpStoreSchema, emptyStore, async (store) => {
      const portableExport = workspaceExportSchema.parse(portableExportInput);
      const restored = normalizeWorkspace(portableExport.workspace);
      store.users[userId] = restored;
      return { state: store, result: restored };
    });
  }

  private async updateWorkspace(
    userId: string,
    update: (workspace: MvpWorkspaceSnapshot) => MvpWorkspaceSnapshot
  ): Promise<MvpWorkspaceSnapshot> {
    return mutateJsonFile(this.dataFilePath, persistedMvpStoreSchema, emptyStore, async (store) => {
      const current = store.users[userId] ?? defaultWorkspace();
      const next = buildSnapshot(update(current));
      store.users[userId] = next;
      return { state: store, result: next };
    });
  }

  private async readStore(): Promise<PersistedMvpStore> {
    return readJsonFile(this.dataFilePath, persistedMvpStoreSchema, emptyStore);
  }
}
