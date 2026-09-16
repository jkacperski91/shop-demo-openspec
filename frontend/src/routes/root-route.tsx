import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

/**
 * The root layout route. Renders shared chrome (nav) and an <Outlet/> for
 * whichever child route is currently active.
 */
export const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'active' }}>
          Home
        </Link>
        <Link to="/newsletter-signup" activeProps={{ className: 'active' }}>
          Newsletter Signup
        </Link>
      </nav>
      <Outlet />
    </>
  )
}
