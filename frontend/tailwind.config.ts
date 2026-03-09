import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dental: {
          50: '#f7faf9',
          100: '#eef4f2',
          200: '#d9e5e1',
          300: '#bdd1ca',
          400: '#8fb1a7',
          500: '#5c8c7f',
          600: '#3f6f63',
          700: '#2d564c',
          800: '#21443c',
          900: '#18332d',
        },

        slate: {
          850: '#172033',
        },

        obsidian: {
          950: '#ffffff',
          900: '#f8fafc',
          800: '#f1f5f9',
          700: '#e5e7eb',
        },

        steel: {
          50: '#0a0a0a',
          200: '#4b5563',
          400: '#9ca3af',
        },

        redlux: {
          500: '#0f7b6c',
          600: '#0c6256',
        },
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