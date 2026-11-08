import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        md: '2rem',
        lg: '2.5rem'
      },
      screens: {
        '2xl': '1280px'
      }
    },
    extend: {
      colors: {
        cream: '#FBF7F2',
        ivory: '#F4ECE0',
        sage: {
          DEFAULT: '#7C8C7A',
          50: '#F2F4F1',
          100: '#E3E8E1',
          200: '#C5D0C2',
          300: '#9FAA9C',
          400: '#86947F',
          500: '#7C8C7A',
          600: '#5E6E5C',
          700: '#475440',
          800: '#2E3D34'
        },
        forest: {
          DEFAULT: '#2E3D34',
          soft: '#3E5045'
        },
        rose: {
          DEFAULT: '#D9A8A0',
          soft: '#E8C4BD',
          deep: '#B9817A'
        },
        clay: {
          DEFAULT: '#C97B5A',
          hover: '#B66B4B',
          soft: '#E8B49E'
        },
        muted: '#8A847A',
        line: '#E5DED2',
        ink: '#1B241F'
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.6rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.375rem', { lineHeight: '1.85rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.15rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.6rem', letterSpacing: '-0.015em' }],
        '4xl': ['3rem', { lineHeight: '3.3rem', letterSpacing: '-0.02em' }],
        '5xl': ['4rem', { lineHeight: '4.2rem', letterSpacing: '-0.025em' }],
        '6xl': ['4.75rem', { lineHeight: '5rem', letterSpacing: '-0.03em' }]
      },
      letterSpacing: {
        editorial: '-0.02em',
        wider: '0.08em'
      },
      spacing: {
        section: '5.5rem',
        'section-md': '7rem'
      },
      maxWidth: {
        readable: '62ch',
        prose: '70ch'
      },
      boxShadow: {
        soft: '0 2px 24px -12px rgba(46, 61, 52, 0.18)',
        card: '0 1px 2px rgba(46, 61, 52, 0.04), 0 8px 28px -16px rgba(46, 61, 52, 0.18)',
        ring: '0 0 0 2px rgba(201, 123, 90, 0.45)'
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '14px'
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 30s linear infinite'
      }
    }
  },
  plugins: [animate]
};

export default config;
