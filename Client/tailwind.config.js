/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
          fontFamily: {
      kanit: ['Kanit', 'sans-serif'],
          },
          colors: {
            cream: {
              100: '#FDF6ED',
              200: '#F8E9D6',
              300: '#F3D9B0',
              400: '#EFBF86',
            },
            brown: {
              600: '#6B3E1E',
              700: '#4E2E16',
            },
    },
    },
  },
  plugins: [],
}
