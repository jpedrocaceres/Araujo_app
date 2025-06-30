/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/App.{js,ts,tsx}',
    './src/components/**/*.{js,ts,tsx}',
    './src/screens/**/*.{js,ts,tsx}',
    './src/navigation/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
