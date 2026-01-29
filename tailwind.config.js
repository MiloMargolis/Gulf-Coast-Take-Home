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
          'bg': '#f9fafb',
          'card': '#ffffff',
          'border': '#e5e7eb',
          'border-light': '#f3f4f6',
          'accent': '#2563eb',
          'accent-light': '#eff6ff',
          'accent-hover': '#1d4ed8',
          'green': '#16a34a',
          'green-hover': '#15803d',
          'slate': '#475569',
          'slate-hover': '#334155',
          'text': '#111827',
          'text-secondary': '#6b7280',
          'text-muted': '#9ca3af',
        }
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'card-hover': '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
}
