import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      animation: {
        'fade-in-down': 'fade-in-down 1s ease-out forwards',
        'draw-line-from-left': 'draw-line-from-left 1.5s cubic-bezier(0.5, 0, 0.2, 1) forwards',
        'draw-line-from-right': 'draw-line-from-right 1.5s cubic-bezier(0.5, 0, 0.2, 1) forwards',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'draw-line-from-left': {
          'from': {
            strokeDashoffset: '1000'
          },
          'to': {
            strokeDashoffset: '0'
          }
        },
        'draw-line-from-right': {
          'from': {
            strokeDashoffset: '-1000'
          },
          'to': {
            strokeDashoffset: '0'
          }
        }
      }
    },
  },
  plugins: [],
} satisfies Config;