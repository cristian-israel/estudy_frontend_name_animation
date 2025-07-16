import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)", ...fontFamily.sans],
        quicksand: ["var(--font-quicksand)", ...fontFamily.sans],
        comfortaa: ["var(--font-comfortaa)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
