export function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name)
  return v?.trim() || fallback
}

export const chartTheme = {
  lineColor: () => cssVar('--color-primary', '#6e56cf'),
  barColor: () => cssVar('--color-secondary', '#3b82f6'),
  gridColor: () => cssVar('--color-border', '#e5e7eb'),
  axisColor: () => cssVar('--color-text-muted', '#9ca3af'),
  tooltipBg: () => cssVar('--color-surface', '#111317'),
  tooltipBorder: () => cssVar('--color-border', '#1f2430'),
  tooltipText: () => cssVar('--color-text', '#e5e7eb'),
}
