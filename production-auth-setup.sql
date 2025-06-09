-- Create auth_config table for production deployment
CREATE TYPE auth_type AS ENUM ('local', 'oidc', 'hybrid');

CREATE TABLE IF NOT EXISTS auth_config (
  id SERIAL PRIMARY KEY,
  auth_type auth_type NOT NULL DEFAULT 'local',
  oidc_enabled BOOLEAN NOT NULL DEFAULT false,
  oidc_issuer TEXT,
  oidc_client_id TEXT,
  oidc_client_secret TEXT,
  oidc_callback_url TEXT,
  oidc_scopes JSON DEFAULT '["openid", "profile", "email"]',
  session_timeout INTEGER NOT NULL DEFAULT 3600,
  max_login_attempts INTEGER NOT NULL DEFAULT 5,
  lockout_duration INTEGER NOT NULL DEFAULT 300,
  password_min_length INTEGER NOT NULL DEFAULT 8,
  require_password_change BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO auth_config (
  auth_type,
  oidc_enabled,
  oidc_scopes,
  session_timeout,
  max_login_attempts,
  lockout_duration,
  password_min_length,
  require_password_change
) VALUES (
  'local',
  false,
  '["openid", "profile", "email"]',
  3600,
  5,
  300,
  8,
  false
) ON CONFLICT DO NOTHING;

-- Create vulnerability_assets table if missing
CREATE TABLE IF NOT EXISTS vulnerability_assets (
  id SERIAL PRIMARY KEY,
  vulnerability_id INTEGER NOT NULL,
  asset_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  UNIQUE(vulnerability_id, asset_id)
);