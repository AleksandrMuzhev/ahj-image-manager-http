[![Build and Deploy](https://github.com/AleksandrMuzhev/ahj-image-manager-http/actions/workflows/deploy.yml/badge.svg)](https://github.com/AleksandrMuzhev/ahj-image-manager-http/actions/workflows/deploy.yml)

# Image Manager - Менеджер изображений

Frontend-часть для управления изображениями с загрузкой на сервер.

## Функциональность

- Загрузка изображений через Drag-and-Drop
- Выбор файлов через диалоговое окно
- Поддержка множественной загрузки
- Отображение превью изображений
- Информация о файлах (имя, размер)
- Удаление изображений (с сервера и диска)
- Сохранение на сервере (backend)
- Адаптивная сетка галереи

## API Endpoints (Backend)

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/files` | Получение списка всех файлов |
| GET | `/files/:id` | Получение информации о файле |
| POST | `/files` | Загрузка нового файла |
| DELETE | `/files/:id` | Удаление файла |

## Технологии

### Frontend
- JavaScript (CommonJS)
- Webpack
- Fetch API
- Drag-and-Drop API
- HTML5/CSS3
- GitHub Actions (CI/CD)

### Backend
- Node.js
- Express
- Multer (загрузка файлов)
- CORS

## Установка и запуск

### Запуск бэкенда

```bash
# Клонирование репозитория
git clone https://github.com/AleksandrMuzhev/ahj-image-manager-http.git

# Запуск бэкенда
cd ahj-image-manager-backend

# Установка зависимостей
npm install

# Запуск сервера (порт 8080)
node server.js

# Запуск фронтенда
cd ahj-image-manager-frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки (порт 9000)
npm start

# Сборка production версии
npm run build
```

# Прокси

Frontend настроен на проксирование запросов к бэкенду через webpack-dev-server:

-   `/files` -> `http://localhost:8080/files`
-   `/uploads` -> `http://localhost:8080/uploads`

# Ссылки

[Frontend GitHub Pages](https://AleksandrMuzhev.github.io/ahj-image-manager-http/)
