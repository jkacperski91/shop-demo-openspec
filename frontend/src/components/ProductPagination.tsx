import { IconButton, Stack, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useState } from 'react'

const PAGE_COUNT = 3

/**
 * Decorative only: the displayed page is local UI state and never slices the
 * product list (see specs/product-management-ui - "Decorative catalog
 * browsing controls").
 */
export function ProductPagination() {
  const [page, setPage] = useState(1)

  return (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 4.5 }}
    >
      <IconButton
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => setPage((current) => Math.max(1, current - 1))}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      {Array.from({ length: PAGE_COUNT }, (_, index) => index + 1).map((pageNumber) => (
        <IconButton
          key={pageNumber}
          aria-label={`Page ${pageNumber}`}
          onClick={() => setPage(pageNumber)}
          sx={{
            width: 36,
            height: 36,
            bgcolor: pageNumber === page ? 'primary.main' : 'transparent',
            color: pageNumber === page ? 'primary.contrastText' : 'text.primary',
            '&:hover': { bgcolor: pageNumber === page ? 'primary.main' : 'action.hover' },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {pageNumber}
          </Typography>
        </IconButton>
      ))}
      <IconButton
        aria-label="Next page"
        disabled={page === PAGE_COUNT}
        onClick={() => setPage((current) => Math.min(PAGE_COUNT, current + 1))}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}
