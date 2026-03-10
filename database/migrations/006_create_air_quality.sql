-- ════════════════════════════════════════════
-- 006_create_air_quality.sql
-- Ауа сапасы деректер кестесі (OpenAQ)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS air_quality_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_name    VARCHAR(100)  NOT NULL,
  
  -- Координаттар
  lat             DECIMAL(9, 6) NOT NULL,
  lng             DECIMAL(9, 6) NOT NULL,
  location        GEOMETRY(POINT, 4326)
                  GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lng, lat), 4326)) STORED,
  
  -- Ауа сапасы индекстері
  pm25            DECIMAL(6, 2),   -- µg/m³
  pm10            DECIMAL(6, 2),   -- µg/m³
  no2             DECIMAL(6, 2),   -- µg/m³
  co              DECIMAL(6, 2),   -- mg/m³
  aqi             INTEGER,
  -- 0-50: Жақсы 🌿 | 51-100: Орташа ⚠️ | 101+: Нашар 🚨
  
  aqi_category    VARCHAR(20)
                  GENERATED ALWAYS AS (
                    CASE
                      WHEN aqi <= 50  THEN 'good'
                      WHEN aqi <= 100 THEN 'moderate'
                      ELSE                 'poor'
                    END
                  ) STORED,
  
  -- Деректер көзі
  source          VARCHAR(50)   NOT NULL DEFAULT 'openaq',
  measured_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_air_station ON air_quality_logs(station_name);
CREATE INDEX idx_air_measured ON air_quality_logs(measured_at DESC);
CREATE INDEX idx_air_aqi ON air_quality_logs(aqi);
CREATE INDEX idx_air_location ON air_quality_logs USING GIST(location);

-- Ескі деректерді автоматты тазарту (90 күннен артық)
-- (Productionда pg_cron extension қосылса іске асады)
-- SELECT cron.schedule('cleanup-air-logs', '0 2 * * *',
--   $$DELETE FROM air_quality_logs WHERE measured_at < NOW() - INTERVAL '90 days'$$);
