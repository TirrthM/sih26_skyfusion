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
            light: '#F8FAFC',
            dark: '#040711',
          },
          surface: {
            light: '#FFFFFF',
            dark: '#0A101D',
            darkMuted: '#0E1626',
          },
          border: {
            light: '#E2E8F0',
            dark: 'rgba(51, 65, 85, 0.45)',
            darkBright: 'rgba(6, 182, 212, 0.3)',
          },
          cyan: {
            DEFAULT: '#06B6D4',
            hover: '#0891B2',
            glow: 'rgba(6, 182, 212, 0.25)',
          },
          indigo: {
            DEFAULT: '#3B82F6',
            hover: '#2563EB',
            glow: 'rgba(59, 130, 246, 0.25)',
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
            DEFAULT: '#8B5CF6',
            hover: '#7C3AED',
          }
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'tactile-light': '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'tactile-sm-light': '0 2px 8px -1px rgba(15, 23, 42, 0.06)',
        'tactile-lg-light': '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
        'tactile-cyan': '0 0 24px -2px rgba(56, 189, 248, 0.35)',
        'tactile-indigo': '0 0 24px -2px rgba(99, 102, 241, 0.35)',
        'tactile-amber': '0 0 24px -2px rgba(245, 158, 11, 0.35)',
        'tactile-emerald': '0 0 24px -2px rgba(16, 185, 129, 0.35)',
        'tactile-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'tactile-sm-dark': '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
        'hud-cyan': '0 0 25px rgba(56, 189, 248, 0.25)',
        'hud-indigo': '0 0 25px rgba(99, 102, 241, 0.25)',
        'panel-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
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
