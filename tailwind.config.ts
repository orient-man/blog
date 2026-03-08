import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
        pixel: ["var(--font-pixel)", "monospace"],
        terminal: ["var(--font-terminal)", "monospace"],
      },
      colors: {
        brand: {
          50: "#fef9eb",
          100: "#fcefc5",
          200: "#f9dc87",
          300: "#f5c549",
          400: "#f0b020",
          500: "#d4940a",
          600: "#b87a08",
          700: "#8f5d0a",
          800: "#764b0e",
          900: "#633e12",
          950: "#3a2006",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
