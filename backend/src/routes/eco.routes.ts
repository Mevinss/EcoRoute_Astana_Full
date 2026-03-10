// backend/src/routes/eco.routes.ts
import { Router } from 'express';
import { db } from '../db/client';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ── GET /api/eco/profile ──
router.get('/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userRes = await db.query(
      'SELECT id, name, email, eco_points, eco_level, avatar_url FROM users WHERE id=$1',
      [req.user!.id]
    );
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Пайдаланушы табылмады.' });

    const eventsRes = await db.query(
      `SELECT event_type, pts_awarded, co2_saved_g, created_at
       FROM eco_events WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10`,
      [req.user!.id]
    );

    const statsRes = await db.query(
      `SELECT
         COUNT(*) as total_bookings,
         SUM(eco_pts_earned) as total_pts,
         COALESCE(SUM(r.co2_saved_g),0) as total_co2_saved_g
       FROM bookings b
       JOIN eco_routes r ON b.route_id=r.id
       WHERE b.user_id=$1 AND b.status='completed'`,
      [req.user!.id]
    );

    res.json({
      user: userRes.rows[0],
      stats: statsRes.rows[0],
      recent_events: eventsRes.rows,
      next_level_pts: getNextLevelPts(userRes.rows[0].eco_points),
    });
  } catch {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── GET /api/eco/leaderboard ──
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, eco_points, eco_level, avatar_url
       FROM users ORDER BY eco_points DESC LIMIT 10`
    );
    res.json({ leaderboard: result.rows });
  } catch {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── GET /api/eco/air-quality ──
router.get('/air-quality', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT ON (station_name) station_name, lat, lng, pm25, pm10, aqi, aqi_category, measured_at
       FROM air_quality_logs
       ORDER BY station_name, measured_at DESC`
    );
    res.json({ stations: result.rows });
  } catch {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

function getNextLevelPts(current: number): number {
  if (current < 500)  return 500  - current;
  if (current < 1500) return 1500 - current;
  if (current < 3000) return 3000 - current;
  return 0; // Eco Champion — максимал деңгей
}

export default router;
