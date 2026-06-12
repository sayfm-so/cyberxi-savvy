/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#05060c', 900: '#080a14', 800: '#0d1020', 700: '#141934' },
        cyber: {
          50: '#e8f4ff', 100: '#cfe8ff', 200: '#a3d3ff', 300: '#6bb8ff',
          400: '#369cff', 500: '#1f8fff', 600: '#0a6fe0', 700: '#0a55b0', 800: '#0c4080', 900: '#0a2c54',
        },
        savvy: {
          50: '#e6fff4', 100: '#c4ffe6', 200: '#8bffcd', 300: '#4dffb0',
          400: '#1cf593', 500: '#00e58a', 600: '#00b86e', 700: '#008a53', 800: '#066040', 900: '#093d2c',
        },
        gold: { 300: '#ffe39a', 400: '#f5c451', 500: '#e0a92e', 600: '#b9851f' },
        violet: { 300: '#b9a8ff', 400: '#9a82ff', 500: '#7c5cff', 600: '#6442e0' },
        danger: { 400: '#ff5c85', 500: '#ff3366', 600: '#d11f4c' },
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'IBM Plex Sans Arabic', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl: '14px', '2xl': '20px', '3xl': '28px', '4xl': '36px' },
      boxShadow: {
        'glow-cyber': '0 0 0 1px rgba(31,143,255,0.25), 0 0 30px -6px rgba(31,143,255,0.45)',
        'glow-savvy': '0 0 0 1px rgba(0,229,138,0.25), 0 0 30px -6px rgba(0,229,138,0.45)',
        'glow-gold': '0 0 0 1px rgba(245,196,81,0.3), 0 0 34px -6px rgba(245,196,81,0.5)',
        'card': '0 24px 60px -28px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'cyber-grad': 'linear-gradient(135deg, #1f8fff 0%, #7c5cff 100%)',
        'savvy-grad': 'linear-gradient(135deg, #00e58a 0%, #1f8fff 100%)',
        'gold-grad': 'linear-gradient(135deg, #ffe39a 0%, #e0a92e 100%)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseSoft: { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite',
        'spin-slow': 'spinSlow 14s linear infinite',
      },
    },
  },
  plugins: [],
}
