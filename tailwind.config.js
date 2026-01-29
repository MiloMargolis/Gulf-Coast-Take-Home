/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'interface': {
          'dark': '#0a0a0a',
          'card': '#1a1a1a',
          'border': '#2a2a2a',
          'accent': '#3b82f6',
          'accent-hover': '#2563eb',
        }
      }
    },
  },
  plugins: [],
}
