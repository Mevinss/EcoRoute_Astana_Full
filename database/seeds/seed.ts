// database/seeds/seed.ts
// npm run seed — барлық тест деректерді жүктейді
// ════════════════════════════════════════════

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { USERS } from './data/users';
import { ECO_ROUTES } from './data/routes';
import { POIS } from './data/pois';

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'ecoroute_db',
  user:     process.env.DB_USER     || 'ecoroute',
  password: process.env.DB_PASSWORD || 'ecoroute_secret_2025',
});

async function seedUsers(client: any): Promise<string[]> {
  console.log('👤 Пайдаланушыларды жүктеу...');
  const ids: string[] = [];

  for (const u of USERS) {
    const hash = await bcrypt.hash('Test1234!', 10);
    const res = await client.query(
      `INSERT INTO users (name, email, password_hash, eco_points, eco_level, role, is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,TRUE)
       RETURNING id`,
      [u.name, u.email, hash, u.eco_points, u.eco_level, u.role]
    );
    ids.push(res.rows[0].id);
  }
  console.log(`   ✅ ${ids.length} пайдаланушы қосылды`);
  return ids;
}

async function seedRoutes(client: any): Promise<string[]> {
  console.log('🗺️  Маршруттарды жүктеу...');
  const ids: string[] = [];

  for (const r of ECO_ROUTES) {
    const res = await client.query(
      `INSERT INTO eco_routes
         (name_kz, name_ru, name_en, description_kz, description_ru,
          distance_km, duration_min, difficulty, type,
          co2_saved_g, eco_bonus_pts, price_tenge, is_free,
          geojson, cover_image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING id`,
      [
        r.name_kz, r.name_ru, r.name_en ?? null,
        r.description_kz ?? null, r.description_ru ?? null,
        r.distance_km, r.duration_min, r.difficulty, r.type,
        r.co2_saved_g, r.eco_bonus_pts, r.price_tenge, r.is_free,
        JSON.stringify(r.geojson), r.cover_image_url ?? null,
      ]
    );
    ids.push(res.rows[0].id);
  }
  console.log(`   ✅ ${ids.length} маршрут қосылды`);
  return ids;
}

async function seedPois(client: any): Promise<void> {
  console.log('📍 POI нүктелерді жүктеу...');

  for (const p of POIS) {
    await client.query(
      `INSERT INTO pois
         (name, name_kz, category, lat, lng, eco_certified, eco_bonus_pts,
          icon, description, working_hours, is_open_24h, website_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        p.name, p.name_kz ?? null, p.category, p.lat, p.lng,
        p.eco_certified, p.eco_bonus_pts,
        p.icon ?? '📍', p.description ?? null,
        (p as any).working_hours ?? null,
        (p as any).is_open_24h ?? false,
        (p as any).website_url ?? null,
      ]
    );
  }
  console.log(`   ✅ ${POIS.length} POI нүктесі қосылды`);
}

async function seedBookings(client: any, userIds: string[], routeIds: string[]): Promise<string[]> {
  console.log('📅 Брондауларды жүктеу...');
  const ids: string[] = [];
  const statuses = ['confirmed','confirmed','confirmed','confirmed','pending','cancelled'];
  const payMethods = ['kaspi','card','cash'];
  const baseDate = new Date('2025-03-01');

  for (let i = 0; i < 30; i++) {
    const userId  = userIds[i % userIds.length];
    const routeId = routeIds[i % routeIds.length];
    const status  = statuses[i % statuses.length];
    const participants = (i % 5) + 1;
    const pricePerPerson = [0, 2500, 3500, 4000, 5000, 8000][i % 6];
    const totalPrice = pricePerPerson * participants;
    const bookingDate = new Date(baseDate.getTime() + i * 2 * 24 * 60 * 60 * 1000);
    const ecoBonus = status === 'confirmed' ? 50 + (i % 10) * 30 : 0;

    const res = await client.query(
      `INSERT INTO bookings
         (user_id, route_id, booking_date, participants,
          price_per_person, total_price, status,
          payment_method, payment_status, eco_pts_earned, pts_awarded)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        userId, routeId,
        bookingDate.toISOString().split('T')[0],
        participants, pricePerPerson, totalPrice,
        status,
        payMethods[i % 3],
        status === 'confirmed' ? 'paid' : 'unpaid',
        ecoBonus,
        status === 'confirmed',
      ]
    );
    ids.push(res.rows[0].id);
  }
  console.log(`   ✅ 30 бронь қосылды`);
  return ids;
}

