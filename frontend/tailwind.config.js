/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          pink: '#FF4458',
          gradientStart: '#FF655B',
          gradientEnd: '#FF4458',
          dark: '#111418',
          card: '#1F242B',
          muted: '#8A96A3',
        },
      },
    },
  },
  plugins: [],
};

