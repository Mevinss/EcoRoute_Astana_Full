-- ════════════════════════════════════════════
-- 002_create_eco_routes.sql
-- Eco маршруттар кестесі (PostGIS geometry)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eco_routes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_kz         VARCHAR(200)  NOT NULL,
  name_ru         VARCHAR(200)  NOT NULL,
  name_en         VARCHAR(200),
  description_kz  TEXT,
  description_ru  TEXT,
  
  -- Маршрут параметрлері
  distance_km     DECIMAL(6,2)  NOT NULL,
  duration_min    INTEGER       NOT NULL,
  difficulty      VARCHAR(20)   NOT NULL DEFAULT 'easy',
  -- 'easy' | 'medium' | 'hard'
  type            VARCHAR(20)   NOT NULL DEFAULT 'walking',
  -- 'walking' | 'cycling' | 'mixed'
  
  -- Eco метрика
  co2_saved_g     INTEGER       NOT NULL DEFAULT 0,
  -- формула: distance_km * 170 (автомобиль г/км)
  eco_bonus_pts   INTEGER       NOT NULL DEFAULT 100,
  air_quality_idx INTEGER,
  -- 0-50 жақсы, 51-100 орташа, 100+ нашар
  
  -- Бағалар
  price_tenge     INTEGER       NOT NULL DEFAULT 0,
  is_free         BOOLEAN       NOT NULL DEFAULT TRUE,
  
  -- Маршрут геодеректері (PostGIS)
  geojson         JSONB,
  -- LineString: {"type":"LineString","coordinates":[[lng,lat],...]}
  start_point     GEOMETRY(POINT, 4326),
  end_point       GEOMETRY(POINT, 4326),
  
  -- Медиа
  cover_image_url VARCHAR(500),
  
  -- Метадеректер
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  total_bookings  INTEGER       NOT NULL DEFAULT 0,
  avg_rating      DECIMAL(3,2)  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routes_type ON eco_routes(type);
CREATE INDEX idx_routes_difficulty ON eco_routes(difficulty);
CREATE INDEX idx_routes_active ON eco_routes(is_active);
-- PostGIS spatial индекс
CREATE INDEX idx_routes_start_point ON eco_routes USING GIST(start_point);

CREATE TRIGGER eco_routes_updated_at
  BEFORE UPDATE ON eco_routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
