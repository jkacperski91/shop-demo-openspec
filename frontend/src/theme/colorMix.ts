function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

export function mix(hexA: string, hexB: string, t: number): string {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  const blended = a.map((channel, i) => Math.round(channel + (b[i] - channel) * t))
  return '#' + blended.map((channel) => channel.toString(16).padStart(2, '0')).join('')
}
