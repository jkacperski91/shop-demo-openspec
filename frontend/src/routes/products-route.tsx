import { useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { rootRoute } from './root-route'
import { $api } from '../api/client'
import type { components } from '../api/schema'

type Product = components['schemas']['ProductResponse']

export const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
})

function ProductsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null)

  const productsQuery = $api.useQuery('get', '/api/products')

  const deleteMutation = $api.useMutation('delete', '/api/products/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/products'] })
      setProductPendingDelete(null)
    },
  })

  const products = productsQuery.data ?? []

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button variant="contained" onClick={() => navigate({ to: '/products/new' })}>
          Add new product
        </Button>
      </Stack>

      {productsQuery.isError && <Alert severity="error">Failed to load products.</Alert>}

      {!productsQuery.isError && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock quantity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">{product.stockQuantity}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Edit product"
                      onClick={() =>
                        navigate({ to: '/products/$id/edit', params: { id: String(product.id) } })
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete product"
                      onClick={() => setProductPendingDelete(product)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={productPendingDelete !== null} onClose={() => setProductPendingDelete(null)}>
        <DialogTitle>Delete product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{productPendingDelete?.name}&quot;? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductPendingDelete(null)}>Cancel</Button>
          <Button
            color="error"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (productPendingDelete?.id != null) {
                deleteMutation.mutate({ params: { path: { id: productPendingDelete.id } } })
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
