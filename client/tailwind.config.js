/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    color: {
      buttonWarning: 'f1b300'
    },
    text: {
      customColor: '#1F1C14'
    },
    fontFamily: {
      customFont: ['system-ui', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
    }
  },
  plugins: [],
}