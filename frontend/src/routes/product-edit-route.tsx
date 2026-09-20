import { useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, CircularProgress, Typography } from '@mui/material'
import { rootRoute } from './root-route'
import { ProductForm } from '../components/ProductForm'
import { $api } from '../api/client'
import { extractErrorMessage } from '../api/errors'
import type { ProductFormValues } from '../schemas/product'

export const productEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$id/edit',
  component: ProductEditPage,
})

function ProductEditPage() {
  const { id } = productEditRoute.useParams()
  const productId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const productQuery = $api.useQuery('get', '/api/products/{id}', {
    params: { path: { id: productId } },
  })

  const updateMutation = $api.useMutation('put', '/api/products/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/products'] })
      navigate({ to: '/products' })
    },
    onError: (error) => {
      setSubmitError(extractErrorMessage(error, 'Failed to update product.'))
    },
  })

  const handleSubmit = (values: ProductFormValues) => {
    setSubmitError(null)
    updateMutation.mutate({ params: { path: { id: productId } }, body: values })
  }

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Edit product
      </Typography>

      {productQuery.isLoading && <CircularProgress />}
      {productQuery.isError && <Alert severity="error">Failed to load product.</Alert>}

      {productQuery.data && (
        <ProductForm
          initialValues={{
            name: productQuery.data.name ?? '',
            description: productQuery.data.description ?? '',
            price: productQuery.data.price ?? 0,
            stockQuantity: productQuery.data.stockQuantity ?? 0,
          }}
          submitLabel="Save"
          submitError={submitError}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}
