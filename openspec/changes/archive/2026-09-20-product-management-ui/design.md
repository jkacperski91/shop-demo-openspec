## Context

See proposal.md - Why. The frontend today (`frontend/src/`) is a TanStack Router shell with no UI library, no data-fetching layer, and two placeholder routes (`/`, `/newsletter-signup`) that exist only to prove routing and RHF-based form validation work. The backend already serves full product CRUD at `/api/products` (see `product-catalog` spec) and publishes an OpenAPI document via springdoc at `/v3/api-docs`, with Swagger UI already live. No CORS configuration exists on the backend, and `vite.config.ts` has no dev proxy.

## Goals / Non-Goals

**Goals:**
- Stand up MUI as the component library and an AppBar + Drawer admin shell.
- Build a typed, generated API client so route/query/mutation code never hand-writes request/response shapes.
- Deliver list/create/edit/delete for products end-to-end against the real backend.
- Keep the change frontend-only: no backend code changes.

**Non-Goals:**
- Filtering, sorting, pagination, or search on the product table (explicitly deferred per proposal).
- Authentication/authorization - the "admin" framing is UI-only; the backend has no auth and this change does not add any.
- Dark mode / theming beyond MUI's default theme.
- Production deployment or CORS configuration for a non-localhost origin - out of scope until the project has a real deployment target.

## Decisions

### UI library: MUI v9 (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`)
Current latest per npm as of 2026-09-19 (see conversation sources). Emotion is MUI's default styling engine and needs no extra Vite/Babel config beyond installing the two packages - `@vitejs/plugin-react` already handles JSX runtime correctly for Emotion's `css` prop usage via `@emotion/react`'s JSX pragma only if used; standard `sx` prop usage (used throughout this change) needs no pragma at all.

### App shell structure
`root-route.tsx`'s `RootLayout` is replaced with a component rendering MUI `AppBar` (containing an `IconButton` with a menu icon) + `Drawer` (containing a single `ListItem` "Products" using TanStack Router's `Link`) + `<Outlet/>`. Drawer open/closed is local component state (`useState`), not routed or persisted - reopening after navigation defaults to closed, matching standard admin-shell drawer behavior.

### Routing
- `/` uses a `beforeLoad` redirect (TanStack Router `redirect({ to: '/products' })`) to `/products`. This satisfies frontend-foundation's "renders a landing view at the root URL" without duplicating the Products route's logic at two paths.
- `/products` - list view.
- `/products/new` - create form.
- `/products/$id/edit` - edit form (TanStack Router's `$id` param syntax).
- `newsletter-route.tsx` and its route registration in `router.tsx` are deleted. `index-route.tsx` is replaced by the redirect above (or deleted if the redirect is expressed inline in `router.tsx`/`root-route.tsx` - implementation detail for tasks.md).

### API client: `openapi-typescript` + `openapi-fetch` + `openapi-react-query`
- A new `yarn generate:api` script runs `openapi-typescript` against `http://localhost:8080/v3/api-docs`, writing `frontend/src/api/schema.d.ts`. This file is committed - `yarn install && yarn dev` must work without the backend running (per confirmed decision).
- `frontend/src/api/client.ts` creates one `openapi-fetch` client (`createClient<paths>({ baseUrl: '' })`) and wraps it with `openapi-react-query`'s `createClient` to produce the typed `$api` hook object (`$api.useQuery`, `$api.useMutation`) used by route components. The generated schema's path keys already include the `/api` prefix (it's part of the backend's actual `@RequestMapping`), so `baseUrl` is left empty rather than `/api` to avoid double-prefixing requests.
- A single `QueryClient` + `QueryClientProvider` wraps the app in `main.tsx`.
- Mutations invalidate the products list query on success (`queryClient.invalidateQueries`) so the table reflects create/update/delete without a manual refetch.

### Dev-time backend connectivity: Vite proxy
`vite.config.ts` gets:
```
server: {
  proxy: {
    '/api': 'http://localhost:8080',
    '/v3/api-docs': 'http://localhost:8080',
  },
}
```
Runtime `fetch` calls use relative paths (`/api/products`) and never hit CORS. The `generate:api` script talks to `http://localhost:8080` directly (Node-side, not a browser, so CORS doesn't apply there either) - the proxy entry for `/v3/api-docs` is a convenience for manually inspecting the doc through the dev server, not required by the generation script itself.

### Forms: React Hook Form + MUI fields + Zod
- One `ProductForm` component used by both `/products/new` and `/products/$id/edit`, parameterized by an optional initial product (edit) vs. none (create).
- A single Zod schema (`productFormSchema`) mirrors the backend's validation (`name` non-empty, `price` and `stockQuantity` numeric and `>= 0`) and is wired via `@hookform/resolvers/zod`.
- MUI `TextField` (with `register`/`Controller` as appropriate for numeric fields) renders each field; validation errors surface through MUI's `error`/`helperText` props driven by RHF's `formState.errors`.
- Backend rejections on submit (the "rejected by the backend" scenarios in the spec) are caught from the mutation's error and shown via an MUI `Alert` above the form fields, without clearing user input or navigating away.

### Delete confirmation
An MUI `Dialog` confirms delete before the mutation fires, per the spec's "only after confirming the action" requirement.

## Risks / Trade-offs

- [Generated `schema.d.ts` can drift from the backend if a developer changes the API and forgets to re-run `generate:api`] -> Mitigated by keeping the regen command simple and documented in AGENTS.md/README as part of the standard workflow; drift shows up immediately as TypeScript errors on the next build since the generated types are structurally checked against usage.
- [Vite proxy only covers local dev; nothing in this change addresses a real deployed, cross-origin setup] -> Acceptable per Non-Goals; the project has no deployment target yet, so solving that now would be speculative.
- [No optimistic UI updates - table updates only after mutation success/query invalidation] -> Acceptable for this scope (no filtering/pagination/perf requirements yet); can be revisited if the product list grows large enough to matter.

## Open Questions

None - remaining details (exact MUI component composition, file layout within `src/`) are implementation-level and belong in tasks.md.
