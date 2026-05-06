import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#6366f1',
          dark: '#818cf8',
        }
      },
      typography: (theme: (arg: string) => string) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            a: { color: '#6366f1', '&:hover': { color: '#4f46e5' } },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: { color: '#818cf8', '&:hover': { color: '#a5b4fc' } },
            code: {
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
}

export default config
