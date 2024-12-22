/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enables class-based dark mode
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"), // Ensure this is added after installation
    require("@tailwindcss/typography"), // Optional: Only if typography is used
    require("@tailwindcss/aspect-ratio"), // Optional: Only if aspect ratio is used
  ],
};
