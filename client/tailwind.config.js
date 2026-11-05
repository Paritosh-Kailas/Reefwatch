/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ocean: {
          50:  '#edfafa',
          100: '#d5f5f6',
          200: '#afecee',
          300: '#7edce2',
          400: '#16bdca',
          500: '#0694a2',
          600: '#047481',
          700: '#036672',
          800: '#05505c',
          900: '#014451',
        },
        reef: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          700: '#15803d',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
