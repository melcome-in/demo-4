/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', '"Cormorant Garamond"', 'cursive'],
      },
      colors: {
        aegean: {
          50: '#f0f7fc',
          100: '#dceef8',
          200: '#bce0f3',
          300: '#8cc9ea',
          400: '#55abdd',
          500: '#2d8ec8',
          600: '#1e71aa',
          700: '#195b8a',
          800: '#184d73',
          900: '#194160',
          950: '#0d263b',
        },
        champagne: {
          50: '#fdfbf7',
          100: '#f9f4e8',
          200: '#f2e6cd',
          300: '#e7d2a7',
          400: '#dab87b',
          500: '#cf9f56',
          600: '#c08744',
          700: '#9f6b39',
          800: '#815633',
          900: '#69472c',
        },
        bougainvillea: {
          400: '#e85d99',
          500: '#d6337c',
          600: '#b81d62',
        }
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        shimmer: 'shimmer 6s infinite linear',
        floatSlow: 'floatSlow 5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
