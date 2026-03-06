import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
  dental: {
    50: '#f0fdf6',
    100: '#dcfce9',
    200: '#bbf7d4',
    300: '#86efad',
    400: '#4ade7f',
    500: '#16a34a',
    600: '#15803d',
    700: '#166534',
    800: '#14532d',
    900: '#052e16',
  },

  slate: {
    850: '#172033',
  },

  obsidian: {
    950: "#07090D",
    900: "#0B0F16",
    800: "#101827",
    700: "#162033",
  },

  steel: {
    50: "#F6F7FB",
    200: "#CFD6E4",
    400: "#9AA4B2",
  },

  redlux: {
    500: "#C1121F",
    600: "#A50F1A",
  }
},
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
