/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'Cairo', 'sans-serif'],
      },
      colors: {
        primary: '#0f172a', // Slate 900
        secondary: '#1e293b', // Slate 800
        accent: '#3b82f6', // Blue 500
      }
    },
  },
  plugins: [],
}