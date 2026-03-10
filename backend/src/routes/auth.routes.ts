// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db/client';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ── Validation Schemas ──
const RegisterSchema = z.object({
  name:     z.string().min(2, 'Аты кемінде 2 таңба').max(100),
  email:    z.string().email('Email дұрыс емес'),
  password: z.string().min(8, 'Пароль кемінде 8 таңба'),
});

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

function generateTokens(user: { id: string; email: string; role: string }) {
  const accessExpiresIn = (process.env.JWT_EXPIRES_IN ?? '15m') as jwt.SignOptions['expiresIn'];
  const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'];

  const access = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: accessExpiresIn }
  );
  const refresh = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: refreshExpiresIn }
  );
  return { access, refresh };
}

// ── POST /api/auth/register ──
router.post('/register', async (req, res) => {
  try {
    const body = RegisterSchema.parse(req.body);

    // Email тексеру
    const existing = await db.query('SELECT id FROM users WHERE email=$1', [body.email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Бұл email тіркелген.' });
    }

    const hash = await bcrypt.hash(body.password, 12);
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1,$2,$3)
       RETURNING id, name, email, eco_points, eco_level, role, created_at`,
      [body.name, body.email, hash]
    );

    const user = result.rows[0];
    const tokens = generateTokens(user);

    res.status(201).json({
      message: 'Тіркелу сәтті!',
      user: { id: user.id, name: user.name, email: user.email, eco_points: user.eco_points, eco_level: user.eco_level },
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation қатесі', details: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  try {
    const body = LoginSchema.parse(req.body);

    const result = await db.query(
      'SELECT id, name, email, password_hash, eco_points, eco_level, role FROM users WHERE email=$1',
      [body.email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email немесе пароль дұрыс емес.' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(body.password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Email немесе пароль дұрыс емес.' });
    }

    const tokens = generateTokens(user);

    res.json({
      message: 'Кіру сәтті!',
      user: { id: user.id, name: user.name, email: user.email, eco_points: user.eco_points, eco_level: user.eco_level, role: user.role },
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation қатесі', details: err.errors });
    }
    res.status(500).json({ error: 'Server қатесі' });
  }
});

// ── POST /api/auth/refresh ──
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token жоқ.' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const result = await db.query(
      'SELECT id, email, role FROM users WHERE id=$1',
      [payload.id]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Пайдаланушы табылмады.' });

    const tokens = generateTokens(result.rows[0]);
    res.json({ accessToken: tokens.access, refreshToken: tokens.refresh });
  } catch {
    res.status(401).json({ error: 'Refresh token жарамсыз.' });
  }
});

// ── POST /api/auth/logout ──
router.post('/logout', requireAuth, (req: AuthRequest, res) => {
  // Клиентте token жою + Redis blacklist (production-да)
  res.json({ message: 'Шығу сәтті.' });
});

// ── GET /api/auth/me ──
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const result = await db.query(
    'SELECT id, name, email, eco_points, eco_level, role, avatar_url, created_at FROM users WHERE id=$1',
    [req.user!.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Табылмады.' });
  res.json({ user: result.rows[0] });
});

export default router;
