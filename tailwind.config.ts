

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#005BFF",
        "text-secondary": "#646464",
        "text-black": "#0F0F0F",
        "bg-primary":"#F9F9F9"
      },
      container: {
        screens: {
          DEFAULT: "1440px",
        },
        center: true,
        padding: "1.2rem",
      },
      screens: {
        xs: "540px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        rubik: ['var(--font-rubik)', 'sans-serif'],
      },
    },
  },

  plugins: [],
} satisfies Config;
