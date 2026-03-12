/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Georgia', 'serif'],
      },
      colors: {
        ink: { 950:'#080610', 900:'#0e0c1e', 800:'#17142e', 700:'#221e42', 600:'#302a58' },
        gold: { DEFAULT:'#c9a84c', light:'#e8c96a' },
        silver: '#a8b8cc',
        rose: '#d4607a',
        teal: '#4ab8a8',
      },
    },
  },
  plugins: [],
}
