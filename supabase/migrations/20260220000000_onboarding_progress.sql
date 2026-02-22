-- Onboarding progress table
CREATE TABLE onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_step VARCHAR(50) DEFAULT 'welcome',
    steps_completed JSONB DEFAULT '{}',
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    skipped BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only view their own onboarding progress
CREATE POLICY "Users can view own onboarding progress" ON onboarding_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own onboarding progress" ON onboarding_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding progress" ON onboarding_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own onboarding progress" ON onboarding_progress FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE onboarding_progress TO anon, authenticated;

-- Create indexes for performance
CREATE INDEX idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX idx_onboarding_progress_completed ON onboarding_progress(completed);
CREATE INDEX idx_onboarding_progress_current_step ON onboarding_progress(current_step);

-- Add comments for documentation
COMMENT ON TABLE onboarding_progress IS 'Tracks user progress through the onboarding flow';
COMMENT ON COLUMN onboarding_progress.current_step IS 'The current onboarding step the user is on (e.g., welcome, habits, tasks, journal, finance, complete)';
COMMENT ON COLUMN onboarding_progress.steps_completed IS 'JSON object tracking which steps have been completed';
COMMENT ON COLUMN onboarding_progress.completed IS 'Whether the user has completed the onboarding flow';
COMMENT ON COLUMN onboarding_progress.skipped IS 'Whether the user chose to skip the onboarding flow';

-- Add onboarding columns to users table for quick access
ALTER TABLE users
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Add comments for users table onboarding columns
COMMENT ON COLUMN users.onboarding_completed IS 'Whether the user has completed the onboarding flow (quick access field)';
COMMENT ON COLUMN users.onboarding_skipped IS 'Whether the user chose to skip the onboarding flow (quick access field)';
COMMENT ON COLUMN users.onboarding_completed_at IS 'Timestamp when the user completed the onboarding flow';
