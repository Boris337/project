module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#020617',
        surface: '#0f172a',
        accent: '#38bdf8',
        accentSoft: '#60a5fa',
        brand: '#7c3aed',
      },
      boxShadow: {
        glow: '0 24px 80px -40px rgba(56, 189, 248, 0.65)',
      },
    },
  },
  plugins: [],
};
