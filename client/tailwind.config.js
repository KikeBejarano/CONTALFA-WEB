/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        navy: '#182448',
        'navy-700': '#22305A',
        'navy-900': '#101A36',
        teal: '#18606C',
        cyan: '#00A8CC',
        'cyan-deep': '#0A6E86',
        green: '#9CCC30',
        paper: '#FBF9F5',
        surface: '#FFFFFF',
        mist: '#F2EFE9',
        'mist-200': '#E6E1D8',
        'mist-300': '#D2CCC0',
        'on-dark': '#F4F1EA',
        ink: '#14202B',
        body: '#33414C',
        muted: '#5C6873',
        'footer-teal': '#15464F',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['IBM Plex Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
        wide: '1320px',
        text: '720px',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(.22,.61,.36,1)',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        reveal: 'reveal .7s cubic-bezier(.22,.61,.36,1) both',
      },
    },
  },
  plugins: [],
}
