// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './db/client';
import authRouter from './routes/auth.routes';
import routesRouter from './routes/routes.routes';
import poisRouter from './routes/pois.routes';
import bookingsRouter from './routes/bookings.routes';
import ecoRouter from './routes/eco.routes';
import navigateRouter from './routes/navigate.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──
// CSP configured for the JSON API server.
// Note: crossOriginEmbedderPolicy is disabled to allow MapLibre GL
// web workers (which use blob: URLs) to function correctly when the
// frontend fetches resources through this backend proxy.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", 'https://basemaps.cartocdn.com',
                   'https://routing.openstreetmap.de'],
      fontSrc: ["'self'", 'https:', 'data:'],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ["'self'", 'blob:'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──
app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'EcoRoute API', version: '1.0.0' });
});

// ── API Routes ──
app.use('/api/auth',     authRouter);
app.use('/api/routes',   routesRouter);
app.use('/api/pois',     poisRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/eco',      ecoRouter);
app.use('/api/navigate', navigateRouter);

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({ error: `Route не табылды: ${req.method} ${req.path}` });
});

// ── Error Handler ──
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message,
  });
});

// ── Start ──
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`\n🌿 EcoRoute API іске қосылды`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Env: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start().catch(console.error);
