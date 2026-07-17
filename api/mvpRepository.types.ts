import type { StoredUser } from './authRepository';

import type {
  MvpDailyCheckIn,
  MvpOnboardingDraft,
  MvpReflectionEntry,
  MvpReviewDraft,
  MvpWorkspaceSnapshot,
} from '@/features/mvp/types';
import type { MvpWorkspaceExport, MvpWorkspaceRecovery } from './workspaceRecovery';

export interface MvpRepository {
  ensureUser(user: StoredUser): Promise<void>;
  getWorkspace(userId: string): Promise<MvpWorkspaceSnapshot>;
  saveOnboarding(userId: string, input: Omit<MvpOnboardingDraft, 'completedAt'>): Promise<MvpWorkspaceSnapshot>;
  generatePlan(userId: string, input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>): Promise<MvpWorkspaceSnapshot>;
  confirmPlan(userId: string, planId: string): Promise<MvpWorkspaceSnapshot>;
  updateActionItem(
    userId: string,
    actionItemId: string,
    patch: { status?: 'todo' | 'done' | 'deferred'; note?: string }
  ): Promise<MvpWorkspaceSnapshot>;
  saveDailyCheckIn(userId: string, input: Omit<MvpDailyCheckIn, 'createdAt'>): Promise<MvpWorkspaceSnapshot>;
  addReflection(userId: string, input: Pick<MvpReflectionEntry, 'period' | 'body'>): Promise<MvpWorkspaceSnapshot>;
  submitFeedback(userId: string, input: { rating: number; message: string }): Promise<MvpWorkspaceSnapshot>;
  exportWorkspace(userId: string): Promise<MvpWorkspaceExport>;
  resetWorkspace(
    userId: string,
    prepared: MvpWorkspaceExport,
  ): Promise<{ workspace: MvpWorkspaceSnapshot; recoveryId: string; export: MvpWorkspaceExport }>;
  getLatestRecovery(userId: string): Promise<MvpWorkspaceRecovery | null>;
  restoreWorkspace(userId: string, portableExport: MvpWorkspaceExport): Promise<MvpWorkspaceSnapshot>;
}
