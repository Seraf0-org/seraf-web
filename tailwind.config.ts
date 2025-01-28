import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
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
        zen: ["Zen Kaku Gothic New", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        mincho: ['"Noto Serif JP"', 'serif'],
      },
      animation: {
        'fade-in-down': 'fade-in-down 1s ease-out forwards',
        'draw-line-from-left': 'draw-line-from-left 1.5s cubic-bezier(0.5, 0, 0.2, 1) forwards',
        'draw-line-from-right': 'draw-line-from-right 1.5s cubic-bezier(0.5, 0, 0.2, 1) forwards',
        'clip-from-right': 'clip-from-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'falling-line': 'falling-line 4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'clip-from-left': 'clip-from-left 0.6s cubic-bezier(0.7, 0, 0.1, 1) forwards',
        'text-appear': 'text-appear 0.5s ease-out forwards',
        'slide-from-top': 'slide-from-top 0.5s ease-out forwards',
        'clip-from-top': 'clip-from-top 0.5s ease-out forwards',
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
        },
        'clip-from-right': {
          '0%': {
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
          },
          '100%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          }
        },
        'falling-line': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '10%': {
            opacity: '1',
            transform: 'translateY(-90%)'
          },
          '90%': {
            opacity: '1',
            transform: 'translateY(90%)'
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          }
        },
        'clip-from-left': {
          '0%': {
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
          },
          '100%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          }
        },
        'text-appear': {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'slide-from-top': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'clip-from-top': {
          '0%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          },
          '100%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          },
        },
      },
      clipPath: {
        full: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      },
      transitionProperty: {
        'clip-path': 'clip-path',
      },
      transitionTimingFunction: {
        'clip': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      objectFit: {
        'contain': 'contain',
      },
      lineHeight: {
        'relaxed': '1.75',
        'loose': '2',
      },
    },
  },
  plugins: [],
} satisfies Config;