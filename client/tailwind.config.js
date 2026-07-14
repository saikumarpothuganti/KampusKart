/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EDE0C8',
        'paper-light': '#F5EBD6',
        ink: '#18382A',
        'ink-light': '#25503C',
        primary: '#18382A',
        secondary: '#25503C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      zIndex: {
        9999: '9999',
      },
      animation: {
        'spin-slow': 'spin-slow 2s linear infinite',
        'cardPulse': 'cardPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
