// backend/src/routes/navigate.routes.ts
// Маршрут жоспарлаушы: жаяу жүру немесе велосипед (OSRM арқылы)
import { Router } from 'express';

const router = Router();

// OSRM OpenStreetMap public instances (no API key required)
const OSRM_FOOT_BASE = 'https://routing.openstreetmap.de/routed-foot/route/v1/foot';
const OSRM_BIKE_BASE = 'https://routing.openstreetmap.de/routed-bike/route/v1/bike';

/**
 * GET /api/navigate
 * Query: from_lat, from_lng, to_lat, to_lng, mode (walking|cycling)
 * Returns: { geojson, distance_m, duration_s, mode }
 */
router.get('/', async (req, res) => {
  try {
    const { from_lat, from_lng, to_lat, to_lng, mode = 'walking' } = req.query;

    if (!from_lat || !from_lng || !to_lat || !to_lng) {
      return res.status(400).json({
        error: 'from_lat, from_lng, to_lat, to_lng параметрлері міндетті',
      });
    }

    const fLat = parseFloat(from_lat as string);
    const fLng = parseFloat(from_lng as string);
    const tLat = parseFloat(to_lat as string);
    const tLng = parseFloat(to_lng as string);

    if ([fLat, fLng, tLat, tLng].some(isNaN)) {
      return res.status(400).json({ error: 'Жарамсыз координаттар' });
    }

    const isCycling = mode === 'cycling';
    const baseUrl = isCycling ? OSRM_BIKE_BASE : OSRM_FOOT_BASE;
    const coords = `${fLng},${fLat};${tLng},${tLat}`;
    const url = `${baseUrl}/${coords}?overview=full&geometries=geojson`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'EcoRoute-Astana/1.0' },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Маршрут қызметі қол жетімді емес' });
    }

    const data = (await response.json()) as any;

    if (data.code !== 'Ok' || !data.routes?.length) {
      return res.status(404).json({ error: 'Маршрут табылмады' });
    }

    const route = data.routes[0];

    res.json({
      geojson: route.geometry,
      distance_m: Math.round(route.distance),
      duration_s: Math.round(route.duration),
      mode,
    });
  } catch (err: any) {
    console.error('Navigate қатесі:', err);
    if (err?.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Маршрут қызметі уақыт шегінен асты' });
    }
    res.status(500).json({ error: 'Маршрут анықтау кезінде қате орын алды' });
  }
});

export default router;
