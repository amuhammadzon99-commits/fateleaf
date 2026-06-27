# FateLeaf E-commerce

Полноценный проект интернет-магазина чая с Frontend на React и Backend на Node.js.

## Требования
- Node.js
- MongoDB (убедитесь, что база данных запущена локально на порту 27017, либо измените `MONGO_URI` в `backend/.env`)

## Как запустить

1. Откройте терминал в папке проекта (`FateLeaf`).
2. Установите зависимости для всего проекта:
   ```bash
   npm run install-all
   ```
3. Запустите проект (backend + frontend):
   ```bash
   npm run dev
   ```

## Структура проекта
- `backend/` — API сервер (Express, MongoDB)
- `frontend/` — Клиентское приложение (React, Vite, Tailwind CSS, Redux)

> Примечание: Для корректной работы AI-ассистента и Telegram бота необходимо добавить соответствующие ключи в файл `backend/.env`.
