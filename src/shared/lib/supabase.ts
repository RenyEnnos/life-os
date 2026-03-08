import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
  // For testing environment, don't throw, just mock
  if (process.env.NODE_ENV === 'test' || import.meta.env.MODE === 'test') {
    console.warn('Missing Supabase variables in test environment');
  } else {
    console.warn('Missing Supabase environment variables');
  }
}


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};
