-- ════════════════════════════════════════════
-- 005_create_eco_events.sql
-- Eco-bonus оқиғалар кестесі
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eco_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id      UUID          REFERENCES bookings(id) ON DELETE SET NULL,
  
  event_type      VARCHAR(50)   NOT NULL,
  -- 'photo_upload' | 'route_complete' | 'discount_used' | 'referral' | 'streak_bonus'
  
  -- Фото (Cloudinary)
  photo_url       VARCHAR(500),
  photo_public_id VARCHAR(200),
  
  -- Балл
  pts_awarded     INTEGER       NOT NULL DEFAULT 0,
  
  -- Admin тексеруі
  verified        BOOLEAN       NOT NULL DEFAULT FALSE,
  verified_by     UUID          REFERENCES users(id),
  verified_at     TIMESTAMPTZ,
  
  -- CO₂ үнемдеу (eco_event ішінде)
  co2_saved_g     INTEGER       NOT NULL DEFAULT 0,
  
  description     TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eco_events_user ON eco_events(user_id);
CREATE INDEX idx_eco_events_type ON eco_events(event_type);
CREATE INDEX idx_eco_events_verified ON eco_events(verified);
