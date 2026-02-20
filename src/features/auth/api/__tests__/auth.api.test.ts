import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from '../auth.api';
import { apiClient } from '@/shared/api/http';

// Mock apiClient
vi.mock('@/shared/api/http', () => ({
    apiClient: {
        post: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

describe('authApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should send login credentials and return user data', async () => {
            const mockCredentials = {
                email: 'test@example.com',
                password: 'password123',
            };

            const mockResponse = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    name: 'Test User',
                },
            };

            (apiClient.post as any).mockResolvedValue(mockResponse);

            const result = await authApi.login(mockCredentials);

            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', mockCredentials);
            expect(result).toEqual(mockResponse);
        });

        it('should handle login errors', async () => {
            const mockCredentials = {
                email: 'test@example.com',
                password: 'wrong-password',
            };

            const mockError = new Error('Invalid credentials');
            (apiClient.post as any).mockRejectedValue(mockError);

            await expect(authApi.login(mockCredentials)).rejects.toThrow('Invalid credentials');
            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', mockCredentials);
        });
    });

    describe('register', () => {
        it('should send registration credentials and return user data', async () => {
            const mockCredentials = {
                email: 'newuser@example.com',
                password: 'password123',
                name: 'New User',
            };

            const mockResponse = {
                user: {
                    id: 'user-456',
                    email: 'newuser@example.com',
                    name: 'New User',
                },
            };

            (apiClient.post as any).mockResolvedValue(mockResponse);

            const result = await authApi.register(mockCredentials);

            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', mockCredentials);
            expect(result).toEqual(mockResponse);
        });

        it('should handle registration errors', async () => {
            const mockCredentials = {
                email: 'existing@example.com',
                password: 'password123',
                name: 'Existing User',
            };

            const mockError = new Error('Email already exists');
            (apiClient.post as any).mockRejectedValue(mockError);

            await expect(authApi.register(mockCredentials)).rejects.toThrow('Email already exists');
            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', mockCredentials);
        });

        it('should handle registration with minimal required fields', async () => {
            const mockCredentials = {
                email: 'minimal@example.com',
                password: 'password123',
            };

            const mockResponse = {
                user: {
                    id: 'user-789',
                    email: 'minimal@example.com',
                },
            };

            (apiClient.post as any).mockResolvedValue(mockResponse);

            const result = await authApi.register(mockCredentials);

            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', mockCredentials);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('logout', () => {
        it('should send logout request', async () => {
            (apiClient.post as any).mockResolvedValue({ success: true });

            await authApi.logout();

            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/logout', {});
        });

        it('should handle logout errors gracefully', async () => {
            const mockError = new Error('Logout failed');
            (apiClient.post as any).mockRejectedValue(mockError);

            await expect(authApi.logout()).rejects.toThrow('Logout failed');
            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/logout', {});
        });
    });

    describe('verify', () => {
        it('should send verify request and return user data', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                name: 'Test User',
            };

            (apiClient.get as any).mockResolvedValue(mockUser);

            const result = await authApi.verify();

            expect(apiClient.get).toHaveBeenCalledWith('/api/auth/verify');
            expect(result).toEqual(mockUser);
        });

        it('should handle verify errors when session is invalid', async () => {
            const mockError = new Error('Invalid session');
            (apiClient.get as any).mockRejectedValue(mockError);

            await expect(authApi.verify()).rejects.toThrow('Invalid session');
            expect(apiClient.get).toHaveBeenCalledWith('/api/auth/verify');
        });

        it('should handle verify errors when no session exists', async () => {
            const mockError = new Error('No session found');
            (apiClient.get as any).mockRejectedValue(mockError);

            await expect(authApi.verify()).rejects.toThrow('No session found');
        });
    });

    describe('updateProfile', () => {
        it('should update profile with name', async () => {
            const updateData = { name: 'Updated Name' };
            const mockResponse = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    name: 'Updated Name',
                },
            };

            (apiClient.patch as any).mockResolvedValue(mockResponse);

            const result = await authApi.updateProfile(updateData);

            expect(apiClient.patch).toHaveBeenCalledWith('/api/auth/profile', updateData);
            expect(result).toEqual(mockResponse);
        });

        it('should update profile with avatar_url', async () => {
            const updateData = { avatar_url: 'https://example.com/avatar.jpg' };
            const mockResponse = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    avatar_url: 'https://example.com/avatar.jpg',
                },
            };

            (apiClient.patch as any).mockResolvedValue(mockResponse);

            const result = await authApi.updateProfile(updateData);

            expect(apiClient.patch).toHaveBeenCalledWith('/api/auth/profile', updateData);
            expect(result).toEqual(mockResponse);
        });

        it('should update profile with theme', async () => {
            const updateData = { theme: 'dark' as const };
            const mockResponse = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    preferences: { theme: 'dark' },
                },
            };

            (apiClient.patch as any).mockResolvedValue(mockResponse);

            const result = await authApi.updateProfile(updateData);

            expect(apiClient.patch).toHaveBeenCalledWith('/api/auth/profile', updateData);
            expect(result).toEqual(mockResponse);
        });

        it('should update profile with preferences', async () => {
            const updateData = { preferences: { language: 'pt-BR', notifications: true } };
            const mockResponse = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    preferences: { language: 'pt-BR', notifications: true },
                },
            };

            (apiClient.patch as any).mockResolvedValue(mockResponse);

            const result = await authApi.updateProfile(updateData);

            expect(apiClient.patch).toHaveBeenCalledWith('/api/auth/profile', updateData);
            expect(result).toEqual(mockResponse);
        });

        it('should update profile with multiple fields', async () => {
            const updateData = {
                name: 'Updated User',
                avatar_url: 'https://example.com/new-avatar.jpg',
                theme: 'light' as const,
            };
            const mockResponse = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    name: 'Updated User',
                    avatar_url: 'https://example.com/new-avatar.jpg',
                    preferences: { theme: 'light' },
                },
            };

            (apiClient.patch as any).mockResolvedValue(mockResponse);

            const result = await authApi.updateProfile(updateData);

            expect(apiClient.patch).toHaveBeenCalledWith('/api/auth/profile', updateData);
            expect(result).toEqual(mockResponse);
        });

        it('should handle updateProfile errors', async () => {
            const updateData = { name: 'Updated Name' };
            const mockError = new Error('Update failed');
            (apiClient.patch as any).mockRejectedValue(mockError);

            await expect(authApi.updateProfile(updateData)).rejects.toThrow('Update failed');
            expect(apiClient.patch).toHaveBeenCalledWith('/api/auth/profile', updateData);
        });
    });

    describe('resetPassword', () => {
        it('should send password reset email', async () => {
            const email = 'test@example.com';
            (apiClient.post as any).mockResolvedValue({ success: true });

            await authApi.resetPassword(email);

            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/reset-password', { email });
        });

        it('should handle password reset errors', async () => {
            const email = 'nonexistent@example.com';
            const mockError = new Error('Email not found');
            (apiClient.post as any).mockRejectedValue(mockError);

            await expect(authApi.resetPassword(email)).rejects.toThrow('Email not found');
            expect(apiClient.post).toHaveBeenCalledWith('/api/auth/reset-password', { email });
        });

        it('should handle invalid email format', async () => {
            const email = 'invalid-email';
            const mockError = new Error('Invalid email format');
            (apiClient.post as any).mockRejectedValue(mockError);

            await expect(authApi.resetPassword(email)).rejects.toThrow('Invalid email format');
        });
    });
});
