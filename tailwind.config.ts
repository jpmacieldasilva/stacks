import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Sistema de cores baseado no PRD - escala de cinza
      colors: {
        // Cores base em escala de cinza
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Cores para stickies conforme especificado no PRD
        sticky: {
          pink: '#fce7f3',
          yellow: '#fef3c7',
          green: '#dcfce7',
          purple: '#f3e8ff',
        },
        // Cores para tags
        tag: {
          blue: '#dbeafe',
          orange: '#fed7aa',
          teal: '#ccfbf1',
          indigo: '#e0e7ff',
        }
      },
      // Tipografia conforme especificado no PRD
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      // Bordas arredondadas conforme especificado no PRD (2xl)
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      // Sombras suaves conforme especificado no PRD
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.15)',
        'large': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'lift': '0 8px 25px 0 rgba(0, 0, 0, 0.15)',
      },
      // Animações conforme especificado no PRD (200-300ms)
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
      },
      // Easing suave conforme especificado no PRD
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      // Tamanhos específicos para cards conforme PRD
      width: {
        'sticky-sm': '100px',
        'sticky-md': '150px',
        'sticky-lg': '200px',
        'paper-min': '300px',
      },
      height: {
        'sticky-sm': '100px',
        'sticky-md': '150px',
        'sticky-lg': '200px',
        'paper-min': '400px',
      },
      // Espaçamentos consistentes conforme especificado no PRD
      spacing: {
        '18': '72px',
        '88': '352px',
      },
      // Z-index para layering de cards
      zIndex: {
        'card': '10',
        'card-hover': '20',
        'card-dragging': '30',
        'modal': '40',
        'tooltip': '50',
      }
    },
  },
  plugins: [],
};

export default config;
