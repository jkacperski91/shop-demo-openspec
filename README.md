# Shop Demo

A small shop demo application. This repository currently contains only the
**technology stack foundation** - no shop features (catalog, cart, checkout)
yet. It exists so future feature work has a real, runnable stack to build on.

## Stack

- **Backend**: Spring Boot (Java, Gradle) - [`backend/`](backend/)
- **Frontend**: React + TypeScript (Vite, TanStack Router, React Hook Form) - [`frontend/`](frontend/)
- **Database**: PostgreSQL, containerized for local development - [`docker-compose.yml`](docker-compose.yml)

## Prerequisites

| Tool   | Version used in development | Notes |
|--------|------------------------------|-------|
| Docker | Docker Desktop with Compose v2 | Needed to run the local database |
| JDK    | 21+ | The Gradle wrapper (`./gradlew`) downloads Gradle itself - no separate Gradle install needed |
| Node.js| 20+ (developed with 24) | Needed to run Corepack/Yarn and the frontend |
| Yarn   | 4.x, via Corepack | See setup below - not required as a separate install |

### Enabling Yarn via Corepack

This project uses Yarn (not npm). Corepack ships with Node.js and reads the
`packageManager` field in [`frontend/package.json`](frontend/package.json) to
use the right Yarn version automatically:

```bash
corepack enable
```

If `corepack enable` fails with a permission error (for example, on Windows
if Node is installed in `Program Files`), install the shims to a directory
you control and already have on your `PATH` instead:

```bash
corepack enable --install-directory "$HOME/bin"
```

## Running the stack locally

### 1. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL container reachable at `localhost:5433` (not the
default 5432, to avoid colliding with any PostgreSQL already installed
natively on your machine). Database/user/password are all `shopdemo` -
fixed, non-secret local-dev defaults only; never reused elsewhere.

To stop it (data persists):

```bash
docker compose stop
```

To fully reset it (drops all local data):

```bash
docker compose down -v
```

### 2. Start the backend

From `backend/`:

```bash
./gradlew bootRun
```

The backend starts on `http://localhost:8080` using the `local` Spring
profile by default (see [`application.yml`](backend/src/main/resources/application.yml)
and [`application-local.yml`](backend/src/main/resources/application-local.yml)),
which points at the database started in step 1.

Verify it's healthy:

```bash
curl http://localhost:8080/actuator/health
```

You should see `"status":"UP"` with a `"db"` component also `"UP"`. If the
database isn't running, the backend still starts, but the health endpoint
reports the `db` component as `"DOWN"` instead.

### 3. Start the frontend

From `frontend/`:

```bash
yarn install
yarn dev
```

The frontend starts on `http://localhost:5173`. It's a plain client-side
app with two routes (a landing page and an example form) - nothing calls
the backend yet.

## Building and checking everything

| Command | Where | What it does |
|---------|-------|---------------|
| `./gradlew build` | `backend/` | Compiles, runs tests, and checks formatting (Spotless) |
| `./gradlew spotlessApply` | `backend/` | Auto-fixes backend formatting |
| `yarn build` | `frontend/` | Type-checks and produces a production build |
| `yarn lint` | `frontend/` | Runs ESLint and checks Prettier formatting |
| `yarn format` | `frontend/` | Auto-fixes frontend formatting |

## Project layout

```
shop-demo/
├── backend/           # Spring Boot (Gradle) API service
├── frontend/           # React + TypeScript (Vite) single-page app
├── docker-compose.yml  # PostgreSQL for local development
└── openspec/           # Spec-driven planning artifacts (proposals, specs, etc.)
```
