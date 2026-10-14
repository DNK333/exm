# Игра «Угадай число»

Приложение состоит из React-клиента и Django REST API. Компьютер загадывает число от 1 до 100; у игрока есть 7 попыток. Завершённые победы и поражения сохраняются в базе SQLite.

## Django API

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
py manage.py migrate
py manage.py runserver
```

- `GET http://127.0.0.1:8000/game-results/` — список результатов.
- `POST http://127.0.0.1:8000/game-results/` — сохранить результат JSON-телом:

```json
{
  "player_name": "Магомед",
  "attempts": 3,
  "result": "win"
}
```

`result` принимает `win` или `lose`, а количество попыток — от 1 до 7.

## React

В отдельном терминале из папки `frontend`:

```powershell
npm install
npm run dev
```

Откройте адрес, показанный Vite (обычно `http://localhost:5173`). Vite проксирует API-запросы на локальный Django-сервер `http://127.0.0.1:8000`.

## Проверка API

Из папки `backend` выполните `py manage.py test`.

## ИИ

ии сделал дизайн и т.д.
