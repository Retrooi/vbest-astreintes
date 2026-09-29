/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vbestRed: '#C51C1E',
        vbestGrey: '#53565A',
      }
    },
  },
  plugins: [],
}