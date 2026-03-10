import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          // Ашық жасыл палитра (Турист тақырыбы)
          green:    '#22C55E',  // Primary - ашық жасыл
          green2:   '#16A34A',  // Secondary green
          bright:   '#4ADE80',  // Ерекше жарық жасыл
          light:    '#86EFAC',  // Light accent
          mint:     '#BBF7D0',  // Mint оттенок
          pale:     '#DCFCE7',  // Өте ашық жасыл
          emerald:  '#059669',  // Deep emerald
          spring:   '#00D68F',  // Spring green
          // Фон түстері (ашық тақырып)
          white:    '#FFFFFF',
          cream:    '#F0FDF4',  // Cream жасыл
          surface:  '#ECFDF5',  // Surface ашық
          card:     '#FFFFFF',
          cardAlt:  '#F0FDF4',
          // Контрасті түстер
          black:    '#14532D',  // Dark green text
          text:     '#15803D',  // Text green
          muted:    '#6B7280',
          border:   '#BBF7D0',
          borderAlt:'#86EFAC',
          // Акценттер
          blue:     '#38BDF8',
          amber:    '#FBBF24',
          rose:     '#FB7185',
          violet:   '#A78BFA',
          slate:    '#64748B',
        },
        // Difficulty colors
        difficulty: {
          easy: '#22C55E',
          medium: '#FBBF24',
          hard: '#FB7185',
        },
        // Route type colors
        route: {
          walking: '#38BDF8',
          cycling: '#FBBF24',
          mixed: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['32px', { lineHeight: '1.2', fontWeight: '800' }],
        'h1': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        'overline': ['10px', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'sheet': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'eco': '0 4px 20px rgba(34, 197, 94, 0.15)',
        'eco-lg': '0 8px 32px rgba(34, 197, 94, 0.2)',
        'eco-glow': '0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(74, 222, 128, 0.15)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'sheet': '0 -4px 24px rgba(0, 0, 0, 0.1)',
        'fab': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-eco': 'pulse-green 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'draw-line': 'draw-line 2s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(34, 197, 94, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0) translateY(10px)', opacity: '0' },
          '60%': { transform: 'scale(1.1) translateY(-5px)' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      transitionTimingFunction: {
        'sheet': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      minHeight: {
        'touch': '44px',
        'btn': '52px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}

export default config
