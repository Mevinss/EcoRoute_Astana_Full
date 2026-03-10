-- ════════════════════════════════════════════
-- 003_create_pois.sql
-- Points of Interest — Eco нүктелер
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pois (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(200)  NOT NULL,
  name_kz         VARCHAR(200),
  category        VARCHAR(50)   NOT NULL,
  -- 'park' | 'cafe' | 'bike_park' | 'water' | 'landmark' | 'museum' | 'viewpoint'
  description     TEXT,
  
  -- Координаттар
  lat             DECIMAL(9, 6) NOT NULL,
  lng             DECIMAL(9, 6) NOT NULL,
  location        GEOMETRY(POINT, 4326)
                  GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lng, lat), 4326)) STORED,
  address         VARCHAR(300),
  
  -- Eco сертификация
  eco_certified   BOOLEAN       NOT NULL DEFAULT FALSE,
  eco_bonus_pts   INTEGER       NOT NULL DEFAULT 50,
  
  -- Жұмыс уақыты
  working_hours   VARCHAR(100),
  -- мысалы: '09:00-21:00'
  is_open_24h     BOOLEAN       NOT NULL DEFAULT FALSE,
  
  -- Байланыс
  website_url     VARCHAR(300),
  phone           VARCHAR(30),
  
  -- Медиа
  image_url       VARCHAR(500),
  icon            VARCHAR(10),
  -- emoji: '🌳' '☕' '🚴' '💧' '🏛️'
  
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pois_category ON pois(category);
CREATE INDEX idx_pois_eco ON pois(eco_certified);
CREATE INDEX idx_pois_location ON pois USING GIST(location);
