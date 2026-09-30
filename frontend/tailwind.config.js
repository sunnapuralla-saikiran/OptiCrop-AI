/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        navy: {
          light: '#1e293b',
          DEFAULT: '#0f172a',
          dark: '#020617',
        },
        skyline: {
          soft: '#f0f7ff',
          subtle: '#e0f0fe',
          accent: '#0284c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
        'glow-lg': '0 0 35px -5px rgba(37, 99, 235, 0.35)',
        'card': '0 2px 12px -2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}

