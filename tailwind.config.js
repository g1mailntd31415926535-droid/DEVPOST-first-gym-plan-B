/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0A66FF',
          dark: '#084BD0',
          soft: '#E8F0FF',
        },
        ink: '#0B0D12',
        muted: '#6B7280',
        chip: '#F2F3F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
        chip: '999px',
      },
    },
  },
  plugins: [],
};
