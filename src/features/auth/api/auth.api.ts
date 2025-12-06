import { supabase } from '@/shared/api/supabase';
import { LoginRequest, RegisterRequest } from '@/shared/types';

export const authApi = {
    login: async ({ email, password }: LoginRequest) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    register: async ({ email, password, name }: RegisterRequest) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });
        if (error) throw error;
        return data;
    },

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    }
};
