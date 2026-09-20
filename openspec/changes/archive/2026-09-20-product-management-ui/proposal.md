## Why

The backend already exposes a full product CRUD API with OpenAPI documentation, but the frontend is still just a bare technology-foundation shell with placeholder routes. Shop managers need a working admin UI to create, view, edit, and delete products, and the frontend needs a real UI framework, typed API layer, and form stack to build that UI (and future admin features) on.

## What Changes

- Adopt Material UI (MUI) as the frontend's component/UI library.
- Add an admin app shell: a top `AppBar` with a menu icon that opens a left-side `Drawer` containing a "Products" navigation item.
- Add a Products page: a table listing all products, with per-row Edit and Delete actions, and an "Add new product" button.
- Add a Product form (shared between create and edit) built with React Hook Form, MUI form fields, and Zod validation.
- Add a typed API communication layer using TanStack Query + `openapi-react-query` + `openapi-fetch`, with TypeScript types generated from the backend's OpenAPI document via `openapi-typescript`. Generated types are committed to the repo and refreshed by a manual `yarn` script.
- Add a Vite dev-server proxy so the frontend can call the backend's `/api` and `/v3/api-docs` endpoints without CORS configuration on the backend.
- **BREAKING**: Remove the placeholder `/` landing view and `/newsletter-signup` example-form route. `/` now redirects to `/products`, which becomes the application's effective home view. The Products table becomes the "landing view" and the Product form becomes the "example form" for the purposes of the `frontend-foundation` spec.

## Capabilities

### New Capabilities
- `product-management-ui`: Admin navigation shell (app bar + drawer) and the Products page — listing, creating, editing, and deleting products through the backend's product API, built on MUI, TanStack Query, and React Hook Form + Zod.

### Modified Capabilities
- None. `frontend-foundation`'s requirements ("renders a landing view", "navigating between at least two distinct views", "at least one working example form") are already written abstractly and do not name the placeholder routes. They remain true, unmodified, once the Products view/route and product form take over as the landing view, second route, and example form — no requirement text changes.

## Impact

- **Frontend dependencies added**: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `@tanstack/react-query`, `openapi-fetch`, `openapi-react-query`, `openapi-typescript` (dev), `zod`, `@hookform/resolvers`.
- **Frontend code removed**: `src/routes/newsletter-route.tsx`, the placeholder content of `src/routes/index-route.tsx`.
- **Frontend code added/changed**: `src/routes/root-route.tsx` (AppBar + Drawer layout), new `src/routes/products-route.tsx`, `src/routes/product-new-route.tsx`, `src/routes/product-edit-route.tsx`, a shared `ProductForm` component, a generated `src/api/schema.d.ts`, an API client module, `vite.config.ts` (dev proxy).
- **Backend**: no code changes; only consumes the existing `/api/products` endpoints and `/v3/api-docs` document.
- **Specs**: `openspec/specs/frontend-foundation/spec.md` gets a delta; a new `openspec/specs/product-management-ui/spec.md` is introduced.
