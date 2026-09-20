## Why

The frontend currently renders with MUI's default theme (default blue palette, default 4px radii, no loaded webfont) and a plain data-table product listing. A Claude Design mockup (`Shop.dc.html`, a Material Design 3 style admin/storefront concept) defines a specific visual language — a purple accent, M3 surface/container color tokens, larger corner radii, an actual Roboto webfont, a light/dark theme toggle, a card-based product grid, and a cart drawer — that we want the real app to adopt visually now, ahead of building the functionality (real filtering, sorting, pagination, cart, checkout) those elements imply.

## What Changes

- Add a light/dark MUI theme built from Material Design 3-style tokens (`primary`/`onPrimary`, `surface`/`surfaceVariant`, `outline`/`outlineVariant`, `primaryContainer`/`onPrimaryContainer`), with a real toggle in the app bar that switches `palette.mode` app-wide.
- Load Roboto as an actual webfont (400/500/600/700) instead of relying on system font fallback.
- Restyle the app bar and navigation drawer to the new palette/radius, and add `Orders`, `Customers`, and `Settings` as visual-only placeholder items in the drawer alongside the existing `Products` item (no routes, not interactive).
- **BREAKING**: Replace the Products page's data table with a card-grid layout (one `ProductCard` per product: placeholder image, static category placeholder text, name, price formatted as currency, and an inert "Add to cart"-styled button with no click behavior), plus a decorative category filter chip row, a decorative sort dropdown, and a decorative pagination control — none of which affect the displayed products. Removes the previously required per-row Edit and Delete actions and the delete-confirmation dialog from the product listing view; these have no UI entry point until a future change reintroduces them.
- Add a shopping cart drawer (`CartDrawer`), opened via a new cart icon in the app bar: shows a locally-seeded set of cart items (there is no way to add real products to it yet) with a working quantity stepper and computed subtotal, and an inert "Checkout" button.
- New reusable frontend components: `ProductCard`, `ProductCategoryFilter`, `ProductSortSelect`, `ProductPagination`, `CartDrawer`.

## Capabilities

### New Capabilities
- `shop-theme`: The app's light/dark visual theme (palette, typography, shape) and the toggle that switches between them, applied across the whole application.
- `shopping-cart-ui`: The cart drawer — opening/closing via the app bar, a locally-seeded item list with quantity adjustment and subtotal, and an intentionally inert checkout control. No real cart data, persistence, or checkout.

### Modified Capabilities
- `product-management-ui`: Product listing changes from a table to a card grid (per-card placeholder category and inert "Add to cart" control), the navigation drawer gains inert placeholder items, and the Product editing and Product deletion requirements are removed from active scope — the listing view no longer provides Edit or Delete actions (the underlying routes still exist but are unreachable from the UI). Product creation (the "Add new product" action) is unchanged.

## Impact

- **Frontend dependencies**: none added; uses existing MUI/Emotion already in the project. Roboto is loaded via a Google Fonts `<link>` in `index.html`.
- **Frontend code changed**: `src/main.tsx` (wrap app in the new `ThemeProvider` + mode state), `src/routes/root-route.tsx` (theme toggle, cart icon/drawer wiring, placeholder drawer items), `src/routes/products-route.tsx` (table replaced by card grid; delete-confirmation dialog and delete/edit mutation wiring removed), `index.html` (font link).
- **Frontend code added**: a theme module (light/dark MUI theme + palette augmentation), `src/components/ProductCard.tsx`, `src/components/ProductCategoryFilter.tsx`, `src/components/ProductSortSelect.tsx`, `src/components/ProductPagination.tsx`, `src/components/CartDrawer.tsx`.
- **Backend**: no changes; still only consumes the existing `/api/products` endpoints.
- **Specs**: `openspec/specs/product-management-ui/spec.md` gets a delta (Product listing modified, Product editing and Product deletion removed); new `openspec/specs/shop-theme/spec.md` and `openspec/specs/shopping-cart-ui/spec.md` are introduced.
