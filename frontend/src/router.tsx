import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/root-route'
import { indexRoute } from './routes/index-route'
import { productsRoute } from './routes/products-route'
import { productNewRoute } from './routes/product-new-route'
import { productEditRoute } from './routes/product-edit-route'

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productNewRoute,
  productEditRoute,
])

export const router = createRouter({ routeTree })

// Register the router instance for full type safety across the app.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
