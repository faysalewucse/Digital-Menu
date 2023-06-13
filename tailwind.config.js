/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4088F4",
        navbar: "#071B2F",
        body: "#001e3c",
        secondary: "#0a1929",
      },
    },
  },
  plugins: [],
};
