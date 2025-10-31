/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Josefin Sans', 'Noto Sans Kannada', 'sans-serif'],
      },
      colors: {
        'ce': {
          DEFAULT: '#3B82F6',
          light: '#EFF6FF',
        },
        'me': {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
        },
        'cs': {
          DEFAULT: '#8B5CF6',
          light: '#F5F3FF',
        },
        'ec': {
          DEFAULT: '#F97316',
          light: '#FFF7ED',
        },
        'ee': {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
        },
        'all': {
          DEFAULT: '#6B7280',
          light: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
}
