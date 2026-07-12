/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#8B1E3F',
          light: '#A82553',
          dark: '#6E1832',
          glow: 'rgba(139, 30, 63, 0.25)',
        },
        surface: {
          DEFAULT: '#0f172a',
          elevated: '#1e293b',
        },
      },
      boxShadow: {
        'glow-green': '0 0 12px 3px rgba(34, 197, 94, 0.4)',
        'glow-amber': '0 0 12px 3px rgba(245, 158, 11, 0.4)',
        'glow-red': '0 0 12px 3px rgba(239, 68, 68, 0.4)',
        'glow-accent': '0 0 12px 3px rgba(139, 30, 63, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
