import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, #192236 0deg, #131B2E 180deg, #030A1A 360deg)",
      },
    },
  },
  plugins: [],
};
export default config;
