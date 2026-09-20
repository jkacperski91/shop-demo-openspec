import { createTheme, type Theme } from '@mui/material/styles'
import { darkPaletteTokens, lightPaletteTokens } from './tokens'

declare module '@mui/material/styles' {
  interface Palette {
    surface: string
    surfaceVariant: string
    outline: string
    outlineVariant: string
    primaryContainer: string
    onPrimaryContainer: string
  }
  interface PaletteOptions {
    surface?: string
    surfaceVariant?: string
    outline?: string
    outlineVariant?: string
    primaryContainer?: string
    onPrimaryContainer?: string
  }
}

export type ThemeMode = 'light' | 'dark'

export function createAppTheme(mode: ThemeMode): Theme {
  const tokens = mode === 'dark' ? darkPaletteTokens : lightPaletteTokens

  return createTheme({
    palette: {
      mode,
      background: { default: tokens.bg, paper: tokens.surface },
      text: { primary: tokens.onSurface, secondary: tokens.onSurfaceVariant },
      primary: { main: tokens.primary, contrastText: tokens.onPrimary },
      divider: tokens.outlineVariant,
      surface: tokens.surface,
      surfaceVariant: tokens.surfaceVariant,
      outline: tokens.outline,
      outlineVariant: tokens.outlineVariant,
      primaryContainer: tokens.primaryContainer,
      onPrimaryContainer: tokens.onPrimaryContainer,
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: 'none' },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 20 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.surface,
            color: tokens.onSurface,
            boxShadow: 'none',
            borderBottom: `1px solid ${tokens.outlineVariant}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.surface,
            color: tokens.onSurface,
          },
        },
      },
    },
  })
}
