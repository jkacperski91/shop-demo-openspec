# Shop Demo — Agent Context

## Project

A monorepo e-commerce demo application in early development. No shop business features
(catalog, cart, checkout, authentication) exist yet — only the technology foundation is in place.
New features are planned and built through the OpenSpec spec-driven workflow described below.

```
shop-demo/
├── backend/           # Spring Boot (Java 21, Gradle) — base package com.shopdemo
├── frontend/          # React 19 + TypeScript (Vite, TanStack Router, React Hook Form)
├── docker-compose.yml # PostgreSQL for local development (port 5433)
├── openspec/          # Spec-driven planning artifacts
└── README.md          # Prerequisites and how to run the stack locally
```

No CI/CD pipeline exists yet. No production deployment configuration.

---

## OpenSpec Workflow

All feature work follows a spec-driven cycle. Understand this before touching any code.

```
openspec/
├── config.yaml        # Artifact rules and project context for spec generation
├── specs/             # Ground-truth capability specs (synced from completed changes)
│   ├── backend-foundation/spec.md
│   ├── frontend-foundation/spec.md
│   └── local-database/spec.md
└── changes/
    ├── <active-change>/   # Current work in progress (if any)
    │   ├── .openspec.yaml
    │   ├── proposal.md    # Why and what changes
    │   ├── design.md      # Architecture decisions and trade-offs
    │   ├── tasks.md       # Checkbox implementation tasks
    │   └── specs/         # Delta specs for this change
    └── archive/           # Completed changes
```

**Lifecycle of a change:**
1. `proposal.md` — defines motivation and scope
2. `design.md` — records architecture decisions and non-goals
3. `specs/` (delta) — specifies new or modified capabilities
4. `tasks.md` — concrete implementation checklist
5. After implementation: delta specs are synced to `openspec/specs/` and the change is archived

**Rules:**
- Do not implement features that are not covered by a task in an active change.
- Check `openspec/changes/` for an active (non-archived) change before starting any implementation work.
- `openspec/specs/` reflects what is currently built. `changes/<active>/specs/` reflects what is being built now.

---

## Key Commands

| What | Where | Command |
|------|-------|---------|
| Start database | repo root | `docker compose up -d` |
| Stop database | repo root | `docker compose stop` |
| Reset database | repo root | `docker compose down -v` |
| Run backend | `backend/` | `./gradlew bootRun` |
| Build + test backend | `backend/` | `./gradlew build` |
| Fix backend formatting | `backend/` | `./gradlew spotlessApply` |
| Check backend formatting | `backend/` | `./gradlew spotlessCheck` |
| Install frontend deps | `frontend/` | `yarn install` |
| Run frontend dev server | `frontend/` | `yarn dev` |
| Build frontend | `frontend/` | `yarn build` |
| Fix frontend formatting | `frontend/` | `yarn format` |
| Lint frontend | `frontend/` | `yarn lint` |

Backend runs on `http://localhost:8080`. Health check: `GET /actuator/health`.  
Frontend dev server runs on `http://localhost:5173`.  
Database: `localhost:5433`, credentials `shopdemo/shopdemo/shopdemo` (local dev only).

---

## Conventions

- **Backend formatting**: enforced by Spotless — run `./gradlew spotlessApply` before committing. `./gradlew build` will fail on formatting violations.
- **Frontend formatting**: enforced by Prettier — run `yarn format` before committing. `yarn lint` checks both ESLint and Prettier.
- **Spring profiles**: `local` profile is active by default for local development (`application-local.yml`). Do not hardcode environment-specific values in `application.yml`.
- **No feature work without a spec**: implementation tasks must trace back to `tasks.md` in an active change. If no active change exists, surface that to the user before writing code.
- **No CI**: there is no automated pipeline — run build and lint commands manually before considering work done.
