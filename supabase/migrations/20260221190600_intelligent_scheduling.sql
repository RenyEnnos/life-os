-- Add scheduling fields to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_duration integer DEFAULT 30;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_start timestamp with time zone;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_end timestamp with time zone;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS google_event_id text;

-- Add indexes for scheduling queries
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_start ON tasks(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_tasks_google_event_id ON tasks(google_event_id);
