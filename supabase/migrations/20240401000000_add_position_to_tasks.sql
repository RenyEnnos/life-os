-- Add position column to tasks table for manual reordering
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position TEXT;

-- Initialize existing records with a position based on their creation date
-- Using a simple representation for existing records to ensure they have a sort order.
-- We can use a window function to generate initial positions.
WITH ordered_tasks AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM tasks
)
UPDATE tasks
SET position = LPAD(ordered_tasks.row_num::TEXT, 10, '0')
FROM ordered_tasks
WHERE tasks.id = ordered_tasks.id AND tasks.position IS NULL;
