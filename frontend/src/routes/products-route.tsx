import { createRoute, useNavigate } from '@tanstack/react-router'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { rootRoute } from './root-route'
import { $api } from '../api/client'
import { ProductCard } from '../components/ProductCard'
import { ProductCategoryFilter } from '../components/ProductCategoryFilter'
import { ProductSortSelect } from '../components/ProductSortSelect'
import { ProductPagination } from '../components/ProductPagination'

export const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
})

function ProductsPage() {
  const navigate = useNavigate()
  const productsQuery = $api.useQuery('get', '/api/products')
  const products = productsQuery.data ?? []

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1.5 }}>
          <Typography variant="h4" component="h1">
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} items
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => navigate({ to: '/products/new' })}>
          Add new product
        </Button>
      </Stack>

      {productsQuery.isError && <Alert severity="error">Failed to load products.</Alert>}

      {!productsQuery.isError && (
        <>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              mb: 3.5,
              flexWrap: 'wrap',
            }}
          >
            <ProductCategoryFilter />
            <ProductSortSelect />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 2.5,
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} name={product.name ?? ''} price={product.price ?? 0} />
            ))}
          </Box>

          <ProductPagination />
        </>
      )}
    </Box>
  )
}
