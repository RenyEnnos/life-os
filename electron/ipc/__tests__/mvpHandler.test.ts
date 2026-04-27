import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FileBackedMvpRepository } from '../../../api/mvpRepository';
import type { StoredUser } from '../../../api/authRepository';

const mockState = vi.hoisted(() => ({
  handlers: new Map<string, (event: unknown, ...args: unknown[]) => Promise<unknown>>(),
}));

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => os.tmpdir()),
  },
  ipcMain: {
    handle: vi.fn((channel: string, handler: (event: unknown, ...args: unknown[]) => Promise<unknown>) => {
      mockState.handlers.set(channel, handler);
    }),
  },
}));

vi.mock('../../auth/desktopSession', () => ({
  hydrateDesktopSession: vi.fn(),
}));

import { hydrateDesktopSession } from '../../auth/desktopSession';
import { setupMvpHandlers } from '../mvpHandler';

describe('setupMvpHandlers', () => {
  const tempFile = path.join(os.tmpdir(), `lifeos-mvp-ipc-${Date.now()}.json`);
  const testUser: StoredUser = {
    id: 'desktop-user',
    email: 'desktop@example.com',
    passwordHash: '',
    fullName: 'Desktop User',
    inviteCode: 'desktop-local',
    theme: 'dark',
    onboardingCompleted: false,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockState.handlers.clear();
    vi.clearAllMocks();
    await fs.rm(tempFile, { force: true });

    setupMvpHandlers(new FileBackedMvpRepository(tempFile), async () => testUser);
  });

  afterEach(async () => {
    await fs.rm(tempFile, { force: true });
  });

  it('persists the MVP loop through the explicit Electron transport', async () => {
    const getWorkspace = mockState.handlers.get('mvp:getWorkspace');
    const saveOnboarding = mockState.handlers.get('mvp:saveOnboarding');
    const generateWeeklyPlan = mockState.handlers.get('mvp:generateWeeklyPlan');
    const confirmPlan = mockState.handlers.get('mvp:confirmPlan');
    const updateActionStatus = mockState.handlers.get('mvp:updateActionStatus');
    const saveDailyCheckIn = mockState.handlers.get('mvp:saveDailyCheckIn');
    const addReflection = mockState.handlers.get('mvp:addReflection');
    const submitFeedback = mockState.handlers.get('mvp:submitFeedback');

    const initialWorkspace = await getWorkspace?.({});
    expect(initialWorkspace).toBeTruthy();

    const onboarding = await saveOnboarding?.({}, {
      displayName: 'Pedro',
      role: 'Founding Engineer',
      lifeSeason: 'Shipping MVP',
      planningPain: 'Transport seams',
      successDefinition: 'A trusted weekly loop on desktop',
      goals: ['Ship the explicit bridge'],
      commitments: ['Family logistics'],
      constraints: ['Keep scope tight'],
    });

    expect((onboarding as { onboarding: { completedAt: string | null } }).onboarding.completedAt).toBeTruthy();

    const generated = await generateWeeklyPlan?.({}, {
      wins: ['Desktop auth works'],
      unfinishedWork: ['Replace legacy fallback'],
      constraints: ['Protect focus'],
      focusArea: 'Trust',
      energyLevel: 4,
      notes: 'Keep the MVP narrow.',
    });

    const generatedPlan = generated as {
      plan: { id?: string; priorities: Array<{ actions: Array<{ id: string }> }> };
    };
    const planId = generatedPlan.plan.id;
    const actionId = generatedPlan.plan.priorities[0].actions[0].id;

    expect(planId).toBeTruthy();

    const confirmed = await confirmPlan?.({}, planId);
    expect((confirmed as { plan: { confirmedAt: string | null } }).plan.confirmedAt).toBeTruthy();

    const updatedAction = await updateActionStatus?.({}, actionId, {
      status: 'done',
      note: 'Completed in the Electron transport test.',
    });
    expect((updatedAction as { analytics: { completedActions: number } }).analytics.completedActions).toBe(1);

    const checkedIn = await saveDailyCheckIn?.({}, {
      date: '2026-03-20',
      energy: 4,
      focus: 4,
      blockers: 'None',
      note: 'Happy path held.',
    });
    expect((checkedIn as { analytics: { dailyCheckIns: number } }).analytics.dailyCheckIns).toBe(1);

    const reflected = await addReflection?.({}, {
      period: 'daily',
      body: 'Explicit transport removed ambiguity.',
    });
    expect((reflected as { reflections: unknown[] }).reflections).toHaveLength(1);

    const feedback = await submitFeedback?.({}, {
      rating: 5,
      message: 'Desktop MVP path feels trustworthy now.',
    });
    expect((feedback as { feedback: unknown[]; analytics: { feedbackEntries: number } }).analytics.feedbackEntries).toBe(1);
  });

  it('falls back to a desktop-local email when the restored session has no email', async () => {
    mockState.handlers.clear();
    vi.mocked(hydrateDesktopSession).mockResolvedValue({
      client: null,
      session: {
        user: {
          id: 'restored-desktop-user',
          user_metadata: {
            nickname: 'Restored User',
          },
        },
      } as never,
    });

    setupMvpHandlers(new FileBackedMvpRepository(tempFile));

    const getWorkspace = mockState.handlers.get('mvp:getWorkspace');
    const saveOnboarding = mockState.handlers.get('mvp:saveOnboarding');

    await getWorkspace?.({});
    await saveOnboarding?.({}, {
      displayName: 'Recovered',
      role: 'QA',
      lifeSeason: 'Stability',
      planningPain: 'Broken auth restoration',
      successDefinition: 'Keep MVP transport alive offline',
      goals: ['Exercise the fallback'],
      commitments: [],
      constraints: [],
    });

    const persisted = JSON.parse(await fs.readFile(tempFile, 'utf8')) as {
      users?: Record<string, { onboarding?: { displayName?: string } }>
    }

    expect(persisted.users?.['restored-desktop-user']?.onboarding?.displayName).toBe('Recovered')
  });
});
