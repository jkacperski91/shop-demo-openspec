## Context

The frontend has no `ThemeProvider` today (`main.tsx` only renders `CssBaseline` + `RouterProvider`), so MUI's default theme applies everywhere. `root-route.tsx` already has the app-bar + burger + temporary-drawer shape the mockup uses, and `products-route.tsx` renders products as a `Table`. The `Product` model (`name`, `description`, `price`, `stockQuantity`) has no `category` or image field. There are no frontend tests to migrate. See `proposal.md` for the source mockup and motivation.

## Goals / Non-Goals

**Goals:**
- One MUI theme module producing light and dark M3-style palettes from a single accent color, switchable at runtime.
- Visual parity with the mockup's shell, product grid, and cart drawer.
- Reusable components for the grid/cart pieces, not one large route file.

**Non-Goals:**
- Any real filtering, sorting, pagination, cart persistence, or checkout logic (see proposal's Capabilities section for what's explicitly decorative/inert).
- Reintroducing edit/delete entry points on the new card layout (tracked as a future change per the removed requirements in the `product-management-ui` delta).
- A real `category` field or product images — the backend model is unchanged.

## Decisions

**Theme token mapping.** MUI's `PaletteOptions` doesn't have M3 keys, so `createTheme`'s palette is extended via TypeScript module augmentation (`declare module '@mui/material/styles'`) adding `surface`, `surfaceVariant`, `outline`, `outlineVariant`, `primaryContainer`/`onPrimaryContainer` as a nested custom palette group. `primary.main`/`primary.contrastText` map to the mockup's `primary`/`onPrimary`; `background.default`/`background.paper` map to `bg`/`surface`. The mockup's `mix(hexA, hexB, t)` helper is ported as-is to derive `primary`/`primaryContainer` shades per mode from one accent constant (`#6750A4`). Two static palette objects (light/dark) are built once at module load, not recomputed per render — the mockup recomputes per render because it's a live prop-editable preview; this app's accent is a fixed constant, so a per-render `mix()` call would be pure waste.

**Theme mode state.** A small `ThemeModeProvider` (React context + `useState<'light' | 'dark'>`) wraps `RouterProvider` in `main.tsx`, exposing the current mode and a toggle function; `createTheme(mode === 'dark' ? darkPalette : lightPalette, ...)` is memoized on `mode`. No persistence (e.g. `localStorage`) — out of scope, not requested, and reset-on-reload is acceptable for a decorative toggle. The toggle control itself lives in the app bar in `root-route.tsx`, consuming the context.

**Font loading.** A `<link>` to Google Fonts Roboto (400/500/600/700) is added to `index.html`, matching the mockup's own approach, rather than adding an `@fontsource/roboto` dependency — no new package needed, and the project already has no offline-build requirement that would favor a bundled font.

**Card data gaps (category, image, add-to-cart).** Per the resolved scope: the category slot renders a fixed placeholder string (not per-product data), the image slot renders a static placeholder box (no image field exists), and the "Add to cart" button has no `onClick` side effect — these are presentational-only props on `ProductCard`, not fetched or computed data.

**Price formatting.** Existing `product.price` (already a number, previously rendered raw by the table) is formatted with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`. This is a display-only change; the form's numeric input and the API payload are untouched.

**Decorative controls (filter/sort/pagination).** `ProductCategoryFilter`, `ProductSortSelect`, and `ProductPagination` hold their own local `useState` for the selected chip/sort value/page purely so they look interactive (selected chip highlights, select shows the chosen option) without touching `productsQuery.data` or re-deriving the rendered list. This satisfies the "selecting a control has no effect on displayed products" requirement while still letting the controls visually respond to interaction, matching the mockup's own behavior more closely than fully static markup would.

**Cart state.** `CartDrawer` (or a small cart context, if the app-bar badge and the drawer both need the same state — likely a `CartProvider` alongside `ThemeModeProvider`) owns a `useState` seeded with the mockup's two demo line items. Quantity +/- mutate that local state; subtotal is derived, not stored. No `localStorage`, no API calls. The "Checkout" button renders with no `onClick`.

**Products route rewrite.** The `Table`/`TableContainer` block, the delete-confirmation `Dialog`, and the `deleteMutation`/`productPendingDelete` state in `products-route.tsx` are deleted rather than left unreferenced, per the removed requirements in the `product-management-ui` delta — dead code for a feature explicitly deferred to a later change. The `useNavigate`/`Add new product` button and the `$api.useQuery('get', '/api/products')` call are kept.

**Placeholder nav items.** `Orders`/`Customers`/`Settings` are added to `root-route.tsx`'s `List` as plain `ListItemButton`s with no `component={Link}` and no `onClick` (unlike the real `Products` item) — visually identical list items, structurally inert.

## Risks / Trade-offs

- **Spec regression is intentional, not accidental** → already captured as REMOVED requirements (with Reason/Migration) in the `product-management-ui` delta, so `openspec validate` and future readers see it as a deliberate, tracked gap rather than a silent break.
- **Decorative controls could be mistaken for broken features** by a future contributor → each one's requirement scenario in `specs/product-management-ui/spec.md` and `specs/shopping-cart-ui/spec.md` explicitly says "no effect," and code comments are unnecessary noise here since the spec is the source of truth.
- **Module augmentation for custom palette keys is global** (affects the `Theme`/`PaletteOptions` types everywhere) → acceptable, it's additive and the project has one theme.
