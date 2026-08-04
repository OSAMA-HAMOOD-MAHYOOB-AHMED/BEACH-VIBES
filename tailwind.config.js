/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f2a40',
          50: '#eef3f6',
          100: '#d6e2e9',
          200: '#aec4d2',
          300: '#7fa1b7',
          400: '#4c7793',
          500: '#2c5978',
          600: '#1e4360',
          700: '#16344c',
          800: '#0f2a40',
          900: '#091b2b',
          950: '#060f19',
        },
        sand: {
          DEFAULT: '#f5f2ec',
          50: '#fbfaf8',
          100: '#f5f2ec',
          200: '#ece7dc',
          300: '#ddd5c4',
        },
        clay: '#b98a63',
        ink: '#20242b',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
    },
  },
  plugins: [],
}
