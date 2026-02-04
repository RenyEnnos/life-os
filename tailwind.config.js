import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'
import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
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
        "oled": "#050505", // Absolute OLED Black
        "glass": "rgba(24, 24, 27, 0.4)", // Standard Glass
        "glass-surface": "rgba(24, 24, 27, 0.4)",
        "glass-border": "rgba(255, 255, 255, 0.05)",
        "primary": "#308ce8", // Electric Blue
        "success": "#10b981",
        "warning": "#ef4444",
        "background-light": "#f6f7f8",
        "background-dark": "#050505",
        "accent-glow": "rgba(48, 140, 232, 0.15)",

        // Keeping existing semantic colors mapping for compatibility
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        'surface-highlight': 'hsl(var(--surface-highlight))',
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'hsl(var(--input))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
      },
      boxShadow: {
        "glass": "0 20px 60px rgba(0, 0, 0, 0.80)",
        "ambient": "0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.60)"
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "full": "9999px"
      },
      backdropBlur: {
        'xl': '24px',
        '2xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'enter': 'enter 0.6s ease-out forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
        'draw': 'draw 1.5s ease-out forwards',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        draw: {
          '0%': { height: '0%' },
          '100%': { height: 'var(--target-height)' },
        }
      }
    },
  },
  plugins: [
    tailwindcssAnimate,
    containerQueries,
    forms,
  ],
}
