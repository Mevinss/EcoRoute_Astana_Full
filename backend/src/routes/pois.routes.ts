// backend/src/routes/pois.routes.ts
import { Router } from 'express';
import { db } from '../db/client';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, eco_only } = req.query;
    let query = 'SELECT * FROM pois WHERE is_active=TRUE';
    const params: any[] = [];

    if (category) { params.push(category); query += ` AND category=$${params.length}`; }
    if (eco_only === 'true') { query += ' AND eco_certified=TRUE'; }
    query += ' ORDER BY eco_bonus_pts DESC';

    const result = await db.query(query, params);
    res.json({ pois: result.rows, total: result.rowCount });
  } catch {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 2000 } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat және lng керек.' });

  try {
    const result = await db.query(
      `SELECT *, ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($2,$1),4326)::geography) as distance_m
       FROM pois
       WHERE is_active=TRUE
         AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($2,$1),4326)::geography, $3)
       ORDER BY distance_m LIMIT 20`,
      [lat, lng, radius]
    );
    res.json({ pois: result.rows });
  } catch {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

export default router;
