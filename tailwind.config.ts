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
          bg: {
            light: '#F8F9FA',
            dark: '#080B11',
          },
          surface: {
            light: '#FFFFFF',
            dark: '#0F1420',
            darkMuted: '#151C2C',
          },
          border: {
            light: '#0F172A',
            dark: '#1E293B',
            darkBright: '#334155',
          },
          cyan: {
            DEFAULT: '#38BDF8',
            hover: '#0EA5E9',
            glow: 'rgba(56, 189, 248, 0.25)',
          },
          indigo: {
            DEFAULT: '#6366F1',
            hover: '#4F46E5',
            glow: 'rgba(99, 102, 241, 0.25)',
          },
          amber: {
            DEFAULT: '#F59E0B',
            hover: '#D97706',
            glow: 'rgba(245, 158, 11, 0.25)',
          },
          emerald: {
            DEFAULT: '#10B981',
            hover: '#059669',
            glow: 'rgba(16, 185, 129, 0.25)',
          },
          rose: {
            DEFAULT: '#F43F5E',
            hover: '#E11D48',
          },
          purple: {
            DEFAULT: '#A855F7',
            hover: '#9333EA',
          }
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'tactile-light': '4px 4px 0px #0F172A',
        'tactile-sm-light': '2px 2px 0px #0F172A',
        'tactile-lg-light': '6px 6px 0px #0F172A',
        'tactile-cyan': '4px 4px 0px #38BDF8',
        'tactile-indigo': '4px 4px 0px #6366F1',
        'tactile-amber': '4px 4px 0px #F59E0B',
        'tactile-emerald': '4px 4px 0px #10B981',
        'tactile-dark': '4px 4px 0px #1E293B',
        'tactile-sm-dark': '2px 2px 0px #1E293B',
        'hud-cyan': '0 0 20px rgba(56, 189, 248, 0.2)',
        'hud-indigo': '0 0 20px rgba(99, 102, 241, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
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
