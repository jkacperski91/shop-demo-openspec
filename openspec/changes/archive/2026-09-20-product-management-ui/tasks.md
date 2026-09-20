## 1. Dependencies and tooling

- [x] 1.1 Add `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `@tanstack/react-query`, `openapi-fetch`, `openapi-react-query`, `zod`, `@hookform/resolvers` to `frontend/package.json` dependencies, and `openapi-typescript` to devDependencies; verify `yarn install` completes cleanly.
- [x] 1.2 Add a `generate:api` script to `frontend/package.json` that runs `openapi-typescript` against `http://localhost:8080/v3/api-docs` and writes `frontend/src/api/schema.d.ts`; verify running it against a locally running backend (`./gradlew bootRun` in `backend/`) produces a valid TypeScript file with no errors.
- [x] 1.3 Commit the generated `frontend/src/api/schema.d.ts` and verify `yarn install && yarn build` succeeds in a checkout with the backend not running.
- [x] 1.4 Add a `server.proxy` entry to `frontend/vite.config.ts` forwarding `/api` and `/v3/api-docs` to `http://localhost:8080`; verify `yarn dev` starts without errors.

## 2. Typed API client

- [x] 2.1 Create `frontend/src/api/client.ts` exporting an `openapi-fetch` client built with `baseUrl: '/api'` and the generated `paths` type, wrapped with `openapi-react-query`'s client factory to produce a typed `$api` object; verify it compiles against `schema.d.ts` with no TypeScript errors.
- [x] 2.2 Wrap the app in a `QueryClientProvider` (new `QueryClient` instance) in `frontend/src/main.tsx`; verify the app still renders with no console errors.

## 3. Admin app shell

- [x] 3.1 Replace `RootLayout` in `frontend/src/routes/root-route.tsx` with an MUI `AppBar` containing a menu `IconButton`, and a `Drawer` (toggled by local state) containing a single "Products" navigation item linking to `/products`, with `<Outlet/>` rendering below/beside it; verify clicking the menu icon opens and closes the drawer.
- [x] 3.2 Verify selecting "Products" in the drawer navigates to `/products` without a full page reload.

## 4. Routing cleanup and product routes

- [x] 4.1 Delete `frontend/src/routes/newsletter-route.tsx` and remove its registration from `frontend/src/router.tsx`.
- [x] 4.2 Replace `frontend/src/routes/index-route.tsx` with a root (`/`) route that redirects to `/products`; verify opening `/` in the browser lands on the product listing view.
- [x] 4.3 Add a `/products` route (`frontend/src/routes/products-route.tsx`) and register it in `frontend/src/router.tsx`; verify direct navigation to `/products` renders the route.
- [x] 4.4 Add `/products/new` and `/products/$id/edit` routes and register them in `frontend/src/router.tsx`; verify direct navigation to each renders without errors.

## 5. Product listing

- [x] 5.1 Implement the products list view using `$api.useQuery` against `GET /api/products`, rendering an MUI `Table` with columns for name, price, and stock quantity; verify it lists every product returned by the backend when products exist.
- [x] 5.2 Verify the table renders with no rows (and no error) when the backend returns an empty product list.
- [x] 5.3 Add an "Add new product" button above the table that navigates to `/products/new`; verify the navigation.
- [x] 5.4 Add Edit and Delete action controls to each table row; verify Edit navigates to `/products/$id/edit` for that row's product id.

## 6. Product form

- [x] 6.1 Define a Zod schema (`productFormSchema`) requiring a non-empty `name` and non-negative numeric `price` and `stockQuantity`, matching the backend's validation rules; verify it rejects an empty name and negative numbers, and accepts valid input, via a quick unit test or manual check.
- [x] 6.2 Build a shared `ProductForm` component using `react-hook-form` (via `@hookform/resolvers/zod` and the schema from 6.1) with MUI `TextField` fields for name, description, price, and stock quantity, accepting an optional initial product for edit mode; verify invalid submissions show field-level errors and do not call the mutation.
- [x] 6.3 Wire `ProductForm`'s submit handler in create mode (`/products/new`) to `$api.useMutation` for `POST /api/products`, invalidating the products list query on success and navigating back to `/products`; verify a valid submission creates a product visible in the list.
- [x] 6.4 Wire `ProductForm`'s submit handler in edit mode (`/products/$id/edit`) to fetch the existing product (`GET /api/products/{id}`) to pre-fill the form, and to `$api.useMutation` for `PUT /api/products/{id}` on submit, invalidating the products list query on success and navigating back to `/products`; verify the form pre-fills with the product's current data and a valid submission updates it.
- [x] 6.5 Display backend-rejected submissions (mutation error) in an MUI `Alert` above the form fields without navigating away, for both create and edit; verify by submitting data the client considers valid but simulating/observing a backend rejection.

## 7. Product deletion

- [x] 7.1 Add an MUI `Dialog` confirming deletion when the Delete action is selected for a row; verify canceling the dialog leaves the product list unchanged.
- [x] 7.2 Wire dialog confirmation to `$api.useMutation` for `DELETE /api/products/{id}`, invalidating the products list query on success; verify confirming deletion removes the product from the table.

## 8. Verification

- [x] 8.1 Run `yarn lint` and `yarn format` in `frontend/` and fix any violations; verify both commands pass cleanly.
- [x] 8.2 Run `yarn build` in `frontend/`; verify it completes with no TypeScript errors.
- [x] 8.3 With the backend running (`docker compose up -d` at repo root, then `./gradlew bootRun` in `backend/`) and the frontend dev server running (`yarn dev` in `frontend/`), manually walk through: drawer navigation to Products, listing, creating a product, editing it, and deleting it; verify each step matches its scenario in `specs/product-management-ui/spec.md`.
