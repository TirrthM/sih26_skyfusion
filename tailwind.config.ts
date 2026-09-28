import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sf: {
          air: '#F1F8F9',
          sky: '#93B8D3',
          blue: '#659AC1',
          deepBlue: '#37699F',
          dark: '#0B100D',
          deepGreen: '#31514F',
          green: '#5B8769',
          bg: {
            light: '#F1F8F9',
            dark: '#0B100D',
          },
          surface: {
            light: '#FFFFFF',
            dark: '#121A17',
            darkMuted: '#17221E',
          },
          border: {
            light: 'rgba(55, 105, 159, 0.15)',
            dark: 'rgba(255, 255, 255, 0.12)',
            darkBright: 'rgba(101, 154, 193, 0.35)',
          },
          cyan: {
            DEFAULT: '#659AC1',
            hover: '#37699F',
            glow: 'rgba(101, 154, 193, 0.25)',
          },
          indigo: {
            DEFAULT: '#37699F',
            hover: '#2A527D',
            glow: 'rgba(55, 105, 159, 0.25)',
          },
          amber: {
            DEFAULT: '#D97706',
            hover: '#B45309',
            glow: 'rgba(217, 119, 6, 0.25)',
          },
          emerald: {
            DEFAULT: '#5B8769',
            hover: '#31514F',
            glow: 'rgba(91, 135, 105, 0.25)',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'tactile-light': '0 10px 30px -4px rgba(55, 105, 159, 0.08), 0 2px 6px -1px rgba(11, 16, 13, 0.03)',
        'tactile-sm-light': '0 4px 12px -2px rgba(55, 105, 159, 0.06)',
        'tactile-lg-light': '0 20px 45px -8px rgba(55, 105, 159, 0.14), 0 6px 16px -2px rgba(11, 16, 13, 0.05)',
        'tactile-cyan': '0 0 24px -2px rgba(101, 154, 193, 0.35)',
        'tactile-dark': '0 12px 36px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'tactile-sm-dark': '0 6px 20px 0 rgba(0, 0, 0, 0.35)',
        'panel-glass': '0 12px 40px 0 rgba(11, 16, 13, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
