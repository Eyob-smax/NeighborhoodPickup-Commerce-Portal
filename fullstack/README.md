# NeighborhoodPickup Commerce Portal

## Stack

- Frontend: Vue 3 + Vite
- Backend: Express + TypeScript
- Database: MySQL 8
- Test runner: Vitest (backend and frontend)

## Runtime Policy

The project supports both local workspace execution and Docker Compose.

- Use local npm scripts for fast development and test runs.
- Use Docker Compose for integrated environment startup and parity checks.

## One-Command Startup (Docker Compose)

From `root` run:

```bash
docker compose -f fullstack/docker-compose.yml -p neighborhoodpickup up --build -d
```

This single command starts:

- `db` (MySQL)
- `backend` (Express API on port 4000)
- `frontend` (Nginx serving built Vue app on host port 8081 by default)

The backend startup is containerized end-to-end and automatically runs migrations and seed data before starting the server.

## Local Workspace Startup (No Docker)

From `fullstack/` run backend and frontend in separate terminals:

```bash
npm -w backend run dev
```

```bash
npm -w frontend run dev
```

Local addresses:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- API Docs (Swagger UI): http://localhost:4000/docs
- OpenAPI JSON: http://localhost:4000/openapi.json

## Service Addresses

- Frontend: http://localhost:8081
- Backend API: http://localhost:4000
- Backend health endpoint: http://localhost:4000/health
- MySQL: internal Docker network only (`db:3306`)

To use a different host port for frontend (for example `8080`), set `FRONTEND_HOST_PORT`:

```bash
FRONTEND_HOST_PORT=8080 docker compose -f docker-compose.yml -p neighborhoodpickup up --build -d
```

## Sequential Test Command (After App Is Running)

After `docker compose up` is already running, execute:

```bash
docker compose -f docker-compose.yml -p neighborhoodpickup run --rm tests
```

The `tests` service runs Vitest sequentially in this exact order:

1. backend tests
2. frontend tests

Equivalent npm helpers:

```bash
npm start
npm test
```

## Local Test Command (No Docker)

From `fullstack/` run:

```bash
npm -w backend test
npm -w frontend test
```

## Stop and Cleanup

```bash
docker compose -f docker-compose.yml -p neighborhoodpickup down -v --remove-orphans
```

or

```bash
npm run docker:down
```

If `db` fails to start after a MySQL config/image change, reset volumes once:

```bash
docker compose -f docker-compose.yml -p neighborhoodpickup down -v --remove-orphans
docker compose -f docker-compose.yml -p neighborhoodpickup up --build -d
```

## Verification Steps

1. Run `docker compose -f docker-compose.yml -p neighborhoodpickup up --build -d`.
2. Confirm containers are healthy with `docker compose -f docker-compose.yml -p neighborhoodpickup ps`.
3. Open http://localhost:8081 and verify the UI loads.
4. Call http://localhost:4000/health and verify `{ "ok": true }`.
5. Open http://localhost:4000/docs and verify Swagger UI renders.
6. Run `docker compose -f docker-compose.yml -p neighborhoodpickup run --rm tests` and confirm both backend and frontend Vitest suites pass.

## Seed Accounts

- `member1` / `Member#Pass123`
- `leader1` / `Leader#Pass123`
- `reviewer1` / `Reviewer#Pass123`
- `finance1` / `Finance#Pass123`
- `admin1` / `Admin#Pass12345`
