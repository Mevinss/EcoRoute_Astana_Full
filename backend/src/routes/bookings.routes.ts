// backend/src/routes/bookings.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/client';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const BookingSchema = z.object({
  route_id:       z.string().uuid('route_id UUID болу керек'),
  booking_date:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата YYYY-MM-DD форматында'),
  participants:   z.number().int().min(1).max(20),
  with_guide:     z.boolean().optional().default(false),
  payment_method: z.enum(['kaspi','card','cash']).optional(),
  notes:          z.string().max(500).optional(),
});

// ── GET /api/bookings — Менің брондарым ──
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await db.query(
      `SELECT b.*, r.name_kz, r.name_ru, r.distance_km, r.duration_min, r.type, r.cover_image_url
       FROM bookings b
       JOIN eco_routes r ON b.route_id = r.id
       WHERE b.user_id=$1
       ORDER BY b.created_at DESC`,
      [req.user!.id]
    );
    res.json({ bookings: result.rows });
  } catch {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── POST /api/bookings — Жаңа бронь ──
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = BookingSchema.parse(req.body);

    // Маршрут тексеру
    const routeRes = await db.query('SELECT * FROM eco_routes WHERE id=$1 AND is_active=TRUE', [body.route_id]);
    if (routeRes.rows.length === 0) return res.status(404).json({ error: 'Маршрут табылмады.' });

    const route = routeRes.rows[0];
    const pricePerPerson = route.price_tenge;
    const guideExtra = body.with_guide ? 5000 : 0;
    const totalPrice = (pricePerPerson + guideExtra) * body.participants;
    const ecoBonus = route.eco_bonus_pts;

    const result = await db.query(
      `INSERT INTO bookings
         (user_id, route_id, booking_date, participants, with_guide,
          price_per_person, total_price, status, payment_method, eco_pts_earned)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9)
       RETURNING *`,
      [
        req.user!.id, body.route_id, body.booking_date,
        body.participants, body.with_guide ?? false,
        pricePerPerson, totalPrice,
        body.payment_method ?? null, ecoBonus,
      ]
    );

    // Eco points update (confirmed болғанда беріледі)
    res.status(201).json({
      message: 'Бронь жасалды!',
      booking: result.rows[0],
      payment_needed: totalPrice > 0,
      eco_bonus_to_earn: ecoBonus,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation', details: err.errors });
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── PATCH /api/bookings/:id/cancel ──
router.patch('/:id/cancel', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await db.query(
      `UPDATE bookings SET status='cancelled', updated_at=NOW()
       WHERE id=$1 AND user_id=$2 AND status IN ('pending','confirmed')
       RETURNING *`,
      [req.params.id, req.user!.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Бронь табылмады немесе болдырылмайды.' });
    res.json({ message: 'Бронь болдырылмады.', booking: result.rows[0] });
  } catch {
    res.status(500).json({ error: 'Server қатесі' });
  }
});

export default router;
