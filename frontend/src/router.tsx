import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/root-route'
import { indexRoute } from './routes/index-route'
import { newsletterRoute } from './routes/newsletter-route'

const routeTree = rootRoute.addChildren([indexRoute, newsletterRoute])

export const router = createRouter({ routeTree })

// Register the router instance for full type safety across the app.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
