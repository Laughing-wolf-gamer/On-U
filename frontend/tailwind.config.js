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
      },
      animation: {
        vibrateScale: 'vibrateScale 0.4s ease-out',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}