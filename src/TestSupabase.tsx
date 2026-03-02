import React, { useEffect } from 'react';
import { supabase } from './shared/lib/supabase';

export const TestSupabase = () => {
  useEffect(() => {
    console.log('Supabase initialized:', supabase);
  }, []);
  return <div>Check console for Supabase initialization</div>;
};
