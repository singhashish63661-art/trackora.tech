/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
const typography = require("@tailwindcss/typography");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
      serif: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
      mono: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
      jost: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        hero: "url('/assets/images/backgrounds/banner.png')",
        main: "url('/assets/images/backgrounds/Background.jpg')",
        about: "url('/assets/images/backgrounds/aboutpage-bg.png')",
        services: "url('/assets/images/backgrounds/servicespage-bg.jpg')",
        contact: "url('/assets/images/backgrounds/contactpage-bg.jpg')",
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          lg: "1200px",
          xl: "1200px",
          "2xl": "1200px",
        },
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["14px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.6" }],
        body: ["15px", { lineHeight: "1.6" }], // Custom for design
        lg: ["18px", { lineHeight: "1.6" }],
        xl: ["20px", { lineHeight: "1.5" }],
        "2xl": ["22px", { lineHeight: "1.5" }],
        "3xl": ["30px", { lineHeight: "1.3" }],
        "4xl": ["36px", { lineHeight: "1.3" }],
        "5xl": ["48px", { lineHeight: "1.2" }],
        "6xl": ["60px", { lineHeight: "1.1" }],
        "hero": ["84px", { lineHeight: "1.0" }],
      },
      colors: {
        primary: {
          DEFAULT: "#FF6C0C", // Dark Orange
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#C2410C", // Base
          600: "#9A3412",
          700: "#7C2D12",
          800: "#431407",
          900: "#2C0B04",
        },
        secondary: "#2A2A2A", // Dark Charcoal/Black
        textMain: "#3F3F3F", // Dark Gray for body
        textLight: "#9DA7B4", // Accent Gray
        bgLight: "#F9F9F9", // Light Background
        accent: "#9DA7B4",
        // Semantic aliases
        dark: "#2A2A2A",
      },

    },
  },
  plugins: [
    typography,
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".startCenter": {
          display: "flex",
          "align-items": "center",
        },
        ".btwn": {
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
        },
      });
    }),
  ],
};
