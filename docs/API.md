# 📡 EcoRoute Astana — API Документация

Base URL: `http://localhost:4000/api`

## 🔐 Auth — Аутентификация

### POST `/auth/register` — Тіркелу
```json
// Request body:
{ "name": "Арман Сейткали", "email": "arman@mail.kz", "password": "Test1234!" }

// Response 201:
{
  "message": "Тіркелу сәтті!",
  "user": { "id": "uuid", "name": "Арман Сейткали", "email": "...", "eco_points": 0, "eco_level": "Beginner" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### POST `/auth/login` — Кіру
```json
// Request: { "email": "arman@mail.kz", "password": "Test1234!" }
// Response: { "user": {...}, "accessToken": "...", "refreshToken": "..." }
```

### POST `/auth/refresh` — Token жаңарту
```json
// Request: { "refreshToken": "eyJ..." }
// Response: { "accessToken": "...", "refreshToken": "..." }
```

### GET `/auth/me` — Ағымдағы пайдаланушы
```
Headers: Authorization: Bearer <accessToken>
Response: { "user": { id, name, email, eco_points, eco_level, role } }
```

---

## 🗺️ Routes — Eco Маршруттар

### GET `/routes` — Барлық маршруттар
```
Query params:
  ?type=walking|cycling|mixed
  ?difficulty=easy|medium|hard
  ?free=true

Response: { "routes": [...], "total": 15 }
```

### GET `/routes/:id` — Маршрут детайлы
```
Response: { "route": {...geojson, stats...}, "nearby_pois": [...] }
```

### GET `/routes/stats/summary` — Статистика
```
Response: { total_routes, walking, cycling, mixed, free_routes, avg_distance_km, total_co2_saved_g }
```

---

## 📍 POIs — Нүктелер

### GET `/pois` — Барлық POI
```
Query: ?category=park|cafe|bike_park|water|landmark  ?eco_only=true
```

### GET `/pois/nearby` — Жақын POI
```
Query: ?lat=51.1801&lng=71.4460&radius=2000  (метр)
```

---

## 📅 Bookings — Брондаулар

### GET `/bookings` — Менің брондарым
```
Headers: Authorization: Bearer <token>
```

### POST `/bookings` — Бронь жасау
```json
{
  "route_id": "uuid",
  "booking_date": "2025-04-15",
  "participants": 2,
  "with_guide": false,
  "payment_method": "kaspi"
}
Response 201: { "booking": {...}, "payment_needed": true, "eco_bonus_to_earn": 150 }
```

### PATCH `/bookings/:id/cancel` — Бронь болдырылмау
```
Response: { "message": "Бронь болдырылмады.", "booking": {...} }
```

---

## 🌿 Eco — Eco-bonus

### GET `/eco/profile` — Eco профиль
```
Response: { user, stats: {total_bookings, total_pts, total_co2_saved_g}, recent_events, next_level_pts }
```

### GET `/eco/leaderboard` — Рейтинг
```
Response: { "leaderboard": [{ id, name, eco_points, eco_level }, ...] }
```

### GET `/eco/air-quality` — Ауа сапасы
```
Response: { "stations": [{ station_name, lat, lng, pm25, pm10, aqi, aqi_category }, ...] }
```

---

## ❌ Error Responses

| Код | Сипаттама |
|-----|-----------|
| 400 | Validation қатесі (Zod) |
| 401 | Token жоқ немесе жарамсыз |
| 403 | Рұқсат жоқ (admin only) |
| 404 | Табылмады |
| 409 | Conflict (email тіркелген) |
| 500 | Server қатесі |

## 🔑 Auth Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Access token мерзімі: **15 минут**  
Refresh token мерзімі: **7 күн**
