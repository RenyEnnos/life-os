import { apiClient } from '@/shared/api/http';
import { LoginRequest, RegisterRequest } from '@/shared/types';
import { User } from '@supabase/supabase-js';

// Define the response types from our API
interface AuthResponse {
    token?: string; // Optional now as it's in cookie
    user: User; // Reusing Supabase User type for compatibility or define custom
}

export const authApi = {
    login: async (credentials: LoginRequest) => {
        const data = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
        return data; // contains user
    },

    register: async (credentials: RegisterRequest) => {
        const data = await apiClient.post<AuthResponse>('/api/auth/register', credentials);
        return data;
    },

    logout: async () => {
        await apiClient.post('/api/auth/logout', {});
    },

    verify: async () => {
        // New method to verify session via cookie
        return await apiClient.get<User>('/api/auth/verify');
    },

    updateProfile: async (data: { name?: string; avatar_url?: string }) => {
        // Optimistically return the user structure if backend doesn't exist yet for demo purposes
        // But ideally:
        return await apiClient.patch<AuthResponse>('/api/auth/profile', data);
    },

    // Deprecated methods that might still be called? 
    // Ideally we remove them, but checking usage elsewhere might be needed.
    // For now, removing them to enforce new flow.
    // If something breaks, we fix the caller.
};
