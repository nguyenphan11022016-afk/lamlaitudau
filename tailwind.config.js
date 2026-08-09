/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wonder: {
          blue: '#38BDF8',
          darkblue: '#0284C7',
          yellow: '#FACC15',
          orange: '#FB923C',
          green: '#4ADE80',
          purple: '#C084FC',
          pink: '#F472B6',
          bg: '#F0F9FF',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Fredoka', 'Quicksand', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        '3d-yellow': '0 6px 0 0 #CA8A04',
        '3d-blue': '0 6px 0 0 #0369A1',
        '3d-green': '0 6px 0 0 #15803D',
        '3d-purple': '0 6px 0 0 #7E22CE',
        '3d-pink': '0 6px 0 0 #BE185D',
        '3d-orange': '0 6px 0 0 #C2410C',
      },
      keyframes: {
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(-4%)' },
          '50%': { transform: 'translateY(4%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'bounce-slow': 'bounceSlow 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}
