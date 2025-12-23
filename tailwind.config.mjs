/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          "black-900": "#0B0B0B",
          red: "#B22222",
          "red-dark": "#8B0000",
          "red-light": "#DC143C",
        },
        grey: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      borderRadius: { xl: "24px", "2xl": "32px" },
      boxShadow: { glass: "0 8px 30px rgba(2,6,23,.35)" },
      backdropBlur: { 14: "14px" },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Helvetica','Arial','sans-serif']
      }
    },
  },
  plugins: [],
};
