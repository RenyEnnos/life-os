-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL, -- e.g. 'habit_streak_30'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, key)
);

-- Life Score Snapshots table
CREATE TABLE life_score_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    breakdown JSONB DEFAULT '{}', -- Details of how the score was calculated
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_score_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Achievements
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own achievements" ON achievements FOR DELETE USING (auth.uid() = user_id);

-- Life Score Snapshots
CREATE POLICY "Users can view own life score snapshots" ON life_score_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own life score snapshots" ON life_score_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own life score snapshots" ON life_score_snapshots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own life score snapshots" ON life_score_snapshots FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_life_score_snapshots_user_id ON life_score_snapshots(user_id);
CREATE INDEX idx_life_score_snapshots_recorded_date ON life_score_snapshots(recorded_date);
