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
        background: "#0a0f0a",
        surface: "#111a11",
        muted: "#1a2f1a",
        primary: {
          DEFAULT: "#0df20d",
          dark: "#102310",
          foreground: "#0a0f0a",
        },
        secondary: {
          DEFAULT: "#224922",
          foreground: "#0df20d",
        },
        border: "#224922",
        "border-hover": "#0df20d",
        destructive: "#ff4444",
      },
      fontFamily: {
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
