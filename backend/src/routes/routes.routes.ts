// backend/src/routes/routes.routes.ts
import { Router } from 'express';
import { db } from '../db/client';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// ── GET /api/routes ──
// Барлық eco маршруттар. Query: ?type=walking&difficulty=easy&free=true
router.get('/', async (req, res) => {
  try {
    const { type, difficulty, free } = req.query;
    let query = 'SELECT * FROM eco_routes WHERE is_active=TRUE';
    const params: any[] = [];

    if (type) { params.push(type); query += ` AND type=$${params.length}`; }
    if (difficulty) { params.push(difficulty); query += ` AND difficulty=$${params.length}`; }
    if (free === 'true') { query += ' AND is_free=TRUE'; }

    query += ' ORDER BY eco_bonus_pts DESC';

    const result = await db.query(query, params);
    res.json({ routes: result.rows, total: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── GET /api/routes/:id ──
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const routeRes = await db.query('SELECT * FROM eco_routes WHERE id=$1 AND is_active=TRUE', [id]);
    if (routeRes.rows.length === 0) return res.status(404).json({ error: 'Маршрут табылмады.' });

    // Маршруттағы POI нүктелерін іздеу (PostGIS 2km радиус)
    const route = routeRes.rows[0];
    const startLng = route.geojson?.coordinates?.[0]?.[0];
    const startLat = route.geojson?.coordinates?.[0]?.[1];

    let nearbyPois: any[] = [];
    if (startLat && startLng) {
      const poisRes = await db.query(
        `SELECT *, ST_Distance(
           location::geography,
           ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
         ) as distance_m
         FROM pois
         WHERE is_active=TRUE
           AND ST_DWithin(
             location::geography,
             ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,
             2000
           )
         ORDER BY distance_m LIMIT 10`,
        [startLng, startLat]
      );
      nearbyPois = poisRes.rows;
    }

    res.json({ route: routeRes.rows[0], nearby_pois: nearbyPois });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── GET /api/routes/stats/summary ──
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT
        COUNT(*) as total_routes,
        SUM(CASE WHEN type='walking' THEN 1 ELSE 0 END) as walking,
        SUM(CASE WHEN type='cycling' THEN 1 ELSE 0 END) as cycling,
        SUM(CASE WHEN type='mixed'   THEN 1 ELSE 0 END) as mixed,
        SUM(CASE WHEN is_free THEN 1 ELSE 0 END) as free_routes,
        ROUND(AVG(distance_km)::numeric, 1) as avg_distance_km,
        SUM(co2_saved_g) as total_co2_saved_g
      FROM eco_routes WHERE is_active=TRUE
    `);
    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

export default router;
