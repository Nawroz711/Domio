/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',    // Deep Blue - conveys reliability and trust
        secondary: '#FFFFFF',  // White - clean, simple, easy to read
        accent: '#10B981',      // Emerald Green - adds freshness and growth
        dark: '#f3f4f6',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
}
