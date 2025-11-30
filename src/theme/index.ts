export const theme = {
  colors: {
    dark: {
      bg: '#0a0f0a',
      accent: '#0df20d',
      accentDark: '#102310',
      border: '#224922',
      text: '#ffffff'
    },
    light: {
      bg: '#f6f9f6',
      accent: '#0df20d',
      accentDark: '#0a0f0a',
      border: '#2e6f2e',
      text: '#0a0f0a',
      surface: '#ffffff',
      primaryHover: '#0bb10b',
      secondaryHover: '#2a622a'
    }
  },
  typography: {
    display: 'font-bold',
    mono: 'font-mono',
    body: 'font-normal'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
}

export type Theme = typeof theme
