## 1. Local Database (Docker Compose + PostgreSQL)

- [x] 1.1 Create root `docker-compose.yml` with a `db` service using the official `postgres` image, standard port exposed to the host, a named volume for data, and dev-only env vars for database/user/password; verify `docker compose up -d` starts a reachable PostgreSQL instance (e.g., `pg_isready` or a `psql` connection succeeds)
- [x] 1.2 Verify persistence and reset behavior: confirm data survives `docker compose down` + `docker compose up -d`, and confirm `docker compose down -v` followed by `docker compose up -d` returns the database to an empty/initial state

## 2. Backend Foundation (Spring Boot)

- [x] 2.1 Generate a Gradle-based Spring Boot project under `backend/` (base package `com.shopdemo`) with dependencies `spring-boot-starter-web`, `spring-boot-starter-actuator`, a data-access starter (JPA or JDBC), and the PostgreSQL driver; verify running `./gradlew build` from `backend/` succeeds
- [x] 2.2 Add `application.yml` and `application-local.yml` with local-dev database connection settings pointing at the Docker Compose `db` service; verify the backend starts with the local profile active and logs a successful database connection
- [x] 2.3 Enable the Actuator health endpoint with the database health indicator; verify `GET /actuator/health` returns an up/healthy status for both the application and database components while the database container is running
- [x] 2.4 Verify degraded behavior: stop the database container and confirm `GET /actuator/health` reports the database component as down while the endpoint still responds (no crash or hang)
- [x] 2.5 Add a formatting/lint check (e.g., Spotless or Checkstyle) wired into the Gradle build; verify the check command (e.g., `./gradlew spotlessCheck`, run from `backend/`) runs cleanly against the generated scaffold

## 3. Frontend Foundation (React + TypeScript)

- [x] 3.1 Scaffold a Vite + React + TypeScript project under `frontend/` using Yarn; verify `yarn install` and `yarn build` both succeed
- [x] 3.2 Add TanStack Router with a route tree containing a landing route and at least one additional route; verify navigating between them in the running dev server updates the view and URL without a full page reload, and that opening the second route's URL directly (fresh load) renders it correctly
- [x] 3.3 Add React Hook Form with one example form containing at least one required field with validation; verify submitting with the required field empty shows a validation error and blocks submission, and submitting with valid input succeeds and shows a success state
- [x] 3.4 Add ESLint + Prettier configuration; verify `yarn lint` runs cleanly against the generated scaffold

## 4. Documentation & End-to-End Verification

- [x] 4.1 Write the root `README.md` documenting prerequisites (Docker, JDK version, Node version, Yarn install/version) and step-by-step commands to start the database, backend, and frontend locally, plus how to stop/reset each
- [x] 4.2 Perform an end-to-end local run following only the README: start the database via Docker Compose, start the backend with the local profile, start the frontend dev server; confirm the backend health endpoint reports healthy and the frontend loads in a browser and can navigate between its routes
- [x] 4.3 Verify the fresh-clone experience on a clean checkout (or equivalent clean state) by following only the README steps end-to-end, confirming no undocumented manual steps were needed
