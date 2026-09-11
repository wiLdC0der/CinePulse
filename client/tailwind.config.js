/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // A dark theater palette: warm-black rather than pure black,
        // with a single muted marquee-gold accent used sparingly.
        ink: {
          950: '#121117',
          900: '#18171F',
          800: '#1E1C27',
          700: '#2A2833',
          600: '#3A3745',
        },
        paper: {
          100: '#F4F2EC',
          300: '#C9C6D1',
          500: '#9C99A8',
        },
        marquee: {
          DEFAULT: '#C9A15A',
          dim: '#8F7642',
          light: '#E0C589',
        },
        signal: {
          teal: '#4F9E96',
          brick: '#B15C4E',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1240px',
      },
    },
  },
  plugins: [],
};
