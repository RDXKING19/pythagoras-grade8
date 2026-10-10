/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '390px',
      sm: '640px',
      md: '768px',
      story: '900px',
      lg: '1024px',
      lab: '1180px',
      nav: '1360px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        display: ['"Fredoka One"', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.35rem' }],
        'sm': ['1rem', { lineHeight: '1.5rem' }],
        'base': ['1.125rem', { lineHeight: '1.7rem' }],
        'lg': ['1.25rem', { lineHeight: '1.8rem' }],
        'xl': ['1.45rem', { lineHeight: '1.95rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.2rem' }],
        '3xl': ['2.15rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.65rem', { lineHeight: '2.9rem' }],
      },
      colors: {
        primary: '#8b5cf6',
        gold: '#facc15',
        wonder: '#c084fc',
        story: '#fb923c',
        simulate: '#38bdf8',
        play: '#4ade80',
        reflect: '#818cf8',
        world0: '#f472b6',
        world1: '#38bdf8',
        world2: '#4ade80',
        world3: '#fb923c',
        world4: '#fbbf24',
        world5: '#2dd4bf',
        world6: '#818cf8',
        world7: '#e879f9',
        world8: '#c084fc',
        world9: '#f43f5e',
      }
    },
  },
  plugins: [],
}
