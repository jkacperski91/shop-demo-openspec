## Why

No shop business features exist yet — only the technology foundation. The first catalog
capability needed is a way to create and manage products, since every other shop feature
(cart, checkout, browsing) depends on products existing. The backend already has the web,
JPA, and Postgres dependencies wired up, but no entities, schema-creation mechanism, or
endpoints exist yet.

## What Changes

- Add a `Product` JPA entity and a Flyway migration that creates the `products` table
  (Flyway is a new dependency, via `spring-boot-starter-flyway`; `spring.jpa.hibernate.ddl-auto`
  stays `none` as already configured, and the migration becomes the source of truth for the
  schema).
- Add a REST API for full CRUD on products:
  - `POST /api/products` — create a product
  - `GET /api/products` — list all products
  - `GET /api/products/{id}` — get a single product
  - `PUT /api/products/{id}` — replace a product
  - `DELETE /api/products/{id}` — delete a product
- Add request validation (`spring-boot-starter-validation` is a new dependency) for product
  creation/update: name required, price and stock quantity non-negative.
- Add OpenAPI documentation via springdoc-openapi (new dependency), exposing a Swagger UI
  for the new endpoints.

## Capabilities

### New Capabilities
- `product-catalog`: create, retrieve (single and list), update, and delete products through
  a REST API backed by a persisted `products` table.

### Modified Capabilities
<!-- none: this change does not alter the behavior described in backend-foundation,
     frontend-foundation, or local-database -->

## Impact

- **Backend code**: new `Product` entity, `ProductRepository`, `ProductService`,
  `ProductController`, request/response DTOs, and a validation/error-handling setup for
  the new endpoints.
- **Database**: new `products` table, introduced via a new Flyway migration
  (`src/main/resources/db/migration/`).
- **Dependencies** (`backend/build.gradle`): adds Flyway (`spring-boot-starter-flyway` +
  `flyway-database-postgresql`), `spring-boot-starter-validation`, springdoc-openapi
  (`org.springdoc:springdoc-openapi-starter-webmvc-ui`), and, for tests, `spring-boot-testcontainers`
  with `testcontainers-junit-jupiter` and `testcontainers-postgresql`.
- **API surface**: new `/api/products` REST resource; new `/swagger-ui.html` and
  `/v3/api-docs` documentation endpoints.
- **No frontend or infrastructure changes** — this change is backend-only.
