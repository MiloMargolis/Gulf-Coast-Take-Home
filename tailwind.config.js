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
          'bg': '#f8fafc',
          'sidebar': '#ffffff',
          'card': '#ffffff',
          'border': '#e2e8f0',
          'border-light': '#f1f5f9',
          'accent': '#3b82f6',
          'accent-hover': '#2563eb',
          'text': '#1e293b',
          'text-secondary': '#64748b',
          'text-muted': '#94a3b8',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
}
