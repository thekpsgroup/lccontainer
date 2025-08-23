/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Design tokens with WCAG 2.2 AA compliance
        bg: {
          DEFAULT: '#ffffff',
          dark: '#0b1220'
        },
        text: {
          DEFAULT: '#0f172a', // slate-900
          dark: '#f8fafc'     // slate-50
        },
        muted: {
          DEFAULT: '#334155', // slate-700
          dark: '#cbd5e1'     // slate-300
        },
        primary: {
          DEFAULT: '#0f172a', // deep navy - ensures high contrast on white
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#1d4ed8', // blue-700 - 7:1 contrast on white for buttons
          foreground: '#ffffff',
          // Legacy numbered values for backward compatibility
          50: '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          300: '#533483',
          400: '#e94560',
          500: '#f39c12',
          600: '#f1c40f',
          700: '#f7dc6f',
          800: '#fef9e7',
          900: '#ffffff'
        },
        // Legacy color support (keeping for existing components)
        primary: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          500: '#94a3b8',
          600: '#cbd5e1',
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc'
        },
        secondary: {
          50: '#0f0f23',
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0f3460',
          400: '#533483',
          500: '#e94560',
          600: '#f39c12',
          700: '#f1c40f',
          800: '#f7dc6f',
          900: '#fef9e7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography scale as specified
        'base': ['16px', { lineHeight: '1.75' }], // leading-7
        'lg': ['18px', { lineHeight: '2' }],      // leading-8
      },
      maxWidth: {
        '68ch': '68ch', // Max line length for prose
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
