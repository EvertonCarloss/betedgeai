import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg: { DEFAULT: '#080b10', 2: '#0e1318', 3: '#141b22' },
        border: { DEFAULT: '#1c2530', 2: '#253040' },
        accent: { DEFAULT: '#00d4ff', 2: '#0099bb' },
        success: { DEFAULT: '#00e676', 2: '#00a854' },
        danger: { DEFAULT: '#ff4d4d' },
        warn: { DEFAULT: '#ffd600' },
        txt: { DEFAULT: '#d4dde8', 2: '#7a8fa8', 3: '#3d5168' },
      },
      animation: {
        'fade-in': 'fadeIn .2s ease',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' }
        },
      },
    },
  },
  plugins: [],
}
export default config
