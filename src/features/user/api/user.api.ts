export type User = {
    id: string;
    email?: string;
    name?: string;
    preferences?: Record<string, unknown>;
    theme?: string;
    created_at: string;
    updated_at?: string;
};

const getUserPreferencesKey = (userId?: string) => `user_preferences:${userId || 'anonymous'}`;

const readStoredPreferences = (userId?: string): Record<string, unknown> => {
    if (typeof window === 'undefined') {
        return {};
    }

    const raw = window.localStorage.getItem(getUserPreferencesKey(userId));
    if (!raw) {
        return {};
    }

    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
        return {};
    }
};

const writeStoredPreferences = (userId: string | undefined, preferences: Record<string, unknown>) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(getUserPreferencesKey(userId), JSON.stringify(preferences));
};

export const userApi = {
    getStoredPreferences: (userId?: string): Record<string, unknown> => readStoredPreferences(userId),

    updatePreferences: async (userId: string | undefined, preferences: Record<string, unknown>): Promise<Record<string, unknown>> => {
        writeStoredPreferences(userId, preferences);
        return preferences;
    },
};
