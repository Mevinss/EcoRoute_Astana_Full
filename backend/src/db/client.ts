// backend/src/db/client.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'ecoroute_db',
  user:     process.env.DB_USER     || 'ecoroute',
  password: process.env.DB_PASSWORD || 'ecoroute_secret_2025',
  max: 10, // connection pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

db.on('error', (err) => {
  console.error('❌ PostgreSQL қате:', err);
});

export async function testConnection(): Promise<void> {
  const client = await db.connect();
  const res = await client.query('SELECT NOW() as now');
  console.log('✅ PostgreSQL байланыс:', res.rows[0].now);
  client.release();
}
