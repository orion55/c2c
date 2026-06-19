# c2c

Сервис для запуска click-to-call звонков через Asterisk AMI. Приложение принимает HTTP-запрос
с номерами пользователя и клиента, нормализует номера, подключается к AMI по TCP и отправляет
последовательность команд `Login`, `Originate`, `Logoff`.

## Стек

- Node.js 20+
- TypeScript в strict-режиме
- Fastify 5
- Inversify 7
- Winston
- tsup
- Biome
- Docker

## Структура проекта

```text
src/
  index.ts                  # точка входа
  inversify.config.ts       # DI-контейнер
  asterisk/                 # HTTP-обработчик и AMI-команды
  config/                   # загрузка переменных окружения из .env
  logger/                   # логирование в консоль и файл
  server/                   # Fastify-сервер и регистрация маршрутов
  util/                     # общие утилиты
scripts/
  build.js                  # сборка dist и подготовка .env на Windows
docker-compose.yml
Dockerfile
```

## Требования

- Node.js `>=20.0.0`
- npm
- Доступ к Asterisk AMI из окружения, где запущен сервис

## Установка

```bash
npm install
```

Создайте `.env` в корне проекта:

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=4000
IS_DEBUG=false
AMI_HOST=127.0.0.1
AMI_PORT=5038
AMI_USER=admin
AMI_SECRET=secret
```

Переменные `HOST`, `PORT`, `AMI_HOST`, `AMI_PORT`, `AMI_USER` и `AMI_SECRET` обязательны.
`IS_DEBUG=true` включает логирование входящих HTTP-запросов. В локальном `.env` также может
присутствовать `ORIGINATE_TIMEOUT_MS`, но текущая версия кода его не использует.

## Запуск

Режим разработки:

```bash
npm run dev
```

Сборка:

```bash
npm run build
```

Запуск собранной версии:

```bash
node dist/index.js
```

На Windows команда сборки дополнительно копирует `.env.production` в `dist/.env`.

## Docker

Для контейнерного запуска подготовьте файлы:

- `docker/.env` с переменными окружения для контейнера
- `docker/c2c.log` для монтирования файла логов

Запуск:

```bash
docker compose up --build
```

`docker-compose.yml` собирает образ `c2c:latest`, запускает контейнер `c2c-container`,
монтирует `docker/.env` в `/app/.env`, монтирует `docker/c2c.log` в `/app/c2c.log` и
пробрасывает порт `4000:4000`. Если в `docker/.env` меняется `PORT`, обновите проброс
портов в `docker-compose.yml`.

## API

### `GET /`

Возвращает простую HTML-страницу с описанием демо-приложения.

### `POST /api/c2c`

Запускает исходящий AMI `Originate`.

Тело запроса:

```json
{
  "user": "+79990000001",
  "client": "+79990000002"
}
```

Пример запроса:

```bash
curl -X POST http://localhost:4000/api/c2c \
  -H "Content-Type: application/json" \
  -d '{"user":"+79990000001","client":"+79990000002"}'
```

Поля:

- `user` - номер сотрудника или внутреннего абонента, который будет указан в `Channel`,
  `CallerID` и переменной `C2C_AGENT`
- `client` - номер клиента, который будет указан в `Exten` и переменной `C2C_CLIENT`

Перед отправкой в AMI номера очищаются от всех символов, кроме цифр и начального `+`.

Успешный ответ:

```json
{
  "payload": {
    "ok": true,
    "user": "+79990000001",
    "client": "+79990000002"
  }
}
```

Ошибка валидации:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Неверные параметры запроса",
  "details": {
    "user": "Неверный номер",
    "client": "Неверный номер"
  }
}
```

## AMI-команда

Сервис формирует `Originate` со следующими основными полями:

- `Channel: sip/<user>@multifon-84957775172`
- `CallerID: "<user>" <<user>>`
- `Context: from-ami`
- `Exten: <client>`
- `Priority: 1`
- `Timeout: 300000`
- `Async: true`
- `Variable: C2C_AGENT=<user>`
- `Variable: C2C_CLIENT=<client>`

Таймаут TCP-сокета AMI в коде задан как `15000` мс.

## Логи

Логи пишутся в консоль и в файл `c2c.log`. В development-режиме файл создается в `src/`,
в остальных режимах - в рабочей директории процесса. В Docker файл монтируется как
`/app/c2c.log`.

## Качество кода

Форматирование, lint и организация импортов:

```bash
npm run biome
```

Автоматические тесты пока не настроены: в `package.json` нет скрипта `test`.
