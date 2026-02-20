-- Performance optimization indexes
-- Comprehensive indexes for common query patterns to improve performance
-- as users accumulate large amounts of data

-- Habits table: composite indexes for user-scoped queries
CREATE INDEX IF NOT EXISTS idx_habits_user_id_active ON habits(user_id, active)
  WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_habits_user_id_created_at ON habits(user_id, created_at DESC);

-- Habit logs: composite index for date-range queries (most common pattern)
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id_logged_date
  ON habit_logs(user_id, logged_date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id_logged_date
  ON habit_logs(habit_id, logged_date DESC);

-- Tasks: composite indexes for filtering and sorting active tasks
CREATE INDEX IF NOT EXISTS idx_tasks_user_id_completed
  ON tasks(user_id, completed)
  WHERE completed = false;
CREATE INDEX IF NOT EXISTS idx_tasks_user_id_completed_due_date
  ON tasks(user_id, completed, due_date)
  WHERE completed = false;
CREATE INDEX IF NOT EXISTS idx_tasks_project_id_completed
  ON tasks(project_id, completed)
  WHERE completed = false;

-- Partial index for incomplete tasks (optimized for dashboard/tasks list)
CREATE INDEX IF NOT EXISTS idx_tasks_incomplete
  ON tasks(user_id, due_date)
  WHERE completed = false;

-- Journal entries: composite index for date-based queries with pagination
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id_entry_date
  ON journal_entries(user_id, entry_date DESC);

-- Transactions: composite indexes for filtering by type and date
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_date
  ON transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_type_date
  ON transactions(user_id, type, transaction_date DESC);

-- Health metrics: time-series data queries
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_type_date
  ON health_metrics(user_id, metric_type, recorded_date DESC);

-- AI logs: for monitoring and analytics
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_function_created
  ON ai_logs(user_id, function_name, created_at DESC);

-- Rewards: user rewards with achievement status
CREATE INDEX IF NOT EXISTS idx_rewards_user_achieved
  ON rewards(user_id, achieved)
  WHERE achieved = false;

-- Projects: active projects for a user
CREATE INDEX IF NOT EXISTS idx_projects_user_id_active
  ON projects(user_id, active)
  WHERE active = true;

-- Task-habit links: for symbiosis feature queries
CREATE INDEX IF NOT EXISTS idx_task_habit_links_user_deleted
  ON task_habit_links(user_id)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_task_habit_links_composite
  ON task_habit_links(task_id, habit_id)
  WHERE deleted_at IS NULL;
