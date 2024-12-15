import type { Config } from "tailwindcss";

const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...fontFamily.sans],
      },
      colors: {
        first: "#719bff",
        second: "#8eafff",
      },
    },
  },
  plugins: [],
} satisfies Config;
