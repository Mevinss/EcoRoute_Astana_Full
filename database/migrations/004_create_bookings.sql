-- ════════════════════════════════════════════
-- 004_create_bookings.sql
-- Брондаулар кестесі
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  route_id        UUID          NOT NULL REFERENCES eco_routes(id) ON DELETE RESTRICT,
  
  -- Бронь детайлы
  booking_date    DATE          NOT NULL,
  participants    INTEGER       NOT NULL DEFAULT 1 CHECK (participants >= 1 AND participants <= 20),
  with_guide      BOOLEAN       NOT NULL DEFAULT FALSE,
  
  -- Баға
  price_per_person INTEGER      NOT NULL DEFAULT 0,
  total_price     INTEGER       NOT NULL DEFAULT 0,
  -- тенге
  
  -- Статус
  status          VARCHAR(20)   NOT NULL DEFAULT 'pending',
  -- 'pending' | 'confirmed' | 'cancelled' | 'completed'
  
  -- Төлем
  payment_method  VARCHAR(30),
  -- 'kaspi' | 'card' | 'cash'
  payment_status  VARCHAR(20)   NOT NULL DEFAULT 'unpaid',
  -- 'unpaid' | 'paid' | 'refunded'
  payment_ref     VARCHAR(100),
  -- Stripe/Kaspi payment intent id
  
  -- Eco bonus
  eco_pts_earned  INTEGER       NOT NULL DEFAULT 0,
  pts_awarded     BOOLEAN       NOT NULL DEFAULT FALSE,
  
  -- Ескертпе
  notes           TEXT,
  
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_route ON bookings(route_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
