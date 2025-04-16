/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app//*.{js,ts,jsx,tsx}',
      './src/components//*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          anton: ['"Anton"', 'sans-serif'],
          barlow: ['"Barlow"', 'sans-serif'],
          oswald: ['"Oswald"', 'sans-serif'],
          inter: ['"Inter"', 'sans-serif'],
          montserrat: ['"Montserrat"', 'sans-serif'],
          poppins: ['"Poppins"', 'sans-serif'],
          bebas: ['"Bebas Neue"', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };