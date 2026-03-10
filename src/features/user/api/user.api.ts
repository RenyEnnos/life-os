export type User = {
    id: string;
    email?: string;
    name?: string;
    preferences?: Record<string, unknown>;
    theme?: string;
    created_at: string;
    updated_at?: string;
};

const USER_PREFERENCES_KEY = 'user_preferences';

const readStoredPreferences = (): Record<string, unknown> => {
    if (typeof window === 'undefined') {
        return {};
    }

    const raw = window.localStorage.getItem(USER_PREFERENCES_KEY);
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

const writeStoredPreferences = (preferences: Record<string, unknown>) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
};

export const userApi = {
    getStoredPreferences: (): Record<string, unknown> => readStoredPreferences(),

    updatePreferences: async (preferences: Record<string, unknown>): Promise<Record<string, unknown>> => {
        writeStoredPreferences(preferences);
        return preferences;
    },
};
