import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userApi, User } from '../api/user.api';
import { useThemeStore } from '@/shared/stores/themeStore';

export function useUser() {
    const { user, profile, loading } = useAuth();
    const userId = user?.id;
    const [preferences, setPreferences] = useState<Record<string, unknown>>(() => userApi.getStoredPreferences(userId));

    useEffect(() => {
        setPreferences(userApi.getStoredPreferences(userId));
    }, [userId]);

    const userProfile = useMemo<User | null>(() => {
        if (!user) {
            return null;
        }

        const storedTheme = typeof preferences.theme === 'string' ? preferences.theme : undefined;

        return {
            id: user.id,
            email: user.email,
            name: profile?.full_name || user.user_metadata?.full_name,
            preferences,
            theme: storedTheme || profile?.theme,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    }, [preferences, profile?.full_name, profile?.theme, user]);

    const updatePreferences = useMutation({
        mutationFn: async (nextPreferences: Record<string, unknown>) => {
            const merged = { ...preferences, ...nextPreferences };
            await userApi.updatePreferences(userId, merged);

            const theme = merged.theme;
            if (theme === 'light' || theme === 'dark') {
                useThemeStore.getState().setTheme(theme);
            }

            setPreferences(merged);
            return merged;
        },
        onSuccess: () => {
            setPreferences(userApi.getStoredPreferences(userId));
        },
    });

    return {
        userProfile,
        isLoading: loading,
        updatePreferences,
    };
}
