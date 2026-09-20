## 1. Theme foundation

- [x] 1.1 Create a theme module implementing the mockup's `mix(hexA, hexB, t)` color-blend helper and two static M3-style palette objects (light/dark) derived from the `#6750A4` accent (`bg`/`surface`/`surfaceVariant`/`onSurface`/`onSurfaceVariant`/`outline`/`outlineVariant`/`primary`/`onPrimary`/`primaryContainer`/`onPrimaryContainer`), and verify `yarn build` type-checks with no errors.
- [x] 1.2 Add MUI `PaletteOptions`/`Palette` module augmentation exposing `surface`, `surfaceVariant`, `outline`, `outlineVariant`, `primaryContainer`, `onPrimaryContainer` as custom palette keys, and verify a component can reference `theme.palette.surfaceVariant` etc. without a TypeScript error.
- [x] 1.3 Create a `createAppTheme(mode)` function using `createTheme` with the mapped palette, `shape.borderRadius` raised to match the mockup's card/button radius, and `typography.fontFamily` set to Roboto; verify by rendering the app and visually confirming button/card corner radius differs from MUI's 4px default.
- [x] 1.4 Add a Roboto Google Fonts `<link>` (weights 400/500/600/700) to `frontend/index.html`; verify via browser devtools that rendered text resolves to the Roboto webfont, not a system fallback.

## 2. Theme mode state and toggle

- [x] 2.1 Create a `ThemeModeProvider` (context + `useState<'light' | 'dark'>`, default `'light'`) and wrap `RouterProvider` in `src/main.tsx` with it and MUI's `ThemeProvider`, memoizing `createAppTheme(mode)` on the current mode; verify the app renders with no console errors.
- [x] 2.2 Add a mode-toggle control to the app bar in `src/routes/root-route.tsx` consuming `ThemeModeProvider`; verify selecting it switches the whole app between light and dark and back, matching `specs/shop-theme/spec.md`'s "Theme toggle" scenarios.

## 3. App shell restyle and placeholder navigation

- [x] 3.1 Restyle the `AppBar`, `Drawer`, `List`, and `ListItemButton`s in `root-route.tsx` to the new palette/radius, with the mockup's selected/hover treatment (`primaryContainer`/`onPrimaryContainer` background, rounded item shape); verify visually against `Shop.dc.html`.
- [x] 3.2 Add `Orders`, `Customers`, and `Settings` as `ListItemButton`s in the drawer with no `component={Link}` and no `onClick` handler, styled identically to the real `Products` item; verify selecting them does not navigate or change the current view, matching `specs/product-management-ui/spec.md`'s "Placeholder navigation items" requirement.

## 4. Product card grid

- [x] 4.1 Create `src/components/ProductCard.tsx` (placeholder image slot, static placeholder category text, product name, price formatted via `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`, and an "Add to cart"-styled button with no `onClick`), matching the mockup's card; verify by rendering one card with sample product data and comparing it visually to the mockup.
- [x] 4.2 Create `src/components/ProductCategoryFilter.tsx` (chip row with local `useState` for the selected chip) and `src/components/ProductSortSelect.tsx` (select with local `useState` for the chosen value); verify each visually responds to interaction (chip highlight changes, select shows the chosen option) while never altering the rendered product list.
- [x] 4.3 Create `src/components/ProductPagination.tsx` (prev/page-number/next controls with local `useState` for the displayed page); verify it visually responds to interaction without altering the rendered product list.
- [x] 4.4 Rewrite `src/routes/products-route.tsx`: remove the `Table`/`TableContainer`/`TableHead`/`TableBody` markup, the delete-confirmation `Dialog`, the `deleteMutation`, and the `productPendingDelete` state; keep the header (title, real `{products.length} items` count, unchanged "Add new product" button) and `productsQuery`; render `ProductCategoryFilter`, `ProductSortSelect`, a CSS grid of `ProductCard`s built from `productsQuery.data`, and `ProductPagination`. Verify `yarn build` and `yarn lint` pass, and that `specs/product-management-ui/spec.md`'s "Product listing" scenarios (populated and empty catalog) hold against the dev server.

## 5. Cart drawer

- [x] 5.1 Create a `CartProvider` (context + `useState`, seeded with the mockup's two demo line items: Denim Jacket qty 1 at $118, Aviator Sunglasses qty 2 at $76) exposing the item list, a derived subtotal, and increment/decrement functions; wrap the app with it in `src/main.tsx` alongside `ThemeModeProvider`.
- [x] 5.2 Create `src/components/CartDrawer.tsx` (MUI `Drawer` anchored right: header with a close control, item rows with an image placeholder/name/price/quantity stepper, an empty-cart state, a subtotal footer, and a "Checkout" button with no `onClick`), consuming `CartProvider`; verify the quantity stepper updates the displayed subtotal and selecting Checkout has no observable effect, matching `specs/shopping-cart-ui/spec.md`.
- [x] 5.3 Add a cart icon with a quantity badge to the app bar in `root-route.tsx` that opens/closes `CartDrawer`, badge sourced from `CartProvider`'s total item count; verify open/close and the badge count against `specs/shopping-cart-ui/spec.md`'s "Cart drawer visibility" and "Cart item count indicator" scenarios.

## 6. Final verification

- [x] 6.1 Run `yarn format` and `yarn lint` in `frontend/` and fix any violations.
- [x] 6.2 Run `yarn build` in `frontend/` and confirm it succeeds with no TypeScript errors.
- [x] 6.3 Run `yarn dev` and manually walk through every scenario in `specs/shop-theme/spec.md`, `specs/shopping-cart-ui/spec.md`, and the MODIFIED/ADDED requirements of `specs/product-management-ui/spec.md`, confirming each holds.
