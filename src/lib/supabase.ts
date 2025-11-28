import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iansaznyhtsciyaedkce.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbnNhem55aHRzY2l5YWVka2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjIzMTQsImV4cCI6MjA3OTg5ODMxNH0.BXiW8bwF1thFpWEqE-Qe8JEqD5xuUyNX1uCDvODuXTs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)