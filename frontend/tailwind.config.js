/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // ← nøkkelen for dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}
