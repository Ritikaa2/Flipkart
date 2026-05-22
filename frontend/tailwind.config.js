/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flipkart: {
          blue: '#2874f0',
          lightBlue: '#f0f5ff',
          yellow: '#ffc200',
          orange: '#ff9f00',
          dark: '#212121',
          bg: '#f1f3f6',
          textGray: '#878787',
          green: '#388e3c',
          border: '#e0e0e0'
        }
      },
      boxShadow: {
        flip: '0 2px 4px 0 rgba(0,0,0,.08)',
        modal: '0 4px 16px 0 rgba(0,0,0,.2)'
      }
    },
  },
  plugins: [],
}
