CREATE TABLE IF NOT EXISTS calendar_tokens (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  scope TEXT,
  token_type TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE
);
