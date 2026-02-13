import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/database';

// Add environment variable validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// In test/CI environments, we might not have these variables set if we're mocking
const isTest = process.env.NODE_ENV === 'test' || process.env.CI === 'true';

// Mock client for tests/CI or actual client for dev/prod
export const supabase = (isTest || !supabaseUrl || !supabaseKey)
  ? {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        admin: {
          updateUserById: () => Promise.resolve({ data: null, error: null }),
          deleteUser: () => Promise.resolve({ data: null, error: null }),
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({
              data: {
                id: 'test-user-id',
                email: 'test@example.com',
                name: 'Test User',
                preferences: {},
                theme: 'dark'
              },
              error: null
            }),
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createClient<Database>>
  : createClient<Database>(supabaseUrl, supabaseKey);
