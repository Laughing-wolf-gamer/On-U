module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        vibrateScale: {
          '0%, 100%': { transform: 'translateX(0) scale(1)' },
          '25%': { transform: 'translateX(-2px) scale(1.1)' },
          '50%': { transform: 'translateX(2px) scale(1.05)' },
          '75%': { transform: 'translateX(-2px) scale(1.1)' },
        },
        shineEffect: {
          '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 1)' },
          '100%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)' },
        },
      },
      animation: {
        vibrateScale: 'vibrateScale 0.4s ease-out',
        'shine': 'shineEffect 1.5s infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}