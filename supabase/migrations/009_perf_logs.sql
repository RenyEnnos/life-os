CREATE TABLE IF NOT EXISTS perf_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  endpoint TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  status INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perf_logs_time ON perf_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_perf_logs_endpoint ON perf_logs(endpoint);
