import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root-route'

/**
 * Landing route ("/"). Satisfies the frontend-foundation spec's
 * "application loads and renders a landing view" requirement.
 */
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

function IndexPage() {
  return (
    <section>
      <h1>Shop Demo</h1>
      <p>
        This is the foundation shell for the shop demo application - no shop features yet, just the
        technology stack wired together.
      </p>
    </section>
  )
}
