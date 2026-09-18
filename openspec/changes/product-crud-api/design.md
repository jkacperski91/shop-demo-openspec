## Context

The backend already depends on `spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`,
and the Postgres driver, but has no entities, repositories, or controllers. It also
deliberately sets `spring.jpa.hibernate.ddl-auto: none` (see `application-local.yml`), so
Hibernate is not allowed to create or update schema — nothing currently creates the schema
at all. There is no migration tool (Flyway/Liquibase) and no bean validation starter in
`build.gradle`. See proposal.md for the motivation.

## Goals / Non-Goals

**Goals:**
- Establish the schema-migration mechanism (Flyway) that all future persisted entities in
  this project will build on, not just products.
- Establish the layered structure (controller / service / repository / entity / DTO) and
  validation + error-response conventions for REST resources in this backend, since none
  exist yet.
- Ship a complete, documented CRUD resource for products.

**Non-Goals:**
- No authentication/authorization on these endpoints (none exists anywhere in the backend
  yet; out of scope for this change).
- No pagination, filtering, or sorting on the list endpoint — full list only, matching what
  was requested.
- No frontend consumption of this API.
- No currency, category, image, or SKU fields on `Product` — deferred until a real
  requirement for them exists.

## Decisions

**Schema management: Flyway, `ddl-auto` stays `none`.**
`ddl-auto: none` was already a deliberate choice (documented inline in
`application-local.yml`) so the health endpoint can distinguish "database unreachable" from
"schema missing," and so the app never silently mutates schema. Flyway migrations
(`src/main/resources/db/migration/V1__create_products_table.sql`) become the single source
of truth for schema, run automatically on startup. Alternative considered: flipping
`ddl-auto` to `update` — rejected because it contradicts the existing configuration intent
and gives no migration history or repeatable path to a fresh environment.
Implementation note: Spring Boot 4 splits Flyway autoconfiguration into its own
`spring-boot-flyway` module, only pulled in via the `spring-boot-starter-flyway` starter —
depending on `org.flywaydb:flyway-core` directly is not sufficient to trigger it.

**Layering: Controller -> Service -> Repository, with DTOs at the controller boundary.**
`ProductController` accepts/returns request/response DTOs (not the JPA entity directly), so
persistence concerns (e.g. JPA annotations) don't leak into the API contract and so the
entity can evolve independently of the wire format. `ProductService` holds the not-found and
validation-adjacent orchestration; `ProductRepository` is a plain Spring Data JPA repository.

**Identifiers: database-generated numeric id (`BIGSERIAL` / `IDENTITY`).**
Simplest option for a demo CRUD resource with no external-facing identifier requirement
(e.g. no need to generate an id client-side or avoid enumeration). Alternative considered:
UUID primary keys — more appropriate if products ever need to be created client-side or
merged across systems, but not a current requirement; can be revisited later since it's an
internal representation change, not a spec-level behavior change.

**Update semantics: `PUT` as full replacement, no `PATCH`.**
Matches the "full CRUD" scope discussed — one update verb, simplest contract. Partial
update (`PATCH`) is not needed yet and can be added later without breaking `PUT`.

**Validation: Bean Validation (`spring-boot-starter-validation`) on request DTOs.**
`@NotBlank` on name, `@PositiveOrZero` on price and stock quantity, enforced via `@Valid` in
the controller. Standard Spring approach, no custom validation framework needed for these
simple constraints.

**Error responses: Spring's built-in `ProblemDetail` (RFC 7807).**
Spring Boot's default exception handling for `@Valid` failures and a custom
`ResponseStatusException`/`@ExceptionHandler` for not-found already produce RFC 7807
`ProblemDetail` responses. Using the framework default avoids inventing a bespoke error
envelope for what is otherwise a standard validation/not-found story.

**API documentation: springdoc-openapi (`springdoc-openapi-starter-webmvc-ui`).**
Generates the OpenAPI spec from the controller/DTOs and serves Swagger UI, as requested.
No hand-maintained OpenAPI YAML — annotations/inference stay in sync with the code.

**Testing: Testcontainers-backed integration tests.**
Tests run against a real, disposable Postgres container (`spring-boot-testcontainers` +
`testcontainers-junit-jupiter` + `testcontainers-postgresql` test dependencies), exercising
the actual Flyway migration and JPA mapping rather than a mock. This matches the project's
existing "real, disposable database" philosophy for local dev (docker-compose Postgres)
instead of introducing a second, divergent persistence story (e.g. H2) purely for tests.
Alternative considered: mocking `ProductRepository` for fast unit-level tests — rejected as
the sole strategy because it would never verify the migration or JPA mapping actually work.
Implementation note: Testcontainers 2.x (pulled in by Spring Boot 4.1.1) renamed its module
artifacts (e.g. `testcontainers-junit-jupiter`, `testcontainers-postgresql` instead of the
1.x `junit-jupiter`/`postgresql`), and the codebase now also carries both Jackson 2
(`com.fasterxml.jackson`, a transitive dependency of other libraries) and Jackson 3
(`tools.jackson`, Spring Boot 4's default JSON stack) — application code and tests use
`tools.jackson.databind.ObjectMapper`.

## Risks / Trade-offs

- **[Risk]** Flyway migration failing on startup (e.g. Postgres unreachable) will now block
  application startup for schema-dependent requests, whereas today the app starts even with
  the DB down. → **Mitigation**: this only affects environments where the schema hasn't been
  created yet; the existing health-check behavior for a DB that goes down *after* a
  successful migration is unaffected, since Flyway only runs at startup.
- **[Risk]** No authentication means these CRUD endpoints are open to any caller who can
  reach the backend. → **Mitigation**: acceptable for this stage of the project (no auth
  exists anywhere yet); flagged as a non-goal rather than silently ignored.
- **[Trade-off]** Full-replace `PUT` requires clients to send the entire product body even
  for a one-field change. → Accepted for now given the confirmed scope; `PATCH` can be added
  later as an additive change.

## Migration Plan

1. Add Flyway and validation/springdoc dependencies to `backend/build.gradle`.
2. Add `V1__create_products_table.sql` under `src/main/resources/db/migration/`, creating
   the `products` table (id, name, description, price, stock_quantity, created_at,
   updated_at).
3. Add the entity, repository, service, controller, and DTOs.
4. No rollback concerns beyond normal development iteration — this is a new table with no
   existing data or consumers; a failed migration can simply be corrected and rerun against
   the disposable local Postgres instance (`docker compose down -v` resets it).

