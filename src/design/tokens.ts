export const tokens = {
  colors: {
    // Deep Glass Palette (HSL Values)
    // Dark Mode (Default)
    background: '0 0% 1.2%',      // #030303
    surface: '240 5.9% 4%',       // #0A0A0B
    surfaceHighlight: '240 5% 8%', // #121214

    // Core Colors
    primary: '0 0% 93%',          // #ededed
    primaryForeground: '0 0% 0%', // #000000

    muted: '240 3.7% 15.9%',
    mutedForeground: '240 5% 64.9%',

    // Feedback
    destructive: '0 84.2% 60.2%',

    // Borders (RGBA bases handled in CSS mostly, but here for reference)
    border: '0 0% 100%'
  },
  // Typography retained for reference
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['SFMono-Regular', 'Menlo', 'monospace']
    }
  }
}
export type Tokens = typeof tokens
