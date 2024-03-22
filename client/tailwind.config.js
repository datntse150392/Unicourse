/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    color: {
      buttonWarning: "f1b300",
    },
    text: {
      customColor: "#1F1C14",
    },
    fontFamily: {
      customFont: ["system-ui", "Roboto", "Helvetica", "Arial", "sans-serif"],
    },
    screens: {
      // customize1: { min: "1287px", max: "1399px" },
      // // => @media (min-width: 1287px and max-width: 1399px) { ... }

      // customize2: { min: "1400px", max: "1499px" },
      // // => @media (min-width: 1400px and max-width: 1499px) { ... }

      // customize3: { min: "1500px" },
      // => @media (min-width: 1500px) { ... }
    },
  },
  plugins: [],
};
