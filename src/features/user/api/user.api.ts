import { apiClient } from '@/shared/api/http';

export type User = {
    id: string;
    email?: string;
    name?: string;
    preferences?: Record<string, unknown>;
    theme?: string;
    created_at: string;
    updated_at?: string;
};

export const userApi = {
    getMe: async (): Promise<User> => {
        return apiClient.get<User>('/api/user/me');
    },

    updatePreferences: async (preferences: Record<string, unknown>): Promise<User> => {
        return apiClient.put<User>('/api/user/preferences', preferences);
    },
};
