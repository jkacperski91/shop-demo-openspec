## Context

See `proposal.md` - Why for motivation. The repository is currently empty of application code (only OpenSpec planning artifacts exist). This design covers how to lay out and wire together the three foundation pieces confirmed with the user: a Spring Boot backend, a TypeScript/React frontend using TanStack Router and React Hook Form, and a PostgreSQL database running locally via Docker Compose.

## Goals / Non-Goals

**Goals:**
- A monorepo layout that cleanly separates backend, frontend, and local infra so each can be built/run independently.
- A backend and frontend that can both be started with a single documented command once the local database is running.
- A `docker-compose.yml` that any developer can use to get a working PostgreSQL instance with zero manual setup.
- Baseline lint/format tooling on both sides so later feature changes start from a consistent style.

**Non-Goals:**
- No shop business features (catalog, cart, checkout, auth) — covered by `proposal.md` - What Changes.
- No CI/CD pipeline, no production deployment configuration, no cloud hosting setup.
- No authentication/authorization scaffolding (e.g., Spring Security) — deferred to whichever future change introduces user accounts.
- No ORM/entity modeling beyond what's needed for the health check's connectivity probe — real domain entities arrive with the first feature change.

## Decisions

### Monorepo layout: `backend/` and `frontend/` as siblings
Two independent projects (Gradle build, Yarn build) live as sibling directories at the repo root, alongside the existing `openspec/` directory and a root `docker-compose.yml`.
- **Alternative considered**: separate repositories. Rejected for a small demo — a single repo is simpler to clone, run, and keep in sync, and OpenSpec changes here already span both frontend and backend concerns.

```
shop-demo/
├── backend/          # Spring Boot (Gradle)
├── frontend/          # React + TypeScript (Vite)
├── docker-compose.yml # PostgreSQL for local dev
├── openspec/
└── README.md
```

### Backend build tool: Gradle
Gradle over Maven for the Spring Boot project.
- **Rationale**: Gradle's Kotlin/Groovy DSL is more concise than Maven's XML, incremental builds and the build cache keep local iteration fast, and it's the team's preferred build tool for this project.
- **Alternative considered**: Maven — more ubiquitous default for Spring Boot demos (start.spring.io defaults to it) and simpler declarative XML with no DSL to learn, but slower incremental builds and more verbose configuration. Not chosen since Gradle is the preferred tool here.

### Backend package structure and dependencies
- Base package: `com.shopdemo` (placeholder root package; can be renamed later without spec impact since it's an implementation detail).
- Starter dependencies: `spring-boot-starter-web`, `spring-boot-starter-actuator` (for the health endpoint), `spring-boot-starter-data-jpa` (or `spring-boot-starter-jdbc` if JPA is judged heavier than needed — implementer's call, no spec impact either way), and the PostgreSQL JDBC driver.
- Health endpoint: use Spring Boot Actuator's `/actuator/health` with the `db` health indicator enabled (comes for free once a `DataSource` is configured), rather than hand-rolling a custom endpoint. This satisfies the `backend-foundation` spec's health-check requirement without extra code to maintain.
- Configuration: Spring profiles (`application.yml` + `application-local.yml`) to separate local-dev database settings from other environments, satisfying the spec's "environment-specific configuration" requirement.

### Frontend build tool and package manager: Vite + Yarn
- **Vite** for the dev server/build — fast dev loop, minimal config, standard pairing with a React + TanStack Router SPA.
- **Yarn** as package manager — deterministic lockfile (`yarn.lock`) and, if the frontend later grows into multiple packages, built-in workspace support. Requires a one-time install (e.g., via Corepack) since it doesn't ship with Node by default.
- **Alternative considered**: npm — ships with Node with no separate install step, but not chosen in favor of Yarn's lockfile/workspace benefits above. Can be swapped later without spec impact.
- **TanStack Router**: file-based or code-based route tree with at least two routes (landing + one more) to satisfy the `frontend-foundation` routing requirement. Code-based route definitions are simplest to start with and can migrate to file-based routing later if the route count grows.
- **React Hook Form**: one example form (implementer's choice of subject, e.g., a "contact" or "newsletter signup" stub) wired with basic required-field validation, satisfying the form-handling requirement without depending on any specific validation resolver library (e.g., Zod) — that choice is deferred to whichever feature change needs richer validation.

### Local database: Docker Compose running PostgreSQL
- `docker-compose.yml` at the repo root defines a single `db` service using the official `postgres` image, exposing the standard PostgreSQL port to the host, with a named volume for data persistence (satisfies the "data persistence across restarts" requirement — `docker compose down -v` serves as the explicit reset action).
- Database name/user/password are fixed development-only defaults via environment variables in the compose file (documented in the README), not intended for anything beyond local dev.
- The backend's local profile (`application-local.yml`) points at this compose service's host/port/credentials.

### Dev tooling
- Backend: Spotless (or Checkstyle) with a standard Java style, wired to run via Gradle.
- Frontend: ESLint + Prettier with a standard TypeScript/React config.
- Root `README.md` documents: prerequisites, how to start the database, how to start the backend, how to start the frontend, and how to verify the health endpoint.

## Risks / Trade-offs

- **[Risk]** Fixed local-only DB credentials in `docker-compose.yml` could be mistaken for production-ready secrets. → **Mitigation**: clearly comment the compose file and README as "local development only," never reused in any deployed environment.
- **[Risk]** Choosing JPA vs plain JDBC affects how much boilerplate later feature changes inherit. → **Mitigation**: left as an implementer decision in `tasks.md` since it doesn't change any spec-level behavior; can be revisited when the first real entity is modeled.
- **[Risk]** No CI wired up yet means lint/test tooling could silently rot. → **Mitigation**: out of scope per Non-Goals; flagged here so a follow-up change can add CI once the foundation is in place.

## Migration Plan

Not applicable — this is a new, empty repository. Running the projects for the first time is "day one" setup, documented in the README, not a migration from a prior state.
