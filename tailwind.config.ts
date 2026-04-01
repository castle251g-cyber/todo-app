import type { Config } from "tailwindcss";
import path from "path";

const config: Config = {
  content: [
    path.join(__dirname, "src/**/*.{js,ts,jsx,tsx,mdx}"),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans JP'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
