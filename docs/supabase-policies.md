# Supabase RLS Policies

- Goal: each user can only access their own rows.
- Tables: users, habits, routines, tasks, journal_entries, health_metrics, transactions, projects, swot_entries, rewards, ai_logs, calendar_tokens.
- Policy example (tasks):
  - SELECT: `auth.uid() = user_id`
  - INSERT: `auth.uid() = user_id`
  - UPDATE: `auth.uid() = user_id`
  - DELETE: `auth.uid() = user_id`
- Ensure `row level security` is enabled on all tables.
- Use service role key only in backend for privileged operations.
