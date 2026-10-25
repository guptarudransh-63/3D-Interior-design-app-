/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F4EFE6',
          300: '#EAE1D2',
          400: '#DDD0BC',
        },
        charcoal: {
          50: '#F5F5F4',
          100: '#E7E5E4',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        sage: {
          50: '#F4F6F4',
          100: '#E5EAE4',
          300: '#B6C4B4',
          500: '#8E9A8B',
          700: '#647061',
          900: '#3D463B',
        },
        wood: {
          oak: '#8C6D46',
          walnut: '#4A3425',
          bleached: '#DFD5BE',
        },
        stone: {
          warm: '#E7E0D5',
          pale: '#F2EFEB',
          accent: '#C5BCAD',
        },
        terracotta: {
          DEFAULT: '#B8654D',
          dark: '#9A513C',
          light: '#CE7E67',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
