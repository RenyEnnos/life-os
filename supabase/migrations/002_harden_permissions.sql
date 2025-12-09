-- Revoke excessive permissions granted to anon in 001_create_tables.sql
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Grant minimal usage
GRANT USAGE ON SCHEMA public TO anon;

-- Anonymous users typically don't need table access if all logic is via API (backend) or blocked by RLS.
-- If some public read is needed (e.g. public profiles), specific GRANT SELECT should be added here.
-- For now, we assume strict lock down.
