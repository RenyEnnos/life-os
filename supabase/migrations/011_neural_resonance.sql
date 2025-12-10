-- Migration: Add Neural Resonance Tables
-- Creates journal_insights table for AI-generated mood analysis
-- Adds mood_score and last_analyzed_at to journal_entries

-- 1. Create journal_insights table
CREATE TABLE IF NOT EXISTS journal_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('mood', 'theme', 'energy', 'weekly')),
    content JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_journal_insights_user_id ON journal_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_insights_entry_id ON journal_insights(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_insights_type ON journal_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_journal_insights_created ON journal_insights(created_at DESC);

-- 3. Add new columns to journal_entries
ALTER TABLE journal_entries 
    ADD COLUMN IF NOT EXISTS mood_score INTEGER CHECK (mood_score >= 0 AND mood_score <= 10),
    ADD COLUMN IF NOT EXISTS last_analyzed_at TIMESTAMPTZ;

-- 4. Enable RLS on journal_insights
ALTER TABLE journal_insights ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for journal_insights
CREATE POLICY "Users can view their own insights"
    ON journal_insights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights"
    ON journal_insights FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
    ON journal_insights FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Grant permissions
GRANT SELECT, INSERT, DELETE ON journal_insights TO authenticated;
