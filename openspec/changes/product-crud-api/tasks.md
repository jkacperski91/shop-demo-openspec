## 1. Dependencies

- [x] 1.1 Add Flyway (`org.flywaydb:flyway-core`, `org.flywaydb:flyway-database-postgresql`),
      `spring-boot-starter-validation`, `org.springdoc:springdoc-openapi-starter-webmvc-ui`,
      and Testcontainers (`org.testcontainers:junit-jupiter`,
      `org.testcontainers:postgresql`, as `testImplementation`) to `backend/build.gradle`,
      and verify `./gradlew build` resolves all dependencies without errors.

## 2. Schema Migration

- [x] 2.1 Add `backend/src/main/resources/db/migration/V1__create_products_table.sql`
      creating the `products` table (id, name, description, price, stock_quantity,
      created_at, updated_at), and verify the backend starts cleanly against the local
      Postgres instance (`docker compose up -d`, then `./gradlew bootRun`) with Flyway
      applying the migration and no errors in the startup log.

## 3. Domain & Persistence Layer

- [x] 3.1 Add the `Product` JPA entity (`com.shopdemo.product`) mapped to the `products`
      table from task 2.1.
- [x] 3.2 Add `ProductRepository` (Spring Data JPA) and verify with a Testcontainers-backed
      repository test that save, find-by-id, find-all, and delete work correctly against a
      real Postgres instance running the migration from task 2.1.

## 4. API Layer

- [x] 4.1 Add `ProductRequest` (used for create and update) and `ProductResponse` DTOs, with
      Bean Validation annotations (`@NotBlank` on name, `@PositiveOrZero` on price and stock
      quantity).
- [x] 4.2 Add `ProductService` implementing create, list, get-by-id, update, and delete,
      raising a not-found error for an unknown id on get-by-id, update, and delete.
- [x] 4.3 Add `ProductController` exposing `POST /api/products`, `GET /api/products`,
      `GET /api/products/{id}`, `PUT /api/products/{id}`, and `DELETE /api/products/{id}`,
      validating request bodies with `@Valid`, and returning 201 on create, 200 on
      get/list/update, and 204 on delete.
- [x] 4.4 Add a not-found exception handler that produces an RFC 7807 `ProblemDetail` 404
      response, and verify (via test) that a validation failure on create/update also
      produces a `ProblemDetail` 400 response using Spring's default handling.

## 5. API Documentation

- [x] 5.1 Verify springdoc-openapi generates OpenAPI documentation for the product endpoints
      and that Swagger UI is reachable and lists all five endpoints with their request and
      response shapes.

## 6. Verification

- [x] 6.1 Add Testcontainers-backed integration tests covering every scenario in
      `specs/product-catalog/spec.md` (create success and invalid data, list when empty and
      non-empty, get-by-id found and not-found, update success/not-found/invalid, delete
      success and not-found) and verify they pass via `./gradlew build`.
- [x] 6.2 Run `./gradlew spotlessApply` followed by `./gradlew build` and verify both
      succeed with no formatting violations or test failures.
