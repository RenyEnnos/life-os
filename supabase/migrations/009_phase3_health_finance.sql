-- Medication Reminders table
CREATE TABLE medication_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    schedule JSONB DEFAULT '[]', -- Array of times e.g. ["08:00", "20:00"]
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for medication_reminders
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medication_reminders
CREATE POLICY "Users can view own medication reminders" ON medication_reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own medication reminders" ON medication_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medication reminders" ON medication_reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medication reminders" ON medication_reminders FOR DELETE USING (auth.uid() = user_id);

-- Add metadata to health_metrics
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add category and project_id to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Create indexes for new columns
CREATE INDEX idx_medication_reminders_user_id ON medication_reminders(user_id);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
