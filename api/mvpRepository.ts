import fs from 'node:fs/promises';
import path from 'node:path';

import type { StoredUser } from './authRepository';
import type { MvpRepository } from './mvpRepository.types';

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

  async resetWorkspace(userId: string): Promise<MvpWorkspaceSnapshot> {
    return this.updateWorkspace(userId, () => defaultWorkspace());
  }

  private async updateWorkspace(
    userId: string,
    update: (workspace: MvpWorkspaceSnapshot) => MvpWorkspaceSnapshot
  ): Promise<MvpWorkspaceSnapshot> {
    const store = await this.readStore();
    const current = store.users[userId] ?? defaultWorkspace();
    const next = buildSnapshot(update(current));
    store.users[userId] = next;
    await this.writeStore(store);
    return next;
  }

  private async readStore(): Promise<PersistedMvpStore> {
    try {
      const raw = await fs.readFile(this.dataFilePath, 'utf-8');
      return JSON.parse(raw) as PersistedMvpStore;
    } catch {
      return { users: {} };
    }
  }

  private async writeStore(store: PersistedMvpStore): Promise<void> {
    await fs.mkdir(path.dirname(this.dataFilePath), { recursive: true });
    await fs.writeFile(this.dataFilePath, JSON.stringify(store, null, 2));
  }
}
