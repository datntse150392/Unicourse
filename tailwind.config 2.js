/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js", // add this line
  ],
  theme: {
    extend: {},
    colors: { // Custom cho chế độ gradient
      'custom-900': '#0099FF',
      'custom-800': '#25A8FF',
      'custom-700': '#51B4F6',
      'custom-600': '#65BFFA',
      'custom-500': '#97D5FE',
      'custom-400': '#A7DCFE',
      'custom-300': '#B3E0FF',
      'custom-200': '#C8E8FF',
      'custom-100': '#D8EFFF',
    },
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
  plugins: [
    require("flowbite/plugin"), // add this line
  ],
};
