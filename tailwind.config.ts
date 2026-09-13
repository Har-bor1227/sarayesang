import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#112F50',
          light: '#1A4166',
          dark: '#0B1F35',
        },

        accent: {
          DEFAULT: '#B79464',
          light: '#C6A87E',
          dark: '#9E7F50',
        },
      },

      fontFamily: {
        sans: [
          'var(--font-vazirmatn)',
          'sans-serif',
        ],
      },

      borderRadius: {
        '2xl': '1rem',
      },
    },
  },

  plugins: [typography],
}

export default config