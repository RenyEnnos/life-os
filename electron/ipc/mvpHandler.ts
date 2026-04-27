import path from 'node:path';

import { app, ipcMain } from 'electron';

import type { StoredUser } from '../../api/authRepository';
import { FileBackedMvpRepository } from '../../api/mvpRepository';
import type { MvpRepository } from '../../api/mvpRepository.types';
import type {
  MvpDailyCheckIn,
  MvpOnboardingDraft,
  MvpReflectionEntry,
  MvpReviewDraft,
} from '../../src/features/mvp/types';

import { hydrateDesktopSession } from '../auth/desktopSession';

function createDesktopMvpRepository() {
  return new FileBackedMvpRepository(
    process.env.LIFEOS_DESKTOP_MVP_DATA_FILE || path.join(app.getPath('userData'), 'mvp-workspace.json'),
  );
}

async function resolveDesktopUser(): Promise<StoredUser> {
  const { session } = await hydrateDesktopSession();

  if (!session?.user?.id) {
    throw new Error('Desktop MVP transport requires an authenticated session.');
  }

  const email = session.user.email || `${session.user.id}@desktop.local`;

  const fullName =
    typeof session.user.user_metadata?.full_name === 'string'
      ? session.user.user_metadata.full_name
      : typeof session.user.user_metadata?.nickname === 'string'
        ? session.user.user_metadata.nickname
        : email;

  return {
    id: session.user.id,
    email,
    passwordHash: '',
    fullName,
    inviteCode: 'desktop-local',
    theme: 'dark',
    onboardingCompleted: false,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

type ResolveDesktopUser = () => Promise<StoredUser>;

async function withDesktopWorkspace<T>(
  repository: MvpRepository,
  resolveUser: ResolveDesktopUser,
  action: (repository: MvpRepository, user: StoredUser) => Promise<T>,
) {
  const user = await resolveUser();
  await repository.ensureUser(user);
  return action(repository, user);
}

export const setupMvpHandlers = (
  repository: MvpRepository = createDesktopMvpRepository(),
  resolveUser: ResolveDesktopUser = resolveDesktopUser,
) => {
  ipcMain.handle('mvp:getWorkspace', async () =>
    withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.getWorkspace(user.id)),
  );

  ipcMain.handle('mvp:saveOnboarding', async (_event, input: Omit<MvpOnboardingDraft, 'completedAt'>) =>
    withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.saveOnboarding(user.id, input)),
  );

  ipcMain.handle('mvp:generateWeeklyPlan', async (_event, input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>) =>
    withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.generatePlan(user.id, input)),
  );

  ipcMain.handle('mvp:confirmPlan', async (_event, planId: string) =>
    withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.confirmPlan(user.id, planId)),
  );

  ipcMain.handle(
    'mvp:updateActionStatus',
    async (_event, actionItemId: string, patch: { status?: 'todo' | 'done' | 'deferred'; note?: string }) =>
      withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.updateActionItem(user.id, actionItemId, patch)),
  );

  ipcMain.handle('mvp:saveDailyCheckIn', async (_event, input: Omit<MvpDailyCheckIn, 'createdAt'>) =>
    withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.saveDailyCheckIn(user.id, input)),
  );

  ipcMain.handle(
    'mvp:addReflection',
    async (_event, input: Pick<MvpReflectionEntry, 'period' | 'body'>) =>
      withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.addReflection(user.id, input)),
  );

  ipcMain.handle('mvp:submitFeedback', async (_event, input: { rating: number; message: string }) =>
    withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.submitFeedback(user.id, input)),
  );

  ipcMain.handle('mvp:resetWorkspace', async () =>
    withDesktopWorkspace(repository, resolveUser, (repo, user) => repo.resetWorkspace(user.id)),
  );
};
