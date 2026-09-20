import { Chip, Stack } from '@mui/material'
import { useState } from 'react'

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Accessories', 'Home']

/**
 * Decorative only: the selected chip is local UI state and is never used to
 * filter the product list (see specs/product-management-ui - "Decorative
 * catalog browsing controls").
 */
export function ProductCategoryFilter() {
  const [selected, setSelected] = useState(CATEGORIES[0])

  return (
    <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
      {CATEGORIES.map((category) => (
        <Chip
          key={category}
          label={category}
          onClick={() => setSelected(category)}
          color={selected === category ? 'primary' : 'default'}
          variant={selected === category ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  )
}
