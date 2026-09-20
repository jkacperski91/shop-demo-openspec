import { Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { useCart } from '../cart/CartProvider'

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal, increment, decrement } = useCart()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 380, maxWidth: '90vw' } } }}
    >
      <Stack sx={{ height: '100%' }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}
        >
          <Typography variant="h6">Your Cart</Typography>
          <IconButton aria-label="Close cart" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />

        <Stack sx={{ flex: 1, overflowY: 'auto', p: 2.5, gap: 2 }}>
          {items.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
              Your cart is empty.
            </Typography>
          )}
          {items.map((item) => (
            <Stack key={item.id} direction="row" sx={{ gap: 1.5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: 2,
                  bgcolor: 'surfaceVariant',
                }}
              />
              <Stack sx={{ flex: 1, gap: 0.25, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currencyFormatter.format(item.price)}
                </Typography>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <IconButton
                    size="small"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => decrement(item.id)}
                    sx={{ border: 1, borderColor: 'outline', borderRadius: 1.5 }}
                  >
                    <RemoveIcon fontSize="inherit" />
                  </IconButton>
                  <Typography variant="body2" sx={{ minWidth: 14, textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => increment(item.id)}
                    sx={{ border: 1, borderColor: 'outline', borderRadius: 1.5 }}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Divider />
        <Stack sx={{ p: 2.5, gap: 1.5 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {currencyFormatter.format(subtotal)}
            </Typography>
          </Stack>
          <Button variant="contained" fullWidth>
            Checkout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}
