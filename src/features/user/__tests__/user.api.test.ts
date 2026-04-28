import { describe, it, expect, beforeEach } from 'vitest';
import { userApi } from '../api/user.api';

describe('userApi', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('getStoredPreferences', () => {
        it('returns empty object when no stored preferences', () => {
            const prefs = userApi.getStoredPreferences('user-123');
            expect(prefs).toEqual({});
        });

        it('returns stored preferences for user', () => {
            localStorage.setItem('user_preferences:user-123', JSON.stringify({ theme: 'dark' }));
            const prefs = userApi.getStoredPreferences('user-123');
            expect(prefs).toEqual({ theme: 'dark' });
        });

        it('returns empty object for invalid JSON', () => {
            localStorage.setItem('user_preferences:user-123', 'invalid-json');
            const prefs = userApi.getStoredPreferences('user-123');
            expect(prefs).toEqual({});
        });

        it('uses anonymous key when no userId', () => {
            localStorage.setItem('user_preferences:anonymous', JSON.stringify({ lang: 'pt' }));
            const prefs = userApi.getStoredPreferences();
            expect(prefs).toEqual({ lang: 'pt' });
        });
    });

    describe('updatePreferences', () => {
        it('stores preferences and returns them', async () => {
            const result = await userApi.updatePreferences('user-123', { theme: 'dark' });
            expect(result).toEqual({ theme: 'dark' });
            expect(localStorage.getItem('user_preferences:user-123')).toBe('{"theme":"dark"}');
        });

        it('overwrites existing preferences', async () => {
            localStorage.setItem('user_preferences:user-123', JSON.stringify({ theme: 'light' }));
            const result = await userApi.updatePreferences('user-123', { theme: 'dark', lang: 'pt' });
            expect(result).toEqual({ theme: 'dark', lang: 'pt' });
        });
    });
});
