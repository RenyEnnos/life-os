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
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        'surface-highlight': 'hsl(var(--surface-highlight))',

        border: 'rgba(255, 255, 255, 0.08)', // Keep rgba for opacity handling for now
        'border-strong': 'rgba(255, 255, 255, 0.15)',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: "clamp(0.75rem, 0.70rem + 0.25vw, 0.875rem)",
        sm: "clamp(0.875rem, 0.83rem + 0.21vw, 1rem)",
        base: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
        lg: "clamp(1.125rem, 1.08rem + 0.23vw, 1.25rem)",
        xl: "clamp(1.25rem, 1.20rem + 0.25vw, 1.5rem)",
        "2xl": "clamp(1.5rem, 1.45rem + 0.25vw, 1.875rem)",
        "3xl": "clamp(1.875rem, 1.80rem + 0.35vw, 2.25rem)",
        "4xl": "clamp(2.25rem, 2.15rem + 0.50vw, 3rem)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries")
  ],
}
