# 🌿 EcoRoute Astana

Астананың экологиялық туризм платформасы — eco маршруттар, брондау, eco-bonus жүйесі.

> **⚡ Жылдам бастау:** [QUICKSTART_RU.md](./QUICKSTART_RU.md) — 5 минутта іске қосу (орысша)
> 
> **📖 Толық нұсқаулық:** [SETUP.md](./SETUP.md) — қателерді жою, деректер базасы

---

## 📋 ТОЛЫҚ ІСКЕ ҚОСУ НҰСҚАУЛЫҒЫ

### 🎯 Не істеу керек (Қысқаша):

1. ✅ **Docker Desktop орнату** (https://www.docker.com/products/docker-desktop/)
2. ✅ **Жобаны жүктеу/клондау**
3. ✅ **Терминалда жоба папкасына кіру**
4. ✅ **`docker compose up --build` командасын іске қосу**
5. ✅ **Браузерде http://localhost:3000 ашу**

---

## 🚀 ҚАДАМ-ҚАДАММЕН НҰСҚАУЛЫҚ

### 1-ҚАДАМ: Docker Desktop орнату

**Windows/Mac үшін:**
1. https://www.docker.com/products/docker-desktop/ сайтына кіріңіз
2. Өз операциялық жүйеңізге сәйкес нұсқасын жүктеңіз:
   - **Windows**: "Docker Desktop for Windows" батырмасын басыңыз
   - **Mac**: "Docker Desktop for Mac" (Intel немесе Apple Silicon)
3. Жүктелген файлды іске қосып орнатыңыз
4. Компьютерді қайта іске қосыңыз (керек болса)
5. Docker Desktop іске қосыңыз — taskbar/menu bar-да кит белгісі пайда болады

**Docker жұмыс істеп тұрғанын тексеру:**
```bash
docker --version
# Көрінуі керек: Docker version 24.0.0 немесе жоғары
```

---

### 2-ҚАДАМ: Жобаны алу

**Опция А: GitHub-тан клондау**
```bash
git clone https://github.com/Mevinss/EcoRoute_Astana_Full.git
cd EcoRoute_Astana_Full
```

**Опция Б: ZIP файлын жүктеп алу**
1. GitHub-та "Code" → "Download ZIP" басыңыз
2. ZIP файлын ашыңыз
3. Терминалда папкаға кіріңіз:
```bash
cd C:\Users\ӨзіңіздіңАтыңыз\Downloads\EcoRoute_Astana_Full
```

---

### 3-ҚАДАМ: Жобаны іске қосу

**Терминалды ашыңыз:**
- **Windows**: PowerShell немесе Command Prompt
- **Mac**: Terminal
- **Linux**: Terminal

**Жоба папкасына кіріңіз:**
```bash
cd EcoRoute_Astana_Full
```

**Маңызды тексеру - сіз дұрыс папкадасыз ба?**
```bash
# Windows PowerShell
dir docker-compose.yml

# Mac/Linux
ls docker-compose.yml
```
Егер файл табылса — дұрыссыз! Табылмаса — дұрыс папкаға кіріңіз.

**Барлық қызметтерді іске қосу:**
```bash
docker compose up --build
```

**Күту уақыты:** 3-5 минут. Мына жазуларды көрсеңіз — дайын:
```
✅ ecoroute_db       | database system is ready to accept connections
✅ ecoroute_backend  | 🌿 EcoRoute API іске қосылды
✅ ecoroute_frontend | ✓ Ready in 2.3s
```

---

### 4-ҚАДАМ: Браузерде ашу

**Қызметтер іске қосылды! Енді мыналарды ашыңыз:**

| Не ашасыз | URL | Сипаттама |
|-----------|-----|-----------|
| 🏠 **Басты бет** | http://localhost:3000 | Жоба басты бетіне |
| 🗺️ **Карта** | http://localhost:3000/map | Астана картасы + маршруттар |
| 🔑 **Кіру** | http://localhost:3000/auth/login | Аккаунтқа кіру |
| 📋 **Маршруттар** | http://localhost:3000/routes | Барлық eco маршруттар |
| 🔧 **API** | http://localhost:4000/health | Backend API статусы |

---

### 5-ҚАДАМ: Тест тіркелгілерімен кіру

**Барлық тест аккаунттардың пароль: `Test1234!`**

| Рөл | Email | Пароль | Eco Points |
|-----|-------|--------|-----------|
| 👤 **Пайдаланушы** | test@ecoroute.kz | Test1234! | 1240 |
| 👤 **Пайдаланушы** | arman@mail.kz | Test1234! | 1240 |
| 🎯 **Гид** | guide@ecoroute.kz | Test1234! | 2900 |
| 👑 **Админ** | admin@ecoroute.kz | Test1234! | 9999 |

**Кіру үшін:**
1. http://localhost:3000/auth/login ашыңыз
2. Email: `admin@ecoroute.kz`
3. Пароль: `Test1234!`
4. "Кіру →" батырмасын басыңыз

---

## 🛑 ТОҚТАТУ ЖӘНЕ ҚАЙТА ІСКЕ ҚОСУ

**Жобаны тоқтату (деректер сақталады):**
```bash
docker compose down
```

**Қайта іске қосу:**
```bash
docker compose up
```

**Толық rebuild (код өзгерген болса):**
```bash
docker compose up --build
```

**Барлығын тазалап қайта бастау:**
```bash
docker compose down -v
docker compose up --build
```

---

## ❌ ЖИІ КЕЗДЕСЕТІН ҚАТЕЛЕР

### ❌ "no configuration file provided: not found"

**Себебі:** Сіз дұрыс емес папкадасыз.

**Шешімі:**
```bash
# Алдымен жоба папкасына кіріңіз
cd EcoRoute_Astana_Full

# docker-compose.yml файлы бар-жоғын тексеріңіз
dir docker-compose.yml    # Windows
ls docker-compose.yml     # Mac/Linux

# Енді іске қосыңыз
docker compose up --build
```

---

### ❌ Карта көрінбейді (ақ экран)

**Себептері:**
1. Интернет байланысы жоқ (картаға тайлдар интернет арқылы жүктеледі)
2. Браузер кэші мәселесі

**Шешімі:**
1. Интернетті тексеріңіз
2. Бетті жаңартыңыз: `Ctrl + F5` (Windows) немесе `Cmd + Shift + R` (Mac)
3. Chrome немесе Firefox браузерін қолданыңыз
4. Браузер консолін тексеріңіз: `F12` → Console табы

---

### ❌ "Маршруттар табылмады"

**Себебі:** Деректер базасында деректер жоқ.

**Шешімі - барлығын қайта бастау:**
```bash
# Тоқтату және деректерді тазалау
docker compose down -v

# Қайта іске қосу
docker compose up --build

# Күтіңіз: 3-5 минут
# Деректер автоматты түрде жүктеледі
```

---

### ❌ "Cannot connect to Docker daemon"

**Себебі:** Docker Desktop іске қосылмаған.

**Шешімі:**
1. Docker Desktop іске қосыңыз
2. Taskbar/menu bar-да кит белгісі "running" көрсетуі керек
3. 30 секунд күтіңіз
4. Қайта көріңіз: `docker compose up --build`

---

### ❌ Порт 3000 немесе 4000 бос емес

**Себебі:** Басқа қызмет осы портты қолданып тұр.

**Шешімі:**
```bash
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :4000

# Mac/Linux
lsof -i :3000
lsof -i :4000

# Портты босату немесе docker-compose.yml-де портты өзгерту
```

---

## 🎓 ТОЛЫҚ ТЕСТ ТІРКЕЛГІЛЕРІ

Барлық аккаунттардың пароль: **Test1234!**

| № | Аты | Email | Eco Points | Деңгей | Рөл |
|---|-----|-------|-----------|--------|-----|
| 1 | Арман Сейткали | arman@mail.kz | 1240 | Explorer | user |
| 2 | Дана Нурланова | dana@gmail.com | 2500 | Green Hero | user |
| 3 | Асель Қасымова | asel@mail.kz | 800 | Explorer | user |
| 4 | Жанар Ертаева | guide@ecoroute.kz | 2900 | Eco Champion | guide |
| 5 | Admin EcoRoute | admin@ecoroute.kz | 9999 | Eco Champion | admin |

---

## 💻 Docker-сіз іске қосу (Әзірлеушілерге)

### Алдын ала қажеттіліктер:
- Node.js 20+ (`node --version`)
- PostgreSQL 15+ + PostGIS
- Redis (опционал)

### 1. Деректер базасын іске қосу:
```bash
# Docker арқылы тек database:
docker compose up -d postgres redis
```

### 2. Backend іске қосу:
```bash
cd backend
npm install
npm run dev
# → http://localhost:4000
```

### 3. Frontend іске қосу (жаңа терминалда):
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## 🗺️ Google Maps интеграциясы

**Ағымдағы жағдай:** Жоба қазір **MapLibre GL + CartoDB** тайлдарын қолданады (тегін, API кілті керек емес).

**Google Maps-қа көшу қажет болса:**
- 📚 Толық нұсқаулық: [`/docs/GOOGLE_MAPS_INTEGRATION.md`](./docs/GOOGLE_MAPS_INTEGRATION.md)
- Google Maps API кілтін алу
- React компонентін орнату
- Баға ақпараты және салыстыру

**Ағымдағы MapLibre setup:**
- ✅ Astana картасын көрсетеді
- ✅ Eco маршруттарды көрсетеді  
- ✅ Navigation жұмыс істейді
- ✅ Ешқандай API кілті керек емес
- ✅ Production-ready

---

## 📚 Қосымша Құжаттама

| Құжат | Сипаттама |
|-------|-----------|
| [`SETUP.md`](./SETUP.md) | Толық іске қосу нұсқаулығы, қателерді жою |
| [`docs/AUTHENTICATION.md`](./docs/AUTHENTICATION.md) | Барлық тест аккаунттар, кіру нұсқаулығы |
| [`docs/GOOGLE_MAPS_INTEGRATION.md`](./docs/GOOGLE_MAPS_INTEGRATION.md) | Google Maps API интеграциясы |
| [`docs/API.md`](./docs/) | Backend API құжаттамасы |

---

## 🔧 Пайдалы Командалар

### Docker командалар:
```bash
# Барлық контейнерлер статусы
docker compose ps

# Логтарды көру
docker compose logs -f

# Тек backend логтары
docker compose logs -f backend

# Контейнерді қайта іске қосу
docker compose restart backend

# Деректерді сақтап тоқтату
docker compose down

# Барлығын тазалап тоқтату
docker compose down -v
```

### Database командалар:
```bash
# PostgreSQL-ге кіру
docker exec -it ecoroute_db psql -U ecoroute -d ecoroute_db

# Маршруттар санын тексеру
docker exec ecoroute_db psql -U ecoroute -d ecoroute_db \
  -c "SELECT COUNT(*) FROM eco_routes;"

# POI санын тексеру
docker exec ecoroute_db psql -U ecoroute -d ecoroute_db \
  -c "SELECT COUNT(*) FROM pois;"
```

### API тексеру:
```bash
# Backend health check
curl http://localhost:4000/health

# Маршруттар тізімі
curl http://localhost:4000/api/routes | jq .

# Login тексеру
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoroute.kz","password":"Test1234!"}' | jq .
```

---

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


---

## 🛠 Технология стегі

| Бөлім | Технология | Нұсқа |
|-------|-----------|-------|
| **Frontend** | Next.js | 14.2.3 |
| | React Query | 5.x |
| | Tailwind CSS | 3.x |
| | MapLibre GL JS | 4.x |
| **Backend** | Node.js | 20.x |
| | Express | 4.x |
| | JWT Auth | jsonwebtoken |
| **Database** | PostgreSQL | 15.x |
| | PostGIS | 3.x |
| | Redis | 7.x |
| **DevOps** | Docker | 24.x |
| | Docker Compose | v2 |

---

## 🗂 Жоба структурасы

```
EcoRoute_Astana_Full/
├── 📁 frontend/                 ← Next.js 14 қосымша
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        ← Басты бет
│   │   │   ├── map/page.tsx    ← 🗺️ Карта беті
│   │   │   ├── routes/         ← 📋 Маршруттар
│   │   │   ├── auth/           ← 🔑 Аутентификация
│   │   │   └── profile/        ← 👤 Профиль
│   │   ├── components/         ← React компоненттер
│   │   ├── lib/                ← API, утилиттер
│   │   └── store/              ← Zustand state
│   ├── package.json
│   └── .env.local
│
├── 📁 backend/                  ← Node.js API сервер
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     ← POST /api/auth/login, register
│   │   │   ├── routes.routes.ts   ← GET /api/routes
│   │   │   ├── pois.routes.ts     ← GET /api/pois
│   │   │   ├── bookings.routes.ts ← POST /api/bookings
│   │   │   └── navigate.routes.ts ← GET /api/navigate
│   │   ├── middleware/          ← JWT auth, CORS
│   │   ├── utils/               ← Database pool, logger
│   │   └── index.ts             ← Express сервер
│   ├── package.json
│   └── .env
│
├── 📁 database/                 ← PostgreSQL миграциялар
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_eco_routes.sql
│   │   ├── 003_create_pois.sql
│   │   ├── 004_create_bookings.sql
│   │   ├── 005_create_eco_events.sql
│   │   ├── 006_create_air_quality.sql
│   │   └── 007_seed_data.sql      ← 🌱 Бастапқы деректер
│   └── seeds/
│       ├── seed.ts                ← npm run seed
│       └── data/                  ← Тест деректер
│
├── 📁 docs/                     ← Құжаттама
│   ├── AUTHENTICATION.md        ← Кіру, тест аккаунттар
│   ├── GOOGLE_MAPS_INTEGRATION.md
│   └── API.md
│
├── docker-compose.yml           ← Docker конфигурация
├── README.md                    ← Осы файл
└── SETUP.md                     ← Толық setup нұсқаулығы
```

---

## 📡 API Эндпоинттер

### Authentication
```bash
POST   /api/auth/register      # Тіркелу
POST   /api/auth/login         # Кіру
POST   /api/auth/refresh       # Token жаңарту
GET    /api/auth/me            # Профиль (JWT керек)
POST   /api/auth/logout        # Шығу
```

### Eco Routes
```bash
GET    /api/routes             # Барлық маршруттар
GET    /api/routes/:id         # Маршрут детайлы
GET    /api/routes/stats       # Статистика
```

### POIs (Points of Interest)
```bash
GET    /api/pois               # Барлық POI нүктелер
GET    /api/pois/nearby        # Жақын POI-лер
```

### Navigation
```bash
GET    /api/navigate           # Route planning
# Параметрлер: from_lat, from_lng, to_lat, to_lng, mode
```

### Bookings
```bash
POST   /api/bookings           # Бронь жасау
GET    /api/bookings           # Менің брондарым
GET    /api/bookings/:id       # Бронь детайлы
```

### Eco Profile
```bash
GET    /api/eco/profile        # Eco-bonus профилі
GET    /api/eco/leaderboard    # Рейтинг
```

---

## 🔍 Қателерді Жою (Troubleshooting)

### Жалпы тексерулер:

**1. Барлық контейнерлер жұмыс істеп тұр ма?**
```bash
docker compose ps
```
Барлығы `Up` немесе `running` болуы керек:
```
NAME                 STATUS
ecoroute_db          Up (healthy)
ecoroute_redis       Up
ecoroute_backend     Up
ecoroute_frontend    Up
```

**2. Backend API қол жетімді ме?**
```bash
curl http://localhost:4000/health
```
Жауап: `{"status":"ok","service":"EcoRoute API","version":"1.0.0"}`

**3. Database байланысы бар ма?**
```bash
docker exec ecoroute_db pg_isready -U ecoroute
```
Жауап: `/var/run/postgresql:5432 - accepting connections`

**4. Маршруттар database-те бар ма?**
```bash
docker exec ecoroute_db psql -U ecoroute -d ecoroute_db \
  -c "SELECT COUNT(*) FROM eco_routes WHERE is_active = TRUE;"
```
Жауап: `15` немесе одан көп

---

### Логтарды тексеру:

**Барлық логтар:**
```bash
docker compose logs
```

**Тек қателер:**
```bash
docker compose logs | grep -i error
```

**Нақты уақытта (live):**
```bash
docker compose logs -f backend
```

---

### Порт мәселелері:

**Порт 3000 бос емес:**
```bash
# Windows
netstat -ano | findstr :3000
# Процесті табыңыз және kill етіңіз немесе портты өзгертіңіз

# Mac/Linux  
lsof -i :3000
kill -9 <PID>
```

**Docker-compose.yml-де портты өзгерту:**
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # 3001 қолданыңыз
```

---

## 🎯 Жиі Қойылатын Сұрақтар (FAQ)

**Q: Картада маршруттар көрінбейді. Не істеу керек?**
A: 
1. Backend API жұмыс істеп тұрғанын тексеріңіз: `curl http://localhost:4000/api/routes`
2. Database-те деректер бар-жоғын тексеріңіз
3. Браузер консолін ашып қателерді қараңыз (F12 → Console)
4. Бетті жаңартыңыз: Ctrl+F5

**Q: "Email немесе пароль дұрыс емес" қатесі шығады**
A: Пароль `Test1234!` екенін тексеріңіз (үлкен T, соңында !)

**Q: Деректер сақталады ма?**
A: Иә, `docker compose down` деректерді сақтайды. Тазалау үшін: `docker compose down -v`

**Q: Қалай seed деректерін қайта жүктеймін?**
A:
```bash
docker compose down -v
docker compose up --build
```

**Q: Google Maps қалай қосамын?**
A: [`/docs/GOOGLE_MAPS_INTEGRATION.md`](./docs/GOOGLE_MAPS_INTEGRATION.md) оқыңыз

**Q: Production-қа қалай deploy етемін?**
A: 
1. `.env` файлдарындағы құпия кілттерді өзгертіңіз
2. JWT_SECRET жаңа мәнге өзгертіңіз
3. Database паролін өзгертіңіз
4. HTTPS орнатыңыз
5. CORS-ты production domain-ге шектеңіз

---

## 📞 Қолдау және байланыс

- 📖 **Құжаттама:** [`/docs`](./docs/) папкасы
- 🐛 **Bug report:** GitHub Issues
- 💡 **Feature request:** GitHub Discussions
- 📧 **Email:** support@ecoroute.kz

---

## 🌟 Contributors

Жобаға үлес қосқандарға рахмет! 🙏

---

## 📄 License

MIT License - толық мәтін [`LICENSE`](./LICENSE) файлында.

---

<div align="center">

**🌿 Жасыл Астана үшін!**

Made with 💚 in Astana, Kazakhstan

</div>
