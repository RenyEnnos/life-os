-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE swot_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_tokens ENABLE ROW LEVEL SECURITY;

-- Generic policy templates for authenticated users (match by user_id)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['habits','routines','tasks','journal_entries','health_metrics','transactions','projects','rewards','ai_logs','calendar_tokens']) LOOP
    EXECUTE format('CREATE POLICY %I_select ON %I FOR SELECT USING (auth.uid() = user_id);', t||'_user_select', t);
    EXECUTE format('CREATE POLICY %I_insert ON %I FOR INSERT WITH CHECK (auth.uid() = user_id);', t||'_user_insert', t);
    EXECUTE format('CREATE POLICY %I_update ON %I FOR UPDATE USING (auth.uid() = user_id);', t||'_user_update', t);
    EXECUTE format('CREATE POLICY %I_delete ON %I FOR DELETE USING (auth.uid() = user_id);', t||'_user_delete', t);
  END LOOP;
END $$;

-- Users table: allow self read/update, block others
CREATE POLICY users_self_select ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_self_update ON users FOR UPDATE USING (auth.uid() = id);
-- Inserts to users typically via auth; no direct inserts allowed

-- SWOT entries belong to projects; restrict by project owner via subselect
DROP POLICY IF EXISTS swot_entries_user_select ON swot_entries;
CREATE POLICY swot_entries_user_select ON swot_entries FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM projects WHERE projects.id = swot_entries.project_id)
);
DROP POLICY IF EXISTS swot_entries_user_insert ON swot_entries;
CREATE POLICY swot_entries_user_insert ON swot_entries FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM projects WHERE projects.id = swot_entries.project_id)
);
DROP POLICY IF EXISTS swot_entries_user_update ON swot_entries;
CREATE POLICY swot_entries_user_update ON swot_entries FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM projects WHERE projects.id = swot_entries.project_id)
);
DROP POLICY IF EXISTS swot_entries_user_delete ON swot_entries;
CREATE POLICY swot_entries_user_delete ON swot_entries FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM projects WHERE projects.id = swot_entries.project_id)
);

-- Default: anon role can read nothing
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- Note: service_role bypasses RLS by design
