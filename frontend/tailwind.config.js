/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core earth palette
        soil: {
          50:  '#faf7f2',
          100: '#f2ead8',
          200: '#e4d3b0',
          300: '#d0b480',
          400: '#bc9254',
          500: '#a97a3a',
          600: '#8e6230',
          700: '#714d28',
          800: '#5a3e24',
          900: '#3d2a18',
          950: '#221608',
        },
        // Primary green — deep field green
        leaf: {
          50:  '#f0f9f0',
          100: '#d9f0d9',
          200: '#b3e0b4',
          300: '#7ec880',
          400: '#4dab50',
          500: '#2d8f31',
          600: '#1f7224',
          700: '#1a5c1e',
          800: '#174a1a',
          900: '#133d16',
          950: '#082109',
        },
        // Accent — amber harvest
        harvest: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Sky / info
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        // Background dark slate
        slate: {
          850: '#0f1a14',
          900: '#0a1209',
          950: '#060d06',
        },
        // Neutral surface
        stone: {
          750: '#3a3530',
          850: '#1e1b18',
          950: '#0d0b09',
        },
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'field-gradient': 'linear-gradient(135deg, #082109 0%, #0a1a0a 40%, #132213 100%)',
        'card-gradient':  'linear-gradient(145deg, rgba(29,46,29,0.6) 0%, rgba(13,26,13,0.8) 100%)',
        'harvest-glow':   'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.12) 0%, transparent 70%)',
        'leaf-glow':      'radial-gradient(ellipse at 50% 100%, rgba(45,143,49,0.08) 0%, transparent 60%)',
      },
      boxShadow: {
        'leaf':    '0 0 0 1px rgba(45,143,49,0.3), 0 4px 24px rgba(45,143,49,0.12)',
        'harvest': '0 0 0 1px rgba(245,158,11,0.3), 0 4px 24px rgba(245,158,11,0.12)',
        'card':    '0 1px 3px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)',
        'inner-leaf': 'inset 0 1px 0 rgba(45,143,49,0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease forwards',
        'slide-up':    'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':     'shimmer 1.8s linear infinite',
        'grow':        'grow 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'float':       'float 6s ease-in-out infinite',
        'scan':        'scan 2s linear infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        grow: {
          from: { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          to:   { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
