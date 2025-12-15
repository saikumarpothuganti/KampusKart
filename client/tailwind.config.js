/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        secondary: '#047857',
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
