import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f6',
          100: '#fce7ee',
          200: '#f9d0de',
          300: '#f4a8c2',
          400: '#ee759f',
          500: '#e34a7d',
          600: '#cf2a5e',
          700: '#8e0728',
          800: '#800a28',
          900: '#6b0722',
          950: '#40020f',
        },
        amber: {
          500: '#D4AF37',
          600: '#C19B22',
        },
      },
      fontFamily: {
        serif: ['var(--font-geist-sans)', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-background.jpg')",
      },
    },
  },
  plugins: [],
};

export default config; 