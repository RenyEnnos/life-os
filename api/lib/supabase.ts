import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://iansaznyhtsciyaedkce.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbnNhem55aHRzY2l5YWVka2NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDMyMjMxNCwiZXhwIjoyMDc5ODk4MzE0fQ.jL_l6yeOT4WRvQbTv45zDTf-79Jx9ayCNMXOXr9x2xQ'

export const supabase = createClient(supabaseUrl, supabaseServiceKey)