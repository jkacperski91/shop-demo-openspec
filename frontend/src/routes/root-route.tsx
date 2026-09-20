import { useState } from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Inventory2Icon from '@mui/icons-material/Inventory2'

/**
 * The root layout route: the admin shell (app bar + navigation drawer) that
 * wraps every page, with an <Outlet/> for whichever child route is active.
 */
export const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

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
          <Typography variant="h6" noWrap component="div">
            Shop Demo Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Toolbar />
        <List sx={{ width: 240 }}>
          <ListItemButton component={Link} to="/products" onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
