/** @type {import('tailwindcss').Config} */
module.exports = {
  enabled: process.env.IS_PRODUCTION === 'dev' ? false: true,
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#011f4b', // Blue 500
          light: '#03396c', // Blue 400
          dark: '#011f4b',  // Blue 700
        },
        red: {
          DEFAULT: '#C21807', // Custom red color
          light: '#E53935',   // Lighter shade of red
          dark: '#8E0000',    // Darker shade of red
        },
        test: {
          DEFAULT: '#FFFFFF', // Custom red color
          light: '#4B70F5',   // Lighter shade of red
          dark: '#023177  ',    // Darker shade of red
        },
      },
    },
  },
  plugins: [],
}