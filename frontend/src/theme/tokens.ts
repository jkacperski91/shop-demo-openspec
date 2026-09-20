import { mix } from './colorMix'

export interface ShopPaletteTokens {
  bg: string
  surface: string
  surfaceVariant: string
  onSurface: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
}

const ACCENT = '#6750A4'

export const lightPaletteTokens: ShopPaletteTokens = {
  bg: '#FFFBFE',
  surface: '#FFFFFF',
  surfaceVariant: '#F3EDF7',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  outline: '#CAC4D0',
  outlineVariant: '#E7E0EC',
  primary: ACCENT,
  onPrimary: '#FFFFFF',
  primaryContainer: mix(ACCENT, '#FFFFFF', 0.82),
  onPrimaryContainer: mix(ACCENT, '#000000', 0.6),
}

export const darkPaletteTokens: ShopPaletteTokens = {
  bg: '#141218',
  surface: '#211F26',
  surfaceVariant: '#49454F',
  onSurface: '#E6E0E9',
  onSurfaceVariant: '#CAC4D0',
  outline: '#938F99',
  outlineVariant: '#49454F',
  primary: mix(ACCENT, '#FFFFFF', 0.35),
  onPrimary: mix(ACCENT, '#000000', 0.55),
  primaryContainer: mix(ACCENT, '#000000', 0.45),
  onPrimaryContainer: mix(ACCENT, '#FFFFFF', 0.85),
}
