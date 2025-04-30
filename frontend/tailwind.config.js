/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
};

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