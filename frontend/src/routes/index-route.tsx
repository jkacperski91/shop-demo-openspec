import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './root-route'

/**
 * Root route ("/"). Redirects to the product listing view, which is the
 * application's effective home now that the admin shell is in place.
 */
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/products' })
  },
})
