import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sf: {
          air: '#EBF3F6',
          sky: {
            soft: '#93B8D3',
            DEFAULT: '#659AC1',
            deep: '#37699F',
          },
          dark: {
            DEFAULT: '#0D1518',
            surface: '#142026',
            surfaceMuted: '#1A2A32',
            elevated: '#20333D',
            border: '#243A45',
            borderLight: 'rgba(147, 184, 211, 0.22)',
          },
          green: {
            deep: '#31514F',
            forest: '#5B8769',
            light: '#E6F3EB',
          },
          canvas: {
            light: '#EBF2F6',
            dark: '#0D1518',
          },
          surface: {
            light: '#FFFFFF',
            lightMuted: '#F1F7F9',
            dark: '#142026',
            darkMuted: '#1A2A32',
          },
          border: {
            light: 'rgba(15, 23, 42, 0.12)',
            lightMedium: 'rgba(15, 23, 42, 0.22)',
            dark: 'rgba(147, 184, 211, 0.18)',
            darkBright: 'rgba(101, 154, 193, 0.38)',
          },
          cyan: {
            DEFAULT: '#659AC1',
            hover: '#37699F',
            glow: 'rgba(101, 154, 193, 0.25)',
          },
          indigo: {
            DEFAULT: '#37699F',
            hover: '#294F77',
            glow: 'rgba(55, 105, 159, 0.25)',
          },
          amber: {
            DEFAULT: '#D99B26',
            hover: '#B57E18',
            glow: 'rgba(217, 155, 38, 0.25)',
          },
          emerald: {
            DEFAULT: '#5B8769',
            hover: '#486E55',
            glow: 'rgba(91, 135, 105, 0.25)',
          },
          rose: {
            DEFAULT: '#D45D5D',
            hover: '#B84949',
          },
          purple: {
            DEFAULT: '#6D6BB0',
            hover: '#575591',
          }
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'aerial': '0 10px 30px -6px rgba(15, 23, 42, 0.08), 0 2px 8px -1px rgba(15, 23, 42, 0.04)',
        'aerial-lg': '0 20px 44px -10px rgba(15, 23, 42, 0.12), 0 4px 14px -2px rgba(15, 23, 42, 0.05)',
        'aerial-float': '0 20px 40px -10px rgba(55, 105, 159, 0.16), 0 0 1px 1px rgba(101, 154, 193, 0.25)',
        'aerial-dark': '0 20px 48px -10px rgba(0, 0, 0, 0.55), 0 0 1px 1px rgba(147, 184, 211, 0.18)',
        'aerial-dark-glow': '0 20px 50px -10px rgba(55, 105, 159, 0.35), 0 0 1px 1px rgba(101, 154, 193, 0.35)',
        'pill-cta': '0 10px 24px -4px rgba(11, 16, 13, 0.3)',
        'pill-cta-dark': '0 10px 24px -4px rgba(101, 154, 193, 0.45)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-gentle': 'floatGentle 6s ease-in-out infinite',
      },
      keyframes: {
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
