CREATE TABLE IF NOT EXISTS ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  function_name VARCHAR(100) NOT NULL,
  input_hash VARCHAR(64) NOT NULL,
  output JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, function_name, input_hash)
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_user_fn ON ai_cache(user_id, function_name);
