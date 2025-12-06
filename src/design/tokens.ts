export const tokens = {
  colors: {
    dark: {
      background: '#0b0c10',
      surface: '#111317',
      surfaceAlt: '#151821',
      border: '#1f2430',
      muted: '#2a303d',
      primary: '#6e56cf',
      primaryForeground: '#ffffff',
      secondary: '#3b82f6',
      secondaryForeground: '#ffffff',
      success: '#10b981',
      warning: '#f59e0b',
      destructive: '#ef4444',
      text: '#e5e7eb',
      textMuted: '#9ca3af'
    },
    light: {
      background: '#fafafa',
      surface: '#ffffff',
      surfaceAlt: '#f5f5f5',
      border: '#e5e7eb',
      muted: '#f3f4f6',
      primary: '#6e56cf',
      primaryForeground: '#ffffff',
      secondary: '#3b82f6',
      secondaryForeground: '#ffffff',
      success: '#10b981',
      warning: '#f59e0b',
      destructive: '#ef4444',
      text: '#0f172a',
      textMuted: '#475569'
    }
  },
  typography: {
    fontFamily: {
      sans: [
        'Inter',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif'
      ],
      mono: [
        'SFMono-Regular',
        'Menlo',
        'Consolas',
        'Liberation Mono',
        'monospace'
      ]
    },
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem'
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem'
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.08)',
    md: '0 2px 8px rgba(0,0,0,0.12)',
    lg: '0 8px 24px rgba(0,0,0,0.18)'
  }
}
export type Tokens = typeof tokens
