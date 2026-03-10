# 🌿 EcoRoute Astana — Жобаны іске қосу нұсқаулығы

> **Бұл файл жобаны дұрыс іске қосуды қадамдармен сипаттайды.**
> Егер қиындық туса — осы нұсқаулықты мұқият оқыңыз.

---

## ⚠️ Жиі кездесетін қателер және шешімдері

### ❌ `no configuration file provided: not found`
**Себебі:** `docker compose up` командасын жоба папкасынан емес басқа папкадан іске қостыңыз.

**Шешімі:** Алдымен жоба папкасына кіріңіз:
```bash
# Windows PowerShell / Command Prompt
cd C:\path\to\EcoRoute_Astana_Full

# Содан кейін:
docker compose up --build
```

### ❌ `role "postgres" does not exist`
**Себебі:** Бұл жоба `postgres` емес `ecoroute` пайдаланушысын қолданады.

**Дұрыс команда:**
```bash
docker exec -it ecoroute_db psql -U ecoroute -d ecoroute_db
```

### ❌ `volume is in use`
**Себебі:** Docker контейнер жұмыс істеп тұр. Алдымен тоқтатыңыз:
```bash
docker compose down
docker volume rm ecoroute_astana_full_postgres_data
```

---

## 🚀 Толық іске қосу нұсқаулығы (Docker арқылы)

### 1-қадам: Docker Desktop орнату
1. https://www.docker.com/products/docker-desktop/ сайтынан жүктеңіз
2. Орнатыңыз және іске қосыңыз
3. Docker Desktop жұмыс істеп тұрғанын тексеріңіз (taskbar-де кит белгісі)

### 2-қадам: Жоба папкасына кіру
```bash
# Windows PowerShell
cd C:\Users\ИмяПользователя\EcoRoute_Astana_Full

# Немесе жоба қайда орналасса:
cd C:\путь\к\папке\EcoRoute_Astana_Full
```

> **Маңызды:** `docker-compose.yml` файлы бар папкада болуыңыз керек!
> Тексеру: `dir docker-compose.yml` → файл табылуы керек.

### 3-қадам: Жобаны іске қосу
```bash
# Docker Compose v2 (жаңа нұсқа — ұсынылады):
docker compose up --build

# Docker Compose v1 (ескі нұсқа):
docker-compose up --build

# Немесе фондық режимде:
docker compose up -d --build
```

**Күту:** 2-3 минут. Мынаны көрсеңіз — дайын:
```
ecoroute_frontend | ✓ Ready in 2.3s
ecoroute_backend  | 🌿 EcoRoute API іске қосылды
ecoroute_backend  |    URL: http://localhost:4000
```

### 4-қадам: Браузерде ашу
| Бет | URL |
|-----|-----|
| 🗺️ Карта беті | http://localhost:3000/map |
| 🏠 Басты бет | http://localhost:3000 |
| 🔑 Кіру | http://localhost:3000/auth/login |
| 📋 Маршруттар | http://localhost:3000/routes |
| 🔧 API | http://localhost:4000/health |

### 5-қадам: Тест тіркелгілері
Жоба автоматты түрде тест деректерін жүктейді. Кіру үшін:

| Рөл | Email | Пароль |
|-----|-------|--------|
| Пайдаланушы | `test@ecoroute.kz` | `Test1234!` |
| Администратор | `admin@ecoroute.kz` | `Test1234!` |
| Гид | `guide@ecoroute.kz` | `Test1234!` |

---

## 🗺️ Карта неге көрінбейді?

Карта MapLibre GL + CartoDB тайлдарын қолданады. Егер карта ақ/бос болса:

1. **Интернет бар-жоғын тексеріңіз** — картаға тайлдар интернет арқылы жүктеледі
2. **Браузер консолін ашыңыз** (F12 → Console) — қате хабарламаларды тексеріңіз
3. **Бетті жаңартыңыз** (Ctrl+F5) — кэшті тазалап

Картаны Firefox немесе Chrome қолданып ашыңыз.

---

## 📋 Маршруттар неге "Маршруттар табылмады"?

Бұл мәселе **деректер базасы**ндағы деректердің жоқтығынан туады.

**Шешімі:** Жоба енді `007_seed_data.sql` миграция файлын автоматты іске қосады.
Егер бұрынғы volume болса — тазалап қайта іске қосыңыз:

```bash
docker compose down
docker volume rm ecoroute_astana_full_postgres_data
docker compose up --build
```

---

## 🔄 Жобаны тоқтату және қайта іске қосу

```bash
# Тоқтату (деректер сақталады):
docker compose down

# Тоқтату + деректерді тазалау (таза бастау):
docker compose down -v

# Тек қайта іске қосу (rebuild жоқ):
docker compose up

# Толық rebuild (код өзгерді):
docker compose up --build
```

---

## 💻 Docker-сіз іске қосу (жергілікті даму)

