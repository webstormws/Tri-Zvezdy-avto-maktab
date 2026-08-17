/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#005B3A",
          light: "#087A4B",
          dark: "#003B26",
        },
        ink: "#0B1B14",
        surface: "#F7F9F8",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "Segoe UI", "Arial", "sans-serif"],
        display: ["Manrope", "Inter", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(11, 27, 20, 0.06)",
        "card-hover": "0 16px 40px rgba(0, 91, 58, 0.14)",
        soft: "0 8px 30px rgba(11, 27, 20, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
        "slide-in": "slide-in 0.4s ease-out both",
        "pop-in": "pop-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
