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
      },
      colors: {
        brand: {
          50: "#f4fce6",
          100: "#e6f7c8",
          200: "#ccef96",
          300: "#aee35b",
          400: "#93d633",
          500: "#88c34b",
          600: "#6b9e2e",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
          950: "#1a2e0a",
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
