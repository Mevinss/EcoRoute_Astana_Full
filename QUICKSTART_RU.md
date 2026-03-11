# 🚀 Быстрый старт — EcoRoute Astana

## Что нужно сделать за 5 минут

### Шаг 1: Установить Docker Desktop
1. Скачать: https://www.docker.com/products/docker-desktop/
2. Установить и запустить
3. Убедиться, что Docker работает (значок кита в трее)

### Шаг 2: Скачать проект
```bash
git clone https://github.com/Mevinss/EcoRoute_Astana_Full.git
cd EcoRoute_Astana_Full
```

### Шаг 3: Запустить
```bash
docker compose up --build
```

**Ждем 3-5 минут...** ☕

### Шаг 4: Открыть в браузере
- 🏠 Главная: http://localhost:3000
- 🗺️ Карта: http://localhost:3000/map
- 🔑 Вход: http://localhost:3000/auth/login

### Шаг 5: Войти
- **Email:** admin@ecoroute.kz
- **Пароль:** Test1234!

---

## ✅ Готово!

Вы должны увидеть:
- ✅ Карту Астаны с маршрутами
- ✅ 15 эко-маршрутов
- ✅ 25 точек интереса (POI)
- ✅ Систему eco-bonus

---

## ❌ Если что-то не работает

### Ошибка: "no configuration file provided"
**Причина:** Вы в неправильной папке.

**Решение:**
```bash
cd EcoRoute_Astana_Full
docker compose up --build
```

### Карта пустая (белый экран)
**Причина:** Нет интернета или проблема с кэшем.

**Решение:**
1. Проверьте интернет
2. Обновите страницу: `Ctrl + F5`
3. Откройте в Chrome или Firefox

### "Cannot connect to Docker daemon"
**Причина:** Docker Desktop не запущен.

**Решение:**
1. Запустите Docker Desktop
2. Подождите 30 секунд
3. Попробуйте снова

### Порт 3000 уже занят
**Решение:**
```bash
# Найти и убить процесс на порту 3000
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

---

## 🛑 Как остановить

```bash
# Остановить (данные сохраняются)
docker compose down

# Остановить и удалить все данные
docker compose down -v
```

---

## 🔄 Как перезапустить

```bash
# Просто перезапустить
docker compose up

# Пересобрать (если изменился код)
docker compose up --build

# Полная перезагрузка (удалить все и начать заново)
docker compose down -v
docker compose up --build
```

---

## 📚 Документация

| Что | Где |
|-----|-----|
| Полная инструкция | [README.md](./README.md) |
| Решение проблем | [SETUP.md](./SETUP.md) |
| Все тестовые аккаунты | [docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md) |
| Google Maps интеграция | [docs/GOOGLE_MAPS_INTEGRATION.md](./docs/GOOGLE_MAPS_INTEGRATION.md) |

---

## 🎓 Тестовые аккаунты

Все пароли: **Test1234!**

| Email | Роль | Eco Points |
|-------|------|-----------|
| admin@ecoroute.kz | Админ | 9999 |
| guide@ecoroute.kz | Гид | 2900 |
| arman@mail.kz | Пользователь | 1240 |
| dana@gmail.com | Пользователь | 2500 |

---

## 🔧 Полезные команды

```bash
# Статус всех контейнеров
docker compose ps

# Просмотр логов
docker compose logs -f

# Логи только backend
docker compose logs -f backend

# Перезапустить конкретный сервис
docker compose restart backend

# Проверка здоровья API
curl http://localhost:4000/health

# Проверка маршрутов
curl http://localhost:4000/api/routes
```

---

## 🌐 URL-адреса

| Сервис | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Карта | http://localhost:3000/map |
| Вход | http://localhost:3000/auth/login |
| Маршруты | http://localhost:3000/routes |
| API Health | http://localhost:4000/health |

---

## 💡 Подсказки

1. **Первый запуск занимает 3-5 минут** — Docker скачивает образы и собирает проект
2. **Данные сохраняются** при остановке (`docker compose down`)
3. **Чтобы удалить все** используйте `docker compose down -v`
4. **Карта использует MapLibre GL** (бесплатно, без API ключа)
5. **15 тестовых маршрутов** загружаются автоматически

---

## 📞 Помощь

Если ничего не помогло:
1. Прочитайте [SETUP.md](./SETUP.md) — там детальное решение всех проблем
2. Проверьте логи: `docker compose logs`
3. Откройте Issue на GitHub

---

<div align="center">

**🌿 Зеленая Астана!**

Сделано с 💚 в Астане, Казахстан

</div>