async function seedEcoEvents(client: any, userIds: string[], bookingIds: string[]): Promise<void> {
  console.log('🌱 Eco events жүктеу...');
  const types = ['photo_upload','route_complete','discount_used','referral','streak_bonus'];

  for (let i = 0; i < 20; i++) {
    await client.query(
      `INSERT INTO eco_events
         (user_id, booking_id, event_type, pts_awarded, verified, co2_saved_g)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        userIds[i % userIds.length],
        i % 2 === 0 ? bookingIds[i % bookingIds.length] : null,
        types[i % types.length],
        [100, 150, 200, 250, 300][i % 5],
        i % 3 !== 0,
        [200, 400, 600, 800, 1000][i % 5],
      ]
    );
  }
  console.log(`   ✅ 20 eco event қосылды`);
}

async function seedAirQuality(client: any): Promise<void> {
  console.log('🌬️  Ауа сапасы деректерін жүктеу...');

  const stations = [
    { name: 'Астана-Орталық',   lat: 51.1800, lng: 71.4460 },
    { name: 'EXPO Станция',     lat: 51.0930, lng: 71.4780 },
    { name: 'Есіл Жағалауы',   lat: 51.1780, lng: 71.4300 },
    { name: 'Ботаникалық Бақ', lat: 51.2110, lng: 71.4010 },
    { name: 'Байтерек Аймағы', lat: 51.1285, lng: 71.4308 },
    { name: 'Нурлы Жол',       lat: 51.2010, lng: 71.4720 },
    { name: 'Сарыарқа',        lat: 51.1830, lng: 71.4400 },
    { name: 'Достық',          lat: 51.1560, lng: 71.4100 },
    { name: 'Хан Шатыр',      lat: 51.1900, lng: 71.4100 },
    { name: 'Президент Паркі', lat: 51.1290, lng: 71.4490 },
  ];

  let count = 0;
  for (const station of stations) {
    for (let day = 0; day < 10; day++) {
      const measuredAt = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
      const pm25 = parseFloat((8 + Math.random() * 27).toFixed(1));
      const pm10 = parseFloat((pm25 * 1.4 + Math.random() * 10).toFixed(1));
      const aqi  = Math.round(pm25 * 1.5 + Math.random() * 20);

      await client.query(
        `INSERT INTO air_quality_logs
           (station_name, lat, lng, pm25, pm10, aqi, measured_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [station.name, station.lat, station.lng, pm25, pm10, aqi, measuredAt]
      );
      count++;
    }
  }
  console.log(`   ✅ ${count} ауа сапасы жазбасы қосылды`);
}

// ════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════
async function main() {
  const client = await pool.connect();
  console.log('\n🌿 EcoRoute Astana — Seed Script бастады\n');

  try {
    await client.query('BEGIN');

    // Тазарту
    console.log('🧹 Ескі деректерді тазарту...');
    await client.query(`
      TRUNCATE air_quality_logs, eco_events, bookings, pois, eco_routes, users
      RESTART IDENTITY CASCADE
    `);
    console.log('   ✅ Кестелер тазартылды\n');

    // Seed
    const userIds    = await seedUsers(client);
    const routeIds   = await seedRoutes(client);
    await seedPois(client);
    const bookingIds = await seedBookings(client, userIds, routeIds);
    await seedEcoEvents(client, userIds, bookingIds);
    await seedAirQuality(client);

    await client.query('COMMIT');

    const total = 20 + 15 + 50 + 30 + 20 + 100;
    console.log(`\n${'═'.repeat(45)}`);
    console.log('✅ SEED АЯҚТАЛДЫ!');
    console.log(`${'═'.repeat(45)}`);
    console.log(`  👤 users:             20 жол`);
    console.log(`  🗺️  eco_routes:         15 жол`);
    console.log(`  📍 pois:              50 жол`);
    console.log(`  📅 bookings:          30 жол`);
    console.log(`  🌱 eco_events:        20 жол`);
    console.log(`  🌬️  air_quality_logs: 100 жол`);
    console.log(`${'─'.repeat(45)}`);
    console.log(`  📊 БАРЛЫҒЫ:          ${total} жол`);
    console.log(`${'═'.repeat(45)}\n`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed қатесі:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
