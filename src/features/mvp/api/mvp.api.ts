import { apiClient } from '@/shared/api/http';
import { isDesktopApp } from '@/shared/lib/platform';
import type {
  MvpDailyCheckIn,
  MvpOnboardingDraft,
  MvpReflectionEntry,
  MvpReviewDraft,
  MvpWorkspaceSnapshot,
} from '@/features/mvp/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ActionPatch {
  status?: 'todo' | 'done' | 'deferred';
  note?: string;
}

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

function getDesktopMvpBridge() {
  if (!isDesktopApp() || typeof window === 'undefined' || !window.api?.mvp) {
    return null;
  }

  return window.api.mvp as {
    getWorkspace: () => Promise<MvpWorkspaceSnapshot>;
    saveOnboarding: (input: Omit<MvpOnboardingDraft, 'completedAt'>) => Promise<MvpWorkspaceSnapshot>;
    generateWeeklyPlan: (input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>) => Promise<MvpWorkspaceSnapshot>;
    confirmPlan: (planId: string) => Promise<MvpWorkspaceSnapshot>;
    updateActionStatus: (actionItemId: string, patch: ActionPatch) => Promise<MvpWorkspaceSnapshot>;
    saveDailyCheckIn: (input: Omit<MvpDailyCheckIn, 'createdAt'>) => Promise<MvpWorkspaceSnapshot>;
    addReflection: (input: Omit<MvpReflectionEntry, 'id' | 'createdAt'>) => Promise<MvpWorkspaceSnapshot>;
    submitFeedback: (input: { rating: number; message: string }) => Promise<MvpWorkspaceSnapshot>;
    resetWorkspace: () => Promise<MvpWorkspaceSnapshot>;
  };
}

export const mvpApi = {
  getWorkspace: async () => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.getWorkspace();
    }

    return unwrap(await apiClient.get<ApiResponse<MvpWorkspaceSnapshot>>('/api/mvp/workspace'));
  },

  saveOnboarding: async (input: Omit<MvpOnboardingDraft, 'completedAt'>) => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.saveOnboarding(input);
    }

    return unwrap(await apiClient.put<ApiResponse<MvpWorkspaceSnapshot>>('/api/mvp/onboarding', input));
  },

  generateWeeklyPlan: async (input: Omit<MvpReviewDraft, 'generatedAt' | 'id'>) => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.generateWeeklyPlan(input);
    }

    return unwrap(await apiClient.post<ApiResponse<MvpWorkspaceSnapshot>>('/api/mvp/weekly-plans/generate', input));
  },

  confirmPlan: async (planId: string) => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.confirmPlan(planId);
    }

    return unwrap(await apiClient.post<ApiResponse<MvpWorkspaceSnapshot>>(`/api/mvp/weekly-plans/${planId}/confirm`));
  },

  updateActionStatus: async (actionItemId: string, patch: ActionPatch) => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.updateActionStatus(actionItemId, patch);
    }

    return unwrap(await apiClient.patch<ApiResponse<MvpWorkspaceSnapshot>>(`/api/mvp/action-items/${actionItemId}`, patch));
  },

  saveDailyCheckIn: async (input: Omit<MvpDailyCheckIn, 'createdAt'>) => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.saveDailyCheckIn(input);
    }

    return unwrap(await apiClient.post<ApiResponse<MvpWorkspaceSnapshot>>('/api/mvp/daily-checkins', input));
  },

  addReflection: async (input: Omit<MvpReflectionEntry, 'id' | 'createdAt'>) => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.addReflection(input);
    }

    return unwrap(await apiClient.post<ApiResponse<MvpWorkspaceSnapshot>>('/api/mvp/reflections', input));
  },

  submitFeedback: async (input: { rating: number; message: string }) => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.submitFeedback(input);
    }

    return unwrap(await apiClient.post<ApiResponse<MvpWorkspaceSnapshot>>('/api/mvp/feedback', input));
  },

  resetWorkspace: async () => {
    const desktopBridge = getDesktopMvpBridge();
    if (desktopBridge) {
      return desktopBridge.resetWorkspace();
    }

    return unwrap(await apiClient.delete<ApiResponse<MvpWorkspaceSnapshot>>('/api/mvp/workspace'));
  },
};
