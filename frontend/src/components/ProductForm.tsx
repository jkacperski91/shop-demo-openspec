import { Alert, Box, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productFormSchema, type ProductFormValues } from '../schemas/product'

const emptyValues: ProductFormValues = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
}

interface ProductFormProps {
  initialValues?: ProductFormValues
  submitLabel: string
  submitError?: string | null
  onSubmit: (values: ProductFormValues) => void
}

export function ProductForm({
  initialValues,
  submitLabel,
  submitError,
  onSubmit,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues ?? emptyValues,
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ maxWidth: 480 }}>
      <Stack spacing={2}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <TextField
          label="Name"
          required
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />

        <TextField
          label="Description"
          multiline
          minRows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register('description')}
        />

        <TextField
          label="Price"
          type="number"
          required
          slotProps={{ htmlInput: { step: '0.01', min: 0 } }}
          error={!!errors.price}
          helperText={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />

        <TextField
          label="Stock quantity"
          type="number"
          required
          slotProps={{ htmlInput: { step: 1, min: 0 } }}
          error={!!errors.stockQuantity}
          helperText={errors.stockQuantity?.message}
          {...register('stockQuantity', { valueAsNumber: true })}
        />

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  )
}
