/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      fontSize: {
        'normal': '1.5rem',
      },
      colors: {
        'dark': '#333333',
        'highlight-bg': 'rgba(255, 255, 255, 0.8)',
        'current-bg': '#ebf8ff',
      },
    },
  },
  plugins: [],
}

