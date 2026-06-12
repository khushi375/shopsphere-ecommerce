/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: '#131921',      // Deep navy background
          light: '#232f3e',     // Secondary nav navy
          gold: '#febd69',      // Bright gold accent text
          yellow: '#f0c14b',    // Amazon gold button fill
          yellowHover: '#ddb347' // Amazon gold button hover
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
