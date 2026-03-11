# Authentication & Test Accounts

## Database Connection

The application requires PostgreSQL database to be running. 

### Start Database (Docker)
```bash
docker compose up -d postgres redis
```

### Check Database Status
```bash
docker exec ecoroute_db pg_isready -U ecoroute
```

## Test Accounts

All test accounts use the same password: **Test1234!**

### Admin Account
- **Email**: admin@ecoroute.kz
- **Password**: Test1234!
- **Role**: Admin
- **Eco Points**: 9999

### Guide Accounts
- **Email**: guide@ecoroute.kz (Жанар Ертаева)
- **Password**: Test1234!
- **Role**: Guide

### Regular User Accounts
- **Email**: arman@mail.kz (Арман Сейткали)
- **Email**: dana@gmail.com (Дана Нурланова)
- **Email**: asel@mail.kz (Асель Қасымова)
- **Password**: Test1234! (same for all)
- **Role**: User

## Login Issues

### "Database connection failed"
1. Make sure Docker containers are running:
   ```bash
   docker ps
   ```
2. Check if PostgreSQL is accepting connections:
   ```bash
   docker logs ecoroute_db
   ```
3. Verify environment variables in `backend/.env`:
   ```
   DB_HOST=localhost      # for local development
   DB_PORT=5432
   DB_NAME=ecoroute_db
   DB_USER=ecoroute
   DB_PASSWORD=ecoroute_secret_2025
   ```

### "Email или пароль неверны" (Wrong email or password)
- Make sure you're using the correct password: **Test1234!** (with exclamation mark)
- Check if users are seeded in database:
  ```bash
  docker exec ecoroute_db psql -U ecoroute -d ecoroute_db -c "SELECT email FROM users;"
  ```

### Reseed Database
If you need to reset the database with fresh test data:
```bash
cd backend
npm run seed
```

## Environment Setup

### Backend (.env)
```env
PORT=4000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecoroute_db
DB_USER=ecoroute
DB_PASSWORD=ecoroute_secret_2025

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Starting the Application

1. **Start Database**:
   ```bash
   docker compose up -d postgres redis
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Backend Health: http://localhost:4000/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Routes
- `GET /api/routes` - Get all eco routes
- `GET /api/routes/:id` - Get specific route
- `GET /api/routes/stats/summary` - Get route statistics

### Navigation
- `GET /api/navigate?from_lat=X&from_lng=Y&to_lat=X&to_lng=Y&mode=walking` - Get navigation route

### POIs
- `GET /api/pois` - Get all points of interest
- `GET /api/pois/nearby?lat=X&lng=Y` - Get nearby POIs

### Eco Actions
- `GET /api/eco/profile` - Get user's eco profile
- `GET /api/eco/leaderboard` - Get eco leaderboard

## Security Notes

⚠️ **Important**: The test accounts and JWT secrets shown here are for development only. 

For production:
1. Change all JWT secrets
2. Use strong unique passwords
3. Enable HTTPS
4. Restrict CORS origins
5. Use environment-specific configurations
