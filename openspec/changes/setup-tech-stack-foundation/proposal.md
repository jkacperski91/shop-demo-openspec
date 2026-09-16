## Why

The shop demo repository currently contains only OpenSpec planning scaffolding — no application code exists yet. Before any shop features (catalog, cart, checkout, etc.) can be planned or built, the project needs an agreed, working technology foundation: a Spring Boot backend, a TypeScript/React frontend using TanStack Router and React Hook Form, and a PostgreSQL database that runs locally via Docker Compose. Establishing this now gives future feature work a real, runnable stack to build on instead of making stack decisions ad hoc during feature delivery.

## What Changes

- Scaffold a Spring Boot (Java, Gradle) backend project with a base package structure, Spring Boot Actuator, and a health endpoint that reports application status and database connectivity.
- Scaffold a TypeScript + React frontend project (Vite-based) with TanStack Router configured for client-side routing and React Hook Form installed and wired into a minimal example form, plus a minimal landing route.
- Add a `docker-compose.yml` at the repo root that provisions a PostgreSQL container for local development, with backend configuration (via Spring profiles/environment variables) to connect to it.
- Establish baseline dev tooling: linting/formatting for both backend (e.g., Checkstyle or Spotless) and frontend (ESLint + Prettier), and a root-level README documenting how to run the full stack locally.
- No shop business features (product catalog, cart, checkout, authentication) are included in this change — this is infrastructure/foundation only.

## Capabilities

### New Capabilities
- `backend-foundation`: Spring Boot backend service setup — project structure, configuration/profile management, and a health endpoint that verifies both application status and database connectivity.
- `frontend-foundation`: React/TypeScript single-page app setup — build tooling, TanStack Router wired in with a minimal route shell, and React Hook Form wired into a minimal example form.
- `local-database`: Dockerized PostgreSQL for local development, including how the backend connects to it and how data persists (or resets) across container restarts.

### Modified Capabilities
_None — this is a greenfield project with no existing specs._

## Impact

- **New directories/files**: `backend/` (Gradle-based Spring Boot project), `frontend/` (Vite-based React/TypeScript project), root `docker-compose.yml`, root `README.md` (or updates to it).
- **New dependencies**: Spring Boot (Web, Actuator, Data JPA/JDBC, PostgreSQL driver) on the backend; React, TypeScript, Vite, TanStack Router, React Hook Form on the frontend.
- **No existing code affected** — the repository has no application code prior to this change.
- **Assumptions recorded for this change** (minor details, not material to scope): Gradle as the backend build tool, Yarn as the frontend package manager, and a monorepo layout with `backend/` and `frontend/` as sibling top-level directories. These are revisited in `design.md`.
