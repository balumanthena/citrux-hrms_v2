/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // for /app directory
      './pages/**/*.{js,ts,jsx,tsx}', // for /pages directory if used
      './components/**/*.{js,ts,jsx,tsx}', // for shared components
    ],
    theme: {
      extend: {
        colors: {
          primary: '#2563eb', // Tailwind blue-600
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  