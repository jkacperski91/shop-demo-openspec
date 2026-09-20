import { useState } from 'react'
import { Link, Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import {
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useThemeMode } from '../theme/ThemeModeProvider'
import { useCart } from '../cart/CartProvider'
import { CartDrawer } from '../components/CartDrawer'

/**
 * The root layout route: the admin shell (app bar + navigation drawer) that
 * wraps every page, with an <Outlet/> for whichever child route is active.
 */
export const rootRoute = createRootRoute({
  component: RootLayout,
})

function navItemSx(active: boolean): SxProps<Theme> {
  return {
    borderRadius: 2.5,
    mb: 0.25,
    ...(active && {
      bgcolor: 'primaryContainer',
      color: 'onPrimaryContainer',
      '& .MuiListItemIcon-root': { color: 'onPrimaryContainer' },
    }),
  }
}

function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { mode, toggleMode } = useThemeMode()
  const { itemCount } = useCart()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isProductsActive = pathname.startsWith('/products')

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open navigation menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 'auto' }}>
            Shop Demo Admin
          </Typography>

          <IconButton color="inherit" aria-label="Toggle dark mode" onClick={toggleMode}>
            {mode === 'dark' ? (
              <DarkModeIcon fontSize="small" />
            ) : (
              <LightModeIcon fontSize="small" />
            )}
          </IconButton>

          <IconButton color="inherit" aria-label="Open cart" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={itemCount} color="primary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Toolbar />
        <List sx={{ width: 260, p: 1.5 }}>
          <ListItemButton
            component={Link}
            to="/products"
            onClick={() => setDrawerOpen(false)}
            sx={navItemSx(isProductsActive)}
          >
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
          <ListItemButton sx={navItemSx(false)}>
            <ListItemIcon>
              <ReceiptLongIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItemButton>
          <ListItemButton sx={navItemSx(false)}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItemButton>
          <ListItemButton sx={navItemSx(false)}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  )
}
