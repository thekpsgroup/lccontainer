/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#E6EAF2", muted: "#B8C0CF" },
        brand: {
          black: "#0B0B0B",     // logo bg
          red: "#B22222",       // Texas Red primary
          silver: "#C0C0C0",    // metallic accent
          gold: "#C9A75A",      // brass trust accent (sparingly)
          line: "rgba(255,255,255,0.18)"
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
