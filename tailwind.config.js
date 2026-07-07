/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf8f2',
          100: '#f9eedf',
          200: '#f2d9b8',
          300: '#e8be88',
          400: '#db9e56',
          500: '#c97f30',
          600: '#a96425',
          700: '#874e20',
          800: '#6b3e1f',
          900: '#57331b',
        },
        stone: {
          950: '#0f0d0b',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
