/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f7a78',
        'primary-dark': '#0b5f5d',
        accent: '#00c28b',
        teal: '#0f7a78',
        secondary: '#1e8f86',
        background: '#f5fbfb',
        dark: '#083233',
        card: '#ffffff',
        text: '#083233',
        inputBg: '#eaf8f6',
        inputBorder: '#cfeee9',
        muted: '#6b7280'
      }
    }
  },
  plugins: [],
}
