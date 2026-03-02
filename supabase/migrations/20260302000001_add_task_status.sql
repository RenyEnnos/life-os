-- Migration: Add status to tasks table
-- Plan: 04-01

-- 1. Create task_status enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');
    END IF;
END$$;

-- 2. Add status column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status task_status DEFAULT 'todo';

-- 3. Map existing completed data to status
UPDATE tasks SET status = 'done' WHERE completed = true;
UPDATE tasks SET status = 'todo' WHERE completed = false AND status IS NULL;

-- 4. Add index for status
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Note: We keep the completed column for now for backward compatibility, 
-- but it could be deprecated or made a generated column in the future.
