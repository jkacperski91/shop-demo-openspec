import { MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { useState } from 'react'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

/**
 * Decorative only: the chosen value is local UI state and never re-sorts the
 * product list (see specs/product-management-ui - "Decorative catalog
 * browsing controls").
 */
export function ProductSortSelect() {
  const [value, setValue] = useState('featured')

  const handleChange = (event: SelectChangeEvent) => setValue(event.target.value)

  return (
    <Select size="small" value={value} onChange={handleChange}>
      {SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}
