import { Box, Button, Stack, Typography } from '@mui/material'

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface ProductCardProps {
  name: string
  price: number
}

export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <Stack
      sx={{
        border: 1,
        borderColor: 'outlineVariant',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ width: '100%', aspectRatio: '1 / 1', bgcolor: 'surfaceVariant' }} />
      <Stack sx={{ p: 2, gap: 0.5, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          Product
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {name}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {currencyFormatter.format(price)}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" fullWidth sx={{ mt: 1.5 }}>
          Add to cart
        </Button>
      </Stack>
    </Stack>
  )
}
