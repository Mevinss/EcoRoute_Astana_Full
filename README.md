# 🌿 EcoRoute Astana

Астананың экологиялық туризм платформасы — eco маршруттар, брондау, eco-bonus жүйесі.

> **📖 Толық нұсқаулық:** [SETUP.md](./SETUP.md) — іске қосу, қателер, деректер базасы

---

## 🚀 Жобаны іске қосу (Docker арқылы)

### Алдын ала қажеттіліктер:
1. **Docker Desktop** орнатыңыз: https://www.docker.com/products/docker-desktop/
2. Docker Desktop іске қосыңыз және жұмыс істеп тұрғанын тексеріңіз

### Іске қосу қадамдары:

```bash
# 1. Жоба папкасына кіріңіз (docker-compose.yml бар жерде)
cd EcoRoute_Astana_Full

# 2. Docker Compose арқылы барлық сервистерді іске қосу
docker compose up --build

# Немесе фондық режимде:
docker compose up -d --build
```

> ⚠️ **Маңызды:** `docker compose up` командасын `docker-compose.yml` файлы
> бар папкадан іске қосыңыз!

### Браузерде ашу:
- **Frontend (сайт):** http://localhost:3000
- **Backend (API):** http://localhost:4000
- **Карта беті:** http://localhost:3000/map

### Тест тіркелгілері:
| Email | Пароль | Рөл |
|-------|--------|-----|
| `test@ecoroute.kz` | `Test1234!` | Пайдаланушы |
| `admin@ecoroute.kz` | `Test1234!` | Администратор |

### Тоқтату:
```bash
docker compose down
```

---

## 🚀 GitHub Codespaces арқылы іске қосу (ЕҢ ОҢАЙ ЖОЛЫ)

### 1-қадам: Codespace ашу
1. GitHub репозиторийінде **"Code"** батырмасын басыңыз
2. **"Codespaces"** табын таңдаңыз
3. **"Create codespace on main"** батырмасын басыңыз
4. 2-3 минут күтіңіз — орта автоматты түрде дайындалады

### 2-қадам: Қызметтерді іске қосу
```bash
# Docker Compose арқылы барлық қызметтерді іске қосу
cd ecoroute-astana
docker compose up -d

# Backend іске қосу (4000 порт)
cd backend && npm run dev &

# Frontend іске қосу (3000 порт)
cd ../frontend && npm run dev
```

### 3-қадам: Браузерде ашу
- Порт `3000` автоматты түрде ашылады — **Карта мен маршруттар** көрінеді
- Немесе "Ports" панелінен қолмен ашуға болады

> **💡 Кеңес:** Codespace-те GDAL, PostGIS және карталармен жұмыс істеуге қажетті барлық кітапханалар алдын-ала орнатылған!

---

## 🗂 Жоба структурасы

```
ecoroute-astana/
├── frontend/          ← Next.js 14 + Tailwind CSS + Mapbox
├── backend/           ← Node.js + Express + PostgreSQL
├── database/
│   ├── migrations/    ← SQL кесте жасау скрипттер
│   └── seeds/         ← Тест деректер жүктеу
├── .github/workflows/ ← CI/CD (GitHub Actions)
└── docs/              ← API документация
```

## 🚀 Жылдам бастау

```bash
# 1. Репозиторийді клондау
git clone https://github.com/YOUR_USERNAME/ecoroute-astana.git
cd ecoroute-astana

# 2. .env файлдарын дайындау
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# 3. Docker-мен барлығын іске қосу
docker compose up -d

# 4. DB миграция + seed
cd backend
npm install
npm run migrate
npm run seed

# 5. Frontend іске қосу
cd ../frontend
npm install
npm run dev
```

Браузерде ашу: http://localhost:3000

## 🛠 Технология стегі

| Бөлім | Технология |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Mapbox GL JS |
| Backend | Node.js, Express, JWT Auth |
| Database | PostgreSQL + PostGIS |
| DevOps | Docker, GitHub Actions |
| QA | Playwright, Postman |

## 👥 Командалар

- **Дизайнер** → Figma тапсырмалар (F-01..F-06)
- **Backend Dev** → `backend/` + `database/`
- **Frontend Dev** → `frontend/`
- **DevOps** → `docker-compose.yml`, `.github/`
- **QA** → `docs/API.md`, Postman collection

## 🌈 Түс палитрасы

| Аты | HEX | Қолданыс |
|-----|-----|---------|
| Eco Green | `#1ADF9A` | Primary button, highlight |
| Deep Black | `#070A0E` | Background |
| Card Surface | `#161D2A` | Cards, modals |
| Sky Blue | `#38BDF8` | Links, info |
| Amber | `#FBBF24` | Eco-bonus, ratings |

## 📦 Деректер (Seed)

```bash
npm run seed
# ✅ 20 users
# ✅ 15 eco_routes
# ✅ 50 pois
# ✅ 30 bookings
# ✅ 10 eco_events
# ✅ 100 air_quality_logs
# ═══════════════════
# ✅ Total: 235 rows inserted
```

## 🔑 API Эндпоинттер

| Method | URL | Сипаттама |
|--------|-----|-----------|
| POST | `/api/auth/register` | Тіркелу |
| POST | `/api/auth/login` | Кіру |
| POST | `/api/auth/refresh` | Token жаңарту |
| GET | `/api/routes` | Барлық маршруттар |
| GET | `/api/routes/:id` | Маршрут детайлы |
| GET | `/api/pois` | POI нүктелер |
| POST | `/api/bookings` | Бронь жасау |
| GET | `/api/bookings` | Менің брондарым |
| GET | `/api/eco/profile` | Eco-bonus профилі |

## 📋 Milestones

- **Апта 8** → Auth API + Login/Register UI ✅
- **Апта 10** → Map беті + Routes API ✅
- **Апта 11** → Booking + Eco-bonus ✅
- **Апта 15** → 🚀 Production Launch
