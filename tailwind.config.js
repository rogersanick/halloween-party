/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0b0c1a',
        pumpkin: '#f97316',
        ember: '#facc15',
        moonlight: '#f5f5f5',
        poison: '#8b5cf6',
      },
      fontFamily: {
        spooky: ['"Creepster"', 'cursive'],
        body: ['"Poppins"', 'sans-serif'],
      },
      backgroundImage: {
        'haunted-gradient':
          'radial-gradient(circle at 20% 20%, rgba(249,115,22,0.25), transparent 55%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.25), transparent 60%), linear-gradient(160deg, #0b0c1a 0%, #1e1b4b 100%)',
      },
    },
  },
  plugins: [],
}
