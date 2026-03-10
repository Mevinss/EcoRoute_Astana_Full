-- ════════════════════════════════════════════
-- 001_create_users.sql
-- Пайдаланушылар кестесі
-- ════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100)  NOT NULL,
  email           VARCHAR(150)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,
  avatar_url      VARCHAR(500),
  eco_points      INTEGER       NOT NULL DEFAULT 0,
  eco_level       VARCHAR(50)   NOT NULL DEFAULT 'Beginner',
  -- 'Beginner' | 'Explorer' | 'Green Hero' | 'Eco Champion'
  is_verified     BOOLEAN       NOT NULL DEFAULT FALSE,
  role            VARCHAR(20)   NOT NULL DEFAULT 'user',
  -- 'user' | 'guide' | 'admin'
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Жылдам іздеу үшін индекс
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_eco_level ON users(eco_level);

-- updated_at автоматты жаңарту
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
