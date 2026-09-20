import { useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Typography } from '@mui/material'
import { rootRoute } from './root-route'
import { ProductForm } from '../components/ProductForm'
import { $api } from '../api/client'
import { extractErrorMessage } from '../api/errors'
import type { ProductFormValues } from '../schemas/product'

export const productNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/new',
  component: ProductNewPage,
})

function ProductNewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const createMutation = $api.useMutation('post', '/api/products', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/products'] })
      navigate({ to: '/products' })
    },
    onError: (error) => {
      setSubmitError(extractErrorMessage(error, 'Failed to create product.'))
    },
  })

  const handleSubmit = (values: ProductFormValues) => {
    setSubmitError(null)
    createMutation.mutate({ body: values })
  }

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Add new product
      </Typography>
      <ProductForm submitLabel="Create" submitError={submitError} onSubmit={handleSubmit} />
    </>
  )
}
