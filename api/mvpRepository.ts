import fs from 'node:fs/promises';
import path from 'node:path';

import type { StoredUser } from './authRepository';
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

interface PersistedMvpStore {
  users: Record<string, MvpWorkspaceSnapshot>;
  recoveries: Record<string, MvpWorkspaceRecovery[]>;
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
  private mutationQueue: Promise<void> = Promise.resolve();

  constructor(private readonly dataFilePath = process.env.MVP_DATA_FILE || DEFAULT_DATA_FILE) {}

  private runMutation<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationQueue.then(operation, operation);
    this.mutationQueue = result.then(() => undefined, () => undefined);
    return result;
  }

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
    return this.runMutation(async () => {
      const parsed = workspaceExportSchema.parse(preparedInput);
      const prepared = createWorkspaceExport(parsed.workspace, parsed.exportedAt);
      const store = await this.readStore();
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
      await this.writeStore(store);
      return { workspace, recoveryId: recovery.id, export: recovery.export };
    });
  }

  async getLatestRecovery(userId: string): Promise<MvpWorkspaceRecovery | null> {
    const store = await this.readStore();
    return store.recoveries[userId]?.[0] ?? null;
  }

  async restoreWorkspace(userId: string, portableExportInput: MvpWorkspaceExport) {
    return this.runMutation(async () => {
      const portableExport = workspaceExportSchema.parse(portableExportInput);
      const restored = normalizeWorkspace(portableExport.workspace);
      const store = await this.readStore();
      store.users[userId] = restored;
      await this.writeStore(store);
      return restored;
    });
  }

  private async updateWorkspace(
    userId: string,
    update: (workspace: MvpWorkspaceSnapshot) => MvpWorkspaceSnapshot
  ): Promise<MvpWorkspaceSnapshot> {
    return this.runMutation(async () => {
      const store = await this.readStore();
      const current = store.users[userId] ?? defaultWorkspace();
      const next = buildSnapshot(update(current));
      store.users[userId] = next;
      await this.writeStore(store);
      return next;
    });
  }

  private async readStore(): Promise<PersistedMvpStore> {
    try {
      const raw = await fs.readFile(this.dataFilePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<PersistedMvpStore>;
      return { users: parsed.users ?? {}, recoveries: parsed.recoveries ?? {} };
    } catch {
      return { users: {}, recoveries: {} };
    }
  }

  private async writeStore(store: PersistedMvpStore): Promise<void> {
    await fs.mkdir(path.dirname(this.dataFilePath), { recursive: true });
    await fs.writeFile(this.dataFilePath, JSON.stringify(store, null, 2));
  }
}