### Алдын ала қажеттіліктер:
- Node.js 20+ (`node --version` → v20.x.x)
- PostgreSQL 15+ + PostGIS кеңейтімі

### 1. Backend іске қосу:
```bash
cd backend
npm install
npm run dev
# → http://localhost:4000
```

### 2. Frontend іске қосу (жаңа терминалда):
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

> **Ескерту:** Docker-сіз іске қосқанда `BACKEND_URL` орнатылмаған болса,
> frontend автоматты түрде `http://localhost:4000` қолданады.

---

## 🐘 Деректер базасымен жұмыс

### psql арқылы кіру (Docker ішінде):
```bash
# ДҰРЫС (ecoroute пайдаланушысымен):
docker exec -it ecoroute_db psql -U ecoroute -d ecoroute_db

# БҰРЫС (postgres жоқ):
# docker exec -it ecoroute_db psql -U postgres  ← ЖОЛ ЖОҚ!
```

### Кестелерді тексеру:
```sql
-- Барлық кестелер
\dt

-- Маршруттар санын тексеру
SELECT COUNT(*) FROM eco_routes WHERE is_active = TRUE;

-- POI санын тексеру
SELECT COUNT(*) FROM pois WHERE is_active = TRUE;
```

### Seed деректерін қайта жүктеу:
```bash
# Docker ішінде seed SQL файлын орындау
docker exec -i ecoroute_db psql -U ecoroute -d ecoroute_db \
  < database/migrations/007_seed_data.sql
```

---

## 🔍 Ақаулықтарды жою

### Логтарды тексеру:
```bash
# Барлық логтар
docker compose logs

# Тек backend логтары
docker compose logs backend

# Тек frontend логтары
docker compose logs frontend

# Тек database логтары
docker compose logs postgres

# Нақты уақытта (live режим)
docker compose logs -f
```

### Контейнер статусы:
```bash
docker compose ps
```

Барлығы `running` болуы керек:
```
NAME                  STATUS
ecoroute_db           running (healthy)
ecoroute_redis        running
ecoroute_backend      running
ecoroute_frontend     running
```

### Backend API тексеру:
```bash
curl http://localhost:4000/health
# → {"status":"ok","service":"EcoRoute API","version":"1.0.0"}

curl http://localhost:4000/api/routes
# → {"routes":[...],"total":15}
```

---

## 🏗️ Жоба структурасы

```
EcoRoute_Astana_Full/
├── docker-compose.yml       ← Барлық сервистер
├── SETUP.md                 ← Осы файл
├── README.md
├── frontend/                ← Next.js 14 + Tailwind + MapLibre GL
│   ├── src/app/
│   │   ├── map/page.tsx     ← 🗺️ Карта беті
│   │   ├── routes/page.tsx  ← 📋 Маршруттар тізімі
│   │   ├── auth/login/      ← 🔑 Кіру беті
│   │   └── auth/register/   ← 📝 Тіркелу беті
│   └── .env.local
├── backend/                 ← Node.js + Express + JWT
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts    ← POST /api/auth/login, /register
│   │   │   ├── routes.routes.ts  ← GET /api/routes
│   │   │   ├── pois.routes.ts    ← GET /api/pois
│   │   │   └── navigate.routes.ts← GET /api/navigate (OSRM)
│   │   └── index.ts
│   └── .env
└── database/
    ├── migrations/
    │   ├── 001_create_users.sql
    │   ├── 002_create_eco_routes.sql
    │   ├── 003_create_pois.sql
    │   ├── 004_create_bookings.sql
    │   ├── 005_create_eco_events.sql
    │   ├── 006_create_air_quality.sql
    │   └── 007_seed_data.sql    ← ЖАҢ: Бастапқы деректер
    └── seeds/                   ← Толық seed скрипт (npm run seed)
```

---

## 📡 API Эндпоинттер

| Method | URL | Сипаттама |
|--------|-----|-----------|
| POST | `/api/auth/register` | Тіркелу |
| POST | `/api/auth/login` | Кіру |
| POST | `/api/auth/refresh` | Token жаңарту |
| GET | `/api/auth/me` | Профиль (токен керек) |
| GET | `/api/routes` | Маршруттар тізімі |
| GET | `/api/routes/:id` | Маршрут детайлы |
| GET | `/api/pois` | POI нүктелер |
| GET | `/api/navigate` | Маршрут жоспарлау (OSRM) |
| GET | `/health` | API статусы |

---

## ✅ Жұмыс тексеру чек-листі

- [ ] `docker compose ps` → 4 контейнер `running`
- [ ] http://localhost:4000/health → `{"status":"ok"}`
- [ ] http://localhost:4000/api/routes → `{"routes":[...],"total":15}`
- [ ] http://localhost:3000/map → Карта + маршруттар көрінеді
- [ ] http://localhost:3000/auth/login → Кіру формасы
- [ ] `test@ecoroute.kz / Test1234!` → Жүйеге кіру жұмыс істейді
