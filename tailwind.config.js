/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Deep Surface Palette (User Requested)
        background: '#030303',
        surface: '#0A0A0B',
        'surface-highlight': '#121214',

        // Bordas sutis
        border: 'rgba(255, 255, 255, 0.08)',
        'border-strong': 'rgba(255, 255, 255, 0.15)',

        // Legacy/Core Colors (Hardcoded for compatibility after variable removal)
        primary: {
          DEFAULT: '#ededed',
          foreground: '#000000',
        },
        muted: '#a1a1aa',
        foreground: '#ededed',
        destructive: '#ef4444',
        success: '#2e9f73',
        warning: '#d99a38',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
