import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MelodieMacher Brand Colors
        primary: {
          50: '#EEF2F7',
          100: '#D5DEE9',
          200: '#B3C4D6',
          300: '#8BA5C1',
          400: '#6889AD',
          500: '#4A6FA0',
          600: '#1E3A5F', // Main brand blue
          700: '#172E4C',
          800: '#112239',
          900: '#0B1626',
        },
        gold: {
          50: '#FBF7ED',
          100: '#F5ECD4',
          200: '#EDD9A8',
          300: '#E4C67C',
          400: '#D4A843', // Main gold accent
          500: '#C49A35',
          600: '#A17E29',
          700: '#7D611F',
          800: '#594516',
          900: '#36290D',
        },
        rose: {
          50: '#FDF5F6',
          100: '#FAE9EB',
          200: '#F4D0D5',
          300: '#E8B4B8', // Soft rose accent
          400: '#DC969C',
          500: '#D07880',
          600: '#B85A63',
          700: '#9A4149',
          800: '#7C3339',
          900: '#5E262B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
