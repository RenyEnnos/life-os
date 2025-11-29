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
        primary: {
          DEFAULT: "#0df20d",
          dark: "#102310",
        },
        secondary: "#224922",
        border: "#224922",
        "border-hover": "#0df20d",
      },
      fontFamily: {
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
