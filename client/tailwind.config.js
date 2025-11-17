/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdfaf5',
          100: '#f8f1e4',
          200: '#f1e1c8',
          300: '#e4c59a',
        },
        slate: {
          950: '#050314',
        },
        brand: {
          primary: '#111a2b',
          accent: '#f97316',
        },
      },
      fontFamily: {
        display: ['"Archivo"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}
