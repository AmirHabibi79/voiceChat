/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {},
  },
  plugins: ["tailwindcss ,autoprefixer"],
};
